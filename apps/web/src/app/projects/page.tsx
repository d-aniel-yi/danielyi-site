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
      excerpt: "DJ services website with booking, music mixes, and event information.",
      tags: ["music", "DJ", "Next.js"],
      image: "/hero-dj.webp",
      detailsSlug: "djgrill",
      techDetails: {
        stack: ["React", "Next.js 14", "Tailwind CSS", "Framer Motion"],
        architecture: "Next.js static export hosted on Bluehost. Clean separation between DJ services and photography portfolio.",
        highlights: ["Smooth animations with Framer Motion", "Responsive design", "Square payment integration", "Video backgrounds"],
      },
    },
    {
      title: "DJ GRILL Photography",
      href: "https://djgrill.house/photography",
      excerpt: "Professional photography portfolio powered by Sanity CMS with real-time updates.",
      tags: ["photography", "Sanity CMS", "JAMstack"],
      image: "/photographyhero.webp",
      detailsSlug: "djgrill-photography",
      techDetails: {
        stack: ["Next.js 14", "Sanity.io", "TypeScript", "Tailwind CSS"],
        architecture: "Hybrid architecture: static HTML with client-side data fetching from Sanity CMS for instant content updates without rebuilds.",
        highlights: ["Real-time portfolio updates (no rebuild needed)", "Headless CMS integration", "Lightbox photo viewer", "Album organization"],
      },
    },
    {
      title: "Crypto Tip Jar Smart Contract",
      href: "https://djgrill.house/crypto-tip",
      excerpt: "Full-stack Web3 tip jar with soulbound NFT badges. Live on Base L2 with 99.8% lower gas costs.",
      tags: ["Web3", "Solidity", "NFTs", "Base L2"],
      image: "/nft.png",
      detailsSlug: "crypto-tipjar",
      techDetails: {
        stack: ["Solidity", "Wagmi", "Viem", "RainbowKit", "IPFS", "Base L2"],
        architecture: "ERC-1155 smart contract on Base L2 with programmatically generated SVG NFT badges. Client-side Web3 integration, no backend required.",
        highlights: ["$0.01 per transaction (99.8% cheaper than Ethereum)", "30 unique soulbound NFT badges", "100% test coverage", "IPFS decentralized storage"],
      },
    },
    {
      title: "Core Plasma",
      href: "https://coreplasma.org",
      excerpt: "Static site for Core Plasma, a plasma consulting firm for Dr. Won Yi (my dad!).",
      tags: ["consulting", "Next.js"],
      image: "/coreplasma.jpg",
      detailsSlug: "coreplasma",
      techDetails: {
        stack: ["React", "Next.js", "Tailwind CSS"],
        architecture: "Static export with contact form integration. Professional design for scientific consulting services.",
        highlights: ["Clean, professional design", "SEO optimized", "Contact form integration", "Technical credibility for scientific audience"],
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


