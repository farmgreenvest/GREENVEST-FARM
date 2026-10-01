import React, { useState } from 'react';
import { Farm } from '../types/index.ts';
import {
  MapPin,
  ArrowRight,
  ExternalLink,
  Building2,
  Tractor,
  Layers,
  Sparkles,
  CheckCircle2,
  Navigation,
  Compass,
  PhoneCall,
  Eye,
  Maximize2,
  ShieldCheck,
  Award,
} from 'lucide-react';
import { NIGERIA_RELIEF_MAP_IMAGE } from '../data/initialData.ts';

export interface StrategicLocation {
  id: string;
  name: string;
  city: string;
  state: string;
  category: 'flagship' | 'commercial' | 'institution';
  badgeText: string;
  coordinates: { x: number; y: number }; // Percentage (0 - 100%) on map
  ecologicalZone: string;
  partnerInstitutions: string;
  description: string;
  outputCapacity?: string;
  acreage?: string;
  keyCrops: string[];
  highlights: string[];
  contactActionText?: string;
  linkedFarmId?: string;
}

export const STRATEGIC_LOCATIONS: StrategicLocation[] = [
  {
    id: 'kaduna-hub',
    name: 'Kaduna Commercial Grain Hub & Silo Complex',
    city: 'Kaduna',
    state: 'Kaduna State',
    category: 'flagship',
    badgeText: '⭐ Greenvest Flagship Nucleus Hub',
    coordinates: { x: 43.5, y: 36.2 },
    ecologicalZone: 'Northern Guinea Savannah',
    partnerInstitutions: 'IAR / Ahmadu Bello University (Zaria), NCAM Engineering Unit',
    description:
      'Our flagship commercial grain nucleus and northern logistical nerve center. Operates 24,000 MT automated grain elevators, computerized center-pivot irrigation, precision soil assaying, and a network of over 1,200 contracted smallholder outgrowers.',
    acreage: '5,000+ Ha Nucleus (12,000+ Ha Outgrower Ring)',
    outputCapacity: '22,000 MT Maize & Soybean Annual Yield',
    keyCrops: ['Yellow Feed Maize', 'Commercial Soybean', 'White Sorghum', 'Hybrid Sesame'],
    highlights: [
      '24,000 MT Automated Silo Storage & Computerized Aeration',
      '3x 80-Hectare Mechanized Solar-Assisted Center Pivots',
      'Real-time IoT Soil Moisture & Nitrogen Sensors',
      'Guaranteed Forward Supply to Top Tier Nigerian Millers',
    ],
    contactActionText: 'Schedule Visit to Kaduna Hub',
    linkedFarmId: 'farm-1',
  },
  {
    id: 'zaria-iar',
    name: 'IAR / Ahmadu Bello University Agronomic Hub',
    city: 'Zaria',
    state: 'Kaduna State',
    category: 'institution',
    badgeText: 'Research Alliance (IAR / ABU)',
    coordinates: { x: 44.5, y: 29.8 },
    ecologicalZone: 'Northern Guinea Savannah',
    partnerInstitutions: 'Institute for Agricultural Research (IAR / ABU Zaria)',
    description:
      'National Center of Excellence for cereal mechanization and deep savannah soil fertility mapping. Greenvest partners with IAR on certified foundation seed multiplication, precision liming, and tractor implement stress benchmarking.',
    acreage: 'Multi-Locational Savannah Trial Plots',
    outputCapacity: 'Certified Hybrid Seed Multiplication',
    keyCrops: ['SAMMAZ Hybrid Maize', 'TGX Soybeans', 'Elite Sorghum Cultivars'],
    highlights: [
      'Cadastral Soil Fertility Assays & Micro-Dosing Regimes',
      'Multi-Season Drought Resistance Trialing',
      'Farm Machinery Field Loss Mitigation Protocols',
    ],
    contactActionText: 'Inquire on IAR / ABU Trials',
  },
  {
    id: 'ibadan-iita',
    name: 'IITA & NIHORT Genetic Research Hub',
    city: 'Ibadan',
    state: 'Oyo State',
    category: 'institution',
    badgeText: 'CGIAR & Horticultural Alliance (IITA & NIHORT)',
    coordinates: { x: 17.5, y: 67.2 },
    ecologicalZone: 'Derived Savannah / Tropical Rainforest',
    partnerInstitutions: 'IITA (Global CGIAR Center) & NIHORT Main Station',
    description:
      'Pioneering collaborative trials for climate-smart drought-tolerant yellow maize, disease-resistant biofortified cassava, and Dutch-specification greenhouse vegetable fertigation with zero chemical pesticide residue.',
    acreage: 'Horticultural Trial Nursery & Seed Genebank',
    outputCapacity: 'High-Yield Germplasm Exchange',
    keyCrops: ['Drought-Tolerant Hybrid Maize', 'Bio-fortified Cassava', 'Dutch Beef Tomatoes', 'Habanero Peppers'],
    highlights: [
      'CGIAR Certified Seed Germplasm Trials',
      'Biological Integrated Pest Management (IPM)',
      'Youth Agripreneurs Incubation & Skill Transfer',
    ],
    contactActionText: 'Inquire on IITA / NIHORT Programs',
  },
  {
    id: 'abuja-cgiar',
    name: 'CGIAR & AfDB Continental Policy Hub',
    city: 'Abuja',
    state: 'Federal Capital Territory (FCT)',
    category: 'institution',
    badgeText: 'Continental Alliance (CGIAR & AfDB)',
    coordinates: { x: 42.8, y: 50.0 },
    ecologicalZone: 'Southern Guinea Savannah',
    partnerInstitutions: 'CGIAR / AfricaRice Regional Directorate & AfDB Feed Africa',
    description:
      'Strategic headquarters alliance for Special Agro-Industrial Processing Zones (SAPZ), low-carbon lowland paddy cultivation frameworks, and ESG-compliant institutional capital deployment across West Africa.',
    outputCapacity: 'Continental Trade Integration & Outgrower Structuring',
    keyCrops: ['Faro 44 & 52 Lowland Paddy Rice', 'ESG Compliance Protocols'],
    highlights: [
      'SAPZ Agro-Industrial Cluster Planning & Policy Alignment',
      'Alternate Wetting & Drying (AWD) Low-Carbon Rice Protocols',
      'Institutional Governance & Impact Measurement',
    ],
    contactActionText: 'Contact Institutional Directorate',
  },
  {
    id: 'ilorin-ncam',
    name: 'NCAM Agricultural Mechanization Hub',
    city: 'Ilorin',
    state: 'Kwara State',
    category: 'institution',
    badgeText: 'Mechanization Partner (NCAM)',
    coordinates: { x: 23.2, y: 56.4 },
    ecologicalZone: 'Southern Guinea Savannah',
    partnerInstitutions: 'National Centre for Agricultural Mechanization (NCAM)',
    description:
      'Collaborative engineering testbed for minimum-tillage tractor implements, automated solar-powered grain dryers, hermetic silo aeration units, and hands-on technician apprenticeships.',
    outputCapacity: 'Machinery Calibration & Operator Certification',
    keyCrops: ['Mechanized Planters', 'Solar Grain Dryers', 'Tractor Telematics'],
    highlights: [
      'Tropical Implement Durability & Stress Testing',
      'Solar Modular Dryers & Hermetic Storage Validation',
      'Vocational Tractor Operator Apprenticeship Program',
    ],
    contactActionText: 'Inquire on Mechanization Training',
  },
  {
    id: 'lagos-niomr',
    name: 'NIOMR Commercial Aquaculture Hub',
    city: 'Lagos',
    state: 'Lagos State',
    category: 'institution',
    badgeText: 'Aquaculture Partner (NIOMR) & Port Gateway',
    coordinates: { x: 14.2, y: 77.5 },
    ecologicalZone: 'Coastal Mangrove & Marine Estuary',
    partnerInstitutions: 'NIOMR (Nigerian Institute for Oceanography & Marine Research)',
    description:
      'Benchmarking high-density Recirculating Aquaculture Systems (RAS), African catfish (Clarias gariepinus) broodstock conditioning, and certified cold-blast freezing protocols for domestic distribution and containerized marine exports.',
    outputCapacity: '350,000 Table Fish & Fast-Growing Fingerlings',
    keyCrops: ['African Catfish', 'Tilapia Fingerlings', 'Single-Cell Protein Feeds'],
    highlights: [
      'Recirculating Aquaculture Systems (RAS) Water Filtration',
      'Certified Bio-secure Broodstock Breeding',
      'Port-Adjacent Cold-Chain Seafood Transit Staging',
    ],
    contactActionText: 'Inquire on Aquaculture Supply',
  },
  {
    id: 'kano-nihort',
    name: 'NIHORT Northern Dryland Station',
    city: 'Kano / Bichi',
    state: 'Kano State',
    category: 'institution',
    badgeText: 'Northern Station (NIHORT)',
    coordinates: { x: 49.8, y: 20.2 },
    ecologicalZone: 'Sudan Savannah',
    partnerInstitutions: 'NIHORT Northern Ecological Station',
    description:
      'Semi-arid drip irrigation protocols, solar vegetable dehydration systems, and heat-tolerant allium (onion/garlic) and tomato multiplication pipelines serving northern processing plants.',
    outputCapacity: 'Dryland Seed Multiplication & Solar Drying',
    keyCrops: ['Dryland Roma Tomatoes', 'Red Onion Bulbs', 'Chili Pepper Cultivars'],
    highlights: [
      'Sahelian Solar Drip Fertigation Regimes',
      'Solar-Powered Post-Harvest Vegetable Dehydration',
      'Seed Multiplication for Savannah Processors',
    ],
    contactActionText: 'Inquire on Dryland Trials',
  },
  {
    id: 'makurdi-benue',
    name: 'Benue Agro-Industrial Processing Hub',
    city: 'Makurdi',
    state: 'Benue State',
    category: 'commercial',
    badgeText: 'Commercial Grain & Tuber Processing Hub',
    coordinates: { x: 52.6, y: 63.5 },
    ecologicalZone: 'Southern Guinea Savannah (Benue Basin)',
    partnerInstitutions: 'Benue Valley Outgrower Cooperative Network',
    description:
      'Large-scale commercial soybean oil extraction, sortex-milled parboiled rice processing, and cassava starch crystallization situated directly along the fertile Benue river transport corridor.',
    acreage: '3,200+ Hectares Cultivation & Processing',
    outputCapacity: '15,000 MT Milled Rice & Soybean Crude Oil',
    keyCrops: ['Faro 44 Parboiled Rice', 'Industrial Soybean', 'Cassava Tuber Flour'],
    highlights: [
      'Sortex Optical Rice Cleaning & Packaging Line',
      'Continuous Expeller Soybean Oil Press Facility',
      'Barge-Ready Benue River Transit Staging',
    ],
    contactActionText: 'Inquire on Benue Agro-Offtake',
    linkedFarmId: 'farm-3',
  },
  {
    id: 'abeokuta-ogun',
    name: 'Ogun Horticultural Greenhouse Nucleus',
    city: 'Abeokuta',
    state: 'Ogun State',
    category: 'commercial',
    badgeText: 'High-Tech Greenhouse Horticultural Estate',
    coordinates: { x: 13.5, y: 70.2 },
    ecologicalZone: 'Rainforest Agricultural Belt',
    partnerInstitutions: 'NIHORT South-West Regional Cluster',
    description:
      'High-tech climate-controlled Dutch greenhouse facility delivering pesticide-free gourmet beef tomatoes, colorful sweet bell peppers, and fresh table eggs to Lagos retail and supermarket chains.',
    acreage: '120 Hectares (Greenhouse & Orchards)',
    outputCapacity: '1,200 MT Greenhouse Produce & Table Eggs',
    keyCrops: ['Indeterminate Beef Tomatoes', 'Color Bell Peppers', 'Layer Poultry & Table Eggs'],
    highlights: [
      'Computerized Drip Fertigation & Climate Sensors',
      'Zero Chemical Pesticide Biological Pest Controls',
      'Same-Day Cold-Chain Transit to Lagos Retail Outlets',
    ],
    contactActionText: 'Schedule Greenhouse Inspection',
    linkedFarmId: 'farm-2',
  },
  {
    id: 'jos-plateau',
    name: 'Plateau Highland Seed & Potato Station',
    city: 'Jos',
    state: 'Plateau State',
    category: 'institution',
    badgeText: 'Highland Research Station',
    coordinates: { x: 52.0, y: 42.0 },
    ecologicalZone: 'Jos Highland Sub-Temperate Plateau',
    partnerInstitutions: 'National Root Crops Research Station & Highland Agronomists',
    description:
      'Harnessing the temperate high-altitude microclimate of the Jos Plateau for disease-free Irish seed potato multiplication, exotic brassicas, and cold-climate grain testing.',
    outputCapacity: 'Aeroponic Seed Potato Multiplication',
    keyCrops: ['Certified Irish Seed Potato', 'Temperate Vegetables', 'Specialty Grains'],
    highlights: [
      'Highland Cold-Climate Agronomy Testing',
      'Aeroponic Disease-Free Seed Potato Production',
      'Year-Round Organic Soil Compost Enrichment',
    ],
    contactActionText: 'Inquire on Highland Trials',
  },
];

interface NigeriaMapSectionProps {
  farms?: Farm[];
  onSelectFarm?: (farm: Farm) => void;
  onOpenPartnerModal?: () => void;
  onNavigate?: (tab: string) => void;
}

export const NigeriaMapSection: React.FC<NigeriaMapSectionProps> = ({
  farms = [],
  onSelectFarm,
  onOpenPartnerModal,
  onNavigate,
}) => {
  const [selectedLocationId, setSelectedLocationId] = useState<string>('kaduna-hub');
  const [filterCategory, setFilterCategory] = useState<'all' | 'flagship' | 'institution' | 'commercial'>('all');
  const [mapStyle, setMapStyle] = useState<'relief' | 'vector'>('relief');

  const activeLocation =
    STRATEGIC_LOCATIONS.find((loc) => loc.id === selectedLocationId) || STRATEGIC_LOCATIONS[0];

  const filteredLocations = STRATEGIC_LOCATIONS.filter((loc) => {
    if (filterCategory === 'all') return true;
    if (filterCategory === 'flagship') return loc.category === 'flagship';
    if (filterCategory === 'institution') return loc.category === 'institution';
    if (filterCategory === 'commercial') return loc.category === 'commercial' || loc.category === 'flagship';
    return true;
  });

  const handleActionClick = () => {
    if (activeLocation.linkedFarmId && onSelectFarm && farms.length > 0) {
      const matchedFarm = farms.find((f) => f.id === activeLocation.linkedFarmId);
      if (matchedFarm) {
        onSelectFarm(matchedFarm);
        return;
      }
    }
    if (onOpenPartnerModal) {
      onOpenPartnerModal();
    } else {
      window.open(
        `https://wa.me/2348139487363?text=Hello%20Greenvest%20Farms,%20I%20would%20like%20to%20inquire%20about%20your%20operations%20and%20institutional%20partnerships%20in%20${encodeURIComponent(
          activeLocation.city + ', ' + activeLocation.state
        )}.`,
        '_blank'
      );
    }
  };

  return (
    <div className="bg-[#FDFCF7] border border-[#2E8B57]/20 rounded-3xl p-5 sm:p-10 my-10 overflow-hidden shadow-sm space-y-8">
      {/* Header with Explanatory Breadcrumb & Badges */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-neutral-200">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#075E2B]/10 text-[#075E2B] text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-[#075E2B]" />
            <span>Strategic Geographical Presence</span>
          </div>

          <h2 className="font-serif-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#075E2B] leading-tight">
            Nigeria Agricultural Corridors & Institutional Alliances
          </h2>

          <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed font-normal">
            Anchored by our premier <strong className="text-[#075E2B] font-bold">Kaduna Commercial Hub</strong> in the northern grain savannah, Greenvest Farms intentionally partners with Nigeria’s foremost agricultural institutes across diverse agro-ecological zones—from crop genetics in <strong>Ibadan</strong> and mechanization in <strong>Ilorin</strong> to policy in <strong>Abuja</strong> and marine aquaculture in <strong>Lagos</strong>.
          </p>
        </div>

        {/* View Toggle (Satellite Relief vs Cartographic Vector) */}
        <div className="flex items-center gap-2 bg-neutral-100 p-1.5 rounded-2xl border border-neutral-200 shrink-0 self-start lg:self-auto">
          <button
            type="button"
            onClick={() => setMapStyle('relief')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              mapStyle === 'relief'
                ? 'bg-[#075E2B] text-white shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-[#F4B400]" />
            <span>Real Geographic Relief Map</span>
          </button>
          <button
            type="button"
            onClick={() => setMapStyle('vector')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              mapStyle === 'vector'
                ? 'bg-[#075E2B] text-white shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-[#F4B400]" />
            <span>Agro-Ecological Vector</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setFilterCategory('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              filterCategory === 'all'
                ? 'bg-[#075E2B] text-white shadow-xs'
                : 'bg-white text-neutral-700 border border-neutral-200 hover:bg-neutral-50'
            }`}
          >
            <span>All Corridors ({STRATEGIC_LOCATIONS.length})</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setFilterCategory('flagship');
              setSelectedLocationId('kaduna-hub');
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              filterCategory === 'flagship'
                ? 'bg-[#075E2B] text-white shadow-xs'
                : 'bg-white text-neutral-700 border border-neutral-200 hover:bg-neutral-50'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#F4B400] animate-pulse" />
            <span>Kaduna Hub (Primary Center)</span>
          </button>

          <button
            type="button"
            onClick={() => setFilterCategory('institution')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              filterCategory === 'institution'
                ? 'bg-[#075E2B] text-white shadow-xs'
                : 'bg-white text-neutral-700 border border-neutral-200 hover:bg-neutral-50'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-[#2E8B57]" />
            <span>Institutional Research Partners ({STRATEGIC_LOCATIONS.filter(l => l.category === 'institution').length})</span>
          </button>

          <button
            type="button"
            onClick={() => setFilterCategory('commercial')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              filterCategory === 'commercial'
                ? 'bg-[#075E2B] text-white shadow-xs'
                : 'bg-white text-neutral-700 border border-neutral-200 hover:bg-neutral-50'
            }`}
          >
            <Tractor className="w-3.5 h-3.5 text-[#075E2B]" />
            <span>Commercial Farm Estates & Hubs ({STRATEGIC_LOCATIONS.filter(l => l.category !== 'institution').length})</span>
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-4 text-xs font-semibold text-neutral-500">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#F4B400] border-2 border-white shadow-xs" />
            <span>Kaduna Flagship Hub</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#075E2B] border-2 border-white shadow-xs" />
            <span>Institutional Partner Cities</span>
          </span>
        </div>
      </div>

      {/* Main Grid: Interactive Map + Selected Detail Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Real Nigeria Map Canvas */}
        <div className="lg:col-span-7 bg-[#EFECE1] rounded-3xl p-3 sm:p-5 border-2 border-[#2E8B57]/20 relative shadow-inner overflow-hidden min-h-[460px] flex flex-col justify-between">
          {/* Map Surface Container */}
          <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-neutral-900 shadow-md border border-neutral-300/80">
            {/* 1. REAL RELIEF MAP MODE */}
            {mapStyle === 'relief' ? (
              <div className="absolute inset-0 select-none">
                <img
                  src={NIGERIA_RELIEF_MAP_IMAGE}
                  alt="Real Topographic and Satellite Relief Map of Nigeria showing rivers, savannahs, and agricultural belts"
                  className="w-full h-full object-cover object-center filter saturate-110 contrast-105"
                />
                {/* Subtle vignette scrim to emphasize pins and state boundaries */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-black/35 pointer-events-none" />

                {/* Real Geographic Labels */}
                <div className="absolute top-3 left-4 text-[10px] font-mono tracking-widest text-white/90 uppercase font-bold bg-black/50 px-2 py-0.5 rounded backdrop-blur-xs pointer-events-none">
                  Federal Republic of Nigeria
                </div>
                <div className="absolute bottom-3 left-4 text-[9px] font-mono tracking-wider text-white/70 uppercase pointer-events-none">
                  Gulf of Guinea · Bight of Benin
                </div>
                <div className="absolute top-3 right-4 text-[9px] font-mono tracking-wider text-emerald-300 uppercase pointer-events-none">
                  Lake Chad Basin
                </div>

                {/* River Confluence Callout (Lokoja) */}
                <div className="absolute left-[37%] top-[62%] -translate-y-1/2 pointer-events-none hidden sm:flex items-center gap-1 bg-black/40 px-2 py-0.5 rounded-full backdrop-blur-xs border border-white/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  <span className="text-[9px] font-bold text-cyan-200">Niger-Benue Confluence (Lokoja)</span>
                </div>
              </div>
            ) : (
              /* 2. AGRO-ECOLOGICAL VECTOR MAP MODE */
              <div className="absolute inset-0 bg-[#0c2415] select-none p-2 flex items-center justify-center">
                <svg
                  viewBox="0 0 500 400"
                  className="w-full h-full drop-shadow-lg"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <linearGradient id="savannahGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#8C7A3E" stopOpacity="0.4" />
                      <stop offset="50%" stopColor="#2E8B57" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#075E2B" stopOpacity="0.6" />
                    </linearGradient>
                  </defs>

                  {/* Geographically accurate contour of Nigeria */}
                  <path
                    d="M 75,55 
                       C 110,35 170,30 220,38 
                       C 270,45 340,32 390,45 
                       C 435,55 470,45 480,55 
                       C 475,85 450,135 440,175 
                       C 430,210 400,240 375,275 
                       C 355,300 340,335 320,345 
                       C 290,355 260,350 230,352 
                       C 195,355 160,345 130,325 
                       C 95,305 68,310 50,312 
                       C 42,275 55,230 52,190 
                       C 50,150 62,95 75,55 Z"
                    fill="url(#savannahGrad)"
                    stroke="#7CB342"
                    strokeWidth="2.5"
                    className="filter drop-shadow"
                  />

                  {/* Northern Sudan / Sahel Zone */}
                  <path
                    d="M 75,55 Q 260,50 480,55 Q 460,110 390,110 Q 230,95 70,105 Z"
                    fill="#D4A373"
                    fillOpacity="0.15"
                  />

                  {/* River Niger Pathway */}
                  <path
                    d="M 72,110 Q 110,150 135,185 T 195,248"
                    stroke="#38BDF8"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    className="opacity-80"
                  />
                  {/* River Benue Pathway */}
                  <path
                    d="M 435,210 Q 340,230 260,250 T 195,248"
                    stroke="#38BDF8"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    className="opacity-80"
                  />
                  {/* Lower Niger to Delta */}
                  <path
                    d="M 195,248 Q 210,290 220,345"
                    stroke="#38BDF8"
                    strokeWidth="4"
                    strokeLinecap="round"
                    className="opacity-90"
                  />

                  {/* Labels on SVG */}
                  <text x="90" y="80" fill="#F4B400" fontSize="9" fontWeight="bold" opacity="0.8">
                    NORTHERN SAVANNAH GRAIN BELT
                  </text>
                  <text x="210" y="242" fill="#BAE6FD" fontSize="8" fontWeight="bold">
                    Lokoja Confluence
                  </text>
                  <text x="135" y="375" fill="#94A3B8" fontSize="8" letterSpacing="2">
                    GULF OF GUINEA / NIGER DELTA
                  </text>
                </svg>
              </div>
            )}

            {/* PINS OVERLAY (Geographically calibrated percentages across Nigeria) */}
            {filteredLocations.map((loc) => {
              const isSelected = loc.id === selectedLocationId;
              const isKadunaFlagship = loc.id === 'kaduna-hub';

              return (
                <div
                  key={loc.id}
                  style={{
                    left: `${loc.coordinates.x}%`,
                    top: `${loc.coordinates.y}%`,
                  }}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20 group"
                >
                  {/* Pulsing Radar Ring for Kaduna Hub and Selected Pin */}
                  {(isKadunaFlagship || isSelected) && (
                    <span
                      className={`absolute -inset-3 rounded-full animate-ping pointer-events-none opacity-75 ${
                        isKadunaFlagship ? 'bg-[#F4B400]' : 'bg-emerald-400'
                      }`}
                    />
                  )}

                  {/* Clickable Pin Button */}
                  <button
                    type="button"
                    onClick={() => setSelectedLocationId(loc.id)}
                    className={`relative flex items-center justify-center transition-all duration-300 cursor-pointer focus:outline-none ${
                      isSelected
                        ? 'scale-125 z-30'
                        : isKadunaFlagship
                        ? 'scale-115 hover:scale-125 z-25'
                        : 'hover:scale-115 z-20'
                    }`}
                    title={`${loc.name} (${loc.city}, ${loc.state})`}
                  >
                    {/* Outer Badge Ring */}
                    <div
                      className={`rounded-full flex items-center justify-center shadow-2xl border-2 transition-colors ${
                        isKadunaFlagship
                          ? isSelected
                            ? 'w-10 h-10 bg-[#F4B400] text-[#075E2B] border-white ring-4 ring-[#F4B400]/50'
                            : 'w-9 h-9 bg-[#075E2B] text-[#F4B400] border-[#F4B400] ring-2 ring-[#F4B400]/40'
                          : isSelected
                          ? 'w-9 h-9 bg-[#F4B400] text-[#075E2B] border-white ring-4 ring-emerald-500/40'
                          : loc.category === 'institution'
                          ? 'w-7 h-7 bg-[#075E2B] text-white border-white/90 hover:bg-[#2E8B57]'
                          : 'w-7 h-7 bg-[#2E8B57] text-[#F4B400] border-white hover:bg-[#075E2B]'
                      }`}
                    >
                      {isKadunaFlagship ? (
                        <Tractor className="w-5 h-5 fill-current" />
                      ) : loc.category === 'institution' ? (
                        <Building2 className="w-3.5 h-3.5" />
                      ) : (
                        <MapPin className="w-3.5 h-3.5 fill-current" />
                      )}
                    </div>

                    {/* Permanent City Badge for Kaduna and Selected location, or on hover for others */}
                    <div
                      className={`absolute left-1/2 -translate-x-1/2 top-full mt-1.5 whitespace-nowrap px-2 py-0.5 rounded-md text-[10px] font-extrabold shadow-lg transition-all pointer-events-none ${
                        isKadunaFlagship
                          ? 'bg-[#F4B400] text-[#075E2B] ring-1 ring-black/20 block z-40'
                          : isSelected
                          ? 'bg-[#075E2B] text-white ring-1 ring-[#F4B400] block z-40'
                          : 'bg-black/80 text-white backdrop-blur-xs opacity-90 group-hover:opacity-100 group-hover:scale-105'
                      }`}
                    >
                      {loc.city}
                      {isKadunaFlagship && ' ⭐ Hub'}
                    </div>
                  </button>
                </div>
              );
            })}
          </div>

          {/* Map Footer Bar with Legend & Geographic Coordinates */}
          <div className="mt-3 pt-3 border-t border-neutral-300/80 flex flex-wrap items-center justify-between gap-3 text-[11px] text-neutral-600">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 font-bold text-neutral-800">
                <span className="w-2.5 h-2.5 rounded-full bg-[#F4B400] ring-1 ring-black/20" />
                <span>Kaduna Nucleus Hub</span>
              </span>
              <span className="flex items-center gap-1.5 font-semibold text-neutral-700">
                <span className="w-2.5 h-2.5 rounded-full bg-[#075E2B]" />
                <span>Partner Institutes</span>
              </span>
              <span className="flex items-center gap-1.5 font-semibold text-neutral-700">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2E8B57]" />
                <span>Commercial Estates</span>
              </span>
            </div>

            <div className="text-[10px] font-mono text-neutral-500">
              Coordinates: Lat 4°N – 14°N · Lon 3°E – 15°E
            </div>
          </div>
        </div>

        {/* Selected Hub / Partner Institution City Dossier */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border-2 border-neutral-200/90 shadow-lg space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            {/* Top Badges */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span
                className={`text-[11px] font-extrabold px-3 py-1 rounded-full shadow-xs ${
                  activeLocation.category === 'flagship'
                    ? 'bg-[#F4B400] text-[#075E2B]'
                    : activeLocation.category === 'institution'
                    ? 'bg-[#075E2B]/10 text-[#075E2B]'
                    : 'bg-[#2E8B57]/10 text-[#2E8B57]'
                }`}
              >
                {activeLocation.badgeText}
              </span>

              <span className="text-[10px] font-mono font-bold text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-md">
                {activeLocation.ecologicalZone}
              </span>
            </div>

            {/* City & Name Header */}
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#2E8B57]">
                <MapPin className="w-4 h-4 text-[#F4B400] fill-current" />
                <span>
                  {activeLocation.city}, {activeLocation.state}
                </span>
              </div>
              <h3 className="font-serif-display text-2xl sm:text-3xl font-bold text-[#263238] mt-1 leading-snug">
                {activeLocation.name}
              </h3>
            </div>

            {/* Partner Institutions */}
            <div className="bg-[#F7F3E8] p-3.5 rounded-2xl border border-[#2E8B57]/20 space-y-1">
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-[#075E2B] block">
                Partner Agricultural Body / Facility
              </span>
              <p className="text-xs font-bold text-neutral-800 leading-snug">
                {activeLocation.partnerInstitutions}
              </p>
            </div>

            {/* Overview / Description */}
            <p className="text-xs text-neutral-600 leading-relaxed font-normal">
              {activeLocation.description}
            </p>

            {/* Scale / Capacity Metrics */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              {activeLocation.acreage && (
                <div className="bg-neutral-50 p-2.5 rounded-xl border border-neutral-200">
                  <span className="text-[10px] uppercase font-bold text-neutral-400 block">
                    Estate Land Area
                  </span>
                  <span className="text-xs font-extrabold text-[#075E2B]">
                    {activeLocation.acreage}
                  </span>
                </div>
              )}
              {activeLocation.outputCapacity && (
                <div className="bg-neutral-50 p-2.5 rounded-xl border border-neutral-200">
                  <span className="text-[10px] uppercase font-bold text-neutral-400 block">
                    Capacity / Mandate
                  </span>
                  <span className="text-xs font-extrabold text-[#263238]">
                    {activeLocation.outputCapacity}
                  </span>
                </div>
              )}
            </div>

            {/* Key Crops or Commodities */}
            <div>
              <span className="text-[11px] font-bold text-neutral-700 block mb-1.5 uppercase tracking-wide">
                Key Crops & Trial Varieties:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {activeLocation.keyCrops.map((crop, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-neutral-100 text-neutral-700 text-[11px] font-medium border border-neutral-200"
                  >
                    {crop}
                  </span>
                ))}
              </div>
            </div>

            {/* Operational Highlights */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-bold text-neutral-700 block uppercase tracking-wide">
                Agronomic & Tech Infrastructure:
              </span>
              <ul className="space-y-1.5">
                {activeLocation.highlights.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-neutral-600">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#2E8B57] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-4 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleActionClick}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-[#075E2B] hover:bg-[#064e24] text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-all active:scale-95"
            >
              <span>{activeLocation.contactActionText || 'Inquire on This Hub'}</span>
              <ArrowRight className="w-4 h-4 text-[#F4B400]" />
            </button>

            <a
              href={`https://wa.me/2348139487363?text=Hello%20Greenvest%20Farms,%20I%20would%20like%20to%20schedule%20an%20inspection%20or%20partner%20discussion%20regarding%20${encodeURIComponent(
                activeLocation.name + ' (' + activeLocation.city + ')'
              )}.`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-[#075E2B] hover:underline flex items-center gap-1"
            >
              <span>WhatsApp Direct</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
