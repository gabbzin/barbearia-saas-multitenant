export default function HeaderTitle({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <h1 className={`font-bold text-xl ${className}`}>{children}</h1>;
}
