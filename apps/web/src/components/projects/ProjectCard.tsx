"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export interface ProjectItem {
  title: string;
  href: string;
  excerpt: string;
  image: string;
  tags?: string[];
  featured?: boolean;
  accentColor?: string;
  detailsSlug?: string;
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
          className="group block relative overflow-hidden rounded-2xl border border-gray-200 bg-white hover:shadow-xl transition-all duration-500"
          style={{
            borderColor: item.accentColor ? `${item.accentColor}20` : undefined,
          }}
        >
          {/* Image Section */}
          <div className="relative aspect-[16/9] overflow-hidden bg-gray-100">
            <Image
              src={item.image}
              alt={item.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 1024px"
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
          <div className="p-8">
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
      <Link
        href={linkHref}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        className="group block h-full overflow-hidden rounded-xl border border-gray-200 bg-white hover:shadow-lg hover:border-gray-300 transition-all duration-300"
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
    </motion.div>
  );
}
