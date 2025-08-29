import type { Metadata } from "next";
import { ResumeDocument } from "@/components/resume/ResumeComponents";
import { ResumePdfViewer } from "@/components/resume/ResumePdfViewer";
import { getTemplatePath, parseResumeLatex } from "@/components/resume/parseLatex";
import { LatexWasmViewer } from "@/components/resume/LatexWasmViewer";
import type { ResumeData } from "@/components/resume/ResumeTypes";

export const metadata: Metadata = {
  title: "Resume — Daniel Yi",
  description: "Track record, metrics, and impact.",
};

export default function ResumePage() {
  const usePdf = false; // render parsed LaTeX into web-native by default
  const data: ResumeData = {
    contact: {
      name: "Daniel Yi",
      title: "Account Executive",
      location: "San Francisco, CA",
      email: "daniel@example.com",
      website: "da.nielyi.com",
      linkedin: "linkedin.com/in/danielyi",
      github: "github.com/danielyi",
    },
    summary: [
      "Top-performing AE with technical fluency; collaborates credibly with engineering.",
      "Built this site end-to-end: Next.js + AWS CDK + CI/CD.",
    ],
    sections: [
      {
        heading: "Experience",
        items: [
          {
            company: "Anysphere",
            role: "Account Executive",
            location: "San Francisco, CA",
            start: "2023",
            end: "Present",
            bullets: [
              "Closed $X in ARR with enterprise customers; exceeded quota by Y%.",
              "Partnered with product/engineering to shape roadmap with customer insights.",
            ],
            technologies: ["Salesforce", "Notion", "Figma"],
          },
        ],
      },
      {
        heading: "Selected Projects",
        items: [
          {
            role: "This Site (Portfolio + Infra)",
            bullets: [
              "Static-first Next.js app deployed to S3 + CloudFront; serverless APIs.",
              "IaC via AWS CDK; CI with GitHub Actions + OIDC; health checks + logs.",
            ],
            technologies: ["Next.js", "CDK", "API Gateway", "Lambda", "DynamoDB", "SES"],
          },
        ],
      },
      {
        heading: "Education",
        items: [
          {
            org: "University",
            role: "BS, Field",
            start: "20XX",
            end: "20XX",
          },
        ],
      },
    ],
  };

  // Try to parse LaTeX at build-time (Next.js static export reads during build)
  let parsed = undefined;
  try {
    parsed = parseResumeLatex(getTemplatePath());
  } catch (err) {
    // fall back to hardcoded data
  }

  return (
    <div className="py-16">
      <div className="mx-auto max-w-5xl px-4 flex items-center justify-between">
        <h1 className="display-serif text-3xl tracking-[-0.01em]">Resume</h1>
        <LatexWasmViewer />
      </div>
      <div className="mt-6">
        {usePdf ? (
          <ResumePdfViewer src="/resume/resume.pdf" />
        ) : (
          <>
            <ResumeDocument data={parsed ?? data} />
          </>
        )}
      </div>
    </div>
  );
}

// PrintButton moved to a Client Component


