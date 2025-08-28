export function Hero() {
  return (
    <section className="relative h-[100svh] overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 -z-20"
        style={{
          backgroundImage: "url(/hero-background.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />
      {/* Gradient overlay for depth/readability */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(1100px 520px at 50% -15%, rgba(0,0,0,0.28), transparent), linear-gradient(180deg, rgba(0,0,0,0.18), rgba(0,0,0,0.04))",
        }}
      />

      <div className="absolute inset-0 grid grid-rows-[1fr_auto_auto_80px]">
        <div className="row-start-1" />
        <div className="row-start-2 px-6 max-w-6xl mx-auto">
          <h1 className="display-serif text-[clamp(40px,8vw,88px)] font-normal leading-[1.05] tracking-[-0.01em] text-left">
            The expertise that builds
            <br />
            <em className="italic">systems, wherever they form.</em>
          </h1>
        </div>
        <div className="row-start-3 px-6 max-w-6xl mx-auto mt-3">
          <p className="max-w-xl text-base md:text-lg text-black/65 dark:text-white/65 text-left">
            Product taste, sales rigor, and technical delivery — together.
          </p>
        </div>
        <div className="row-start-4 self-end px-6 max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10 items-center">
          <Metric label="Projects Delivered" value="47" />
          <Divider />
          <Metric label="Client Retention" value="94%" />
          <Divider className="hidden md:block" />
          <Metric label="Revenue Generated" value="$2.3M" />
          <Divider className="hidden md:block" />
          <Metric label="Years Experience" value="8" />
        </div>
      </div>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1 text-left md:text-center">
      <div className="text-[11px] uppercase tracking-[0.2em] text-black/55 dark:text-white/55">
        {label}
      </div>
      <div className="text-[22px] md:text-[26px] font-medium tracking-[-0.01em]">{value}</div>
    </div>
  );
}

function Divider({ className = "" }: { className?: string }) {
  return <div className={`hidden md:block h-full w-px bg-black/10 dark:bg-white/10 ${className}`} />;
}


