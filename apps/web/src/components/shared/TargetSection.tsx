"use client";

export interface TargetProps {
  number: number;
  title: string;
  subtitle: string;
  logo: string;
  rationale: string;
  approach: string;
  value: string;
  bonus?: string;
  isEven: boolean;
}

export function TargetSection({
  number,
  title,
  subtitle,
  logo,
  rationale,
  approach,
  value,
  bonus,
  isEven,
}: TargetProps) {
  return (
    <section
      className="scroll-section min-h-screen flex items-center py-20 relative z-10"
      style={{ backgroundColor: 'var(--op-white)' }}
    >
      <div className="max-w-7xl mx-auto px-8 w-full">
        <div className={`grid md:grid-cols-2 gap-12 items-center ${isEven ? '' : 'md:flex-row-reverse'}`}>
          {/* Image Column */}
          <div
            className={`${isEven ? 'md:order-1' : 'md:order-2'}`}
            data-animate
            data-delay="0"
          >
            <div
              className="target-card rounded-2xl p-8 shadow-lg flex items-center justify-center"
              style={{
                backgroundColor: 'var(--op-white)',
                borderWidth: '2px',
                borderColor: 'var(--op-gray)',
                minHeight: '400px'
              }}
            >
              <img
                src={logo}
                alt={`${title} logo`}
                className="max-w-full max-h-80 object-contain"
              />
            </div>
          </div>

          {/* Content Column */}
          <div className={`${isEven ? 'md:order-2' : 'md:order-1'}`}>
            {/* Number Badge */}
            <div
              className="inline-flex items-center justify-center w-12 h-12 rounded-full text-xl font-bold mb-4"
              data-animate
              data-delay="0"
              style={{ backgroundColor: 'var(--op-accent)', color: 'var(--op-black)' }}
            >
              {number}
            </div>

            {/* Title */}
            <h2
              className="display-serif text-4xl md:text-5xl font-bold mb-2"
              data-animate
              data-delay="100"
              style={{ color: 'var(--op-black)' }}
            >
              {title}
            </h2>

            {/* Subtitle */}
            <p
              className="text-lg mb-8"
              data-animate
              data-delay="200"
              style={{ color: 'var(--op-gray)' }}
            >
              {subtitle}
            </p>

            {/* Rationale */}
            <div
              className="mb-6 pl-4"
              data-animate
              data-delay="300"
              style={{ borderLeft: '4px solid var(--op-accent-darker)' }}
            >
              <h4 className="font-bold mb-2 text-lg" style={{ color: 'var(--op-black)' }}>
                Rationale
              </h4>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--op-dark-gray)' }}>
                {rationale}
              </p>
            </div>

            {/* Approach */}
            <div
              className="mb-6 pl-4"
              data-animate
              data-delay="400"
              style={{ borderLeft: '4px solid var(--op-dark-gray)' }}
            >
              <h4 className="font-bold mb-2 text-lg" style={{ color: 'var(--op-black)' }}>
                Approach
              </h4>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--op-dark-gray)' }}>
                {approach}
              </p>
            </div>

            {/* Value */}
            <div
              className="mb-6 pl-4"
              data-animate
              data-delay="500"
              style={{ borderLeft: '4px solid var(--op-accent)' }}
            >
              <h4 className="font-bold mb-2 text-lg" style={{ color: 'var(--op-black)' }}>
                Capital Potential
              </h4>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--op-dark-gray)' }}>
                {value}
              </p>
            </div>

            {/* Bonus (optional) */}
            {bonus && (
              <div
                className="pl-4 rounded-lg p-4"
                data-animate
                data-delay="600"
                style={{
                  backgroundColor: 'var(--op-accent-dark)',
                  borderLeft: '4px solid var(--op-accent)'
                }}
              >
                <h4 className="font-bold mb-2 text-lg" style={{ color: 'var(--op-black)' }}>
                  Bonus
                </h4>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--op-dark-gray)' }}>
                  {bonus}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
