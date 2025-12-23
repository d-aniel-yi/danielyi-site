"use client";

import { useEffect } from "react";
import { HeroSection } from "@/components/mercury/HeroSection";
import { InitialQuestionsAssumptions } from "@/components/mercury/InitialQuestionsAssumptions";
import { QualificationSection } from "@/components/mercury/QualificationSection";
import { DataSection } from "@/components/mercury/DataSection";
import { PainPointsSection } from "@/components/mercury/PainPointsSection";
import { ValuePropSection } from "@/components/mercury/ValuePropSection";
import { QuestionsSection } from "@/components/mercury/QuestionsSection";
import { StrategySection } from "@/components/mercury/StrategySection";
import { ClosingSection } from "@/components/mercury/ClosingSection";
import { TableOfContentsSection } from "@/components/mercury/TableOfContentsSection";
import "../mercury.css";

export default function MercuryPdfPage() {
    useEffect(() => {
        // Force all animated elements to be visible immediately
        const elements = document.querySelectorAll("[data-animate]");
        elements.forEach((el) => {
            el.classList.add("animated");
            // Remove delay to ensure immediate rendering for PDF capture
            (el as HTMLElement).style.animationDelay = "0ms";
            (el as HTMLElement).style.opacity = "1";
            (el as HTMLElement).style.transform = "none";
        });
    }, []);

    const SectionWrapper = ({ children }: { children: React.ReactNode }) => (
        <div className="print-page">
            {children}
        </div>
    );

    return (
        <div className="mercury-pdf-container">
            <style jsx global>{`
                /* Print-specific overrides */
                @media print {
                    @page {
                        size: A4 landscape;
                        margin: 0;
                    }
                    
                    html, body {
                        margin: 0 !important;
                        padding: 0 !important;
                        background-color: #0B0C15 !important;
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                        width: 100%;
                        height: 100%;
                    }

                    /* Hide Next.js dev tools */
                    #next-not-found-boundary,
                    nextjs-portal,
                    [data-nextjs-dialog-overlay] {
                        display: none !important;
                    }

                    .mercury-pdf-container {
                        width: 100%;
                        background-color: #0B0C15;
                    }

                    /* Each section becomes one PDF page */
                    .print-page {
                        page-break-after: always;
                        break-after: page;
                        width: 100vw;
                        height: 100vh;
                        overflow: hidden; /* Ensure strictly one page per section */
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        padding: 40px; /* Safe margin */
                        box-sizing: border-box;
                    }
                    
                    /* Reset inner layout to fit */
                    .scroll-section {
                        width: 100% !important;
                        height: 100% !important;
                        display: flex !important;
                        flex-direction: column !important;
                        justify-content: center !important;
                        padding: 0 !important;
                        margin: 0 !important;
                    }

                     /* Prevent breaking inside cards/containers */
                    .rounded-2xl, .target-card, .grid, p, h2, h3, h4, li {
                        break-inside: avoid;
                        page-break-inside: avoid;
                    }

                    /* Reset animations for print */
                     [data-animate] {
                        opacity: 1 !important;
                        transform: none !important;
                        animation: none !important;
                        transition: none !important;
                    }
                }
            `}</style>

            <SectionWrapper><HeroSection /></SectionWrapper>
            <SectionWrapper><TableOfContentsSection /></SectionWrapper>
            <SectionWrapper><InitialQuestionsAssumptions /></SectionWrapper>
            <SectionWrapper><QualificationSection /></SectionWrapper>
            <SectionWrapper><DataSection /></SectionWrapper>
            <SectionWrapper><PainPointsSection /></SectionWrapper>
            <SectionWrapper><ValuePropSection /></SectionWrapper>
            <SectionWrapper><QuestionsSection /></SectionWrapper>
            <SectionWrapper><StrategySection /></SectionWrapper>
            <SectionWrapper><ClosingSection /></SectionWrapper>
        </div>
    );
}
