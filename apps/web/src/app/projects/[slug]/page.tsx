import type { Metadata } from "next";
import Link from "next/link";
import { Card, SectionHeader } from "@/components/technical/Sections";

// This would normally come from a CMS or database
// For now, we'll define the project data here
type ProjectDetails = {
  slug: string;
  title: string;
  description: string;
  url?: string;
  image?: string;
  accentColor?: string;
  overview: string;
  stack: { category: string; items: string[] }[];
  architecture?: {
    title: string;
    description: string;
    components?: { name: string; description: string }[];
  };
  highlights: string[];
  challenges?: { title: string; solution: string }[];
  metrics?: { label: string; value: string }[];
};

const projectsData: Record<string, ProjectDetails> = {
  "mobi-measure": {
    slug: "mobi-measure",
    title: "Mobi Measure",
    description: "An image metrology platform made specifically for measurements on semiconductor images",
    url: "https://mobi-measure.com",
    image: "/mobi-measure.png",
    accentColor: "#D9A16A",
    overview:
      "Mobi Measure is a SaaS platform that provides precision measurement tools for semiconductor imaging. Built to handle high-resolution microscopy images with sub-pixel accuracy.",
    stack: [
      { category: "Frontend", items: ["React", "TypeScript", "Next.js", "Tailwind CSS"] },
      { category: "Backend", items: ["Node.js", "Express", "PostgreSQL"] },
      { category: "Image Processing", items: ["Sharp", "Canvas API", "WebGL"] },
      { category: "Infrastructure", items: ["AWS", "Docker", "GitHub Actions"] },
    ],
    architecture: {
      title: "System Architecture",
      description:
        "Client-side image processing with server-side persistence and collaboration features.",
      components: [
        {
          name: "Image Viewer",
          description: "High-performance canvas-based viewer supporting pan, zoom, and annotations",
        },
        {
          name: "Measurement Engine",
          description: "Sub-pixel precision measurement algorithms with calibration support",
        },
        {
          name: "Collaboration Layer",
          description: "Real-time sharing and commenting on measurements",
        },
      ],
    },
    highlights: [
      "Sub-pixel measurement accuracy using advanced interpolation algorithms",
      "Support for images up to 100+ megapixels with tiled rendering",
      "Real-time collaboration features for team measurements",
      "Export to industry-standard formats (CSV, JSON, PDF reports)",
      "Calibration support for converting pixels to real-world units",
    ],
    challenges: [
      {
        title: "Performance with Large Images",
        solution:
          "Implemented tiled rendering and progressive loading to handle 100+ megapixel images smoothly in the browser",
      },
      {
        title: "Sub-Pixel Accuracy",
        solution:
          "Developed custom interpolation algorithms that achieve measurement precision beyond pixel resolution",
      },
    ],
  },
  portfolio: {
    slug: "portfolio",
    title: "Daniel Yi Portfolio Website",
    description: "A full-stack portfolio demonstrating technical and design execution",
    url: "https://da.nielyi.com",
    image: "/hero1.webp",
    overview:
      "This portfolio site showcases full-stack development skills through a modern, performant web application deployed on AWS infrastructure. Built to demonstrate both technical depth and product taste.",
    stack: [
      { category: "Frontend", items: ["React 18", "Next.js 15", "TypeScript", "Tailwind v4"] },
      { category: "Backend", items: ["AWS Lambda", "API Gateway", "DynamoDB", "SES"] },
      {
        category: "Infrastructure",
        items: ["AWS CDK", "CloudFront", "S3", "Route 53", "GitHub Actions"],
      },
      { category: "Special Features", items: ["SwiftLaTeX WASM", "MDX", "LaTeX Parser"] },
    ],
    architecture: {
      title: "Serverless Architecture",
      description:
        "Static-first architecture with serverless API endpoints, optimized for free-tier deployment.",
      components: [
        {
          name: "Static Frontend",
          description: "Next.js static export hosted on S3, distributed via CloudFront CDN with OAC",
        },
        {
          name: "API Layer",
          description: "HTTP API Gateway + Lambda functions for contact form and health checks",
        },
        {
          name: "Data Layer",
          description: "DynamoDB for form submissions, SES for email notifications",
        },
        {
          name: "CI/CD Pipeline",
          description: "GitHub Actions with OIDC for secure, automated deployments",
        },
      ],
    },
    highlights: [
      "Complete infrastructure as code using AWS CDK (TypeScript)",
      "Automated CI/CD pipeline with preview deployments",
      "Browser-based LaTeX compilation using WebAssembly",
      "Custom LaTeX parser for structured resume rendering",
      "Performance-optimized with code splitting and lazy loading",
      "Fully accessible (WCAG AA) with keyboard navigation support",
      "Zero idle costs on AWS free tier",
    ],
    challenges: [
      {
        title: "LaTeX in the Browser",
        solution:
          "Integrated SwiftLaTeX WASM engine to compile LaTeX documents entirely client-side, with custom parsing for structured HTML rendering",
      },
      {
        title: "Cost Optimization",
        solution:
          "Designed entirely within AWS free tier using serverless architecture, static hosting, and minimal dependencies",
      },
    ],
    metrics: [
      { label: "Lighthouse Performance", value: "95+" },
      { label: "First Contentful Paint", value: "< 1.2s" },
      { label: "AWS Monthly Cost", value: "$0 (free tier)" },
      { label: "Build Time", value: "< 45s" },
    ],
  },
};

export async function generateStaticParams() {
  return Object.keys(projectsData).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projectsData[slug];
  if (!project) {
    return { title: "Project Not Found" };
  }
  return {
    title: project.title,
    description: project.description,
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projectsData[slug];

  if (!project) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-20">
        <h1 className="display-serif text-4xl">Project Not Found</h1>
        <p className="mt-4 text-black/70">
          <Link href="/projects" className="underline">
            ← Back to Projects
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/projects"
          className="inline-flex items-center gap-1 text-sm text-black/70 hover:text-black transition mb-4"
        >
          <span>←</span>
          <span>Back to Projects</span>
        </Link>
        {project.accentColor && (
          <div className="h-1 w-24 mb-4 rounded-full" style={{ background: project.accentColor }} />
        )}
        <h1 className="display-serif text-4xl tracking-[-0.01em]">{project.title}</h1>
        <p className="mt-2 text-lg text-black/70 dark:text-white/70 max-w-2xl">
          {project.description}
        </p>
        {project.url && (
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-4 text-sm font-medium border border-black/20 px-4 py-2 rounded-full hover:bg-black/5 transition"
          >
            <span>Visit Site</span>
            <span>↗</span>
          </a>
        )}
      </div>

      {/* Hero Image */}
      {project.image && (
        <div className="mb-12 rounded-2xl overflow-hidden border border-black/10">
          <img src={project.image} alt={project.title} className="w-full h-auto" loading="eager" />
        </div>
      )}

      {/* Overview */}
      <section className="mb-12">
        <h2 className="display-serif text-3xl tracking-[-0.01em] mb-4">Overview</h2>
        <p className="text-black/80 dark:text-white/80 leading-relaxed">{project.overview}</p>
      </section>

      {/* Tech Stack */}
      <section className="mb-12">
        <h2 className="display-serif text-3xl tracking-[-0.01em] mb-4">Tech Stack</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {project.stack.map((category) => (
            <Card key={category.category}>
              <SectionHeader title={category.category} />
              <ul className="mt-2 space-y-1">
                {category.items.map((item) => (
                  <li key={item} className="text-sm text-black/70">
                    • {item}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </section>

      {/* Architecture */}
      {project.architecture && (
        <section className="mb-12">
          <h2 className="display-serif text-3xl tracking-[-0.01em] mb-4">
            {project.architecture.title}
          </h2>
          <p className="text-black/70 mb-6">{project.architecture.description}</p>
          {project.architecture.components && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {project.architecture.components.map((component) => (
                <Card key={component.name}>
                  <h3 className="font-semibold text-lg mb-2">{component.name}</h3>
                  <p className="text-sm text-black/70">{component.description}</p>
                </Card>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Highlights */}
      {project.highlights && project.highlights.length > 0 && (
        <section className="mb-12">
          <h2 className="display-serif text-3xl tracking-[-0.01em] mb-4">Key Features</h2>
          <Card>
            <ul className="space-y-2">
              {project.highlights.map((highlight, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="text-green-600 mt-1">✓</span>
                  <span className="text-sm text-black/80">{highlight}</span>
                </li>
              ))}
            </ul>
          </Card>
        </section>
      )}

      {/* Challenges */}
      {project.challenges && project.challenges.length > 0 && (
        <section className="mb-12">
          <h2 className="display-serif text-3xl tracking-[-0.01em] mb-4">
            Technical Challenges & Solutions
          </h2>
          <div className="space-y-5">
            {project.challenges.map((challenge, idx) => (
              <Card key={idx}>
                <h3 className="font-semibold text-lg mb-2">{challenge.title}</h3>
                <p className="text-sm text-black/70">{challenge.solution}</p>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Metrics */}
      {project.metrics && project.metrics.length > 0 && (
        <section className="mb-12">
          <h2 className="display-serif text-3xl tracking-[-0.01em] mb-4">Performance Metrics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {project.metrics.map((metric) => (
              <Card key={metric.label}>
                <div className="text-2xl font-bold mb-1">{metric.value}</div>
                <div className="text-xs text-black/60 uppercase tracking-wide">{metric.label}</div>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

