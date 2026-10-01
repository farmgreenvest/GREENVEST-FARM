import React, { useState } from 'react';
import {
  SiteSettings,
  MediaAsset,
  Farm,
  ServiceItem,
  Product,
  InstitutionalPartner,
  ImpactMetric,
  ProductCategory,
  FarmCategory,
} from '../types/index.ts';
import { GreenvestDB } from '../lib/supabaseClient.ts';
import { ImageUploadField } from '../components/ImageUploadField.tsx';
import { CROP_HARVEST_IMAGE } from '../data/initialData.ts';
import { safeImageSrc } from '../utils/safeImage.ts';
import {
  Save,
  Check,
  RotateCcw,
  Palette,
  Type,
  Layout,
  Globe,
  CheckCircle,
  Image as ImageIcon,
  Sparkles,
  Phone,
  FileText,
  Building2,
  Tractor,
  Layers,
  ShoppingBag,
  TrendingUp,
  HeartHandshake,
  Plus,
  Trash2,
  Edit,
  X,
  MapPin,
  ExternalLink,
  Target,
  Compass,
} from 'lucide-react';

interface AdminWebsiteBuilderProps {
  settings: SiteSettings;
  onSettingsUpdated: (updated: SiteSettings) => void;
  farms?: Farm[];
  onFarmsUpdated?: (farms: Farm[]) => void;
  services?: ServiceItem[];
  onServicesUpdated?: (services: ServiceItem[]) => void;
  products?: Product[];
  onProductsUpdated?: (products: Product[]) => void;
  partners?: InstitutionalPartner[];
  onPartnersUpdated?: (partners: InstitutionalPartner[]) => void;
  impactMetrics?: ImpactMetric[];
  onImpactMetricsUpdated?: (metrics: ImpactMetric[]) => void;
}

export const AdminWebsiteBuilder: React.FC<AdminWebsiteBuilderProps> = ({
  settings,
  onSettingsUpdated,
  farms: propFarms,
  onFarmsUpdated,
  services: propServices,
  onServicesUpdated,
  products: propProducts,
  onProductsUpdated,
  partners: propPartners,
  onPartnersUpdated,
  impactMetrics: propImpact,
  onImpactMetricsUpdated,
}) => {
  const [formData, setFormData] = useState<SiteSettings>({ ...settings });
  const [saved, setSaved] = useState(false);

  // Synchronize form data when settings prop updates
  React.useEffect(() => {
    setFormData({ ...settings });
  }, [settings]);

  // Current active section tab
  const [activeTab, setActiveTab] = useState<
    | 'home'
    | 'about'
    | 'farms'
    | 'services'
    | 'products'
    | 'investment'
    | 'impact'
    | 'typography'
    | 'header_footer'
  >('home');

  // Sub-items data states
  const [partnersList, setPartnersList] = useState<InstitutionalPartner[]>(
    propPartners || GreenvestDB.getInstitutionalPartners()
  );
  const [farmsList, setFarmsList] = useState<Farm[]>(
    propFarms || GreenvestDB.getFarms()
  );
  const [servicesList, setServicesList] = useState<ServiceItem[]>(
    propServices || GreenvestDB.getServices()
  );
  const [productsList, setProductsList] = useState<Product[]>(
    propProducts || GreenvestDB.getProducts()
  );
  const [impactList, setImpactList] = useState<ImpactMetric[]>(
    propImpact || GreenvestDB.getImpactMetrics()
  );

  React.useEffect(() => {
    if (propFarms) setFarmsList(propFarms);
  }, [propFarms]);

  React.useEffect(() => {
    if (propServices) setServicesList(propServices);
  }, [propServices]);

  React.useEffect(() => {
    if (propProducts) setProductsList(propProducts);
  }, [propProducts]);

  React.useEffect(() => {
    if (propPartners) setPartnersList(propPartners);
  }, [propPartners]);

  React.useEffect(() => {
    if (propImpact) setImpactList(propImpact);
  }, [propImpact]);

  // Modals for editing nested items
  const [partnerModalOpen, setPartnerModalOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<InstitutionalPartner | null>(null);

  const [farmModalOpen, setFarmModalOpen] = useState(false);
  const [editingFarm, setEditingFarm] = useState<Farm | null>(null);

  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);

  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Save Settings
  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const updated = GreenvestDB.updateSettings(formData);
    onSettingsUpdated(updated);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleReset = () => {
    if (confirm('Reset form fields to currently saved live settings?')) {
      setFormData({ ...settings });
    }
  };

  // Color preset applicator
  const applyColorPreset = (preset: {
    forest: string;
    agri: string;
    leaf: string;
    gold: string;
    cream: string;
    charcoal: string;
  }) => {
    setFormData((prev) => ({
      ...prev,
      colorForest: preset.forest,
      colorAgri: preset.agri,
      colorLeaf: preset.leaf,
      colorGold: preset.gold,
      colorCream: preset.cream,
      colorCharcoal: preset.charcoal,
      headerBgColor: preset.forest,
      footerBgColor: preset.forest,
    }));
  };

  // ==========================================
  // PARTNER (INSTITUTION LEADERSHIP) ACTIONS
  // ==========================================
  const handleOpenNewPartner = () => {
    setEditingPartner({
      id: 'partner-' + Date.now(),
      acronym: '',
      name: '',
      category: 'Agronomic Research & Trials',
      mandate: '',
      keyInitiatives: [''],
      logo: '',
      badge: 'Research Partner',
      location: 'Nigeria',
      allianceType: 'Institutional Partner',
      yearEstablished: 'Est. 2020',
    });
    setPartnerModalOpen(true);
  };

  const handleSavePartner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPartner) return;

    GreenvestDB.saveInstitutionalPartner(editingPartner);
    const updated = GreenvestDB.getInstitutionalPartners();
    setPartnersList(updated);
    if (onPartnersUpdated) onPartnersUpdated(updated);
    setPartnerModalOpen(false);
    setEditingPartner(null);
  };

  const handleDeletePartner = (id: string) => {
    if (confirm('Remove this agricultural institution partnership?')) {
      GreenvestDB.deleteInstitutionalPartner(id);
      const updated = GreenvestDB.getInstitutionalPartners();
      setPartnersList(updated);
      if (onPartnersUpdated) onPartnersUpdated(updated);
    }
  };

  // ==========================================
  // FARM ACTIONS
  // ==========================================
  const handleOpenNewFarm = () => {
    setEditingFarm({
      id: 'farm-' + Date.now(),
      name: '',
      slug: '',
      location: '',
      state: 'Nigeria',
      type: 'Crop Farming',
      acreage: '1,000 Hectares',
      description: '',
      keyCrops: [''],
      outputStats: '10,000 MT Annual Yield',
      image: '',
      coordinates: { x: 50, y: 50 },
      highlights: [''],
    });
    setFarmModalOpen(true);
  };

  const handleSaveFarm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFarm) return;

    GreenvestDB.saveFarm(editingFarm);
    const updated = GreenvestDB.getFarms();
    setFarmsList(updated);
    if (onFarmsUpdated) onFarmsUpdated(updated);
    setFarmModalOpen(false);
    setEditingFarm(null);
  };

  const handleDeleteFarm = (id: string) => {
    if (confirm('Remove this commercial farm estate?')) {
      GreenvestDB.deleteFarm(id);
      const updated = GreenvestDB.getFarms();
      setFarmsList(updated);
      if (onFarmsUpdated) onFarmsUpdated(updated);
    }
  };

  // ==========================================
  // SERVICE ACTIONS
  // ==========================================
  const handleOpenNewService = () => {
    setEditingService({
      id: 'srv-' + Date.now(),
      title: '',
      slug: '',
      category: 'Agribusiness',
      description: '',
      image: '',
      keyActivities: [''],
      ctaText: 'Explore Service',
    });
    setServiceModalOpen(true);
  };

  const handleSaveService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;

    GreenvestDB.saveService(editingService);
    const updated = GreenvestDB.getServices();
    setServicesList(updated);
    if (onServicesUpdated) onServicesUpdated(updated);
    setServiceModalOpen(false);
    setEditingService(null);
  };

  const handleDeleteService = (id: string) => {
    if (confirm('Delete this service operational unit?')) {
      GreenvestDB.deleteService(id);
      const updated = GreenvestDB.getServices();
      setServicesList(updated);
      if (onServicesUpdated) onServicesUpdated(updated);
    }
  };

  // ==========================================
  // PRODUCT ACTIONS
  // ==========================================
  const handleOpenNewProduct = () => {
    setEditingProduct({
      id: 'prod-' + Date.now(),
      name: '',
      slug: '',
      category: 'Grains',
      description: '',
      price: 25000,
      currency: 'NGN',
      unit: '50kg Bag',
      stock: 500,
      image: CROP_HARVEST_IMAGE,
      featured: true,
      available: true,
      minOrderQty: 1,
    });
    setProductModalOpen(true);
  };

  const handleSaveProduct = (e?: React.FormEvent | React.MouseEvent) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!editingProduct || !editingProduct.name.trim()) return;

    const generatedSlug = (
      (editingProduct.slug && editingProduct.slug.trim()) ||
      editingProduct.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '') ||
      'prod-' + Date.now()
    );

    const cleanProduct: Product = {
      ...editingProduct,
      name: editingProduct.name.trim(),
      slug: generatedSlug,
      category: editingProduct.category || 'Grains',
      description:
        (editingProduct.description && editingProduct.description.trim()) ||
        'Premium commercial harvest produce directly from Greenvest commercial estates.',
      unit: (editingProduct.unit && editingProduct.unit.trim()) || '50kg Bag',
      image:
        editingProduct.image && editingProduct.image.trim()
          ? editingProduct.image.trim()
          : CROP_HARVEST_IMAGE,
      stock: Number(editingProduct.stock || 100),
      currency: 'NGN',
      minOrderQty: 1,
    };

    GreenvestDB.saveProduct(cleanProduct);
    const updated = GreenvestDB.getProducts();
    setProductsList(updated);
    if (onProductsUpdated) onProductsUpdated(updated);
    setProductModalOpen(false);
    setEditingProduct(null);
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('Delete this commodity product from the catalogue?')) {
      GreenvestDB.deleteProduct(id);
      const updated = GreenvestDB.getProducts();
      setProductsList(updated);
      if (onProductsUpdated) onProductsUpdated(updated);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#075E2B]">
            Executive CMS & Multi-Section Site Editor
          </span>
          <h2 className="font-serif-display text-3xl font-bold text-[#263238]">
            Website Sections, Text, Images & Fonts
          </h2>
          <p className="text-xs text-neutral-500">
            Customize Home, About Us, Our Farms, What We Do, Products, Investment, Impact, Typography and Media uploads.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 text-xs font-semibold text-neutral-600 hover:text-neutral-900 border border-neutral-300 rounded-xl hover:bg-neutral-50 flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
          <button
            type="button"
            onClick={() => handleSave()}
            className="px-6 py-2.5 rounded-xl bg-[#075E2B] text-white font-bold text-xs hover:bg-[#064e24] shadow-md flex items-center gap-2 cursor-pointer transition-all active:scale-95"
          >
            {saved ? <Check className="w-4 h-4 text-[#F4B400]" /> : <Save className="w-4 h-4" />}
            <span>{saved ? 'Changes Saved to Live Site!' : 'Save & Publish Live'}</span>
          </button>
        </div>
      </div>

      {saved && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 shadow-xs animate-in fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>All text, image, font, and section modifications have been published live across the site!</span>
        </div>
      )}

      {/* Navigation Tabs for All Site Sections */}
      <div className="flex flex-wrap gap-1.5 p-1.5 bg-neutral-200/70 rounded-2xl w-full">
        <button
          type="button"
          onClick={() => setActiveTab('home')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'home' ? 'bg-[#075E2B] text-white shadow-xs' : 'bg-white text-neutral-700 hover:bg-neutral-50'
          }`}
        >
          <Globe className="w-3.5 h-3.5 text-[#F4B400]" />
          <span>1. Home</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('about')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'about' ? 'bg-[#075E2B] text-white shadow-xs' : 'bg-white text-neutral-700 hover:bg-neutral-50'
          }`}
        >
          <Building2 className="w-3.5 h-3.5 text-[#F4B400]" />
          <span>2. About & Partnerships</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('farms')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'farms' ? 'bg-[#075E2B] text-white shadow-xs' : 'bg-white text-neutral-700 hover:bg-neutral-50'
          }`}
        >
          <Tractor className="w-3.5 h-3.5 text-[#F4B400]" />
          <span>3. Our Farms ({farmsList.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('services')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'services' ? 'bg-[#075E2B] text-white shadow-xs' : 'bg-white text-neutral-700 hover:bg-neutral-50'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-[#F4B400]" />
          <span>4. What We Do ({servicesList.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('products')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'products' ? 'bg-[#075E2B] text-white shadow-xs' : 'bg-white text-neutral-700 hover:bg-neutral-50'
          }`}
        >
          <ShoppingBag className="w-3.5 h-3.5 text-[#F4B400]" />
          <span>5. Products ({productsList.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('investment')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'investment' ? 'bg-[#075E2B] text-white shadow-xs' : 'bg-white text-neutral-700 hover:bg-neutral-50'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5 text-[#F4B400]" />
          <span>6. Investment</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('impact')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'impact' ? 'bg-[#075E2B] text-white shadow-xs' : 'bg-white text-neutral-700 hover:bg-neutral-50'
          }`}
        >
          <HeartHandshake className="w-3.5 h-3.5 text-[#F4B400]" />
          <span>7. Impact</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('typography')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'typography' ? 'bg-[#075E2B] text-white shadow-xs' : 'bg-white text-neutral-700 hover:bg-neutral-50'
          }`}
        >
          <Type className="w-3.5 h-3.5 text-[#F4B400]" />
          <span>8. Typography & Fonts</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('header_footer')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'header_footer' ? 'bg-[#075E2B] text-white shadow-xs' : 'bg-white text-neutral-700 hover:bg-neutral-50'
          }`}
        >
          <Layout className="w-3.5 h-3.5 text-[#F4B400]" />
          <span>9. Header & Footer</span>
        </button>
      </div>

      {/* TAB CONTENT AREA */}
      <form onSubmit={(e) => handleSave(e)} className="space-y-6">
        {/* ========================================================= */}
        {/* 1. HOME SECTION */}
        {/* ========================================================= */}
        {activeTab === 'home' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-xs space-y-6">
            <div className="border-b border-neutral-100 pb-4">
              <h3 className="font-serif-display text-2xl font-bold text-[#075E2B]">
                Home Page – Hero, Headlines & Visual Imagery
              </h3>
              <p className="text-xs text-neutral-500">
                Control the main hero banner, headline copy, promotional callouts, and background visual.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Hero Eyebrow Tag
                  </label>
                  <input
                    type="text"
                    value={formData.heroEyebrow || ''}
                    onChange={(e) => setFormData({ ...formData, heroEyebrow: e.target.value })}
                    placeholder="Africa’s Premier Institutional Agribusiness"
                    className="w-full px-3.5 py-2 text-xs border border-neutral-300 rounded-xl focus:ring-2 focus:ring-[#075E2B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Hero Main Headline *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={formData.heroHeadline}
                    onChange={(e) => setFormData({ ...formData, heroHeadline: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs border border-neutral-300 rounded-xl focus:ring-2 focus:ring-[#075E2B] font-serif-display text-base"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Hero Subtitle / Description *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={formData.heroSubtext}
                    onChange={(e) => setFormData({ ...formData, heroSubtext: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs border border-neutral-300 rounded-xl focus:ring-2 focus:ring-[#075E2B]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      Primary CTA Button
                    </label>
                    <input
                      type="text"
                      value={formData.heroCta1Text}
                      onChange={(e) => setFormData({ ...formData, heroCta1Text: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs border border-neutral-300 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      Secondary CTA Button
                    </label>
                    <input
                      type="text"
                      value={formData.heroCta2Text}
                      onChange={(e) => setFormData({ ...formData, heroCta2Text: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs border border-neutral-300 rounded-xl"
                    />
                  </div>
                </div>
              </div>

              {/* Hero Image Upload with ImageUploadField */}
              <div className="bg-neutral-50 p-5 rounded-2xl border border-neutral-200 space-y-4">
                <ImageUploadField
                  label="Hero Background Image"
                  value={formData.heroImage}
                  onChange={(newUrl) => setFormData({ ...formData, heroImage: newUrl })}
                  helperText="Upload any high-res farm, harvest, or agribusiness photograph directly from your computer, choose from media library, or enter a URL."
                  category="Estate Banners"
                  recommendedAspect="16:9 Cinematic Widescreen"
                />
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* 2. ABOUT US & INSTITUTIONAL PARTNERSHIPS SECTION */}
        {/* ========================================================= */}
        {activeTab === 'about' && (
          <div className="space-y-8">
            {/* Core About Info */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-xs space-y-6">
              <div className="border-b border-neutral-100 pb-4">
                <h3 className="font-serif-display text-2xl font-bold text-[#075E2B]">
                  About Us – Manifesto, Vision, Mission & Approach
                </h3>
                <p className="text-xs text-neutral-500">
                  Update the corporate agribusiness manifesto, vision statement, mission, and operational commitments.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      About Headline *
                    </label>
                    <textarea
                      rows={2}
                      required
                      value={formData.aboutHeadline}
                      onChange={(e) => setFormData({ ...formData, aboutHeadline: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs border border-neutral-300 rounded-xl focus:ring-2 focus:ring-[#075E2B]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      About Paragraph / Manifesto *
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={formData.aboutDescription}
                      onChange={(e) => setFormData({ ...formData, aboutDescription: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs border border-neutral-300 rounded-xl focus:ring-2 focus:ring-[#075E2B]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">
                        Our Vision Text
                      </label>
                      <textarea
                        rows={4}
                        value={formData.visionText}
                        onChange={(e) => setFormData({ ...formData, visionText: e.target.value })}
                        className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">
                        Our Mission Text
                      </label>
                      <textarea
                        rows={4}
                        value={formData.missionText}
                        onChange={(e) => setFormData({ ...formData, missionText: e.target.value })}
                        className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-xl"
                      />
                    </div>
                  </div>
                </div>

                {/* About Imagery */}
                <div className="space-y-4">
                  <ImageUploadField
                    label="About Section Featured Image"
                    value={formData.aboutImage}
                    onChange={(url) => setFormData({ ...formData, aboutImage: url })}
                    helperText="Appears on the About Us manifesto and corporate overview section."
                    category="Field Operations"
                    recommendedAspect="4:3 or 16:9 Landscape"
                  />

                  <ImageUploadField
                    label="Approach & Industrial Scale Facility Image"
                    value={formData.approachImage || formData.aboutImage}
                    onChange={(url) => setFormData({ ...formData, approachImage: url })}
                    helperText="Appears next to the Greenvest Standard operational approach and commitments."
                    category="Processing & Facilities"
                    recommendedAspect="4:3 Standard"
                  />
                </div>
              </div>
            </div>

            {/* INSTITUTION LEADERSHIP -> PARTNERSHIP WITH AGRICULTURAL INSTITUTIONS IN BLOCK FORMATS */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#075E2B]/30 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 pb-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#075E2B]/10 text-[#075E2B] text-[11px] font-bold">
                    <Building2 className="w-3.5 h-3.5 text-[#F4B400]" />
                    <span>Special Feature Requirement</span>
                  </div>
                  <h3 className="font-serif-display text-2xl font-bold text-[#075E2B] mt-1">
                    Institutional Partnerships with Agricultural Institutes (Block Formats)
                  </h3>
                  <p className="text-xs text-neutral-500">
                    Manage the agricultural institutions, research genebanks, mechanization bodies, and agronomy alliances displayed in block format.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleOpenNewPartner}
                  className="px-4 py-2.5 rounded-xl bg-[#075E2B] hover:bg-[#064e24] text-white font-bold text-xs flex items-center gap-2 shadow-sm cursor-pointer shrink-0"
                >
                  <Plus className="w-4 h-4 text-[#F4B400]" />
                  <span>Add Agricultural Institution</span>
                </button>
              </div>

              {/* Section Headers Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-[#F7F3E8]/70 p-4 rounded-2xl border border-neutral-200/80">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Section Badge Text
                  </label>
                  <input
                    type="text"
                    value={formData.partnersSectionBadge || ''}
                    onChange={(e) => setFormData({ ...formData, partnersSectionBadge: e.target.value })}
                    placeholder="Institutional Leadership & Research Alliances"
                    className="w-full px-3 py-1.5 text-xs border border-neutral-300 rounded-xl bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Section Title *
                  </label>
                  <input
                    type="text"
                    value={formData.partnersSectionTitle || ''}
                    onChange={(e) => setFormData({ ...formData, partnersSectionTitle: e.target.value })}
                    placeholder="Institutional Partnerships with Leading Agricultural Institutes"
                    className="w-full px-3 py-1.5 text-xs border border-neutral-300 rounded-xl bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Section Subtitle / Description
                  </label>
                  <input
                    type="text"
                    value={formData.partnersSectionSubtext || ''}
                    onChange={(e) => setFormData({ ...formData, partnersSectionSubtext: e.target.value })}
                    placeholder="Greenvest Farms collaborates closely with leading African and global agricultural research institutes..."
                    className="w-full px-3 py-1.5 text-xs border border-neutral-300 rounded-xl bg-white"
                  />
                </div>
              </div>

              {/* Live Block Formats Preview & Management Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {partnersList.map((partner) => (
                  <div
                    key={partner.id}
                    className="bg-[#FDFCF7] rounded-2xl border-2 border-neutral-200 overflow-hidden flex flex-col justify-between p-4 space-y-3 hover:border-[#075E2B] transition-colors"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="px-2.5 py-1 bg-[#075E2B] text-white rounded-lg font-bold font-serif-display text-xs">
                          {partner.acronym}
                        </span>
                        <span className="text-[10px] font-mono text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded">
                          {partner.yearEstablished || 'Active'}
                        </span>
                      </div>

                      <h4 className="font-bold text-xs text-neutral-900 leading-tight">
                        {partner.name}
                      </h4>
                      <span className="text-[10px] font-semibold text-[#2E8B57] block mt-0.5">
                        {partner.category}
                      </span>

                      {safeImageSrc(partner.logo) && (
                        <div className="h-20 rounded-lg overflow-hidden my-2 bg-neutral-100 border">
                          <img
                            src={safeImageSrc(partner.logo)!}
                            alt={partner.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      <p className="text-[11px] text-neutral-600 line-clamp-3 bg-white p-2 rounded-lg border border-neutral-200/60 mt-2">
                        {partner.mandate}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-neutral-200 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingPartner({ ...partner });
                          setPartnerModalOpen(true);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-neutral-100 hover:bg-[#075E2B] hover:text-white text-neutral-700 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Edit className="w-3 h-3" />
                        <span>Edit Block</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeletePartner(partner.id)}
                        className="p-1 rounded-lg text-neutral-400 hover:text-red-600 hover:bg-red-50 cursor-pointer transition-colors"
                        title="Delete institution"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* 3. OUR FARMS SECTION */}
        {/* ========================================================= */}
        {activeTab === 'farms' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 pb-4">
                <div>
                  <h3 className="font-serif-display text-2xl font-bold text-[#075E2B]">
                    Our Commercial Farms & Nucleus Estates
                  </h3>
                  <p className="text-xs text-neutral-500">
                    Edit farm estate page headline, subtext, banner image, and manage all commercial farm clusters.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleOpenNewFarm}
                  className="px-4 py-2.5 rounded-xl bg-[#075E2B] hover:bg-[#064e24] text-white font-bold text-xs flex items-center gap-2 shadow-sm cursor-pointer shrink-0"
                >
                  <Plus className="w-4 h-4 text-[#F4B400]" />
                  <span>Add Commercial Farm</span>
                </button>
              </div>

              {/* Page Headlines & Banner */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-neutral-50 p-5 rounded-2xl border border-neutral-200">
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      Farms Page Eyebrow
                    </label>
                    <input
                      type="text"
                      value={formData.farmsEyebrow || ''}
                      onChange={(e) => setFormData({ ...formData, farmsEyebrow: e.target.value })}
                      placeholder="Continental Production Assets"
                      className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-xl bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      Farms Page Headline *
                    </label>
                    <input
                      type="text"
                      value={formData.farmsHeadline || ''}
                      onChange={(e) => setFormData({ ...formData, farmsHeadline: e.target.value })}
                      placeholder="Our Commercial Farm Estates"
                      className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-xl bg-white font-serif-display text-base"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      Farms Subtext / Overview *
                    </label>
                    <textarea
                      rows={3}
                      value={formData.farmsSubtext || ''}
                      onChange={(e) => setFormData({ ...formData, farmsSubtext: e.target.value })}
                      placeholder="Spanning over 18,500 hectares across multiple agro-ecological corridors..."
                      className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-xl bg-white"
                    />
                  </div>
                </div>

                <div>
                  <ImageUploadField
                    label="Farms Page Featured Hero Banner"
                    value={formData.farmsHeroImage || ''}
                    onChange={(url) => setFormData({ ...formData, farmsHeroImage: url })}
                    helperText="Upload or choose the banner image displayed for the Farms section."
                    category="Estate Banners"
                    recommendedAspect="16:9 Landscape"
                  />
                </div>
              </div>

              {/* Farms List Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                {farmsList.map((farm) => (
                  <div
                    key={farm.id}
                    className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
                  >
                    <div className="h-40 bg-neutral-100 relative overflow-hidden">
                      {safeImageSrc(farm.image) ? (
                        <img
                          src={safeImageSrc(farm.image)!}
                          alt={farm.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-neutral-400">
                          <Tractor className="w-8 h-8 opacity-40" />
                        </div>
                      )}
                      <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-md bg-[#075E2B] text-white text-[10px] font-bold shadow-xs">
                        {farm.type}
                      </span>
                      <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/70 text-[#F4B400] text-[10px] font-mono font-bold">
                        {farm.acreage}
                      </span>
                    </div>

                    <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-serif-display font-bold text-base text-neutral-900">
                          {farm.name}
                        </h4>
                        <div className="flex items-center gap-1 text-[11px] text-neutral-500">
                          <MapPin className="w-3 h-3 text-[#2E8B57]" />
                          <span>{farm.location}, {farm.state}</span>
                        </div>
                        <p className="text-xs text-neutral-600 line-clamp-2 mt-2">
                          {farm.description}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-[#075E2B]">
                          {farm.outputStats}
                        </span>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingFarm({ ...farm });
                              setFarmModalOpen(true);
                            }}
                            className="p-1.5 text-neutral-600 hover:text-[#075E2B] hover:bg-neutral-100 rounded-lg cursor-pointer"
                            title="Edit farm"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteFarm(farm.id)}
                            className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                            title="Delete farm"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* 4. WHAT WE DO (SERVICES) SECTION */}
        {/* ========================================================= */}
        {activeTab === 'services' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 pb-4">
                <div>
                  <h3 className="font-serif-display text-2xl font-bold text-[#075E2B]">
                    What We Do – Operational Capabilities & Value-Chain
                  </h3>
                  <p className="text-xs text-neutral-500">
                    Edit section headers, service offerings, operational activities, and service photos.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleOpenNewService}
                  className="px-4 py-2.5 rounded-xl bg-[#075E2B] hover:bg-[#064e24] text-white font-bold text-xs flex items-center gap-2 shadow-sm cursor-pointer shrink-0"
                >
                  <Plus className="w-4 h-4 text-[#F4B400]" />
                  <span>Add Service Capability</span>
                </button>
              </div>

              {/* Section Texts & Banner */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-neutral-50 p-5 rounded-2xl border border-neutral-200">
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      Services Eyebrow
                    </label>
                    <input
                      type="text"
                      value={formData.servicesEyebrow || ''}
                      onChange={(e) => setFormData({ ...formData, servicesEyebrow: e.target.value })}
                      placeholder="Operational Capabilities"
                      className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-xl bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      Services Headline *
                    </label>
                    <input
                      type="text"
                      value={formData.servicesHeadline || ''}
                      onChange={(e) => setFormData({ ...formData, servicesHeadline: e.target.value })}
                      placeholder="What We Do: Integrated Agribusiness"
                      className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-xl bg-white font-serif-display text-base"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      Services Subtext *
                    </label>
                    <textarea
                      rows={3}
                      value={formData.servicesSubtext || ''}
                      onChange={(e) => setFormData({ ...formData, servicesSubtext: e.target.value })}
                      placeholder="Greenvest Farms operates across the entire agribusiness value chain..."
                      className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-xl bg-white"
                    />
                  </div>
                </div>

                <div>
                  <ImageUploadField
                    label="Services Section Banner Image"
                    value={formData.servicesHeroImage || ''}
                    onChange={(url) => setFormData({ ...formData, servicesHeroImage: url })}
                    helperText="Upload or choose an industrial processing or field operation photograph."
                    category="Processing & Facilities"
                    recommendedAspect="16:9 Landscape"
                  />
                </div>
              </div>

              {/* Services List */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                {servicesList.map((service) => (
                  <div
                    key={service.id}
                    className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
                  >
                    <div className="h-40 bg-neutral-100 relative overflow-hidden">
                      {safeImageSrc(service.image) ? (
                        <img
                          src={safeImageSrc(service.image)!}
                          alt={service.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-neutral-400">
                          <Layers className="w-8 h-8 opacity-40" />
                        </div>
                      )}
                      <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-md bg-[#075E2B] text-white text-[10px] font-bold shadow-xs">
                        {service.category}
                      </span>
                    </div>

                    <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-serif-display font-bold text-base text-neutral-900">
                          {service.title}
                        </h4>
                        <p className="text-xs text-neutral-600 line-clamp-3 mt-1">
                          {service.description}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-[#075E2B] truncate max-w-[150px]">
                          CTA: {service.ctaText}
                        </span>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingService({ ...service });
                              setServiceModalOpen(true);
                            }}
                            className="p-1.5 text-neutral-600 hover:text-[#075E2B] hover:bg-neutral-100 rounded-lg cursor-pointer"
                            title="Edit service"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteService(service.id)}
                            className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                            title="Delete service"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* 5. PRODUCTS SECTION */}
        {/* ========================================================= */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 pb-4">
                <div>
                  <h3 className="font-serif-display text-2xl font-bold text-[#075E2B]">
                    Products & Commodity Catalogue
                  </h3>
                  <p className="text-xs text-neutral-500">
                    Edit catalog titles, banner photography, commodity prices, and upload product photos.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleOpenNewProduct}
                  className="px-4 py-2.5 rounded-xl bg-[#075E2B] hover:bg-[#064e24] text-white font-bold text-xs flex items-center gap-2 shadow-sm cursor-pointer shrink-0"
                >
                  <Plus className="w-4 h-4 text-[#F4B400]" />
                  <span>Add Farm Product</span>
                </button>
              </div>

              {/* Products Page Content & Banner */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-neutral-50 p-5 rounded-2xl border border-neutral-200">
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      Products Eyebrow
                    </label>
                    <input
                      type="text"
                      value={formData.productsEyebrow || ''}
                      onChange={(e) => setFormData({ ...formData, productsEyebrow: e.target.value })}
                      placeholder="Direct Farm Supply Catalogue"
                      className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-xl bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      Products Page Headline *
                    </label>
                    <input
                      type="text"
                      value={formData.productsHeadline || ''}
                      onChange={(e) => setFormData({ ...formData, productsHeadline: e.target.value })}
                      placeholder="Agricultural Products & Commodities"
                      className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-xl bg-white font-serif-display text-base"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      Products Subtext *
                    </label>
                    <textarea
                      rows={3}
                      value={formData.productsSubtext || ''}
                      onChange={(e) => setFormData({ ...formData, productsSubtext: e.target.value })}
                      placeholder="Wholesale grains, fresh greenhouse produce, premium table fish..."
                      className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-xl bg-white"
                    />
                  </div>
                </div>

                <div>
                  <ImageUploadField
                    label="Products Banner Image"
                    value={formData.productsBannerImage || ''}
                    onChange={(url) => setFormData({ ...formData, productsBannerImage: url })}
                    helperText="Upload or choose an image for the products catalogue banner."
                    category="Products"
                    recommendedAspect="16:9 Landscape"
                  />
                </div>
              </div>

              {/* Products Grid with Image Upload */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                {productsList.map((prod) => (
                  <div
                    key={prod.id}
                    className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
                  >
                    <div className="h-36 bg-neutral-100 relative overflow-hidden">
                      {safeImageSrc(prod.image) ? (
                        <img
                          src={safeImageSrc(prod.image)!}
                          alt={prod.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-neutral-400">
                          <ShoppingBag className="w-8 h-8 opacity-40" />
                        </div>
                      )}
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-[#075E2B] text-white text-[10px] font-bold">
                        {prod.category}
                      </span>
                    </div>

                    <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-bold text-xs text-neutral-900 truncate">
                          {prod.name}
                        </h4>
                        <span className="text-[11px] text-neutral-500 font-mono">
                          Unit: {prod.unit}
                        </span>
                        <div className="font-extrabold text-sm text-[#075E2B] mt-1">
                          {prod.price !== null ? `₦${prod.price.toLocaleString()}` : 'Price on Request'}
                        </div>
                      </div>

                      <div className="pt-2 border-t border-neutral-100 flex items-center justify-between">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${prod.available ? 'bg-emerald-100 text-emerald-800' : 'bg-neutral-100 text-neutral-500'}`}>
                          {prod.available ? 'In Stock' : 'Unavailable'}
                        </span>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingProduct({ ...prod });
                              setProductModalOpen(true);
                            }}
                            className="p-1 text-neutral-600 hover:text-[#075E2B] rounded cursor-pointer"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteProduct(prod.id)}
                            className="p-1 text-neutral-400 hover:text-red-600 rounded cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* 6. INVESTMENT SECTION */}
        {/* ========================================================= */}
        {activeTab === 'investment' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-xs space-y-6">
            <div className="border-b border-neutral-100 pb-4">
              <h3 className="font-serif-display text-2xl font-bold text-[#075E2B]">
                Investment Page – Institutional Models, Headlines & CTA
              </h3>
              <p className="text-xs text-neutral-500">
                Update the investment value proposition, capital deployment models, and prospectus requests.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Investment Eyebrow
                  </label>
                  <input
                    type="text"
                    value={formData.investmentEyebrow || ''}
                    onChange={(e) => setFormData({ ...formData, investmentEyebrow: e.target.value })}
                    placeholder="Institutional Agricultural Investment"
                    className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Investment Headline *
                  </label>
                  <input
                    type="text"
                    value={formData.investmentHeadline || ''}
                    onChange={(e) => setFormData({ ...formData, investmentHeadline: e.target.value })}
                    placeholder="Invest in the Future of Food."
                    className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-xl font-serif-display text-base"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Investment Subtext *
                  </label>
                  <textarea
                    rows={3}
                    value={formData.investmentSubtext || ''}
                    onChange={(e) => setFormData({ ...formData, investmentSubtext: e.target.value })}
                    placeholder="Deploying disciplined capital into mechanized production..."
                    className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Prospectus CTA Button Label
                  </label>
                  <input
                    type="text"
                    value={formData.investmentCtaText || ''}
                    onChange={(e) => setFormData({ ...formData, investmentCtaText: e.target.value })}
                    placeholder="Request Institutional Brief"
                    className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <ImageUploadField
                  label="Investment Page Hero Image"
                  value={formData.investmentHeroImage || formData.heroImage}
                  onChange={(url) => setFormData({ ...formData, investmentHeroImage: url })}
                  helperText="Upload or select an asset-backed farmland photo for the investment page."
                  category="Estate Banners"
                  recommendedAspect="16:9 Landscape"
                />
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* 7. IMPACT SECTION */}
        {/* ========================================================= */}
        {activeTab === 'impact' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-xs space-y-6">
            <div className="border-b border-neutral-100 pb-4">
              <h3 className="font-serif-display text-2xl font-bold text-[#075E2B]">
                Impact Page – Social & Environmental Audited Telemetry
              </h3>
              <p className="text-xs text-neutral-500">
                Update the impact headlines, ESG narratives, and live audited metric targets.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Impact Eyebrow
                  </label>
                  <input
                    type="text"
                    value={formData.impactEyebrow || ''}
                    onChange={(e) => setFormData({ ...formData, impactEyebrow: e.target.value })}
                    placeholder="Sustainability & ESG Commitment"
                    className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Impact Headline *
                  </label>
                  <input
                    type="text"
                    value={formData.impactHeadline || ''}
                    onChange={(e) => setFormData({ ...formData, impactHeadline: e.target.value })}
                    placeholder="Cultivating Enduring Value Across Africa"
                    className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-xl font-serif-display text-base"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Impact Subtext *
                  </label>
                  <textarea
                    rows={3}
                    value={formData.impactSubtext || ''}
                    onChange={(e) => setFormData({ ...formData, impactSubtext: e.target.value })}
                    placeholder="Our ESG and sustainability framework proves that large-scale agribusiness..."
                    className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-xl"
                  />
                </div>

                {/* Audited Key Numbers */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      Total Hectares Managed
                    </label>
                    <input
                      type="text"
                      value={formData.totalHectaresManaged}
                      onChange={(e) => setFormData({ ...formData, totalHectaresManaged: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs border border-neutral-300 rounded-xl font-bold text-[#075E2B]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      Food Produced (Tonnes)
                    </label>
                    <input
                      type="text"
                      value={formData.foodProducedTonnes}
                      onChange={(e) => setFormData({ ...formData, foodProducedTonnes: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs border border-neutral-300 rounded-xl font-bold text-[#075E2B]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      Outgrowers Supported
                    </label>
                    <input
                      type="text"
                      value={formData.smallholdersSupported}
                      onChange={(e) => setFormData({ ...formData, smallholdersSupported: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs border border-neutral-300 rounded-xl font-bold text-[#075E2B]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      Rural Jobs Created
                    </label>
                    <input
                      type="text"
                      value={formData.jobsCreated}
                      onChange={(e) => setFormData({ ...formData, jobsCreated: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs border border-neutral-300 rounded-xl font-bold text-[#075E2B]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <ImageUploadField
                  label="Impact Section Hero Image"
                  value={formData.impactHeroImage || formData.aboutImage}
                  onChange={(url) => setFormData({ ...formData, impactHeroImage: url })}
                  helperText="Upload or choose a community or field agronomists photograph."
                  category="Field Operations"
                  recommendedAspect="16:9 Landscape"
                />
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* 8. TYPOGRAPHY & GLOBAL FONTS */}
        {/* ========================================================= */}
        {activeTab === 'typography' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-xs space-y-6">
            <div className="border-b border-neutral-100 pb-4">
              <h3 className="font-serif-display text-2xl font-bold text-[#075E2B]">
                Typography, Headings & Body Fonts Customizer
              </h3>
              <p className="text-xs text-neutral-500">
                Select Google Fonts for all headings, display titles, and body paragraphs across the entire website.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Headings & Display Font (H1, H2, H3, Cards)
                  </label>
                  <select
                    value={formData.headingFont}
                    onChange={(e) => setFormData({ ...formData, headingFont: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs border border-neutral-300 rounded-xl bg-white focus:ring-2 focus:ring-[#075E2B] font-bold"
                  >
                    <option value="Cormorant Garamond">Cormorant Garamond (Default Regal Serif)</option>
                    <option value="Playfair Display">Playfair Display (Editorial High-Fashion Serif)</option>
                    <option value="Cinzel">Cinzel (Classical Dignified Roman Serif)</option>
                    <option value="Merriweather">Merriweather (Sturdy Traditional Serif)</option>
                    <option value="Lora">Lora (Contemporary Literary Serif)</option>
                    <option value="Plus Jakarta Sans">Plus Jakarta Sans (Ultra-Clean Modern Sans)</option>
                    <option value="Outfit">Outfit (Geometric Tech Sans)</option>
                    <option value="Montserrat">Montserrat (Architectural Bold Sans)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Body & Paragraph Font
                  </label>
                  <select
                    value={formData.bodyFont}
                    onChange={(e) => setFormData({ ...formData, bodyFont: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs border border-neutral-300 rounded-xl bg-white focus:ring-2 focus:ring-[#075E2B]"
                  >
                    <option value="Plus Jakarta Sans">Plus Jakarta Sans (Clean Modern Agribusiness Sans)</option>
                    <option value="Inter">Inter (High-Legibility Swiss Sans)</option>
                    <option value="Roboto">Roboto (Crisp Universal Sans)</option>
                    <option value="Lato">Lato (Warm Friendly Sans)</option>
                    <option value="Georgia">Georgia (Warm Organic Serif)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Heading Size Scaler
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['normal', 'large', 'extralarge'] as const).map((scale) => (
                      <button
                        key={scale}
                        type="button"
                        onClick={() => setFormData({ ...formData, headingScale: scale })}
                        className={`py-2 px-3 text-xs font-bold rounded-xl border capitalize cursor-pointer transition-colors ${
                          (formData.headingScale || 'normal') === scale
                            ? 'bg-[#075E2B] text-white border-[#075E2B]'
                            : 'bg-neutral-50 text-neutral-700 border-neutral-200'
                        }`}
                      >
                        {scale}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color Palette Themes */}
                <div className="pt-4 border-t border-neutral-100 space-y-3">
                  <span className="text-xs font-bold text-neutral-700 block">
                    Curated Agribusiness Brand Color Palettes
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        applyColorPreset({
                          forest: '#075E2B',
                          agri: '#2E8B57',
                          leaf: '#7CB342',
                          gold: '#F4B400',
                          cream: '#F7F3E8',
                          charcoal: '#263238',
                        })
                      }
                      className="p-2.5 rounded-xl border border-neutral-200 bg-neutral-50 text-left hover:border-[#075E2B] cursor-pointer"
                    >
                      <span className="text-xs font-bold block text-neutral-800">1. Emerald & Harvest Gold</span>
                      <div className="flex gap-1 mt-1.5">
                        <span className="w-4 h-4 rounded-full bg-[#075E2B]" />
                        <span className="w-4 h-4 rounded-full bg-[#2E8B57]" />
                        <span className="w-4 h-4 rounded-full bg-[#7CB342]" />
                        <span className="w-4 h-4 rounded-full bg-[#F4B400]" />
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        applyColorPreset({
                          forest: '#04391F',
                          agri: '#1B6A3E',
                          leaf: '#5D9A3B',
                          gold: '#D97706',
                          cream: '#F5F5DC',
                          charcoal: '#1E293B',
                        })
                      }
                      className="p-2.5 rounded-xl border border-neutral-200 bg-neutral-50 text-left hover:border-[#075E2B] cursor-pointer"
                    >
                      <span className="text-xs font-bold block text-neutral-800">2. Deep Pine & Amber</span>
                      <div className="flex gap-1 mt-1.5">
                        <span className="w-4 h-4 rounded-full bg-[#04391F]" />
                        <span className="w-4 h-4 rounded-full bg-[#1B6A3E]" />
                        <span className="w-4 h-4 rounded-full bg-[#5D9A3B]" />
                        <span className="w-4 h-4 rounded-full bg-[#D97706]" />
                      </div>
                    </button>
                  </div>
                </div>
              </div>

              {/* Real-time Typography Live Preview */}
              <div className="bg-[#F7F3E8] p-6 rounded-3xl border border-neutral-200 space-y-4">
                <span className="text-[10px] uppercase font-bold text-[#075E2B] tracking-wider block">
                  Live Typography Preview
                </span>

                <div
                  style={{
                    fontFamily: `'${formData.headingFont}', Georgia, serif`,
                  }}
                  className="space-y-2 border-b border-neutral-300/60 pb-4"
                >
                  <span className="text-xs text-neutral-500 font-mono">Headings Preview:</span>
                  <h1 className="text-3xl font-bold text-[#075E2B] leading-tight">
                    Cultivating Wealth, Feeding Nations.
                  </h1>
                  <h2 className="text-xl font-semibold text-[#263238]">
                    Agriculture Is More Than Farming.
                  </h2>
                </div>

                <div
                  style={{
                    fontFamily: `'${formData.bodyFont}', system-ui, sans-serif`,
                  }}
                  className="space-y-2"
                >
                  <span className="text-xs text-neutral-500 font-mono">Body Font Preview:</span>
                  <p className="text-xs text-neutral-700 leading-relaxed">
                    Greenvest Farms is a forward-looking African agribusiness committed to modern, sustainable and profitable farming that creates enduring value for investors, empowers communities and contributes to food security across Africa.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* 9. HEADER, FOOTER & CONTACTS */}
        {/* ========================================================= */}
        {activeTab === 'header_footer' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-xs space-y-6">
            <div className="border-b border-neutral-100 pb-4">
              <h3 className="font-serif-display text-2xl font-bold text-[#075E2B]">
                Header, Announcement Bar, Contacts & Footer
              </h3>
              <p className="text-xs text-neutral-500">
                Configure the top announcement ticker, physical office addresses, phone, and footer copyright.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-neutral-800">Top Announcement Banner</label>
                    <label className="flex items-center gap-1.5 text-xs text-neutral-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isAnnouncementActive}
                        onChange={(e) => setFormData({ ...formData, isAnnouncementActive: e.target.checked })}
                        className="rounded text-[#075E2B]"
                      />
                      <span>Active</span>
                    </label>
                  </div>
                  <input
                    type="text"
                    value={formData.announcementText}
                    onChange={(e) => setFormData({ ...formData, announcementText: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs border border-neutral-300 rounded-xl bg-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">Primary Phone</label>
                    <input
                      type="text"
                      value={formData.primaryPhone}
                      onChange={(e) => setFormData({ ...formData, primaryPhone: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs border border-neutral-300 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">WhatsApp Hotline</label>
                    <input
                      type="text"
                      value={formData.whatsappNumber}
                      onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs border border-neutral-300 rounded-xl"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Contact Email</label>
                  <input
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs border border-neutral-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Abuja Corporate Office</label>
                  <input
                    type="text"
                    value={formData.officeAddressAbuja}
                    onChange={(e) => setFormData({ ...formData, officeAddressAbuja: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs border border-neutral-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Lagos Logistics Hub</label>
                  <input
                    type="text"
                    value={formData.officeAddressLagos}
                    onChange={(e) => setFormData({ ...formData, officeAddressLagos: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs border border-neutral-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Footer Copyright Line</label>
                  <input
                    type="text"
                    value={formData.footerCopyright}
                    onChange={(e) => setFormData({ ...formData, footerCopyright: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs border border-neutral-300 rounded-xl"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Global Save Button at bottom of form */}
        <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200">
          <button
            type="button"
            onClick={handleReset}
            className="px-5 py-2.5 rounded-xl border border-neutral-300 text-neutral-700 font-semibold text-xs hover:bg-neutral-50 cursor-pointer"
          >
            Reset Form
          </button>
          <button
            type="submit"
            className="px-8 py-2.5 rounded-xl bg-[#075E2B] hover:bg-[#064e24] text-white font-bold text-xs flex items-center gap-2 shadow-md cursor-pointer transition-all active:scale-95"
          >
            {saved ? <Check className="w-4 h-4 text-[#F4B400]" /> : <Save className="w-4 h-4" />}
            <span>{saved ? 'Changes Saved Live!' : 'Save & Publish Live Site'}</span>
          </button>
        </div>
      </form>

      {/* ========================================================= */}
      {/* MODAL: EDIT / ADD AGRICULTURAL INSTITUTION PARTNER */}
      {/* ========================================================= */}
      {partnerModalOpen && editingPartner && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#075E2B]" />
                <h3 className="font-serif-display text-2xl font-bold text-[#075E2B]">
                  {editingPartner.acronym ? `Edit Partnership: ${editingPartner.acronym}` : 'Add New Agricultural Institution'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setPartnerModalOpen(false);
                  setEditingPartner(null);
                }}
                className="text-neutral-400 hover:text-neutral-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePartner} className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Acronym *</label>
                  <input
                    type="text"
                    required
                    value={editingPartner.acronym}
                    onChange={(e) => setEditingPartner({ ...editingPartner, acronym: e.target.value })}
                    placeholder="e.g. IITA"
                    className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-xl focus:ring-2 focus:ring-[#075E2B] font-bold"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Institution Full Name *</label>
                  <input
                    type="text"
                    required
                    value={editingPartner.name}
                    onChange={(e) => setEditingPartner({ ...editingPartner, name: e.target.value })}
                    placeholder="e.g. International Institute of Tropical Agriculture"
                    className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-xl focus:ring-2 focus:ring-[#075E2B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Collaboration Category *</label>
                  <input
                    type="text"
                    required
                    value={editingPartner.category}
                    onChange={(e) => setEditingPartner({ ...editingPartner, category: e.target.value })}
                    placeholder="e.g. Crop Genetics & Seed Systems"
                    className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Alliance / Status Badge</label>
                  <input
                    type="text"
                    value={editingPartner.badge || ''}
                    onChange={(e) => setEditingPartner({ ...editingPartner, badge: e.target.value })}
                    placeholder="e.g. Premier Research Partner"
                    className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Headquarters / Location</label>
                  <input
                    type="text"
                    value={editingPartner.location || ''}
                    onChange={(e) => setEditingPartner({ ...editingPartner, location: e.target.value })}
                    placeholder="e.g. Ibadan, Nigeria (Global CGIAR Center)"
                    className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Alliance Protocol Type</label>
                  <input
                    type="text"
                    value={editingPartner.allianceType || ''}
                    onChange={(e) => setEditingPartner({ ...editingPartner, allianceType: e.target.value })}
                    placeholder="e.g. Research & Genetic Seed Exchange"
                    className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Institutional Mandate & Scope *
                </label>
                <textarea
                  rows={3}
                  required
                  value={editingPartner.mandate}
                  onChange={(e) => setEditingPartner({ ...editingPartner, mandate: e.target.value })}
                  placeholder="Describe the research or technical mandate and why Greenvest partners with this institution..."
                  className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-xl focus:ring-2 focus:ring-[#075E2B]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Joint Initiatives (One per line)
                </label>
                <textarea
                  rows={3}
                  value={editingPartner.keyInitiatives.join('\n')}
                  onChange={(e) =>
                    setEditingPartner({
                      ...editingPartner,
                      keyInitiatives: e.target.value.split('\n').filter((x) => x.trim()),
                    })
                  }
                  placeholder="Multi-locational trials for drought-tolerant yellow maize&#10;Cassava bacterial blight resistance germplasm&#10;Youth Agripreneurs incubation"
                  className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-xl font-mono"
                />
              </div>

              {/* Institution Crest / Photo Upload with ImageUploadField */}
              <ImageUploadField
                label="Institution Crest / Logo / Field Image"
                value={editingPartner.logo || ''}
                onChange={(url) => setEditingPartner({ ...editingPartner, logo: url })}
                helperText="Upload official institution crest or research trial image directly from your computer or media library."
                category="Institution Crests"
                recommendedAspect="1:1 Crest or 16:9 Photo"
              />

              <div className="pt-3 flex justify-end gap-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setPartnerModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-neutral-700 border border-neutral-300 rounded-xl hover:bg-neutral-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-[#075E2B] hover:bg-[#064e24] text-white font-bold text-xs shadow-md"
                >
                  Save Institutional Block
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: EDIT / ADD FARM ESTATE */}
      {/* ========================================================= */}
      {farmModalOpen && editingFarm && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <Tractor className="w-5 h-5 text-[#075E2B]" />
                <h3 className="font-serif-display text-2xl font-bold text-[#075E2B]">
                  {editingFarm.name ? `Edit Farm: ${editingFarm.name}` : 'Add New Commercial Farm Estate'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setFarmModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveFarm} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Farm Name *</label>
                  <input
                    type="text"
                    required
                    value={editingFarm.name}
                    onChange={(e) => setEditingFarm({ ...editingFarm, name: e.target.value })}
                    placeholder="e.g. Kaduna Grain & Cereal Hub"
                    className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-xl focus:ring-2 focus:ring-[#075E2B]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Farm Category *</label>
                  <select
                    value={editingFarm.type}
                    onChange={(e) => setEditingFarm({ ...editingFarm, type: e.target.value as FarmCategory })}
                    className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-xl bg-white"
                  >
                    <option value="Crop Farming">Crop Farming</option>
                    <option value="Greenhouse Farming">Greenhouse Farming</option>
                    <option value="Livestock">Livestock</option>
                    <option value="Poultry">Poultry</option>
                    <option value="Aquaculture">Aquaculture</option>
                    <option value="Agro-Processing">Agro-Processing</option>
                    <option value="Agricultural Estates">Agricultural Estates</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Acreage *</label>
                  <input
                    type="text"
                    required
                    value={editingFarm.acreage}
                    onChange={(e) => setEditingFarm({ ...editingFarm, acreage: e.target.value })}
                    placeholder="e.g. 7,500 Hectares"
                    className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">State *</label>
                  <input
                    type="text"
                    required
                    value={editingFarm.state}
                    onChange={(e) => setEditingFarm({ ...editingFarm, state: e.target.value })}
                    placeholder="e.g. Kaduna State, Nigeria"
                    className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Output Stats</label>
                  <input
                    type="text"
                    value={editingFarm.outputStats}
                    onChange={(e) => setEditingFarm({ ...editingFarm, outputStats: e.target.value })}
                    placeholder="e.g. 48,000 MT Annual Yield"
                    className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Description *</label>
                <textarea
                  rows={3}
                  required
                  value={editingFarm.description}
                  onChange={(e) => setEditingFarm({ ...editingFarm, description: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-xl focus:ring-2 focus:ring-[#075E2B]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Key Crops (comma-separated)
                </label>
                <input
                  type="text"
                  value={editingFarm.keyCrops.join(', ')}
                  onChange={(e) =>
                    setEditingFarm({
                      ...editingFarm,
                      keyCrops: e.target.value.split(',').map((x) => x.trim()).filter(Boolean),
                    })
                  }
                  placeholder="Hybrid Yellow Maize, Soybeans, Sorghum"
                  className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-xl"
                />
              </div>

              {/* Farm Image Upload with ImageUploadField */}
              <ImageUploadField
                label="Farm Estate Photograph"
                value={editingFarm.image}
                onChange={(url) => setEditingFarm({ ...editingFarm, image: url })}
                helperText="Upload farm photo directly from your device or select from media library."
                category="Estate Banners"
                recommendedAspect="16:9 Landscape"
              />

              <div className="pt-3 flex justify-end gap-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setFarmModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-neutral-700 border border-neutral-300 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-[#075E2B] text-white font-bold text-xs shadow-md"
                >
                  Save Farm Estate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: EDIT / ADD SERVICE */}
      {/* ========================================================= */}
      {serviceModalOpen && editingService && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#075E2B]" />
                <h3 className="font-serif-display text-2xl font-bold text-[#075E2B]">
                  {editingService.title ? `Edit Service: ${editingService.title}` : 'Add Service Capability'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setServiceModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveService} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Service Title *</label>
                  <input
                    type="text"
                    required
                    value={editingService.title}
                    onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                    placeholder="e.g. Commercial Crop Farming"
                    className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-xl focus:ring-2 focus:ring-[#075E2B]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Category *</label>
                  <input
                    type="text"
                    required
                    value={editingService.category}
                    onChange={(e) => setEditingService({ ...editingService, category: e.target.value })}
                    placeholder="e.g. Production & Grains"
                    className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Description *</label>
                <textarea
                  rows={3}
                  required
                  value={editingService.description}
                  onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-xl focus:ring-2 focus:ring-[#075E2B]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Key Operational Activities (one per line)
                </label>
                <textarea
                  rows={3}
                  value={editingService.keyActivities.join('\n')}
                  onChange={(e) =>
                    setEditingService({
                      ...editingService,
                      keyActivities: e.target.value.split('\n').filter((x) => x.trim()),
                    })
                  }
                  className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-xl font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">CTA Button Text</label>
                  <input
                    type="text"
                    value={editingService.ctaText}
                    onChange={(e) => setEditingService({ ...editingService, ctaText: e.target.value })}
                    placeholder="Explore Grain Supply Contracts"
                    className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-xl"
                  />
                </div>
              </div>

              {/* Service Image Upload */}
              <ImageUploadField
                label="Service Operation Photo"
                value={editingService.image}
                onChange={(url) => setEditingService({ ...editingService, image: url })}
                helperText="Upload from your device or choose from media assets."
                category="Processing & Facilities"
                recommendedAspect="4:3 or 16:9 Landscape"
              />

              <div className="pt-3 flex justify-end gap-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setServiceModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-neutral-700 border border-neutral-300 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-[#075E2B] text-white font-bold text-xs shadow-md"
                >
                  Save Service Unit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: EDIT / ADD PRODUCT */}
      {/* ========================================================= */}
      {productModalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#075E2B]" />
                <h3 className="font-serif-display text-2xl font-bold text-[#075E2B]">
                  {editingProduct.name ? `Edit Product: ${editingProduct.name}` : 'Add New Agricultural Product'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setProductModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveProduct(e);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Product Name *</label>
                <input
                  type="text"
                  required
                  value={editingProduct.name}
                  onChange={(e) => {
                    const val = e.target.value;
                    const oldAutoSlug = (editingProduct.name || '')
                      .toLowerCase()
                      .replace(/[^a-z0-9]+/g, '-')
                      .replace(/^-+|-+$/g, '');
                    const newAutoSlug = val
                      .toLowerCase()
                      .replace(/[^a-z0-9]+/g, '-')
                      .replace(/^-+|-+$/g, '');
                    const isSlugAuto = !editingProduct.slug || editingProduct.slug === oldAutoSlug;
                    setEditingProduct({
                      ...editingProduct,
                      name: val,
                      slug: isSlugAuto ? newAutoSlug : editingProduct.slug,
                    });
                  }}
                  placeholder="e.g. Commercial Hybrid Yellow Maize"
                  className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-xl focus:ring-2 focus:ring-[#075E2B]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">URL Slug (Auto-generated if left blank)</label>
                <input
                  type="text"
                  value={editingProduct.slug || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, slug: e.target.value })}
                  placeholder="e.g. commercial-hybrid-yellow-maize"
                  className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-xl font-mono text-neutral-600 focus:ring-2 focus:ring-[#075E2B]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Category *</label>
                  <select
                    value={editingProduct.category}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value as ProductCategory })}
                    className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-xl bg-white"
                  >
                    <option value="Grains & Cereals">Grains & Cereals</option>
                    <option value="Oilseeds & Legumes">Oilseeds & Legumes</option>
                    <option value="Horticulture & Vegetables">Horticulture & Vegetables</option>
                    <option value="Aquaculture & Livestock">Aquaculture & Livestock</option>
                    <option value="Fresh Produce">Fresh Produce</option>
                    <option value="Vegetables">Vegetables</option>
                    <option value="Maize">Maize</option>
                    <option value="Grains">Grains</option>
                    <option value="Fish">Fish</option>
                    <option value="Eggs">Eggs</option>
                    <option value="Poultry">Poultry</option>
                    <option value="Livestock">Livestock</option>
                    <option value="Processed Agricultural Products">Processed Agricultural Products</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Packaging / Unit *</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.unit}
                    onChange={(e) => setEditingProduct({ ...editingProduct, unit: e.target.value })}
                    placeholder="e.g. 50kg Bag, Crate, Metric Tonne"
                    className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Price (NGN) - leave empty for Request</label>
                  <input
                    type="number"
                    value={editingProduct.price !== null && editingProduct.price !== undefined ? editingProduct.price : ''}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        price: e.target.value === '' ? null : Number(e.target.value),
                      })
                    }
                    placeholder="Leave blank for Price on Request"
                    className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Available Stock Qty</label>
                  <input
                    type="number"
                    min={0}
                    value={editingProduct.stock ?? 100}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock: e.target.value === '' ? 0 : Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Premium commercial harvest produce directly from Greenvest commercial estates."
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-xl"
                />
                <span className="text-[10px] text-neutral-400">Optional. Default commercial description will be applied if left empty.</span>
              </div>

              {/* Product Image Upload */}
              <ImageUploadField
                label="Product Photograph"
                value={editingProduct.image}
                onChange={(url) => setEditingProduct({ ...editingProduct, image: url })}
                helperText="Upload product image directly from your computer or pick from media."
                category="Products"
                recommendedAspect="1:1 Square or 4:3"
              />

              <div className="pt-3 flex justify-end gap-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setProductModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-neutral-700 border border-neutral-300 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  onClick={(e) => handleSaveProduct(e)}
                  className="px-6 py-2 rounded-xl bg-[#075E2B] text-white font-bold text-xs shadow-md cursor-pointer hover:bg-[#064e24] transition-all"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
