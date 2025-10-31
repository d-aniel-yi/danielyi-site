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
  djgrill: {
    slug: "djgrill",
    title: "DJ GRILL",
    description: "Professional DJ services website with booking, mixes, and event information",
    url: "https://djgrill.house",
    image: "/hero-dj.webp",
    overview:
      "DJ GRILL is a modern, visually striking website for professional DJ services. Built with Next.js and deployed on Bluehost, it features smooth animations, video backgrounds, and integrated payment systems for bookings and tips.",
    stack: [
      { category: "Frontend", items: ["React", "Next.js 14", "TypeScript", "Tailwind CSS"] },
      { category: "Animation", items: ["Framer Motion", "CSS Animations"] },
      { category: "Payments", items: ["Square Payment Links", "Venmo Integration"] },
      { category: "Hosting", items: ["Bluehost", "Static Export", "Apache"] },
    ],
    architecture: {
      title: "Static Architecture",
      description:
        "Static export with client-side interactivity, hosted on traditional shared hosting for simplicity and cost efficiency.",
      components: [
        {
          name: "Landing Page",
          description: "Video background with smooth scroll animations and service overview",
        },
        {
          name: "Services Section",
          description: "Detailed DJ service offerings with pricing and availability",
        },
        {
          name: "Payment Integration",
          description: "Square payment links for bookings and Venmo for tips via Apache redirects",
        },
      ],
    },
    highlights: [
      "Smooth, professional animations throughout the site",
      "Responsive design optimized for mobile booking",
      "Integrated payment system with Square",
      "Video backgrounds for visual impact",
      "Fast page loads despite rich media content",
      "Clean separation from photography portfolio",
    ],
    challenges: [
      {
        title: "Performance with Video Backgrounds",
        solution:
          "Optimized video encoding and implemented lazy loading to maintain fast page loads while delivering visual impact",
      },
      {
        title: "Hosting on Traditional Shared Hosting",
        solution:
          "Used Next.js static export to deploy on Bluehost, gaining cost efficiency while maintaining modern development experience",
      },
    ],
  },
  "djgrill-photography": {
    slug: "djgrill-photography",
    title: "DJ GRILL Photography Portfolio",
    description: "Professional photography portfolio for young families, powered by Sanity CMS",
    url: "https://djgrill.house/photography",
    image: "/photographyhero.webp",
    overview:
      "A sophisticated photography portfolio showcasing work with young families. Built with a hybrid architecture that enables instant content updates through Sanity CMS while maintaining the benefits of static hosting.",
    stack: [
      { category: "Frontend", items: ["Next.js 14", "React", "TypeScript", "Tailwind CSS"] },
      { category: "CMS", items: ["Sanity.io", "sanity-plugin-media", "GROQ queries"] },
      { category: "Features", items: ["Client-side fetching", "Image optimization", "Lightbox viewer"] },
      { category: "Hosting", items: ["Bluehost", "Static Export"] },
    ],
    architecture: {
      title: "Hybrid JAMstack Architecture",
      description:
        "Static HTML pages with client-side data fetching from Sanity CMS, enabling instant portfolio updates without rebuilding the entire site.",
      components: [
        {
          name: "Static Shell",
          description: "Pre-built HTML/CSS/JS served instantly from Bluehost",
        },
        {
          name: "Sanity CMS",
          description: "Headless CMS storing album metadata and photos with CDN-optimized delivery",
        },
        {
          name: "Client-Side Fetcher",
          description: "React components fetch portfolio data at runtime, enabling real-time updates",
        },
        {
          name: "Lightbox Gallery",
          description: "Full-screen photo viewer with navigation and responsive images",
        },
      ],
    },
    highlights: [
      "Real-time portfolio updates: Edit in Sanity → Refresh browser → See changes (2 seconds)",
      "No rebuild required for content updates (edit photos/albums instantly)",
      "Sanity Media Plugin for batch upload and organization",
      "Responsive image optimization via Sanity CDN",
      "Album categorization (Planned vs Candid shoots)",
      "Drag-and-drop photo ordering",
      "Professional lightbox with keyboard navigation",
    ],
    challenges: [
      {
        title: "Instant Updates on Static Hosting",
        solution:
          "Implemented client-side data fetching from Sanity API, allowing content updates without rebuilding or redeploying the entire site",
      },
      {
        title: "Image Performance at Scale",
        solution:
          "Leveraged Sanity's CDN with automatic image optimization, WebP conversion, and responsive sizing",
      },
      {
        title: "Album Discovery Without Server Routes",
        solution:
          "Pre-generated static routes at build time via generateStaticParams, then fetched album content client-side for flexibility",
      },
    ],
    metrics: [
      { label: "Portfolio Load Time", value: "~1.5s" },
      { label: "Content Update Speed", value: "2s (no rebuild)" },
      { label: "Sanity API Calls", value: "< 20k/month" },
      { label: "Hosting Cost", value: "$3/month (Bluehost)" },
    ],
  },
  "crypto-tipjar": {
    slug: "crypto-tipjar",
    title: "Crypto Tip Jar Smart Contract",
    description: "Full-stack Web3 tip jar with soulbound NFT badges on Base L2",
    url: "https://djgrill.house/crypto-tip",
    image: "/nft.png",
    overview:
      "A production-ready Web3 crypto tip jar built on Base Layer 2 that rewards tippers with unique, soulbound NFT badges. Features programmatically generated SVG artwork, IPFS storage, and costs just $0.01 per transaction—99.8% cheaper than Ethereum L1.",
    stack: [
      { category: "Smart Contract", items: ["Solidity 0.8.24", "ERC-1155", "OpenZeppelin", "Foundry"] },
      { category: "Frontend", items: ["Next.js 14", "React 18", "TypeScript", "Tailwind CSS"] },
      { category: "Web3", items: ["Wagmi 2.x", "Viem 2.x", "RainbowKit 2.x"] },
      { category: "Infrastructure", items: ["Base L2", "IPFS (Pinata)", "MetaMask"] },
    ],
    architecture: {
      title: "Full-Stack Web3 Architecture",
      description:
        "Decentralized tip jar using ERC-1155 soulbound NFTs on Base L2 with programmatically generated artwork stored on IPFS.",
      components: [
        {
          name: "GrillTipJar Smart Contract",
          description: "ERC-1155 contract on Base Mainnet with soulbound badges, reentrancy protection, and custom errors for gas efficiency",
        },
        {
          name: "NFT Generation Pipeline",
          description: "Algorithmically generates 30 unique SVG badges with random colors and emojis, uploaded to IPFS via Pinata",
        },
        {
          name: "Web3 Frontend",
          description: "React app with Wagmi/Viem for blockchain interaction, RainbowKit for wallet UI, real-time event listening",
        },
        {
          name: "Hall of Fame",
          description: "Event-driven display of all tips using blockchain event logs, updates in real-time without backend",
        },
      ],
    },
    highlights: [
      "Live on Base Mainnet with real ETH: 0x3e34E90b0D3B2052B3618E76A2eb86A56B27B948",
      "Gas costs: $0.01 per tip (99.8% cheaper than Ethereum L1)",
      "30 unique programmatically generated SVG NFT badges",
      "Soulbound tokens (non-transferable, permanent proof of support)",
      "Decentralized storage on IPFS (censorship-resistant)",
      "100% test coverage with 21 Foundry test cases",
      "Real-time Hall of Fame using blockchain event logs",
      "No backend required (JAMstack architecture)",
    ],
    challenges: [
      {
        title: "Gas Optimization on Layer 2",
        solution:
          "Used custom errors (50% cheaper than strings), immutable variables, constants, and calldata parameters. Result: ~100K gas per tip (~$0.01 USD)",
      },
      {
        title: "Soulbound NFT Implementation",
        solution:
          "Override ERC-1155 _update() to prevent all transfers except minting/burning. Also override public transfer functions to revert with custom error",
      },
      {
        title: "Programmatic NFT Generation",
        solution:
          "Built Node.js script to generate 30 unique SVG badges with random HSL colors (108K combinations) and 1-3 random emojis (5.4K combinations)",
      },
      {
        title: "Decentralized Metadata Storage",
        solution:
          "Uploaded all 30 SVG images and metadata JSONs to IPFS via Pinata, then configured smart contract with individual token URIs",
      },
    ],
    metrics: [
      { label: "Deployment Cost", value: "$0.14 USD" },
      { label: "Tip Transaction Cost", value: "$0.01 USD" },
      { label: "Gas Savings vs ETH L1", value: "99.8%" },
      { label: "Test Coverage", value: "100% (21 tests)" },
      { label: "Unique Badge Designs", value: "30 SVGs" },
      { label: "Development Time", value: "8 days" },
    ],
  },
  coreplasma: {
    slug: "coreplasma",
    title: "Core Plasma",
    description: "Professional website for plasma physics consulting services",
    url: "https://coreplasma.org",
    image: "/coreplasma.jpg",
    overview:
      "Core Plasma is a consulting firm specializing in plasma physics research and industrial applications, led by Dr. Won Yi. The website provides a professional online presence with service information and client contact capabilities.",
    stack: [
      { category: "Frontend", items: ["React", "Next.js", "TypeScript", "Tailwind CSS"] },
      { category: "Hosting", items: ["Static Export", "CDN"] },
      { category: "Features", items: ["Contact Form", "Responsive Design", "SEO"] },
    ],
    architecture: {
      title: "Static Architecture",
      description:
        "Clean, professional static site optimized for credibility and ease of maintenance.",
      components: [
        {
          name: "Services Overview",
          description: "Clear presentation of plasma consulting capabilities and expertise",
        },
        {
          name: "Contact System",
          description: "Simple, reliable contact form for client inquiries",
        },
        {
          name: "Responsive Design",
          description: "Mobile-optimized for researchers and industrial clients",
        },
      ],
    },
    highlights: [
      "Professional design tailored for scientific audience",
      "SEO optimized for plasma physics consulting searches",
      "Fast loading times for technical content",
      "Contact form for client inquiries",
      "Credibility-focused presentation",
      "Low maintenance overhead",
    ],
    challenges: [
      {
        title: "Technical Audience Credibility",
        solution:
          "Designed with clean, professional aesthetics that appeal to scientists and engineers while maintaining accessibility",
      },
      {
        title: "Specialized SEO",
        solution:
          "Optimized metadata and content for niche plasma physics consulting keywords to reach target industrial and research clients",
      },
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
          {project.url ? (
            <a href={project.url} target="_blank" rel="noopener noreferrer" className="block hover:opacity-90 transition">
              <img src={project.image} alt={project.title} className="w-full h-auto" loading="eager" />
            </a>
          ) : (
            <img src={project.image} alt={project.title} className="w-full h-auto" loading="eager" />
          )}
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

