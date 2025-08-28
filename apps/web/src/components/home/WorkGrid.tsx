"use client";
import { useEffect, useRef } from "react";

type WorkItem = {
  title: string;
  subtitle: string;
  blurb: string;
};

const items: WorkItem[] = [
  {
    title: "AE → Full-stack delivery",
    subtitle: "This site",
    blurb: "Resume-as-product: Next.js, AWS CDK, API/Lambda, DynamoDB, SES, CloudFront/S3.",
  },
  {
    title: "Pipeline systems",
    subtitle: "CRM & automation",
    blurb: "Designed data flows and automation to turn leads into qualified revenue.",
  },
  {
    title: "Executive storytelling",
    subtitle: "Value narrative",
    blurb: "Metric-first outcomes to align technical capability with business impact.",
  },
  {
    title: "Performance & DX",
    subtitle: "Quality at speed",
    blurb: "Lighthouse budgets, CI/CD, observability — rigor applied end-to-end.",
  },
];

export function WorkGrid() {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const els = Array.from(root.querySelectorAll<HTMLElement>("[data-reveal]"));
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.setAttribute("data-visible", "true");
            obs.unobserve(e.target);
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} className="py-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-12">
          <h2 className="display-serif text-3xl md:text-4xl tracking-[-0.01em]">Work</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {items.map((it, idx) => (
            <article
              key={it.title}
              data-reveal
              style={{ transitionDelay: `${idx * 60}ms` }}
              className="border border-black/10 dark:border-white/10 rounded-xl p-6 bg-white/65 dark:bg-black/30 backdrop-blur will-change-transform translate-y-4 opacity-0 [transition:opacity_600ms_ease,transform_600ms_ease] data-[visible='true']:opacity-100 data-[visible='true']:translate-y-0"
            >
              <div className="text-sm text-black/60 dark:text-white/60">{it.subtitle}</div>
              <h3 className="text-xl font-medium mt-1 mb-2">{it.title}</h3>
              <p className="text-black/70 dark:text-white/70 leading-relaxed">{it.blurb}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}


