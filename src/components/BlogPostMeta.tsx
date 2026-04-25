import BlogTagList from "./BlogTagList";

function formatDate(dateStr: string): string {
  const d = new Date(`${dateStr}T00:00:00Z`);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

export default function BlogPostMeta({
  date,
  readingTime,
  tags,
}: {
  date: string;
  readingTime: number;
  tags: string[];
}) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-text-muted mb-6">
      <time className="font-mono tabular-nums" dateTime={date}>
        {formatDate(date)}
      </time>
      <span aria-hidden="true">&middot;</span>
      <span className="font-mono tabular-nums">
        {readingTime} min read
      </span>
      {tags.length > 0 && (
        <>
          <span aria-hidden="true">&middot;</span>
          <BlogTagList tags={tags} />
        </>
      )}
    </div>
  );
}
