"use client";

interface TableOfContentsProps {
    onNavigate?: (index: number) => void;
}

export function TableOfContentsSection({ onNavigate }: TableOfContentsProps) {
    const sections = [
        { title: "Initial Questions & Assumptions", index: 2 },
        { title: "Qualifying the Vertical", index: 3 },
        { title: "Data & Market Opportunity", index: 4 },
        { title: "Top Pain Points", index: 5 },
        { title: "Features Where Mercury Wins", index: 6 },
        { title: "Internal & External Hurdles", index: 7 },
        { title: "Strategic Overview", index: 8 }
    ];

    return (
        <section
            className="scroll-section min-h-screen flex items-center justify-center py-20 relative z-10"
            style={{ backgroundColor: 'var(--mercury-bg)' }}
        >
            <div className="max-w-2xl mx-auto px-8 w-full">
                <div className="text-center mb-16">
                    <h2
                        className="display-serif text-3xl md:text-4xl font-bold mb-4"
                        data-animate
                        data-delay="0"
                        style={{ color: 'var(--mercury-white)' }}
                    >
                        Table of Contents
                    </h2>
                    <div className="w-24 h-1 bg-[#2D3436] mx-auto rounded-full" />
                </div>

                <div className="flex flex-col gap-6">
                    {sections.map((section, i) => (
                        <div
                            key={i}
                            className="group cursor-pointer flex items-center justify-between border-b border-[#2D3436] pb-4 transition-all hover:border-[#6C5CE7]"
                            data-animate
                            data-delay={i * 50}
                            onClick={() => onNavigate?.(section.index)}
                        >
                            <span className="text-xl text-[#B2BEC3] group-hover:text-white transition-colors font-mono">
                                {`0${i + 1}`}
                            </span>
                            <span className="text-xl text-[#DFE6E9] font-medium group-hover:text-[#6C5CE7] transition-colors text-right">
                                {section.title}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
