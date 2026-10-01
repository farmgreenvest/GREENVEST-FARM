import React from 'react';
import { ServiceItem, SiteSettings } from '../types/index.ts';
import { AGRO_PROCESSING_IMAGE } from '../data/initialData.ts';
import { safeImageSrc } from '../utils/safeImage.ts';
import { CheckCircle2, ArrowRight } from 'lucide-react';

interface WhatWeDoPageProps {
  services: ServiceItem[];
  onOpenPartnerModal: () => void;
  onNavigate: (tab: string) => void;
  settings?: SiteSettings;
}

export const WhatWeDoPage: React.FC<WhatWeDoPageProps> = ({
  services,
  onOpenPartnerModal,
  onNavigate,
  settings,
}) => {
  return (
    <div className="space-y-16 sm:space-y-24 py-8">
      {/* Page Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#075E2B]/10 text-[#075E2B] text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#075E2B]" />
            <span>{settings?.servicesEyebrow || 'Operational Capabilities'}</span>
          </div>

          <h1 className="font-serif-display text-4xl sm:text-6xl font-bold text-[#075E2B]">
            {settings?.servicesHeadline || 'What We Do: Integrated Agribusiness'}
          </h1>

          <p className="text-base sm:text-lg text-neutral-700 leading-relaxed">
            {settings?.servicesSubtext ||
              'Greenvest Farms operates across the entire agribusiness value chain—from mechanized field production and climate-controlled horticulture to industrial agro-processing, cold-chain logistics, and institutional investment structures.'}
          </p>
        </div>
      </section>

      {/* 6 Premium Service Sections (Alternating Layouts) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        {services.map((service, index) => {
          const isReversed = index % 2 !== 0;
          return (
            <div
              key={service.id}
              className={`grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center ${
                isReversed ? 'lg:flex-row-reverse' : ''
              }`}
            >
              {/* Image Container */}
              <div
                className={`lg:col-span-6 relative ${
                  isReversed ? 'lg:order-2' : 'lg:order-1'
                }`}
              >
                <div className="rounded-3xl overflow-hidden shadow-xl border border-neutral-200 aspect-[4/3] bg-neutral-100 group">
                  <img
                    src={safeImageSrc(service.image, AGRO_PROCESSING_IMAGE)!}
                    alt={service.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-[#075E2B] text-[#F4B400] text-xs font-bold px-3 py-1 rounded-md shadow">
                    0{index + 1}. {service.category}
                  </div>
                </div>
              </div>

              {/* Text / Activities Container */}
              <div
                className={`lg:col-span-6 space-y-6 ${
                  isReversed ? 'lg:order-1' : 'lg:order-2'
                }`}
              >
                <div className="space-y-3">
                  <span className="text-xs uppercase tracking-widest text-[#2E8B57] font-semibold">
                    Core Agricultural Division 0{index + 1}
                  </span>
                  <h2 className="font-serif-display text-3xl sm:text-4xl font-bold text-[#075E2B]">
                    {service.title}
                  </h2>
                  <p className="text-sm text-neutral-700 leading-relaxed">
                    {service.description}
                  </p>
                </div>

                {/* Key Activities */}
                <div className="space-y-3 bg-[#F7F3E8] p-5 sm:p-6 rounded-2xl border border-[#2E8B57]/15">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#075E2B]">
                    Key Activities & Technical Scope:
                  </h4>
                  <div className="space-y-2.5">
                    {service.keyActivities.map((act, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs text-neutral-700">
                        <CheckCircle2 className="w-4 h-4 text-[#2E8B57] shrink-0 mt-0.5" />
                        <span>{act}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <div className="pt-2 flex flex-wrap items-center gap-4">
                  <button
                    onClick={() => {
                      if (service.slug === 'agri-investment') {
                        onNavigate('investment');
                      } else {
                        onOpenPartnerModal();
                      }
                    }}
                    className="px-6 py-3 rounded-xl bg-[#075E2B] text-white text-xs font-bold hover:bg-[#064e24] transition-all shadow-md flex items-center gap-2 cursor-pointer"
                  >
                    <span>{service.ctaText}</span>
                    <ArrowRight className="w-4 h-4 text-[#F4B400]" />
                  </button>

                  <a
                    href={`https://wa.me/2348139487363?text=Hello%20Greenvest%20Farms,%20I%20am%20interested%20in%20your%20services%20under:%20${encodeURIComponent(
                      service.title
                    )}.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-[#075E2B] hover:text-[#2E8B57]"
                  >
                    Discuss on WhatsApp →
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
};
