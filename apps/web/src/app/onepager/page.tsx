"use client";

import { useState, useEffect } from "react";
import { PasswordGate } from "@/components/onepager/PasswordGate";
import { HeroSection } from "@/components/onepager/HeroSection";
import { TargetSection } from "@/components/onepager/TargetSection";
import { NavigationDots } from "@/components/onepager/NavigationDots";

export default function OnePagerPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);

  useEffect(() => {
    // Check if already authenticated in this session
    const auth = sessionStorage.getItem("onepager_auth");
    if (auth === "true") {
      setIsAuthenticated(true);
    }

    // Track scroll position for navigation dots
    const handleScroll = () => {
      const sections = document.querySelectorAll(".scroll-section");
      const scrollPosition = window.scrollY + window.innerHeight / 2;

      sections.forEach((section, index) => {
        const element = section as HTMLElement;
        if (
          scrollPosition >= element.offsetTop &&
          scrollPosition < element.offsetTop + element.offsetHeight
        ) {
          setCurrentSection(index);
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handlePasswordSubmit = (password: string) => {
    if (password === "henry") {
      setIsAuthenticated(true);
      sessionStorage.setItem("onepager_auth", "true");
      return true;
    }
    return false;
  };

  if (!isAuthenticated) {
    return <PasswordGate onSubmit={handlePasswordSubmit} />;
  }

  const targets = [
    {
      number: 1,
      title: "Target Company 1",
      subtitle: "Industry Leader in X",
      rationale: "Why this target makes sense: They have a proven track record in the market with strong brand recognition and an established customer base that aligns perfectly with our value proposition.",
      approach: "How I would approach them: Begin with research into their recent initiatives and pain points, then leverage warm introductions through mutual connections in the industry to establish initial contact.",
      value: "Value proposition: Our solution directly addresses their current challenges in scaling operations while reducing costs by 30%, positioning us as a strategic partner for their growth.",
    },
    {
      number: 2,
      title: "Target Company 2",
      subtitle: "Emerging Player in Y",
      rationale: "Strategic fit because: As a fast-growing company in an adjacent market, they're actively seeking partnerships that can accelerate their expansion into new verticals where we have deep expertise.",
      approach: "Entry strategy: Target their VP of Business Development through LinkedIn outreach, highlighting case studies from similar companies we've helped scale successfully.",
      value: "Mutual benefits: We provide the infrastructure and expertise they need to expand quickly, while they give us access to a rapidly growing market segment with high potential.",
    },
    {
      number: 3,
      title: "Target Company 3",
      subtitle: "Market Disruptor in Z",
      rationale: "Opportunity lies in: Their innovative approach to the market has created new challenges that traditional solutions can't address, creating a perfect opportunity for our unique capabilities.",
      approach: "Engagement plan: Attend industry events where they're speaking, engage with their content on social media, and position ourselves as thought leaders in solving the specific problems they face.",
      value: "Win-win scenario: We help them overcome their scaling challenges while establishing ourselves as the go-to solution provider in this emerging market segment.",
    },
    {
      number: 4,
      title: "Target Company 4",
      subtitle: "Enterprise Giant Seeking Innovation",
      rationale: "Perfect timing: Recent leadership changes and strategic pivots indicate they're open to new partnerships and solutions that can help them modernize their operations.",
      approach: "Multi-touch strategy: Combine targeted content marketing, executive briefing requests, and partnership through their innovation lab program to gain credibility and access.",
      value: "Transformational impact: Our solution can help them reduce technical debt while improving customer satisfaction scores by 40%, directly supporting their stated strategic objectives.",
    },
  ];

  return (
    <div className="h-screen overflow-y-scroll scroll-smooth">
      <HeroSection />
      
      {targets.map((target, index) => (
        <TargetSection
          key={target.number}
          {...target}
          isEven={index % 2 === 0}
        />
      ))}

      <NavigationDots 
        totalSections={targets.length + 1} 
        currentSection={currentSection}
        onNavigate={(index) => {
          const sections = document.querySelectorAll(".scroll-section");
          sections[index]?.scrollIntoView({ behavior: "smooth" });
        }}
      />
    </div>
  );
}

