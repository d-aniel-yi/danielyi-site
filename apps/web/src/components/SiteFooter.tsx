export function SiteFooter() {
  return (
    <footer className="w-full border-t border-black/10 dark:border-white/15 mt-12">
      <div className="mx-auto max-w-5xl px-4 py-10 text-sm text-black/60 dark:text-white/60 flex items-center justify-between">
        <p>© {new Date().getFullYear()} Daniel Yi</p>
        <p>
          Built with Next.js & AWS · <a className="underline" href="/technical">Technical notes</a>
        </p>
      </div>
    </footer>
  );
}


