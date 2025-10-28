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

export function ProjectCard({ item, variant = "default" }: { item: ProjectItem; variant?: "default" | "featured" }) {
  const [expanded, setExpanded] = useState(false);
  const isExternal = /^https?:\/\//i.test(item.href);
  
  const baseClasses =
    "group relative block overflow-hidden rounded-2xl border border-black/10 bg-white/5 transition motion-reduce:transition-none";
  const padding = variant === "featured" ? "p-6 md:p-8" : "p-5";

  const cardContent = (
    <>
      {/* Clickable top section - goes to site */}
      <a
        href={item.href}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        className="block group/link"
        aria-label={`Visit ${item.title}`}
      >
        {item.image && (
          <div className="mb-4 -mx-1 -mt-1 rounded-xl overflow-hidden border border-black/10 dark:border-white/10">
            {/* Using img for simplicity in static export; unoptimized and lazy */}
            <img src={item.image} alt="" loading="lazy" className="block w-full h-40 object-cover" />
          </div>
        )}
        <div className="relative z-10">
          <h3 className={`display-serif tracking-[-0.01em] ${variant === "featured" ? "text-3xl md:text-4xl" : "text-2xl"}`}>
            {item.title}
          </h3>
          <p className="mt-2 text-sm text-black/70 dark:text-white/70">
            {item.excerpt}
          </p>
          {item.tags && item.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
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
      </a>

      {/* Visit Site Button */}
      <div className="relative z-10 mt-4">
        <a
          href={item.href}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
          className="inline-flex items-center gap-1 text-xs font-medium border border-black/20 px-3 py-1.5 rounded-full hover:bg-black/5 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-black/30"
        >
          <span>Visit Site</span>
          <span>↗</span>
        </a>
      </div>

      <div className="relative z-10">
        
        {/* Tech Details Expandable Section */}
        {item.techDetails && (
          <div className="mt-4 border-t border-black/10 pt-4">
            <button
              onClick={() => setExpanded(!expanded)}
              className="w-full text-left text-sm font-medium flex items-center justify-between hover:text-black/90 transition"
              aria-expanded={expanded}
            >
              <span className="flex items-center gap-2">
                <span>View Technical Architecture</span>
              </span>
              <span className={`transform transition-transform ${expanded ? 'rotate-180' : ''}`}>▼</span>
            </button>
            
            {expanded && (
              <div className="mt-3 space-y-3 text-sm animate-in fade-in slide-in-from-top-2 duration-200">
                {item.techDetails.stack && item.techDetails.stack.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-xs uppercase tracking-wide text-black/60 mb-1">Stack</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {item.techDetails.stack.map((tech) => (
                        <span
                          key={tech}
                          className="inline-flex items-center rounded-md bg-black/5 px-2 py-1 text-xs text-black/80"
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
                    <h4 className="font-semibold text-xs uppercase tracking-wide text-black/60 mb-1">Highlights</h4>
                    <ul className="list-disc pl-4 text-xs text-black/70 space-y-0.5">
                      {item.techDetails.highlights.map((highlight, idx) => (
                        <li key={idx}>{highlight}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {/* View Details button nested inside expanded section */}
                {item.detailsSlug && (
                  <div className="pt-2">
                    <Link
                      href={`/projects/${item.detailsSlug}`}
                      className="inline-flex items-center gap-1 text-xs font-medium border border-black/20 px-3 py-1.5 rounded-full hover:bg-black/5 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-black/30"
                    >
                      <span>View Full Details</span>
                      <span>→</span>
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Subtle glass hover layer - always show on card hover */}
      <span className="pointer-events-none absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition rounded-2xl bg-white/10 motion-reduce:transition-none" />
      {item.accentColor && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-1"
          style={{ background: item.accentColor }}
        />
      )}
    </>
  );

  // Always render as div with interactive elements inside
  return (
    <div className={`${baseClasses} ${padding} hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]`}>
      {cardContent}
    </div>
  );
}
