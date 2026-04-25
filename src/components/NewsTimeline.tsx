import type { NewsItem } from "@/types";

function formatDate(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export default function NewsTimeline({ items }: { items: NewsItem[] }) {
  return (
    <ol className="list-none p-0 space-y-1.5">
      {items.map((item, i) => (
        <li key={i} className="flex items-baseline gap-3 text-sm">
          <time
            className="text-xs text-text-primary font-mono font-bold shrink-0 tabular-nums"
            dateTime={item.date}
          >
            {formatDate(item.date)}
          </time>
          <p
            className="text-text-secondary min-w-0 flex-1 truncate"
            title={item.content}
          >
            {item.content}
          </p>
        </li>
      ))}
    </ol>
  );
}
