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
                            <div
                                className="p-6 rounded-xl border border-white/10 bg-white/5"
                            >
                                <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--mercury-white)' }}>Legacy Habits</h3>
                                <p style={{ color: 'var(--mercury-text-muted)' }}>
                                    Points rewards, activation energy, fear of not fixing something that isn&apos;t broke.
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
                                        "The hardest thing to sell against is inaction. While in the sales motion we can identify, build upon, and expand pain points, it's helpful to have the seed planted and have direct materials to address certain scenarios, such as Mercury vs AMEX points."
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
                </div>
            </div>
        </section>
    );
}
