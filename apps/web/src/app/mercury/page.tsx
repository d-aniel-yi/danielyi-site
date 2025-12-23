"use client";

import { useState, useEffect } from "react";
import { PasswordGate } from "@/components/mercury/PasswordGate";
import { HeroSection } from "@/components/mercury/HeroSection";
import { QualificationSection } from "@/components/mercury/QualificationSection";
import { DataSection } from "@/components/mercury/DataSection";
import { PainPointsSection } from "@/components/mercury/PainPointsSection";
import { ValuePropSection } from "@/components/mercury/ValuePropSection";
import { QuestionsSection } from "@/components/mercury/QuestionsSection";
import { StrategySection } from "@/components/mercury/StrategySection";
import { ClosingSection } from "@/components/mercury/ClosingSection";
import { NavigationDots } from "@/components/mercury/NavigationDots";
import "./mercury.css";

export default function MercuryPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentSection, setCurrentSection] = useState(0);

    useEffect(() => {
        // Check if already authenticated in this session
        const auth = sessionStorage.getItem("mercury_auth");
        if (auth === "true") {
            setIsAuthenticated(true);
        }

        // Reset scroll position immediately on mount
        const container = document.querySelector(".mercury-container") as HTMLElement;
        if (container) {
            container.scrollTop = 0;
        }
    }, []);

    useEffect(() => {
        if (!isAuthenticated) return;

        // Get the scrollable container
        const container = document.querySelector(".mercury-container") as HTMLElement;
        if (!container) return;

        // Reset scroll position to top when authenticated
        container.scrollTop = 0;

        // Intersection Observer for animations
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("animated");
                    }
                });
            },
            { threshold: 0.1, rootMargin: "0px 0px -10% 0px" }
        );

        // Observe all elements with data-animate
        const elements = document.querySelectorAll("[data-animate]");
        elements.forEach((el) => observer.observe(el));

        // Hero fade-out and section tracking on scroll
        const handleScroll = () => {
            const scrollPosition = container.scrollTop;
            const viewportHeight = window.innerHeight;

            // Hero fade
            const hero = document.querySelector(".hero-section") as HTMLElement;
            if (hero) {
                const opacity = Math.max(0, 1 - scrollPosition / viewportHeight);
                hero.style.opacity = String(opacity);
            }

            // Track section for navigation dots using container's scroll position
            const sections = document.querySelectorAll(".scroll-section");
            const centerPoint = scrollPosition + viewportHeight / 2;

            let newSection = 0;
            sections.forEach((section, index) => {
                const element = section as HTMLElement;
                const sectionTop = element.offsetTop;
                const sectionBottom = sectionTop + element.offsetHeight;

                if (centerPoint >= sectionTop && centerPoint < sectionBottom) {
                    newSection = index;
                }
            });

            setCurrentSection(newSection);
        };

        // Initial call to set current section on load
        setTimeout(handleScroll, 100);

        // Listen to scroll on the scrollable container
        container.addEventListener("scroll", handleScroll, { passive: true });

        return () => {
            container.removeEventListener("scroll", handleScroll);
            observer.disconnect();
        };
    }, [isAuthenticated]);

    const handlePasswordSubmit = (password: string) => {
        if (password === "mercury") {
            setIsAuthenticated(true);
            sessionStorage.setItem("mercury_auth", "true");
            return true;
        }
        return false;
    };

    if (!isAuthenticated) {
        return <PasswordGate onSubmit={handlePasswordSubmit} />;
    }

    const sections = [
        HeroSection,
        QualificationSection,
        DataSection,
        PainPointsSection,
        ValuePropSection,
        QuestionsSection,
        StrategySection,
        ClosingSection
    ];

    return (
        <div className="h-screen overflow-y-scroll scroll-smooth mercury-container" style={{ scrollBehavior: 'auto' }}>
            <HeroSection />
            <QualificationSection />
            <DataSection />
            <PainPointsSection />
            <ValuePropSection />
            <QuestionsSection />
            <StrategySection />
            <ClosingSection />

            <NavigationDots
                totalSections={sections.length}
                currentSection={currentSection}
                onNavigate={(index) => {
                    const scrollSections = document.querySelectorAll(".scroll-section");
                    scrollSections[index]?.scrollIntoView({ behavior: "smooth" });
                }}
            />
        </div>
    );
}
