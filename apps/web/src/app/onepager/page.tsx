"use client";

import { useState, useEffect } from "react";
import { PasswordGate } from "@/components/onepager/PasswordGate";
import { HeroSection } from "@/components/onepager/HeroSection";
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
      title: "PVP",
      subtitle: "Social Trading Platform with Telegram Integration",
      rationale: "Trading platform for social trading on Hyperliquid with Telegram integration. PVP combines social features with DeFi trading, creating unique smart contract requirements. The social/Telegram integration layer adds attack surface that requires careful security review. Strong potential for both fear-based (security) and credibility-based (user trust) value.",
      approach: "Use Case: Balanced—both fear and credibility. Social trading platforms face unique security challenges. User funds are at risk, and reputation in the trading community is everything. Position audit as both security necessity and competitive differentiator. Telegram integration adds complexity that demands expert review.",
      value: "Capital Potential: $450K accelerator funding (May), additional funding unknown. Smaller capital base but strong user growth. May be approaching Series A where professional audits become table stakes. Opportunity to establish relationship before major funding round.",
    },
    {
      number: 4,
      title: "Felix",
      subtitle: "DeFi Platform with Hyperion Partnership",
      rationale: "Felix recently announced partnership with Hyperion (HYPD) and is building out their exchange. Crossed $1B TVL milestone with well-scaled liquidity, demonstrating both user trust and growth trajectory. Notable gap: Felix doesn't appear to advertise strong auditing partnerships, representing a clear opportunity.",
      approach: "Use Case: Strong credibility play. At $1B TVL, institutional capital becomes critical for next growth phase. Partnership with large DeFi org (Hyperion) signals they're ready for enterprise-grade partnerships. The absence of advertised audits is an opening—position as the missing piece for institutional confidence.",
      value: "Capital Potential: Strong. $1B TVL indicates significant revenue and capital access. Recent Hyperion partnership demonstrates willingness to invest in growth. Exchange buildout represents new smart contract deployment—perfect timing for comprehensive audit engagement. Potential for ongoing relationship as platform scales.",
    },
  ];

  return (
      <div className="h-screen overflow-y-scroll scroll-smooth onepager-container">
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

