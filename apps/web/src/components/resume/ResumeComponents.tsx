import type { ResumeContact, ResumeData, ResumeItem, ResumeSection } from "./ResumeTypes";

export function ResumeHeader({ contact }: { contact: ResumeContact }) {
  return (
    <header className="text-center">
      <h1 className="display-serif text-4xl tracking-[-0.01em]">{contact.name}</h1>
      {contact.title && (
        <p className="mt-1 text-sm opacity-80">{contact.title}</p>
      )}
      <p className="mt-2 text-xs opacity-70">
        {[contact.location, contact.email, contact.website, contact.linkedin, contact.github]
          .filter(Boolean)
          .join(" · ")}
      </p>
    </header>
  );
}

export function ResumeSectionView({ section }: { section: ResumeSection }) {
  return (
    <section className="mt-8 first:mt-0">
      <h2 className="text-sm uppercase tracking-[0.2em] opacity-80">{section.heading}</h2>
      {isTechnicalStrengths(section.heading) ? (
        <div className="mt-3">
          <ResumeTechList bullets={(section.items[0]?.bullets ?? [])} />
        </div>
      ) : (
        <div className="mt-3 space-y-5">
          {section.items.map((it, idx) => (
            <ResumeItemView key={idx} item={it} />)
          )}
        </div>
      )}
    </section>
  );
}

export function ResumeItemView({ item }: { item: ResumeItem }) {
  return (
    <article>
      {(item.company || item.role) && (
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
          <h3 className="font-medium tracking-[-0.01em]">
            {item.role}
            {item.company && item.role ? " · " : ""}
            {item.company}
          </h3>
          {(item.start || item.end || item.location) && (
            <div className="text-xs opacity-70">
              {[item.location, formatDateRange(item.start, item.end)].filter(Boolean).join(" · ")}
            </div>
          )}
        </div>
      )}
      {item.bullets && item.bullets.length > 0 && (
        <ul className="mt-2 list-disc pl-5 text-sm">
          {item.bullets.map((b, i) => (
            <li key={i}>{b}</li>
          ))}
        </ul>
      )}
      {item.technologies && item.technologies.length > 0 && (
        <p className="mt-2 text-xs opacity-70">Tech: {item.technologies.join(", ")}</p>
      )}
    </article>
  );
}

export function ResumeDocument({ data }: { data: ResumeData }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 bg-white/5 dark:bg-black/20 rounded-2xl border border-black/10 dark:border-white/10 print:bg-white print:border-0 print:rounded-none">
      <ResumeHeader contact={data.contact} />
      {data.summary && data.summary.length > 0 && (
        <section className="mt-8">
          <h2 className="text-sm uppercase tracking-[0.2em] opacity-80">Summary</h2>
          <ul className="mt-2 list-disc pl-5 text-sm">
            {data.summary.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </section>
      )}
      {data.sections.map((s, i) => (
        <ResumeSectionView key={i} section={s} />
      ))}
    </div>
  );
}

function formatDateRange(start?: string, end?: string) {
  if (!start && !end) return undefined;
  return `${start ?? ""}${start && end ? " — " : ""}${end ?? "Present"}`;
}

function isTechnicalStrengths(heading: string) {
  const h = heading.toLowerCase();
  return h.includes("technical") || h.includes("strengths");
}

function ResumeTechList({ bullets }: { bullets: string[] }) {
  if (!bullets || bullets.length === 0) return null;
  const rows = bullets
    .map((b) => {
      const [k, ...rest] = b.split(":");
      const key = (k || "").trim();
      const value = rest.join(":").trim();
      return key ? { key, value } : undefined;
    })
    .filter(Boolean) as Array<{ key: string; value: string }>;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
      {rows.map((r, i) => (
        <div key={i} className="flex items-baseline gap-2">
          <div className="min-w-36 font-medium opacity-90">{r.key}</div>
          <div className="opacity-80">{r.value}</div>
        </div>
      ))}
    </div>
  );
}


