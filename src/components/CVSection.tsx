export default function CVSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-8 sm:mb-10">
      <h2 className="text-base sm:text-lg font-heading font-normal text-text-primary mb-1">
        {title}
      </h2>
      <div className="h-px w-full bg-surface-300 mb-4" />
      {children}
    </section>
  );
}
