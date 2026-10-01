import React from 'react';
import {
  Product,
  Farm,
  BlogPost,
  SiteSettings,
  ImpactMetric,
} from '../types/index.ts';
import { NigeriaMapSection } from '../components/NigeriaMapSection.tsx';
import {
  ArrowRight,
  Sprout,
  ShieldCheck,
  TrendingUp,
  Globe2,
  Wheat,
  ShoppingCart,
  MessageCircle,
  CheckCircle2,
} from 'lucide-react';
import {
  HERO_IMAGE,
  AGRONOMISTS_IMAGE,
  CROP_HARVEST_IMAGE,
  AGRO_PROCESSING_IMAGE,
} from '../data/initialData.ts';
import { safeImageSrc } from '../utils/safeImage.ts';

interface HomePageProps {
  settings: SiteSettings;
  products: Product[];
  farms: Farm[];
  posts: BlogPost[];
  impactMetrics: ImpactMetric[];
  onNavigate: (tab: string) => void;
  onAddToCart: (product: Product) => void;
  onOpenPartnerModal: () => void;
  onSelectPost: (post: BlogPost) => void;
  onSelectFarm: (farm: Farm) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  settings,
  products,
  farms,
  posts,
  impactMetrics,
  onNavigate,
  onAddToCart,
  onOpenPartnerModal,
  onSelectPost,
  onSelectFarm,
}) => {
  const featuredProducts = products.filter((p) => p.featured).slice(0, 4);
  const featuredPost = posts[0];
  const recentPosts = posts.slice(1, 4);

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[640px] sm:min-h-[720px] lg:min-h-[820px] flex items-center justify-center pt-24 pb-16 overflow-hidden">
        {/* Cinematic Background Image with Measured Scrim */}
        <div className="absolute inset-0 z-0">
          <img
            src={safeImageSrc(settings.heroImage, HERO_IMAGE)!}
            alt="Greenvest African farm at sunrise with center pivot irrigation and tractor"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center transform scale-105 animate-fade-in"
          />
          {/* Deep Forest-Charcoal Gradient Scrim to ensure 4.5:1 text contrast */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#075E2B]/90 via-[#075E2B]/75 to-[#263238]/85" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#05441F] via-transparent to-black/40" />
        </div>

        {/* Hero Content Box */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-3xl space-y-6">
            {/* Top Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-[#F4B400]/40 text-[#F4B400] text-xs font-semibold tracking-wide">
              <span className="w-2 h-2 rounded-full bg-[#F4B400] animate-ping" />
              <span>{settings.heroEyebrow || 'Africa’s Premier Institutional Agribusiness'}</span>
            </div>

            {/* Headline */}
            <h1 className="font-serif-display text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.08] text-balance">
              {settings.heroHeadline || 'Growing Tomorrow’s Prosperity Today.'}
            </h1>

            {/* Supporting Text */}
            <p className="text-lg sm:text-xl text-white/90 leading-relaxed font-normal max-w-2xl">
              {settings.heroSubtext ||
                'Sustainable farming. Smart investment. A healthier, food-secure Africa.'}
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={() => onNavigate('farms')}
                className="px-6 sm:px-8 py-3.5 rounded-xl bg-white text-[#075E2B] font-bold text-sm hover:bg-[#F7F3E8] transition-all shadow-xl hover:shadow-2xl active:scale-[0.98] cursor-pointer"
              >
                {settings.heroCta1Text || 'Explore Our Farms'}
              </button>

              <button
                onClick={onOpenPartnerModal}
                className="px-6 sm:px-8 py-3.5 rounded-xl bg-[#F4B400] text-[#075E2B] font-bold text-sm hover:bg-[#e0a500] transition-all shadow-xl hover:shadow-2xl active:scale-[0.98] flex items-center gap-2 cursor-pointer"
              >
                <span>{settings.heroCta2Text || 'Partner With Us'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 4 Feature Indicators Below Hero */}
          <div className="mt-16 sm:mt-20 pt-8 border-t border-white/20 grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-[#F4B400]">
                <Sprout className="w-5 h-5 shrink-0" />
                <span className="text-sm font-bold text-white tracking-wide">
                  Sustainable Agriculture
                </span>
              </div>
              <p className="text-xs text-white/75">
                Regenerative soil stewardship & water-recycling fertigation systems.
              </p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-[#F4B400]">
                <Wheat className="w-5 h-5 shrink-0" />
                <span className="text-sm font-bold text-white tracking-wide">
                  Food Production
                </span>
              </div>
              <p className="text-xs text-white/75">
                Over 145,000 MT of staple cereals, grains, proteins and vegetables.
              </p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-[#F4B400]">
                <TrendingUp className="w-5 h-5 shrink-0" />
                <span className="text-sm font-bold text-white tracking-wide">
                  Economic Empowerment
                </span>
              </div>
              <p className="text-xs text-white/75">
                Catalyzing over 12,400 outgrower smallholders and rural job networks.
              </p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-[#F4B400]">
                <Globe2 className="w-5 h-5 shrink-0" />
                <span className="text-sm font-bold text-white tracking-wide">
                  African Growth
                </span>
              </div>
              <p className="text-xs text-white/75">
                Pioneering food security and industrial value retention across the continent.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CORPORATE VALUE MANIFESTO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#2E8B57]">
              The Greenvest Philosophy
            </span>
            <h2 className="font-serif-display text-3xl sm:text-5xl font-bold text-[#075E2B] leading-tight text-balance">
              Agriculture Is More Than Farming. It Is an Investment in the Future.
            </h2>
            <p className="text-base text-neutral-700 leading-relaxed">
              Greenvest Farms is a forward-looking African agribusiness committed to modern, sustainable and profitable farming that creates value for investors, empowers communities and contributes to food security across Africa.
            </p>
            <p className="text-sm text-neutral-600 leading-relaxed">
              By aligning institutional capital with world-class agronomic science and automated processing, we eliminate the systemic vulnerabilities of African food systems and generate enduring commercial prosperity.
            </p>
            <div className="pt-2 flex items-center gap-4">
              <button
                onClick={() => onNavigate('about')}
                className="px-6 py-3 rounded-lg bg-[#075E2B] text-white text-xs font-bold hover:bg-[#064e24] transition-colors flex items-center gap-2 cursor-pointer"
              >
                <span>Read Our Corporate Story</span>
                <ArrowRight className="w-4 h-4 text-[#F4B400]" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-neutral-200 aspect-[4/3]">
              <img
                src={AGRONOMISTS_IMAGE}
                alt="Greenvest African agronomists inspecting crops"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                <span className="text-[11px] font-bold text-[#F4B400] uppercase tracking-wider">
                  Science Meets Agronomy
                </span>
                <p className="text-sm font-semibold">
                  Field agronomists monitoring Dutch variety beef tomatoes under climate-controlled glasshouses.
                </p>
              </div>
            </div>

            {/* Floating Trust Card */}
            <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-5 shadow-xl border border-neutral-200 hidden sm:block max-w-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#075E2B] text-[#F4B400] flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-neutral-800 block">
                    Zero-Pesticide Residue
                  </span>
                  <span className="text-[11px] text-neutral-500">
                    Certified ISO 22000 & GAP Standards
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. NIGERIA & AFRICA AGRICULTURAL HUBS MAP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <NigeriaMapSection
          farms={farms}
          onSelectFarm={onSelectFarm}
          onOpenPartnerModal={onOpenPartnerModal}
          onNavigate={onNavigate}
        />
      </section>

      {/* 4. SIX PILLARS OF OPERATION (WHAT WE DO TEASER) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#2E8B57] font-semibold">
              Integrated Production Model
            </span>
            <h2 className="font-serif-display text-3xl sm:text-4xl font-bold text-[#075E2B] mt-1">
              End-to-End Agribusiness Value Chain
            </h2>
          </div>
          <button
            onClick={() => onNavigate('services')}
            className="text-xs font-bold text-[#075E2B] hover:text-[#2E8B57] flex items-center gap-1 group self-start md:self-auto cursor-pointer"
          >
            <span>Explore All 6 Agricultural Divisions</span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-neutral-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col justify-between">
            <div className="h-48 overflow-hidden relative">
              <img
                src={CROP_HARVEST_IMAGE}
                alt="Large scale grain harvesting"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 bg-[#075E2B] text-[#F4B400] text-[11px] font-bold px-2.5 py-1 rounded-md">
                01. Crop Farming
              </div>
            </div>
            <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-serif-display text-xl font-bold text-[#263238]">
                  Commercial Grain & Tuber Farming
                </h3>
                <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
                  Center-pivot irrigation and high-yielding hybrid yellow maize, Faro 44 lowland rice, and industrial soybeans across 18,500+ hectares.
                </p>
              </div>
              <button
                onClick={() => onNavigate('services')}
                className="text-xs font-semibold text-[#075E2B] flex items-center gap-1 mt-4"
              >
                <span>Learn More</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col justify-between">
            <div className="h-48 overflow-hidden relative">
              <img
                src={AGRO_PROCESSING_IMAGE}
                alt="Agro-processing facility"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 bg-[#075E2B] text-[#F4B400] text-[11px] font-bold px-2.5 py-1 rounded-md">
                02. Agro-Processing
              </div>
            </div>
            <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-serif-display text-xl font-bold text-[#263238]">
                  Value-Addition & Sortex Refining
                </h3>
                <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
                  Optical rice parboiling mills, high-grade cassava flour (HQCF) lines, and cold-pressed edible oil extraction eliminating post-harvest decay.
                </p>
              </div>
              <button
                onClick={() => onNavigate('services')}
                className="text-xs font-semibold text-[#075E2B] flex items-center gap-1 mt-4"
              >
                <span>Learn More</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col justify-between">
            <div className="h-48 overflow-hidden relative">
              <img
                src={HERO_IMAGE}
                alt="Agricultural investment model"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 bg-[#075E2B] text-[#F4B400] text-[11px] font-bold px-2.5 py-1 rounded-md">
                03. Agri-Investment
              </div>
            </div>
            <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-serif-display text-xl font-bold text-[#263238]">
                  Institutional Capital Deployment
                </h3>
                <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
                  Direct agricultural asset exposure backed by biological asset insurance, audited quarterly reporting, and real tangible output.
                </p>
              </div>
              <button
                onClick={() => onNavigate('investment')}
                className="text-xs font-semibold text-[#075E2B] flex items-center gap-1 mt-4"
              >
                <span>Invest in Food</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FEATURED PRODUCTS CATALOGUE PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#2E8B57] font-semibold">
              Harvest Fresh & Commercial Supply
            </span>
            <h2 className="font-serif-display text-3xl sm:text-4xl font-bold text-[#075E2B] mt-1">
              Direct From Greenvest Farms
            </h2>
            <p className="text-xs text-neutral-600 mt-1">
              Available for wholesale distribution, commercial food manufacturing, and institutional delivery.
            </p>
          </div>
          <button
            onClick={() => onNavigate('products')}
            className="px-5 py-2.5 rounded-lg border border-[#075E2B] text-[#075E2B] font-bold text-xs hover:bg-[#075E2B] hover:text-white transition-colors cursor-pointer self-start md:self-auto"
          >
            View Complete Catalogue ({products.length} Items)
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100">
                <img
                  src={safeImageSrc(product.image, CROP_HARVEST_IMAGE)!}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-2 left-2 bg-[#075E2B]/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded">
                  {product.category}
                </span>
                <span className="absolute top-2 right-2 bg-[#F4B400] text-[#075E2B] text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
                  {product.unit}
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-serif-display text-lg font-bold text-[#263238] line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-xs text-neutral-500 line-clamp-2 mt-1">
                    {product.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-neutral-100 space-y-3">
                  <div className="flex items-baseline justify-between">
                    <span className="text-[11px] text-neutral-500">Unit Price:</span>
                    <span className="text-base font-extrabold text-[#075E2B] tabular-nums">
                      {product.price !== null
                        ? `₦${product.price.toLocaleString()}`
                        : 'Price on Request'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => onAddToCart(product)}
                      className="w-full py-2 px-3 rounded-lg bg-[#075E2B] text-white text-xs font-bold hover:bg-[#064e24] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      <span>Add to Order</span>
                    </button>

                    <a
                      href={`https://wa.me/2348139487363?text=Hello%20Greenvest%20Farms,%20I%20would%20like%20to%20order%20the%20following%20product:%20${encodeURIComponent(
                        product.name
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2 px-3 rounded-lg bg-[#25D366] text-white text-xs font-bold hover:bg-[#20ba5a] flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. IMPACT STATS BANNER */}
      <section className="bg-[#075E2B] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs uppercase tracking-widest text-[#F4B400] font-semibold">
              Measurable African Transformation
            </span>
            <h2 className="font-serif-display text-3xl sm:text-4xl font-bold">
              Our Continental Footprint in Numbers
            </h2>
            <p className="text-xs text-white/80">
              Audited operational statistics reflecting our mission of feeding nations and cultivating sustainable rural prosperity.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {impactMetrics.map((metric) => (
              <div
                key={metric.id}
                className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center space-y-1 hover:bg-white/10 transition-colors"
              >
                <span className="font-serif-display text-2xl sm:text-3xl font-bold text-[#F4B400] block tabular-nums">
                  {metric.value}
                </span>
                <span className="text-[11px] font-bold text-white uppercase tracking-wider block">
                  {metric.unit}
                </span>
                <span className="text-[11px] text-white/70 block leading-tight pt-1">
                  {metric.label}
                </span>
              </div>
            ))}
          </div>

          <div className="text-center pt-2">
            <button
              onClick={() => onNavigate('impact')}
              className="px-6 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition-colors cursor-pointer"
            >
              Explore Full Impact & Outgrower Reports
            </button>
          </div>
        </div>
      </section>

      {/* 7. AGRICULTURAL INTELLIGENCE (LATEST BLOG POSTS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#2E8B57] font-semibold">
              Market Briefings & Insights
            </span>
            <h2 className="font-serif-display text-3xl sm:text-4xl font-bold text-[#075E2B] mt-1">
              Agronomic Thought Leadership
            </h2>
          </div>
          <button
            onClick={() => onNavigate('blog')}
            className="text-xs font-bold text-[#075E2B] hover:text-[#2E8B57] flex items-center gap-1 group self-start md:self-auto cursor-pointer"
          >
            <span>Read All Articles</span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Featured Post (Big Card) */}
          {featuredPost && (
            <div
              onClick={() => onSelectPost(featuredPost)}
              className="lg:col-span-7 bg-white rounded-3xl border border-neutral-200 overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div className="aspect-[16/9] overflow-hidden relative bg-neutral-100">
                <img
                  src={safeImageSrc(featuredPost.featuredImage, HERO_IMAGE)!}
                  alt={featuredPost.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-[#075E2B] text-[#F4B400] text-xs font-bold px-3 py-1 rounded-md">
                  Featured Insight
                </div>
              </div>
              <div className="p-6 sm:p-8 space-y-3">
                <div className="flex items-center gap-2 text-xs text-neutral-500">
                  <span className="font-semibold text-[#075E2B]">{featuredPost.category}</span>
                  <span>·</span>
                  <span>{featuredPost.publicationDate}</span>
                  <span>·</span>
                  <span>{featuredPost.readTime}</span>
                </div>
                <h3 className="font-serif-display text-2xl sm:text-3xl font-bold text-[#263238] group-hover:text-[#075E2B] transition-colors leading-snug">
                  {featuredPost.title}
                </h3>
                <p className="text-sm text-neutral-600 leading-relaxed">
                  {featuredPost.excerpt}
                </p>
                <div className="pt-3 flex items-center justify-between border-t border-neutral-100">
                  <span className="text-xs font-medium text-neutral-700">
                    By {featuredPost.author.name}
                  </span>
                  <span className="text-xs font-bold text-[#075E2B] flex items-center gap-1">
                    Read Analysis <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Recent 3 Secondary Posts */}
          <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
            {recentPosts.map((post) => (
              <div
                key={post.id}
                onClick={() => onSelectPost(post)}
                className="p-4 sm:p-5 rounded-2xl bg-white border border-neutral-200 hover:border-[#2E8B57]/40 shadow-sm hover:shadow-md transition-all cursor-pointer flex gap-4 group"
              >
                <img
                  src={safeImageSrc(post.featuredImage, HERO_IMAGE)!}
                  alt={post.title}
                  referrerPolicy="no-referrer"
                  className="w-24 h-24 rounded-xl object-cover shrink-0 bg-neutral-100"
                />
                <div className="flex-1 space-y-1.5 min-w-0">
                  <div className="flex items-center gap-2 text-[11px] text-neutral-500">
                    <span className="font-semibold text-[#075E2B]">{post.category}</span>
                    <span>·</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h4 className="font-serif-display text-base font-bold text-[#263238] group-hover:text-[#075E2B] transition-colors line-clamp-2">
                    {post.title}
                  </h4>
                  <p className="text-[11px] text-neutral-500 line-clamp-1">
                    {post.excerpt}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. INSTITUTIONAL CALL TO ACTION BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-[#075E2B] to-[#2E8B57] p-8 sm:p-14 text-white shadow-2xl relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl relative z-10">
            <span className="text-xs uppercase tracking-widest text-[#F4B400] font-semibold">
              Cultivating Wealth, Feeding Nations
            </span>
            <h2 className="font-serif-display text-3xl sm:text-5xl font-bold leading-tight">
              Ready to Collaborate With Africa’s Premier Agribusiness?
            </h2>
            <p className="text-sm sm:text-base text-white/90 leading-relaxed">
              Whether you are an institutional food buyer securing commercial grain off-take, an agricultural investor seeking asset-backed returns, or a development organization, Greenvest Farms is your dependable execution partner.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 relative z-10 shrink-0 w-full lg:w-auto">
            <button
              onClick={onOpenPartnerModal}
              className="px-8 py-4 rounded-xl bg-[#F4B400] hover:bg-[#e0a500] text-[#075E2B] font-bold text-sm shadow-xl transition-all active:scale-[0.98] text-center cursor-pointer"
            >
              Partner With Us
            </button>
            <button
              onClick={() => onNavigate('contact')}
              className="px-8 py-4 rounded-xl border border-white text-white hover:bg-white/10 font-bold text-sm transition-all active:scale-[0.98] text-center cursor-pointer"
            >
              Contact Trade Desk
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
