import React, { useState } from 'react';
import { SiteSettings } from '../types/index.ts';
import {
  TrendingUp,
  ShieldAlert,
  BarChart3,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Handshake,
  Landmark,
} from 'lucide-react';
import { HERO_IMAGE, CROP_HARVEST_IMAGE } from '../data/initialData.ts';

interface InvestmentPageProps {
  onOpenPartnerModal: () => void;
  settings?: SiteSettings;
}

export const InvestmentPage: React.FC<InvestmentPageProps> = ({ onOpenPartnerModal, settings }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'What makes Greenvest Farms’ agricultural investment model institutionally sound?',
      a: 'We operate on real physical asset backing: secured titled farmland estates, biological crop assets, automated irrigation infrastructure, and Sortex agro-processing facilities. All operations are structured with multi-peril comprehensive agricultural insurance and audited financial records.',
    },
    {
      q: 'Do you offer guaranteed returns on investment?',
      a: 'No. Greenvest Farms strictly adheres to institutional financial compliance and does not promise speculative or guaranteed yields. Agricultural production involves natural biological cycles, weather patterns, and commodity price dynamics. Instead, we mitigate risk through multi-season irrigation, hybrid drought-resistant seeds, forward offtake pricing agreements, and rigorous farmgate processing.',
    },
    {
      q: 'Who can partner or invest with Greenvest Farms?',
      a: 'We collaborate with institutional investment funds, agricultural development finance institutions (DFIs), private equity, family offices, sovereign syndicates, and commercial food processors seeking long-term supply chain integration.',
    },
    {
      q: 'How does Greenvest protect capital against post-harvest and weather risks?',
      a: 'By deploying automated center-pivot irrigation to ensure dry-season harvests, utilizing drone NDVI imaging for early crop stress detection, and operating on-site grain silos and Sortex milling plants within 15 km of fields to eliminate transit spoilage.',
    },
    {
      q: 'What is the typical horizon for agricultural infrastructure capital deployment?',
      a: 'Nucleus estate development and commercial agro-processing facilities typically follow medium-to-long term horizons of 3 to 7 years, aligning with biological maturation, crop rotations, and value-addition industrialization.',
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 py-8">
      {/* 1. HERO / TITLE SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#075E2B]/10 text-[#075E2B] text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#075E2B]" />
            <span>{settings?.investmentEyebrow || 'Institutional Agricultural Investment'}</span>
          </div>

          <h1 className="font-serif-display text-4xl sm:text-6xl font-bold text-[#075E2B] leading-[1.12]">
            {settings?.investmentHeadline || 'Invest in the Future of Food.'}
          </h1>

          <p className="text-base sm:text-lg text-neutral-700 leading-relaxed">
            {settings?.investmentSubtext ||
              'Deploying disciplined capital into mechanized production, climate-resilient water infrastructure, and agro-processing hubs that anchor Africa’s food sovereignty and deliver tangible economic value.'}
          </p>

          <div className="pt-2 flex flex-wrap gap-4">
            <button
              onClick={onOpenPartnerModal}
              className="px-8 py-3.5 rounded-xl bg-[#075E2B] text-white font-bold text-xs hover:bg-[#064e24] shadow-lg flex items-center gap-2 cursor-pointer"
            >
              <span>Partner With Us</span>
              <ArrowRight className="w-4 h-4 text-[#F4B400]" />
            </button>
            <a
              href={`https://wa.me/${settings?.whatsappNumber || '2348139487363'}?text=Hello%20Greenvest%20Farms,%20I%20would%20like%20to%20request%20your%20Institutional%20Agri-Investment%20Brief.`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 rounded-xl border border-neutral-300 text-neutral-700 font-bold text-xs hover:bg-neutral-50 transition-colors"
            >
              {settings?.investmentCtaText || 'Request Institutional Brief'}
            </a>
          </div>
        </div>
      </section>

      {/* 2. WHY AGRICULTURE? (MACRO THESIS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-5">
            <span className="text-xs uppercase tracking-widest text-[#2E8B57] font-semibold">
              The Fundamental Macro Thesis
            </span>
            <h2 className="font-serif-display text-3xl sm:text-4xl font-bold text-[#075E2B]">
              Why African Agriculture? Why Now?
            </h2>
            <p className="text-sm text-neutral-700 leading-relaxed">
              Africa is the world’s final agricultural frontier. With over 60% of the globe’s remaining uncultivated arable land, rapid urbanization, and a population surging toward 2.5 billion, food production is not merely a commercial sector—it is the foundational prerequisite for macroeconomic stability.
            </p>
            <div className="space-y-3 pt-2">
              <div className="p-4 rounded-xl bg-[#F7F3E8] border border-[#2E8B57]/15 flex items-start gap-3">
                <Landmark className="w-5 h-5 text-[#075E2B] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-[#263238]">Import Substitution & Currency Resilience</h4>
                  <p className="text-xs text-neutral-600">
                    Domestic production of maize, rice, and edible oils shields nations and consumer industries from foreign exchange shocks.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#F7F3E8] border border-[#2E8B57]/15 flex items-start gap-3">
                <BarChart3 className="w-5 h-5 text-[#075E2B] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-[#263238]">Inelastic Everyday Demand</h4>
                  <p className="text-xs text-neutral-600">
                    Unlike discretionary consumer tech or real estate cycles, staple nutrition represents non-negotiable daily demand.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="rounded-3xl overflow-hidden shadow-xl border border-neutral-200 aspect-[4/3] relative">
              <img
                src={CROP_HARVEST_IMAGE}
                alt="Maize harvesting"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                <span className="text-xs font-bold text-[#F4B400] uppercase tracking-wider">
                  Productive Commercial Assets
                </span>
                <p className="text-sm font-semibold">
                  Mechanized cereal cultivation delivering consistent raw inputs to national food processors.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. OUR AGRICULTURAL MODEL */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs uppercase tracking-widest text-[#2E8B57] font-semibold">
            Operational Blueprint
          </span>
          <h2 className="font-serif-display text-3xl sm:text-4xl font-bold text-[#075E2B]">
            The Nucleus-Estate & Outgrower Model
          </h2>
          <p className="text-xs text-neutral-600">
            A de-risked hybrid architecture balancing institutional scale with inclusive rural economic development.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-neutral-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#075E2B] text-[#F4B400] flex items-center justify-center font-bold text-sm">
              01
            </div>
            <h3 className="font-serif-display text-xl font-bold text-[#263238]">
              Commercial Nucleus Estate
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Highly capital-intensive anchor farms featuring center-pivot irrigation, computerized silos, seed testing nurseries, and machinery maintenance bays.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-neutral-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#075E2B] text-[#F4B400] flex items-center justify-center font-bold text-sm">
              02
            </div>
            <h3 className="font-serif-display text-xl font-bold text-[#263238]">
              Outgrower Aggregation Rings
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Surrounding smallholders receive certified hybrid seeds, mechanized tillage, and guaranteed offtake contracts, multiplying regional production volume without excess land capex.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-neutral-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#075E2B] text-[#F4B400] flex items-center justify-center font-bold text-sm">
              03
            </div>
            <h3 className="font-serif-display text-xl font-bold text-[#263238]">
              Integrated Agro-Processing Hub
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Raw harvests are cleaned, destoned, sortex-refined, and packaged immediately on-site, converting perishable field output into shelf-stable industrial products.
            </p>
          </div>
        </div>
      </section>

      {/* 4. INVESTMENT OPPORTUNITIES & VALUE CREATION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#075E2B] text-white rounded-3xl p-8 sm:p-14 space-y-8 shadow-2xl">
          <div className="max-w-3xl space-y-3">
            <span className="text-xs uppercase tracking-widest text-[#F4B400] font-semibold">
              Asset Classes & Structures
            </span>
            <h2 className="font-serif-display text-3xl sm:text-4xl font-bold">
              Institutional Partnership Pathways
            </h2>
            <p className="text-xs sm:text-sm text-white/85 leading-relaxed">
              We structure custom joint ventures, forward commodity agreements, and equity participations according to partner risk tolerances and liquidity timelines.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white/10 rounded-2xl p-6 border border-white/15 space-y-3">
              <h3 className="font-serif-display text-xl font-bold text-[#F4B400]">
                Nucleus Farmland Expansion
              </h3>
              <p className="text-xs text-white/80 leading-relaxed">
                Direct capital deployment into titled agricultural acreage, deep boreholes, center pivots, and mechanized combine fleets.
              </p>
            </div>

            <div className="bg-white/10 rounded-2xl p-6 border border-white/15 space-y-3">
              <h3 className="font-serif-display text-xl font-bold text-[#F4B400]">
                Agro-Processing Joint Ventures
              </h3>
              <p className="text-xs text-white/80 leading-relaxed">
                Co-investment into optical sortex rice mills, cassava starch lines, and cold-pressed edible oil bottling facilities with guaranteed off-take.
              </p>
            </div>

            <div className="bg-white/10 rounded-2xl p-6 border border-white/15 space-y-3">
              <h3 className="font-serif-display text-xl font-bold text-[#F4B400]">
                Outgrower Credit Facilities
              </h3>
              <p className="text-xs text-white/80 leading-relaxed">
                Working capital financing for input provision and forward contracts across our 12,400+ verified smallholder farmer network.
              </p>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/15">
            <div className="flex items-center gap-2 text-xs text-white/80">
              <ShieldAlert className="w-4 h-4 text-[#F4B400]" />
              <span>All partnerships subject to KYC, ESG auditing, and legal due diligence.</span>
            </div>
            <button
              onClick={onOpenPartnerModal}
              className="px-6 py-3 rounded-xl bg-[#F4B400] text-[#075E2B] font-bold text-xs hover:bg-[#e0a500] transition-colors cursor-pointer"
            >
              Initiate Partnership Dialogue
            </button>
          </div>
        </div>
      </section>

      {/* 5. FREQUENTLY ASKED QUESTIONS */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs uppercase tracking-widest text-[#2E8B57] font-semibold">
            Institutional Clarity
          </span>
          <h2 className="font-serif-display text-3xl sm:text-4xl font-bold text-[#075E2B]">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 focus:outline-none cursor-pointer"
                >
                  <span className="font-serif-display text-lg font-bold text-[#263238]">
                    {faq.q}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-[#075E2B] shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-neutral-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-neutral-600 leading-relaxed border-t border-neutral-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
