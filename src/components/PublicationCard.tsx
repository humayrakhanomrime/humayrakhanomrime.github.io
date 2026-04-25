import type { Publication } from "@/types";
import { AUTHOR_HIGHLIGHT_NAME } from "@/lib/constants";
import BibTexBlock from "@/components/BibTexBlock";

export default function PublicationCard({ pub }: { pub: Publication }) {
  return (
    <article
      id={pub.id}
      className="py-4 sm:py-5 border-b border-surface-300 last:border-b-0"
      aria-labelledby={`${pub.id}-title`}
    >
      <div className="flex items-center gap-2 mb-2 flex-wrap">
        <span
          className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full text-white"
          style={{ backgroundColor: pub.venueColor }}
        >
          {pub.venueAbbr}
        </span>
        {pub.selected && (
          <span className="text-[11px] font-mono px-2 py-0.5 rounded-full border border-accent text-accent">
            Selected
          </span>
        )}
        {pub.annotation && (
          <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-surface-200 text-text-muted">
            {pub.annotation}
          </span>
        )}
      </div>
      <h3
        id={`${pub.id}-title`}
        className="text-sm sm:text-[15px] font-semibold text-text-primary leading-snug break-words"
      >
        {pub.title}
      </h3>
      <p className="text-xs text-text-secondary mt-1.5 break-words">
        <span className="sr-only">Authors: </span>
        {pub.authors.map((a, i) => (
          <span key={i}>
            {a === AUTHOR_HIGHLIGHT_NAME ? (
              <strong className="text-text-primary font-semibold">{a}</strong>
            ) : (
              a
            )}
            {i < pub.authors.length - 1 && ", "}
          </span>
        ))}
      </p>
      <p className="text-xs text-text-muted mt-1 break-words">
        <cite className="not-italic">{pub.venue}</cite>
        {", "}
        <time dateTime={String(pub.year)}>{pub.year}</time>
      </p>
      {pub.bibtex && <BibTexBlock bibtex={pub.bibtex} />}
    </article>
  );
}
