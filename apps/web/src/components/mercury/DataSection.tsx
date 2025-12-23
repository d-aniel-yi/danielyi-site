"use client";

export function DataSection() {
    return (
        <section
            className="scroll-section min-h-screen flex items-center py-20 relative z-10"
            style={{ backgroundColor: 'var(--mercury-bg)' }}
        >
            <div className="max-w-6xl mx-auto px-8 w-full">
                <div className="text-center mb-16">
                    <h2
                        className="display-serif text-4xl md:text-5xl font-bold mb-4"
                        data-animate
                        data-delay="0"
                        style={{ color: 'var(--mercury-white)' }}
                    >
                        Data & Research
                    </h2>
                    <p className="text-lg text-gray-400 italic" style={{ color: 'var(--mercury-text-muted)' }}>
                        Does the data back up our criteria?
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 mb-8">
                    {/* Market Size Data */}
                    <div
                        className="col-span-2 rounded-2xl p-8 shadow-lg relative overflow-hidden"
                        data-animate
                        data-delay="100"
                        style={{ backgroundColor: 'var(--mercury-card-bg)', borderWidth: '1px', borderColor: 'var(--mercury-border)' }}
                    >
                        <div className="relative z-10">
                            <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--mercury-accent-light)' }}>
                                Digital Marketing Agencies Growth
                            </h3>
                            <p className="text-sm italic mb-4" style={{ color: 'var(--mercury-text-muted)' }}>
                                (Defined as Global Media Buying Agencies and Representative Firms)
                            </p>

                            <div className="mb-6 rounded-xl overflow-hidden bg-white/5 p-2 border border-white/10">
                                <img
                                    src="/mercury/market_growth_chart.png"
                                    alt="Market Size Estimates Chart"
                                    className="w-full h-auto rounded-lg opacity-90 hover:opacity-100 transition-opacity"
                                />
                            </div>

                            <p className="text-base leading-relaxed mb-6" style={{ color: 'var(--mercury-text)' }}>
                                Digital Marketing Agencies have shown consistent growth in recent years, with a historical and projected CAGR between 6-22% and a market size between $57B-$75B.
                            </p>
                            <p className="text-xs uppercase tracking-wider" style={{ color: 'var(--mercury-text-muted)' }}>
                                Sources: PitchBook, BusinessWire, Financial Buzz Media, PR Newswire
                            </p>
                        </div>
                    </div>

                    {/* SEO Agencies Stat */}
                    <div
                        className="rounded-2xl p-8 shadow-lg flex flex-col justify-center"
                        data-animate
                        data-delay="200"
                        style={{ backgroundColor: 'var(--mercury-card-bg)', borderWidth: '1px', borderColor: 'var(--mercury-border)' }}
                    >
                        <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--mercury-accent-light)' }}>
                            SEO Service Agencies
                        </h3>
                        <div className="mb-2">
                            <span className="text-4xl font-bold text-white">~17%</span>
                            <span className="ml-2 text-sm text-gray-400">CAGR</span>
                        </div>
                        <p className="text-sm" style={{ color: 'var(--mercury-text-muted)' }}>
                            The # of estimates within the Digital Marketing Agencies are low, so looking at an adjacent industry, SEO Service Agencies, shows us an even stronger growth trend. This is further evidence that even if the market size estimates are off, we can be confident that the trends are correct.
                        </p>
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-8">
                    {/* Assumptions */}
                    <div
                        className="rounded-2xl p-8 shadow-lg border border-dashed"
                        data-animate
                        data-delay="400"
                        style={{
                            backgroundColor: 'var(--mercury-bg)',
                            borderColor: 'var(--mercury-text-muted)'
                        }}
                    >
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--mercury-text)' }}>
                            <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                            Assumptions for this exercise
                        </h3>
                        <p className="text-lg" style={{ color: 'var(--mercury-text-muted)' }}>
                            <li>Mercury is strategically planning for aggressive growth into a new vertical, meaning that we will have the full backing of internal teams.</li>
                            <li>A high-value customer utilizes a large portion of our services (product is sticky), carries a high balance (higher $ in bank capital requirements), and/or processes large volumes.</li>
                            <li>Mercury makes money on interchange fees.</li>
                            <li>Mercury has an org structure that is similar to traditional SaaS companies, with sales, marketing/enablement, partnerships, and onboarding/customer success.</li>
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
