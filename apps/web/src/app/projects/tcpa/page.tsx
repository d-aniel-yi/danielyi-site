"use client";

// Structural template: apps/web/src/app/projects/mobi/page.tsx (verified 2026-04-19).
// Intentionally omits next/link, next/image, and the ReactFlow library used by mobi —
// this page is narrative + screenshot, no diagram.
// Outer flex container MUST NOT carry an overflow-* utility (breaks sticky left panel —
// see .planning/STATE.md line 41 / RESEARCH.md Pitfall 3).

import { ExternalLink } from "lucide-react";

// --- Inline-link class (locked in 07-OUTLINE §6). ---
const LINK_CLASS =
    "text-gray-900 underline underline-offset-4 decoration-gray-300 hover:decoration-gray-900";

// --- Data ---

const STEPS = [
    {
        id: "why-created",
        title: "Why this was created: The TCPA Litigation Explorer",
        content: (
            <>
                <p>
                    The <strong>TCPA Litigation Visualizer</strong> is a dashboard for tracking trends in the consumer communications space. This was created to inform a series of blog posts and articles I was looking to publish about data in the TCPA litigation space. I was having trouble finding reliable sources of information and a way to visualize and explore the data trends, so I decided to build one myself using MotherDuck and DuckDB-WASM. 
                </p>
                </>
        ),
    },
    {
        id: "the-problem",
        title: "The Problem: Post-Duguid TCPA Trend Analysis",
        content: (
            <>
                <p>
                    Consumer-protection litigation is a moving target, and the move that matters most
                    happened on April 1, 2021. That is when the Supreme Court handed down <em>Facebook v.
                    Duguid</em>, narrowing the definition of an <strong>automatic telephone dialing
                    system</strong> (ATDS) under the Telephone Consumer Protection Act. After Duguid, a
                    device had to use a random-or-sequential number generator to qualify — predictive
                    dialers working from stored lists, which had powered most TCPA suits for a decade,
                    largely fell outside the statute. The plaintiffs&apos; bar responded by pivoting: fewer
                    ATDS claims, more Do-Not-Call (DNC) and pre-recorded-voice claims, and heavier use of
                    state Mini-TCPA statutes where the federal ceiling no longer held.
                </p>

                <p className="mt-4">
                    That pivot is the story the numbers should tell, but the numbers are hard to see. The
                    <em> Consumer Litigation Visualizer</em> was built to make it legible — a trend tracker
                    for the four statutes that shape consumer privacy and credit litigation: <strong>TCPA</strong>{" "}
                    (47 U.S.C. § 227), <strong>FDCPA</strong> (15 U.S.C. § 1692), <strong>FCRA</strong>{" "}
                    (15 U.S.C. § 1681), and CFPB enforcement actions. All four share the post-Duguid window
                    as a coherent analytical period, and together they describe how the regulatory floor for
                    consumer communication gets built in practice.
                </p>
                <p className="mt-4">
                    Data comes from the{" "}
                    <a
                        href="https://www.courtlistener.com/help/api/rest/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={LINK_CLASS}
                    >
                        CourtListener REST API
                    </a>
                    , the public interface to the Free Law Project&apos;s RECAP archive of federal PACER
                    filings. That scope cuts two ways. On one hand, it gives clean, authoritative docket
                    coverage across every federal district court — rate-limited at about 5,000 authenticated
                    requests per hour, pagination by cursor, and no scraping needed. On the other hand, it
                    is federal-only. State Mini-TCPAs — Florida&apos;s FTSA, Washington&apos;s WADAD,
                    Oklahoma&apos;s TSHA — are the post-Duguid escape valve the plaintiffs&apos; bar uses
                    most, and they live in state dockets that RECAP does not index. That blind spot is
                    documented on the visualizer&apos;s Methodology tab rather than hidden, because an
                    honest trend chart names its gaps.
                </p>
                <p className="mt-4">
                    Getting from a search API to a classified case table is three steps, not one. First,
                    ingest: the pipeline queries CourtListener for each statute&apos;s keywords — for TCPA
                    that means <code>&quot;TCPA&quot; OR &quot;47 U.S.C. § 227&quot;</code> and variants — then
                    post-filters false positives using Nature-of-Suit and cause codes. The broad keyword
                    sweep catches roughly 18% more cases than a narrow Nature-of-Suit query, but it also
                    pulls in ADA, insurance, and contract cases where &quot;TCPA&quot; appears incidentally.
                    The filter rejects those; rows with blank NOS/cause are kept under the benefit of the
                    doubt because CourtListener has not yet indexed them.
                </p>
                <p className="mt-4">
                    Second, keyword-classify: for each surviving case, a document-level search over the
                    complaint text (CourtListener&apos;s <code>type=rd</code> search mode) decides whether
                    the claim is about SMS, voice, or fax, and whether the legal theory is ATDS, DNC, or
                    both. Third, PDF-extract: when keyword search comes back inconclusive, the pipeline
                    downloads the actual complaint PDF from RECAP&apos;s CDN (no auth, no rate limit), runs
                    it through <code>pdfplumber</code>, and classifies from the full text. Plaintiff names
                    come out of the API&apos;s party array plus a &quot;filed by&quot; regex over the
                    complaint head; class-action flags come out of case-name patterns and complaint body
                    text. The combined pipeline resolves plaintiff identity for about 99% of cases.
                </p>
                <p className="mt-4">
                    The result is a table with roughly 29,000 rows covering April 2021 through the present,
                    classified into the axes that matter for post-Duguid analysis: <code>claim_type</code>{" "}
                    (SMS / Voice / Fax / Unknown), <code>legal_theory</code> (ATDS / DNC / Both / Unknown),{" "}
                    <code>is_class_action</code>, plus the usual docket metadata. Unknowns are not silently
                    dropped — they live in a sibling table, <code>cases_unclassified</code>, and the
                    dashboard exposes an &quot;Include unclassified&quot; toggle that unions them back in
                    with a tooltip that explains what the user just changed. Trend analysis only works if
                    the sample frame is visible; the visualizer treats that as a UX problem, not a
                    methodology footnote.
                </p>
            </>
        ),
    },
    {
        id: "motherduck-dives",
        title: "MotherDuck Dives: Dashboards as Code",
        content: (
            <>
                <p>
                    The first home for this data was a <strong>MotherDuck Dive</strong> — a React dashboard
                    that lives inside MotherDuck, queries MotherDuck-hosted tables live, and ships as a
                    single shareable URL. A Dive is BI-as-code: you author it in TSX, commit it to the
                    database the way you would commit a migration, and let teammates open it without
                    exporting a CSV or standing up a BI tenant. Compared to Tableau or Power BI, the
                    trade-off is explicit. You lose the drag-and-drop authoring surface and the ecosystem
                    of pre-built chart packs. You gain version control, composable queries, and the ability
                    to write exactly the interaction model the narrative needs — toggles that mean
                    something, not generic slicer panes.
                </p>
                <p className="mt-4">
                    For the Consumer Litigation Visualizer, that meant five tabs, each answering one
                    question:{" "}
                    <strong>Filings</strong> (how many cases, where, filtered by statute pills for TCPA /
                    FDCPA / FCRA / CFPB),{" "}
                    <strong>Serial Litigators</strong> (who files repeatedly — the long tail of named
                    plaintiffs that shows up in the data),{" "}
                    <strong>Financial Exposure</strong> (penalties and class-action indicators),{" "}
                    <strong>Trend Analysis</strong> (MTD / YTD presets with snapshot panels that break down
                    claim type, legal theory, and top plaintiffs for the selected window), and{" "}
                    <strong>Methodology</strong> (the data-source and classification documentation that
                    every honest trend dashboard owes its readers).
                </p>
                <p className="mt-4">
                    The interaction that earns its keep is the &quot;Include unclassified&quot; toggle.
                    About 171 TCPA cases in the post-Duguid window could not be classified by either
                    keyword search or PDF extraction — the complaints were sealed, the PDFs unavailable, or
                    the allegations ambiguous. Hiding them would be tidy; unioning them back in with a
                    tooltip is honest. A Dive makes that a one-line UNION ALL against a sibling table,
                    wired to a checkbox whose label explains itself. A traditional BI tool treats it as a
                    filter; a dashboard-as-code treats it as a methodology control.
                </p>
                <p className="mt-4">
                    The underlying queries are what you&apos;d expect — DuckDB SQL with window functions,
                    CASE classification, and a generated month spine for time series:
                </p>
                <div className="mt-6 p-4 bg-[#1e1e1e] text-gray-300 rounded-sm font-mono text-xs overflow-x-auto border border-gray-800">
                    <p className="text-gray-500">-- Top defendants over the post-Duguid window</p>
                    <p className="text-gray-500">-- excerpt from .dive-preview/src/dive.tsx</p>
                    <p><span className="text-purple-400">WITH</span> filtered <span className="text-purple-400">AS</span> (</p>
                    <p>&nbsp;&nbsp;<span className="text-purple-400">SELECT</span></p>
                    <p>&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-400">CASE WHEN</span> case_name <span className="text-purple-400">LIKE</span> <span className="text-green-400">&apos;% v. %&apos;</span></p>
                    <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-400">THEN</span> split_part(case_name, <span className="text-green-400">&apos; v. &apos;</span>, <span className="text-orange-400">2</span>)</p>
                    <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-400">ELSE</span> case_name <span className="text-purple-400">END</span> <span className="text-purple-400">AS</span> defendant,</p>
                    <p>&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-400">COUNT</span>(*) <span className="text-purple-400">AS</span> cases,</p>
                    <p>&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-400">COUNT</span>(<span className="text-purple-400">DISTINCT</span> plaintiff) <span className="text-purple-400">AS</span> unique_plaintiffs,</p>
                    <p>&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-400">COUNT</span>(<span className="text-purple-400">DISTINCT</span> court) <span className="text-purple-400">AS</span> courts</p>
                    <p>&nbsp;&nbsp;<span className="text-purple-400">FROM</span> cases</p>
                    <p>&nbsp;&nbsp;<span className="text-purple-400">WHERE</span> date_filed <span className="text-purple-400">&gt;=</span> <span className="text-green-400">&apos;2021-04-01&apos;</span></p>
                    <p>&nbsp;&nbsp;<span className="text-purple-400">GROUP BY</span> <span className="text-orange-400">1</span></p>
                    <p>)</p>
                    <p><span className="text-purple-400">SELECT</span> * <span className="text-purple-400">FROM</span> filtered <span className="text-purple-400">ORDER BY</span> cases <span className="text-purple-400">DESC</span> <span className="text-purple-400">LIMIT</span> <span className="text-orange-400">25</span>;</p>
                </div>
                <p className="mt-4">
                    The quiet feature is dual-execution. The same React component that runs the Dive
                    against live MotherDuck data can also run against in-browser DuckDB-WASM with only the
                    <code> useSQLQuery</code> provider swapped out. That is the architectural hinge for the
                    next section: the Dive is the source of truth, but it is not the final published form.{" "}
                    <a
                        href="https://motherduck.com/docs/key-tasks/ai-and-motherduck/dives/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={LINK_CLASS}
                    >
                        MotherDuck Dives docs
                    </a>
                    .
                </p>
            </>
        ),
    },
    {
        id: "motherduck-mcp",
        title: "MotherDuck MCP: Conversational ETL",
        content: (
            <>
                <p>
                    The three-step pipeline described above — ingest, keyword-classify, PDF-extract — did
                    not arrive fully-formed. Earlier versions of it lived as a batch script that processed
                    cases in a blind loop, surfacing errors only after the run finished. Each debug round
                    meant rerunning the whole pipeline against a MotherDuck database you could not see
                    into from a code editor. The <strong>MotherDuck MCP server</strong> collapsed that
                    loop.
                </p>
                <p className="mt-4">
                    MCP — the Model Context Protocol — lets an AI agent (Claude, Cursor, the MotherDuck
                    chat surface) execute SQL directly against the database while you are having a
                    conversation about the data. Schema exploration stops being a context-switch:{" "}
                    <code>FROM cases LIMIT 5</code> becomes a chat prompt. You can ask the agent &quot;why
                    do these 200 cases have <code>claim_type = &apos;Unknown&apos;</code>?&quot; and watch
                    it write the diagnostic query, run it, and revise the classification logic — all
                    without leaving the thread. The three-step pipeline became a conversational artifact:
                    draft a classification rule, run it against a slice, look at the misses, refine. The
                    ETL code evolved on paper; the ETL iteration loop evolved in chat.
                </p>
                <p className="mt-4">
                    The Dives themselves often follow the same build path. The MotherDuck surface includes
                    AI authoring that lets you describe a dashboard in natural language and produces the
                    TSX component against your actual schema. That closes a loop that used to need at
                    least three handoffs: &quot;describe the data&quot; → &quot;write the queries&quot; →
                    &quot;wire them to charts.&quot; With the MCP server plumbed into the editor, all
                    three happen in the same conversation, grounded against a live database rather than a
                    sample extract.
                </p>
                <p className="mt-4">
                    The MotherDuck MCP server ships in two flavors: a self-hosted local version run behind your own credentials, and a remote, MotherDuck-managed server that went GA in
                    December 2025. For this project the self-hosted path was enough — one entry in the
                    editor&apos;s MCP config, one <code>MOTHERDUCK_TOKEN</code>, and the agent had
                    schema-aware access. See{" "}
                    <a
                        href="https://github.com/motherduckdb/mcp-server-motherduck"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={LINK_CLASS}
                    >
                        motherduckdb/mcp-server-motherduck
                    </a>{" "}
                    for the reference implementation.
                </p>
            </>
        ),
    },
    {
        id: "duckdb-wasm",
        title: "DuckDB-WASM: Zero-Backend Publishing",
        content: (
            <>
                <p>
                    The MotherDuck Dive is the source of truth, but it is not the form a reader opens on
                    their phone. A Dive requires a MotherDuck account — reasonable for a team, a wall for
                    anyone clicking from a case-study page. The solution is an architectural flip: take the
                    same React component that powers the Dive, point it at a snapshot of the data baked
                    into the page, and serve the whole thing as a static file. That is the <code>/tcpa</code>{" "}
                    visualizer shipped on this site.
                </p>
                <p className="mt-4">
                    At build time, a small Python script connects to MotherDuck and runs{" "}
                    <code>COPY (SELECT * FROM cases) TO &apos;cases.parquet&apos; (FORMAT PARQUET,
                    COMPRESSION ZSTD)</code>. The 29,000-row <code>cases</code> table compresses down to
                    roughly 2–3&nbsp;MB; the 171-row <code>cases_unclassified</code> table lands under a
                    kilobyte. Vite bundles both Parquet files into the public directory alongside a React
                    build. At runtime, the browser downloads them, spins up{" "}
                    <strong>DuckDB-WASM</strong> (~4&nbsp;MB, cached after first visit), and hands the
                    connection to the same dashboard code that runs against MotherDuck in production.
                    Queries execute locally in 5–50&nbsp;ms against in-memory tables; initial load is
                    roughly 3–5&nbsp;seconds on a cold cache and near-instant afterwards.
                </p>
                <p className="mt-4">
                    The pivot point is how DuckDB-WASM consumes the Parquet files. The provider fetches each
                    file as an <code>ArrayBuffer</code>, registers it with the WASM filesystem, and creates
                    an in-memory table that mirrors the MotherDuck schema:
                </p>
                <div className="mt-6 p-4 bg-[#1e1e1e] text-gray-300 rounded-sm font-mono text-xs overflow-x-auto border border-gray-800">
                    <p className="text-gray-500">{"// static-site/src/duckdb-provider.tsx (excerpt)"}</p>
                    <p><span className="text-purple-400">for</span> (<span className="text-purple-400">const</span> pf <span className="text-purple-400">of</span> parquetFiles) &#123;</p>
                    <p>&nbsp;&nbsp;<span className="text-purple-400">const</span> resp = <span className="text-purple-400">await</span> <span className="text-yellow-300">fetch</span>(pf.url);</p>
                    <p>&nbsp;&nbsp;<span className="text-purple-400">const</span> buf&nbsp; = <span className="text-purple-400">await</span> resp.<span className="text-yellow-300">arrayBuffer</span>();</p>
                    <p>&nbsp;&nbsp;<span className="text-purple-400">await</span> db.<span className="text-yellow-300">registerFileBuffer</span>(</p>
                    <p>&nbsp;&nbsp;&nbsp;&nbsp;pf.tableName + <span className="text-green-400">&quot;.parquet&quot;</span>,</p>
                    <p>&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-400">new</span> <span className="text-yellow-300">Uint8Array</span>(buf),</p>
                    <p>&nbsp;&nbsp;);</p>
                    <p>&nbsp;&nbsp;<span className="text-purple-400">await</span> conn.<span className="text-yellow-300">query</span>(</p>
                    <p>&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-green-400">`CREATE TABLE &quot;$&#123;pf.tableName&#125;&quot; AS SELECT * FROM read_parquet(&apos;$&#123;pf.tableName&#125;.parquet&apos;)`</span>,</p>
                    <p>&nbsp;&nbsp;);</p>
                    <p>&#125;</p>
                </div>
                <p className="mt-4">
                    The production Dive and the static bundle share every component. Only the{" "}
                    <code>useSQLQuery</code> provider differs: the static version rewrites fully-qualified
                    table references such as <code>&quot;consumer_litigation&quot;.&quot;main&quot;.&quot;cases&quot;</code>{" "}
                    down to unqualified <code>cases</code> at query time, so the same SELECT statements
                    written against MotherDuck run unchanged against the in-memory DuckDB-WASM instance.
                    One set of charts, two data sources — the one the project team sees, with live data
                    and sub-second writes, and the one the public sees, frozen to the build-time snapshot
                    and free to host.
                </p>
                <p className="mt-4">
                    DuckDB-WASM ships its threaded WASM build behind two HTTP headers that are usually an
                    afterthought: <code>Cross-Origin-Opener-Policy: same-origin</code> and{" "}
                    <code>Cross-Origin-Embedder-Policy: require-corp</code>. Together they unlock{" "}
                    <code>SharedArrayBuffer</code>, which is how the threaded WASM worker actually does
                    useful work. Without those headers the engine falls back to the single-threaded build
                    and query latency climbs; with them, the library performs like a local DuckDB process.
                    The deployment sets both headers on every response under <code>/tcpa/*</code> at the
                    CDN layer, so the visualizer works from any modern browser with no user configuration.
                </p>
                <p className="mt-4">
                    The economic argument writes itself. The Dive needs MotherDuck seats for every reader;
                    the static bundle needs no server, no API keys, no authentication, and sits on the same
                    CDN as the rest of this site. Data freshness is the trade-off — MotherDuck is live,
                    the static snapshot is frozen until the next export — but that is exactly the right
                    contract for a case study. A reader does not need real-time TCPA filings. They need a
                    trustworthy snapshot they can explore for five minutes without creating an account.
                    When the underlying legal landscape shifts again, a rebuild-and-redeploy cycle picks
                    up the new data; until then, the static site runs for as close to zero marginal cost
                    as public infrastructure allows. See{" "}
                    <a
                        href="https://github.com/duckdb/duckdb-wasm"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={LINK_CLASS}
                    >
                        duckdb/duckdb-wasm
                    </a>{" "}
                    for the engine.
                </p>
            </>
        ),
    },
    {
        id: "closing",
        title: "What This Stack Lets You Ship",
        content: (
            <>
                <p>
                    A traditional BI tool gives you a dashboard behind a login. This stack gives you a
                    dashboard as a file. The post-Duguid landscape will keep moving — new state
                    Mini-TCPAs, new circuit splits, another pivot in the plaintiffs&apos; bar&apos;s
                    playbook — and the tool that reads it needs to outlive the snapshot it was built
                    against. A MotherDuck Dive carries the live data for the team that maintains the
                    pipeline; a DuckDB-WASM static export carries a trustworthy, reproducible view of
                    that data to anyone with a URL. Two audiences, one codebase, zero marginal cost per
                    reader. That is the shipping form the problem needed.
                </p>
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
