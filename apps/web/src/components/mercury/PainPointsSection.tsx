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
                        Pain Points
                    </h2>
                    <p className="text-lg text-gray-400 italic" style={{ color: 'var(--mercury-text-muted)' }}>
                        What can we leverage to drive value for DMA's?
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
                                In every business, time and efficiency matter, but digital marketing agencies have to wow their clients and work quickly in a dynamic environment. Banking may not seem like an obvious place to optimize, but when we start looking at the greater financial picture, digital marketing agencies are:
                            </p>
                            <ul className="list-disc pl-5 space-y-2 text-gray-400">
                                <li>
                                    <strong className="text-gray-300">High Spenders:</strong> Especially if they are buying placements on behalf of their buyer. Every client has expenses in multiple categories and usually lots of different personas working with clients.
                                </li>
                                <li>
                                    <strong className="text-gray-300">Modern by Design:</strong> Marketing agencies have to keep up with the times, and importantly, have to project that.
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Flexibility */}
                    <div
                        className="rounded-2xl p-8 hover:transform hover:-translate-y-1 transition-transform duration-300"
                        data-animate
                        data-delay="200"
                        style={{ backgroundColor: 'var(--mercury-bg)', borderWidth: '1px', borderColor: 'var(--mercury-border)' }}
                    >
                        <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-6" style={{ backgroundColor: 'rgba(108, 92, 231, 0.1)', color: 'var(--mercury-accent)' }}>
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                        </div>
                        <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--mercury-white)' }}>Flexibility</h3>
                        <div className="space-y-4 text-sm leading-relaxed" style={{ color: 'var(--mercury-text)' }}>
                            <p>
                                Digital marketing is an extremely dynamic field by nature, and they have many financial needs that are constantly changing.
                            </p>
                            <p>
                                Not only is every second spent fussing around with financial tools valuable time not spent on clients, they have a much greater need for the flexibility in their tools because of the work they do.
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
                        <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--mercury-white)' }}>Lost in the shuffle</h3>
                        <div className="space-y-4 text-sm leading-relaxed" style={{ color: 'var(--mercury-text)' }}>
                            <p>
                                Since agencies are essentially spending other people’s money, every expense that does not get charged back to the client with accuracy and efficiency is pure lost profit.
                            </p>
                        </div>
                    </div>

                    {/* New Card 4 - Lorem Ipsum */}
                    <div
                        className="rounded-2xl p-8 hover:transform hover:-translate-y-1 transition-transform duration-300"
                        data-animate
                        data-delay="400"
                        style={{ backgroundColor: 'var(--mercury-bg)', borderWidth: '1px', borderColor: 'var(--mercury-border)' }}
                    >
                        <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-6" style={{ backgroundColor: 'rgba(108, 92, 231, 0.1)', color: 'var(--mercury-accent)' }}>
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        </div>
                        <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--mercury-white)' }}>Lorem Ipsum</h3>
                        <div className="space-y-4 text-sm leading-relaxed" style={{ color: 'var(--mercury-text)' }}>
                            <p>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.
                            </p>
                        </div>
                    </div>

                    {/* New Card 5 - Dolor Sit */}
                    <div
                        className="rounded-2xl p-8 hover:transform hover:-translate-y-1 transition-transform duration-300"
                        data-animate
                        data-delay="500"
                        style={{ backgroundColor: 'var(--mercury-bg)', borderWidth: '1px', borderColor: 'var(--mercury-border)' }}
                    >
                        <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-6" style={{ backgroundColor: 'rgba(108, 92, 231, 0.1)', color: 'var(--mercury-accent)' }}>
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                        </div>
                        <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--mercury-white)' }}>Dolor Sit Amet</h3>
                        <div className="space-y-4 text-sm leading-relaxed" style={{ color: 'var(--mercury-text)' }}>
                            <p>
                                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia.
                            </p>
                        </div>
                    </div>

                    {/* New Card 6 - Consectetur */}
                    <div
                        className="rounded-2xl p-8 hover:transform hover:-translate-y-1 transition-transform duration-300"
                        data-animate
                        data-delay="600"
                        style={{ backgroundColor: 'var(--mercury-bg)', borderWidth: '1px', borderColor: 'var(--mercury-border)' }}
                    >
                        <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-6" style={{ backgroundColor: 'rgba(108, 92, 231, 0.1)', color: 'var(--mercury-accent)' }}>
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                        </div>
                        <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--mercury-white)' }}>Consectetur</h3>
                        <div className="space-y-4 text-sm leading-relaxed" style={{ color: 'var(--mercury-text)' }}>
                            <p>
                                Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
