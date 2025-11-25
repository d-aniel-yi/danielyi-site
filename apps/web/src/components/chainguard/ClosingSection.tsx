"use client";

export function ClosingSection() {
  return (
    <section 
      className="scroll-section min-h-screen flex items-center justify-center py-20 relative z-10"
      style={{ backgroundColor: 'var(--cg-black)' }}
    >
      <div className="max-w-3xl mx-auto px-8 text-center">
        <h2 
          className="display-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white"
          data-animate
          data-delay="0"
        >
          Ready to make this a reality?
        </h2>
        
        <p 
          className="text-2xl md:text-3xl font-light mb-12"
          data-animate
          data-delay="200"
          style={{ color: 'var(--cg-accent)' }}
        >
          Let&apos;s talk.
        </p>
        
        <div 
          data-animate
          data-delay="400"
          className="space-y-6"
        >
          <p 
            className="text-lg font-medium mb-6"
            style={{ color: 'var(--cg-gray)' }}
          >
            — Daniel Yi
          </p>
          
          <div className="space-y-3">
            <a 
              href="tel:+15035458728"
              className="block text-xl font-medium transition-colors hover:underline"
              style={{ color: 'var(--cg-gray)' }}
            >
              503 545 8728
            </a>
            
            <a 
              href="mailto:062daniel.yi@gmail.com"
              className="block text-xl font-medium transition-colors hover:underline"
              style={{ color: 'var(--cg-gray)' }}
            >
              062daniel.yi@gmail.com
            </a>
          </div>

          <div className="mt-12 pt-8 border-t" style={{ borderColor: 'var(--cg-dark-gray)' }}>
            <p className="text-sm" style={{ color: 'var(--cg-gray)' }}>
              Feel free to check out the rest of this site! It features a custom built frontend and backend, hosted on AWS, meant to showcase my learning ability, technical acumen, and creative engine.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

