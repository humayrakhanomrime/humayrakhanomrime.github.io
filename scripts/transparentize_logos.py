#!/usr/bin/env python3
"""Convert logo files in public/logos/ to transparent RGBA PNGs.

For each input logo, the script:
  1. Loads it as RGBA.
  2. Samples the four corner pixels and flood-fills from each corner
     with a configurable colour tolerance.
  3. Replaces the flood-filled region's alpha with 0.
  4. Writes the result back as a PNG (same basename, `.png` extension).

Run from repo root:
    python3 scripts/transparentize_logos.py
"""
from __future__ import annotations

from pathlib import Path
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parent.parent
LOGOS_DIR = ROOT / "public" / "logos"

SENTINEL = (255, 0, 255, 255)
TOLERANCE = 32
MAX_DIMENSION = 512


def transparentize(src: Path, dst: Path, tolerance: int = TOLERANCE) -> None:
    img = Image.open(src).convert("RGBA")
    if max(img.size) > MAX_DIMENSION:
        img.thumbnail((MAX_DIMENSION, MAX_DIMENSION), Image.LANCZOS)
    w, h = img.size
    corners = [(0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1)]

    for corner in corners:
        ImageDraw.floodfill(
            img,
            xy=corner,
            value=SENTINEL,
            thresh=tolerance,
        )

    pixels = img.load()
    for y in range(h):
        for x in range(w):
            r, g, b, _ = pixels[x, y]
            if (r, g, b) == SENTINEL[:3]:
                pixels[x, y] = (0, 0, 0, 0)

    dst.parent.mkdir(parents=True, exist_ok=True)
    img.save(dst, format="PNG", optimize=True)


def main() -> None:
    if not LOGOS_DIR.is_dir():
        raise SystemExit(f"Logos directory not found: {LOGOS_DIR}")

    converted: list[tuple[Path, Path]] = []
    for src in sorted(LOGOS_DIR.iterdir()):
        if src.suffix.lower() not in {".png", ".jpg", ".jpeg", ".webp"}:
            continue
        dst = src.with_suffix(".png")
        transparentize(src, dst)
        if src != dst and src.exists():
            src.unlink()
        converted.append((src, dst))

    for src, dst in converted:
        rel = dst.relative_to(ROOT)
        marker = "" if src == dst else f"  (was {src.name})"
        print(f"  -> {rel}{marker}")


if __name__ == "__main__":
    main()
