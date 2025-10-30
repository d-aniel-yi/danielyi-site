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
            <h3 className="text-2xl font-bold text-slate-900 mb-6">
              Why Customers Buy
            </h3>
            
            <div className="space-y-6">
              <div className="border-l-4 border-red-500 pl-4">
                <h4 className="font-bold text-slate-900 mb-2 text-lg">Fear</h4>
                <p className="text-sm text-slate-700 leading-relaxed italic mb-2">
                  &ldquo;If my smart contract has any security issues or holes in it, it will be at best useless, and at worst, exploitable.&rdquo;
                </p>
                <ul className="text-sm text-slate-600 space-y-1 list-disc pl-5">
                  <li>Working with the best auditor brings the chances of that fear being realized as close to zero as possible</li>
                  <li>How can we avoid disasters like Poly Network, Ronin Bridge?</li>
                  <li>H1 2025 already had $263M in damages across all Web3</li>
                </ul>
              </div>

              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-bold text-slate-900 mb-2 text-lg">Credibility</h4>
                <p className="text-sm text-slate-700 leading-relaxed italic mb-2">
                  &ldquo;I need assurances in order to secure institutional capital.&rdquo;
                </p>
                <ul className="text-sm text-slate-600 space-y-1 list-disc pl-5">
                  <li>Working with specific auditors who understand the context</li>
                  <li>Having the audit done by a respected name increases confidence</li>
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
            <h3 className="text-2xl font-bold text-slate-900 mb-6">
              Target Qualification
            </h3>
            
            <div className="space-y-5">
              <div>
                <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-900 text-white text-xs">1</span>
                  <span>Use Case</span>
                </h4>
                <ul className="text-sm text-slate-600 space-y-1 list-disc pl-5">
                  <li>Company falls into one or both of the above buckets</li>
                  <li>Strong signal they believe in the value of respected audits</li>
                  <li>Potential for recurring need for audits (bonus)</li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-900 text-white text-xs">2</span>
                  <span>Capital Potential</span>
                </h4>
                <ul className="text-sm text-slate-600 space-y-1 list-disc pl-5">
                  <li>Does the company have money to spend on a top-tier audit?</li>
                  <li>Recent VC funding</li>
                  <li>Large growth signals</li>
                  <li>High recent yield</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Outreach Methodology */}
        <div 
          className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200 mb-12"
          data-animate
          data-delay="400"
        >
          <h3 className="text-2xl font-bold text-slate-900 mb-6">
            General Outreach Methodology
          </h3>
          
          <div className="grid md:grid-cols-4 gap-6">
            <div>
              <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-900 text-white text-sm font-bold mb-3">1</div>
              <h4 className="font-bold text-slate-900 mb-2">Research</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Find companies with a compelling use case and strong potential to be interested.
              </p>
            </div>

            <div>
              <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-900 text-white text-sm font-bold mb-3">2</div>
              <h4 className="font-bold text-slate-900 mb-2">Outreach</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Choose best method based on customer. Warm introduction via connections? Or cold outreach where they are: LinkedIn, Discord, Telegram, email.
              </p>
            </div>

            <div>
              <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-900 text-white text-sm font-bold mb-3">3</div>
              <h4 className="font-bold text-slate-900 mb-2">Cold Outreach</h4>
              <p className="text-sm text-slate-600 leading-relaxed mb-2">
                Personalized, short, straight to the point.
              </p>
              <p className="text-xs text-slate-500 italic">
                &ldquo;Hey xyz, noticed you&apos;re building a new smart contract—open for a conversation about security auditing?&rdquo;
              </p>
            </div>

            <div>
              <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-900 text-white text-sm font-bold mb-3">4</div>
              <h4 className="font-bold text-slate-900 mb-2">Follow Up</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Sales rarely happens on first touch. Balance between being visible and being annoying. Begin sales process once communication is open.
              </p>
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

