"use client";
import Link from "next/link";

export type ProjectItem = {
  title: string;
  href: string;
  excerpt: string;
  tags?: string[];
  image?: string;
  accentColor?: string;
  featured?: boolean;
};

export function ProjectCard({ item, variant = "default" }: { item: ProjectItem; variant?: "default" | "featured" }) {
  const isExternal = /^https?:\/\//i.test(item.href);
  const baseClasses =
    "group relative block overflow-hidden rounded-2xl border border-black/10 dark:border-white/10 bg-white/5 dark:bg-black/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-black/30 dark:focus-visible:ring-white/30 focus-visible:ring-offset-transparent hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition motion-reduce:transition-none";
  const padding = variant === "featured" ? "p-6 md:p-8" : "p-5";
  return (
    <Link
      href={item.href}
      className={`${baseClasses} ${padding}`}
      aria-label={`${item.title} — ${isExternal ? "opens in new tab" : "open"}`}
      style={item.accentColor ? { outlineColor: item.accentColor } : undefined}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
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
                className="inline-flex items-center rounded-full border border-black/10 dark:border-white/10 px-2 py-0.5 text-[11px] uppercase tracking-wide text-black/70 dark:text-white/70"
              >
                {t}
              </span>
            ))}
          </div>
        )}
        <div className="mt-4 text-sm font-medium">
          <span className="opacity-70">Open</span>
          <span className="inline-block translate-x-0 group-hover:translate-x-1 transition motion-reduce:transform-none"> →</span>
        </div>
      </div>

      {/* Subtle glass hover layer */}
      <span className="pointer-events-none absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition rounded-2xl bg-white/10 dark:bg-white/5 backdrop-blur-sm motion-reduce:transition-none" />
      {item.accentColor && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-1"
          style={{ background: item.accentColor }}
        />
      )}
    </Link>
  );
}


