"use client";

import { useState, useEffect } from "react";
import { PasswordGate } from "@/components/mongoose/PasswordGate";
import { HeroSection } from "@/components/mongoose/HeroSection";
import { IntroSection } from "@/components/mongoose/IntroSection";
import { StrategicAlignmentSection } from "@/components/mongoose/StrategicAlignmentSection";
import { MultiColumnSection } from "@/components/mongoose/MultiColumnSection";
import { ContentSection } from "@/components/mongoose/ContentSection";
import { ClosingSection } from "@/components/mongoose/ClosingSection";
import { NavigationDots } from "@/components/mongoose/NavigationDots";
import "./mongoose.css";

export default function MongoosePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);

  useEffect(() => {
    // Check if already authenticated in this session
    const auth = sessionStorage.getItem("mongoose_auth");
    if (auth === "true") {
      setIsAuthenticated(true);
    }
    
    // Reset scroll position immediately on mount
    const container = document.querySelector(".onepager-container") as HTMLElement;
    if (container) {
      container.scrollTop = 0;
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;

    // Get the scrollable container
    const container = document.querySelector(".onepager-container") as HTMLElement;
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
    // Update password as needed
    if (password === "conversationalai") {
      setIsAuthenticated(true);
      sessionStorage.setItem("mongoose_auth", "true");
      return true;
    }
    return false;
  };

  if (!isAuthenticated) {
    return <PasswordGate onSubmit={handlePasswordSubmit} />;
  }

  // Step 1: Strategic Alignment Sections (5 Strategic Priorities)
  const strategicPriorities = [
    {
      priority: "1. Enhancing the Student Experience",
      description: "Deliver an unparalleled student experience that supports personal growth, academic achievement, and well-being.",
      mongooseAlignment: "[INSERT YOUR CONTENT HERE - Explain how Mongoose's Conversation Intelligence Platform aligns with this priority. Consider areas like: mental health support conversations, academic advising touchpoints, first-year transition support, student engagement metrics.]",
      opportunities: [
        "[Opportunity 1 - e.g., Expand Mongoose to Student Affairs/Wellness Center]",
        "[Opportunity 2 - e.g., Implement Mongoose for academic advising teams]",
        "[Opportunity 3 - e.g., Add Mongoose Analytics for student engagement insights]"
      ],
    },
    {
      priority: "2. Fostering Research and Innovation",
      description: "Be a catalyst for discovery and solutions to real-world challenges.",
      mongooseAlignment: "[INSERT YOUR CONTENT HERE - How can Mongoose support research partnerships, industry collaborations, and innovation initiatives? Consider conversation intelligence for partnership development, grant proposal tracking, etc.]",
      opportunities: [
        "[Opportunity 1 - e.g., Mongoose for Research Partnerships office]",
        "[Opportunity 2 - e.g., Conversation analytics for industry engagement]",
        "[Opportunity 3 - e.g., Innovation center communication tracking]"
      ],
    },
    {
      priority: "3. Supporting Diversity, Equity, and Inclusion (DEI)",
      description: "Build a community where all individuals feel respected, included, and empowered.",
      mongooseAlignment: "[INSERT YOUR CONTENT HERE - Explain how Mongoose can support DEI initiatives. Consider: tracking inclusive communication practices, measuring engagement across diverse student populations, supporting DEI office outreach efforts.]",
      opportunities: [
        "[Opportunity 1 - e.g., Deploy Mongoose for DEI Office communications]",
        "[Opportunity 2 - e.g., Use conversation intelligence to measure inclusive practices]",
        "[Opportunity 3 - e.g., Expand to Cultural Centers and affinity groups]"
      ],
    },
    {
      priority: "4. Deepening Community and Global Engagement",
      description: "See local and global communities as partners in learning and progress.",
      mongooseAlignment: "[INSERT YOUR CONTENT HERE - How can Mongoose support community partnerships, global programs, and civic engagement? Consider: community relations tracking, international student services, alumni engagement expansion.]",
      opportunities: [
        "[Opportunity 1 - e.g., Expand Mongoose to Community Relations office]",
        "[Opportunity 2 - e.g., International Programs office deployment]",
        "[Opportunity 3 - e.g., Alumni Engagement expansion beyond Advancement]"
      ],
    },
    {
      priority: "5. Ensuring Institutional Sustainability",
      description: "Commitment to financial, environmental, and operational sustainability.",
      mongooseAlignment: "[INSERT YOUR CONTENT HERE - Explain how Mongoose supports operational efficiency, cost management, and strategic decision-making. Consider: conversation analytics for efficiency gains, ROI measurement, data-driven resource allocation.]",
      opportunities: [
        "[Opportunity 1 - e.g., Expand to additional departments for operational efficiency]",
        "[Opportunity 2 - e.g., Implement Mongoose Analytics for ROI tracking]",
        "[Opportunity 3 - e.g., Cross-departmental conversation intelligence insights]"
      ],
    },
  ];

  // Calculate total sections for navigation
  const totalSections = 1 + // Hero
                      1 + // Intro
                      strategicPriorities.length + // Strategic alignments
                      4 + // Growth Areas, Collaborators, Risks, Communication Plan
                      1 + // Step 2 Divider
                      1 + // Past Account Example
                      1; // Closing

  return (
    <div className="h-screen overflow-y-scroll scroll-smooth onepager-container" style={{ scrollBehavior: 'auto' }}>
      <HeroSection />
      <IntroSection />
      
      {/* Strategic Alignment Sections */}
      {strategicPriorities.map((priority, index) => (
        <StrategicAlignmentSection
          key={priority.priority}
          {...priority}
          isEven={index % 2 === 0}
        />
      ))}

      {/* Targeted Growth Areas & Roles */}
      <MultiColumnSection
        title="Targeted Growth Areas & Roles"
        subtitle="Key expansion opportunities and stakeholder engagement"
        leftColumn={{
          title: "Targeted Growth Areas",
          items: [
            "[Growth Area 1 - e.g., Student Affairs/Wellness Center]",
            "[Growth Area 2 - e.g., Academic Advising]",
            "[Growth Area 3 - e.g., DEI Office]",
            "[Growth Area 4 - e.g., International Programs]",
            "[Add more as needed]"
          ]
        }}
        rightColumn={{
          title: "Key Roles to Engage",
          items: [
            "[Role 1 - e.g., VP of Student Affairs]",
            "[Role 2 - e.g., Director of Academic Advising]",
            "[Role 3 - e.g., Chief Diversity Officer]",
            "[Role 4 - e.g., Director of International Programs]",
            "[Add more as needed]"
          ]
        }}
        isEven={true}
      />

      {/* Internal Collaborators */}
      <ContentSection
        title="Internal Collaborators"
        subtitle="Mongoose team members to partner with for success"
        content={`[INSERT YOUR CONTENT HERE - Identify which internal Mongoose roles/teams you would partner with given the targeted growth areas and roles identified above. Consider:
        
• Solutions Engineers/Technical resources
• Customer Success Managers
• Product specialists
• Sales leadership
• Other account managers with similar use cases

Explain how each collaborator would support the expansion efforts.]`}
        isEven={false}
      />

      {/* Risk Factors */}
      <ContentSection
        title="Risk Factors to Consider"
        subtitle="Potential challenges and mitigation strategies"
        content={`[INSERT YOUR CONTENT HERE - Identify key risk factors that should be considered for this expansion effort. Consider:

• Budget constraints and competing priorities
• Change management and adoption challenges
• Integration complexity with existing systems (Ellucian)
• Timing and resource availability
• Stakeholder buy-in and support

For each risk, briefly explain the mitigation strategy.]`}
        isEven={true}
      />

      {/* Communication Plan & Success Criteria */}
      <ContentSection
        title="Prioritized Communication Plan & Success Criteria"
        subtitle="How we'll execute and measure success"
        content={`[INSERT YOUR CONTENT HERE - Develop a prioritized communication plan and define success criteria. Include:

COMMUNICATION PLAN:
• Phase 1: [Timeline] - [Activities and stakeholders]
• Phase 2: [Timeline] - [Activities and stakeholders]
• Phase 3: [Timeline] - [Activities and stakeholders]

SUCCESS CRITERIA:
• Quantitative metrics: [e.g., ARR growth target, adoption rate, etc.]
• Qualitative indicators: [e.g., stakeholder satisfaction, strategic alignment, etc.]
• Timeline: [When will we measure success?]
• Reporting: [How will we communicate progress?]]`}
        isEven={false}
      />

      {/* Step 2 Divider */}
      <section 
        className="scroll-section min-h-screen flex items-center justify-center py-20 relative z-10"
        style={{ backgroundColor: 'var(--op-black)' }}
      >
        <div className="max-w-4xl mx-auto px-8 text-center">
          <h2 
            className="display-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white"
            data-animate
            data-delay="0"
          >
            Step 2: Past Account Expansion Example
          </h2>
          <p 
            className="text-xl md:text-2xl font-light"
            data-animate
            data-delay="200"
            style={{ color: 'var(--op-accent)' }}
          >
            A case study demonstrating successful expansion (+25%+ ARR growth)
          </p>
        </div>
      </section>

      {/* Past Account Example */}
      <ContentSection
        title="Account Expansion Case Study"
        subtitle="[Customer Name] - [Brief description]"
        content={`[INSERT YOUR CONTENT HERE - Provide an example of an account you had primary responsibility for where you successfully expanded the account by 25%+ of existing ARR. Include:

KEY PRIORITIES/PROBLEMS UNCOVERED:
• [Problem 1 and how it influenced expansion]
• [Problem 2 and how it influenced expansion]
• [Problem 3 and how it influenced expansion]

CUSTOMER ROLES INVOLVED:
• [Role 1] - [Their involvement and decision-making power]
• [Role 2] - [Their involvement and decision-making power]
• [Role 3] - [Their involvement and decision-making power]

ALTERNATIVES CONSIDERED:
• [Alternative 1] - [Why it wasn't chosen]
• [Alternative 2] - [Why it wasn't chosen]
• [Other options explored]

DISCOVERY TO CLOSE PROCESS:
• Discovery Phase: [What you learned]
• Evaluation Phase: [How they evaluated]
• Decision Phase: [How they made the decision]
• Close: [Final steps and timeline]
• Expansion Result: [Final ARR increase and impact]]`}
        isEven={true}
      />

      <ClosingSection />

      <NavigationDots 
        totalSections={totalSections} 
        currentSection={currentSection}
        onNavigate={(index) => {
          const sections = document.querySelectorAll(".scroll-section");
          sections[index]?.scrollIntoView({ behavior: "smooth" });
        }}
      />
    </div>
  );
}
