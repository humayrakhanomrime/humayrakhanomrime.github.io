import { readdir, readFile, rename, stat, writeFile } from "node:fs/promises";
import { join } from "node:path";

const outDir = new URL("../out/", import.meta.url);
const renames = [["opengraph-image", "opengraph-image.png"]];

async function exists(path) {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

async function renameAsset(oldName, newName) {
  const src = new URL(oldName, outDir);
  const dst = new URL(newName, outDir);
  if (!(await exists(src))) return false;
  if (await exists(dst)) return true;
  await rename(src, dst);
  return true;
}

async function* walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walk(path);
    } else if (entry.isFile()) {
      yield path;
    }
  }
}

function patternsFor(oldName) {
  return [
    new RegExp(`/${oldName}([?"'&])`, "g"),
    new RegExp(`%2F${oldName}([?"'&])`, "gi"),
  ];
}

async function patchFile(path, replacements) {
  const original = await readFile(path, "utf8");
  let updated = original;
  for (const { patterns, replacement } of replacements) {
    for (const pattern of patterns) {
      updated = updated.replace(pattern, `${replacement}$1`);
    }
  }
  if (updated !== original) {
    await writeFile(path, updated, "utf8");
    return true;
  }
  return false;
}

async function main() {
  for (const [oldName, newName] of renames) {
    const ok = await renameAsset(oldName, newName);
    if (!ok) {
      console.warn(`[postbuild-seo] missing ${oldName}, skipping`);
    }
  }

  const replacements = renames.map(([oldName, newName]) => ({
    patterns: patternsFor(oldName),
    replacement: `/${newName}`,
  }));

  const textExtensions = new Set([".html", ".txt", ".xml", ".webmanifest"]);
  let touched = 0;
  const outPath = new URL("../out", import.meta.url).pathname;
  for await (const path of walk(outPath)) {
    const ext = path.slice(path.lastIndexOf("."));
    if (!textExtensions.has(ext)) continue;
    const didChange = await patchFile(path, replacements);
    if (didChange) touched += 1;
  }
  console.log(`[postbuild-seo] patched ${touched} file(s)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
