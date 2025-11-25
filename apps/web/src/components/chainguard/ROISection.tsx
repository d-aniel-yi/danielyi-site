"use client";

export function ROISection() {
  return (
    <section 
      className="scroll-section min-h-screen flex items-center py-20 relative z-10"
      style={{ backgroundColor: 'var(--cg-dark-gray)' }}
    >
      <div className="max-w-5xl mx-auto px-8 w-full">
        <div className="mb-16">
          <h2 
            className="display-serif text-5xl md:text-6xl font-bold mb-6 text-white"
            data-animate
            data-delay="0"
          >
            Initial Targeting Look
          </h2>
          <p 
            className="text-lg leading-relaxed mb-12"
            data-animate
            data-delay="100"
            style={{ color: 'var(--cg-gray)' }}
          >
            My initial thoughts on where I would focus my efforts to close deals at Chainguard. More research is needed to refine this list, triage how strong of an ICP fit they are, and with more learnings from pre-start preparation, I would expect this list to become more refined and actionable.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          {/* Left Column - Regulated Industries */}
          <div 
            className="pl-6"
            data-animate
            data-delay="200"
            style={{ borderLeft: '3px solid var(--cg-primary)' }}
          >
            <h3 className="text-xl font-bold mb-4 text-white">
              Regulated / Compliance-Heavy Industries
            </h3>
            <ul className="space-y-2 text-sm mb-8" style={{ color: 'var(--cg-gray)' }}>
              <li>Finance/banking, healthcare/insurance, government contractors, etc</li>
              <li>Stringent regulatory compliance requirements requiring fewer audit findings, evidence of compliance, and general risk reduction</li>
              <li>High growth, innovative industries with a strong fit across company size segments</li>
            </ul>

            <div className="mt-6">
              <h4 className="text-sm uppercase tracking-wider font-semibold mb-3" style={{ color: 'var(--cg-gray)' }}>
                Example Companies
              </h4>
              <ul className="space-y-3 text-sm" style={{ color: 'var(--cg-gray)' }}>
                <li><strong className="text-white">Ramp</strong> — a fintech company that has had recent explosive growth, including a $300M round of funding last week</li>
                <li><strong className="text-white">Planbase Technologies</strong> — healthcare B2B SaaS company looking to streamline provider operations - a highly regulated segment. Also received $2.1M of VC funding this month</li>
                <li><strong className="text-white">Stuut</strong> — another recent round of funding ($29.5M this month), looking to revolutionize accounting with integrations and aggregations. Lots of sensitive information, and definitely a strong value add to make sure their supply chain is rock solid.</li>
              </ul>
            </div>
          </div>

          {/* Right Column - B2B SaaS */}
          <div 
            className="pl-6"
            data-animate
            data-delay="300"
            style={{ borderLeft: '3px solid var(--cg-primary)' }}
          >
            <h3 className="text-xl font-bold mb-4 text-white">
              B2B SaaS
            </h3>
            <ul className="space-y-2 text-sm mb-8" style={{ color: 'var(--cg-gray)' }}>
              <li>B2B SaaS companies are always popping up, always growing, and always looking for ways to improve their value proposition</li>
              <li>A strong and necessary indicator for SMB's is if they are looking to sell into enterprise accounts (Are they hiring enterprise reps? Do they have an enterprise AE team?)</li>
              <li>Strong need to pass enterprise security requirements/reviews, but may not have a dedicated security team (security in a box is huge here)</li>
            </ul>

            <div className="mt-6">
              <h4 className="text-sm uppercase tracking-wider font-semibold mb-3" style={{ color: 'var(--cg-gray)' }}>
                Example Companies
              </h4>
              <ul className="space-y-3 text-sm" style={{ color: 'var(--cg-gray)' }}>
                <li><strong className="text-white">Happyrobot</strong> — $44M in September, developing an "enterprise-grade platform" for AI workforce. Looks to be targeting enterprise accounts.</li>
                <li><strong className="text-white">Mem0</strong> — Open-source-native, $24M in recent funding targeting large AI agents</li>
                <li><strong className="text-white">LaunchDarkly</strong> — Have some personal connections from when they acquired Highlight.io, an open-source-native Open Telemetry platform. Seeing large growth and targeting the enterprise segment</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Line */}
        <div 
          className="pt-8 border-t"
          data-animate
          data-delay="600"
          style={{ borderColor: 'var(--cg-gray-2)' }}
        >
          <h3 className="text-xl font-bold mb-4 text-white">
            Bottom Line
          </h3>
          <p className="text-lg leading-relaxed" style={{ color: 'var(--cg-gray)' }}>
            This is not meant to be an exhaustive list, but rather a glance into how I would approach sales at Chainguard. My goal is to showcase my bias for intentional action and willingness to go above and beyond for something that I believe in.
          </p>
        </div>
      </div>
    </section>
  );
}

