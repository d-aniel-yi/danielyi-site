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
            Framework
          </h2>
          <p 
            className="text-lg max-w-2xl mx-auto"
            data-animate
            data-delay="100"
            style={{ color: 'var(--op-gray)' }}
          >
            Understanding customer motivations and qualification criteria
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Why Customers Buy */}
          <div 
            className="rounded-2xl p-8 shadow-lg"
            data-animate
            data-delay="200"
            style={{ backgroundColor: 'var(--op-white)', borderWidth: '1px', borderColor: 'var(--op-gray)' }}
          >
            <h3 className="text-2xl font-bold mb-6" style={{ color: 'var(--op-black)' }}>
              Why Customers Buy
            </h3>
            
            <div className="space-y-6">
              <div className="pl-4" style={{ borderLeft: '4px solid var(--op-accent-darker)' }}>
                <h4 className="font-bold mb-2 text-lg" style={{ color: 'var(--op-black)' }}>Fear</h4>
                <p className="text-sm leading-relaxed italic mb-2" style={{ color: 'var(--op-dark-gray)' }}>
                  &ldquo;If my smart contract has any security issues or holes in it, it will be at best useless, and at worst, exploitable.&rdquo;
                </p>
                <ul className="text-sm space-y-1 list-disc pl-5" style={{ color: 'var(--op-gray)' }}>
                  <li>Working with the best auditor brings the chances of that fear being realized as close to zero as possible.</li>
                  <li>How can we avoid disasters like Poly Network, Ronin Bridge?</li>
                  <li>H1 2025 already had $263M in damages across all Web3.</li>
                </ul>
              </div>

              <div className="pl-4" style={{ borderLeft: '4px solid var(--op-dark-gray)' }}>
                <h4 className="font-bold mb-2 text-lg" style={{ color: 'var(--op-black)' }}>Credibility</h4>
                <p className="text-sm leading-relaxed italic mb-2" style={{ color: 'var(--op-dark-gray)' }}>
                  &ldquo;I need assurances in order to secure institutional capital.&rdquo;
                </p>
                <ul className="text-sm space-y-1 list-disc pl-5" style={{ color: 'var(--op-gray)' }}>
                  <li>Working with specific auditors who understand the context.</li>
                  <li>Having the audit done by a respected name increases investor, customer, and institutional confidence.</li>
                </ul>
              </div>

              <div className="pl-4" style={{ borderLeft: '4px solid var(--op-accent)' }}>
                <h4 className="font-bold mb-2 text-lg" style={{ color: 'var(--op-black)' }}>Bonus</h4>
                <p className="text-sm leading-relaxed mb-2" style={{ color: 'var(--op-dark-gray)' }}>
                  Additional value add outside of the audit service, effectively BDing on behalf of the project.
                </p>
                <ul className="text-sm space-y-1 list-disc pl-5" style={{ color: 'var(--op-gray)' }}>
                  <li>Introductions to other connections, like institutional depositors who trust the Halborn audit.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Target Qualification Criteria */}
          <div 
            className="rounded-2xl p-8 shadow-lg"
            data-animate
            data-delay="200"
            style={{ backgroundColor: 'var(--op-white)', borderWidth: '1px', borderColor: 'var(--op-gray)' }}
          >
            <h3 className="text-2xl font-bold mb-6" style={{ color: 'var(--op-black)' }}>
              Target Qualification Gut Check
            </h3>
            
            <div className="space-y-6">
              <div className="pl-4" style={{ borderLeft: '4px solid var(--op-accent-darker)' }}>
                <h4 className="font-bold mb-2 text-lg" style={{ color: 'var(--op-black)' }}>Use Case</h4>
                <ul className="text-sm space-y-1 list-disc pl-5" style={{ color: 'var(--op-gray)' }}>
                  <li>The company falls into one or both of the &ldquo;why&rdquo; buckets and ideally has some sort of strong signal that they believe in the value of respected audits.</li>
                  <li>Potential for recurring need for audits is a bonus.</li>
                  
                </ul>
              </div>

              <div className="pl-4" style={{ borderLeft: '4px solid var(--op-dark-gray)' }}>
                <h4 className="font-bold mb-2 text-lg" style={{ color: 'var(--op-black)' }}>Capital Potential</h4>
            
                <ul className="text-sm space-y-1 list-disc pl-5" style={{ color: 'var(--op-gray)' }}>
                  <li>Does the company have money to spend on a top-tier audit? </li>
                  <li>Recent VC funding, large growth signals, high recent yield, strong partnerships, etc.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Outreach Methodology */}
        <div 
          className="rounded-2xl p-8 shadow-lg mb-12"
          data-animate
          data-delay="400"
          style={{ backgroundColor: 'var(--op-white)', borderWidth: '1px', borderColor: 'var(--op-gray)' }}
        >
          <h3 className="text-2xl font-bold mb-6" style={{ color: 'var(--op-black)' }}>
            General Outreach Methodology
          </h3>
          
          <div className="grid md:grid-cols-4 gap-6">
            <div>
              <div 
                className="inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold mb-3"
                style={{ backgroundColor: 'var(--op-accent)', color: 'var(--op-black)' }}
              >1</div>
              <h4 className="font-bold mb-2" style={{ color: 'var(--op-black)' }}>Research</h4>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--op-gray)' }}>
                Find companies with a compelling use case and strong potential to be interested.
              </p>
            </div>

            <div>
              <div 
                className="inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold mb-3"
                style={{ backgroundColor: 'var(--op-accent)', color: 'var(--op-black)' }}
              >2</div>
              <h4 className="font-bold mb-2" style={{ color: 'var(--op-black)' }}>Outreach</h4>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--op-gray)' }}>
              Choose the best method of outreach based on the customer. Do we have any way for a warm introduction? Any connections to them? If not, cold outreach, meeting the customer where they are (LinkedIn, Discord, Telegram, email, etc).
              </p>
            </div>

            <div>
              <div 
                className="inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold mb-3"
                style={{ backgroundColor: 'var(--op-accent)', color: 'var(--op-black)' }}
              >3</div>
              <h4 className="font-bold mb-2" style={{ color: 'var(--op-black)' }}>Cold Outreach</h4>
              <p className="text-sm leading-relaxed mb-2" style={{ color: 'var(--op-gray)' }}>
                Personalized, short, straight to the point.
              </p>
              <p className="text-xs italic" style={{ color: 'var(--op-gray-2)' }}>
                &ldquo;Hey xyz, noticed you&apos;re building a new smart contract—open for a conversation about security auditing?&rdquo;
              </p>
              <p className="text-xs italic" style={{ color: 'var(--op-gray-2)' }}>
                &ldquo;Congratulations on your recent funding round! Your new stablecoin lending protocol sounds really interesting, and I think that Rikard Hjort would be a really great fit for an audit. Interested in a convo to talk details?&rdquo;
              </p>
            </div>

            <div>
              <div 
                className="inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold mb-3"
                style={{ backgroundColor: 'var(--op-accent)', color: 'var(--op-black)' }}
              >4</div>
              <h4 className="font-bold mb-2" style={{ color: 'var(--op-black)' }}>Follow Up</h4>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--op-gray)' }}>
              Sales rarely happens on first touch, but there&apos;s a balance between being visible and being annoying. Once a line of communication is open, the real sales process begins. 
              </p>
            </div>
          </div>
        </div>

        {/* Transition indicator */}
        <div 
          className="text-center"
          data-animate
          data-delay="500"
        >
          <p className="text-sm mb-2" style={{ color: 'var(--op-gray)' }}>Strategic Targets</p>
          <div className="inline-flex items-center gap-2" style={{ color: 'var(--op-accent)' }}>
            <svg className="w-4 h-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}

