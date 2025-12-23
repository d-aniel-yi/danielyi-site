"use client";

interface TargetSectionProps {
    title: string;
    subtitle: string;
    logo?: string;  // Optional logo path
    rationale: string;
    approach: string;
    value: string;
    bonus?: string;  // Optional bonus section
    isEven: boolean;
}

export function TargetSection({
    title,
    subtitle,
    logo,
    rationale,
    approach,
    value,
    bonus,
    isEven,
}: TargetSectionProps) {
    return (
        <section
            className="scroll-section min-h-screen flex items-center py-20 relative z-10"
            style={{ backgroundColor: isEven ? 'var(--mercury-bg)' : 'var(--mercury-card-bg)' }}
        >
            <div className="max-w-6xl mx-auto px-8 w-full">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    {/* Logo, Title & Subtitle */}
                    <div className={`${isEven ? 'md:order-1' : 'md:order-2'}`}>
                        {logo && (
                            <div
                                data-animate
                                data-delay="0"
                                className="mb-6"
                            >
                                <img
                                    src={logo}
                                    alt={`${title} logo`}
                                    className="h-16 object-contain"
                                    style={{ maxWidth: '240px' }}
                                />
                            </div>
                        )}

                        <h2
                            className="display-serif text-4xl md:text-5xl font-bold mb-3"
                            data-animate
                            data-delay="100"
                            style={{ color: 'var(--mercury-white)' }}
                        >
                            {title}
                        </h2>

                        <p
                            className="text-xl mb-8"
                            data-animate
                            data-delay="200"
                            style={{ color: 'var(--mercury-text-muted)' }}
                        >
                            {subtitle}
                        </p>
                    </div>

                    {/* Content */}
                    <div className={`space-y-6 ${isEven ? 'md:order-2' : 'md:order-1'}`}>
                        <div
                            className="rounded-xl p-6 shadow-sm target-card"
                            data-animate
                            data-delay="300"
                            style={{ backgroundColor: 'var(--mercury-bg)', borderWidth: '1px', borderColor: 'var(--mercury-border)' }}
                        >
                            <h3
                                className="text-sm uppercase tracking-wider font-semibold mb-3"
                                style={{ color: 'var(--mercury-accent-light)' }}
                            >
                                Why This Target
                            </h3>
                            <p className="leading-relaxed text-sm" style={{ color: 'var(--mercury-text)' }}>{rationale}</p>
                        </div>

                        <div
                            className="rounded-xl p-6 shadow-sm target-card"
                            data-animate
                            data-delay="400"
                            style={{ backgroundColor: 'var(--mercury-bg)', borderWidth: '1px', borderColor: 'var(--mercury-border)' }}
                        >
                            <h3
                                className="text-sm uppercase tracking-wider font-semibold mb-3"
                                style={{ color: 'var(--mercury-accent-light)' }}
                            >
                                Use Case & Approach
                            </h3>
                            <p className="leading-relaxed text-sm" style={{ color: 'var(--mercury-text)' }}>{approach}</p>
                        </div>

                        <div
                            className="rounded-xl p-6 shadow-sm target-card"
                            data-animate
                            data-delay="500"
                            style={{ backgroundColor: 'var(--mercury-bg)', borderWidth: '1px', borderColor: 'var(--mercury-border)' }}
                        >
                            <h3
                                className="text-sm uppercase tracking-wider font-semibold mb-3"
                                style={{ color: 'var(--mercury-accent-light)' }}
                            >
                                Capital Potential
                            </h3>
                            <p className="leading-relaxed text-sm" style={{ color: 'var(--mercury-text)' }}>{value}</p>
                        </div>

                        {bonus && (
                            <div
                                className="rounded-xl p-6 shadow-sm target-card"
                                data-animate
                                data-delay="600"
                                style={{ backgroundColor: 'var(--mercury-bg)', borderWidth: '1px', borderColor: 'var(--mercury-border)' }}
                            >
                                <h3
                                    className="text-sm uppercase tracking-wider font-semibold mb-3"
                                    style={{ color: 'var(--mercury-accent-light)' }}
                                >
                                    Bonus
                                </h3>
                                <p className="leading-relaxed text-sm" style={{ color: 'var(--mercury-text)' }}>{bonus}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
