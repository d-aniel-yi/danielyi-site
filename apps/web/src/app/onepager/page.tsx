"use client";

import { useState, useEffect } from "react";
import { PasswordGate } from "@/components/onepager/PasswordGate";
import { HeroSection } from "@/components/onepager/HeroSection";
import { IntroSection } from "@/components/onepager/IntroSection";
import { TargetSection } from "@/components/onepager/TargetSection";
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

    // Hero fade-out on scroll
    const handleScroll = () => {
      const hero = document.querySelector(".hero-section") as HTMLElement;
      if (hero) {
        const scrollPosition = window.scrollY;
        const windowHeight = window.innerHeight;
        const opacity = Math.max(0, 1 - scrollPosition / windowHeight);
        hero.style.opacity = String(opacity);
      }

      // Track section for navigation dots
      const sections = document.querySelectorAll(".scroll-section");
      const scrollPos = window.scrollY + window.innerHeight / 2;

      sections.forEach((section, index) => {
        const element = section as HTMLElement;
        if (
          scrollPos >= element.offsetTop &&
          scrollPos < element.offsetTop + element.offsetHeight
        ) {
          setCurrentSection(index);
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
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
      rationale: "Robinhood Chain represents the most significant opportunity for 2026. As a permissionless layer 2 focused on tokenizing real-world assets, they will need recurring audits for platform smart contracts and third-party protocols building on their ecosystem. Robinhood's meteoric rise with retail investors and younger users positions this as potentially the most important change to crypto in 2026.",
      approach: "Use Case: Both fear and credibility are critical. Robinhood must protect their strong brand reputation and needs top-tier partnerships. With $263M in Web3 damages already in H1 2025, avoiding disasters like Poly Network and Ronin Bridge is paramount. Strong signal: Robinhood already values quality partnerships and brand protection.",
      value: "Capital Potential: Exceptional. HOOD stock up 270% YTD demonstrates strong capital position. As a platform, there's massive potential for recurring revenue as projects build on Robinhood Chain. This could become a strategic, long-term partnership opportunity.",
    },
    {
      number: 2,
      title: "Silhouette",
      subtitle: "Decentralized Trading Platform on Hyperliquid",
      rationale: "Built on Hyperliquid with permissionless listings, Silhouette offers alternative trading types to the ecosystem. From their documentation, they demonstrate confidence in their methodology but would benefit significantly from institutional backing and user confidence. Trade volume is critical for liquidity—credibility directly impacts their core business metrics.",
      approach: "Use Case: Primary value is credibility. Institutional capital requires trusted audit partners. Their confidence in methodology suggests they may already believe in audit value. Approach through demonstrating how respected audits increase trade volume and liquidity by attracting institutional participants.",
      value: "Capital Potential: $3M pre-seed funding (June) from 8 investors led by RockawayX. Early-stage with strong backing indicates both capital availability and growth trajectory. Well-positioned for follow-on funding rounds where audit credibility becomes even more valuable.",
    },
    {
      number: 3,
      title: "Felix",
      subtitle: "DeFi Platform with Hyperion Partnership",
      rationale: "Felix recently announced partnership with Hyperion (HYPD) and is building out their exchange. Crossed $1B TVL with well-scaled liquidity, demonstrating both user trust and growth trajectory. Notable gap: Felix doesn't appear to advertise strong auditing partnerships, representing a clear opportunity.",
      approach: "Use Case: Felix doesn't appear to advertise any strong auditing. Strong credibility play—at $1B TVL, institutional capital becomes critical for next growth phase. Partnership with large DeFi org signals readiness for enterprise-grade partnerships. The absence of advertised audits is an opening.",
      value: "Capital Potential: Recent partnership with large DeFi org, Felix passed $1B TVL and has pretty well scaled liquidity. Exchange buildout represents new smart contract deployment—perfect timing for comprehensive audit engagement.",
    },
    {
      number: 4,
      title: "Ethena",
      subtitle: "Stablecoin Infrastructure with Whitelist Program",
      rationale: "Ethena offers a whitelist program where anyone can build a stablecoin on top of their infrastructure. This creates potential for recurring business with DeFi protocols launching new stablecoins (similar to Jupiter). The platform approach means multiple audit opportunities across different protocols building on Ethena.",
      approach: "Use Case: Vetting upgrades and new collaterals, reviewing integrations, working with third-party protocols. The whitelist program is the key—each new protocol building on Ethena represents a potential audit engagement. Leverage existing relationship: I have a friend who was a seed investor in Ethena, should be able to get an audience.",
      value: "Capital Potential: Not the strongest—recent yield was ~2%, Ethena might be falling out of favor compared to newer protocols. However, the whitelist program model offers recurring revenue potential that could offset lower individual deal size. Relationship opportunity through warm introduction.",
    },
  ];

  return (
      <div className="h-screen overflow-y-scroll scroll-smooth onepager-container">
        <HeroSection />
        <IntroSection />
      
      {targets.map((target, index) => (
        <TargetSection
          key={target.number}
          {...target}
          isEven={index % 2 === 0}
        />
      ))}

      <NavigationDots 
        totalSections={targets.length + 2} 
        currentSection={currentSection}
        onNavigate={(index) => {
          const sections = document.querySelectorAll(".scroll-section");
          sections[index]?.scrollIntoView({ behavior: "smooth" });
        }}
      />
      </div>
  );
}

