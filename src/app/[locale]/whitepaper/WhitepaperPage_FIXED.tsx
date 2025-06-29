
"use client";

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";

const sections = [
  { id: "executive-summary", label: "Executive Summary" },
  { id: "project-overview", label: "Project Overview and Example" },
  { id: "market-analysis", label: "Market Analysis" },
  { id: "token-model", label: "Token Model" },
  { id: "business-model", label: "Business Model" },
  { id: "legal-framework", label: "Legal & Regulatory Framework" },
  { id: "impact", label: "Social & Environmental Impact" },
  { id: "roadmap", label: "Roadmap & Milestones" },
];

const Whitepaper_Page = () => {
  const [activeSection, setActiveSection] = useState("executive-summary");

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 140;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        const el = document.getElementById(section.id);
        if (el && el.offsetTop <= scrollPosition) {
          setActiveSection(section.id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <Navbar />
      <div className="flex flex-col md:flex-row bg-[var(--white)] text-[var(--dark-blue)] font-[var(--montserrat)] scroll-smooth">
        <aside className="md:w-1/4 w-full md:h-screen sticky top-20 bg-[var(--white)] p-6 border-r border-[var(--grey)] hidden md:block">
          <nav className="space-y-4">
            {sections.map(({ id, label }) => (
              <a
                key={id}
                href={`#${id}`}
                className={`block text-sm transition-all ${
                  activeSection === id
                    ? "text-[var(--strong-green)] font-semibold"
                    : "text-[var(--dark-blue)]/70 hover:text-[var(--strong-green)]"
                }`}
              >
                {label}
              </a>
            ))}
          </nav>
        </aside>

        <main className="md:w-3/4 w-full px-6 md:px-12 py-10 space-y-24">
          {sections.map(({ id, label }) => (
            <section key={id} id={id} className="scroll-mt-24">
              <h2 className="text-3xl font-bold mb-6 font-[var(--dm-sans)]">
                {label}
              </h2>
              <SectionContent sectionId={id} />
            </section>
          ))}
        </main>
      </div>
      <Footer />
    </>
  );
};

const SectionContent = ({ sectionId }: { sectionId: string }) => {
  const content: Record<string, JSX.Element> = {
    "executive-summary": (
      <>
        <p className="mb-4"><strong>Mission:</strong> Oxygen democratizes investment in the production of carbon credits through blockchain-based tokenization, transforming environmental efforts into profitable, transparent, and accessible investments.</p>
        <p className="mb-4"><strong>Problem:</strong> Forests are burned not because it’s better, but because there’s no financial return from keeping them alive. The carbon market solves this but is only accessible to big players.</p>
        <p className="mb-4"><strong>Solution:</strong> Anyone can invest in tokenized forest ($OM), earning $OC tokens that can be sold or burned for certification of carbon neutrality. Fully transparent via blockchain.</p>
      </>
    ),
    "project-overview": (
      <>
        <p className="mb-4">Oxygen’s first project, <strong>La Florencia</strong>, protects 30,000 hectares in Argentina, in alliance with the Wichí indigenous community.</p>
        <p className="mb-4">It creates environmental, social, and economic impact through forest protection, biodiversity, and carbon monetization.</p>
      </>
    ),
    "market-analysis": (
      <>
        <p className="mb-4">The carbon credit market is growing fast, with 72% of credits issued being sold. Demand outpaces supply.</p>
        <ul className="list-disc list-inside space-y-2">
          <li>High entry costs exclude small players.</li>
          <li>LatAm forests offer low-cost, high-return opportunities.</li>
          <li>Demand grows yearly due to regulation and ESG standards.</li>
        </ul>
      </>
    ),
    "token-model": (
      <>
        <p className="mb-4"><strong>$OM:</strong> 1m² of forest. Bought to protect land.</p>
        <p className="mb-4"><strong>$OC:</strong> Carbon offset tokens earned by $OM holders. Tradable or burnable to certify neutrality.</p>
        <ul className="list-disc list-inside space-y-2">
          <li>Individuals: guided CO₂ questionnaire and burn system</li>
          <li>Companies: certified audit for carbon reporting</li>
        </ul>
      </>
    ),
    "business-model": (
      <>
        <p className="mb-4">Crowdfunding via $OM sales funds certification ($350K target). Once verified, credits are sold to generate ROI.</p>
        <p className="mb-4">La Florencia aims to generate $2.8M USD over 10 years, with ~7% annual ROI.</p>
      </>
    ),
    "legal-framework": (
      <>
        <ul className="list-disc list-inside space-y-2 mb-4">
          <li>Land owned by Oxygen Token shareholders</li>
          <li>REDD+ Verra certification + CCB co-benefit labels</li>
          <li>Global frameworks ensure credibility and ESG alignment</li>
        </ul>
      </>
    ),
    "impact": (
      <>
        <h3 className="text-xl font-semibold mt-4 mb-2">Environmental</h3>
        <ul className="list-disc list-inside mb-4 space-y-2">
          <li>Preservation of biodiversity and endangered species</li>
          <li>Forest monitoring and satellite tech</li>
        </ul>
        <h3 className="text-xl font-semibold mt-4 mb-2">Social</h3>
        <ul className="list-disc list-inside mb-4 space-y-2">
          <li>Jobs for Wichí park rangers</li>
          <li>Honey, mushroom, brick production</li>
          <li>Water capture, Starlink internet, irrigation</li>
        </ul>
      </>
    ),
    "roadmap": (
      <>
        <ul className="list-disc list-inside space-y-2">
          <li>Q1 2025: Token launch & forest onboarding</li>
          <li>Q2 2025: 10% funds → project docs + rangers</li>
          <li>Q3 2025: 20% funds → satellite + water + web</li>
          <li>Q4 2025: 30% → income projects start</li>
          <li>2026: Pre-sell credits + listing on BYMA</li>
          <li>2027+: Annual CCC sales, token cycles, scale</li>
        </ul>
      </>
    ),
  };

  return content[sectionId] ?? <p>Coming soon...</p>;
};

export default Whitepaper_Page;
