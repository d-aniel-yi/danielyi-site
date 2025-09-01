"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
const LiquidGlass = dynamic(() => import("liquid-glass-react"), { ssr: false });

export function SiteHeader() {
  const ref = useRef<HTMLElement | null>(null);
  const [open, setOpen] = useState(false);
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
    <>
      {/* Desktop header */}
      <header
        ref={ref}
        className="hidden sm:block site-header fixed top-0 inset-x-0 z-40 will-change-transform [transition:transform_300ms_ease] [transform:translateY(0)] data-[hidden='true']:[transform:translateY(-100%)] supports-[backdrop-filter]:bg-transparent data-[solid='true']:supports-[backdrop-filter]:bg-white/70 border-b border-transparent data-[solid='true']:border-black/10"
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

      {/* Mobile floating hamburger (no top bar) */}
      <div className="block sm:hidden">
        {/* Button */}
        <button
          className={`fixed top-3 right-4 z-50 inline-flex items-center justify-center w-10 h-10 rounded-lg transition ${open ? "border-subtle border bg-white/85 backdrop-blur-md shadow-sm" : "bg-transparent border-transparent"} hover:bg-white/70 hover:backdrop-blur-md hover:shadow-sm`}
          aria-label="Open menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="flex flex-col items-center justify-center gap-1.5">
            <span className="block w-5 h-0.5 bg-[var(--color-paper)]" />
            <span className="block w-5 h-0.5 bg-[var(--color-paper)]" />
            <span className="block w-5 h-0.5 bg-[var(--color-paper)]" />
          </span>
        </button>

        {/* Popout menu */}
        <div className={`fixed top-14 right-4 z-50 w-64 transition ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
          <div className="relative rounded-xl border-subtle border bg-white/85 backdrop-blur-md overflow-hidden">
            <div className="absolute inset-0 z-0 opacity-60">
              <LiquidGlass mouseContainer={ref} blurAmount={0.16} elasticity={0.26} saturation={140} cornerRadius={12} className="h-full w-full">
                <div className="h-full w-full" />
              </LiquidGlass>
            </div>
            <div className="relative z-10 p-3 grid gap-1 text-sm" style={{ color: "var(--color-ink)" }}>
              <MobileLink href="/" onClick={() => setOpen(false)}>Home</MobileLink>
              <MobileLink href="/resume" onClick={() => setOpen(false)}>Resume</MobileLink>
              <MobileLink href="/projects" onClick={() => setOpen(false)}>Projects</MobileLink>
              <MobileLink href="/technical" onClick={() => setOpen(false)}>Technical Details</MobileLink>
              <MobileLink href="/letter" onClick={() => setOpen(false)}>Dear Reader</MobileLink>
              <MobileLink href="/contact" onClick={() => setOpen(false)}>Contact</MobileLink>
            </div>
          </div>
        </div>
      </div>
    </>
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

function MobileLink({ href, children, onClick }: { href: string; children: React.ReactNode; onClick?: () => void }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="px-3 py-2 rounded-md hover:bg-white/50"
    >
      {children}
    </Link>
  );
}
