"use client";

import { ApiHealth } from "@/components/status/ApiHealth";
import { Card, KeyValue, SectionHeader, CodeInline } from "@/components/technical/Sections";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Code, Server, Shield, Activity, Terminal } from "lucide-react";

export function TechnicalDetails({ isOpen, toggle }: { isOpen: boolean; toggle: () => void }) {
    return (
        <section className="bg-gray-50/50">
            <button
                onClick={toggle}
                className="w-full group flex items-center justify-between px-6 py-8 md:px-12 hover:bg-gray-50 transition-colors text-left"
            >
                <div className="space-y-1">
                    <h3 className="font-serif text-2xl text-gray-900 group-hover:text-blue-600 transition-colors flex items-center gap-3">
                        <Terminal className="w-6 h-6 text-gray-400 group-hover:text-blue-500" />
                        Technical Deep Dive
                    </h3>
                    <p className="text-sm text-gray-500 font-mono">
                        Infrastructure, Architecture & Trade-offs
                    </p>
                </div>

                <div className={`p-3 rounded-full border border-gray-200 bg-white group-hover:border-blue-200 group-hover:bg-blue-50 transition-all duration-300 ${isOpen ? "rotate-180" : ""}`}>
                    <ChevronDown className="w-5 h-5 text-gray-500 group-hover:text-blue-600" />
                </div>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                        className="overflow-hidden border-t border-gray-100"
                    >
                        <div className="px-6 py-12 md:px-12">
                            <div className="max-w-3xl mx-auto space-y-16">
                                <header className="text-center mb-16">
                                    <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
                                        This portfolio is a full‑stack demo deployed on AWS free‑tier.
                                        It&apos;s designed to be static‑first, accessible, and fully observable.
                                    </p>
                                    <div className="mt-4">
                                        <a
                                            href="https://github.com/d-aniel-yi/danielyi-site"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 text-sm font-medium text-gray-900 hover:text-blue-600 underline underline-offset-4 decoration-gray-300 hover:decoration-blue-600 transition-all"
                                        >
                                            <Code className="w-4 h-4" />
                                            View Source on GitHub
                                        </a>
                                    </div>
                                </header>

                                {/* Frontend Section */}
                                <section>
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                                            <Code className="w-6 h-6" />
                                        </div>
                                        <h2 className="font-serif text-3xl text-gray-900">Frontend Architecture</h2>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <Card>
                                            <SectionHeader title="Tech Stack" subtitle="Next.js + TypeScript" />
                                            <ul className="text-sm text-gray-600 space-y-2 mt-2">
                                                <li className="flex items-start gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                                                    <span><strong>React 18 Server Components</strong> by default.</span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                                                    <span><strong>Static Export</strong> (<CodeInline>output: &apos;export&apos;</CodeInline>) serves pre-rendered HTML/CSS/JS from S3.</span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                                                    <span><strong>Tailwind v4</strong> with editorial design tokens.</span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                                                    <span><strong>MDX</strong> pipeline for content.</span>
                                                </li>
                                            </ul>
                                        </Card>
                                        <Card>
                                            <SectionHeader title="Performance" subtitle="Fast-first defaults" />
                                            <ul className="text-sm text-gray-600 space-y-2 mt-2">
                                                <li className="flex items-start gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                                                    <span>Static export with long TTLs for assets.</span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                                                    <span>Minimal deps; system fonts + one display family.</span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                                                    <span>Lighthouse CI workflow to catch regressions.</span>
                                                </li>
                                            </ul>
                                        </Card>
                                        <Card>
                                            <SectionHeader title="Trade‑offs" subtitle="Free‑tier &amp; simplicity" />
                                            <ul className="text-sm text-gray-600 space-y-2 mt-2">
                                                <li className="flex items-start gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                                                    <span>Static export over SSR to reduce cost/complexity.</span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                                                    <span>DynamoDB over RDS to stay in free‑tier.</span>
                                                </li>
                                            </ul>
                                        </Card>
                                        <Card>
                                            <SectionHeader title="LaTeX & PDF" subtitle="Resume Generation" />
                                            <ul className="text-sm text-gray-600 space-y-2 mt-2">
                                                <li className="flex items-start gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                                                    <span>Build-time parsing of <CodeInline>template.tex</CodeInline> to HTML.</span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                                                    <span>WASM compile (SwiftLaTeX) for on-demand PDF generation.</span>
                                                </li>
                                            </ul>
                                        </Card>
                                        <Card>
                                            <SectionHeader title="PWA Support" subtitle="Native-like feel" />
                                            <ul className="text-sm text-gray-600 space-y-2 mt-2">
                                                <li className="flex items-start gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                                                    <span>Complete favicon set (ICO, SVG, PNG).</span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                                                    <span>Web app manifest for Android home screen.</span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                                                    <span>Maskable icons for splash screens.</span>
                                                </li>
                                            </ul>
                                        </Card>
                                    </div>
                                </section>

                                {/* Backend & Infra Section */}
                                <section>
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                                            <Server className="w-6 h-6" />
                                        </div>
                                        <h2 className="font-serif text-3xl text-gray-900">Backend & Infrastructure</h2>
                                    </div>
                                    <div className="grid grid-cols-1 gap-6 mb-6">
                                        <Card>
                                            <div className="flex items-center justify-between mb-4">
                                                <SectionHeader title="Live System Status" />
                                                <ApiHealth />
                                            </div>
                                            <p className="text-sm text-gray-500">Real-time probe of the serverless API endpoint.</p>
                                        </Card>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <Card>
                                            <SectionHeader title="Serverless API" subtitle="Lambda + API Gateway" />
                                            <KeyValue
                                                items={[
                                                    { key: "Runtime", value: "Node 20 (TS), esbuild bundled" },
                                                    { key: "Data", value: "DynamoDB (Single Table Design)" },
                                                    { key: "Email", value: "Amazon SES" },
                                                    { key: "Security", value: "Locked to prod origins" },
                                                ]}
                                            />
                                        </Card>
                                        <Card>
                                            <SectionHeader title="Infrastructure as Code" subtitle="AWS CDK" />
                                            <ul className="text-sm text-gray-600 space-y-2 mt-2">
                                                <li className="flex items-start gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 flex-shrink-0" />
                                                    <span>S3 private origin + CloudFront OAC.</span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 flex-shrink-0" />
                                                    <span>SPA fallback (403/404 → <CodeInline>/index.html</CodeInline>).</span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 flex-shrink-0" />
                                                    <span>Security headers + CSP for flags and API.</span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 flex-shrink-0" />
                                                    <span>Outputs piped to GitHub Actions for deploys.</span>
                                                </li>
                                            </ul>
                                        </Card>
                                    </div>
                                </section>

                                {/* Security Section */}
                                <section>
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                                            <Shield className="w-6 h-6" />
                                        </div>
                                        <h2 className="font-serif text-3xl text-gray-900">Security & Limits</h2>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <Card>
                                            <SectionHeader title="Rate Limiting" subtitle="DDoS Protection" />
                                            <ul className="text-sm text-gray-600 space-y-2 mt-2">
                                                <li className="flex items-center gap-2">
                                                    <span className="font-mono text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">3/hour</span>
                                                    <span>per IP</span>
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <span className="font-mono text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">10/day</span>
                                                    <span>per IP</span>
                                                </li>
                                                <li className="text-xs text-gray-400 mt-2">Tracks via DynamoDB with TTL expiry.</li>
                                            </ul>
                                        </Card>
                                        <Card>
                                            <SectionHeader title="Input Validation" subtitle="Strict enforcement" />
                                            <ul className="text-sm text-gray-600 space-y-2 mt-2">
                                                <li className="flex items-start gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                                                    <span>Max payload size: 10KB.</span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                                                    <span>Field length limits (100-2000 chars).</span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                                                    <span>Input sanitization (null bytes, control chars).</span>
                                                </li>
                                            </ul>
                                        </Card>
                                        <Card>
                                            <SectionHeader title="CAPTCHA Ready" subtitle="Cloudflare Turnstile" />
                                            <ul className="text-sm text-gray-600 space-y-2 mt-2">
                                                <li className="flex items-start gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                                                    <span>Implemented, disabled by default.</span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                                                    <span>Privacy-friendly & non-intrusive.</span>
                                                </li>
                                            </ul>
                                        </Card>
                                    </div>
                                </section>

                                {/* Observability Section */}
                                <section>
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="p-2 bg-orange-50 rounded-lg text-orange-600">
                                            <Activity className="w-6 h-6" />
                                        </div>
                                        <h2 className="font-serif text-3xl text-gray-900">Observability</h2>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <Card>
                                            <SectionHeader title="CloudWatch Alarms" subtitle="5 alarms monitoring" />
                                            <ul className="text-sm text-gray-600 space-y-2 mt-2">
                                                <li className="flex items-start gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5 flex-shrink-0" />
                                                    <span>Lambda invocations {'>'}1000/hour.</span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5 flex-shrink-0" />
                                                    <span>Lambda errors {'>'}10/hour.</span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5 flex-shrink-0" />
                                                    <span>API 4xx {'>'}50/h, Throttles {'>'}20.</span>
                                                </li>
                                            </ul>
                                        </Card>
                                        <Card>
                                            <SectionHeader title="SNS Notifications" subtitle="Real‑time alerts" />
                                            <ul className="text-sm text-gray-600 space-y-2 mt-2">
                                                <li className="flex items-start gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5 flex-shrink-0" />
                                                    <span>Email notifications for all alarms.</span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5 flex-shrink-0" />
                                                    <span>Immediate incident response capability.</span>
                                                </li>
                                            </ul>
                                        </Card>
                                        <Card>
                                            <SectionHeader title="Dashboard" subtitle="CloudWatch metrics" />
                                            <ul className="text-sm text-gray-600 space-y-2 mt-2">
                                                <li className="flex items-start gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5 flex-shrink-0" />
                                                    <span>Request rates & error counts.</span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5 flex-shrink-0" />
                                                    <span>Historical trend analysis.</span>
                                                </li>
                                            </ul>
                                        </Card>
                                    </div>
                                </section>

                                {/* Cost Protection Section */}
                                <section>
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="p-2 bg-red-50 rounded-lg text-red-600">
                                            <Shield className="w-6 h-6" /> {/* Reusing Shield for Cost/Defense */}
                                        </div>
                                        <h2 className="font-serif text-3xl text-gray-900">Cost Protection</h2>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <Card>
                                            <SectionHeader title="Normal Traffic" subtitle="$0/month" />
                                            <ul className="text-sm text-gray-600 space-y-2 mt-2">
                                                <li className="flex items-start gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
                                                    <span>All services within AWS free tier.</span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
                                                    <span>API Gateway: 1M requests free.</span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
                                                    <span>DynamoDB: 25GB, 25 WCU/RCU free.</span>
                                                </li>
                                            </ul>
                                        </Card>
                                        <Card>
                                            <SectionHeader title="Under Attack" subtitle="~$2-3/month max" />
                                            <ul className="text-sm text-gray-600 space-y-2 mt-2">
                                                <li className="flex items-start gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
                                                    <span>Rate limiting caps request volume.</span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
                                                    <span>CloudWatch alarms enable quick response.</span>
                                                </li>
                                            </ul>
                                        </Card>
                                        <Card>
                                            <SectionHeader title="Without Protection" subtitle="$50-500+/month" />
                                            <ul className="text-sm text-gray-600 space-y-2 mt-2">
                                                <li className="flex items-start gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
                                                    <span>Unlimited Lambda invocations.</span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
                                                    <span>Unbounded DynamoDB writes.</span>
                                                </li>
                                            </ul>
                                        </Card>
                                    </div>
                                </section>

                                {/* What's Next Section */}
                                <section>
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="p-2 bg-gray-100 rounded-lg text-gray-600">
                                            <Terminal className="w-6 h-6" />
                                        </div>
                                        <h2 className="font-serif text-3xl text-gray-900">What&rsquo;s Next</h2>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                                        <Card>
                                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                                                <li className="flex items-start gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-1.5 flex-shrink-0" />
                                                    <span>Per‑PR previews via a staging distribution.</span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-1.5 flex-shrink-0" />
                                                    <span>Stronger CSP + Lighthouse budgets.</span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-1.5 flex-shrink-0" />
                                                    <span>CI &ldquo;Print to PDF&rdquo; artifact for the resume.</span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-1.5 flex-shrink-0" />
                                                    <span>AWS Budget alert automation (currently manual).</span>
                                                </li>
                                            </ul>
                                        </Card>
                                    </div>
                                </section>

                                <div className="p-8 bg-gray-900 rounded-2xl text-center">
                                    <h3 className="font-serif text-2xl text-white mb-4">Performance at the Edge</h3>
                                    <div className="grid grid-cols-3 gap-4 text-white/80 text-sm">
                                        <div>
                                            <div className="text-3xl font-bold text-white mb-1">100<span className="text-base font-normal text-white/50">%</span></div>
                                            <div>Static Cache Hit</div>
                                        </div>
                                        <div>
                                            <div className="text-3xl font-bold text-white mb-1">0<span className="text-base font-normal text-white/50">ms</span></div>
                                            <div>Cold Starts (Static)</div>
                                        </div>
                                        <div>
                                            <div className="text-3xl font-bold text-white mb-1">A<span className="text-base font-normal text-white/50">+</span></div>
                                            <div>Security Grade</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
