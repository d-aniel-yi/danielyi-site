"use client";
import Link from "next/link";
import dynamic from "next/dynamic";
const LiquidGlass = dynamic(() => import("liquid-glass-react"), { ssr: false });

export function Hero() {
  return (
    <section className="relative h-[100svh] overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 -z-20"
        style={{
          backgroundImage: "url(/hero-background.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />
      {/* Gradient overlay for depth/readability */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(1100px 520px at 50% -15%, rgba(0,0,0,0.28), transparent), linear-gradient(180deg, rgba(0,0,0,0.18), rgba(0,0,0,0.04))",
        }}
      />

      <div className="absolute inset-0 grid grid-rows-[1fr_auto_1fr]">
        <div className="row-start-2 px-6">
          <div className="max-w-6xl mx-auto grid grid-cols-12 items-end gap-6">
            <div className="col-span-12 md:col-span-7">
              <h1 className="display-serif text-[clamp(40px,8vw,88px)] font-normal leading-[1.05] tracking-[-0.01em] text-left">
                Daniel Yi
                <br />
                <em className="italic">tagline here</em>
              </h1>
              <p className="mt-3 max-w-xl text-base md:text-lg text-black/65 dark:text-white/65 text-left">
                Product taste, sales rigor, and technical delivery — together.
              </p>
            </div>
            <div className="col-span-12 md:col-span-5 md:justify-self-end">
              <div className="grid grid-cols-1 gap-2 md:gap-3">
                {quickLinks.map((item) => (
                  <QuickLink key={item.href} href={item.href} label={item.label} value={item.value} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const quickLinks = [
  { label: "Explore", value: "Resume", href: "/resume" },
  { label: "Explore", value: "Cover letter", href: "/cover-letter" },
  { label: "Explore", value: "Case studies", href: "/case-studies" },
  { label: "Explore", value: "Technical notes", href: "/technical" },
];

import { useRef } from "react";

function QuickLink({ href, label, value }: { href: string; label: string; value: string }) {
  const containerRef = useRef<HTMLAnchorElement | null>(null);
  return (
    <Link
      ref={containerRef}
      href={href}
      className="relative group inline-block px-3 py-2 md:px-4 md:py-3 rounded-xl min-h-[44px]"
    >
      {/* CSS fallback frosted panel on hover */}
      <span className="pointer-events-none absolute inset-0 z-10 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition rounded-xl border border-white/30 dark:border-white/10 bg-white/20 dark:bg-black/25 backdrop-blur-md" />

      {/* Liquid glass (client-only). Renders under text; if unsupported, CSS fallback above provides effect. */}
      <span className="pointer-events-none absolute inset-0 z-[9] opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity rounded-xl overflow-hidden">
        <LiquidGlass
          mouseContainer={containerRef}
          blurAmount={0.18}
          elasticity={0.28}
          saturation={150}
          cornerRadius={14}
          className="h-full w-full"
        >
          <div className="h-full w-full" />
        </LiquidGlass>
      </span>

      <span className="relative z-20 block text-[11px] uppercase tracking-[0.2em] text-black/75 dark:text-white/75">
        {label}
      </span>
      <span className="relative z-20 mt-0.5 block text-[18px] md:text-[22px] font-medium tracking-[-0.01em]">
        {value} <span className="opacity-50 inline-block translate-x-0 group-hover:translate-x-1 transition">→</span>
      </span>
    </Link>
  );
}


