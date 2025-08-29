import { ProjectCard, type ProjectItem } from "./ProjectCard";

export function ProjectsGrid({ items }: { items: ProjectItem[] }) {
  if (!items || items.length === 0) {
    return (
      <div className="text-sm text-black/70 dark:text-white/70">
        No projects yet.
      </div>
    );
  }

  const featured = items.find((p) => p.featured);
  const rest = items.filter((p) => p !== featured);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {featured && (
        <div className="md:col-span-2">
          <ProjectCard item={featured} variant="featured" />
        </div>
      )}
      {rest.map((p) => (
        <ProjectCard key={p.href} item={p} />
      ))}
    </div>
  );
}


