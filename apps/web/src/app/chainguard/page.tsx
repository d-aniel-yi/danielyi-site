"use client";

import { useState, useEffect } from "react";
import { PasswordGate } from "@/components/chainguard/PasswordGate";
import { HeroSection } from "@/components/chainguard/HeroSection";
import { IntroSection } from "@/components/chainguard/IntroSection";
import { PlanSection } from "@/components/chainguard/PlanSection";
import { ROISection } from "@/components/chainguard/ROISection";
import { ClosingSection } from "@/components/chainguard/ClosingSection";
import { NavigationDots } from "@/components/chainguard/NavigationDots";
import "./chainguard.css";

export default function ChainguardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);

  useEffect(() => {
    // Check if already authenticated in this session
    const auth = sessionStorage.getItem("chainguard_auth");
    if (auth === "true") {
      setIsAuthenticated(true);
    }
    
    // Reset scroll position immediately on mount
    const container = document.querySelector(".chainguard-container") as HTMLElement;
    if (container) {
      container.scrollTop = 0;
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;

    // Get the scrollable container
    const container = document.querySelector(".chainguard-container") as HTMLElement;
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
    if (password === "chainguard") {
      setIsAuthenticated(true);
      sessionStorage.setItem("chainguard_auth", "true");
      return true;
    }
    return false;
  };

  if (!isAuthenticated) {
    return <PasswordGate onSubmit={handlePasswordSubmit} />;
  }

  const planData = [
    {
      days: "30",
      title: "Foundation & Immersion",
      focus: "Understanding Chainguard's ecosystem and establishing credibility",
      goals: [
        "Deep dive into Chainguard's product suite: Containers, VMs, Libraries, and Images",
        "Master the security landscape - understand SLSA, SBOM, and supply chain security",
        "Map the sales process, identify key stakeholders, and learn from top performers",
        "Build relationships with engineering, product, and marketing teams",
        "Research target accounts in high-growth sectors (fintech, healthcare, government)"
      ],
      deliverables: [
        "Complete product certification and technical deep-dive",
        "Map of 50+ target accounts with ICP fit analysis",
        "Sales playbook v1.0 with objection handling framework",
        "First 10 qualified discovery calls booked"
      ],
      impact: "Establish myself as a technical sales professional who understands both the product and the market"
    },
    {
      days: "60",
      title: "Pipeline Development & Execution",
      focus: "Building momentum and closing initial deals",
      goals: [
        "Execute on target account list with personalized, value-driven outreach",
        "Develop case studies and proof points from early wins",
        "Collaborate with SDR team to optimize lead qualification",
        "Establish partnerships with key channel partners and integrators",
        "Create sales enablement materials based on real customer conversations"
      ],
      deliverables: [
        "Active pipeline of $500K+ ARR in qualified opportunities",
        "2-3 closed deals with enterprise customers",
        "Refined sales playbook v2.0 with proven messaging",
        "Channel partner program framework established"
      ],
      impact: "Demonstrate immediate revenue contribution and establish repeatable sales motion"
    },
    {
      days: "90",
      title: "Scale & Optimization",
      focus: "Proving ROI and setting up for long-term success",
      goals: [
        "Exceed quarterly quota with consistent pipeline generation",
        "Build strategic relationships with Fortune 500 security teams",
        "Contribute to product roadmap based on customer feedback",
        "Mentor new sales hires and share best practices",
        "Establish thought leadership through content and speaking"
      ],
      deliverables: [
        "150%+ of quarterly quota achieved",
        "5+ enterprise deals closed with expansion potential",
        "Documented sales methodology shared across team",
        "Pipeline coverage of 3x+ for next quarter"
      ],
      impact: "Prove that investing in me delivers measurable ROI and positions Chainguard for accelerated growth"
    }
  ];

  return (
    <div className="h-screen overflow-y-scroll scroll-smooth chainguard-container" style={{ scrollBehavior: 'auto' }}>
      <HeroSection />
      <IntroSection />
      
      {planData.map((plan, index) => (
        <PlanSection
          key={plan.days}
          {...plan}
          isEven={index % 2 === 0}
        />
      ))}

      <ROISection />
      <ClosingSection />

      <NavigationDots 
        totalSections={planData.length + 4} 
        currentSection={currentSection}
        onNavigate={(index) => {
          const sections = document.querySelectorAll(".scroll-section");
          sections[index]?.scrollIntoView({ behavior: "smooth" });
        }}
      />
    </div>
  );
}

