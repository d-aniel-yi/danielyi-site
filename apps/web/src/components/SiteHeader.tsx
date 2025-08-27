"use client";
import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="w-full border-b border-black/10 dark:border-white/15">
      <div className="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
        <Link href="/" className="font-semibold tracking-tight">
          Daniel Yi
        </Link>
        <nav className="flex gap-5 text-sm">
          <Link className="hover:underline" href="/resume">Resume</Link>
          <Link className="hover:underline" href="/cover-letter">Cover letter</Link>
          <Link className="hover:underline" href="/case-studies">Case studies</Link>
          <Link className="hover:underline" href="/contact">Contact</Link>
        </nav>
      </div>
    </header>
  );
}


