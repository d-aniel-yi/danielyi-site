"use client";
import Link from "next/link";
import { useState } from "react";

export type ProjectItem = {
  title: string;
  href: string;
  excerpt: string;
  tags?: string[];
  image?: string;
  accentColor?: string;
  featured?: boolean;
  techDetails?: {
    stack: string[];
    architecture?: string;
    highlights?: string[];
  };
  detailsSlug?: string; // For dedicated detail page
};

// Helper to handle internal vs external links
const LinkWrapper = ({ href, children, className, ariaLabel }: { href: string; children: React.ReactNode; className?: string; ariaLabel?: string }) => {
  const isExternal = /^https?:\/\//i.test(href);

  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        aria-label={ariaLabel}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className} aria-label={ariaLabel}>
      {children}
    </Link>
  );
};

export function ProjectCard({ item, variant = "default" }: { item: ProjectItem; variant?: "default" | "featured" | "deep-dive" }) {
  const [expanded, setExpanded] = useState(false);
  const isExternal = /^https?:\/\//i.test(item.href);

  // Determine the primary destination for the card click
  // If it has a detailsSlug (Tier 1), go there. Otherwise go to href.
  const primaryHref = item.detailsSlug ? `/projects/${item.detailsSlug}` : item.href;

  const baseClasses =
    "group relative block overflow-hidden rounded-2xl border border-black/10 bg-white/5 transition motion-reduce:transition-none";

  // Variant-specific styles
  const isDeepDive = variant === "deep-dive";
  const containerClasses = isDeepDive
    ? "grid grid-cols-1 lg:grid-cols-12 gap-0"
    : "";

  const imageClasses = isDeepDive
    ? "lg:col-span-5 h-64 lg:h-full min-h-[300px] relative overflow-hidden border-b lg:border-b-0 lg:border-r border-black/10"
    : "mb-4 -mx-1 -mt-1 rounded-xl overflow-hidden border border-black/10 dark:border-white/10";

  const contentClasses = isDeepDive
    ? "lg:col-span-7 p-8 flex flex-col justify-center"
    : variant === "featured" ? "p-6 md:p-8" : "p-5";

  const cardContent = (
    <div className={containerClasses}>
      {/* Image Section */}
      {item.image && (
        <div className={imageClasses}>
          <LinkWrapper href={primaryHref} className="block h-full w-full">
            {isDeepDive ? (
              <img src={item.image} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover transition duration-700 group-hover:scale-105" />
            ) : (
              <img src={item.image} alt="" loading="lazy" className="block w-full h-40 object-cover" />
            )}
          </LinkWrapper>
        </div>
      )}

      {/* Content Section */}
      <div className={contentClasses}>
        <div className="relative z-10">
          {/* Title & Excerpt */}
          <LinkWrapper
            href={primaryHref}
            className="block group/link"
            ariaLabel={`Visit ${item.title}`}
          >
            <h3 className={`display-serif tracking-[-0.01em] ${variant === "featured" || isDeepDive ? "text-3xl md:text-4xl" : "text-2xl"}`}>
              {item.title}
            </h3>
            <p className={`mt-3 text-black/70 dark:text-white/70 ${isDeepDive ? "text-lg leading-relaxed" : "text-sm"}`}>
              {item.excerpt}
            </p>
          </LinkWrapper>

          {/* Tags */}
          {item.tags && item.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {item.tags.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center rounded-full border border-black/10 px-2 py-0.5 text-[11px] uppercase tracking-wide text-black/70"
                >
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Actions & Details */}
        <div className="relative z-10 mt-6 pt-6 border-t border-black/10">
          <div className="flex flex-wrap items-center gap-3">
            {/* Deep Dive Action */}
            {item.detailsSlug && (
              <Link
                href={`/projects/${item.detailsSlug}`}
                className="group/btn inline-flex items-center gap-2 text-sm font-medium bg-white text-black border border-black/10 px-5 py-2 rounded-full hover:bg-gray-50 transition shadow-sm"
              >
                <span>View Tech Deep Dive</span>
                <span className="group-hover/btn:translate-x-0.5 transition-transform">→</span>
              </Link>
            )}

            {/* Visit Site Action */}
            <a
              href={item.href}
              target={isExternal ? "_blank" : undefined}
              rel={isExternal ? "noopener noreferrer" : undefined}
              className="inline-flex items-center gap-1 text-sm font-medium text-black/70 hover:text-black px-3 py-2 transition"
            >
              <span>Visit Site</span>
              <span>↗</span>
            </a>

            {/* Tech Details Toggle */}
            {item.techDetails && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="text-sm font-medium text-black/60 hover:text-black transition flex items-center gap-2 ml-auto"
                aria-expanded={expanded}
              >
                <span>Technical Architecture</span>
                <span className={`transform transition-transform ${expanded ? 'rotate-180' : ''}`}>▼</span>
              </button>
            )}
          </div>

          {/* Expanded Details */}
          {item.techDetails && expanded && (
            <div className="mt-6 space-y-4 text-sm animate-in fade-in slide-in-from-top-2 duration-200 bg-black/5 p-4 rounded-xl">
              {item.techDetails.stack && item.techDetails.stack.length > 0 && (
                <div>
                  <h4 className="font-semibold text-xs uppercase tracking-wide text-black/60 mb-2">Tech Stack</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {item.techDetails.stack.map((tech) => (
                      <span
                        key={tech}
                        className="inline-flex items-center rounded-md bg-white px-2 py-1 text-xs text-black/80 border border-black/5 shadow-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {item.techDetails.architecture && (
                <div>
                  <h4 className="font-semibold text-xs uppercase tracking-wide text-black/60 mb-1">Architecture</h4>
                  <p className="text-xs text-black/70 leading-relaxed">{item.techDetails.architecture}</p>
                </div>
              )}

              {item.techDetails.highlights && item.techDetails.highlights.length > 0 && (
                <div>
                  <h4 className="font-semibold text-xs uppercase tracking-wide text-black/60 mb-1">Key Highlights</h4>
                  <ul className="list-disc pl-4 text-xs text-black/70 space-y-1">
                    {item.techDetails.highlights.map((highlight, idx) => (
                      <li key={idx}>{highlight}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Hover Effect Layer */}
      <span className="pointer-events-none absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition rounded-2xl bg-black/[0.02] motion-reduce:transition-none" />
      {item.accentColor && !isDeepDive && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-1"
          style={{ background: item.accentColor }}
        />
      )}
    </div>
  );

  return (
    <div className={`${baseClasses} hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]`}>
      {cardContent}
    </div>
  );
}
