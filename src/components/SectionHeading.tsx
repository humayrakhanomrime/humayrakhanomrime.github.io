export default function SectionHeading({
  title,
  id,
}: {
  title: string;
  id?: string;
}) {
  return (
    <div className="mb-5 sm:mb-6">
      <h2
        id={id}
        className="text-lg sm:text-xl font-heading font-normal text-text-primary"
      >
        {title}
      </h2>
      <div className="mt-2 h-px w-full bg-surface-300" />
    </div>
  );
}
