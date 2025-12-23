"use client";

export function ValuePropSection() {
    const features = [
        {
            title: "Cashback",
            desc: "This one is simple - if agencies are buying on behalf of their customers, they basically end up making 1.5% more revenue. This adds up quickly!",
            color: "from-green-400 to-emerald-600"

        },
        {
            title: "Virtual Cards",
            desc: "Instant virtual cards, which allows for auto reconciliation, easy categorization, ensuring client funds never mix, merchant-locking (preventing overspending, fraud, or even mistakes). An example of this is if a card/account is for one specific client/use, we can get a 0% error rate in billing the client for those expenses.",
            color: "from-purple-400 to-indigo-600"
        },
        {
            title: "Team Permissions",
            desc: "Agencies are usually built with defined roles, and customizing permissions is not only beneficial for client privacy, but also for agency efficiency.",
            color: "from-blue-400 to-cyan-600"
        },
        {
            title: "Networking",
            desc: "Agencies provide a service, and networking is a huge part of their business development. Mercury is a leader in the startup world, and agencies can leverage the networking that Mercury provides to further their network.",
            color: "from-pink-400 to-rose-600"
        },
        {
            title: "Bill Pay",
            desc: "Between buying on behalf of customers, working with many different clients and vendors, and even their own marketing, its imperative that bill pay is not only easy, it makes no errors and does not create more work for accounting.",
            color: "from-orange-400 to-amber-600"
        },
        {
            title: "Invoicing",
            desc: "Invoicing needs to be clean, quick, and efficient. Essentially, the hurdle between incurring an expense and invoicing it out to a client needs to be as close to zero as possible, and having everything in one place, with an easy to use invoicing system that is directly tied into the complex accounting of an agency is paramount.",
            color: "from-teal-400 to-emerald-600"
        },
        {
            title: "Accounting",
            desc: "Speaking of accounting, with so many different clients, accounts, revenue streams, and expenses, this can get messy quickly. Working on Mercury ensures that nothing slips through the cracks, and as much of it is automated as possible.",
            color: "from-gray-200 to-slate-400"
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
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, i) => (
                        <div
                            key={i}
                            className={`rounded-2xl p-6 relative overflow-hidden group ${i === features.length - 1 ? 'md:col-span-2 lg:col-span-3 lg:w-1/2 lg:mx-auto' : ''}`}
                            data-animate
                            data-delay={50 * i}
                            style={{ backgroundColor: 'var(--mercury-card-bg)', borderWidth: '1px', borderColor: 'var(--mercury-border)' }}
                        >
                            <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${feature.color} opacity-10 rounded-bl-full group-hover:opacity-20 transition-opacity`} />

                            <h3 className="text-xl font-bold mb-3 relative z-10" style={{ color: 'var(--mercury-white)' }}>
                                {feature.title}
                            </h3>
                            <p className="text-sm leading-relaxed relative z-10" style={{ color: 'var(--mercury-text)' }}>
                                {feature.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
