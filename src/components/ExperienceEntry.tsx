import Image from "next/image";
import type { Experience } from "@/types";

export default function ExperienceEntry({ exp }: { exp: Experience }) {
  const logoNode = exp.logo ? (
    <Image
      src={exp.logo}
      alt={`${exp.company} logo`}
      width={56}
      height={56}
      className="max-w-[80%] max-h-[80%] object-contain"
      loading="lazy"
    />
  ) : null;

  return (
    <div className="mb-6 last:mb-0 flex gap-3 sm:gap-4">
      {exp.logo && (
        exp.url ? (
          <a
            href={exp.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={exp.company}
            className="shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-md bg-surface-100 border border-surface-300 flex items-center justify-center overflow-hidden"
          >
            {logoNode}
          </a>
        ) : (
          <div
            aria-hidden="true"
            className="shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-md bg-surface-100 border border-surface-300 flex items-center justify-center overflow-hidden"
          >
            {logoNode}
          </div>
        )
      )}
      <div className="min-w-0 flex-1">
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-0.5 sm:gap-3 mb-1">
          <h3 className="text-sm font-semibold text-text-primary break-words min-w-0">
            {exp.position}
          </h3>
          <span className="text-xs text-text-muted font-mono shrink-0">
            {exp.startDate} &ndash; {exp.endDate}
          </span>
        </div>
        <p className="text-xs text-accent mb-1.5 break-words">
          {exp.company} &middot; {exp.location}
        </p>
        <ul className="space-y-1">
          {exp.highlights.map((h, i) => (
            <li
              key={i}
              className="text-xs text-text-secondary flex items-start gap-2 break-words"
            >
              <span className="text-text-muted mt-0.5 shrink-0">&bull;</span>
              <span className="min-w-0">{h}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
