import type { Project } from "@/types";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <article
      id={project.id}
      className="card-bg p-4 sm:p-5 rounded border border-surface-300 bg-surface-100"
      aria-labelledby={`${project.id}-title`}
    >
      <div className="flex items-center gap-2 sm:gap-3 mb-2 flex-wrap">
        <h3
          id={`${project.id}-title`}
          className="text-sm sm:text-base font-heading font-medium text-text-primary break-words"
        >
          {project.title}
        </h3>
        {project.isOpenSource && (
          <span
            className="text-xs text-accent flex items-center gap-1.5 shrink-0"
            aria-label="Open source project on GitHub"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.4 3-.405 1.02.005 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
            </svg>
            {project.stars && <span>{project.stars}+ stars</span>}
          </span>
        )}
      </div>
      <p className="text-xs text-text-muted mb-3 break-words">
        {project.subtitle}
      </p>
      <p className="text-sm text-text-secondary leading-relaxed mb-4 break-words">
        {project.description}
      </p>
      <div className="mb-4">
        <p className="text-xs font-medium text-text-primary mb-2">
          Key Contributions
        </p>
        <ul className="space-y-1">
          {project.contributions.map((c, i) => (
            <li
              key={i}
              className="text-xs text-text-secondary flex items-start gap-2 break-words"
            >
              <span className="text-accent mt-0.5 shrink-0" aria-hidden="true">
                &bull;
              </span>
              <span className="min-w-0">{c}</span>
            </li>
          ))}
        </ul>
      </div>
      {project.links && (
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {project.links.code && (
            <a
              href={project.links.code}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${project.title} source code on GitHub`}
              className="text-xs text-white bg-accent px-3 py-1.5 rounded hover:opacity-90 transition-opacity"
            >
              Code
            </a>
          )}
          {project.links.paper && (
            <a
              href={project.links.paper}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${project.title} research paper`}
              className="text-xs text-white bg-accent px-3 py-1.5 rounded hover:opacity-90 transition-opacity"
            >
              Paper
            </a>
          )}
        </div>
      )}
    </article>
  );
}
