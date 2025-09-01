"use client";
import Link from "next/link";
import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
const LiquidGlass = dynamic(() => import("liquid-glass-react"), { ssr: false });

export function SiteHeader() {
  const ref = useRef<HTMLElement | null>(null);
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const el = ref.current;
      if (!el) return;
      const y = window.scrollY;
      // Solid background after small scroll
      if (y > 12) el.setAttribute("data-solid", "true");
      else el.removeAttribute("data-solid");
      // Hide on scroll down, show on scroll up
      if (y > last && y > 120) el.setAttribute("data-hidden", "true");
      else el.removeAttribute("data-hidden");
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      ref={ref}
      className="site-header fixed top-0 inset-x-0 z-50 will-change-transform [transition:transform_300ms_ease] [transform:translateY(0)] data-[hidden='true']:[transform:translateY(-100%)] backdrop-blur supports-[backdrop-filter]:bg-transparent data-[solid='true']:supports-[backdrop-filter]:bg-white/70 dark:data-[solid='true']:supports-[backdrop-filter]:bg-black/40 border-b border-transparent data-[solid='true']:border-black/10 dark:data-[solid='true']:border-white/10"
    >
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between" style={{ color: "var(--color-ink)" }}>
        {/* <Link href="/" className="font-semibold tracking-tight">Daniel Yi</Link> */}
        <nav className="hidden sm:flex gap-3 text-sm" style={{ color: "var(--color-ink)" }}>
          <HeaderLink href="/">Home</HeaderLink>
          <HeaderLink href="/resume">Resume</HeaderLink>
          <HeaderLink href="/projects">Projects</HeaderLink>
          <HeaderLink href="/technical">Technical Details</HeaderLink>
          <HeaderLink href="/letter">Dear Reader</HeaderLink>
          <HeaderLink href="/contact">Contact</HeaderLink>
        </nav>
      </div>
    </header>
  );
}



function HeaderLink({ href, children }: { href: string; children: React.ReactNode }) {
  const ref = useRef<HTMLAnchorElement | null>(null);
  return (
    <Link
      ref={ref}
      href={href}
      className="relative group inline-block px-3 py-1.5 rounded-md min-h-[34px]"
    >
      {/* CSS fallback frosted panel on hover */}
      <span className="pointer-events-none absolute inset-0 z-10 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition rounded-md border border-white/30 dark:border-white/10 bg-white/30 backdrop-blur-md" />

      {/* Liquid glass effect on hover/focus */}
      <span className="pointer-events-none absolute inset-0 z-[9] opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity rounded-md overflow-hidden">
        <LiquidGlass
          mouseContainer={ref}
          blurAmount={0.16}
          elasticity={0.28}
          saturation={150}
          cornerRadius={10}
          className="h-full w-full"
        >
          <div className="h-full w-full" />
        </LiquidGlass>
      </span>

      <span className="relative z-20">{children}</span>
    </Link>
  );
}
