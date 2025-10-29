interface TargetSectionProps {
  number: number;
  title: string;
  subtitle: string;
  rationale: string;
  approach: string;
  value: string;
  isEven: boolean;
}

export function TargetSection({
  number,
  title,
  subtitle,
  rationale,
  approach,
  value,
  isEven,
}: TargetSectionProps) {
  return (
    <section className={`scroll-section snap-start min-h-screen flex items-center py-20 ${
      isEven ? 'bg-white' : 'bg-slate-50'
    }`}>
      <div className="max-w-6xl mx-auto px-8 w-full">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Number Badge */}
          <div className={`${isEven ? 'md:order-1' : 'md:order-2'}`}>
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 text-white text-3xl font-bold mb-6 shadow-lg">
              {number}
            </div>
            <h2 className="display-serif text-4xl md:text-5xl font-bold text-slate-900 mb-3">
              {title}
            </h2>
            <p className="text-xl text-slate-600 mb-8">{subtitle}</p>
          </div>

          {/* Content */}
          <div className={`space-y-6 ${isEven ? 'md:order-2' : 'md:order-1'}`}>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <h3 className="text-sm uppercase tracking-wider text-slate-500 font-semibold mb-3">
                Why This Target
              </h3>
              <p className="text-slate-700 leading-relaxed">{rationale}</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <h3 className="text-sm uppercase tracking-wider text-slate-500 font-semibold mb-3">
                Approach Strategy
              </h3>
              <p className="text-slate-700 leading-relaxed">{approach}</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <h3 className="text-sm uppercase tracking-wider text-slate-500 font-semibold mb-3">
                Value Proposition
              </h3>
              <p className="text-slate-700 leading-relaxed">{value}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

