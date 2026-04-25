import type { ResearchInterest } from "@/types";

export default function ResearchInterests({
  interests,
}: {
  interests: ResearchInterest[];
}) {
  return (
    <div className="space-y-2">
      {interests.map((item) => (
        <div key={item.title} className="flex items-baseline gap-2">
          <span className="text-accent text-xs shrink-0" aria-hidden="true">
            &#9654;
          </span>
          <div className="min-w-0">
            <span className="font-medium text-text-primary text-sm break-words">
              {item.title}
            </span>
            <span className="text-text-secondary text-sm break-words">
              {" "}
              &mdash; {item.description}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
