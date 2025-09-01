"use client";
import { useRef, useState } from "react";
import dynamic from "next/dynamic";
const LiquidGlass = dynamic(() => import("liquid-glass-react"), { ssr: false });

export default function ContactPage() {
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    // For v1, we only show a friendly notice and reset the form
    const form = event.currentTarget;
    setTimeout(() => {
      setNotice("Feature coming soon");
      form.reset();
      setSubmitting(false);
    }, 400);
  }

  return (
    <div className="mx-auto max-w-2xl px-4">
      <h1 className="display-serif text-3xl tracking-[-0.01em] mb-2">Contact</h1>
      <p className="text-sm text-black/70 dark:text-white/70 mb-6">Reach me directly — I’ll reply via email.</p>

      {notice && (
        <div className="mb-4 rounded-md border-subtle border px-3 py-2 text-sm bg-white/40 dark:bg-white/10">
          {notice}
        </div>
      )}

      <div ref={containerRef} className="relative rounded-2xl border-subtle border bg-white/30 dark:bg-white/10 p-4 md:p-6 backdrop-blur-md overflow-hidden">
        <span className="pointer-events-none absolute inset-0 z-0 opacity-70">
          <LiquidGlass
            mouseContainer={containerRef}
            blurAmount={0.18}
            elasticity={0.28}
            saturation={140}
            cornerRadius={16}
            className="h-full w-full"
          >
            <div className="h-full w-full" />
          </LiquidGlass>
        </span>
        <div className="relative z-10">
          <form onSubmit={onSubmit} className="grid gap-4">
            <label className="grid gap-1">
              <span className="text-sm">Name</span>
              <input name="name" required className="rounded px-3 py-2 bg-transparent"/>
            </label>
            <label className="grid gap-1">
              <span className="text-sm">Email</span>
              <input type="email" name="email" required className="rounded px-3 py-2 bg-transparent"/>
            </label>
            <label className="grid gap-1">
              <span className="text-sm">Message</span>
              <textarea name="message" rows={5} required className="rounded px-3 py-2 bg-transparent"/>
            </label>
            <button disabled={submitting} className="btn-primary inline-flex items-center justify-center rounded px-4 py-2 text-sm disabled:opacity-50">
              {submitting ? 'Sending…' : 'Send'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}


