import Link from "next/link";
import type { BlogPostMeta } from "@/types";
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

export default function BlogPostCard({ post }: { post: BlogPostMeta }) {
  return (
    <article id={post.slug} aria-labelledby={`${post.slug}-title`}>
      <Link
        href={`/blog/${post.slug}`}
        className="block card-bg p-4 sm:p-5 rounded border border-surface-300 bg-surface-100 transition-colors hover:border-accent"
      >
        <div className="flex items-baseline gap-x-3 text-xs text-text-muted mb-2">
          <time className="font-mono tabular-nums" dateTime={post.date}>
            {formatDate(post.date)}
          </time>
          <span aria-hidden="true">&middot;</span>
          <span className="font-mono tabular-nums">
            {post.readingTime} min read
          </span>
        </div>
        <h3
          id={`${post.slug}-title`}
          className="text-sm sm:text-base font-heading font-medium text-text-primary break-words"
        >
          {post.title}
        </h3>
        <p className="text-sm text-text-secondary leading-relaxed mt-2 break-words">
          {post.description}
        </p>
        {post.tags.length > 0 && (
          <div className="mt-3">
            <BlogTagList tags={post.tags} />
          </div>
        )}
      </Link>
    </article>
  );
}
