"use client";

export function IntroSection() {
  return (
    <section 
      className="scroll-section min-h-screen flex items-center py-20 relative z-10"
      style={{ backgroundColor: 'var(--op-white)' }}
    >
      <div className="max-w-5xl mx-auto px-8 w-full">
        <div className="text-center mb-16">
          <h2 
            className="display-serif text-5xl md:text-6xl font-bold mb-4"
            data-animate
            data-delay="0"
            style={{ color: 'var(--op-black)' }}
          >
            Current State & Context
          </h2>
          <p 
            className="text-lg max-w-2xl mx-auto"
            data-animate
            data-delay="100"
            style={{ color: 'var(--op-gray)' }}
          >
            Understanding the foundation for expansion
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Current Customer State */}
          <div 
            className="rounded-2xl p-8 shadow-lg"
            data-animate
            data-delay="200"
            style={{ backgroundColor: 'var(--op-white)', borderWidth: '1px', borderColor: 'var(--op-gray)' }}
          >
            <h3 className="text-2xl font-bold mb-6" style={{ color: 'var(--op-black)' }}>
              Current Customer Profile
            </h3>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm font-semibold mb-2" style={{ color: 'var(--op-black)' }}>Current ARR:</p>
                <p className="text-sm" style={{ color: 'var(--op-dark-gray)' }}>$27,500 per year</p>
              </div>
              <div>
                <p className="text-sm font-semibold mb-2" style={{ color: 'var(--op-black)' }}>Current Products:</p>
                <ul className="text-sm space-y-1 list-disc pl-5" style={{ color: 'var(--op-dark-gray)' }}>
                  <li>Mongoose Text (Admissions & Advancement)</li>
                  <li>Mongoose Chat (Admissions & Advancement)</li>
                </ul>
              </div>
              <div>
                <p className="text-sm font-semibold mb-2" style={{ color: 'var(--op-black)' }}>Status:</p>
                <p className="text-sm" style={{ color: 'var(--op-dark-gray)' }}>Satisfied, stable, no renewal concerns</p>
              </div>
            </div>
          </div>

          {/* University Context */}
          <div 
            className="rounded-2xl p-8 shadow-lg"
            data-animate
            data-delay="200"
            style={{ backgroundColor: 'var(--op-white)', borderWidth: '1px', borderColor: 'var(--op-gray)' }}
          >
            <h3 className="text-2xl font-bold mb-6" style={{ color: 'var(--op-black)' }}>
              University Profile
            </h3>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm font-semibold mb-2" style={{ color: 'var(--op-black)' }}>Student Population:</p>
                <p className="text-sm" style={{ color: 'var(--op-dark-gray)' }}>20,000 students</p>
              </div>
              <div>
                <p className="text-sm font-semibold mb-2" style={{ color: 'var(--op-black)' }}>Technology Stack:</p>
                <ul className="text-sm space-y-1 list-disc pl-5" style={{ color: 'var(--op-dark-gray)' }}>
                  <li>Ellucian CRM</li>
                  <li>Ellucian SIS</li>
                </ul>
              </div>
              <div>
                <p className="text-sm font-semibold mb-2" style={{ color: 'var(--op-black)' }}>Strategic Plan:</p>
                <p className="text-sm" style={{ color: 'var(--op-dark-gray)' }}>Five priorities through 2030</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
