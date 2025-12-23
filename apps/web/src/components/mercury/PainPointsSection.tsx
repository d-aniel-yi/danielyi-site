"use client";

export function PainPointsSection() {
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
                        Top Pain Points
                    </h2>
                    <p className="text-lg text-gray-400 italic" style={{ color: 'var(--mercury-text-muted)' }}>
                        What can we leverage to drive value for DMA&apos;s?
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Time */}
                    <div
                        className="rounded-2xl p-8 hover:transform hover:-translate-y-1 transition-transform duration-300"
                        data-animate
                        data-delay="100"
                        style={{ backgroundColor: 'var(--mercury-bg)', borderWidth: '1px', borderColor: 'var(--mercury-border)' }}
                    >
                        <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-6" style={{ backgroundColor: 'rgba(108, 92, 231, 0.1)', color: 'var(--mercury-accent)' }}>
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--mercury-white)' }}>Time</h3>
                        <div className="space-y-4 text-sm leading-relaxed" style={{ color: 'var(--mercury-text)' }}>
                            <p>
                                Banking may not seem like an obvious place to optimize time, but when we start looking at the greater financial picture, digital marketing agencies are:
                            </p>
                            <ul className="list-disc pl-5 space-y-2 text-gray-400">
                                <strong className="text-gray-300">High Spenders:</strong> Especially if they are buying placements on behalf of their buyer. Every client has expenses in multiple categories and usually lots of different personas working with clients. They need to be able to manage expenses, cost centers, invoices, and bills in a way that is both efficient and adaptable.

                            </ul>
                        </div>
                    </div>


                    <div
                        className="rounded-2xl p-8 hover:transform hover:-translate-y-1 transition-transform duration-300"
                        data-animate
                        data-delay="200"
                        style={{ backgroundColor: 'var(--mercury-bg)', borderWidth: '1px', borderColor: 'var(--mercury-border)' }}
                    >
                        <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-6" style={{ backgroundColor: 'rgba(108, 92, 231, 0.1)', color: 'var(--mercury-accent)' }}>
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                        </div>
                        <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--mercury-white)' }}>Complexity</h3>
                        <div className="space-y-4 text-sm leading-relaxed" style={{ color: 'var(--mercury-text)' }}>
                            <p>
                                Digital marketing is an extremely dynamic field by nature, and they have many financial needs that are constantly changing.
                            </p>
                            <p>
                                There may be multiple account managers, campaign managers, and other personas working with each client, all with their own finance-specific needs and workflows. Agencies are designed to work with multiple clients, and each client multiplies the complexity of the system.
                            </p>
                        </div>
                    </div>

                    {/* Lost in the Shuffle */}
                    <div
                        className="rounded-2xl p-8 hover:transform hover:-translate-y-1 transition-transform duration-300"
                        data-animate
                        data-delay="300"
                        style={{ backgroundColor: 'var(--mercury-bg)', borderWidth: '1px', borderColor: 'var(--mercury-border)' }}
                    >
                        <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-6" style={{ backgroundColor: 'rgba(108, 92, 231, 0.1)', color: 'var(--mercury-accent)' }}>
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--mercury-white)' }}>Trust</h3>
                        <div className="space-y-4 text-sm leading-relaxed" style={{ color: 'var(--mercury-text)' }}>
                            <p>
                                Since agencies are essentially spending other people&apos;s money, every expense that does not get charged back to the client with accuracy and efficiency is pure lost profit.
                            </p>
                            <p>
                                It is paramount that the every transaction is reconciled, invoices are easily tracked, and the whole system is transparent and easily auditable - both for the agency and the client.
                            </p>
                            <p>
                                Having everything in one place assures that nothing falls through the cracks.
                            </p>
                        </div>
                    </div>




                </div>
            </div>
        </section>
    );
}
