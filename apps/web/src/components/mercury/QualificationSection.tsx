"use client";

export function QualificationSection() {
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
                        High Level Overview
                    </h2>
                    <p className="text-lg text-gray-400 italic" style={{ color: 'var(--mercury-text-muted)' }}>
                        Vertical qualification framework and initial thoughts on Digital Marketing Agencies
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-12">
                    {/* Strategic Fit */}
                    <div
                        className="rounded-2xl p-8 shadow-lg"
                        data-animate
                        data-delay="100"
                        style={{ backgroundColor: 'var(--mercury-bg)', borderWidth: '1px', borderColor: 'var(--mercury-border)' }}
                    >
                        <h3 className="text-2xl font-bold mb-6" style={{ color: 'var(--mercury-white)' }}>
                            A good vertical has to have:
                        </h3>

                        <ul className="space-y-4">
                            {[
                                "Strong product market fit",
                                "Enough TAM/SAM to scale into",
                                "Industry consistency to develop a playbook",
                                "Ideally growing"
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-3">
                                    <span style={{ color: 'var(--mercury-accent)' }}>•</span>
                                    <span className="text-lg" style={{ color: 'var(--mercury-text)' }}>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* At First Glance */}
                    <div
                        className="rounded-2xl p-8 shadow-lg h-full"
                        data-animate
                        data-delay="200"
                        style={{ backgroundColor: 'var(--mercury-bg)', borderWidth: '1px', borderColor: 'var(--mercury-border)' }}
                    >
                        <h3 className="text-2xl font-bold mb-6" style={{ color: 'var(--mercury-white)' }}>
                            On first glance, DMA's:
                        </h3>

                        <ul className="grid grid-cols-1 gap-3">
                            {[
                                "Cash free",
                                "Potential for high spend",
                                "Appetite for cashback",
                                "Large number of transaction categories",
                                "Fast paced, modern environment"
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: 'var(--mercury-accent-light)' }} />
                                    <span className="text-base" style={{ color: 'var(--mercury-text-muted)' }}>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}
