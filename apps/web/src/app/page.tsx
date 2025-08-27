import Link from "next/link";

export default function Home() {
  return (
    <div className="font-sans">
      <main className="flex flex-col gap-4">
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
          A top‑performing AE who ships
        </h1>
        <p className="text-black/70 dark:text-white/70 max-w-xl">
          I connect product, engineering, and customers — and I built this site end‑to‑end to show it. Explore my resume, a cover letter tailored to Anysphere, and concise case studies.
        </p>

        <nav className="flex gap-4 items-center flex-col sm:flex-row mt-2">
          <Link className="underline" href="/resume">Resume</Link>
          <Link className="underline" href="/cover-letter">Cover letter</Link>
          <Link className="underline" href="/case-studies">Case studies</Link>
        </nav>
      </main>
    </div>
  );
}
