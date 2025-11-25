"use client";

interface PlanSectionProps {
  days: string;
  title: string;
  focus: string;
  goals: string[];
  deliverables: string[];
  impact: string;
  isEven: boolean;
}

export function PlanSection({
  days,
  title,
  focus,
  goals,
  deliverables,
  impact,
  isEven,
}: PlanSectionProps) {
  return (
    <section 
      className="scroll-section min-h-screen flex items-center py-20 relative z-10"
      style={{ backgroundColor: isEven ? 'var(--cg-white)' : 'var(--cg-light-gray)' }}
    >
      <div className="max-w-6xl mx-auto px-8 w-full">
        <div className="grid md:grid-cols-12 gap-8 items-start">
          {/* Left Column - Days & Title */}
          <div className={`md:col-span-4 ${isEven ? 'md:order-1' : 'md:order-2'}`}>
            <div 
              data-animate
              data-delay="0"
              className="mb-6"
            >
              <div 
                className="inline-flex items-center justify-center w-24 h-24 rounded-full text-4xl font-bold mb-4"
                style={{ backgroundColor: 'var(--cg-primary)', color: 'var(--cg-white)' }}
              >
                {days}
              </div>
              <div className="text-sm uppercase tracking-wider mb-2" style={{ color: 'var(--cg-gray)' }}>
                Days
              </div>
            </div>
            
            <h2 
              className="display-serif text-4xl md:text-5xl font-bold mb-4"
              data-animate
              data-delay="100"
              style={{ color: 'var(--cg-black)' }}
            >
              {title}
            </h2>
            
            <p 
              className="text-lg mb-8 leading-relaxed"
              data-animate
              data-delay="200"
              style={{ color: 'var(--cg-primary-dark)' }}
            >
              {focus}
            </p>
          </div>

          {/* Right Column - Content */}
          <div className={`md:col-span-8 space-y-8 ${isEven ? 'md:order-2' : 'md:order-1'}`}>
            {/* Goals */}
            <div 
              className="pl-6"
              data-animate
              data-delay="300"
              style={{ borderLeft: '3px solid var(--cg-primary)' }}
            >
              <h3 
                className="text-sm uppercase tracking-wider font-semibold mb-4"
                style={{ color: 'var(--cg-dark-gray)' }}
              >
                Key Goals
              </h3>
              <ul className="space-y-2">
                {goals.map((goal, index) => (
                  <li key={index} className="text-sm leading-relaxed" style={{ color: 'var(--cg-dark-gray)' }}>
                    {goal}
                  </li>
                ))}
              </ul>
            </div>

            {/* Deliverables */}
            <div 
              className="pl-6"
              data-animate
              data-delay="400"
              style={{ borderLeft: '3px solid var(--cg-primary)' }}
            >
              <h3 
                className="text-sm uppercase tracking-wider font-semibold mb-4"
                style={{ color: 'var(--cg-dark-gray)' }}
              >
                Measurable Deliverables
              </h3>
              <ul className="space-y-2">
                {deliverables.map((deliverable, index) => (
                  <li key={index} className="text-sm leading-relaxed" style={{ color: 'var(--cg-dark-gray)' }}>
                    {deliverable}
                  </li>
                ))}
              </ul>
            </div>

            {/* Impact */}
            <div 
              className="pl-6"
              data-animate
              data-delay="500"
              style={{ borderLeft: '3px solid var(--cg-primary)' }}
            >
              <h3 
                className="text-sm uppercase tracking-wider font-semibold mb-3"
                style={{ color: 'var(--cg-dark-gray)' }}
              >
                Expected Impact
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--cg-dark-gray)' }}>
                {impact}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

