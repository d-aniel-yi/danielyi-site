export function TrustedBy() {
  const partners = ["Stripe", "Notion", "Linear", "Vercel", "Framer", "Datadog", "Snowflake", "OpenAI", "GitHub", "Cloudflare"];
  const row = [...partners, ...partners];
  return (
    <section className="py-12 select-none">
      <div className="max-w-6xl mx-auto px-4">
        <div className="overflow-hidden">
          <div
            className="flex gap-10 whitespace-nowrap will-change-transform"
            style={{ animation: "marquee 30s linear infinite" }}
          >
            {row.map((p, i) => (
              <div key={`${p}-${i}`} className="text-black/60 dark:text-white/60 text-lg tracking-wide">
                {p}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}


