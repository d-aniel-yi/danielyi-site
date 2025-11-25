"use client";

interface GoalWithActions {
  goal: string;
  actions: string[];
}

interface BeforeDayZeroSectionProps {
  goals: GoalWithActions[];
}

export function BeforeDayZeroSection({
  goals,
}: BeforeDayZeroSectionProps) {
  return (
    <section 
      className="scroll-section min-h-screen flex items-center py-20 relative z-10"
      style={{ backgroundColor: 'var(--cg-white)' }}
    >
      <div className="max-w-6xl mx-auto px-8 w-full">
        <div className="grid md:grid-cols-12 gap-8 items-start">
          {/* Left Column - Days & Title */}
          <div className="md:col-span-4">
            <div 
              data-animate
              data-delay="0"
              className="mb-6"
            >
              <div 
                className="inline-flex items-center justify-center w-24 h-24 rounded-full text-4xl font-bold mb-4"
                style={{ backgroundColor: 'var(--cg-dark-gray)', color: 'var(--cg-white)' }}
              >
                0
              </div>
              <div className="text-sm uppercase tracking-wider mb-2" style={{ color: 'var(--cg-gray)' }}>
                Before Day 1
              </div>
            </div>
            
            <h2 
              className="display-serif text-4xl md:text-5xl font-bold mb-4"
              data-animate
              data-delay="100"
              style={{ color: 'var(--cg-black)' }}
            >
              Pre-Start Preparation
            </h2>
            
            <p 
              className="text-lg mb-8 leading-relaxed"
              data-animate
              data-delay="200"
              style={{ color: 'var(--cg-primary-dark)' }}
            >
              What I&apos;ll accomplish before my first day
            </p>
          </div>

          {/* Right Column - Content */}
          <div className="md:col-span-8 space-y-8">
            {goals.map((item, index) => (
              <div 
                key={index}
                className="pl-6"
                data-animate
                data-delay={300 + (index * 100)}
                style={{ borderLeft: '3px solid var(--cg-primary)' }}
              >
                <h3 
                  className="text-lg font-bold mb-3"
                  style={{ color: 'var(--cg-black)' }}
                >
                  {item.goal}
                </h3>
                <ul className="space-y-2">
                  {item.actions.map((action, actionIndex) => (
                    <li key={actionIndex} className="text-sm leading-relaxed" style={{ color: 'var(--cg-dark-gray)' }}>
                      {action}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

