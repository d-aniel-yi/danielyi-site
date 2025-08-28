export function Skills() {
  const skills = [
    { n: "01", c: "Frontend Development", i: ["React & TypeScript", "Tailwind & modern CSS", "Performance budgets", "Design systems"] },
    { n: "02", c: "Sales & Strategy", i: ["Pipeline creation", "CRM architecture", "Data-driven insights", "Process automation"] },
    { n: "03", c: "Technical Systems", i: ["API design", "DynamoDB modeling", "Serverless on AWS", "CI/CD & IaC"] },
  ];
  return (
    <section className="py-24">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-light">
            <span className="">Expertise</span>
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-10">
          {skills.map((s) => (
            <div key={s.c}>
              <div className="text-5xl font-extralight text-black/20 dark:text-white/20">{s.n}</div>
              <h3 className="text-xl font-medium mt-4">{s.c}</h3>
              <ul className="mt-4 space-y-2 text-black/70 dark:text-white/70">
                {s.i.map((x) => (
                  <li key={x} className="flex gap-3">
                    <div className="w-1 h-1 mt-2 bg-black/40 dark:bg-white/40 rounded-full" />
                    <span>{x}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


