export function ProjectLabel({ title }: { title: string }) {
  return (
    <p className="overflow-hidden pt-[.35em] text-ellipsis whitespace-nowrap uppercase transition-colors duration-300 group-hover:text-accent group-focus-visible:text-accent">
      {title}
    </p>
  );
}
