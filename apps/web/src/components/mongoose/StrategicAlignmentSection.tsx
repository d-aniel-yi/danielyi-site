"use client";

interface StrategicAlignmentSectionProps {
  priority: string;
  description: string;
  mongooseAlignment: string;
  opportunities: string[];
  isEven: boolean;
}

export function StrategicAlignmentSection({
  priority,
  description,
  mongooseAlignment,
  opportunities,
  isEven,
}: StrategicAlignmentSectionProps) {
  return (
    <section 
      className="scroll-section min-h-screen flex items-center py-20 relative z-10"
      style={{ backgroundColor: isEven ? 'var(--op-white)' : '#f9f9f9' }}
    >
      <div className="max-w-6xl mx-auto px-8 w-full">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Priority Info */}
          <div className={`${isEven ? 'md:order-1' : 'md:order-2'}`}>
            <h2 
              className="display-serif text-4xl md:text-5xl font-bold mb-4"
              data-animate
              data-delay="100"
              style={{ color: 'var(--op-black)' }}
            >
              {priority}
            </h2>
            
            <p 
              className="text-lg mb-6"
              data-animate
              data-delay="200"
              style={{ color: 'var(--op-gray)' }}
            >
              {description}
            </p>
          </div>

          {/* Mongoose Alignment */}
          <div className={`space-y-6 ${isEven ? 'md:order-2' : 'md:order-1'}`}>
            <div 
              className="rounded-xl p-6 shadow-sm target-card"
              data-animate
              data-delay="300"
              style={{ backgroundColor: 'var(--op-white)', borderWidth: '1px', borderColor: 'var(--op-gray)' }}
            >
              <h3 
                className="text-sm uppercase tracking-wider font-semibold mb-3"
                style={{ color: 'var(--op-gray-2)' }}
              >
                Mongoose Platform Alignment
              </h3>
              <p className="leading-relaxed text-sm mb-4" style={{ color: 'var(--op-dark-gray)' }}>{mongooseAlignment}</p>
              
              {opportunities.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs font-semibold mb-2" style={{ color: 'var(--op-gray-2)' }}>Expansion Opportunities:</p>
                  <ul className="text-sm space-y-1 list-disc pl-5" style={{ color: 'var(--op-dark-gray)' }}>
                    {opportunities.map((opp, idx) => (
                      <li key={idx}>{opp}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

