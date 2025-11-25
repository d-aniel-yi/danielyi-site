"use client";

import { useState, useEffect } from "react";
import { HeroSection } from "@/components/chainguard/HeroSection";
import { IntroSection } from "@/components/chainguard/IntroSection";
import { BeforeDayZeroSection } from "@/components/chainguard/BeforeDayZeroSection";
import { PlanSection } from "@/components/chainguard/PlanSection";
import { ROISection } from "@/components/chainguard/ROISection";
import { ClosingSection } from "@/components/chainguard/ClosingSection";
import { NavigationDots } from "@/components/chainguard/NavigationDots";
import "./chainguard.css";

export default function ChainguardPage() {
  const [currentSection, setCurrentSection] = useState(0);

  useEffect(() => {
    // Get the scrollable container
    const container = document.querySelector(".chainguard-container") as HTMLElement;
    if (!container) return;

    // Reset scroll position immediately on mount
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
  }, []);

  const beforeDayZeroData = {
    goals: [

    
      {
        goal: "Relearn and become familiar with supply-chain security basics",

        actions: [
          "Read through SLSA documentation",
          "Study CNCF Software Supply Chain Best Practices Whitepaper",
          "Learn from cybersecurity thought leaders and experts (John Hammond, Black Hills Information Security, etc",
          "Read through Verizon DBIR, Study major security breaches (Google security blog) "
        ]
      },

      {
        goal: "Understand the Chainguard Landscape",
        actions: [
          "Study Chainguard Academy (edu.chainguard.dev)",
          "Study the solutions (chainguard.dev/solutions)",
          "Relearn supply-chain security basics",
          "Understand terminology (SBOMs, SLSA, images, etc.)"
        ]
      },
      {
        goal: "Begin planning for sales",

        actions: [
          "Meet with friends and colleagues who sell cybersecurity software, with a focus on increasing conversation fluency of cybersecurity topics",
          "Study Chainguard customer stories and use cases",
          "Begin looking for target accounts and understanding ICP fit"
        ]
      }
    ]
  };

  const planData = [
    {
      days: "30",
      title: "Foundation & Immersion",
      focus: "Come to work with a strong background foundation and a humble attitude to learn",
      goals: [
        "Deep dive into Chainguard's product suite: Containers, VMs, Libraries, and Images",
        "Master the security landscape, understanding SLSA, SBOM, and supply chain security",
        "Quick gut check: does my understanding of the environment stack up? What do I need to become fluent in how Chainguard's value prop is positioned?",
        "Map the sales process, identify internal resources, and learn from top performers",
        "Research target accounts in high-growth sectors (fintech, healthcare, government)"
      ],
      deliverables: [
        "Complete training, any certifications, and build trust to begin speaking to prospects",
        "Map target accounts with ICP fit analysis, creating a concrete plan of action, including who to target and how.",
        "Understand Chainguard-specific common objections and how to handle them",
        "Book demos: My job as an AE is close deals, but the more that I can do to fill the funnel, the better"
      ],
      impact: "Establish myself as a team player with a humble attitude - someone who is eager to contribute, easy to work with, but willing to learn the ropes"
    },
    {
      days: "60",
      title: "Pipeline Development & Execution",
      focus: "Building momentum with a bias for action",
      goals: [
        "Execute on target account list with personalized, value-driven outreach",
        "Collaborate with SDR/BDR teams (if applicable) to optimize lead qualification",
        "Refine messaging with intentional reps - the goal is quality over quantity",
        "Build strong habits of daily activity and follow-up"
      ],
      deliverables: [
        "Active pipeline with qualified opportunities at different stages",
        "Closed deal(s), learning by doing",
        "Proven emphasis on inputs and constantly refining those inputs",
      ],
      impact: "Demonstrate product knowledge through revenue contribution and establishing a repeatable sales motion"
    },
    {
      days: "90",
      title: "Scale & Optimization",
      focus: "Proving ROI and setting up for long-term success",
      goals: [
        "Understand what daily habits are working and what are not",
        "Refined sales process, building on foundation of experience with lessons learned at Chainguard",
        "Create a repeatable sales motion to enable myself to focus on closing deals with a focus on quality at every stage of the sales process"
      ],
      deliverables: [
        "Quota (or at least would-be quota if on a ramp period) met or exceeded, showing that I can hit the ground running",
        "Closed deals with a strong product market fit, giving CS team the best chance at renewals or upsells",
        "Exceptional Salesforce hygiene, adhering to Chainguard's sales process and best practices",
        "Pipeline coverage for next quarter, always looking out for opportunities to fill the funnel"
      ],
      impact: "Prove that I was the right investment for Chainguard's bottom line AND culture"
    }
  ];

  return (
    <div className="h-screen overflow-y-scroll scroll-smooth chainguard-container" style={{ scrollBehavior: 'auto' }}>
      <HeroSection />
      <IntroSection />
      <BeforeDayZeroSection {...beforeDayZeroData} />
      
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
        totalSections={planData.length + 5} 
        currentSection={currentSection}
        onNavigate={(index) => {
          const sections = document.querySelectorAll(".scroll-section");
          sections[index]?.scrollIntoView({ behavior: "smooth" });
        }}
      />
    </div>
  );
}

