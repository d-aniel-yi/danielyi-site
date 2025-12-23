"use client";

export function ValuePropSection() {
    const features = [
        {
            title: "Bill Pay",
            painPoint: "High volume of payments, lots of different clients, vendors, and accounts creates error-prone, manual work for accounting.",
            solution: "Integrated Bill Pay that is seamless, auto-reconciling, and automated.",
            color: "from-orange-400 to-amber-600"
        },
        {
            title: "Invoicing",
            painPoint: "Invoicing needs to be efficient and easy to track. Unreconciled invoices are the quickest way to bleed revenue, especially for agencies that buy on behalf of their clients.",
            solution: "Instant, clean invoicing, with auto-reconciliation and easy tracking tied directly to expenses, closing the gap to zero.",
            color: "from-teal-400 to-emerald-600"
        },
        {
            title: "Accounting",
            painPoint: "Managing multiple clients, revenue streams, and expenses gets messy fast. Big or small, agencies need to be able to manage their books with 100% reconciliation.",
            solution: "Keeping everything in one place and/or automated integrations with popular accounting software ensures nothing slips through the cracks. Additionally, how the Mercury account is set up can allow for auto-reconciliation of most transactions, ensuring accuracy.",
            color: "from-gray-200 to-slate-400"
        },
        {
            title: "Virtual Cards",
            painPoint: "Commingling client funds leads to reconciliation nightmares and billing errors.",
            solution: "Unlimited virtual cards with customizable budgets and merchant locking - flexibility when it's needed, guardrails when it's not.",
            color: "from-purple-400 to-indigo-600"
        },
        {
            title: "Team Permissions",
            painPoint: "For security and workflow efficiency, not everybody needs access to all of the information, and shared logins are a definite no-no.",
            solution: "Granular permissions for defined roles ensure privacy and efficiency.",
            color: "from-blue-400 to-cyan-600"
        },
        {
            title: "Cashback",
            painPoint: "Thin margins on media buying and high pass-through costs.",
            solution: "1.5% cashback turns client spend into a significant new revenue stream.",
            color: "from-green-400 to-emerald-600"
        }
    ];

    return (
        <section
            className="scroll-section min-h-screen py-20 relative z-10"
            style={{ backgroundColor: 'var(--mercury-bg)' }}
        >
            <div className="max-w-6xl mx-auto px-8 w-full h-full flex flex-col justify-center">
                <div className="text-center mb-16">
                    <h2
                        className="display-serif text-4xl md:text-5xl font-bold mb-4"
                        data-animate
                        data-delay="0"
                        style={{ color: 'var(--mercury-white)' }}
                    >
                        Features Where Mercury Wins
                    </h2>
                    <p className="text-lg text-gray-400 italic" style={{ color: 'var(--mercury-text-muted)' }}>
                        How can we address those pain points and provide value above and beyond?
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, i) => (
                        <div
                            key={i}
                            className={`rounded-2xl p-6 relative overflow-hidden group flex flex-col justify-between`}
                            data-animate
                            data-delay={50 * i}
                            style={{ backgroundColor: 'var(--mercury-card-bg)', borderWidth: '1px', borderColor: 'var(--mercury-border)' }}
                        >
                            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${feature.color} opacity-5 rounded-bl-full group-hover:opacity-10 transition-opacity`} />

                            <div className="relative z-10 mb-6">
                                <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--mercury-white)' }}>
                                    {feature.title}
                                </h3>

                                <div className="mb-4">
                                    <span className="text-xs font-bold uppercase tracking-wider mb-1 block" style={{ color: 'var(--mercury-accent)' }}>The Pain</span>
                                    <p className="text-sm leading-relaxed" style={{ color: 'var(--mercury-text-muted)' }}>
                                        {feature.painPoint}
                                    </p>
                                </div>
                            </div>

                            <div className="relative z-10 pt-4 border-t border-white/5">
                                <span className="text-xs font-bold uppercase tracking-wider mb-1 block text-emerald-400">The Fix</span>
                                <p className="text-sm leading-relaxed text-white">
                                    {feature.solution}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
