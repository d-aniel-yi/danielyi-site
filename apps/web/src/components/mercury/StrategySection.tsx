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
                    <p className="text-lg text-gray-400 italic" style={{ color: 'var(--mercury-text-muted)' }}>
                        Org structure, personas, targeting, and sales process
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Agency Structure Content */}
                    <div
                        className="md:col-span-2"
                        data-animate
                        data-delay="100"
                    >
                        <h3 className="text-2xl font-bold mb-8" style={{ color: 'var(--mercury-white)' }}>
                            Agency Structure and how they interact with Mercury
                        </h3>


                        <div className="space-y-12">
                            {/* Executive Layer */}
                            <div>
                                <h4 className="text-lg font-bold mb-6 flex items-center gap-2" style={{ color: 'var(--mercury-accent-light)' }}>
                                    Executive Layer - CEO & CFO
                                </h4>
                                <p className="text-base leading-relaxed" style={{ color: 'var(--mercury-text-muted)' }}>
                                    Organization size largely affects how large the C-Suite is, but both the CEO and CFO are critical for buy-in on the value it brings to the overall business.
                                </p>
                            </div>

                            {/* Client-Facing Pod */}
                            <div>
                                <h4 className="text-lg font-bold mb-6 flex items-center gap-2" style={{ color: 'var(--mercury-accent-light)' }}>
                                    Client-Facing Pod(s)
                                </h4>
                                <div className="space-y-8">
                                    {[
                                        {
                                            role: "Account Lead",
                                            spend: "Owns client relationship, scope, and commercial expectations. Reviews client invoices and approves pod-level T&E within policy prior to finance processing."
                                        },
                                        {
                                            role: "Strategist",
                                            spend: "Defines growth strategy and allocates budgets across channels, determining where media spend is directed (e.g., Google vs Meta) subject to client and finance approvals."
                                        },
                                        {
                                            role: "Media / Execution Lead",
                                            spend: "Executes campaigns and manages daily performance and spend pacing using finance-approved billing instruments, ensuring budgets are deployed as planned."
                                        },
                                        {
                                            role: "Creative",
                                            spend: "Produces ad assets and testing variations; primary consumer of creative SaaS tools, stock assets, and freelance budgets managed centrally."
                                        },
                                        {
                                            role: "Analytics / Ops",
                                            spend: "Ensures data accuracy and reporting integrity; functional owner of analytics tooling and data infrastructure, with contracts and billing managed by finance."
                                        }
                                    ].map((role, i) => (
                                        <div key={i} className="grid md:grid-cols-4 gap-4">
                                            <div className="md:col-span-1">
                                                <h5 className="text-lg font-bold text-white leading-tight">{role.role}</h5>
                                            </div>
                                            <div className="md:col-span-3">
                                                <p className="text-sm leading-relaxed" style={{ color: 'var(--mercury-text-muted)' }}>
                                                    {role.spend}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h4 className="text-lg font-bold mb-6 flex items-center gap-2" style={{ color: 'var(--mercury-accent-light)' }}>
                                    Accounting
                                </h4>
                                <p className="text-base leading-relaxed" style={{ color: 'var(--mercury-text-muted)' }}>
                                    Largest stakeholders (aside from C-Suite) on how organized all of the financial systems are. Important that they are part of the sales process and that we leverage the pain of a unorganized, uncooperative finance and banking software.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div
                        className="md:col-span-2"
                        data-animate
                        data-delay="200"
                    >
                        <h3 className="text-2xl font-bold mb-8" style={{ color: 'var(--mercury-white)' }}>
                            Sales Process
                        </h3>
                        <h4 className="text-lg font-bold mb-6 flex items-center gap-2" style={{ color: 'var(--mercury-accent-light)' }}>
                            Run the play
                        </h4>
                        <div className="space-y-8">
                            <p className="text-base leading-relaxed" style={{ color: 'var(--mercury-text-muted)' }}>
                                With a well thought out GTM plan in place, sales should be able to run the play with minimal changes to the overal sales process.
                            </p>
                            <p className="text-base leading-relaxed" style={{ color: 'var(--mercury-text-muted)' }}>
                                The pain points are specific to digital marketing agencies, the messaging is tailored and delivered slightly differently, but the process and emphasis on building value to address pain points should be no different than breaking into any other vertical.
                            </p>
                        </div>
                    </div>



                </div>
            </div>
        </section>
    );
}
