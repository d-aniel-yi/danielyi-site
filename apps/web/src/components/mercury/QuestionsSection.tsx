"use client";

export function QuestionsSection() {
    return (
        <section
            className="scroll-section min-h-screen flex items-center py-20 relative z-10"
            style={{ backgroundColor: 'var(--mercury-card-bg)' }}
        >
            <div className="max-w-6xl mx-auto px-8 w-full">
                <div className="grid md:grid-cols-2 gap-16">
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
                                className="p-6 rounded-xl border border-dashed border-red-900/40 bg-red-900/10"
                                style={{ borderColor: 'rgba(239, 68, 68, 0.2)' }}
                            >
                                <h3 className="text-xl font-bold mb-2 text-red-200">Legacy Habits</h3>
                                <p style={{ color: 'var(--mercury-text-muted)' }}>
                                    Points rewards, activation energy, fear of not fixing something that isn't broke.
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

                        <div className="space-y-4">
                            {[
                                {
                                    team: "Underwriting / Risk",
                                    desc: "Agencies generally need a large credit line because they have a ton of ad spend, far outpacing their revenue, because they are buying on behalf of clients, not necessarily collecting that revenue.",
                                    color: "border-blue-500/30 bg-blue-500/10 text-blue-200"
                                },
                                {
                                    team: "Partnerships",
                                    desc: "If we can integrate with large ad platforms to automate a lot of the workflow, huge win.",
                                    color: "border-purple-500/30 bg-purple-500/10 text-purple-200"
                                },
                                {
                                    team: "Marketing / Sales Enablement",
                                    desc: "The hardest thing to sell against is inaction. While in the sales motion we can identify, build upon, and expand pain points, it's helpful to have the seed planted and have direct materials, such as mercury vs amex points.",
                                    color: "border-pink-500/30 bg-pink-500/10 text-pink-200"
                                },
                                {
                                    team: "Customer Success / Onboarding",
                                    desc: "Larger agencies are complex and if we are selling against inaction, we need to make sure that the activation energy is as low as possible.",
                                    color: "border-green-500/30 bg-green-500/10 text-green-200"
                                }
                            ].map((item, i) => (
                                <div
                                    key={i}
                                    className={`p-4 rounded-lg border ${item.color}`}
                                >
                                    <h3 className="font-bold mb-1" style={{ color: 'var(--mercury-white)' }}>{item.team}</h3>
                                    <p className="text-sm leading-relaxed" style={{ color: 'var(--mercury-text-muted)' }}>{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
