"use client";

import { useEffect, useState } from "react";
import { Children, isValidElement } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import Image from "next/image";
import issuerIcon from "../../../../public/assets/images/issuer.png";
import certifierIcon from "../../../../public/assets/images/certifier.png";
import buyerIcon from "../../../../public/assets/images/buyer.png";
import marketplaceIcon from "../../../../public/assets/images/marketplace.png";
import complianceIcon from "../../../../public/assets/images/compliance.png";
import differentiationIcon from "../../../../public/assets/images/differentiation.png";
import capitalIcon from "../../../../public/assets/images/capital.png";
import verraIcon from "../../../../public/assets/images/verralogo.jpg";
import goldStandardIcon from "../../../../public/assets/images/goldStandard.png";
import pachamaIcon from "../../../../public/assets/images/pachama.png";
import logloClima from "../../../../public/assets/images/logo-cli.jpg";
import impactImage from "../../../../public/assets/images/TripleImpact.png";
import roadmapImage from "../../../../public/assets/images/Roadmap.png";

const sections = [
  { id: "carbon-credit", label: "What is a Carbon Credit?" },
  { id: "executive-summary", label: "Executive Summary" },
  { id: "project-overview", label: "Project Overview and Example" },
  { id: "market-analysis", label: "Market Analysis" },
  { id: "token-model", label: "Token Model" },
  { id: "business-model", label: "Business Model" },
  { id: "legal-framework", label: "Legal & Regulatory Framework" },
  { id: "impact", label: "Social & Environmental Impact" },
  { id: "roadmap", label: "Roadmap & Milestones" },
  { id: "footnotes", label: "Foot Notes" },
];

const Whitepaper_Page = () => {
  const [activeSection, setActiveSection] = useState<string>("carbon-credit");

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 120;

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
      <div className="flex flex-col md:flex-row min-h-screen scroll-smooth">
        <aside className="sticky top-[100px] lg:top-[120px] w-full md:w-1/4 border-r border-gray-200 p-6 h-screen overflow-y-auto bg-white z-10">
          <nav className="space-y-3">
            {sections.map(({ id, label }) => {
              const isActive = activeSection === id;
              return (
                <a
                  key={id}
                  href={`#${id}`}
                  className={`relative block px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? "bg-[var(--strong-green)] text-white shadow-md"
                      : "text-gray-700 hover:text-[var(--strong-green)] hover:pl-5"
                  }`}
                >
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow-sm animate-ping"></span>
                  )}
                  {label}
                </a>
              );
            })}
          </nav>
        </aside>

        <main className="flex-1 p-6 pt-[100px] lg:pt-[120px] space-y-20">
          {Children.map(
            [
              <section id="carbon-credit">
                <h2 className="text-2xl font-bold mb-4">
                  What is a Carbon Credit?
                </h2>
                <p className="mb-4">
                  A carbon credit is a tradable certificate representing the
                  reduction or removal of one metric ton of carbon dioxide (CO₂)
                  or equivalent greenhouse gases from the atmosphere. These
                  credits are created through projects that protect forests,
                  invest in renewable energy, or engage in practices that reduce
                  emissions.
                </p>

                <h3 className="text-xl font-semibold mb-4 text-[var(--dark-blue)]">
                  Market Participants
                </h3>

                <p className="mb-6 flex items-center gap-4 text-gray-700 leading-relaxed">
                  <Image
                    src={issuerIcon}
                    alt="Issuers icon"
                    width={100}
                    height={100}
                    className="rounded-xl bg-white shadow-md p-1 mt-1"
                  />
                  <span>
                    <strong>Issuers (Producers):</strong> Entities (like Oxygen)
                    that develop projects to generate carbon credits, usually
                    through forest conservation, reforestation, renewable
                    energy, or similar eco-friendly projects.
                  </span>
                </p>

                <p className="mb-6 flex items-center gap-4 text-gray-700 leading-relaxed">
                  <Image
                    src={certifierIcon}
                    alt="Certifiers icon"
                    width={100}
                    height={100}
                    className="rounded-xl bg-white shadow-md p-1 mt-1"
                  />
                  <span>
                    <strong>Certifiers/Validators:</strong> Organizations (e.g.,
                    Verra, Gold Standard) verifying and certifying that the
                    emissions reductions are real, measurable, and permanent.
                  </span>
                </p>

                <p className="mb-6 flex items-center gap-4 text-gray-700 leading-relaxed">
                  <Image
                    src={buyerIcon}
                    alt="Buyers icon"
                    width={100}
                    height={100}
                    className="rounded-xl bg-white shadow-md p-1 mt-1"
                  />
                  <span>
                    <strong>Buyers (End Users):</strong> Typically corporations
                    seeking to offset their emissions to achieve regulatory
                    compliance, meet sustainability goals, or enhance their
                    brand image.
                  </span>
                </p>

                <p className="mb-6 flex items-center gap-4 text-gray-700 leading-relaxed">
                  <Image
                    src={marketplaceIcon}
                    alt="Marketplaces icon"
                    width={100}
                    height={100}
                    className="rounded-xl bg-white shadow-md p-1 mt-1"
                  />
                  <span>
                    <strong>Marketplaces/Brokers:</strong> Platforms (like
                    ClimateTrade, Pachama) where carbon credits are listed,
                    bought, and sold.
                  </span>
                </p>

                <h3 className="text-xl font-semibold mb-2">
                  How Carbon Credit Issuers Make Money
                </h3>
                <p className="mb-2">Issuers earn revenue by:</p>
                <ul className="list-disc pl-6 mb-4">
                  <li>
                    Creating and Certifying Credits: Developing projects that
                    verifiably reduce emissions.
                  </li>
                  <li>
                    Selling Credits: Once verified, credits are sold to buyers
                    through marketplaces, generating revenue based on market
                    demand and prices.
                  </li>
                  <li>
                    Long-Term Management: Continued project management and
                    sustainability practices ensure steady, recurring credit
                    generation and revenue streams.
                  </li>
                </ul>

                <h3 className="text-xl font-semibold mb-2">
                  Why companies buy Credits?
                </h3>

                <p className="mb-6 flex items-center gap-4 text-gray-700 leading-relaxed">
                  <Image
                    src={complianceIcon}
                    alt="Compliance icon"
                    width={150}
                    height={150}
                    className="rounded-l mt-2"
                  />
                  <span>
                    <strong>
                      A. Regulatory Compliance and Avoiding Penalties:
                    </strong>{" "}
                    In many regions globally, companies are required by law to
                    limit or offset their greenhouse gas emissions. Buying
                    credits is usually much cheaper than paying fines or facing
                    operational shutdowns.
                  </span>
                </p>

                <p className="mb-6 flex items-center gap-4 text-gray-700 leading-relaxed">
                  <Image
                    src={differentiationIcon}
                    alt="Brand Differentiation icon"
                    width={140}
                    height={140}
                    className="rounded-l mt-2"
                  />
                  <span>
                    <strong>
                      B. Market Competitiveness and Brand Differentiation:
                    </strong>{" "}
                    Modern consumers prefer brands that demonstrate
                    environmental responsibility. Carbon-neutral brands can
                    charge more, retain loyalty, and grow market share.
                  </span>
                </p>

                <p className="mb-6 flex items-center gap-4 text-gray-700 leading-relaxed">
                  <Image
                    src={capitalIcon}
                    alt="Access to Capital icon"
                    width={140}
                    height={140}
                    className="rounded-l mt-2"
                  />
                  <span>
                    <strong>
                      C. Access to Capital and Investor Preference:
                    </strong>{" "}
                    ESG-focused investors and institutions favor companies
                    aligned with sustainability. Carbon-neutral businesses enjoy
                    better funding access and lower borrowing costs.
                  </span>
                </p>

                <p className="mb-4">
                  Financial institutions and investors increasingly favor
                  companies aligned with sustainability (ESG criteria).
                  Businesses demonstrating carbon neutrality through purchased
                  credits have better access to funding, attract ESG-conscious
                  investors, and enjoy lower borrowing costs compared to
                  competitors who don’t prioritize sustainability.
                </p>

                <p className="mb-4">
                  In short, companies buy carbon credits because doing so
                  reduces compliance costs, enhances market positioning, and
                  opens doors to cheaper capital and investment opportunities.
                  It's economically strategic—not merely altruistic.
                </p>
              </section>,

              <section id="executive-summary">
                <h2 className="text-2xl font-bold mb-4">Executive Summary</h2>
                <p className="mb-4">
                  <strong>Mission:</strong> Oxygen democratizes investment in
                  the production of carbon credits through blockchain-based
                  tokenization, transforming environmental efforts into
                  profitable, transparent, and accessible investments.
                </p>
                <p className="mb-6 text-gray-700 leading-relaxed">
                  <strong>Problem:</strong> Forests around the world are (mostly
                  illegally) burned to clear land for agriculture or cattle—not
                  because it's profitable, but because there are few ways to
                  monetize a healthy forest. The carbon credit market solves
                  this, but it's inaccessible to most due to high entry
                  barriers, benefiting only large investors. Greenwashing due to
                  poor oversight further reduces trust. Meanwhile, traditional
                  donations lack funds and transparency.
                </p>
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                >
                  <video
                    src="/assets/videos/problem.mp4"
                    autoPlay
                    muted
                    playsInline
                    loop
                    className="w-full max-w-3xl rounded-xl shadow-lg mx-auto"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="grid grid-cols-1 md:grid-cols-[auto_1fr] items-center gap-6 p-6 rounded-2xl "
                >
                  <div className="flex gap-4 justify-center md:justify-start">
                    <div className="w-[100px] h-[100px] bg-gray-100 flex items-center justify-center overflow-hidden">
                      <video
                        src="/assets/videos/OMfloating.mp4"
                        autoPlay
                        muted
                        playsInline
                        loop
                        className="w-full h-full object-cover rounded-xl"
                      />
                    </div>
                    <div className="w-[100px] h-[100px] bg-gray-100 rounded-xl shadow-inner flex items-center justify-center overflow-hidden">
                      <video
                        src="/assets/videos/OCtoken.mp4"
                        autoPlay
                        muted
                        playsInline
                        loop
                        className="w-full h-full object-cover rounded-xl"
                      />
                    </div>
                  </div>

                  <p className="text-gray-700 leading-relaxed text-base">
                    <strong>Solution:</strong> Oxygen allows anyone to invest in
                    tokenized forest square meters ($OM tokens), instantly
                    protecting these areas permanently. Investors earn Oxygen
                    Conservation ($OC) tokens representing carbon credits and
                    other ecosystem services. Tokens can be sold for profit or
                    burned to certify carbon neutrality. Blockchain technology
                    ensures full transparency.
                  </p>
                </motion.div>
              </section>,

              <section
                id="project-overview"
                className="bg-[var(--light-grey)] py-16 px-6 rounded-2xl shadow-lg"
              >
                <div className="max-w-4xl mx-auto space-y-6">
                  <h2 className="text-2xl font-bold mb-4 text-center">
                    Project Overview and Example:{" "}
                    <span className="text-[var(--strong-green)]">
                      "La Florencia"
                    </span>
                  </h2>
                  <p className="text-gray-700 leading-relaxed text-base">
                    Oxygen’s first project, <strong>La Florencia</strong>,
                    encompasses 30,000 hectares of forest in Formosa, Argentina.
                    Collaborating closely with the indigenous Wichí community of
                    Mistolar, the project protects biodiversity—including
                    endangered species like the jaguar—and fosters sustainable
                    local economic development.
                  </p>
                  <p className="text-gray-700 leading-relaxed text-base">
                    It is a triple-impact initiative: environmental (forest
                    preservation and carbon capture), social (empowering the
                    Wichí community with jobs, resources, and infrastructure),
                    and economic (generating verified carbon credits that can be
                    monetized globally).
                  </p>

                  {/* Video container */}
                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="w-full flex justify-center"
                  >
                    <div className="w-full max-w-4xl rounded-xl shadow-md overflow-hidden">
                      <video
                        src="/assets/videos/bosqueFlorencia.mp4"
                        autoPlay
                        muted
                        playsInline
                        loop
                        className="w-full h-[300px] object-cover rounded-xl"
                      />
                    </div>
                  </motion.div>
                </div>
              </section>,

              <section id="market-analysis">
                <h2 className="text-2xl font-bold mb-4">Market Analysis</h2>
                <p className="mb-4">
                  The global carbon credit market is rapidly expanding, driven
                  by international climate goals, corporate sustainability
                  commitments, and growing regulatory requirements.
                </p>
                <p className="mb-4">
                  An industry where{" "}
                  <strong>72% of credits issued are sold</strong>, while
                  production is declining and retirements (demand) are
                  increasing. In 2024, 264 million credits were issued and 196
                  million sold. Demand for high-quality, verified credits is
                  outpacing supply, especially due to stricter environmental
                  policies.
                </p>
                <p className="mb-4">
                  Latin America presents a unique opportunity: low-cost,
                  high-impact carbon credit generation due to vast forest
                  reserves. Many landowners prefer this path over destructive
                  practices like deforestation or cattle ranching.
                </p>
                <p className="mb-4">
                  <strong>Key Insights:</strong>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>
                      High entry barriers (~$150,000 in certification costs)
                      limit access for smaller players.
                    </li>
                    <li>
                      Latin American forests offer cost-effective, high-return
                      investments.
                    </li>
                    <li>
                      The region is still early in adoption, offering
                      first-mover advantages.
                    </li>
                    <li>
                      Strong profitability potential as demand continues to
                      grow.
                    </li>
                  </ul>
                </p>
              </section>,

              <section id="token-model">
                <h2 className="text-2xl font-bold mb-4">Token Model</h2>

                <p className="mb-4">
                  The Oxygen ecosystem is built on two core tokens:
                </p>

                <ul className="list-disc list-inside space-y-2 mb-4">
                  <li>
                    <strong>$OM (Oxygen Meters):</strong> Represents real square
                    meters of protected forest. Investors purchase $OM to
                    acquire and protect specific land areas.
                  </li>
                  <li>
                    <strong>$OC (Oxygen Conservation):</strong> Earned over time
                    by $OM holders. Each $OC represents 1 kg of CO₂ captured and
                    can include other ecosystem services in the future.
                  </li>
                </ul>

                <p className="mb-4">Token holders can choose to:</p>

                <ul className="list-disc list-inside space-y-2 mb-4">
                  <li>Trade $OC tokens on the market for profit.</li>
                  <li>
                    Burn $OC tokens to certify their own carbon neutrality.
                  </li>
                </ul>

                <p className="mb-4">
                  Carbon neutrality verification is handled differently
                  depending on the user:
                </p>

                <ul className="list-disc list-inside space-y-2">
                  <li>
                    <strong>Individuals:</strong> Use a guided questionnaire to
                    determine their footprint and burn $OC accordingly.
                  </li>
                  <li>
                    <strong>Companies:</strong> Undergo a tailored audit by
                    Oxygen and its collaborators to issue formal carbon
                    certificates.
                  </li>
                </ul>
              </section>,

              <section id="business-model">
                <h2 className="text-2xl font-bold mb-4">Business Model</h2>

                <p className="mb-4">
                  Oxygen’s business model is structured around crowdfunding,
                  carbon credit monetization, and long-term ecosystem service
                  valuation.
                </p>

                <h3 className="text-xl font-semibold mt-6 mb-2">
                  Initial Funding
                </h3>
                <ul className="list-disc list-inside mb-4 space-y-2">
                  <li>
                    Target: <strong>$350,000 USD</strong> to cover operational
                    costs and certification fees for the first project.
                  </li>
                  <li>
                    Raised through the sale of <strong>$OM tokens</strong>,
                    representing forest land ownership.
                  </li>
                </ul>

                <h3 className="text-xl font-semibold mt-6 mb-2">
                  Revenue Generation
                </h3>
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  <ul className="list-disc list-inside space-y-2">
                    <li>
                      The first project alone (<strong>La Florencia</strong>,
                      30,000 ha) is projected to generate a{" "}
                      <strong>minimum of $2.8M USD over 10 years</strong>.
                    </li>
                    <li>
                      Investor ROI is projected at <strong>~7% annually</strong>
                      , based on selling 63.79 million m² at $0.0055/m² to raise
                      the initial funds.
                    </li>
                    <li>
                      Once certified by standards such as <strong>Verra</strong>
                      , <strong>Gold Standard</strong>, or{" "}
                      <strong>Pachama</strong>, the carbon credits are sold
                      through established marketplaces.
                    </li>
                  </ul>
                </div>

                <ul className="list-disc list-inside space-y-2 text-gray-700 leading-relaxed">
                  <li>
                    The first project alone (<strong>La Florencia</strong>,
                    30,000 ha) is projected to generate a{" "}
                    <strong>minimum of $2.8M USD over 10 years</strong>.
                  </li>
                  <li>
                    Investor ROI is projected at <strong>~7% annually</strong>,
                    based on selling 63.79 million m² at $0.0055/m² to raise the
                    initial funds.
                  </li>
                </ul>

                <p className="mt-4 text-gray-700 leading-relaxed">
                  Each new project will follow this model, requiring a new
                  funding round and generating new tradable carbon credits.
                </p>

                <p className="mb-4">
                  Each new project will follow this model, requiring a new
                  funding round and generating new tradable carbon credits.
                </p>

                <div className="flex gap-6 items-center justify-start pt-2">
                  <Image
                    src={verraIcon}
                    alt="Verra"
                    width={200}
                    height={50}
                    className="bg-white p-2 shadow-md rounded-md"
                  />
                  <Image
                    src={goldStandardIcon}
                    alt="Gold Standard"
                    width={200}
                    height={50}
                    className="bg-white p-2 shadow-md rounded-md"
                  />
                  <Image
                    src={pachamaIcon}
                    alt="Pachama"
                    width={200}
                    height={50}
                    className="bg-white p-2 shadow-md rounded-md"
                  />
                  <Image
                    src={logloClima}
                    alt="Pachama"
                    width={180}
                    height={50}
                    className="bg-white p-2 shadow-md rounded-md"
                  />
                </div>
              </section>,

              <section id="legal-framework">
                <h2 className="text-2xl font-bold mb-4">
                  Legal & Regulatory Framework
                </h2>

                <ul className="list-disc list-inside space-y-2 mb-4">
                  <li>
                    The forest land is already secured by{" "}
                    <strong>Oxygen Token shareholders</strong>, ensuring legal
                    control and ownership transparency.
                  </li>
                  <li>
                    All certification will be conducted through{" "}
                    <strong>Verra</strong> under the <strong>REDD+</strong>{" "}
                    standards (Reducing Emissions from Deforestation and Forest
                    Degradation), a globally recognized framework.
                  </li>
                  <li>
                    Projects aim to receive additional labels such as{" "}
                    <strong>CCB (Climate, Community & Biodiversity)</strong>,
                    which increase the market value of the credits due to their
                    verified environmental and social impact.
                  </li>
                </ul>

                <p className="mb-4">
                  This multi-certification approach enhances the credibility,
                  tradability, and profitability of the carbon credits
                  generated, while aligning with top-tier ESG investment
                  principles.
                </p>
              </section>,

              <section
                id="impact"
                className="flex flex-col lg:flex-row items-center lg:items-center justify-between gap-10 w-full"
              >
                <div className="flex flex-col lg:flex-row items-center lg:items-center justify-between gap-10 w-full">
                  <div className="w-full lg:w-3/4">
                    <h2 className="text-2xl font-bold mb-4">
                      Social & Environmental Impact
                    </h2>

                    <p className="mb-4 text-gray-700 leading-relaxed">
                      Oxygen is committed to a{" "}
                      <strong>triple-impact model</strong> that balances
                      environmental preservation, community empowerment, and
                      economic sustainability.
                    </p>

                    <h3 className="text-xl font-semibold mt-6 mb-2">
                      Environmental Impact
                    </h3>
                    <ul className="list-disc list-inside space-y-2 mb-6 text-gray-700 leading-relaxed">
                      <li>
                        Protects over 30,000 hectares of native forest in
                        Formosa, Argentina.
                      </li>
                      <li>
                        Preserves biodiversity, including endangered species
                        like the jaguar.
                      </li>
                      <li>
                        Implements satellite, radar, and vehicle-based forest
                        monitoring systems.
                      </li>
                      <li>
                        Plans for reforestation and sustainable cattle
                        management projects.
                      </li>
                    </ul>

                    <h3 className="text-xl font-semibold mt-6 mb-2">
                      Social Impact (Wichí Community)
                    </h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-700 leading-relaxed">
                      <li>
                        Local employment through park ranger training and forest
                        management roles.
                      </li>
                      <li>
                        Honey, mushroom, and brick production initiatives for
                        local income.
                      </li>
                      <li>
                        Safe water systems using rain and air humidity capture
                        technology.
                      </li>
                      <li>
                        Internet access via Starlink, and improved agricultural
                        irrigation.
                      </li>
                      <li>
                        Comprehensive biodiversity and community welfare
                        research and initiatives.
                      </li>
                    </ul>

                    <p className="mt-6 text-gray-700 leading-relaxed">
                      These actions position Oxygen not only as a carbon offset
                      platform but as a long-term contributor to ecological and
                      human development.
                    </p>
                  </div>

                  <div className="w-full lg:w-3/4 flex justify-center lg:justify-center">
                    <Image
                      src={impactImage}
                      alt="Triple Impact Diagram"
                      width={1200}
                      height={1200}
                      className="rounded-xl"
                    />
                  </div>
                </div>
              </section>,

              <section
                id="roadmap"
                className="flex flex-col lg:flex-row items-center lg:items-center justify-between gap-10 w-full"
              >
                <div className="flex flex-col lg:flex-row items-center lg:items-center justify-between gap-10 w-full">
                  <div className="w-full lg:w-3/4">
                    <h2 className="text-2xl font-bold mb-4">
                      Roadmap & Milestones
                    </h2>

                    <ul className="list-disc list-inside space-y-2 mb-4 text-gray-700 leading-relaxed">
                      <li>
                        <strong>Q1–Q2 2025:</strong> Token launch and
                        preparation of existing forest assets.
                      </li>
                      <li>
                        <strong>Q2 2025:</strong>
                        <ul className="list-disc list-inside ml-6">
                          <li>
                            10% funding: Begin project documentation and submit
                            to Verra.
                          </li>
                          <li>
                            Launch park ranger and forest management program.
                          </li>
                        </ul>
                      </li>
                      <li>
                        <strong>Q3 2025:</strong>
                        <ul className="list-disc list-inside ml-6">
                          <li>
                            20% funding: Deploy satellite monitoring and radar
                            protection systems.
                          </li>
                          <li>
                            Implement community water, internet, and irrigation
                            systems.
                          </li>
                        </ul>
                      </li>
                      <li>
                        <strong>Q4 2025:</strong>
                        <ul className="list-disc list-inside ml-6">
                          <li>
                            30% funding: Launch secondary income projects
                            (honey, mushrooms, bricks).
                          </li>
                        </ul>
                      </li>
                      <li>
                        <strong>Q1 2026:</strong>
                        <ul className="list-disc list-inside ml-6">
                          <li>
                            Project listed on Verra and partial carbon credits
                            pre-sold (250k–1M).
                          </li>
                          <li>
                            First liquidity injection to OC holders and USDT
                            trading opens.
                          </li>
                          <li>
                            Oxygen tokens listed on Argentinian stock exchange
                            (BYMA).
                          </li>
                        </ul>
                      </li>
                      <li>
                        <strong>Q2 2026–Q1 2027:</strong>
                        <ul className="list-disc list-inside ml-6">
                          <li>
                            50–100% funding: Finalize certification and
                            integrate with Pachama.
                          </li>
                          <li>
                            First official emission and sale of Certified Carbon
                            Credits (CCC).
                          </li>
                        </ul>
                      </li>
                      <li>
                        <strong>Annually after 2027:</strong>
                        <ul className="list-disc list-inside ml-6">
                          <li>New CCC emissions and token liquidity cycles.</li>
                          <li>
                            Ongoing OC distribution and evaluation of ecosystem
                            services.
                          </li>
                          <li>
                            Expansion to new projects, targeting 1 million
                            hectares saved.
                          </li>
                        </ul>
                      </li>
                    </ul>

                    <p className="mb-4 text-gray-700 leading-relaxed">
                      This roadmap reflects a phased strategy combining funding,
                      certification, community impact, and long-term
                      sustainability.
                    </p>
                  </div>

                  <div className="w-full lg:w-2/4 flex justify-center lg:justify-center">
                    <Image
                      src={roadmapImage}
                      alt="Roadmap and milestones diagram"
                      width={800}
                      height={800}
                      className="rounded-xl"
                    />
                  </div>
                </div>
              </section>,

              <section id="footnotes">
                <h2 className="text-2xl font-bold mb-6 text-[var(--dark-blue)]">
                  Footnotes
                </h2>

                <div className="space-y-10 pl-6 text-gray-700 leading-relaxed text-sm">
                  <div>
                    <h3 className="font-semibold text-base mb-2">
                      *1 Ecosystem Services
                    </h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>
                        Carbon sequestration: Capturing and storing atmospheric
                        CO₂.
                      </li>
                      <li>
                        Water regulation: Preventing floods and managing water
                        flow.
                      </li>
                      <li>
                        Biodiversity conservation: Protecting habitats of
                        endangered species.
                      </li>
                      <li>
                        Pollination: Supporting agriculture through natural
                        pollinator habitats.
                      </li>
                      <li>
                        Soil formation and fertility: Maintaining healthy soils
                        for agriculture.
                      </li>
                    </ul>
                    <p className="mt-3">
                      These services can be tracked through advanced monitoring
                      technologies such as satellite imagery, IoT sensors, radar
                      detection, biodiversity surveys, and blockchain-based
                      tracking for transparency. Monetization occurs by
                      assigning financial value based on the ecosystem’s benefit
                      or avoided costs. Markets for ecosystem services have been
                      successfully implemented internationally, such as Costa
                      Rica's Payment for Environmental Services (PSA), the
                      United States' Mitigation Credits Market and are a key
                      feature increasing the value of the credits emitted by the
                      Verra Standard + CCB by this means generating significant
                      revenue and incentivizing conservation efforts.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-base mb-2">
                      *2 Carbon Credit Demand
                    </h3>
                    <p>
                      Multiple reports confirm a rapidly growing demand for
                      carbon credits driven by stricter environmental
                      regulations and corporate climate pledges, significantly
                      outpacing supply. According to McKinsey & Company's 2023
                      analysis, demand for voluntary carbon credits is projected
                      to grow by a factor of 15 by 2030, creating significant
                      shortages, especially in high-quality, verified credits
                      like those from forest conservation projects (REDD+). This
                      imbalance results from limited certified project
                      availability, rigorous verification processes, and
                      increasing scrutiny to avoid greenwashing.
                    </p>
                    <p className="italic mt-2">
                      Source: McKinsey Sustainability, 2023
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-base mb-2">
                      *3 Cost Estimates
                    </h3>
                    <p>Google Sheet with Expected costs and years</p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-base mb-2">
                      *4 Projected Credit Revenue (La Florencia)
                    </h3>
                    <p>
                      Projected total generation for the first project:{" "}
                      <strong>$2.8M USD over 10 years</strong> (for 30,000
                      hectares La Florencia) — how is this calculated:
                    </p>
                    <ul className="list-disc pl-5 space-y-1 mt-2">
                      <li>
                        Average Carbon Credits per hectare saved in the Gran
                        Chaco region: 79 tons of CO₂/ha
                      </li>
                      <li>
                        Source: CONICET (we are conservatively estimating 25%
                        less than the original study's 105 tons/ha figure for
                        cautious calculation).
                      </li>
                      <li>
                        Expected percentage of certifiable saved hectares over
                        total area: 20%
                      </li>
                      <li>
                        For 30,000 hectares → 474,000 carbon credits (VCU)
                      </li>
                    </ul>
                    <p className="mt-3">
                      VCU Market Value: USD $5–30 per VCU → 30,000 hectares →
                      between <strong>USD $2.37M–$14.22M</strong>
                    </p>
                    <p className="mt-3 font-medium">Pricing Sources:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>ClimateTrade Market</li>
                      <li>Gold Standard Pricing</li>
                      <li>Pachama.com</li>
                      <li>Benchmark</li>
                      <li>REDD+ Example Cases</li>
                      <li>Verra Project Example</li>
                    </ul>
                    <p className="mt-3">
                      A notable case study to follow is Banco de Bosques, who
                      acquired a forest available for sale in an area at high
                      risk of deforestation. They actively implement measures to
                      prevent its degradation and protect the ecosystem.
                      Additionally, like our project, they pursue the CCB label
                      (Climate, Community & Biodiversity Standard) by creating
                      local employment opportunities and promoting the regional
                      economy. Projects with the CCB label typically sell carbon
                      credits at a higher price due to their verified enhanced
                      environmental and social quality.
                    </p>
                    <p className="mt-2">
                      For an overview of all Verra-certified VCU projects:
                      <a
                        href="https://verra.org"
                        target="_blank"
                        className="text-blue-600 underline ml-1"
                      >
                        Verra VCU Project Registry
                      </a>
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-base mb-2">
                      *5 REDD+ & CCB Certifications
                    </h3>
                    <p>
                      REDD+ (Reducing Emissions from Deforestation and Forest
                      Degradation) is an international framework developed by
                      the United Nations to financially incentivize developing
                      countries to protect forests. Projects under REDD+
                      standards issue verified carbon credits representing
                      avoided emissions from deforestation.
                    </p>
                    <p className="mt-2">
                      The CCB (Climate, Community & Biodiversity) Standard is an
                      additional certification provided by Verra and other
                      certifying bodies, confirming that a project not only
                      reduces carbon emissions but also provides measurable
                      social and biodiversity benefits. Projects with the CCB
                      label typically command premium prices, as buyers value
                      the enhanced transparency, environmental impact, and
                      positive community involvement.
                    </p>
                    <p className="italic mt-2">
                      Source: Verra – REDD+ and CCB Standards
                    </p>
                    <p className="italic">
                      <a
                        href="https://gspp.berkeley.edu/research-and-impact/centers/cepp/projects/berkeley-carbon-trading-project/offsets-database"
                        className="text-blue-600 underline"
                        target="_blank"
                      >
                        Berkeley Carbon Trading Project (VCU Database)
                      </a>
                    </p>
                  </div>
                </div>
              </section>,
            ],
            (child) => {
              if (isValidElement(child)) {
                const element = child as React.ReactElement;

                return (
                  <motion.section
                    key={element.props.id}
                    id={element.props.id}
                    className="scroll-mt-28"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                  >
                    {Children.map(element.props.children, (subChild) => {
                      if (!isValidElement(subChild)) return subChild;

                      const node = subChild as React.ReactElement<{
                        className?: string;
                        children?: React.ReactNode;
                      }>;

                      if (node.type === "h2") {
                        return (
                          <motion.h2
                            variants={{
                              hidden: { opacity: 0, y: 20 },
                              visible: { opacity: 1, y: 0 },
                            }}
                            transition={{ duration: 0.5 }}
                            className={node.props.className}
                          >
                            {node.props.children}
                          </motion.h2>
                        );
                      }

                      return (
                        <motion.div
                          variants={{
                            hidden: { opacity: 0, y: 10 },
                            visible: { opacity: 1, y: 0 },
                          }}
                          transition={{ duration: 0.6, delay: 0.2 }}
                        >
                          {node}
                        </motion.div>
                      );
                    })}
                  </motion.section>
                );
              }
              return null;
            }
          )}
        </main>
      </div>
      <Footer />
    </>
  );
};

<Image
  src={impactImage}
  alt="Triple Impact Diagram"
  width={300}
  height={300}
  className="rounded-xl shadow-lg self-center"
/>;

export default Whitepaper_Page;
