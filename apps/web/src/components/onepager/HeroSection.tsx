"use client";

export function HeroSection() {
  return (
    <section 
      className="scroll-section hero-section h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white sticky top-0"
    >
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-8 text-center">
        <h1 
          className="display-serif text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6"
          data-animate
          data-delay="0"
        >
          Spearbit/Cantina Targeting
        </h1>
        
        <p 
          className="text-xl md:text-2xl text-slate-300 mb-8"
          data-animate
          data-delay="200"
        >
          Strategic target analysis for high-value Web3 security clients
        </p>
        
        <div data-animate data-delay="400">
          <p className="text-sm uppercase tracking-widest text-slate-400 mb-4">
            Prepared by Daniel Yi
          </p>
          <div className="inline-flex items-center gap-2 text-slate-400 text-sm animate-bounce">
            <span>Scroll to explore</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
