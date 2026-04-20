"use client";

// Structural template: apps/web/src/app/projects/mobi/page.tsx (verified 2026-04-19).
// Intentionally omits next/link, next/image, and the ReactFlow library used by mobi —
// this page is narrative + screenshot, no diagram.
// Outer flex container MUST NOT carry an overflow-* utility (breaks sticky left panel —
// see .planning/STATE.md line 41 / RESEARCH.md Pitfall 3).

import { ExternalLink } from "lucide-react";

// --- Data ---

const STEPS = [
    {
        id: "the-problem",
        title: "The Problem: Post-Duguid TCPA Trend Analysis",
        content: (
            <>
                <p>TODO: prose for the-problem (§4 #1, ~750 words)</p>
            </>
        ),
    },
    {
        id: "motherduck-dives",
        title: "MotherDuck Dives: Dashboards as Code",
        content: (
            <>
                <p>TODO: prose for motherduck-dives (§4 #2, ~500 words)</p>
            </>
        ),
    },
    {
        id: "motherduck-mcp",
        title: "MotherDuck MCP: Conversational ETL",
        content: (
            <>
                <p>TODO: prose for motherduck-mcp (§4 #3, ~400 words)</p>
            </>
        ),
    },
    {
        id: "duckdb-wasm",
        title: "DuckDB-WASM: Zero-Backend Publishing",
        content: (
            <>
                <p>TODO: prose for duckdb-wasm (§4 #4, ~750 words)</p>
            </>
        ),
    },
    {
        id: "closing",
        title: "What This Stack Lets You Ship",
        content: (
            <>
                <p>TODO: prose for closing (§4 #5, ~100 words)</p>
            </>
        ),
    },
];

// Pill style matches mobi page.tsx lines 391–400 (hero variant includes whitespace-nowrap).
const HERO_PILL_CLASS =
    "inline-flex items-center gap-2 px-3 py-1.5 border border-gray-300 text-gray-500 text-xs font-mono tracking-wide uppercase rounded hover:border-gray-900 hover:text-gray-900 transition-colors whitespace-nowrap";

// End-of-page variant mirrors mobi page.tsx lines 417–428 (omits whitespace-nowrap).
const FOOTER_PILL_CLASS =
    "inline-flex items-center gap-2 px-3 py-1.5 border border-gray-300 text-gray-500 text-xs font-mono tracking-wide uppercase rounded hover:border-gray-900 hover:text-gray-900 transition-colors";

export default function TcpaCaseStudyPage() {
    return (
        <div className="bg-[#fcfcfc] text-[#1a1a1a] min-h-screen font-sans flex flex-col lg:flex-row">
            {/* Left Panel: Screenshot preview (replaces mobi's ReactFlow). */}
            <div className="hidden lg:block lg:w-[35%] h-screen sticky top-0 border-r border-gray-200 bg-gray-50/50 relative">
                <div className="h-full flex flex-col items-center justify-center p-8">
                    <img
                        src="/tcpa-preview.png"
                        alt="TCPA Litigation Explorer dashboard preview"
                        className="w-full rounded-sm shadow-lg border border-gray-200"
                    />
                    {/* Mono caption locked by OUTLINE §3.3 — "·" is U+00B7 middle-dot. */}
                    <p className="mt-6 font-mono text-[10px] text-gray-400 uppercase tracking-widest text-center">
                        In-browser DuckDB-WASM · 29K rows · No backend
                    </p>
                    <a
                        href="/tcpa/"
                        className={`mt-4 ${FOOTER_PILL_CLASS}`}
                        aria-label="Open the TCPA Litigation Explorer"
                    >
                        <ExternalLink className="w-4 h-4" />
                        Try it live
                    </a>
                </div>
            </div>

            {/* Right Panel: Content */}
            <div className="w-full lg:w-[65%] h-auto lg:h-screen overflow-y-auto">
                <div className="max-w-xl mx-auto px-8 py-24">
                    <header className="mb-16">
                        <p className="font-mono text-xs text-gray-500 mb-4 tracking-widest uppercase">
                            Case Study 003
                        </p>
                        <h1 className="font-serif text-4xl font-medium tracking-tight mb-6 text-gray-900">
                            TCPA: In-Browser Analytics
                        </h1>
                        <a
                            href="/tcpa/"
                            className={HERO_PILL_CLASS}
                            aria-label="Open the TCPA Litigation Explorer"
                        >
                            <ExternalLink className="w-4 h-4" />
                            Try it live
                        </a>
                    </header>

                    <div className="space-y-24">
                        {STEPS.map((step) => (
                            <section key={step.id} className="scroll-mt-24">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-8 h-[1px] bg-gray-300"></div>
                                    <h2 className="font-serif text-xl text-gray-900">{step.title}</h2>
                                </div>
                                <div className="text-gray-600 leading-relaxed text-sm pl-11">
                                    {step.content}
                                </div>
                            </section>
                        ))}
                    </div>

                    <div className="mt-24 pt-8 border-t border-gray-200">
                        <a
                            href="/tcpa/"
                            className={FOOTER_PILL_CLASS}
                            aria-label="Open the TCPA Litigation Explorer"
                        >
                            <ExternalLink className="w-4 h-4" />
                            Try it live
                        </a>
                    </div>

                    <div className="h-24" />
                </div>
            </div>
        </div>
    );
}
