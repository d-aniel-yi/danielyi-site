import Link from "next/link";
import { Hero } from "@/components/home/Hero";
import { TrustedBy } from "@/components/home/TrustedBy";
import { Skills } from "@/components/home/Skills";

export default function Home() {
  return (
    <div className="font-sans">
      <Hero />
      <TrustedBy />
      <Skills />
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4">
          <nav className="flex gap-4 items-center flex-col sm:flex-row">
            <Link className="underline" href="/resume">Resume</Link>
            <Link className="underline" href="/cover-letter">Cover letter</Link>
            <Link className="underline" href="/case-studies">Case studies</Link>
          </nav>
        </div>
      </section>
    </div>
  );
}
