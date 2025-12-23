"use client";

export function StrategySection() {
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
                        Strategic Overview
                    </h2>
                    <p className="text-xl" style={{ color: 'var(--mercury-text-muted)' }}>
                        Personas, Targeting & Discovery
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Strategic Overview Content */}
                    <div
                        className="md:col-span-2 rounded-2xl p-8 shadow-lg"
                        data-animate
                        data-delay="100"
                        style={{ backgroundColor: 'var(--mercury-card-bg)', borderWidth: '1px', borderColor: 'var(--mercury-border)' }}
                    >
                        <div className="grid md:grid-cols-2 gap-8">
                            <div>
                                <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--mercury-white)' }}>
                                    Personas & Titles
                                </h3>
                                <p className="text-sm text-gray-400 mb-4">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                </p>
                                <ul className="list-disc pl-5 space-y-2 text-sm text-gray-400">
                                    <li>Lorem ipsum dolor sit amet (CEO)</li>
                                    <li>Consectetur adipiscing elit (CFO)</li>
                                    <li>Sed do eiusmod tempor (Head of Ops)</li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--mercury-white)' }}>
                                    Agency Structure
                                </h3>
                                <p className="text-sm text-gray-400">
                                    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                                </p>
                            </div>
                        </div>

                        <div className="mt-8 pt-8 border-t border-gray-800">
                            <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--mercury-white)' }}>
                                Example Targets
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="p-3 rounded bg-gray-900 text-center text-sm text-gray-400">Lorem Ipsum</div>
                                <div className="p-3 rounded bg-gray-900 text-center text-sm text-gray-400">Dolor Sit</div>
                                <div className="p-3 rounded bg-gray-900 text-center text-sm text-gray-400">Amet Consectetur</div>
                                <div className="p-3 rounded bg-gray-900 text-center text-sm text-gray-400">Adipiscing Elit</div>
                            </div>
                        </div>
                    </div>


                    {/* Where are they? */}
                    <div
                        className="md:col-span-2 rounded-2xl p-8 shadow-lg"
                        data-animate
                        data-delay="150"
                        style={{ backgroundColor: 'var(--mercury-card-bg)', borderWidth: '1px', borderColor: 'var(--mercury-border)' }}
                    >
                        <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--mercury-white)' }}>
                            Where are they?
                        </h3>
                        <div className="space-y-4" style={{ color: 'var(--mercury-text)' }}>
                            <p className="text-sm leading-relaxed">
                                One of the advantages of digital marketing agencies is that their product is marketing, so they themselves are very visible.
                            </p>
                            <ul className="list-disc pl-5 space-y-2 text-sm text-gray-400">
                                <li>
                                    <strong className="text-gray-300">Data Providers:</strong> PitchBook, Clay, Ocean.io, LinkedIn are great places to cold look.
                                </li>
                                <li>
                                    <strong className="text-gray-300">Mercury Network:</strong> Look at current Mercury clients (especially larger ones) and see who their marketing agencies are.
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Discovery Flow */}
                    <div
                        className="md:col-span-2 rounded-2xl p-8 shadow-lg"
                        data-animate
                        data-delay="200"
                        style={{ backgroundColor: 'var(--mercury-card-bg)', borderWidth: '1px', borderColor: 'var(--mercury-border)' }}
                    >
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2" style={{ color: 'var(--mercury-white)' }}>
                            <span className="p-2 rounded bg-green-500/20 text-green-300">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </span>
                            Prospecting & Discovery Flow
                        </h3>

                        <div className="space-y-6 text-sm" style={{ color: 'var(--mercury-text-muted)' }}>
                            <div className="pl-4 border-l-2 border-green-500/30 space-y-4">
                                <div>
                                    <h4 className="font-bold text-white mb-1">1. Outreach</h4>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                                </div>
                                <div>
                                    <h4 className="font-bold text-white mb-1">2. Discovery Call</h4>
                                    <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                                </div>
                                <div>
                                    <h4 className="font-bold text-white mb-1">3. Demo / Value Prop</h4>
                                    <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
