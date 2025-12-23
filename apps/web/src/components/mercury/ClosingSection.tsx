"use client";

export function ClosingSection() {
    return (
        <section
            className="scroll-section min-h-screen flex items-center justify-center py-20 relative z-10"
            style={{ backgroundColor: 'var(--mercury-card-bg)' }}
        >
            <div className="max-w-3xl mx-auto px-8 text-center">
                <h2
                    className="display-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white"
                    data-animate
                    data-delay="0"
                >
                    Ready to execute?
                </h2>

                <p
                    className="text-2xl md:text-3xl font-light mb-12"
                    data-animate
                    data-delay="200"
                    style={{ color: 'var(--mercury-accent)' }}
                >
                    Let&apos;s talk strategy.
                </p>

                <div
                    data-animate
                    data-delay="400"
                    className="space-y-6"
                >
                    <p
                        className="text-lg font-medium mb-6"
                        style={{ color: 'var(--mercury-text-muted)' }}
                    >
                        — Daniel Yi
                    </p>

                    <div className="space-y-3">
                        <a
                            href="tel:+15035458728"
                            className="block text-xl font-medium transition-colors hover:underline"
                            style={{ color: 'var(--mercury-text)' }}
                        >
                            503 545 8728
                        </a>

                        <a
                            href="mailto:062daniel.yi@gmail.com"
                            className="block text-xl font-medium transition-colors hover:underline"
                            style={{ color: 'var(--mercury-text)' }}
                        >
                            062daniel.yi@gmail.com
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
