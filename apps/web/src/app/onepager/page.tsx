"use client";

import { useState, useEffect } from "react";
import { PasswordGate } from "@/components/onepager/PasswordGate";
import { HeroSection } from "@/components/onepager/HeroSection";
import { IntroSection } from "@/components/onepager/IntroSection";
import { TargetSection } from "@/components/onepager/TargetSection";
import { ClosingSection } from "@/components/onepager/ClosingSection";
import { NavigationDots } from "@/components/onepager/NavigationDots";
import "./onepager.css";

export default function OnePagerPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);

  useEffect(() => {
    // Check if already authenticated in this session
    const auth = sessionStorage.getItem("onepager_auth");
    if (auth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;

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

    // Get the scrollable container
    const container = document.querySelector(".onepager-container") as HTMLElement;
    if (!container) return;

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
      title: "Robinhood Chain",
      subtitle: "Permissionless L2 for Tokenized Real-World Assets",
      logo: "/logos/robinhood.png",
      rationale: "I believe that this has the potential to be the most important change to the crypto ecosystem in 2026, largely due to Robinhood\’s meteoric rise within the retail investor segment and younger user base. Huge potential for recurring revenue, since it will serve as a platform for smart contracts.",
      approach: "Both fear and credibility, with a strong need for credibility. Robinhood has a strong brand right now, and needs to continue to partner with the best. In the future, depending on how Robinhood Chain develops, use cases may expand to others building on the new ecosystem.",
      value: "Capital Potential: HOOD stock up 270% YTD demonstrates strong capital position. As a platform, there's massive potential for recurring revenue as projects build on Robinhood Chain. This could become a strategic, long-term partnership opportunity.",
    },
    {
      number: 2,
      title: "Silhouette",
      subtitle: "Decentralized Trading Platform on Hyperliquid",
      logo: "/logos/silhouette.svg",
      rationale: "Built on Hyperliquid with permissionless listings, Silhouette offers alternative trading types to the ecosystem. From their documentation, they demonstrate confidence in their methodology but would benefit significantly from institutional backing and user confidence. Trade volume is critical for liquidity—credibility directly impacts their core business metrics.",
      approach: "Use Case: From their documentation, they seem like they are confident in their methodology, so the larger value add of the two would be to get more institutional backing and confidence from potential users. Trade volume is a premium for these markets in order to provide liquidity for essential functionality.",
      value: "Capital Potential: 3M in pre-seed funding in June from 8 investors, led by RockawayX.",
    },
    {
      number: 3,
      title: "Felix",
      subtitle: "DeFi Platform with Hyperion Partnership",
      logo: "/logos/felix.jpg",
      rationale: "Just announced a partnership with Hyperion (HYPD), Looking to build out their exchange where there will inevitably be audit needs.",
      approach: "Use Case: Felix doesn’t appear to advertise any strong auditing, strong credibility play as they look to strengthen their brand. Working with Hyperion is a huge step for them, and continuing to add big names and confidence would be key for them.",
      value: "Capital Potential: Recent partnership with large DeFi org, Felix passed $1B TVL and has pretty well scaled liquidity. ",
    },
    {
      number: 4,
      title: "Ethena",
      subtitle: "Stablecoin Infrastructure with Whitelist Program",
      logo: "/logos/ethena.svg",
      rationale: "We can leverage the whitelist program, where anyone can build a stablecoin on top of Ethena - potential for recurring business with DeFi protocols launching new stablecoins (like Jupiter). Can also pivot to using Ethena's program to find potential customers.",
      approach: "Use Case: Vetting upgrades and new collaterals, reviewing integrations, working with third-party protocols.",
      value: "Not the best, recent yield was ~2%, Ethena might be falling out of favor in favor of newer protocols.",
      bonus: "I have a friend who was a seed investor in Ethena, and should be able to at least get an audience with them.",
    },
  ];

  return (
      <div className="h-screen overflow-y-scroll scroll-smooth onepager-container">
        <HeroSection />
        <IntroSection />
      
      {targets.map((target, index) => (
        <TargetSection
          key={target.title}
          {...target}
          isEven={index % 2 === 0}
        />
      ))}

      <ClosingSection />

      <NavigationDots 
        totalSections={targets.length + 3} 
        currentSection={currentSection}
        onNavigate={(index) => {
          const sections = document.querySelectorAll(".scroll-section");
          sections[index]?.scrollIntoView({ behavior: "smooth" });
        }}
      />
      </div>
  );
}

