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

    return (
        <div className="mercury-pdf-container min-h-screen bg-[#0B0C15] text-white">
            <style jsx global>{`
                /* Print-specific overrides */
                @media print {
                    @page {
                        size: landscape;
                        margin: 0;
                    }
                    body {
                        background-color: #0B0C15 !important;
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                    .scroll-section {
                        page-break-after: always;
                        height: 100vh !important; /* Force full page height for each section */
                        width: 100vw !important;
                        padding: 4rem !important; /* increased padding for better framing */
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                        overflow: hidden;
                    }
                    /* Prevent breaking inside cards/containers */
                    .rounded-2xl, .target-card, .grid, p, h2, h3, h4, li {
                        break-inside: avoid;
                        page-break-inside: avoid;
                    }
                    /* Ensure no scrollbars or overflows */
                    .mercury-pdf-container {
                        overflow: visible !important;
                        height: auto !important;
                    }
                }

                /* Force visibility override for PDF generation context */
                [data-animate] {
                    opacity: 1 !important;
                    transform: none !important;
                    animation: none !important;
                }
            `}</style>

            <HeroSection />
            <InitialQuestionsAssumptions />
            <QualificationSection />
            <DataSection />
            <PainPointsSection />
            <ValuePropSection />
            <QuestionsSection />
            <StrategySection />
            <ClosingSection />
        </div>
    );
}
