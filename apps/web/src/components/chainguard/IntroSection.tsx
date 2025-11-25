"use client";

export function IntroSection() {
  return (
    <section 
      className="scroll-section min-h-screen flex items-center py-20 relative z-10"
      style={{ backgroundColor: 'var(--cg-white)' }}
    >
      <div className="max-w-4xl mx-auto px-8 w-full">
        <div className="mb-16">
          <h2 
            className="display-serif text-5xl md:text-6xl font-bold mb-6"
            data-animate
            data-delay="0"
            style={{ color: 'var(--cg-black)' }}
          >
            The Opportunity
          </h2>
          <p 
            className="text-lg leading-relaxed mb-12"
            data-animate
            data-delay="100"
            style={{ color: 'var(--cg-dark-gray)' }}
          >
            Chainguard just secured $280M in Series D funding with a focus on scaling sales, marketing, and R&D. 
            You need AEs who can execute immediately, understand the technical landscape, 
            and deliver measurable results. Here&apos;s why I&apos;m that person and exactly what I&apos;ll be doing to deliver those results.
          </p>
        </div>

        <div className="space-y-8 mb-16">
          {/* Technical Credibility */}
          <div 
            className="pl-6"
            data-animate
            data-delay="200"
            style={{ borderLeft: '3px solid var(--cg-primary)' }}
          >
            <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--cg-black)' }}>
              Technical Credibility
            </h3>
            <p className="leading-relaxed" style={{ color: 'var(--cg-dark-gray)' }}>
              I don&apos;t just sell security—I understand it. My background in building technical products 
              means I can speak the language of CTOs and security teams, building trust through expertise, not just rapport.
            </p>
          </div>

          {/* Proven Execution */}
          <div 
            className="pl-6"
            data-animate
            data-delay="300"
            style={{ borderLeft: '3px solid var(--cg-primary)' }}
          >
            <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--cg-black)' }}>
              Proven Execution
            </h3>
            <p className="leading-relaxed" style={{ color: 'var(--cg-dark-gray)' }}>
              I&apos;ve consistently exceeded targets by focusing on high-value accounts and building 
              strategic relationships. I don&apos;t just hit quota—I build sustainable pipelines 
              that compound quarter over quarter.
            </p>
          </div>

          {/* Strategic Mindset */}
          <div 
            className="pl-6"
            data-animate
            data-delay="400"
            style={{ borderLeft: '3px solid var(--cg-primary)' }}
          >
            <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--cg-black)' }}>
              Strategic Mindset
            </h3>
            <p className="leading-relaxed" style={{ color: 'var(--cg-dark-gray)' }}>
              This entire site demonstrates my ability to think strategically, execute flawlessly, 
              and create value. I don&apos;t just follow playbooks—I create them, refine them, 
              and scale what works.
            </p>
          </div>
        </div>

        {/* Transition indicator */}
        <div 
          className="text-center"
          data-animate
          data-delay="500"
        >
          <p className="text-sm mb-2" style={{ color: 'var(--cg-gray)' }}>The Plan</p>
          <div className="inline-flex items-center gap-2" style={{ color: 'var(--cg-primary)' }}>
            <svg className="w-4 h-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}

