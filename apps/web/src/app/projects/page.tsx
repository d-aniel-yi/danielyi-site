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
      title: "AE Resume Site",
      href: "/technical",
      excerpt: "This very site: Next.js static export, AWS CDK, API Gateway + Lambda.",
      tags: ["Next.js", "AWS", "CDK"],
      image: "/hero-background.jpg",
      accentColor: "#7c3aed",
      featured: true,
    },
    {
      title: "Tech Sales Showcase",
      href: "/case-studies",
      excerpt: "Design-forward demo for technical storytelling and discovery.",
      tags: ["Storytelling", "UX"],
    },
    {
      title: "Contact Form Backend",
      href: "/technical",
      excerpt: "Serverless API with validation, DynamoDB, and SES notifications.",
      tags: ["API", "Lambda", "DynamoDB"],
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


