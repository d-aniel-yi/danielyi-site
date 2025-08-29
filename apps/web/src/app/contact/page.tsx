"use client";
import { useState } from "react";

export default function ContactPage() {
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: data.name, email: data.email, message: data.message }),
      });
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      setDone(true);
      form.reset();
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Unknown error';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-semibold mb-4">Contact</h1>
      <p className="text-sm text-black/70 dark:text-white/70 mb-6">
        Reach me directly — I’ll reply via email.
      </p>

      {done && <div className="mb-4 rounded bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 px-3 py-2 text-sm">Thanks! I’ll get back to you shortly.</div>}
      {error && <div className="mb-4 rounded bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-3 py-2 text-sm">{error}</div>}

      <form onSubmit={onSubmit} className="grid gap-4">
        <label className="grid gap-1">
          <span className="text-sm">Name</span>
          <input name="name" required className="border rounded px-3 py-2 bg-transparent"/>
        </label>
        <label className="grid gap-1">
          <span className="text-sm">Email</span>
          <input type="email" name="email" required className="border rounded px-3 py-2 bg-transparent"/>
        </label>
        <label className="grid gap-1">
          <span className="text-sm">Message</span>
          <textarea name="message" rows={5} required className="border rounded px-3 py-2 bg-transparent"/>
        </label>
        <button disabled={submitting} className="inline-flex items-center justify-center rounded bg-black text-white px-4 py-2 text-sm disabled:opacity-50 dark:bg-white dark:text-black">
          {submitting ? 'Sending…' : 'Send'}
        </button>
      </form>
    </div>
  );
}


