"use client";

export function HeroSection() {
  return (
    <section 
      className="scroll-section hero-section h-screen flex items-center justify-center relative overflow-hidden text-white sticky top-0"
      style={{ backgroundColor: 'var(--op-black)' }}
    >
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-20">
        <div 
          className="absolute top-20 left-20 w-72 h-72 rounded-full blur-3xl animate-pulse" 
          style={{ backgroundColor: 'var(--op-accent)' }}
        />
        <div 
          className="absolute bottom-20 right-20 w-96 h-96 rounded-full blur-3xl animate-pulse" 
          style={{ backgroundColor: 'var(--op-accent-dark)', animationDelay: '1s' }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 md:px-8 text-center">
        <h1 
          className="display-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight mb-4 sm:mb-6 leading-[1.1]"
          data-animate
          data-delay="0"
        >
          Spearbit/Cantina Targeting
        </h1>
        
        <p 
          className="text-base sm:text-lg md:text-xl lg:text-2xl mb-6 sm:mb-8 px-4 leading-relaxed"
          data-animate
          data-delay="200"
          style={{ color: 'var(--op-gray)' }}
        >
          Strategic target analysis for high-value Web3 security clients
        </p>
        
        <div data-animate data-delay="400" className="space-y-6">
          <p className="text-xs sm:text-sm uppercase tracking-wider sm:tracking-widest" style={{ color: 'var(--op-gray)' }}>
            Prepared by Daniel Yi
          </p>
          
          {/* PDF Download Button */}
          <div className="flex justify-center">
            <a
              href="/onepager/Spearbit_Cantina Targeting.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-sm transition-all hover:scale-105 active:scale-95"
              style={{ 
                backgroundColor: 'var(--op-accent)', 
                color: 'var(--op-black)',
                boxShadow: '0 4px 12px rgba(35, 221, 190, 0.3)'
              }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <span>View/Download PDF</span>
            </a>
          </div>
          
          <div className="inline-flex items-center gap-2 text-xs sm:text-sm" style={{ color: 'var(--op-gray)' }}>
            <span>or scroll to explore</span>
            <svg className="w-4 h-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
