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
      image: "/mobi-measure.png",
      tags: ["startup", "SaaS"],
      featured: true,
      accentColor: "#D9A16A",
      detailsSlug: "mobi-measure",
      techDetails: {
        stack: ["React", "TypeScript", "Next.js", "Node.js", "PostgreSQL", "AWS"],
        architecture:
          "Client-side image processing with server-side persistence. High-performance canvas-based viewer with sub-pixel measurement precision.",
        highlights: [
          "Sub-pixel measurement accuracy",
          "Support for 100+ megapixel images",
          "Real-time collaboration features",
          "Industry-standard export formats",
        ],
      },
    },
    {
      title: "Daniel Yi Portfolio Website",
      href: "https://da.nielyi.com",
      excerpt: "This very site: Next.js static export, AWS CDK, API Gateway + Lambda.",
      tags: ["React", "Next.js", "AWS", "CDK"],
      image: "/hero1.webp",
      detailsSlug: "portfolio",
      techDetails: {
        stack: ["React 18", "Next.js 15", "TypeScript", "Tailwind v4", "AWS CDK", "Lambda"],
        architecture:
          "Serverless architecture with static frontend on S3/CloudFront, API Gateway + Lambda for backend, DynamoDB for data.",
        highlights: [
          "Complete infrastructure as code",
          "Browser-based LaTeX compilation (WASM)",
          "Zero idle costs on AWS free tier",
          "Automated CI/CD with GitHub Actions",
        ],
      },
    },
    {
      title: "DJ GRILL",
      href: "https://djgrill.house",
      excerpt: "Simple static site to host my DJ/Photography information.",
      tags: ["music", "DJ", "react"],
      image: "/hero-dj.webp",
      techDetails: {
        stack: ["React", "Vite", "Tailwind CSS"],
        architecture: "Static site with minimal dependencies, optimized for fast loading.",
        highlights: ["Minimalist design", "Fast page loads", "Responsive layout"],
      },
    },
    {
      title: "Core Plasma",
      href: "https://coreplasma.org",
      excerpt: "Static site for Core Plasma, a plasma consulting firm for Dr. Won Yi (my dad!).",
      tags: ["react", "consulting"],
      image: "/coreplasma.jpg",
      techDetails: {
        stack: ["React", "Next.js", "Tailwind CSS"],
        architecture: "Static export with contact form integration.",
        highlights: ["Clean, professional design", "SEO optimized", "Contact form integration"],
      },
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


