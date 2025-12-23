"use client";

export function IntroSection() {
    return (
        <section
            className="scroll-section min-h-screen flex items-center py-20 relative z-10"
            style={{ backgroundColor: 'var(--mercury-card-bg)' }}
        >
            <div className="max-w-5xl mx-auto px-8 w-full">
                <div className="text-center mb-16">
                    <h2
                        className="display-serif text-5xl md:text-6xl font-bold mb-4"
                        data-animate
                        data-delay="0"
                        style={{ color: 'var(--mercury-white)' }}
                    >
                        Strategic Qualification
                    </h2>
                    <p
                        className="text-lg max-w-2xl mx-auto"
                        data-animate
                        data-delay="100"
                        style={{ color: 'var(--mercury-text-muted)' }}
                    >
                        Defining the ideal vertical profile and market fit
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mb-12">
                    {/* High Level Characteristics */}
                    <div
                        className="rounded-2xl p-8 shadow-lg"
                        data-animate
                        data-delay="200"
                        style={{ backgroundColor: 'var(--mercury-bg)', borderWidth: '1px', borderColor: 'var(--mercury-border)' }}
                    >
                        <h3 className="text-2xl font-bold mb-6" style={{ color: 'var(--mercury-white)' }}>
                            High Level Profile
                        </h3>

                        <div className="space-y-6">
                            <div className="pl-4" style={{ borderLeft: '4px solid var(--mercury-accent)' }}>
                                <h4 className="font-bold mb-2 text-lg" style={{ color: 'var(--mercury-white)' }}>Financial Needs</h4>
                                <ul className="text-sm space-y-1 list-disc pl-5" style={{ color: 'var(--mercury-text-muted)' }}>
                                    <li><strong>High Spending:</strong> Buying media on behalf of clients.</li>
                                    <li><strong>Cash Free:</strong> Ideally fully digital operations.</li>
                                    <li><strong>Complexity:</strong> Lots of expense categories and spenders.</li>
                                </ul>
                            </div>

                            <div className="pl-4" style={{ borderLeft: '4px solid var(--mercury-accent-light)' }}>
                                <h4 className="font-bold mb-2 text-lg" style={{ color: 'var(--mercury-white)' }}>Values</h4>
                                <p className="text-sm leading-relaxed italic mb-2" style={{ color: 'var(--mercury-text)' }}>
                                    "Marketing agencies value being modern. Speed + time is highly valued."
                                </p>
                                <ul className="text-sm space-y-1 list-disc pl-5" style={{ color: 'var(--mercury-text-muted)' }}>
                                    <li>Simpler reconciliation & expense tracking.</li>
                                    <li>Easy siloing for clients & merchants.</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Strategic Fit */}
                    <div
                        className="rounded-2xl p-8 shadow-lg"
                        data-animate
                        data-delay="200"
                        style={{ backgroundColor: 'var(--mercury-bg)', borderWidth: '1px', borderColor: 'var(--mercury-border)' }}
                    >
                        <h3 className="text-2xl font-bold mb-6" style={{ color: 'var(--mercury-white)' }}>
                            Market Consistency
                        </h3>

                        <div className="space-y-6">
                            <div className="pl-4" style={{ borderLeft: '4px solid var(--mercury-accent)' }}>
                                <h4 className="font-bold mb-2 text-lg" style={{ color: 'var(--mercury-white)' }}>Criteria</h4>
                                <ul className="text-sm space-y-1 list-disc pl-5" style={{ color: 'var(--mercury-text-muted)' }}>
                                    <li>Strong product market fit.</li>
                                    <li>Enough TAM/SAM to scale into.</li>
                                    <li>Market consistency to develop a playbook.</li>
                                    <li>Ideally growing.</li>
                                </ul>
                            </div>

                            <div className="pl-4" style={{ borderLeft: '4px solid var(--mercury-accent-light)' }}>
                                <h4 className="font-bold mb-2 text-lg" style={{ color: 'var(--mercury-white)' }}>Sourcing</h4>
                                <p className="text-sm leading-relaxed mb-2" style={{ color: 'var(--mercury-text-muted)' }}>
                                    Agencies are visible by nature.
                                </p>
                                <ul className="text-sm space-y-1 list-disc pl-5" style={{ color: 'var(--mercury-text-muted)' }}>
                                    <li><strong>Data Providers:</strong> PitchBook, Clay, Ocean.io, LinkedIn.</li>
                                    <li><strong>Internal Network:</strong> Look at current Mercury clients to see who their agencies are.</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Transition indicator */}
                <div
                    className="text-center"
                    data-animate
                    data-delay="500"
                >
                    <p className="text-sm mb-2" style={{ color: 'var(--mercury-text-muted)' }}>Deep Dive</p>
                    <div className="inline-flex items-center gap-2" style={{ color: 'var(--mercury-accent)' }}>
                        <svg className="w-4 h-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                    </div>
                </div>
            </div>
        </section>
    );
}
