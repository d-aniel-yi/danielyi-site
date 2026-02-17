"use client";

export function QuestionsSection() {
    return (
        <section
            className="scroll-section min-h-screen flex items-center py-20 relative z-10"
            style={{ backgroundColor: 'var(--mercury-card-bg)' }}
        >
            <div className="max-w-6xl mx-auto px-8 w-full">
                <div className="text-center mb-16">
                    <h2
                        className="display-serif text-4xl md:text-5xl font-bold mb-4"
                        data-animate
                        data-delay="0"
                        style={{ color: 'var(--mercury-white)' }}
                    >
                        Internal & External Hurdles
                    </h2>
                    <p className="text-lg text-gray-400 italic" style={{ color: 'var(--mercury-text-muted)' }}>
                        Questions to ask ourselves to better inform our strategy
                    </p>
                </div>

                <div className="max-w-4xl mx-auto space-y-24">
                    {/* Why haven't we won? */}
                    <div data-animate data-delay="0">
                        <h2
                            className="display-serif text-3xl md:text-4xl font-bold mb-8"
                            style={{ color: 'var(--mercury-white)' }}
                        >
                            Why haven&apos;t we won these companies already?
                        </h2>

                        <div className="space-y-6">
                            <div>
                                <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--mercury-white)' }}>Legacy Habits</h3>
                                <p className="text-base leading-relaxed" style={{ color: 'var(--mercury-text-muted)' }}>
                                    Points rewards, activation energy, fear of not fixing something that isn&apos;t broken
                                </p>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--mercury-white)' }}>Marketing Narrative</h3>
                                <p className="text-base leading-relaxed" style={{ color: 'var(--mercury-text-muted)' }}>
                                    Mercury is branded as &quot;Banking For Startups&quot;, which speaks more directly to tech startup companies. While Mercury has a strong value proposition for Digital Marketing Agencies, the marketing and branding strategy of Mercury isn&apos;t currently directed towards them.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--mercury-white)' }}>Focus</h3>
                                <p className="text-base leading-relaxed" style={{ color: 'var(--mercury-text-muted)' }}>
                                    Simply put, resources are limited, and this hasn&apos;t been a strong ICP-priority historically.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* How do we find them? */}
                    <div data-animate data-delay="100">
                        <h2
                            className="display-serif text-3xl md:text-4xl font-bold mb-8"
                            style={{ color: 'var(--mercury-white)' }}
                        >
                            How do we find them?
                        </h2>

                        <div className="space-y-6">
                            <div>
                                <p className="text-base leading-relaxed mb-4" style={{ color: 'var(--mercury-text-muted)' }}>
                                    One of the advantages of digital marketing agencies is that their product is marketing, so they themselves are very visible.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--mercury-white)' }}>Data Providers</h3>
                                <p className="text-base leading-relaxed" style={{ color: 'var(--mercury-text-muted)' }}>
                                    PitchBook, Clay, Ocean.io, LinkedIn are great places to look for cold opportunities. Pretty classic sales development/prospecting workflow here.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--mercury-white)' }}>Mercury Network</h3>
                                <p className="text-base leading-relaxed" style={{ color: 'var(--mercury-text-muted)' }}>
                                    Look at current Mercury clients (especially larger ones) and see who their marketing agencies are. Can we leverage existing relationships for warm introductions?
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Internal Teams Support */}
                    <div data-animate data-delay="200">
                        <h2
                            className="display-serif text-3xl md:text-4xl font-bold mb-8"
                            style={{ color: 'var(--mercury-white)' }}
                        >
                            What internal teams do we need support from?
                        </h2>

                        <div className="space-y-8">
                            {[
                                {
                                    team: "Underwriting / Risk",
                                    desc: [
                                        "Agencies generally need a large credit line because they have a ton of ad spend, far outpacing their revenue, because they are buying on behalf of clients, not necessarily collecting that revenue.",
                                        "This is especially true for smaller agencies who may not have accounts set up with the larger ad platforms (Google, Meta, TikTok, ESPN, etc).",
                                        "This can also be a huge pain point that is specific to smaller/newer agencies that we can address with the help with the underwriting team."
                                    ]
                                },
                                {
                                    team: "Partnerships",
                                    desc: [
                                        "1. Integrations with the large ad platforms (Google, Meta, TikTok, ESPN, etc).",
                                        "2. Modern-day principal buying: Many agencies buy large amounts upfront, and then resells it to clients. If we had some sort of partnership with the platforms as a trade desk, we could provide a some sort of incentive (like the 1.5% cashback) for our clients to buy using this trade desk, rather than on a credit card. This is more of a long-term, DMA specific play."
                                    ]
                                },
                                {
                                    team: "Marketing / Sales Enablement",
                                    desc: [
                                        "The hardest thing to sell against is inaction. While in the sales motion we can identify, build upon, and expand pain points, it's helpful to have the seed planted and have direct materials to address certain scenarios, such as Mercury vs AMEX points.",
                                        "Since Mercury's branding and marketing is more directed towards startups currently, there will need to be a slight shift and/or branching of the marketing strategy to really hit this vertical."
                                    ]
                                },
                                {
                                    team: "Customer Success / Onboarding",
                                    desc: [
                                        "Larger agencies are complex and if we are selling against inaction, we need to make sure that the activation energy is as low as possible, and that getting them started and set up is as simple as possible."
                                    ]
                                }
                            ].map((item, i) => (
                                <div key={i}>
                                    <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--mercury-white)' }}>
                                        {item.team}
                                    </h3>
                                    {item.desc.map((paragraph, j) => (
                                        <p key={j} className="text-base leading-relaxed mb-4 last:mb-0" style={{ color: 'var(--mercury-text-muted)' }}>
                                            {paragraph}
                                        </p>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div data-animate data-delay="300">
                        <h2
                            className="display-serif text-3xl md:text-4xl font-bold mb-8"
                            style={{ color: 'var(--mercury-white)' }}
                        >
                            How do we measure success?
                        </h2>
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--mercury-white)' }}>Sales Metrics</h3>
                                <p className="text-base leading-relaxed mb-4" style={{ color: 'var(--mercury-text-muted)' }}>
                                    <strong>Connect rates:</strong> How is the initial messaging of the pain point that we are communicating landing?
                                </p>
                                <p className="text-base leading-relaxed" style={{ color: 'var(--mercury-text-muted)' }}>
                                    <strong>Close rates:</strong> If we&apos;ve nailed an initial pain point/value to get them interested, is the value great enough for them to commit?
                                </p>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--mercury-white)' }}>Referral/Client Metrics</h3>
                                <p className="text-base leading-relaxed" style={{ color: 'var(--mercury-text-muted)' }}>
                                    <strong>NPS Score:</strong> Are we getting referrals? Are our customers who did take the leap happy and happy enough to tell other people about us?
                                </p>
                            </div>
                        </div>
                    </div>

                    <div data-animate data-delay="400">
                        <h2
                            className="display-serif text-3xl md:text-4xl font-bold mb-8"
                            style={{ color: 'var(--mercury-white)' }}
                        >
                            How do we improve on this plan?
                        </h2>
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--mercury-white)' }}>Product Market Fit</h3>
                                <p className="text-base leading-relaxed" style={{ color: 'var(--mercury-text-muted)' }}>
                                    If we&apos;ve confirmed that Mercury has the strong product market fit that we&apos;ve hypothesized, then we can focus on improving our GTM strategy.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--mercury-white)' }}>How to use data to improve our GTM Strategy</h3>
                                <p className="text-base leading-relaxed mb-4" style={{ color: 'var(--mercury-text-muted)' }}>
                                    Based on how our connect rates, close rates, and NPS scores are trending and compare to other verticals, we can narrow in on what piece of the GTM strategy needs most work.
                                </p>
                                <p className="text-base leading-relaxed mb-4" style={{ color: 'var(--mercury-text-muted)' }}>
                                    <strong>Connect rates are low:</strong> Messaging is not landing, how can we tweak our marketing to bring the pain point forward and our sales messaging to bring the pain point to life?
                                </p>
                                <p className="text-base leading-relaxed mb-4" style={{ color: 'var(--mercury-text-muted)' }}>
                                    <strong>Close rates are low:</strong> Messaging is landing but value is not high enough, is there a better way to highlight the value of Mercury and improve our sales messaging? Is this a sales process issue or a messaging issue?
                                </p>
                                <p className="text-base leading-relaxed" style={{ color: 'var(--mercury-text-muted)' }}>
                                    <strong>NPS is low:</strong> Clients aren&apos;t happy. Why? Is it onboarding? Are they not extracting enough value from the product? How can turn potential value into actual value?
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section >
    );
}
