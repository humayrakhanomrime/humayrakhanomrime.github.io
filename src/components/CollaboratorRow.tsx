import type { Collaborator } from "@/types";

export default function CollaboratorRow({
  collab,
}: {
  collab: Collaborator;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-0.5 sm:gap-3 py-1.5">
      <span className="text-sm text-text-primary break-words min-w-0">
        {collab.name}
      </span>
      <span className="text-xs text-text-muted break-words sm:text-right">
        {collab.institution}
      </span>
    </div>
  );
}
