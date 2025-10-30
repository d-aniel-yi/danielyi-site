"use client";

interface TargetSectionProps {
  number: number;
  title: string;
  subtitle: string;
  logo?: string;  // Optional logo path
  rationale: string;
  approach: string;
  value: string;
  bonus?: string;  // Optional bonus section
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
}: TargetSectionProps) {
  return (
    <section 
      className="scroll-section min-h-screen flex items-center py-20 relative z-10"
      style={{ backgroundColor: isEven ? 'var(--op-white)' : '#f9f9f9' }}
    >
      <div className="max-w-6xl mx-auto px-8 w-full">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Number Badge & Logo */}
          <div className={`${isEven ? 'md:order-1' : 'md:order-2'}`}>
            <div data-animate data-delay="0" className="flex items-center gap-4 mb-6">
              <div 
                className="inline-flex items-center justify-center w-20 h-20 rounded-full text-3xl font-bold shadow-lg flex-shrink-0"
                style={{ 
                  background: 'linear-gradient(135deg, var(--op-accent) 0%, var(--op-accent-darker) 100%)',
                  color: 'var(--op-black)'
                }}
              >
                {number}
              </div>
              
              {logo && (
                <div 
                  className="flex items-center justify-center p-4 rounded-xl shadow-sm flex-shrink-0"
                  style={{ 
                    backgroundColor: 'var(--op-white)', 
                    borderWidth: '1px', 
                    borderColor: 'var(--op-gray)',
                    width: '120px',
                    height: '80px'
                  }}
                >
                  <img 
                    src={logo} 
                    alt={`${title} logo`} 
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              )}
            </div>
            
            <h2 
              className="display-serif text-4xl md:text-5xl font-bold mb-3"
              data-animate
              data-delay="100"
              style={{ color: 'var(--op-black)' }}
            >
              {title}
            </h2>
            
            <p 
              className="text-xl mb-8"
              data-animate
              data-delay="200"
              style={{ color: 'var(--op-gray)' }}
            >
              {subtitle}
            </p>
          </div>

          {/* Content */}
          <div className={`space-y-6 ${isEven ? 'md:order-2' : 'md:order-1'}`}>
            <div 
              className="rounded-xl p-6 shadow-sm"
              data-animate
              data-delay="300"
              style={{ backgroundColor: 'var(--op-white)', borderWidth: '1px', borderColor: 'var(--op-gray)' }}
            >
              <h3 
                className="text-sm uppercase tracking-wider font-semibold mb-3"
                style={{ color: 'var(--op-gray-2)' }}
              >
                Why This Target
              </h3>
              <p className="leading-relaxed text-sm" style={{ color: 'var(--op-dark-gray)' }}>{rationale}</p>
            </div>

            <div 
              className="rounded-xl p-6 shadow-sm"
              data-animate
              data-delay="400"
              style={{ 
                backgroundColor: 'var(--op-white)', 
                borderWidth: '1px', 
                borderLeftWidth: '4px',
                borderColor: 'var(--op-gray)',
                borderLeftColor: 'var(--op-accent)'
              }}
            >
              <h3 
                className="text-sm uppercase tracking-wider font-semibold mb-3"
                style={{ color: 'var(--op-accent-darker)' }}
              >
                Use Case & Approach
              </h3>
              <p className="leading-relaxed text-sm" style={{ color: 'var(--op-dark-gray)' }}>{approach}</p>
            </div>

            <div 
              className="rounded-xl p-6 shadow-sm"
              data-animate
              data-delay="500"
              style={{ backgroundColor: 'var(--op-white)', borderWidth: '1px', borderColor: 'var(--op-gray)' }}
            >
              <h3 
                className="text-sm uppercase tracking-wider font-semibold mb-3"
                style={{ color: 'var(--op-gray-2)' }}
              >
                Capital Potential
              </h3>
              <p className="leading-relaxed text-sm" style={{ color: 'var(--op-dark-gray)' }}>{value}</p>
            </div>

            {bonus && (
              <div 
                className="rounded-xl p-6 shadow-sm"
                data-animate
                data-delay="600"
                style={{ 
                  backgroundColor: 'var(--op-white)', 
                  borderWidth: '1px', 
                  borderLeftWidth: '4px',
                  borderColor: 'var(--op-gray)',
                  borderLeftColor: 'var(--op-accent)'
                }}
              >
                <h3 
                  className="text-sm uppercase tracking-wider font-semibold mb-3"
                  style={{ color: 'var(--op-accent-darker)' }}
                >
                  Bonus
                </h3>
                <p className="leading-relaxed text-sm" style={{ color: 'var(--op-dark-gray)' }}>{bonus}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

