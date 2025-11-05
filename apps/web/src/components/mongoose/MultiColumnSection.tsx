"use client";

interface MultiColumnSectionProps {
  title: string;
  subtitle?: string;
  leftColumn: {
    title: string;
    items: string[];
  };
  rightColumn: {
    title: string;
    items: string[];
  };
  isEven: boolean;
}

export function MultiColumnSection({
  title,
  subtitle,
  leftColumn,
  rightColumn,
  isEven,
}: MultiColumnSectionProps) {
  return (
    <section 
      className="scroll-section min-h-screen flex items-center py-20 relative z-10"
      style={{ backgroundColor: isEven ? 'var(--op-white)' : '#f9f9f9' }}
    >
      <div className="max-w-6xl mx-auto px-8 w-full">
        <div className="text-center mb-12">
          <h2 
            className="display-serif text-4xl md:text-5xl font-bold mb-4"
            data-animate
            data-delay="0"
            style={{ color: 'var(--op-black)' }}
          >
            {title}
          </h2>
          {subtitle && (
            <p 
              className="text-lg max-w-2xl mx-auto"
              data-animate
              data-delay="100"
              style={{ color: 'var(--op-gray)' }}
            >
              {subtitle}
            </p>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column */}
          <div 
            className="rounded-xl p-6 shadow-sm target-card"
            data-animate
            data-delay="200"
            style={{ backgroundColor: 'var(--op-white)', borderWidth: '1px', borderColor: 'var(--op-gray)' }}
          >
            <h3 
              className="text-xl font-bold mb-4"
              style={{ color: 'var(--op-black)' }}
            >
              {leftColumn.title}
            </h3>
            <ul className="space-y-2 list-disc pl-5">
              {leftColumn.items.map((item, idx) => (
                <li key={idx} className="text-sm leading-relaxed" style={{ color: 'var(--op-dark-gray)' }}>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Right Column */}
          <div 
            className="rounded-xl p-6 shadow-sm target-card"
            data-animate
            data-delay="300"
            style={{ backgroundColor: 'var(--op-white)', borderWidth: '1px', borderColor: 'var(--op-gray)' }}
          >
            <h3 
              className="text-xl font-bold mb-4"
              style={{ color: 'var(--op-black)' }}
            >
              {rightColumn.title}
            </h3>
            <ul className="space-y-2 list-disc pl-5">
              {rightColumn.items.map((item, idx) => (
                <li key={idx} className="text-sm leading-relaxed" style={{ color: 'var(--op-dark-gray)' }}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

