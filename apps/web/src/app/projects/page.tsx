import type { Metadata } from "next";
import { ProjectsGrid } from "@/components/projects/ProjectsGrid";
import type { ProjectItem } from "@/components/projects/ProjectCard";

export const metadata: Metadata = {
  title: "Projects",
  description: "Selected projects — concise, design-forward, and fast.",
};

export default function ProjectsPage() {
  const projects: ProjectItem[] = [
    {
      title: "Mobi Measure",
      href: "https://mobi-measure.com",
      excerpt: "Current project: Mobi Measure - an image metrology platform made specifically for measurements on semiconductor images.",
      image: "/mobi-measure.jpg",
      tags: ["startup", "SaaS",],
      featured: true,
      accentColor: "#D9A16A"
    },
    {
      title: "Daniel Yi Portfolio Website",
      href: "/technical",
      excerpt: "This very site: Next.js static export, AWS CDK, API Gateway + Lambda.",
      tags: ["React","Next.js", "AWS", "CDK"],
      image: "/hero-background.jpg",
   
      
    },
    {
      title: "DJ GRILL",
      href: "https://djgrill.house",
      excerpt: "Simple static site to host my DJ/Photography information.",
      tags: ["music", "DJ", "react"],
    },

  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-20">
      <header className="mb-8">
        <h1 className="display-serif text-4xl tracking-[-0.01em]">Projects</h1>
        <p className="mt-2 text-black/70 dark:text-white/70 max-w-2xl">
          A concise selection of work. Cards are links; keyboard and reduced motion supported.
        </p>
      </header>
      <ProjectsGrid items={projects} />
    </div>
  );
}


