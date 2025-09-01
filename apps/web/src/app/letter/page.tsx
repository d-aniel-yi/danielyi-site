import type { Metadata } from "next";
import { PrintButton } from "@/components/resume/PrintButton";

export const metadata: Metadata = {
  title: "Dear Reader — Letter",
  description: "A thoughtfully designed letter template for a concise, compelling cover letter.",
};

export default function LetterPage() {
  const today = new Date().toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <header className="mb-8 flex items-center justify-between gap-4">
        <div>
          <h1 className="display-serif text-4xl tracking-[-0.01em]">Dear Reader</h1>
          <p className="mt-2 text-black/70 dark:text-white/70 max-w-2xl">
            A clean, reader‑friendly cover letter layout. Replace the placeholders with your note — then print or save to PDF.
          </p>
        </div>
        <PrintButton />
      </header>

      <article className="rounded-2xl border border-black/10 dark:border-white/10 bg-white/5 dark:bg-black/15 p-6 md:p-8">
        <div className="text-sm text-black/60 dark:text-white/60">{today}</div>

        <div className="mt-6 grid gap-1 text-sm text-black/70 dark:text-white/70">
          <div>Hiring Team</div>
          <div>Company Name</div>
          <div>City, State</div>
        </div>

        <div className="mt-6 leading-relaxed text-[15px] md:text-[16px]">
          <p>Dear Reader,</p>

          <p className="mt-4">
            Thank you for taking the time to review my application. I built this site — frontend, infrastructure, and automation — to
            demonstrate the same rigor and ownership I bring to the work. It reflects my approach: concise, design‑forward, and production‑ready.
          </p>

          <p className="mt-4">
            In short, I’m a top‑performing AE who ships. I partner credibly with engineers, translate customer context into crisp action,
            and hold a high bar for execution. If we work together, you’ll have someone who moves fast, sweats the details, and
            communicates clearly.
          </p>

          <p className="mt-4">
            I would welcome a conversation to share context on my track record and to learn more about what success looks like on your team.
            I’ve included a short selection of projects and technical notes on this site for additional detail.
          </p>

          <p className="mt-4">With appreciation,</p>

          <div className="mt-6">
            <div className="font-medium tracking-[-0.01em]">Daniel Yi</div>
            <div className="text-black/60 dark:text-white/60 text-sm">San Francisco, CA • daniel@example.com • da.nielyi.com</div>
          </div>
        </div>
      </article>
    </div>
  );
}


