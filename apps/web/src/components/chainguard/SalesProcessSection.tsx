"use client";

export function SalesProcessSection() {
  return (
    <section 
      className="scroll-section min-h-screen flex items-center py-20 relative z-10"
      style={{ backgroundColor: 'var(--cg-white)' }}
    >
      <div className="max-w-4xl mx-auto px-8 w-full">
        <div className="mb-12">
          <h2 
            className="display-serif text-5xl md:text-6xl font-bold mb-6"
            data-animate
            data-delay="0"
            style={{ color: 'var(--cg-black)' }}
          >
            A Note on Sales Philosophy
          </h2>
        </div>

        <div 
          className="space-y-6 leading-relaxed"
          data-animate
          data-delay="100"
          style={{ color: 'var(--cg-dark-gray)' }}
        >
          <p className="text-lg">
           I&apos;ve got a hot take: sales methodologies (mostly) boil down to the same core principles.
          </p>
            
          <p className="text-lg">
          MEDDIC/MEDDPICC, BANT, value-based selling, challenger selling, gap selling, Sandler, etc - no matter which methodology I study, learn about, or am trained on, they all are reconfigurations of active listening, targeting business value, and clear communication.
          </p>
          <p className="text-lg">
            This isn&apos;t to say that I have the secret sauce, it&apos;s more that rather than the exact methodology, I believe that it&apos;s more about the execution and discipline.
          </p>
          <p className="text-lg">
            There&apos;s a fine line between efficiency of process and creativity, and I think the art of sales is in finding that balance to qualify prospects quickly and efficiently (this is where MEDDIC/BANT type of frameworks really shine). 
          </p>
          <p className="text-lg">
          Quick qualification, combined with the execution of a strong discovery to uncover real business needs, the ability to connect the dots between different stakeholder&apos;s individual KPI&apos;s/business objectives to real product value, and the discipline to consistently perform the inputs that we all know lead to more opportunities are what I truly believe to be at the core of a successful sales process.
          </p>
          <p className="text-lg">
            I know this is a bit of an oversimplication of sales, but I&apos;ve got a lot to say about a successful sales process and a track record to prove it. If you&apos;re interested in learning more, I&apos;d love to turn this into a two-way conversation. I also have a <a href="/resume" className="underline hover:no-underline transition" style={{ color: 'var(--cg-primary)' }}>copy of my resume</a> and a <a href="/letter" className="underline hover:no-underline transition" style={{ color: 'var(--cg-primary)' }}>letter to any website visitors</a> that you can check out. 
          </p>
        </div>
      </div>
    </section>
  );
}

