"use client";

export function IntroSection() {
  return (
    <section className="scroll-section min-h-screen flex items-center py-20 relative z-10 bg-gradient-to-br from-slate-50 to-white">
      <div className="max-w-5xl mx-auto px-8 w-full">
        <div className="text-center mb-16">
          <h2 
            className="display-serif text-5xl md:text-6xl font-bold text-slate-900 mb-4"
            data-animate
            data-delay="0"
          >
            Framework
          </h2>
          <p 
            className="text-lg text-slate-600 max-w-2xl mx-auto"
            data-animate
            data-delay="100"
          >
            Understanding customer motivations and qualification criteria
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Why Customers Buy */}
          <div 
            className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200"
            data-animate
            data-delay="200"
          >
            <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
              <span className="text-3xl">💡</span>
              <span>Why Customers Buy</span>
            </h3>
            
            <div className="space-y-6">
              <div className="border-l-4 border-red-500 pl-4">
                <h4 className="font-bold text-slate-900 mb-2 text-lg">Fear</h4>
                <p className="text-sm text-slate-700 leading-relaxed italic mb-2">
                  &ldquo;If my smart contract has any security issues or holes in it, it will be at best useless, and at worst, exploitable.&rdquo;
                </p>
                <ul className="text-sm text-slate-600 space-y-1 list-disc pl-5">
                  <li>Working with the best auditor minimizes risk</li>
                  <li>H1 2025: $263M in Web3 damages</li>
                  <li>Avoiding disasters like Poly Network, Ronin Bridge</li>
                </ul>
              </div>

              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-bold text-slate-900 mb-2 text-lg">Credibility</h4>
                <p className="text-sm text-slate-700 leading-relaxed italic mb-2">
                  &ldquo;I need assurances in order to secure institutional capital.&rdquo;
                </p>
                <ul className="text-sm text-slate-600 space-y-1 list-disc pl-5">
                  <li>Auditors who understand the context</li>
                  <li>Respected name increases confidence</li>
                  <li>Essential for institutional investment</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Target Qualification Criteria */}
          <div 
            className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200"
            data-animate
            data-delay="300"
          >
            <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
              <span className="text-3xl">🎯</span>
              <span>Target Qualification</span>
            </h3>
            
            <div className="space-y-5">
              <div>
                <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-900 text-white text-xs">1</span>
                  <span>Use Case Fit</span>
                </h4>
                <ul className="text-sm text-slate-600 space-y-1 list-disc pl-5">
                  <li>Falls into fear and/or credibility bucket</li>
                  <li>Strong signal they value respected audits</li>
                  <li>Potential for recurring audit needs (bonus)</li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-900 text-white text-xs">2</span>
                  <span>Capital Potential</span>
                </h4>
                <ul className="text-sm text-slate-600 space-y-1 list-disc pl-5">
                  <li>Resources to invest in top-tier audits</li>
                  <li>Recent VC funding or strong revenue</li>
                  <li>Large growth signals</li>
                  <li>High recent yield or TVL</li>
                </ul>
              </div>

              <div className="pt-4 border-t border-slate-200">
                <p className="text-xs text-slate-500 italic">
                  Each target is evaluated against these criteria to ensure strategic fit and partnership potential.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Transition indicator */}
        <div 
          className="text-center"
          data-animate
          data-delay="400"
        >
          <p className="text-sm text-slate-500 mb-2">Strategic Targets</p>
          <div className="inline-flex items-center gap-2 text-slate-400">
            <svg className="w-4 h-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}

