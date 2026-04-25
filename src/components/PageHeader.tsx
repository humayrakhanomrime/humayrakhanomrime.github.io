export default function PageHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mt-4 sm:mt-6 mb-6 sm:mb-8">
      <h1 className="text-xl sm:text-2xl lg:text-3xl font-heading font-normal text-text-primary leading-tight">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-1 text-text-secondary text-sm">{subtitle}</p>
      )}
    </div>
  );
}
