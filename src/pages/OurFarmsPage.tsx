import React, { useState } from 'react';
import { Farm, FarmCategory, SiteSettings } from '../types/index.ts';
import { NigeriaMapSection } from '../components/NigeriaMapSection.tsx';
import { HERO_IMAGE } from '../data/initialData.ts';
import { safeImageSrc } from '../utils/safeImage.ts';
import { MapPin, ArrowRight, X, ExternalLink, CheckCircle } from 'lucide-react';

interface OurFarmsPageProps {
  farms: Farm[];
  onOpenPartnerModal: () => void;
  selectedFarmModal: Farm | null;
  setSelectedFarmModal: (farm: Farm | null) => void;
  settings?: SiteSettings;
}

export const OurFarmsPage: React.FC<OurFarmsPageProps> = ({
  farms,
  onOpenPartnerModal,
  selectedFarmModal,
  setSelectedFarmModal,
  settings,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<FarmCategory>('All');

  const categories: FarmCategory[] = [
    'All',
    'Crop Farming',
    'Greenhouse Farming',
    'Livestock',
    'Poultry',
    'Aquaculture',
    'Agro-Processing',
  ];

  const filteredFarms =
    selectedCategory === 'All'
      ? farms
      : farms.filter((f) => f.type === selectedCategory);

  return (
    <div className="space-y-16 sm:space-y-24 py-8">
      {/* Page Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#075E2B]/10 text-[#075E2B] text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#075E2B]" />
            <span>{settings?.farmsEyebrow || 'Continental Production Assets'}</span>
          </div>

          <h1 className="font-serif-display text-4xl sm:text-6xl font-bold text-[#075E2B]">
            {settings?.farmsHeadline || 'Our Commercial Farm Estates'}
          </h1>

          <p className="text-base sm:text-lg text-neutral-700 leading-relaxed">
            {settings?.farmsSubtext ||
              'Spanning over 18,500 hectares across multiple agro-ecological corridors in Nigeria and West Africa, Greenvest Farms operates highly mechanized, bio-secure, and climate-resilient farming hubs.'}
          </p>
        </div>

        {/* Interactive Category Filter Tabs */}
        <div className="mt-8 flex flex-wrap gap-2 p-1.5 bg-[#F7F3E8] rounded-2xl border border-neutral-200">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-[#075E2B] text-white shadow-sm'
                  : 'text-neutral-700 hover:bg-neutral-200/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Strategic Geographical Presence (Real Nigerian Map) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <NigeriaMapSection
          farms={farms}
          onSelectFarm={setSelectedFarmModal}
          onOpenPartnerModal={onOpenPartnerModal}
        />
      </section>

      {/* Farm Portfolio Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredFarms.map((farm) => (
            <div
              key={farm.id}
              className="bg-white rounded-3xl border border-neutral-200 overflow-hidden shadow-sm hover:shadow-lg transition-all group flex flex-col justify-between"
            >
              {/* Farm Image */}
              <div className="relative h-60 overflow-hidden bg-neutral-100">
                <img
                  src={safeImageSrc(farm.image, HERO_IMAGE)!}
                  alt={farm.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 bg-[#075E2B] text-[#F4B400] text-xs font-bold px-3 py-1 rounded-lg shadow-md">
                  {farm.type}
                </span>
                <span className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm text-neutral-800 text-xs font-bold px-2.5 py-1 rounded-lg shadow-sm">
                  {farm.acreage}
                </span>
              </div>

              {/* Card Body */}
              <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-xs text-neutral-500 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-[#2E8B57] shrink-0" />
                    <span>{farm.location}, {farm.state}</span>
                  </div>

                  <h3 className="font-serif-display text-2xl font-bold text-[#263238] group-hover:text-[#075E2B] transition-colors">
                    {farm.name}
                  </h3>

                  <p className="text-xs text-neutral-600 line-clamp-3 leading-relaxed">
                    {farm.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-neutral-100 space-y-3">
                  <div className="text-[11px] text-neutral-500 font-medium">
                    <span className="font-bold text-neutral-700">Commodities: </span>
                    {farm.keyCrops.join(' · ')}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#075E2B]">
                      {farm.outputStats.split(' ')[0]} {farm.outputStats.split(' ')[1]}
                    </span>
                    <button
                      onClick={() => setSelectedFarmModal(farm)}
                      className="px-4 py-2 rounded-lg bg-[#075E2B] text-white text-xs font-bold hover:bg-[#064e24] flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span>Learn More</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#F4B400]" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Nigeria & West Africa Map Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <NigeriaMapSection farms={farms} onSelectFarm={setSelectedFarmModal} />
      </section>

      {/* Learn More Farm Dossier Modal */}
      {selectedFarmModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
          <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-neutral-100 animate-in fade-in zoom-in duration-200">
            <div className="relative h-64 sm:h-72 overflow-hidden">
              <img
                src={safeImageSrc(selectedFarmModal.image, HERO_IMAGE)!}
                alt={selectedFarmModal.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <button
                onClick={() => setSelectedFarmModal(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/40 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                <span className="text-xs font-bold text-[#F4B400] uppercase tracking-wider">
                  {selectedFarmModal.type} · {selectedFarmModal.acreage}
                </span>
                <h2 className="font-serif-display text-3xl font-bold">
                  {selectedFarmModal.name}
                </h2>
                <p className="text-xs text-white/90 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#F4B400]" />
                  {selectedFarmModal.location}, {selectedFarmModal.state}
                </p>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-5">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">
                  Estate Overview & Agronomic Profile
                </h3>
                <p className="text-sm text-neutral-700 leading-relaxed">
                  {selectedFarmModal.description}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#F7F3E8] border border-[#2E8B57]/20 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-neutral-500 uppercase tracking-wider block font-semibold">
                    Annual Output Capacity
                  </span>
                  <span className="text-base font-extrabold text-[#075E2B]">
                    {selectedFarmModal.outputStats}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-neutral-500 uppercase tracking-wider block font-semibold">
                    Acreage Under Cultivation
                  </span>
                  <span className="text-base font-extrabold text-[#263238]">
                    {selectedFarmModal.acreage}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">
                  Key Infrastructure & Tech Features
                </h3>
                <div className="space-y-2">
                  {selectedFarmModal.highlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-neutral-700">
                      <CheckCircle className="w-4 h-4 text-[#2E8B57] shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                <a
                  href={`https://wa.me/2348139487363?text=Hello%20Greenvest%20Farms,%20I%20would%20like%20to%20inquire%20about%20off-take%20or%20a%20visit%20to%20${encodeURIComponent(
                    selectedFarmModal.name
                  )}.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-[#25D366] text-white font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-[#20ba5a]"
                >
                  <span>Inquire via WhatsApp</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  onClick={() => {
                    setSelectedFarmModal(null);
                    onOpenPartnerModal();
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-[#075E2B] text-white font-bold text-xs hover:bg-[#064e24]"
                >
                  Partner on this Farm Asset
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
