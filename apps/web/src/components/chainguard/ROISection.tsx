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
            The ROI
          </h2>
          <p 
            className="text-lg leading-relaxed mb-12"
            data-animate
            data-delay="100"
            style={{ color: 'var(--cg-gray)' }}
          >
            Why investing in me delivers exceptional returns for Chainguard
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          {/* Left Column */}
          <div className="space-y-12">
            {/* Revenue Contribution */}
            <div 
              className="pl-6"
              data-animate
              data-delay="200"
              style={{ borderLeft: '3px solid var(--cg-primary)' }}
            >
              <h3 className="text-xl font-bold mb-4 text-white">
                Revenue Contribution
              </h3>
              <ul className="space-y-2 text-sm" style={{ color: 'var(--cg-gray)' }}>
                <li>Exceed quota by 150%+ in first quarter, contributing directly to $100M ARR goal</li>
                <li>Build pipeline with 3x+ coverage for sustainable growth</li>
                <li>Focus on enterprise accounts with high expansion potential</li>
              </ul>
            </div>

            {/* Strategic Growth */}
            <div 
              className="pl-6"
              data-animate
              data-delay="300"
              style={{ borderLeft: '3px solid var(--cg-primary)' }}
            >
              <h3 className="text-xl font-bold mb-4 text-white">
                Strategic Growth
              </h3>
              <ul className="space-y-2 text-sm" style={{ color: 'var(--cg-gray)' }}>
                <li>Establish foothold in high-value verticals (fintech, healthcare, government)</li>
                <li>Build channel partnerships that scale beyond individual deals</li>
                <li>Create repeatable sales playbooks that accelerate team performance</li>
              </ul>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-12">
            {/* Team Multiplier */}
            <div 
              className="pl-6"
              data-animate
              data-delay="400"
              style={{ borderLeft: '3px solid var(--cg-primary)' }}
            >
              <h3 className="text-xl font-bold mb-4 text-white">
                Team Multiplier
              </h3>
              <ul className="space-y-2 text-sm" style={{ color: 'var(--cg-gray)' }}>
                <li>Mentor new hires and share proven methodologies</li>
                <li>Bridge technical and sales teams with clear communication</li>
                <li>Contribute to product roadmap based on real customer feedback</li>
              </ul>
            </div>

            {/* Brand Positioning */}
            <div 
              className="pl-6"
              data-animate
              data-delay="500"
              style={{ borderLeft: '3px solid var(--cg-primary)' }}
            >
              <h3 className="text-xl font-bold mb-4 text-white">
                Brand Positioning
              </h3>
              <ul className="space-y-2 text-sm" style={{ color: 'var(--cg-gray)' }}>
                <li>Establish Chainguard as the trusted security partner for enterprise</li>
                <li>Create content and thought leadership that drives inbound leads</li>
                <li>Build relationships with key decision-makers in target accounts</li>
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
            I&apos;m not just another AE. I&apos;m a strategic partner who understands your product, 
            your market, and how to execute at scale. The investment in me pays dividends from day one, 
            and compounds as I build relationships, refine processes, and drive growth.
          </p>
        </div>
      </div>
    </section>
  );
}

