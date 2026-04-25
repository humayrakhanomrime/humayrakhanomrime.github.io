"use client";

import { useState } from "react";

export default function BibTexBlock({ bibtex }: { bibtex: string }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(bibtex);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="mt-2">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="text-[11px] font-mono px-2 py-0.5 rounded-full border border-surface-300 text-text-muted hover:text-accent hover:border-accent transition-colors"
      >
        {open ? "Hide BibTeX" : "BibTeX"}
      </button>
      {open && (
        <div className="mt-2 relative">
          <pre className="text-[11px] font-mono bg-surface-200 text-text-secondary p-3 pr-16 rounded-md overflow-x-auto whitespace-pre">
            {bibtex}
          </pre>
          <button
            type="button"
            onClick={copy}
            className="absolute top-2 right-2 text-[10px] font-mono px-2 py-0.5 rounded-sm border border-surface-300 bg-surface-100 text-text-muted hover:text-accent hover:border-accent transition-colors"
          >
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      )}
    </div>
  );
}
