import React from 'react';
import { ImpactMetric, SiteSettings } from '../types/index.ts';
import {
  Wheat,
  Users2,
  GraduationCap,
  Sparkles,
  HeartHandshake,
  Sprout,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { AGRONOMISTS_IMAGE, CROP_HARVEST_IMAGE } from '../data/initialData.ts';

interface ImpactPageProps {
  impactMetrics: ImpactMetric[];
  onOpenPartnerModal: () => void;
  settings?: SiteSettings;
}

export const ImpactPage: React.FC<ImpactPageProps> = ({
  impactMetrics,
  onOpenPartnerModal,
  settings,
}) => {
  const pillars = [
    {
      title: 'Food Security & Continental Self-Sufficiency',
      icon: Wheat,
      description:
        'By cultivating staple grains and legumes at commercial scale, Greenvest Farms supplies major food processors, reducing dependence on imported food commodities and shielding local markets from currency depreciation.',
      highlight: '145,000+ Metric Tonnes produced annually',
    },
    {
      title: 'Rural Employment & High-Quality Livelihoods',
      icon: Users2,
      description:
        'We create formal, dignified jobs across rural agrarian zones—employing tractor operators, agronomists, biochemists, irrigation engineers, warehouse managers, and cold-chain drivers with fair compensation and healthcare.',
      highlight: '4,850+ Direct & Indirect Rural Jobs',
    },
    {
      title: 'Youth Development & Agripreneur Incubation',
      icon: GraduationCap,
      description:
        'Our Young Agripreneurs Program provides university graduates with dedicated greenhouse plots, agronomic mentorship, and input financing—turning farming from a perceived hardship into a modern, data-driven career.',
      highlight: '1,200+ Young Agronomists Trained',
    },
    {
      title: 'Women Empowerment in Modern Agriculture',
      icon: Sparkles,
      description:
        'Women represent over 62% of our supervisory workforce and outgrower leadership. We provide women farmers with equal access to land tenure, mechanization equipment, and digital payment settlements.',
      highlight: '62% Female Leadership & Outgrower Ratio',
    },
    {
      title: 'Farmer Development & Outgrower Schemes',
      icon: HeartHandshake,
      description:
        'Our outgrower aggregation rings equip over 12,400 rural farmers with certified hybrid seeds, calibrated fertilizers, weather alerts, and guaranteed minimum off-take floor prices at harvest.',
      highlight: '12,400+ Smallholder Farmers Supported',
    },
    {
      title: 'Sustainable Agriculture & Soil Stewardship',
      icon: Sprout,
      description:
        'Using precision soil chemistry, zero-burning policies, minimum tillage, and solar-powered drip fertigation, we protect topsoil fertility and preserve regional water basins for the next century.',
      highlight: '84% Reduction in Post-Harvest Loss & Runoff',
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 py-8">
      {/* 1. HERO / TITLE SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#075E2B]/10 text-[#075E2B] text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#075E2B]" />
            <span>{settings?.impactEyebrow || 'Continental Social & Economic Returns'}</span>
          </div>

          <h1 className="font-serif-display text-4xl sm:text-6xl font-bold text-[#075E2B]">
            {settings?.impactHeadline || 'Our Social & Environmental Impact'}
          </h1>

          <p className="text-base sm:text-lg text-neutral-700 leading-relaxed">
            {settings?.impactSubtext ||
              'At Greenvest Farms, impact is not an afterthought or CSR compliance checkbox. It is the fundamental operating thesis of our business: when smallholder farmers prosper, soils remain fertile, and youth find dignity in agriculture, nations become food-secure.'}
          </p>
        </div>
      </section>

      {/* 2. DYNAMIC IMPACT COUNTERS (EDITABLE FROM ADMIN) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#075E2B] rounded-3xl p-8 sm:p-12 text-white shadow-xl">
          <div className="mb-8">
            <span className="text-xs uppercase tracking-widest text-[#F4B400] font-semibold">
              Live Audited Metrics
            </span>
            <h2 className="font-serif-display text-3xl sm:text-4xl font-bold mt-1">
              Measurable Progress Across African Communities
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {impactMetrics.map((metric) => (
              <div
                key={metric.id}
                className="bg-white/10 rounded-2xl p-6 border border-white/15 space-y-2 hover:bg-white/15 transition-colors"
              >
                <div className="flex items-baseline gap-2">
                  <span className="font-serif-display text-3xl sm:text-4xl font-bold text-[#F4B400] tabular-nums">
                    {metric.value}
                  </span>
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    {metric.unit}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white">{metric.label}</h3>
                <p className="text-xs text-white/75 leading-relaxed">
                  {metric.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. SEVEN IMPACT PILLARS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs uppercase tracking-widest text-[#2E8B57] font-semibold">
            Systemic Transformation
          </span>
          <h2 className="font-serif-display text-3xl sm:text-4xl font-bold text-[#075E2B]">
            Seven Pillars of Agricultural Empowerment
          </h2>
          <p className="text-xs text-neutral-600">
            Addressing root systemic bottlenecks to engineer lasting continental food sovereignty.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pillars.map((pillar, i) => {
            const Icon = pillar.icon;
            return (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 sm:p-7 border border-neutral-200 shadow-sm hover:shadow-md transition-shadow space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-[#075E2B]/10 text-[#075E2B] flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif-display text-xl font-bold text-[#263238]">
                    {pillar.title}
                  </h3>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-neutral-100">
                  <span className="text-xs font-bold text-[#075E2B] flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#2E8B57]" />
                    <span>{pillar.highlight}</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. REAL STORIES / CALLOUT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center bg-[#F7F3E8] p-8 sm:p-12 rounded-3xl border border-[#2E8B57]/20">
          <div className="lg:col-span-6 space-y-4">
            <span className="text-xs uppercase tracking-widest text-[#2E8B57] font-semibold">
              Outgrower Spotlight
            </span>
            <h2 className="font-serif-display text-3xl sm:text-4xl font-bold text-[#075E2B]">
              From 1.5 MT to 5.2 MT Per Hectare
            </h2>
            <p className="text-sm text-neutral-700 leading-relaxed">
              Before joining the Greenvest Kaduna Grains Scheme in 2024, smallholder farmer Aisha Danjuma struggled with uncertified open-pollinated seed and volatile middleman prices.
            </p>
            <p className="text-xs text-neutral-600 leading-relaxed">
              With our guaranteed input bundle, tractor land prep, and direct collection weighbridge, Aisha’s yield more than tripled. Today, she leads an aggregation cluster of 45 women maize producers.
            </p>
            <div className="pt-2">
              <button
                onClick={onOpenPartnerModal}
                className="px-6 py-3 rounded-lg bg-[#075E2B] text-white text-xs font-bold hover:bg-[#064e24] flex items-center gap-2 cursor-pointer"
              >
                <span>Partner on Outgrower Schemes</span>
                <ArrowRight className="w-4 h-4 text-[#F4B400]" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="rounded-2xl overflow-hidden shadow-lg border border-neutral-200 aspect-[4/3]">
              <img
                src={AGRONOMISTS_IMAGE}
                alt="African farmers in field"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
