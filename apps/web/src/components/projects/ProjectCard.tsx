"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export interface ProjectItem {
  title: string;
  href: string;
  excerpt: string;
  image: string;
  tags?: string[];
  featured?: boolean;
  accentColor?: string;
  detailsSlug?: string;
  github?: string;
  basescan?: string;
  techDetails?: {
    stack: string[];
    architecture: string;
    highlights: string[];
  };
}

interface ProjectCardProps {
  item: ProjectItem;
  variant?: "deep-dive" | "featured" | "standard";
}

export function ProjectCard({ item, variant = "standard" }: ProjectCardProps) {
  const [expanded, setExpanded] = useState(false);

  // Determine the link href: use detailsSlug if available, otherwise use href
  const linkHref = item.detailsSlug ? `/projects/${item.detailsSlug}` : item.href;
  const isExternal = !item.detailsSlug;

  if (variant === "deep-dive" || variant === "featured") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <Link
          href={linkHref}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
          className="group block relative overflow-hidden rounded-2xl border border-gray-200 bg-white hover:shadow-xl transition-all duration-500 md:grid md:grid-cols-[32%_1fr]"
          style={{
            borderColor: item.accentColor ? `${item.accentColor}20` : undefined,
          }}
        >
          {/* Image Section */}
          <div className="relative aspect-[16/9] md:aspect-auto md:h-full overflow-hidden bg-gray-100 border-b md:border-b-0 md:border-r border-gray-100">
            <Image
              src={item.image}
              alt={item.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 35vw"
            />
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500"
              style={{
                background: item.accentColor
                  ? `linear-gradient(135deg, ${item.accentColor}, transparent)`
                  : "linear-gradient(135deg, rgba(0,0,0,0.2), transparent)",
              }}
            />
          </div>

          {/* Content Section */}
          <div className="p-8 md:p-10 flex flex-col justify-center">
            {/* Tags */}
            {item.tags && item.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700 border border-gray-200"
                    style={{
                      backgroundColor: item.accentColor ? `${item.accentColor}10` : undefined,
                      borderColor: item.accentColor ? `${item.accentColor}30` : undefined,
                      color: item.accentColor || undefined,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Title */}
            <h3 className="font-serif text-2xl md:text-3xl font-medium mb-4 text-gray-900 group-hover:text-gray-700 transition-colors">
              {item.title}
            </h3>

            {/* Excerpt */}
            <p className="text-gray-600 leading-relaxed font-light mb-6">
              {item.excerpt}
            </p>

            {/* Tech Stack (if available) */}
            {item.techDetails && (
              <div className="pt-6 border-t border-gray-200">
                <div className="flex flex-wrap gap-2">
                  {item.techDetails.stack.slice(0, 5).map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-1 text-xs font-mono text-gray-600 bg-gray-50 rounded"
                    >
                      {tech}
                    </span>
                  ))}
                  {item.techDetails.stack.length > 5 && (
                    <span className="px-2 py-1 text-xs font-mono text-gray-500">
                      +{item.techDetails.stack.length - 5} more
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="mt-6 flex items-center gap-2 text-sm font-medium">
              <span
                className="transition-colors"
                style={{ color: item.accentColor || "#3b82f6" }}
              >
                {item.detailsSlug ? "View Deep Dive" : "Visit Site"}
              </span>
              <svg
                className="w-4 h-4 transition-transform group-hover:translate-x-1"
                style={{ color: item.accentColor || "#3b82f6" }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </div>
          </div>
        </Link>
      </motion.div>
    );
  }

  // Standard variant (for grid layout)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <div
        className="group block h-full overflow-hidden rounded-xl border border-gray-200 bg-white hover:shadow-lg hover:border-gray-300 transition-all duration-300"
      >
        <Link
          href={linkHref}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
        >
          {/* Image Section */}
          <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
            <Image
              src={item.image}
              alt={item.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </div>

          {/* Content Section */}
          <div className="p-6">
            {/* Tags */}
            {item.tags && item.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 text-xs font-medium rounded bg-gray-100 text-gray-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Title */}
            <h3 className="font-serif text-xl font-medium mb-2 text-gray-900 group-hover:text-gray-700 transition-colors">
              {item.title}
            </h3>

            {/* Excerpt */}
            <p className="text-sm text-gray-600 leading-relaxed font-light line-clamp-3">
              {item.excerpt}
            </p>

            {/* CTA */}
            <div className="mt-4 flex items-center gap-2 text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
              <span>{item.detailsSlug ? "Learn more" : "Visit site"}</span>
              <svg
                className="w-4 h-4 transition-transform group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </div>
          </div>
        </Link>

        {/* Secondary links — outside <Link> to avoid nested <a> hydration error */}
        {(item.github || item.basescan) && (
          <div className="px-6 pb-4 flex flex-col gap-2">
            {item.github && (
              <a
                href={item.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-gray-500 hover:text-gray-900 transition-colors flex items-center gap-1.5"
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
                View on GitHub
              </a>
            )}
            {item.basescan && (
              <a
                href={item.basescan}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-gray-500 hover:text-gray-900 transition-colors flex items-center gap-1.5"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                View Source Code on Basescan
              </a>
            )}
          </div>
        )}

        {/* Technical Architecture Toggle */}
        {item.techDetails && (
          <div className="border-t border-gray-100 bg-gray-50/50">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setExpanded(!expanded);
              }}
              className="w-full flex items-center justify-between px-6 py-3 text-xs font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-100/50 transition-colors"
              aria-expanded={expanded}
            >
              <span>Technical Architecture</span>
              <svg
                className={`w-4 h-4 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <AnimatePresence>
              {expanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-6 pt-2 space-y-4">
                    {item.techDetails.stack && item.techDetails.stack.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-[10px] uppercase tracking-wider text-gray-400 mb-2">Tech Stack</h4>
                        <div className="flex flex-wrap gap-1.5">
                          {item.techDetails.stack.map((tech) => (
                            <span
                              key={tech}
                              className="inline-flex items-center rounded-md bg-white px-2 py-1 text-[10px] sm:text-xs text-gray-600 border border-gray-200 shadow-sm"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {item.techDetails.architecture && (
                      <div>
                        <h4 className="font-semibold text-[10px] uppercase tracking-wider text-gray-400 mb-1">Architecture</h4>
                        <p className="text-xs text-gray-600 leading-relaxed">{item.techDetails.architecture}</p>
                      </div>
                    )}

                    {item.techDetails.highlights && item.techDetails.highlights.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-[10px] uppercase tracking-wider text-gray-400 mb-1">Key Highlights</h4>
                        <ul className="list-disc pl-4 text-xs text-gray-600 space-y-1">
                          {item.techDetails.highlights.map((highlight, idx) => (
                            <li key={idx}>{highlight}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.div>
  );
}
