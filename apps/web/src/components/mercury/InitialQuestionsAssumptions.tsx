"use client";

export function InitialQuestionsAssumptions() {
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
                        Initial Questions & Assumptions
                    </h2>
                </div>

                <div className="max-w-4xl mx-auto">
                    <div
                        className="rounded-2xl p-8 shadow-lg border border-dashed"
                        data-animate
                        data-delay="200"
                        style={{
                            backgroundColor: 'var(--mercury-bg)',
                            borderColor: 'var(--mercury-text-muted)'
                        }}
                    >
                        <h4 className="text-lg font-bold mb-6 flex items-center gap-2" style={{ color: 'var(--mercury-accent-light)' }}>
                            Assumptions for this exercise
                        </h4>
                        <ul className="space-y-4 text-lg list-disc pl-6" style={{ color: 'var(--mercury-text-muted)' }}>
                            <li>Mercury is strategically planning for aggressive growth into a new vertical, meaning that we will have the full backing of internal teams.</li>
                            <li>A high-value customer utilizes a large portion of our services (product is sticky), carries a high balance (higher $ in bank capital requirements), and/or processes large volumes.</li>
                            <li>Mercury makes money on interchange fees.</li>
                            <li>Mercury has an org structure that is similar to traditional SaaS companies, with sales, marketing/enablement, partnerships, and onboarding/customer success.</li>
                        </ul>
                    </div>
                </div>
                <div className="max-w-4xl mx-auto">
                    <div
                        className="rounded-2xl p-8 shadow-lg border border-dashed"
                        data-animate
                        data-delay="200"
                        style={{
                            backgroundColor: 'var(--mercury-bg)',
                            borderColor: 'var(--mercury-text-muted)'
                        }}
                    >
                        <h4 className="text-lg font-bold mb-6 flex items-center gap-2" style={{ color: 'var(--mercury-accent-light)' }}>
                            Initial Considerations
                        </h4>
                        <ul className="space-y-4 text-lg list-disc pl-6" style={{ color: 'var(--mercury-text-muted)' }}>
                            <li>Before getting started, we should get a good feel organizationally for how much Mercury wants to invest in this vertical. Are we shifting sales headcount or adding new ones? Is there going to be a partnerships focus?</li>
                            <li>Do we have any internal SME&apos;s within the digital marketing segment?</li>
                            <li>Who built out the GTM motions for existing verticals?</li>
                            <li>Do we have a size segment within this vertical that we want to focus on?</li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}
