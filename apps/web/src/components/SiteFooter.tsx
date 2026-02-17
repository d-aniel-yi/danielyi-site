import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="w-full border-t border-black/10 dark:border-white/15 mt-12">
      <div className="mx-auto max-w-5xl px-4 py-10 text-sm text-black/60 dark:text-white/60 flex items-center justify-between">
        <p>© {new Date().getFullYear()} Daniel Yi</p>
        <div className="flex flex-col items-end gap-1 text-right">
          <Link className="underline hover:text-black dark:hover:text-white transition-colors" href="/projects">Explore Projects</Link>
          <a className="underline hover:text-black dark:hover:text-white transition-colors" href="https://www.linkedin.com/in/daniel-yi/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a className="underline hover:text-black dark:hover:text-white transition-colors" href="https://github.com/d-aniel-yi" target="_blank" rel="noopener noreferrer">GitHub</a>
        </div>
      </div>
    </footer>
  );
}


