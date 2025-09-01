import Link from "next/link";

export function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <header className="mb-3">
      <h2 className="display-serif text-2xl tracking-[-0.01em]">{title}</h2>
      {subtitle && <p className="mt-1 text-sm text-black/70 dark:text-white/70">{subtitle}</p>}
    </header>
  );
}

export function KeyValue({ items }: { items: Array<{ key: string; value: string }> }) {
  return (
    <div className="grid gap-y-2 text-sm">
      {items.map((r, i) => (
        <div key={i} className="grid grid-cols-[max-content_1fr] gap-x-3 items-baseline">
          <div className="font-medium opacity-90 whitespace-nowrap">{r.key}</div>
          <div className="min-w-0 opacity-80 break-words whitespace-normal leading-relaxed">{r.value}</div>
        </div>
      ))}
    </div>
  );
}

export function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full overflow-hidden rounded-2xl border border-black/10 dark:border-white/10 bg-white/5 dark:bg-black/15 p-5 min-h-[180px] break-normal">
      {children}
    </div>
  );
}

export function CodeInline({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded bg-black/5 dark:bg-white/10 px-1.5 py-0.5 text-[90%]">{children}</code>
  );
}


