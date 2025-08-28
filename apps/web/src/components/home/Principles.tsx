export function Principles() {
  const items = [
    {
      title: "Technical fluency",
      blurb:
        "I partner credibly with engineers. I ship working software and make pragmatic trade‑offs.",
    },
    {
      title: "Sales rigor",
      blurb:
        "Metric‑driven execution. Clear next steps, multi‑threading, and crisp executive narratives.",
    },
    {
      title: "Product taste",
      blurb:
        "Editorial, fast, accessible. Details and polish that signal care and capability.",
    },
  ];

  return (
    <section className="py-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-12">
          <h2 className="display-serif text-3xl md:text-4xl tracking-[-0.01em]">Principles</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {items.map((it) => (
            <article
              key={it.title}
              className="rounded-xl border border-black/10 dark:border-white/10 p-6 bg-white/70 dark:bg-black/30 backdrop-blur"
            >
              <h3 className="text-lg font-semibold mb-2">{it.title}</h3>
              <p className="text-black/70 dark:text-white/70 leading-relaxed">{it.blurb}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}


