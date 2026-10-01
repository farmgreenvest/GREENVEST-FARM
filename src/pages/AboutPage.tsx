import React from 'react';
import {
  Leaf,
  Lightbulb,
  ShieldCheck,
  Users2,
  CheckCircle2,
  ArrowRight,
  Target,
  Compass,
  Building2,
  BookOpen,
  MapPin,
  ExternalLink,
  Award,
  Sparkles,
} from 'lucide-react';
import { SiteSettings, InstitutionalPartner } from '../types/index.ts';
import { GreenvestDB } from '../lib/supabaseClient.ts';
import {
  HERO_IMAGE,
  AGRONOMISTS_IMAGE,
  CROP_HARVEST_IMAGE,
  AGRO_PROCESSING_IMAGE,
} from '../data/initialData.ts';
import { safeImageSrc } from '../utils/safeImage.ts';

interface AboutPageProps {
  onNavigate: (tab: string) => void;
  onOpenPartnerModal: () => void;
  settings?: SiteSettings;
  partners?: InstitutionalPartner[];
}

export const AboutPage: React.FC<AboutPageProps> = ({
  onNavigate,
  onOpenPartnerModal,
  settings: propSettings,
  partners: propPartners,
}) => {
  const settings = propSettings || GreenvestDB.getSettings();
  const partners = propPartners || GreenvestDB.getInstitutionalPartners();

  return (
    <div className="space-y-16 sm:space-y-24 py-8">
      {/* 1. HERO / TITLE SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="max-w-4xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#075E2B]/10 text-[#075E2B] text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#075E2B]" />
            <span>About Greenvest Farms Limited</span>
          </div>

          <h1 className="font-serif-display text-4xl sm:text-6xl font-bold text-[#075E2B] leading-[1.12] text-balance">
            {settings.aboutHeadline || 'Agriculture Is More Than Farming. It Is an Investment in the Future.'}
          </h1>

          <p className="text-lg sm:text-xl text-neutral-700 leading-relaxed font-normal">
            {settings.aboutDescription ||
              'Greenvest Farms is a forward-looking African agribusiness committed to modern, sustainable and profitable farming that creates value for investors, empowers communities and contributes to food security across Africa.'}
          </p>
        </div>
      </section>

      {/* 2. VALUE CARDS (Four Values) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-neutral-200 shadow-xs hover:shadow-md transition-shadow space-y-4 flex flex-col justify-between">
            <div className="w-12 h-12 rounded-xl bg-[#075E2B]/10 text-[#075E2B] flex items-center justify-center">
              <Leaf className="w-6 h-6 text-[#075E2B]" />
            </div>
            <div className="space-y-2 flex-1">
              <h2 className="font-serif-display text-2xl font-bold text-[#263238]">
                Sustainability
              </h2>
              <p className="text-xs text-neutral-600 leading-relaxed">
                We protect Africa’s topsoil through minimum tillage, regenerative organic manure integration, and precision drip fertigation that conserves freshwater.
              </p>
            </div>
            <span className="text-[11px] font-bold text-[#2E8B57] block pt-2 border-t border-neutral-100">
              Ecological Stewardship
            </span>
          </div>

          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-neutral-200 shadow-xs hover:shadow-md transition-shadow space-y-4 flex flex-col justify-between">
            <div className="w-12 h-12 rounded-xl bg-[#F4B400]/15 text-[#075E2B] flex items-center justify-center">
              <Lightbulb className="w-6 h-6 text-[#075E2B]" />
            </div>
            <div className="space-y-2 flex-1">
              <h2 className="font-serif-display text-2xl font-bold text-[#263238]">
                Innovation
              </h2>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Harnessing satellite vegetation imaging, automated center pivots, sortex optical sorting, and climate-controlled greenhouses to achieve peak yields.
              </p>
            </div>
            <span className="text-[11px] font-bold text-[#2E8B57] block pt-2 border-t border-neutral-100">
              Technology Integration
            </span>
          </div>

          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-neutral-200 shadow-xs hover:shadow-md transition-shadow space-y-4 flex flex-col justify-between">
            <div className="w-12 h-12 rounded-xl bg-[#075E2B]/10 text-[#075E2B] flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-[#075E2B]" />
            </div>
            <div className="space-y-2 flex-1">
              <h2 className="font-serif-display text-2xl font-bold text-[#263238]">
                Food Security
              </h2>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Producing staple grains, clean carbohydrates, and affordable protein at commercial scale to reduce Africa’s multi-billion-dollar food import deficit.
              </p>
            </div>
            <span className="text-[11px] font-bold text-[#2E8B57] block pt-2 border-t border-neutral-100">
              Continental Self-Sufficiency
            </span>
          </div>

          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-neutral-200 shadow-xs hover:shadow-md transition-shadow space-y-4 flex flex-col justify-between">
            <div className="w-12 h-12 rounded-xl bg-[#2E8B57]/10 text-[#075E2B] flex items-center justify-center">
              <Users2 className="w-6 h-6 text-[#075E2B]" />
            </div>
            <div className="space-y-2 flex-1">
              <h2 className="font-serif-display text-2xl font-bold text-[#263238]">
                Community Impact
              </h2>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Empowering smallholder outgrowers, championing female agronomists, and incubating rural youth with technical skills, input credit, and guaranteed offtake.
              </p>
            </div>
            <span className="text-[11px] font-bold text-[#2E8B57] block pt-2 border-t border-neutral-100">
              Generational Wealth
            </span>
          </div>
        </div>
      </section>

      {/* 3. OUR VISION & OUR MISSION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-[#075E2B] text-white rounded-3xl p-8 sm:p-12 space-y-4 shadow-xl flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#F4B400] text-[#075E2B] flex items-center justify-center">
                <Target className="w-6 h-6" />
              </div>
              <span className="text-xs uppercase tracking-widest text-[#F4B400] font-semibold">
                Strategic North Star
              </span>
              <h3 className="font-serif-display text-3xl sm:text-4xl font-bold">
                {settings.visionHeadline || 'Our Vision'}
              </h3>
              <p className="text-sm text-white/90 leading-relaxed">
                {settings.visionText ||
                  'To be Africa’s most trusted and technologically advanced agribusiness conglomerate—anchoring continental food sovereignty, transforming rural landscapes into thriving economic corridors, and creating sustainable agricultural wealth across generations.'}
              </p>
            </div>
            <div className="pt-6 border-t border-white/15 flex items-center gap-2 text-xs text-[#F4B400] font-semibold">
              <span>Goal: 50,000 Hectares Under Management by 2030</span>
            </div>
          </div>

          <div className="bg-[#F7F3E8] border border-[#2E8B57]/20 rounded-3xl p-8 sm:p-12 space-y-4 shadow-xs flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#075E2B] text-[#F4B400] flex items-center justify-center">
                <Compass className="w-6 h-6" />
              </div>
              <span className="text-xs uppercase tracking-widest text-[#2E8B57] font-semibold">
                Operational Mandate
              </span>
              <h3 className="font-serif-display text-3xl sm:text-4xl font-bold text-[#075E2B]">
                {settings.missionHeadline || 'Our Mission'}
              </h3>
              <p className="text-sm text-neutral-700 leading-relaxed">
                {settings.missionText ||
                  'To engineer modern, industrial-scale agricultural ecosystems by fusing agronomic precision, climate-resilient crop varieties, automated farmgate processing, and transparent institutional investment structures that deliver maximum value from seed to table.'}
              </p>
            </div>
            <div className="pt-6 border-t border-[#2E8B57]/15 flex items-center gap-2 text-xs text-[#075E2B] font-bold">
              <span>Core Principle: Zero-Waste & Continuous Value Retention</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. OUR APPROACH & OUR COMMITMENT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 relative">
            <div className="rounded-3xl overflow-hidden shadow-2xl border border-neutral-200 aspect-[4/3] bg-neutral-100">
              <img
                src={safeImageSrc(settings?.approachImage || settings?.aboutImage, AGRO_PROCESSING_IMAGE)!}
                alt="Agro-processing facility"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-white p-5 rounded-2xl shadow-xl border border-neutral-200 hidden sm:block max-w-xs">
              <p className="text-xs font-bold text-[#075E2B]">Integrated Agro-Industrial Hubs</p>
              <p className="text-[11px] text-neutral-500 mt-0.5">
                Processing within 15km of field harvest reduces transit decay by over 80%.
              </p>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs uppercase tracking-widest text-[#2E8B57] font-semibold">
              {settings.approachTag || 'The Greenvest Standard'}
            </span>
            <h3 className="font-serif-display text-3xl sm:text-4xl font-bold text-[#075E2B]">
              {settings.approachHeadline || 'Our Approach: Industrial Scale, Local Respect'}
            </h3>
            <p className="text-sm text-neutral-700 leading-relaxed">
              {settings.approachDescription ||
                'We reject the outdated binary between subsistence farming and absentee extraction. Our operational approach combines large-scale nucleus estates with robust community outgrower networks.'}
            </p>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#2E8B57] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-neutral-800">
                    {settings.commitment1Title || 'Precision Soil & Water Agronomy'}
                  </h4>
                  <p className="text-xs text-neutral-600">
                    {settings.commitment1Desc ||
                      'Comprehensive pre-planting nutrient assays, balanced liming, and solar-powered drip lines.'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#2E8B57] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-neutral-800">
                    {settings.commitment2Title || 'Forward Offtake Agreements'}
                  </h4>
                  <p className="text-xs text-neutral-600">
                    {settings.commitment2Desc ||
                      'Guaranteed commercial purchase contracts with Nigeria’s leading food and feed millers.'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#2E8B57] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-neutral-800">
                    {settings.commitment3Title || 'Our Commitment to Transparency'}
                  </h4>
                  <p className="text-xs text-neutral-600">
                    {settings.commitment3Desc ||
                      'Audited biological asset appraisals, satellite verification, and institutional governance.'}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onOpenPartnerModal}
                className="px-6 py-3 rounded-lg bg-[#075E2B] text-white text-xs font-bold hover:bg-[#064e24] transition-colors flex items-center gap-2 cursor-pointer"
              >
                <span>Partner With Our Agronomy Team</span>
                <ArrowRight className="w-4 h-4 text-[#F4B400]" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. INSTITUTION LEADERSHIP: PARTNERSHIP WITH AGRICULTURAL INSTITUTIONS IN BLOCK FORMATS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#075E2B]/10 text-[#075E2B] text-xs font-semibold">
            <Building2 className="w-3.5 h-3.5 text-[#F4B400]" />
            <span>
              {settings.partnersSectionBadge || 'Institutional Leadership & Research Alliances'}
            </span>
          </div>

          <h2 className="font-serif-display text-3xl sm:text-5xl font-bold text-[#075E2B] leading-tight">
            {settings.partnersSectionTitle ||
              'Institutional Partnerships with Leading Agricultural Institutes'}
          </h2>

          <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed max-w-2xl mx-auto">
            {settings.partnersSectionSubtext ||
              'Greenvest Farms collaborates closely with leading African and global agricultural research institutes, seed genebanks, and mechanization bodies to deploy climate-resilient agronomy and elite crop genetics at commercial scale.'}
          </p>
        </div>

        {/* BLOCK FORMATS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {partners.map((partner) => (
            <div
              key={partner.id}
              className="bg-white rounded-3xl border-2 border-neutral-200/90 overflow-hidden shadow-xs hover:shadow-xl hover:border-[#075E2B] transition-all flex flex-col justify-between group"
            >
              {/* Block Top Banner & Acronym Header */}
              <div className="relative p-5 pb-4 bg-gradient-to-b from-[#F7F3E8] to-white border-b border-neutral-200/80">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="px-3 py-1.5 rounded-xl bg-[#075E2B] text-white font-serif-display font-extrabold text-base tracking-wide shadow-xs flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#F4B400]" />
                    <span>{partner.acronym}</span>
                  </div>
                  {partner.yearEstablished && (
                    <span className="text-[10px] font-mono font-bold text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-full">
                      {partner.yearEstablished}
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <h3 className="font-serif-display text-lg font-bold text-[#263238] group-hover:text-[#075E2B] transition-colors leading-snug">
                    {partner.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-[11px] text-[#2E8B57] font-semibold">
                    <Sparkles className="w-3.5 h-3.5 text-[#F4B400] shrink-0" />
                    <span>{partner.category}</span>
                  </div>
                </div>

                {partner.location && (
                  <div className="flex items-center gap-1.5 text-[10px] text-neutral-500 mt-2 font-medium">
                    <MapPin className="w-3 h-3 text-neutral-400 shrink-0" />
                    <span className="truncate">{partner.location}</span>
                  </div>
                )}
              </div>

              {/* Block Image Preview (Optional/Crest) */}
              {safeImageSrc(partner.logo) ? (
                <div className="h-32 w-full overflow-hidden bg-neutral-100 border-b border-neutral-100 relative">
                  <img
                    src={safeImageSrc(partner.logo)!}
                    alt={partner.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  {partner.badge && (
                    <span className="absolute bottom-2 left-3 text-[10px] font-bold text-white bg-[#075E2B]/85 backdrop-blur-xs px-2 py-0.5 rounded-full border border-white/20">
                      {partner.badge}
                    </span>
                  )}
                </div>
              ) : null}

              {/* Block Body Content */}
              <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                {/* Mandate Block */}
                <div className="space-y-2">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-neutral-500 block">
                    Institutional Mandate & Scope
                  </span>
                  <p className="text-xs text-neutral-700 leading-relaxed bg-[#F7F3E8]/60 p-3 rounded-xl border border-neutral-200/60 font-normal">
                    {partner.mandate}
                  </p>
                </div>

                {/* Key Initiatives List */}
                {partner.keyInitiatives && partner.keyInitiatives.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-neutral-500 block">
                      Joint Agronomic Initiatives
                    </span>
                    <ul className="space-y-1.5">
                      {partner.keyInitiatives.map((init, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-[11px] text-neutral-600">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#2E8B57] shrink-0 mt-0.5" />
                          <span className="leading-tight">{init}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Block Footer Seal */}
                <div className="pt-4 border-t border-neutral-100 flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-[#075E2B] bg-[#075E2B]/5 px-2 py-1 rounded-lg">
                    {partner.allianceType || 'Active Institutional Partner'}
                  </span>
                  <button
                    onClick={onOpenPartnerModal}
                    className="text-[#075E2B] hover:text-[#064e24] font-bold inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>Inquire</span>
                    <ArrowRight className="w-3 h-3 text-[#F4B400]" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Banner for Institutional Collaboration */}
        <div className="p-8 sm:p-10 rounded-3xl bg-[#075E2B] text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl text-center sm:text-left">
            <h3 className="font-serif-display text-2xl sm:text-3xl font-bold">
              Are you an Agricultural University, Research Institute, or Development Agency?
            </h3>
            <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
              We provide commercial acreage, automated irrigation infrastructure, and outgrower networks to pilot, validate, and scale tropical agronomic innovations.
            </p>
          </div>

          <button
            onClick={onOpenPartnerModal}
            className="px-6 py-3.5 rounded-xl bg-[#F4B400] text-[#075E2B] font-bold text-xs hover:bg-[#e0a500] transition-all shadow-lg shrink-0 flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <BookOpen className="w-4 h-4" />
            <span>Submit Institutional Proposal</span>
          </button>
        </div>
      </section>
    </div>
  );
};
