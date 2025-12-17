"use client";

import { motion } from "framer-motion";
import { ProjectCard, type ProjectItem } from "@/components/projects/ProjectCard";

export default function ProjectsPage() {
  const featuredProjects: ProjectItem[] = [
    {
      title: "Flat Fee RE",
      href: "/projects/fsbo",
      excerpt: "A production-grade real estate platform handling complex legal compliance. Features a custom-built Google Maps normalization engine, a 13-page conditional logic state machine, and an automated PDF generation pipeline that maps user data to government forms.",
      image: "/fsbo-hero.png",
      tags: ["Database", "Next.js", "Google Maps"],
      featured: true,
      accentColor: "#3b82f6",
      detailsSlug: "fsbo", // Points to interactive demo
      techDetails: {
        stack: ["Next.js", "PostgreSQL", "Google Maps API", "React Flow", "pdf-lib"],
        architecture: "Event-driven architecture with normalized address parsing and PDF generation pipeline.",
        highlights: [
          "Real-time address normalization",
          "Complex conditional form logic (13+ pages)",
          "Stable Key database mapping",
          "Automated PDF generation"
        ],
      },
    },
    {
      title: "Mobi Measure",
      href: "https://mobi-measure.com",
      excerpt: "A high-performance image metrology suite for semiconductor analysis. Built with a microservices architecture handling 100+ megapixel images, utilizing WebGL for sub-pixel rendering and Celery for async processing.",
      image: "/mobi-measure.png",
      tags: ["startup", "SaaS"],
      featured: true,
      accentColor: "#D9A16A",
      detailsSlug: "mobi", // Points to interactive demo
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
      excerpt: "A showcase of serverless engineering. This site compiles LaTeX in the browser using WebAssembly, runs on a fully IaC-managed AWS infrastructure (Lambda, DynamoDB, CloudFront), and costs $0/month to operate.",
      image: "/hero1.webp",
      featured: true,
      accentColor: "#8b5cf6",
      detailsSlug: "portfolio", // Points to interactive demo
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
  ];

  const standardProjects: ProjectItem[] = [
    {
      title: "DJ GRILL",
      href: "https://djgrill.house",
      excerpt: "DJ services website with booking, music mixes, and event information.",
      tags: ["music", "DJ", "Next.js"],
      image: "/hero-dj.webp",
      // detailsSlug removed to show "Visit Site"
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
      // detailsSlug removed
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
      // detailsSlug removed
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
      // detailsSlug removed
      techDetails: {
        stack: ["React", "Next.js", "Tailwind CSS"],
        architecture: "Static export with contact form integration. Professional design for scientific consulting services.",
        highlights: ["Clean, professional design", "SEO optimized", "Contact form integration", "Technical credibility for scientific audience"],
      },
    },
  ];

  return (
    <div className="min-h-screen bg-[#fdfbf7] text-[#1a1a1a] selection:bg-[#e0e0e0] relative overflow-hidden">
      {/* Grain Texture Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] mix-blend-multiply"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
      />

      <div className="max-w-6xl mx-auto px-6 py-32 relative z-10">
        <motion.header
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-24 text-center max-w-3xl mx-auto"
        >
          {/* <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-900/5 border border-gray-900/10 mb-8">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-gray-600 font-medium">
              Engineering Lab
            </span>
          </div> */}

          <h1 className="font-serif text-5xl md:text-6xl font-medium tracking-tight mb-6 text-gray-900">
            Projects
          </h1>

          <p className="text-lg text-gray-600 leading-relaxed font-light max-w-2xl mx-auto">
            A collection of projects and a selection of deep dives into the architecture and technical challenges, showcasing what I've been working on, both professionally and personally.
          </p>
        </motion.header>

        {/* Featured Section */}
        <div className="mb-32">
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-6">
              <h2 className="font-mono text-xs font-bold text-gray-400 uppercase tracking-widest">Engineering Deep Dives</h2>
              <div className="h-px bg-gray-200 flex-1" />
            </div>
            <h3 className="font-serif text-3xl md:text-4xl text-gray-900 mb-4">
              The Architecture <span className="italic text-gray-500">Behind the Code</span>
            </h3>
            <p className="text-gray-600 leading-relaxed font-light max-w-2xl">
              A collection of technical deep dives exploring infrastructure, microservices, and design patterns.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-12">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.title} item={project} variant="deep-dive" />
            ))}
          </div>
        </div>

        {/* Standard Section */}
        <div>
          <div className="flex items-center gap-4 mb-12">
            <h2 className="font-mono text-xs font-bold text-gray-400 uppercase tracking-widest">Selected Works</h2>
            <div className="h-px bg-gray-200 flex-1" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {standardProjects.map((project) => (
              <ProjectCard key={project.title} item={project} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
