export default function BlogTagList({ tags }: { tags: string[] }) {
  if (tags.length === 0) return null;
  return (
    <ul className="flex flex-wrap gap-1.5 list-none p-0 m-0">
      {tags.map((tag) => (
        <li
          key={tag}
          className="text-[11px] font-mono px-2 py-0.5 rounded bg-surface-200 text-text-secondary border border-surface-300"
        >
          {tag}
        </li>
      ))}
    </ul>
  );
}
