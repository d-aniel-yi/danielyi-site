"use client";
import Link from "next/link";
import { useEffect, useRef } from "react";

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
      className="fixed top-0 inset-x-0 z-50 will-change-transform [transition:transform_300ms_ease] [transform:translateY(0)] data-[hidden='true']:[transform:translateY(-100%)] backdrop-blur supports-[backdrop-filter]:bg-transparent data-[solid='true']:supports-[backdrop-filter]:bg-white/70 dark:data-[solid='true']:supports-[backdrop-filter]:bg-black/40 border-b border-transparent data-[solid='true']:border-black/10 dark:data-[solid='true']:border-white/10"
    >
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-semibold tracking-tight">Daniel Yi</Link>
        <nav className="hidden sm:flex gap-6 text-sm text-black/80 dark:text-white/80">
          <Link className="hover:opacity-70 transition" href="/resume">Resume</Link>
          <Link className="hover:opacity-70 transition" href="/contact">Contact</Link>
        </nav>
      </div>
    </header>
  );
}


