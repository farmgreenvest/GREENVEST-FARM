import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  Product,
  Order,
  BlogPost,
  ContactEnquiry,
  NewsletterSubscriber,
  AdminProfile,
  AdminRequest,
  SiteVisit,
  SiteSettings,
  ImpactMetric,
  MediaAsset,
  Farm,
  ServiceItem,
  InstitutionalPartner,
} from '../types/index.ts';
import {
  INITIAL_SITE_SETTINGS,
  INITIAL_PRODUCTS,
  INITIAL_BLOG_POSTS,
  INITIAL_IMPACT_METRICS,
  INITIAL_FARMS,
  INITIAL_SERVICES,
  INITIAL_SUPER_ADMIN,
  INITIAL_INSTITUTIONAL_PARTNERS,
  HERO_IMAGE,
  AGRONOMISTS_IMAGE,
  CROP_HARVEST_IMAGE,
  AGRO_PROCESSING_IMAGE,
} from '../data/initialData.ts';

// -------------------------------------------------------------
// Supabase Credentials
// -------------------------------------------------------------
export const DEFAULT_SUPABASE_URL = 'https://tufpcwyufqrntbuytndc.supabase.co';
export const DEFAULT_SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1ZnBjd3l1ZnFybnRidXl0bmRjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA1MTIyMjgsImV4cCI6MjEwNjA4ODIyOH0.jHmOGDZPTOeY1wrSkvbFOWLJ5fFZB7VaA5gX6Hm8_J4';

export function sanitizeSupabaseUrl(url?: string): string {
  if (!url) return DEFAULT_SUPABASE_URL;
  let clean = url.trim();
  // Strip trailing /rest/v1 or /rest/v1/ or trailing slash
  clean = clean.replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '');
  return clean;
}

export function getSupabaseCredentials(): { url: string; anonKey: string } {
  const localUrl = typeof window !== 'undefined' ? localStorage.getItem('gvf_supabase_url') : null;
  const localKey = typeof window !== 'undefined' ? localStorage.getItem('gvf_supabase_anon_key') : null;

  const rawUrl =
    (localUrl && localUrl.trim()) ||
    (import.meta as any).env?.VITE_SUPABASE_URL ||
    DEFAULT_SUPABASE_URL;

  const rawKey =
    (localKey && localKey.trim()) ||
    (import.meta as any).env?.VITE_SUPABASE_ANON_KEY ||
    DEFAULT_SUPABASE_ANON_KEY;

  return {
    url: sanitizeSupabaseUrl(rawUrl),
    anonKey: rawKey.trim(),
  };
}

let activeCreds = getSupabaseCredentials();
export let SUPABASE_URL = activeCreds.url;
export let SUPABASE_ANON_KEY = activeCreds.anonKey;

export function createSupabaseClient(url: string, key: string): SupabaseClient {
  return createClient(url, key, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  });
}

export let supabase: SupabaseClient = createSupabaseClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const STORAGE_KEYS = {
  SETTINGS: 'gvf_site_settings',
  PRODUCTS: 'gvf_products',
  DELETED_PRODUCTS: 'gvf_deleted_product_ids',
  ORDERS: 'gvf_orders',
  POSTS: 'gvf_blog_posts',
  FARMS: 'gvf_farms',
  SERVICES: 'gvf_services',
  PARTNERS: 'gvf_institutional_partners',
  ENQUIRIES: 'gvf_contact_enquiries',
  SUBSCRIBERS: 'gvf_subscribers',
  ADMINS: 'gvf_admin_profiles',
  ADMIN_REQUESTS: 'gvf_admin_requests',
  VISITS: 'gvf_site_visits',
  IMPACT: 'gvf_impact_metrics',
  MEDIA: 'gvf_media_assets',
  CURRENT_ADMIN: 'gvf_active_admin_session',
};

// In-memory cache ensures that even if localStorage quota is exceeded or storage is restricted,
// all reads/writes in the active application session succeed synchronously and seamlessly.
const memoryCache = new Map<string, any>();

// Helper to free up storage space when quota is exceeded
function evictExpendableStorage() {
  if (typeof window === 'undefined') return;
  try {
    // 1. Truncate site visits to at most 10 recent items
    const rawVisits = localStorage.getItem(STORAGE_KEYS.VISITS);
    if (rawVisits) {
      try {
        const visits = JSON.parse(rawVisits);
        if (Array.isArray(visits) && visits.length > 10) {
          localStorage.setItem(STORAGE_KEYS.VISITS, JSON.stringify(visits.slice(0, 10)));
        }
      } catch {
        localStorage.removeItem(STORAGE_KEYS.VISITS);
      }
    }

    // 2. Prune uploaded media assets if excessive (keep only first 4 defaults)
    const rawMedia = localStorage.getItem(STORAGE_KEYS.MEDIA);
    if (rawMedia) {
      try {
        const media = JSON.parse(rawMedia);
        if (Array.isArray(media) && media.length > 4) {
          localStorage.setItem(STORAGE_KEYS.MEDIA, JSON.stringify(media.slice(0, 4)));
        }
      } catch {
        localStorage.removeItem(STORAGE_KEYS.MEDIA);
      }
    }

    // 3. Remove non-critical temporary keys
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const k = localStorage.key(i);
      if (k && (k.startsWith('gvf_temp_') || k.startsWith('gvf_session_') || k.includes('_cache'))) {
        localStorage.removeItem(k);
      }
    }
  } catch {
    // Ignore eviction errors
  }
}

function getItem<T>(key: string, fallback: T): T {
  // 1. Return from in-memory cache if available
  if (memoryCache.has(key)) {
    return memoryCache.get(key) as T;
  }

  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      memoryCache.set(key, parsed);
      return parsed;
    }
    return fallback;
  } catch (e) {
    console.warn('[Storage] Read warning for', key, e);
    return fallback;
  }
}

function setItem<T>(key: string, value: T): void {
  // Always update in-memory cache so current session is immediately updated
  memoryCache.set(key, value);

  if (typeof window === 'undefined') return;

  const serialized = JSON.stringify(value);

  try {
    localStorage.setItem(key, serialized);
  } catch (err: any) {
    const isQuota =
      err?.name === 'QuotaExceededError' ||
      err?.name === 'NS_ERROR_DOM_QUOTA_REACHED' ||
      err?.code === 22 ||
      err?.code === 1014 ||
      (err?.message && String(err.message).toLowerCase().includes('quota'));

    if (isQuota) {
      console.warn(`[Storage] Quota notice for "${key}". Performing automatic cache eviction...`);
      // Evict non-essential items
      evictExpendableStorage();

      try {
        localStorage.setItem(key, serialized);
        console.log(`[Storage] Successfully saved "${key}" after storage eviction.`);
        return;
      } catch {
        // If still exceeding quota, compact oversized data URLs in collections
        if (Array.isArray(value)) {
          try {
            const compacted = value.map((item: any) => {
              if (item && typeof item === 'object') {
                const clone = { ...item };
                // If item has a massive base64 image (> 60KB), avoid writing it to localStorage
                if (typeof clone.image === 'string' && clone.image.startsWith('data:image/') && clone.image.length > 60000) {
                  clone.image = ''; // Retained in memoryCache for current display
                }
                if (typeof clone.fileUrl === 'string' && clone.fileUrl.startsWith('data:image/') && clone.fileUrl.length > 60000) {
                  clone.fileUrl = '';
                }
                return clone;
              }
              return item;
            });
            localStorage.setItem(key, JSON.stringify(compacted));
            console.log(`[Storage] Saved compacted copy of "${key}" to localStorage.`);
            return;
          } catch {
            // Memory cache retains the full original payload
          }
        }
        console.warn(`[Storage] Retaining "${key}" in active session memory cache.`);
      }
    } else {
      console.warn('[Storage write notice]', err);
    }
  }
}

// Seed local storage with base presets if empty
function initializeStorage() {
  if (typeof window === 'undefined') return;

  // Prune any legacy visits that exceeded quota in previous builds
  try {
    const rawVisits = localStorage.getItem(STORAGE_KEYS.VISITS);
    if (rawVisits) {
      const parsed = JSON.parse(rawVisits);
      if (Array.isArray(parsed) && parsed.length > 50) {
        localStorage.setItem(STORAGE_KEYS.VISITS, JSON.stringify(parsed.slice(0, 50)));
      }
    }
  } catch {
    // Ignore
  }

  if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
    setItem(STORAGE_KEYS.SETTINGS, INITIAL_SITE_SETTINGS);
  }
  const storedProducts = getItem<Product[]>(STORAGE_KEYS.PRODUCTS, []);
  if (!storedProducts || storedProducts.length === 0) {
    setItem(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
  } else {
    const existingIds = new Set(storedProducts.map((p) => p.id));
    let added = false;
    for (const p of INITIAL_PRODUCTS) {
      if (!existingIds.has(p.id)) {
        storedProducts.push(p);
        existingIds.add(p.id);
        added = true;
      }
    }
    if (added) {
      setItem(STORAGE_KEYS.PRODUCTS, storedProducts);
    }
  }
  if (!localStorage.getItem(STORAGE_KEYS.POSTS)) {
    setItem(STORAGE_KEYS.POSTS, INITIAL_BLOG_POSTS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.FARMS)) {
    setItem(STORAGE_KEYS.FARMS, INITIAL_FARMS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.SERVICES)) {
    setItem(STORAGE_KEYS.SERVICES, INITIAL_SERVICES);
  }
  if (!localStorage.getItem(STORAGE_KEYS.PARTNERS)) {
    setItem(STORAGE_KEYS.PARTNERS, INITIAL_INSTITUTIONAL_PARTNERS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.IMPACT)) {
    setItem(STORAGE_KEYS.IMPACT, INITIAL_IMPACT_METRICS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.ADMINS)) {
    setItem(STORAGE_KEYS.ADMINS, [INITIAL_SUPER_ADMIN]);
  }
  if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
    const initialOrder: Order = {
      id: 'ord-init-01',
      orderNumber: 'GVF-2026-8812',
      customerName: 'Alhaji Musa Danladi',
      phone: '+234 803 219 4488',
      email: 'musa.grainfeeds@gmail.com',
      deliveryAddress: 'Plot 18, Commercial Industrial Layout, Kano, Nigeria',
      notes: 'Please expedite delivery ahead of our processing run.',
      items: [
        {
          productId: 'prod-1',
          productName: 'Commercial Hybrid Yellow Maize',
          quantity: 200,
          unit: '50kg Bag',
          unitPrice: 36000,
          subtotal: 7200000,
        },
        {
          productId: 'prod-2',
          productName: 'Premium Stone-Free Long Grain Rice',
          quantity: 50,
          unit: '50kg Bag',
          unitPrice: 49500,
          subtotal: 2475000,
        },
      ],
      totalAmount: 9675000,
      hasPriceOnRequest: false,
      status: 'Confirmed',
      createdAt: new Date(Date.now() - 3600 * 1000 * 48).toISOString(),
    };
    setItem(STORAGE_KEYS.ORDERS, [initialOrder]);
  }
  if (!localStorage.getItem(STORAGE_KEYS.MEDIA)) {
    const defaultMedia: MediaAsset[] = [
      {
        id: 'media-1',
        fileName: 'hero_african_farm_sunrise.jpg',
        fileUrl: HERO_IMAGE,
        category: 'Estate Banners',
        altText: 'Cinematic aerial view of Greenvest modern crop estate at sunrise',
        caption: 'Kaduna Commercial Grain & Irrigation Corridor',
        uploadedAt: new Date().toISOString(),
        sizeBytes: 1845000,
      },
      {
        id: 'media-2',
        fileName: 'african_agronomists_field.jpg',
        fileUrl: AGRONOMISTS_IMAGE,
        category: 'Field Operations',
        altText: 'Greenvest agronomists inspecting crops in greenhouse',
        caption: 'Precision Horticulture Agronomists at Ogun Estate',
        uploadedAt: new Date().toISOString(),
        sizeBytes: 1520000,
      },
      {
        id: 'media-3',
        fileName: 'modern_crop_harvest_farm.jpg',
        fileUrl: CROP_HARVEST_IMAGE,
        category: 'Harvest & Machinery',
        altText: 'Combine harvester harvesting golden maize field',
        caption: 'Commercial Grain Harvesting Operations',
        uploadedAt: new Date().toISOString(),
        sizeBytes: 1910000,
      },
      {
        id: 'media-4',
        fileName: 'agro_processing_facility.jpg',
        fileUrl: AGRO_PROCESSING_IMAGE,
        category: 'Processing & Facilities',
        altText: 'Industrial rice milling and bagging plant',
        caption: 'Benue Agro-Park Sortex Milling Line',
        uploadedAt: new Date().toISOString(),
        sizeBytes: 1680000,
      },
    ];
    setItem(STORAGE_KEYS.MEDIA, defaultMedia);
  }
}

initializeStorage();

// -------------------------------------------------------------
// Pub/Sub Listener System for Live UI Updates
// -------------------------------------------------------------
type DBEventListener = (event: string, data?: any) => void;
const dbListeners: Set<DBEventListener> = new Set();

function notifySubscribers(event: string, data?: any) {
  dbListeners.forEach((listener) => {
    try {
      listener(event, data);
    } catch (err) {
      console.error('Error in GreenvestDB subscriber:', err);
    }
  });
}

// -------------------------------------------------------------
// Database Mappers between Supabase (snake_case) & App (camelCase)
// -------------------------------------------------------------
function mapRemoteSettings(row: any): Partial<SiteSettings> {
  const s: Partial<SiteSettings> = {};
  if (row.company_name) s.companyName = row.company_name;
  if (row.slogan) s.slogan = row.slogan;
  if (row.logo_url && String(row.logo_url).trim()) s.logoUrl = row.logo_url;
  if (row.header_bg_color) s.headerBgColor = row.header_bg_color;
  if (row.header_text_color) s.headerTextColor = row.header_text_color;
  if (row.header_cta_primary_text) s.headerCtaPrimaryText = row.header_cta_primary_text;
  if (row.header_cta_secondary_text) s.headerCtaSecondaryText = row.header_cta_secondary_text;
  if (row.is_announcement_active !== undefined && row.is_announcement_active !== null) s.isAnnouncementActive = Boolean(row.is_announcement_active);
  if (row.announcement_text !== undefined && row.announcement_text !== null) s.announcementText = row.announcement_text;
  if (row.announcement_bg_color) s.announcementBgColor = row.announcement_bg_color;
  if (row.announcement_text_color) s.announcementTextColor = row.announcement_text_color;
  if (row.heading_font) s.headingFont = row.heading_font;
  if (row.body_font) s.bodyFont = row.body_font;
  if (row.color_forest) s.colorForest = row.color_forest;
  if (row.color_agri) s.colorAgri = row.color_agri;
  if (row.color_leaf) s.colorLeaf = row.color_leaf;
  if (row.color_gold) s.colorGold = row.color_gold;
  if (row.color_cream) s.colorCream = row.color_cream;
  if (row.color_charcoal) s.colorCharcoal = row.color_charcoal;
  if (row.hero_headline) s.heroHeadline = row.hero_headline;
  if (row.hero_subtext) s.heroSubtext = row.hero_subtext;
  if (row.hero_image && String(row.hero_image).trim()) s.heroImage = row.hero_image;
  if (row.hero_cta1_text) s.heroCta1Text = row.hero_cta1_text;
  if (row.hero_cta2_text) s.heroCta2Text = row.hero_cta2_text;
  if (row.about_headline) s.aboutHeadline = row.about_headline;
  if (row.about_description) s.aboutDescription = row.about_description;
  if (row.about_image && String(row.about_image).trim()) s.aboutImage = row.about_image;
  if (row.vision_text) s.visionText = row.vision_text;
  if (row.mission_text) s.missionText = row.mission_text;
  if (row.primary_phone) s.primaryPhone = row.primary_phone;
  if (row.whatsapp_number) s.whatsappNumber = row.whatsapp_number;
  if (row.contact_email) s.contactEmail = row.contact_email;
  if (row.office_address_abuja) s.officeAddressAbuja = row.office_address_abuja;
  if (row.office_address_lagos) s.officeAddressLagos = row.office_address_lagos;
  if (row.footer_bg_color) s.footerBgColor = row.footer_bg_color;
  if (row.footer_text_color) s.footerTextColor = row.footer_text_color;
  if (row.footer_description) s.footerDescription = row.footer_description;
  if (row.footer_copyright) s.footerCopyright = row.footer_copyright;
  if (row.total_hectares_managed) s.totalHectaresManaged = row.total_hectares_managed;
  if (row.food_produced_tonnes) s.foodProducedTonnes = row.food_produced_tonnes;
  if (row.smallholders_supported) s.smallholdersSupported = row.smallholders_supported;
  if (row.jobs_created) s.jobsCreated = row.jobs_created;
  return s;
}

function mapLocalSettingsToRemote(settings: Partial<SiteSettings>): Record<string, any> {
  const payload: Record<string, any> = {
    id: 'default',
    updated_at: new Date().toISOString(),
  };
  if (settings.companyName !== undefined) payload.company_name = settings.companyName;
  if (settings.slogan !== undefined) payload.slogan = settings.slogan;
  if (settings.logoUrl !== undefined && settings.logoUrl.trim()) payload.logo_url = settings.logoUrl;
  if (settings.headerBgColor !== undefined) payload.header_bg_color = settings.headerBgColor;
  if (settings.headerTextColor !== undefined) payload.header_text_color = settings.headerTextColor;
  if (settings.headerCtaPrimaryText !== undefined) payload.header_cta_primary_text = settings.headerCtaPrimaryText;
  if (settings.headerCtaSecondaryText !== undefined) payload.header_cta_secondary_text = settings.headerCtaSecondaryText;
  if (settings.isAnnouncementActive !== undefined) payload.is_announcement_active = settings.isAnnouncementActive;
  if (settings.announcementText !== undefined) payload.announcement_text = settings.announcementText;
  if (settings.announcementBgColor !== undefined) payload.announcement_bg_color = settings.announcementBgColor;
  if (settings.announcementTextColor !== undefined) payload.announcement_text_color = settings.announcementTextColor;
  if (settings.headingFont !== undefined) payload.heading_font = settings.headingFont;
  if (settings.bodyFont !== undefined) payload.body_font = settings.bodyFont;
  if (settings.colorForest !== undefined) payload.color_forest = settings.colorForest;
  if (settings.colorAgri !== undefined) payload.color_agri = settings.colorAgri;
  if (settings.colorLeaf !== undefined) payload.color_leaf = settings.colorLeaf;
  if (settings.colorGold !== undefined) payload.color_gold = settings.colorGold;
  if (settings.colorCream !== undefined) payload.color_cream = settings.colorCream;
  if (settings.colorCharcoal !== undefined) payload.color_charcoal = settings.colorCharcoal;
  if (settings.heroHeadline !== undefined) payload.hero_headline = settings.heroHeadline;
  if (settings.heroSubtext !== undefined) payload.hero_subtext = settings.heroSubtext;
  if (settings.heroImage !== undefined && settings.heroImage.trim()) payload.hero_image = settings.heroImage;
  if (settings.heroCta1Text !== undefined) payload.hero_cta1_text = settings.heroCta1Text;
  if (settings.heroCta2Text !== undefined) payload.hero_cta2_text = settings.heroCta2Text;
  if (settings.aboutHeadline !== undefined) payload.about_headline = settings.aboutHeadline;
  if (settings.aboutDescription !== undefined) payload.about_description = settings.aboutDescription;
  if (settings.aboutImage !== undefined && settings.aboutImage.trim()) payload.about_image = settings.aboutImage;
  if (settings.visionText !== undefined) payload.vision_text = settings.visionText;
  if (settings.missionText !== undefined) payload.mission_text = settings.missionText;
  if (settings.primaryPhone !== undefined) payload.primary_phone = settings.primaryPhone;
  if (settings.whatsappNumber !== undefined) payload.whatsapp_number = settings.whatsappNumber;
  if (settings.contactEmail !== undefined) payload.contact_email = settings.contactEmail;
  if (settings.officeAddressAbuja !== undefined) payload.office_address_abuja = settings.officeAddressAbuja;
  if (settings.officeAddressLagos !== undefined) payload.office_address_lagos = settings.officeAddressLagos;
  if (settings.footerBgColor !== undefined) payload.footer_bg_color = settings.footerBgColor;
  if (settings.footerTextColor !== undefined) payload.footer_text_color = settings.footerTextColor;
  if (settings.footerDescription !== undefined) payload.footer_description = settings.footerDescription;
  if (settings.footerCopyright !== undefined) payload.footer_copyright = settings.footerCopyright;
  if (settings.totalHectaresManaged !== undefined) payload.total_hectares_managed = settings.totalHectaresManaged;
  if (settings.foodProducedTonnes !== undefined) payload.food_produced_tonnes = settings.foodProducedTonnes;
  if (settings.smallholdersSupported !== undefined) payload.smallholders_supported = settings.smallholdersSupported;
  if (settings.jobsCreated !== undefined) payload.jobs_created = settings.jobsCreated;
  return payload;
}

function mapRemoteProduct(row: any): Product {
  return {
    id: row.id,
    name: row.name || 'Commercial Farm Produce',
    slug: row.slug || ('prod-' + Date.now()),
    category: row.category || 'Grains',
    description: row.description || 'Premium commercial harvest produce directly from Greenvest commercial estates.',
    price: row.price !== null && row.price !== undefined ? Number(row.price) : null,
    currency: row.currency || 'NGN',
    unit: row.unit || '50kg Bag',
    stock: Number(row.stock || 0),
    image: row.image && String(row.image).trim() ? row.image : CROP_HARVEST_IMAGE,
    featured: Boolean(row.featured),
    available: Boolean(row.available),
    minOrderQty: Number(row.min_order_qty || 1),
  };
}

function mapLocalProductToRemote(product: Product): Record<string, any> {
  const defaultDesc = 'Premium commercial harvest produce directly from Greenvest commercial estates.';
  const payload: Record<string, any> = {
    name: (product.name && product.name.trim()) || 'Commercial Farm Produce',
    slug:
      (product.slug && product.slug.trim()) ||
      (product.name || 'product')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '') ||
      'prod-' + Date.now(),
    category: product.category || 'Grains',
    description: (product.description && product.description.trim()) ? product.description.trim() : defaultDesc,
    price:
      product.price !== null && product.price !== undefined && !isNaN(Number(product.price))
        ? Number(product.price)
        : null,
    currency: product.currency || 'NGN',
    unit: (product.unit && product.unit.trim()) ? product.unit.trim() : '50kg Bag',
    stock: Number(product.stock ?? 100),
    image: (product.image && product.image.trim()) ? product.image.trim() : CROP_HARVEST_IMAGE,
    featured: Boolean(product.featured),
    available: Boolean(product.available),
    min_order_qty: Number(product.minOrderQty || 1),
  };
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (uuidRegex.test(product.id)) {
    payload.id = product.id;
  }
  return payload;
}

function mapRemoteFarm(row: any): Farm {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug || '',
    location: row.location || '',
    state: row.state || '',
    type: row.type || 'Crop Farming',
    acreage: row.acreage || '',
    description: row.description || '',
    keyCrops: Array.isArray(row.key_crops) ? row.key_crops : [],
    outputStats: row.output_stats || '',
    image: row.image && String(row.image).trim() ? String(row.image).trim() : HERO_IMAGE,
    coordinates: {
      x: Number(row.coordinates_x || 50),
      y: Number(row.coordinates_y || 50),
    },
    highlights: Array.isArray(row.highlights) ? row.highlights : [],
  };
}

function mapLocalFarmToRemote(farm: Farm): Record<string, any> {
  const payload: Record<string, any> = {
    name: farm.name || 'Commercial Farm Estate',
    slug: farm.slug || (farm.name || 'farm').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    location: farm.location || 'Agro-Ecological Corridor',
    state: farm.state || 'Kaduna',
    type: farm.type || 'Crop Farming',
    acreage: farm.acreage || '5,000+ Hectares',
    description: farm.description || 'Modern bio-secure commercial agribusiness production estate.',
    key_crops: Array.isArray(farm.keyCrops) ? farm.keyCrops : [],
    output_stats: farm.outputStats || 'High-Yield Commercial Harvest',
    image: farm.image && farm.image.trim() ? farm.image : HERO_IMAGE,
    coordinates_x: farm.coordinates?.x ?? 50,
    coordinates_y: farm.coordinates?.y ?? 50,
    highlights: Array.isArray(farm.highlights) ? farm.highlights : [],
  };
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (uuidRegex.test(farm.id)) {
    payload.id = farm.id;
  }
  return payload;
}

function mapRemoteService(row: any): ServiceItem {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    category: row.category,
    description: row.description,
    image: row.image && String(row.image).trim() ? String(row.image).trim() : AGRO_PROCESSING_IMAGE,
    keyActivities: Array.isArray(row.key_activities) ? row.key_activities : [],
    ctaText: row.cta_text || 'Inquire Now',
  };
}

function mapLocalServiceToRemote(service: ServiceItem): Record<string, any> {
  const payload: Record<string, any> = {
    title: service.title || 'Agribusiness Capability',
    slug: service.slug || (service.title || 'service').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    category: service.category || 'Agribusiness',
    description: service.description || 'Integrated commercial agribusiness operations.',
    image: service.image && service.image.trim() ? service.image : AGRO_PROCESSING_IMAGE,
    key_activities: Array.isArray(service.keyActivities) ? service.keyActivities : [],
    cta_text: service.ctaText || 'Inquire Now',
  };
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (uuidRegex.test(service.id)) {
    payload.id = service.id;
  }
  return payload;
}

function mapRemotePost(row: any): BlogPost {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    featuredImage: row.featured_image && String(row.featured_image).trim() ? String(row.featured_image).trim() : HERO_IMAGE,
    excerpt: row.excerpt,
    content: row.content,
    category: row.category,
    tags: Array.isArray(row.tags) ? row.tags : [],
    author: {
      name: row.author_name || 'Greenvest Research',
      role: row.author_role || 'Agronomy Desk',
    },
    publicationDate: row.publication_date,
    readTime: row.read_time,
    seoTitle: row.seo_title,
    seoDescription: row.seo_description,
    status: row.status,
    views: row.views || 0,
  };
}

function mapLocalPostToRemote(post: BlogPost): Record<string, any> {
  const payload: Record<string, any> = {
    title: post.title,
    slug: post.slug || post.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    featured_image: post.featuredImage && post.featuredImage.trim() ? post.featuredImage : HERO_IMAGE,
    excerpt: post.excerpt || 'Commercial agricultural insights from Greenvest.',
    content: post.content || 'Content coming soon.',
    category: post.category || 'Agribusiness Insights',
    tags: Array.isArray(post.tags) ? post.tags : [],
    author_name: post.author?.name || 'Greenvest Research',
    author_role: post.author?.role || 'Agronomy Desk',
    publication_date: post.publicationDate || new Date().toISOString().split('T')[0],
    read_time: post.readTime || '5 min read',
    seo_title: post.seoTitle || post.title,
    seo_description: post.seoDescription || post.excerpt || '',
    status: post.status || 'published',
    views: Number(post.views || 0),
  };
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (uuidRegex.test(post.id)) {
    payload.id = post.id;
  }
  return payload;
}

function mapRemoteOrder(row: any, items: any[] = []): Order {
  return {
    id: row.id,
    orderNumber: row.order_number,
    customerName: row.customer_name,
    phone: row.phone,
    email: row.email,
    deliveryAddress: row.delivery_address,
    notes: row.notes || '',
    items: items.map((it) => ({
      productId: it.product_id,
      productName: it.product_name,
      quantity: Number(it.quantity || 1),
      unit: it.unit || 'Bag',
      unitPrice: it.unit_price !== null && it.unit_price !== undefined ? Number(it.unit_price) : null,
      subtotal: it.subtotal !== null && it.subtotal !== undefined ? Number(it.subtotal) : null,
    })),
    totalAmount: Number(row.total_amount || 0),
    hasPriceOnRequest: Boolean(row.has_price_on_request),
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapRemoteEnquiry(row: any): ContactEnquiry {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    company: row.company,
    subject: row.subject,
    message: row.message,
    status: row.status,
    createdAt: row.created_at,
  };
}

// -------------------------------------------------------------
// Live Supabase Real-Time Subscriptions Setup
// -------------------------------------------------------------
let realtimeChannelInitialized = false;

function initRealtimeListeners() {
  if (realtimeChannelInitialized || typeof window === 'undefined') return;
  realtimeChannelInitialized = true;

  try {
    const channel = supabase.channel('greenvest_realtime_sync');

    channel
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'site_settings' },
        (payload) => {
          if (payload.new) {
            const mapped = mapRemoteSettings(payload.new);
            const current = GreenvestDB.getSettings();
            // Only merge non-empty values so empty strings from remote do not overwrite local values
            const cleanMapped: Partial<SiteSettings> = {};
            for (const [k, v] of Object.entries(mapped)) {
              if (v !== '' && v !== null && v !== undefined) {
                (cleanMapped as any)[k] = v;
              }
            }
            const updated = { ...current, ...cleanMapped };
            setItem(STORAGE_KEYS.SETTINGS, updated);
            notifySubscribers('settings_updated', updated);
          }
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'products' },
        async () => {
          await GreenvestDB.pullProductsFromSupabase();
          notifySubscribers('products_updated', GreenvestDB.getProducts());
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'farms' },
        async () => {
          await GreenvestDB.pullFarmsFromSupabase();
          notifySubscribers('farms_updated', GreenvestDB.getFarms());
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'services' },
        async () => {
          await GreenvestDB.pullServicesFromSupabase();
          notifySubscribers('services_updated', GreenvestDB.getServices());
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        async () => {
          await GreenvestDB.pullOrdersFromSupabase();
          notifySubscribers('orders_updated', GreenvestDB.getOrders());
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'blog_posts' },
        async () => {
          await GreenvestDB.pullPostsFromSupabase();
          notifySubscribers('posts_updated', GreenvestDB.getPosts());
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'contact_messages' },
        async () => {
          await GreenvestDB.pullEnquiriesFromSupabase();
          notifySubscribers('enquiries_updated', GreenvestDB.getEnquiries());
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'impact_metrics' },
        async () => {
          await GreenvestDB.pullImpactMetricsFromSupabase();
          notifySubscribers('impact_updated', GreenvestDB.getImpactMetrics());
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'media_assets' },
        async () => {
          await GreenvestDB.pullMediaAssetsFromSupabase();
          notifySubscribers('media_updated', GreenvestDB.getMediaAssets());
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'admin_requests' },
        async () => {
          await GreenvestDB.pullAdminRequestsFromSupabase();
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'admin_profiles' },
        async () => {
          await GreenvestDB.pullAdminProfilesFromSupabase();
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('[Supabase Realtime] Connected to live PostgreSQL database stream.');
        }
      });
  } catch (err) {
    console.warn('[Supabase Realtime] Could not subscribe:', err);
  }
}

function safeRemoteCall<T = any>(promiseLike: PromiseLike<T>): void {
  Promise.resolve(promiseLike).catch((err: any) => {
    // Non-blocking background sync logger
    console.debug('[Supabase Sync Notice]', err);
  });
}

// -------------------------------------------------------------
// GreenvestDB - The Unified Synchronous + Async Data Engine
// -------------------------------------------------------------
export const GreenvestDB = {
  // Subscribe to any database change (local or remote)
  subscribe(callback: DBEventListener): () => void {
    dbListeners.add(callback);
    return () => {
      dbListeners.delete(callback);
    };
  },

  // --- Site Settings ---
  getSettings(): SiteSettings {
    const saved = getItem<SiteSettings>(STORAGE_KEYS.SETTINGS, INITIAL_SITE_SETTINGS);
    return { ...INITIAL_SITE_SETTINGS, ...saved };
  },
  updateSettings(settings: Partial<SiteSettings>): SiteSettings {
    const current = this.getSettings();
    const updated = { ...current, ...settings };
    setItem(STORAGE_KEYS.SETTINGS, updated);
    notifySubscribers('settings_updated', updated);

    // Asynchronously push to Supabase
    const remotePayload = mapLocalSettingsToRemote(updated);
    safeRemoteCall(
      (async () => {
        // Fast direct update by primary key 'default'
        const { error: updateErr } = await supabase
          .from('site_settings')
          .update(remotePayload)
          .eq('id', 'default');

        if (updateErr) {
          await supabase.from('site_settings').upsert(remotePayload, { onConflict: 'id' });
        }
        console.log('[Supabase] site_settings synchronized to cloud.');
      })()
    );

    return updated;
  },

  // --- Institutional Partners (About Us) ---
  getInstitutionalPartners(): InstitutionalPartner[] {
    return getItem<InstitutionalPartner[]>(STORAGE_KEYS.PARTNERS, INITIAL_INSTITUTIONAL_PARTNERS);
  },
  saveInstitutionalPartner(partner: InstitutionalPartner): InstitutionalPartner {
    const partners = this.getInstitutionalPartners();
    const idx = partners.findIndex((p) => p.id === partner.id);
    if (idx >= 0) {
      partners[idx] = partner;
    } else {
      partners.push(partner);
    }
    setItem(STORAGE_KEYS.PARTNERS, partners);
    notifySubscribers('partners_updated', partners);

    // Try syncing to Supabase institutional_partners table if it exists
    safeRemoteCall(
      supabase
        .from('institutional_partners')
        .upsert({
          id: partner.id,
          acronym: partner.acronym,
          name: partner.name,
          category: partner.category,
          mandate: partner.mandate,
          key_initiatives: partner.keyInitiatives,
          logo: partner.logo,
          badge: partner.badge,
          location: partner.location,
          alliance_type: partner.allianceType,
          year_established: partner.yearEstablished,
          portal_link: partner.portalLink,
        })
    );

    return partner;
  },
  deleteInstitutionalPartner(id: string): void {
    const partners = this.getInstitutionalPartners().filter((p) => p.id !== id);
    setItem(STORAGE_KEYS.PARTNERS, partners);
    notifySubscribers('partners_updated', partners);

    safeRemoteCall(supabase.from('institutional_partners').delete().eq('id', id));
  },

  // --- Products ---
  getProducts(): Product[] {
    const list = getItem<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    const deletedIds = new Set(getItem<string[]>(STORAGE_KEYS.DELETED_PRODUCTS, []));
    const filteredList = list.filter((p) => !deletedIds.has(p.id));
    const existingIds = new Set(filteredList.map((p) => p.id));
    let added = false;
    for (const p of INITIAL_PRODUCTS) {
      if (!existingIds.has(p.id) && !deletedIds.has(p.id)) {
        filteredList.push(p);
        existingIds.add(p.id);
        added = true;
      }
    }
    if (added || filteredList.length !== list.length) {
      setItem(STORAGE_KEYS.PRODUCTS, filteredList);
    }
    return filteredList;
  },
  getProductById(id: string): Product | undefined {
    return this.getProducts().find((p) => p.id === id);
  },
  saveProduct(product: Product): Product {
    // Unmark from deleted if previously deleted
    const deletedIds = getItem<string[]>(STORAGE_KEYS.DELETED_PRODUCTS, []);
    if (deletedIds.includes(product.id)) {
      setItem(
        STORAGE_KEYS.DELETED_PRODUCTS,
        deletedIds.filter((dId) => dId !== product.id)
      );
    }

    // 1. Sanitize product slug and ensure uniqueness
    if (!product.slug || !product.slug.trim()) {
      product.slug =
        (product.name || 'product')
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '') || ('prod-' + Date.now());
    }
    if (!product.image || !product.image.trim()) {
      product.image = CROP_HARVEST_IMAGE;
    }
    if (!product.description || !product.description.trim()) {
      product.description = 'Premium commercial harvest produce directly from Greenvest commercial estates.';
    }
    if (!product.unit || !product.unit.trim()) {
      product.unit = '50kg Bag';
    }

    const products = this.getProducts();
    // If it's a new product and slug conflicts with an existing different product, append suffix
    const existingSlugProd = products.find((p) => p.slug === product.slug && p.id !== product.id);
    if (existingSlugProd) {
      product.slug = `${product.slug}-${Date.now().toString().slice(-4)}`;
    }

    const index = products.findIndex((p) => p.id === product.id);
    if (index >= 0) {
      products[index] = product;
    } else {
      products.unshift(product);
    }
    setItem(STORAGE_KEYS.PRODUCTS, products);
    notifySubscribers('products_updated', products);

    // Asynchronously push to Supabase
    const payload = mapLocalProductToRemote(product);
    safeRemoteCall(
      (async () => {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (uuidRegex.test(product.id)) {
          payload.id = product.id;
          const { data, error } = await supabase.from('products').upsert(payload, { onConflict: 'id' }).select();
          if (!error && data && data[0]) {
            const remoteProd = mapRemoteProduct(data[0]);
            const currentProds = GreenvestDB.getProducts();
            const pIdx = currentProds.findIndex((p) => p.id === product.id);
            if (pIdx >= 0) {
              currentProds[pIdx] = remoteProd;
              setItem(STORAGE_KEYS.PRODUCTS, currentProds);
              notifySubscribers('products_updated', currentProds);
            }
            return;
          }
        }

        // If not already a UUID or upsert failed, check if a matching product exists in Supabase
        const { data: existingRows } = await supabase
          .from('products')
          .select('id, slug, name')
          .or(`slug.eq."${product.slug}",name.eq."${product.name}"`)
          .limit(1);

        if (existingRows && existingRows[0]) {
          payload.id = existingRows[0].id;
          const { data, error } = await supabase
            .from('products')
            .update(payload)
            .eq('id', existingRows[0].id)
            .select();

          if (!error && data && data[0]) {
            const remoteProd = mapRemoteProduct(data[0]);
            const currentProds = GreenvestDB.getProducts();
            const pIdx = currentProds.findIndex((p) => p.id === product.id || p.id === remoteProd.id);
            if (pIdx >= 0) {
              currentProds[pIdx] = remoteProd;
              setItem(STORAGE_KEYS.PRODUCTS, currentProds);
              notifySubscribers('products_updated', currentProds);
            }
            return;
          }
        }

        // Otherwise insert new row
        const { data: inserted, error: insertErr } = await supabase.from('products').insert(payload).select();
        if (!insertErr && inserted && inserted[0]) {
          const remoteProd = mapRemoteProduct(inserted[0]);
          const currentProds = GreenvestDB.getProducts();
          const pIdx = currentProds.findIndex((p) => p.id === product.id);
          if (pIdx >= 0) {
            currentProds[pIdx] = remoteProd;
            setItem(STORAGE_KEYS.PRODUCTS, currentProds);
            notifySubscribers('products_updated', currentProds);
          }
        } else if (insertErr) {
          console.warn('[Supabase Products Insert Warning]:', insertErr.message);
        }
      })()
    );

    return product;
  },
  deleteProduct(id: string): void {
    const deletedIds = getItem<string[]>(STORAGE_KEYS.DELETED_PRODUCTS, []);
    if (!deletedIds.includes(id)) {
      deletedIds.push(id);
      setItem(STORAGE_KEYS.DELETED_PRODUCTS, deletedIds);
    }

    const products = getItem<Product[]>(STORAGE_KEYS.PRODUCTS, []).filter((p) => p.id !== id);
    setItem(STORAGE_KEYS.PRODUCTS, products);
    notifySubscribers('products_updated', products);

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (uuidRegex.test(id)) {
      safeRemoteCall(supabase.from('products').delete().eq('id', id));
    } else {
      safeRemoteCall(supabase.from('products').delete().eq('slug', id));
    }
  },

  // --- Farms ---
  getFarms(): Farm[] {
    return getItem<Farm[]>(STORAGE_KEYS.FARMS, INITIAL_FARMS);
  },
  saveFarm(farm: Farm): Farm {
    const farms = this.getFarms();
    const idx = farms.findIndex((f) => f.id === farm.id);
    if (idx >= 0) {
      farms[idx] = farm;
    } else {
      farms.push(farm);
    }
    setItem(STORAGE_KEYS.FARMS, farms);
    notifySubscribers('farms_updated', farms);

    const payload = mapLocalFarmToRemote(farm);
    safeRemoteCall(
      (async () => {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (uuidRegex.test(farm.id)) {
          const { error } = await supabase.from('farms').upsert(payload, { onConflict: 'id' });
          if (!error) return;
        }
        const { data, error } = await supabase.from('farms').upsert(payload, { onConflict: 'slug' }).select();
        if (!error && data && data[0]) {
          const remoteFarm = mapRemoteFarm(data[0]);
          const curr = GreenvestDB.getFarms();
          const fIdx = curr.findIndex((f) => f.id === farm.id || f.slug === remoteFarm.slug);
          if (fIdx >= 0) {
            curr[fIdx] = remoteFarm;
            setItem(STORAGE_KEYS.FARMS, curr);
            notifySubscribers('farms_updated', curr);
          }
        }
      })()
    );

    return farm;
  },
  deleteFarm(id: string): void {
    const farms = this.getFarms().filter((f) => f.id !== id);
    setItem(STORAGE_KEYS.FARMS, farms);
    notifySubscribers('farms_updated', farms);

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (uuidRegex.test(id)) {
      safeRemoteCall(supabase.from('farms').delete().eq('id', id));
    } else {
      safeRemoteCall(supabase.from('farms').delete().eq('slug', id));
    }
  },

  // --- Services ---
  getServices(): ServiceItem[] {
    return getItem<ServiceItem[]>(STORAGE_KEYS.SERVICES, INITIAL_SERVICES);
  },
  saveService(service: ServiceItem): ServiceItem {
    const services = this.getServices();
    const idx = services.findIndex((s) => s.id === service.id);
    if (idx >= 0) {
      services[idx] = service;
    } else {
      services.push(service);
    }
    setItem(STORAGE_KEYS.SERVICES, services);
    notifySubscribers('services_updated', services);

    const payload = mapLocalServiceToRemote(service);
    safeRemoteCall(
      (async () => {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (uuidRegex.test(service.id)) {
          const { error } = await supabase.from('services').upsert(payload, { onConflict: 'id' });
          if (!error) return;
        }
        const { data, error } = await supabase.from('services').upsert(payload, { onConflict: 'slug' }).select();
        if (!error && data && data[0]) {
          const remoteSrv = mapRemoteService(data[0]);
          const curr = GreenvestDB.getServices();
          const sIdx = curr.findIndex((s) => s.id === service.id || s.slug === remoteSrv.slug);
          if (sIdx >= 0) {
            curr[sIdx] = remoteSrv;
            setItem(STORAGE_KEYS.SERVICES, curr);
            notifySubscribers('services_updated', curr);
          }
        }
      })()
    );

    return service;
  },
  deleteService(id: string): void {
    const services = this.getServices().filter((s) => s.id !== id);
    setItem(STORAGE_KEYS.SERVICES, services);
    notifySubscribers('services_updated', services);

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (uuidRegex.test(id)) {
      safeRemoteCall(supabase.from('services').delete().eq('id', id));
    }
  },

  // --- Orders ---
  getOrders(): Order[] {
    return getItem<Order[]>(STORAGE_KEYS.ORDERS, []);
  },
  createOrder(payload: {
    customerName: string;
    phone: string;
    email: string;
    deliveryAddress: string;
    notes?: string;
    cartItems: { productId: string; quantity: number }[];
  }): Order {
    const products = this.getProducts();
    const orderItems: Order['items'] = [];
    let total = 0;
    let hasPriceOnRequest = false;

    for (const item of payload.cartItems) {
      const prod = products.find((p) => p.id === item.productId);
      if (!prod) continue;
      const subtotal = prod.price !== null ? prod.price * item.quantity : null;
      if (subtotal !== null) {
        total += subtotal;
      } else {
        hasPriceOnRequest = true;
      }
      orderItems.push({
        productId: prod.id,
        productName: prod.name,
        quantity: item.quantity,
        unit: prod.unit,
        unitPrice: prod.price,
        subtotal,
      });
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `GVF-2026-${randomSuffix}`;

    const newOrder: Order = {
      id: 'ord-' + Date.now(),
      orderNumber,
      customerName: payload.customerName,
      phone: payload.phone,
      email: payload.email,
      deliveryAddress: payload.deliveryAddress,
      notes: payload.notes || '',
      items: orderItems,
      totalAmount: total,
      hasPriceOnRequest,
      status: 'New',
      createdAt: new Date().toISOString(),
    };

    const existing = this.getOrders();
    existing.unshift(newOrder);
    setItem(STORAGE_KEYS.ORDERS, existing);
    notifySubscribers('orders_updated', existing);

    // Push order to Supabase
    safeRemoteCall(
      supabase
        .from('orders')
        .insert({
          order_number: orderNumber,
          customer_name: payload.customerName,
          phone: payload.phone,
          email: payload.email,
          delivery_address: payload.deliveryAddress,
          notes: payload.notes || '',
          total_amount: total,
          has_price_on_request: hasPriceOnRequest,
          status: 'New',
        })
        .select()
        .then(({ data, error }) => {
          if (!error && data && data[0]) {
            const orderId = data[0].id;
            // Insert order items
            const itemsPayload = orderItems.map((it) => {
              const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
              return {
                order_id: orderId,
                product_id: uuidRegex.test(it.productId) ? it.productId : null,
                product_name: it.productName,
                quantity: it.quantity,
                unit: it.unit,
                unit_price: it.unitPrice,
                subtotal: it.subtotal,
              };
            });
            safeRemoteCall(supabase.from('order_items').insert(itemsPayload));
          }
        })
    );

    return newOrder;
  },
  updateOrderStatus(orderId: string, status: Order['status']): Order | null {
    const orders = this.getOrders();
    const index = orders.findIndex((o) => o.id === orderId);
    if (index === -1) return null;
    orders[index].status = status;
    orders[index].updatedAt = new Date().toISOString();
    setItem(STORAGE_KEYS.ORDERS, orders);
    notifySubscribers('orders_updated', orders);

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (uuidRegex.test(orderId)) {
      safeRemoteCall(supabase.from('orders').update({ status, updated_at: new Date().toISOString() }).eq('id', orderId));
    }

    return orders[index];
  },
  deleteOrder(orderId: string): void {
    const orders = this.getOrders().filter((o) => o.id !== orderId);
    setItem(STORAGE_KEYS.ORDERS, orders);
    notifySubscribers('orders_updated', orders);

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (uuidRegex.test(orderId)) {
      safeRemoteCall(supabase.from('orders').delete().eq('id', orderId));
    } else {
      safeRemoteCall(supabase.from('orders').delete().eq('order_number', orderId));
    }
  },

  // --- Blog Posts ---
  getPosts(): BlogPost[] {
    return getItem<BlogPost[]>(STORAGE_KEYS.POSTS, INITIAL_BLOG_POSTS);
  },
  getPostBySlug(slug: string): BlogPost | undefined {
    return this.getPosts().find((p) => p.slug === slug);
  },
  savePost(post: BlogPost): BlogPost {
    const posts = this.getPosts();
    const index = posts.findIndex((p) => p.id === post.id);
    if (index >= 0) {
      posts[index] = post;
    } else {
      posts.unshift(post);
    }
    setItem(STORAGE_KEYS.POSTS, posts);
    notifySubscribers('posts_updated', posts);

    const payload = mapLocalPostToRemote(post);
    safeRemoteCall(
      supabase
        .from('blog_posts')
        .upsert(payload, { onConflict: 'slug' })
        .select()
        .then(({ data, error }) => {
          if (!error && data && data[0]) {
            const remotePost = mapRemotePost(data[0]);
            const curr = this.getPosts();
            const pIdx = curr.findIndex((p) => p.id === post.id || p.slug === remotePost.slug);
            if (pIdx >= 0) {
              curr[pIdx] = remotePost;
              setItem(STORAGE_KEYS.POSTS, curr);
            }
          }
        })
    );

    return post;
  },
  deletePost(id: string): void {
    const posts = this.getPosts().filter((p) => p.id !== id);
    setItem(STORAGE_KEYS.POSTS, posts);
    notifySubscribers('posts_updated', posts);

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (uuidRegex.test(id)) {
      safeRemoteCall(supabase.from('blog_posts').delete().eq('id', id));
    }
  },

  // --- Contact Enquiries ---
  getEnquiries(): ContactEnquiry[] {
    return getItem<ContactEnquiry[]>(STORAGE_KEYS.ENQUIRIES, []);
  },
  createEnquiry(data: Omit<ContactEnquiry, 'id' | 'status' | 'createdAt'>): ContactEnquiry {
    const newEnquiry: ContactEnquiry = {
      ...data,
      id: 'enq-' + Date.now(),
      status: 'new',
      createdAt: new Date().toISOString(),
    };
    const enquiries = this.getEnquiries();
    enquiries.unshift(newEnquiry);
    setItem(STORAGE_KEYS.ENQUIRIES, enquiries);
    notifySubscribers('enquiries_updated', enquiries);

    safeRemoteCall(
      supabase
        .from('contact_messages')
        .insert({
          name: data.name,
          email: data.email,
          phone: data.phone,
          company: data.company || null,
          subject: data.subject,
          message: data.message,
          status: 'new',
        })
    );

    return newEnquiry;
  },
  updateEnquiryStatus(id: string, status: ContactEnquiry['status']): void {
    const enquiries = this.getEnquiries();
    const index = enquiries.findIndex((e) => e.id === id);
    if (index >= 0) {
      enquiries[index].status = status;
      setItem(STORAGE_KEYS.ENQUIRIES, enquiries);
      notifySubscribers('enquiries_updated', enquiries);

      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (uuidRegex.test(id)) {
        safeRemoteCall(supabase.from('contact_messages').update({ status }).eq('id', id));
      }
    }
  },
  deleteEnquiry(id: string): void {
    const enquiries = this.getEnquiries().filter((e) => e.id !== id);
    setItem(STORAGE_KEYS.ENQUIRIES, enquiries);
    notifySubscribers('enquiries_updated', enquiries);

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (uuidRegex.test(id)) {
      safeRemoteCall(supabase.from('contact_messages').delete().eq('id', id));
    }
  },

  // --- Newsletter Subscribers ---
  getSubscribers(): NewsletterSubscriber[] {
    return getItem<NewsletterSubscriber[]>(STORAGE_KEYS.SUBSCRIBERS, []);
  },
  addSubscriber(name: string, email: string): { success: boolean; message: string } {
    const subs = this.getSubscribers();
    if (subs.some((s) => s.email.toLowerCase() === email.toLowerCase())) {
      return { success: true, message: 'You are already subscribed to Greenvest agricultural updates.' };
    }
    const newSub: NewsletterSubscriber = {
      id: 'sub-' + Date.now(),
      name,
      email,
      subscribedAt: new Date().toISOString(),
    };
    subs.unshift(newSub);
    setItem(STORAGE_KEYS.SUBSCRIBERS, subs);
    notifySubscribers('subscribers_updated', subs);

    safeRemoteCall(supabase.from('subscribers').insert({ name, email }));

    return { success: true, message: 'Thank you for subscribing to Greenvest Farms insights!' };
  },
  deleteSubscriber(id: string): void {
    const subs = this.getSubscribers().filter((s) => s.id !== id && s.email !== id);
    setItem(STORAGE_KEYS.SUBSCRIBERS, subs);
    notifySubscribers('subscribers_updated', subs);
    safeRemoteCall(supabase.from('subscribers').delete().or(`id.eq.${id},email.eq.${id}`));
  },

  // --- Admin Profiles & Requests ---
  getAdminProfiles(): AdminProfile[] {
    return getItem<AdminProfile[]>(STORAGE_KEYS.ADMINS, [INITIAL_SUPER_ADMIN]);
  },
  getAdminRequests(): AdminRequest[] {
    return getItem<AdminRequest[]>(STORAGE_KEYS.ADMIN_REQUESTS, []);
  },
  createAdminRequest(fullName: string, email: string, password: string, reason: string): AdminRequest {
    const cleanEmail = email.trim().toLowerCase();
    const requests = this.getAdminRequests();
    const existingIndex = requests.findIndex((r) => r.email.toLowerCase() === cleanEmail);
    const newReq: AdminRequest = {
      id: existingIndex >= 0 ? requests[existingIndex].id : 'req-' + Date.now(),
      fullName,
      email: cleanEmail,
      password,
      reason,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    if (existingIndex >= 0) {
      requests[existingIndex] = newReq;
    } else {
      requests.unshift(newReq);
    }
    setItem(STORAGE_KEYS.ADMIN_REQUESTS, requests);
    notifySubscribers('admin_requests_updated', requests);

    if (typeof window !== 'undefined') {
      localStorage.setItem(`gvf_admin_pwd_${cleanEmail}`, password);
    }

    safeRemoteCall(
      supabase
        .from('admin_requests')
        .upsert(
          {
            full_name: fullName,
            email: cleanEmail,
            password_hash: password,
            reason,
            status: 'pending',
          },
          { onConflict: 'email' }
        )
    );

    return newReq;
  },
  updateAdminRequestStatus(
    requestId: string,
    status: AdminRequest['status'],
    role: AdminProfile['role'] = 'admin',
    reviewedBy: string = 'Super Admin'
  ): void {
    const requests = this.getAdminRequests();
    const req = requests.find((r) => r.id === requestId || r.email.toLowerCase() === requestId.toLowerCase());
    if (!req) return;
    req.status = status;
    req.reviewedAt = new Date().toISOString();
    req.reviewedBy = reviewedBy;
    setItem(STORAGE_KEYS.ADMIN_REQUESTS, requests);
    notifySubscribers('admin_requests_updated', requests);

    // Sync status back to Supabase admin_requests table
    safeRemoteCall(
      supabase
        .from('admin_requests')
        .update({
          status,
          reviewed_at: req.reviewedAt,
          reviewed_by: reviewedBy,
        })
        .eq('email', req.email)
    );

    if (status === 'approved') {
      const admins = this.getAdminProfiles();
      const existing = admins.find((a) => a.email.toLowerCase() === req.email.toLowerCase());
      if (existing) {
        existing.status = 'active';
        existing.role = role;
      } else {
        admins.push({
          id: 'admin-' + Date.now(),
          email: req.email,
          fullName: req.fullName,
          role,
          status: 'active',
          createdAt: new Date().toISOString(),
        });
      }
      setItem(STORAGE_KEYS.ADMINS, admins);
      notifySubscribers('admin_profiles_updated', admins);

      // Save to Supabase
      safeRemoteCall(
        supabase
          .from('admin_profiles')
          .upsert(
            {
              email: req.email,
              full_name: req.fullName,
              role,
              status: 'active',
            },
            { onConflict: 'email' }
          )
      );
    }
  },
  updateAdminRole(adminId: string, role: AdminProfile['role']): void {
    const admins = this.getAdminProfiles();
    const admin = admins.find((a) => a.id === adminId);
    if (admin) {
      admin.role = role;
      setItem(STORAGE_KEYS.ADMINS, admins);
    }
  },
  toggleAdminStatus(adminId: string): void {
    const admins = this.getAdminProfiles();
    const admin = admins.find((a) => a.id === adminId);
    if (admin && admin.email !== 'farmgreenvest@gmail.com') {
      admin.status = admin.status === 'active' ? 'suspended' : 'active';
      setItem(STORAGE_KEYS.ADMINS, admins);
    }
  },
  deleteAdmin(adminId: string): void {
    const admins = this.getAdminProfiles().filter(
      (a) => a.id !== adminId && a.email !== 'farmgreenvest@gmail.com'
    );
    setItem(STORAGE_KEYS.ADMINS, admins);
  },

  // --- Auth Session ---
  getActiveAdminSession(): AdminProfile | null {
    return getItem<AdminProfile | null>(STORAGE_KEYS.CURRENT_ADMIN, null);
  },
  setActiveAdminSession(admin: AdminProfile | null): void {
    setItem(STORAGE_KEYS.CURRENT_ADMIN, admin);
  },

  // --- Analytics Visits ---
  trackVisit(path: string): void {
    if (typeof window === 'undefined') return;
    if (path.startsWith('/gv-console-2026')) return;

    let sessionId = sessionStorage.getItem('gvf_session_id');
    if (!sessionId) {
      sessionId = 'sess_' + Math.random().toString(36).substring(2, 9);
      sessionStorage.setItem('gvf_session_id', sessionId);
    }

    const visits = getItem<SiteVisit[]>(STORAGE_KEYS.VISITS, []);
    const newVisit: SiteVisit = {
      id: 'vis_' + Date.now(),
      path,
      referrer: document.referrer || 'direct',
      userAgent: navigator.userAgent.substring(0, 80),
      timestamp: new Date().toISOString(),
      sessionId,
    };
    visits.unshift(newVisit);
    if (visits.length > 50) {
      visits.length = 50;
    }
    setItem(STORAGE_KEYS.VISITS, visits);

    safeRemoteCall(
      supabase
        .from('site_visits')
        .insert({
          path,
          referrer: newVisit.referrer,
          user_agent: newVisit.userAgent,
          session_id: sessionId,
        })
    );
  },
  getVisits(): SiteVisit[] {
    return getItem<SiteVisit[]>(STORAGE_KEYS.VISITS, []);
  },

  // --- Impact Metrics ---
  getImpactMetrics(): ImpactMetric[] {
    return getItem<ImpactMetric[]>(STORAGE_KEYS.IMPACT, INITIAL_IMPACT_METRICS);
  },
  saveImpactMetrics(metrics: ImpactMetric[]): void {
    setItem(STORAGE_KEYS.IMPACT, metrics);
    notifySubscribers('impact_updated', metrics);

    safeRemoteCall(
      (async () => {
        for (const m of metrics) {
          const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
          if (uuidRegex.test(m.id)) {
            await supabase.from('impact_metrics').upsert({
              id: m.id,
              label: m.label,
              value: m.value,
              unit: m.unit,
              description: m.description,
            });
          } else {
            await supabase.from('impact_metrics').insert({
              label: m.label,
              value: m.value,
              unit: m.unit,
              description: m.description,
            });
          }
        }
      })()
    );
  },
  deleteImpactMetric(id: string): void {
    const metrics = this.getImpactMetrics().filter((m) => m.id !== id);
    this.saveImpactMetrics(metrics);
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (uuidRegex.test(id)) {
      safeRemoteCall(supabase.from('impact_metrics').delete().eq('id', id));
    }
  },

  // --- Media Assets ---
  getMediaAssets(): MediaAsset[] {
    return getItem<MediaAsset[]>(STORAGE_KEYS.MEDIA, []);
  },
  uploadMedia(asset: Omit<MediaAsset, 'id' | 'uploadedAt'>): MediaAsset {
    const media = this.getMediaAssets();
    const newAsset: MediaAsset = {
      ...asset,
      id: 'med-' + Date.now(),
      uploadedAt: new Date().toISOString(),
    };
    media.unshift(newAsset);
    if (media.length > 50) {
      media.length = 50;
    }
    setItem(STORAGE_KEYS.MEDIA, media);
    notifySubscribers('media_updated', media);

    // Save directly to Supabase media_assets table
    safeRemoteCall(
      supabase.from('media_assets').insert({
        file_name: newAsset.fileName,
        file_url: newAsset.fileUrl,
        category: newAsset.category,
        alt_text: newAsset.altText,
        caption: newAsset.caption || '',
        size_bytes: newAsset.sizeBytes || newAsset.fileUrl.length,
      })
    );

    return newAsset;
  },
  deleteMedia(id: string): void {
    const media = this.getMediaAssets().filter((m) => m.id !== id);
    setItem(STORAGE_KEYS.MEDIA, media);
    notifySubscribers('media_updated', media);

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (uuidRegex.test(id)) {
      safeRemoteCall(supabase.from('media_assets').delete().eq('id', id));
    }
  },

  async pullMediaAssetsFromSupabase(): Promise<MediaAsset[]> {
    try {
      const { data, error } = await supabase
        .from('media_assets')
        .select('*')
        .order('uploaded_at', { ascending: false });

      if (!error && data && data.length > 0) {
        const mapped: MediaAsset[] = data.map((row: any) => ({
          id: row.id,
          fileName: row.file_name,
          fileUrl: row.file_url,
          category: row.category,
          altText: row.alt_text,
          caption: row.caption || '',
          sizeBytes: Number(row.size_bytes || 0),
          uploadedAt: row.uploaded_at,
        }));
        setItem(STORAGE_KEYS.MEDIA, mapped);
        notifySubscribers('media_updated', mapped);
        return mapped;
      }
    } catch (e) {
      console.warn('[Supabase] Failed to pull media_assets:', e);
    }
    return this.getMediaAssets();
  },

  // -------------------------------------------------------------
  // Full Two-Way Supabase Synchronization Methods
  // -------------------------------------------------------------

  async pullSettingsFromSupabase(): Promise<SiteSettings> {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('id', 'default')
        .maybeSingle();

      if (!error && data) {
        const mapped = mapRemoteSettings(data);
        const current = this.getSettings();
        const cleanMapped: Partial<SiteSettings> = {};
        for (const [k, v] of Object.entries(mapped)) {
          if (v !== '' && v !== null && v !== undefined) {
            (cleanMapped as any)[k] = v;
          }
        }
        const merged = { ...current, ...cleanMapped };
        setItem(STORAGE_KEYS.SETTINGS, merged);
        return merged;
      }
    } catch (e) {
      console.warn('[Supabase] Failed to pull site_settings:', e);
    }
    return this.getSettings();
  },

  async pullProductsFromSupabase(): Promise<Product[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        const mapped = data.map(mapRemoteProduct);
        const current = this.getProducts();
        // Smart merge: retain any newly created local products that haven't synced to cloud yet
        const merged = [...mapped];
        for (const loc of current) {
          const exists = mapped.some((m) => m.id === loc.id || (loc.slug && m.slug === loc.slug));
          if (!exists) {
            merged.push(loc);
          }
        }
        setItem(STORAGE_KEYS.PRODUCTS, merged);
        return merged;
      } else if (!error && data && data.length === 0) {
        // Remote is empty, seed initial products to Supabase!
        const initial = this.getProducts();
        for (const p of initial) {
          const payload = mapLocalProductToRemote(p);
          await supabase.from('products').upsert(payload, { onConflict: 'slug' });
        }
      }
    } catch (e) {
      console.warn('[Supabase] Failed to pull products:', e);
    }
    return this.getProducts();
  },

  async pullFarmsFromSupabase(): Promise<Farm[]> {
    try {
      const { data, error } = await supabase
        .from('farms')
        .select('*')
        .order('created_at', { ascending: true });

      if (!error && data && data.length > 0) {
        const mapped = data.map(mapRemoteFarm);
        setItem(STORAGE_KEYS.FARMS, mapped);
        return mapped;
      } else if (!error && data && data.length === 0) {
        // Remote is empty, seed initial farms to Supabase!
        const initial = this.getFarms();
        for (const f of initial) {
          const payload = mapLocalFarmToRemote(f);
          await supabase.from('farms').upsert(payload, { onConflict: 'slug' });
        }
      }
    } catch (e) {
      console.warn('[Supabase] Failed to pull farms:', e);
    }
    return this.getFarms();
  },

  async pullServicesFromSupabase(): Promise<ServiceItem[]> {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('created_at', { ascending: true });

      if (!error && data && data.length > 0) {
        const mapped = data.map(mapRemoteService);
        setItem(STORAGE_KEYS.SERVICES, mapped);
        return mapped;
      } else if (!error && data && data.length === 0) {
        // Remote is empty, seed initial services to Supabase!
        const initial = this.getServices();
        for (const s of initial) {
          const payload = mapLocalServiceToRemote(s);
          await supabase.from('services').upsert(payload, { onConflict: 'slug' });
        }
      }
    } catch (e) {
      console.warn('[Supabase] Failed to pull services:', e);
    }
    return this.getServices();
  },

  async pullPostsFromSupabase(): Promise<BlogPost[]> {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        const mapped = data.map(mapRemotePost);
        setItem(STORAGE_KEYS.POSTS, mapped);
        return mapped;
      } else if (!error && data && data.length === 0) {
        // Remote is empty, seed initial posts to Supabase!
        const initial = this.getPosts();
        for (const p of initial) {
          const payload = mapLocalPostToRemote(p);
          await supabase.from('blog_posts').upsert(payload, { onConflict: 'slug' });
        }
      }
    } catch (e) {
      console.warn('[Supabase] Failed to pull blog_posts:', e);
    }
    return this.getPosts();
  },

  async pullOrdersFromSupabase(): Promise<Order[]> {
    try {
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .order('created_at', { ascending: false });

      if (!ordersError && ordersData && ordersData.length > 0) {
        const mapped = ordersData.map((row) => mapRemoteOrder(row, row.order_items || []));
        setItem(STORAGE_KEYS.ORDERS, mapped);
        return mapped;
      }
    } catch (e) {
      console.warn('[Supabase] Failed to pull orders:', e);
    }
    return this.getOrders();
  },

  async pullEnquiriesFromSupabase(): Promise<ContactEnquiry[]> {
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        const mapped = data.map(mapRemoteEnquiry);
        setItem(STORAGE_KEYS.ENQUIRIES, mapped);
        return mapped;
      }
    } catch (e) {
      console.warn('[Supabase] Failed to pull contact messages:', e);
    }
    return this.getEnquiries();
  },

  async pullImpactMetricsFromSupabase(): Promise<ImpactMetric[]> {
    try {
      const { data, error } = await supabase
        .from('impact_metrics')
        .select('*')
        .order('id', { ascending: true });

      if (!error && data && data.length > 0) {
        const mapped: ImpactMetric[] = data.map((row: any) => ({
          id: row.id,
          label: row.label,
          value: row.value,
          unit: row.unit,
          description: row.description,
        }));
        setItem(STORAGE_KEYS.IMPACT, mapped);
        return mapped;
      } else if (!error && data && data.length === 0) {
        // Remote is empty, seed initial impact metrics to Supabase!
        const initial = this.getImpactMetrics();
        for (const m of initial) {
          await supabase.from('impact_metrics').insert({
            label: m.label,
            value: m.value,
            unit: m.unit,
            description: m.description,
          });
        }
      }
    } catch (e) {
      console.warn('[Supabase] Failed to pull impact_metrics:', e);
    }
    return this.getImpactMetrics();
  },

  async pullPartnersFromSupabase(): Promise<InstitutionalPartner[]> {
    try {
      const { data, error } = await supabase
        .from('institutional_partners')
        .select('*')
        .order('name', { ascending: true });

      if (!error && data && data.length > 0) {
        const mapped: InstitutionalPartner[] = data.map((row: any) => ({
          id: row.id,
          acronym: row.acronym,
          name: row.name,
          category: row.category,
          mandate: row.mandate,
          keyInitiatives: Array.isArray(row.key_initiatives)
            ? row.key_initiatives
            : typeof row.key_initiatives === 'string'
            ? JSON.parse(row.key_initiatives)
            : [],
          logo: row.logo && String(row.logo).trim() ? String(row.logo).trim() : AGRONOMISTS_IMAGE,
          badge: row.badge,
          location: row.location,
          allianceType: row.alliance_type,
          yearEstablished: row.year_established,
          portalLink: row.portal_link,
        }));
        setItem(STORAGE_KEYS.PARTNERS, mapped);
        return mapped;
      } else if (!error && data && data.length === 0) {
        // Remote table exists but is empty, seed initial partners!
        const initial = this.getInstitutionalPartners();
        for (const p of initial) {
          await supabase.from('institutional_partners').upsert(
            {
              id: p.id,
              acronym: p.acronym,
              name: p.name,
              category: p.category,
              mandate: p.mandate,
              key_initiatives: p.keyInitiatives,
              logo: p.logo,
              badge: p.badge,
              location: p.location,
              alliance_type: p.allianceType,
              year_established: p.yearEstablished,
              portal_link: p.portalLink,
            },
            { onConflict: 'id' }
          );
        }
      }
    } catch (e) {
      console.warn('[Supabase] Failed to pull institutional_partners:', e);
    }
    return this.getInstitutionalPartners();
  },

  async pullAdminRequestsFromSupabase(): Promise<AdminRequest[]> {
    try {
      const { data, error } = await supabase
        .from('admin_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        const local = this.getAdminRequests();
        const localMap = new Map(local.map((r) => [r.email.toLowerCase(), r]));

        const mapped: AdminRequest[] = data.map((row: any) => {
          const existing = localMap.get(String(row.email).toLowerCase());
          return {
            id: row.id,
            fullName: row.full_name,
            email: row.email,
            password: row.password_hash || (existing ? existing.password : 'Farmvest@2026'),
            reason: row.reason || '',
            status: row.status || 'pending',
            requestedRole: row.requested_role || 'admin',
            createdAt: row.created_at || new Date().toISOString(),
            reviewedAt: row.reviewed_at || undefined,
            reviewedBy: row.reviewed_by || undefined,
          };
        });

        // Also preserve any local requests that haven't synced yet
        const remoteEmails = new Set(mapped.map((r) => r.email.toLowerCase()));
        for (const l of local) {
          if (!remoteEmails.has(l.email.toLowerCase())) {
            mapped.push(l);
          }
        }

        setItem(STORAGE_KEYS.ADMIN_REQUESTS, mapped);
        notifySubscribers('admin_requests_updated', mapped);
        return mapped;
      }
    } catch (e) {
      console.warn('[Supabase] Failed to pull admin requests:', e);
    }
    return this.getAdminRequests();
  },

  async pullAdminProfilesFromSupabase(): Promise<AdminProfile[]> {
    try {
      const { data, error } = await supabase
        .from('admin_profiles')
        .select('*')
        .order('created_at', { ascending: true });

      if (!error && data && data.length > 0) {
        const mapped: AdminProfile[] = data.map((row: any) => ({
          id: row.id,
          email: row.email,
          fullName: row.full_name,
          role: row.role,
          status: row.status,
          createdAt: row.created_at,
        }));

        if (!mapped.some((a) => a.email.toLowerCase() === INITIAL_SUPER_ADMIN.email.toLowerCase())) {
          mapped.unshift(INITIAL_SUPER_ADMIN);
        }

        setItem(STORAGE_KEYS.ADMINS, mapped);
        notifySubscribers('admin_profiles_updated', mapped);
        return mapped;
      }
    } catch (e) {
      console.warn('[Supabase] Failed to pull admin profiles:', e);
    }
    return this.getAdminProfiles();
  },

  // Main Initial Sync: Pulls all tables from Supabase into the application
  async syncFromSupabase(): Promise<{
    settings: SiteSettings;
    products: Product[];
    farms: Farm[];
    services: ServiceItem[];
    posts: BlogPost[];
    orders: Order[];
    enquiries: ContactEnquiry[];
    impact: ImpactMetric[];
    partners: InstitutionalPartner[];
    media: MediaAsset[];
    adminRequests: AdminRequest[];
    adminProfiles: AdminProfile[];
  }> {
    initRealtimeListeners();

    const [settings, products, farms, services, posts, orders, enquiries, impact, partners, media, adminRequests, adminProfiles] =
      await Promise.all([
        this.pullSettingsFromSupabase(),
        this.pullProductsFromSupabase(),
        this.pullFarmsFromSupabase(),
        this.pullServicesFromSupabase(),
        this.pullPostsFromSupabase(),
        this.pullOrdersFromSupabase(),
        this.pullEnquiriesFromSupabase(),
        this.pullImpactMetricsFromSupabase(),
        this.pullPartnersFromSupabase(),
        this.pullMediaAssetsFromSupabase(),
        this.pullAdminRequestsFromSupabase(),
        this.pullAdminProfilesFromSupabase(),
      ]);

    notifySubscribers('initial_sync_completed', {
      settings,
      products,
      farms,
      services,
      posts,
      orders,
      enquiries,
      impact,
      partners,
      media,
      adminRequests,
      adminProfiles,
    });

    return { settings, products, farms, services, posts, orders, enquiries, impact, partners, media, adminRequests, adminProfiles };
  },

  // Dynamic credentials update and client re-initialization
  async reconnectSupabase(newUrl?: string, newKey?: string) {
    if (newUrl && newUrl.trim()) {
      localStorage.setItem('gvf_supabase_url', sanitizeSupabaseUrl(newUrl));
    }
    if (newKey && newKey.trim()) {
      localStorage.setItem('gvf_supabase_anon_key', newKey.trim());
    }
    const creds = getSupabaseCredentials();
    SUPABASE_URL = creds.url;
    SUPABASE_ANON_KEY = creds.anonKey;
    try {
      supabase.removeAllChannels();
    } catch {
      // Ignore channel removal error
    }
    supabase = createSupabaseClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    realtimeChannelInitialized = false;
    return this.syncFromSupabase();
  },

  // Diagnostic Ping & Table Verification across all Supabase tables
  async testConnection(): Promise<{
    success: boolean;
    url: string;
    latencyMs: number;
    tables: { [table: string]: number | string };
    error?: string;
  }> {
    const startTime = performance.now();
    try {
      // Test site_settings
      const { data: settingsData, error: settingsError } = await supabase
        .from('site_settings')
        .select('count', { count: 'exact', head: true });

      const latencyMs = Math.round(performance.now() - startTime);

      if (settingsError) {
        return {
          success: false,
          url: SUPABASE_URL,
          latencyMs,
          tables: {},
          error: settingsError.message,
        };
      }

      const getTableCount = async (tableName: string): Promise<number | string> => {
        try {
          const { count, error } = await supabase
            .from(tableName)
            .select('*', { count: 'exact', head: true });
          if (error) {
            return 'Not Migrated';
          }
          return count ?? 0;
        } catch {
          return 'Not Migrated';
        }
      };

      const [
        productsCount,
        farmsCount,
        servicesCount,
        postsCount,
        ordersCount,
        messagesCount,
        subscribersCount,
        impactCount,
        partnersCount,
        visitsCount,
        adminsCount,
      ] = await Promise.all([
        getTableCount('products'),
        getTableCount('farms'),
        getTableCount('services'),
        getTableCount('blog_posts'),
        getTableCount('orders'),
        getTableCount('contact_messages'),
        getTableCount('subscribers'),
        getTableCount('impact_metrics'),
        getTableCount('institutional_partners'),
        getTableCount('site_visits'),
        getTableCount('admin_profiles'),
      ]);

      return {
        success: true,
        url: SUPABASE_URL,
        latencyMs,
        tables: {
          site_settings: settingsData !== null ? 1 : 0,
          products: productsCount,
          farms: farmsCount,
          services: servicesCount,
          blog_posts: postsCount,
          orders: ordersCount,
          contact_messages: messagesCount,
          subscribers: subscribersCount,
          impact_metrics: impactCount,
          institutional_partners: partnersCount,
          site_visits: visitsCount,
          admin_profiles: adminsCount,
        },
      };
    } catch (err: any) {
      return {
        success: false,
        url: SUPABASE_URL,
        latencyMs: Math.round(performance.now() - startTime),
        tables: {},
        error: err?.message || 'Connection failed',
      };
    }
  },
};

// -------------------------------------------------------------
// Production Supabase PostgreSQL Schema Script
// -------------------------------------------------------------
export const SUPABASE_SQL_SCRIPT = `-- =========================================================================
-- GREENVEST FARMS - PRODUCTION SUPABASE DATABASE SCHEMA
-- Target URL: https://tufpcwyufqrntbuytndc.supabase.co
-- Generated for Greenvest Farms ("Cultivating Wealth, Feeding Nations")
-- Includes:
--   1. Extensions & Custom Types
--   2. 15 Dedicated Tables (Settings, Products, Orders, Blog, Users, Requests)
--   3. Storage Bucket ("site-media") & Public Access Policies
--   4. Row Level Security (RLS) Policies
--   5. Seed Data (Root Super Admin, Products, Blog Posts, Initial Config)
-- =========================================================================

-- Step 1: Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Step 2: Custom Enums
DO $$ BEGIN
    CREATE TYPE admin_role_type AS ENUM ('super_admin', 'admin', 'editor');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE order_status_type AS ENUM ('New', 'Contacted', 'Confirmed', 'Processing', 'Ready', 'Delivered', 'Cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE admin_request_status_type AS ENUM ('pending', 'approved', 'rejected', 'suspended');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Step 3: Admin Profiles Table
CREATE TABLE IF NOT EXISTS public.admin_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role admin_role_type DEFAULT 'admin' NOT NULL,
    status TEXT DEFAULT 'active' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    last_login TIMESTAMPTZ
);

-- Step 4: Admin Access Requests (For New Admin Signups)
CREATE TABLE IF NOT EXISTS public.admin_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT,
    reason TEXT NOT NULL,
    status admin_request_status_type DEFAULT 'pending' NOT NULL,
    requested_role admin_role_type DEFAULT 'admin' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    reviewed_at TIMESTAMPTZ,
    reviewed_by TEXT
);

-- Step 5: Site Settings Table (Controls Header, Hero, Typography, Colors, Footer)
CREATE TABLE IF NOT EXISTS public.site_settings (
    id TEXT PRIMARY KEY DEFAULT 'default',
    company_name TEXT NOT NULL DEFAULT 'Greenvest Farms',
    slogan TEXT NOT NULL DEFAULT 'Cultivating Wealth, Feeding Nations.',
    logo_url TEXT DEFAULT '',
    
    -- Header & Banner
    header_bg_color TEXT DEFAULT '#075E2B',
    header_text_color TEXT DEFAULT '#FFFFFF',
    header_cta_primary_text TEXT DEFAULT 'Partner With Us',
    header_cta_secondary_text TEXT DEFAULT 'Order Farm Products',
    is_announcement_active BOOLEAN DEFAULT true,
    announcement_text TEXT DEFAULT '🌾 Harvest Season 2026 bulk supply agreements now open for commercial off-takers.',
    announcement_bg_color TEXT DEFAULT '#F4B400',
    announcement_text_color TEXT DEFAULT '#075E2B',
    
    -- Typography & Styling
    heading_font TEXT DEFAULT 'Cormorant Garamond',
    body_font TEXT DEFAULT 'Plus Jakarta Sans',
    color_forest TEXT DEFAULT '#075E2B',
    color_agri TEXT DEFAULT '#2E8B57',
    color_leaf TEXT DEFAULT '#7CB342',
    color_gold TEXT DEFAULT '#F4B400',
    color_cream TEXT DEFAULT '#F7F3E8',
    color_charcoal TEXT DEFAULT '#263238',
    
    -- Hero Section
    hero_headline TEXT NOT NULL DEFAULT 'Growing Tomorrow’s Prosperity Today.',
    hero_subtext TEXT NOT NULL DEFAULT 'Sustainable farming. Smart investment. A healthier, food-secure Africa.',
    hero_image TEXT DEFAULT '',
    hero_cta1_text TEXT DEFAULT 'Explore Our Farms',
    hero_cta2_text TEXT DEFAULT 'Partner With Us',
    
    -- About Section
    about_headline TEXT DEFAULT 'Agriculture Is More Than Farming. It Is an Investment in the Future.',
    about_description TEXT DEFAULT 'Greenvest Farms is a forward-looking African agribusiness committed to modern, sustainable and profitable farming.',
    about_image TEXT DEFAULT '',
    vision_text TEXT DEFAULT 'To be Africa’s most trusted and technologically advanced agribusiness conglomerate.',
    mission_text TEXT DEFAULT 'To engineer modern, industrial-scale agricultural ecosystems by fusing agronomic precision and automated processing.',
    
    -- Contact & Addresses
    primary_phone TEXT NOT NULL DEFAULT '+234 813 948 7363',
    whatsapp_number TEXT NOT NULL DEFAULT '2348139487363',
    contact_email TEXT NOT NULL DEFAULT 'farmgreenvest@gmail.com',
    office_address_abuja TEXT DEFAULT 'Plot 104, Commercial Agriculture Boulevard, Central Business District, Abuja, Nigeria',
    office_address_lagos TEXT DEFAULT 'Epe Agribusiness Logistics Hub, Lekki-Epe Expressway, Lagos State, Nigeria',
    
    -- Footer Section
    footer_bg_color TEXT DEFAULT '#05441F',
    footer_text_color TEXT DEFAULT '#FFFFFF',
    footer_description TEXT DEFAULT 'Cultivating Wealth, Feeding Nations across Africa.',
    footer_copyright TEXT DEFAULT '© 2026 Greenvest Farms Limited. All rights reserved.',
    
    -- Impact Numbers
    total_hectares_managed TEXT DEFAULT '18,500+',
    food_produced_tonnes TEXT DEFAULT '145,000+',
    smallholders_supported TEXT DEFAULT '12,400+',
    jobs_created TEXT DEFAULT '4,850+',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 6: Products Table
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    price NUMERIC(12, 2), -- NULL means 'Price on Request'
    currency TEXT DEFAULT 'NGN' NOT NULL,
    unit TEXT NOT NULL,
    stock INTEGER DEFAULT 0 NOT NULL,
    image TEXT NOT NULL,
    featured BOOLEAN DEFAULT false,
    available BOOLEAN DEFAULT true,
    min_order_qty INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 7: Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number TEXT UNIQUE NOT NULL,
    customer_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    delivery_address TEXT NOT NULL,
    notes TEXT,
    total_amount NUMERIC(14, 2) DEFAULT 0.00 NOT NULL,
    has_price_on_request BOOLEAN DEFAULT false,
    status order_status_type DEFAULT 'New' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 8: Order Items Table
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    product_name TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    unit TEXT NOT NULL,
    unit_price NUMERIC(12, 2),
    subtotal NUMERIC(14, 2)
);

-- Step 9: Blog Posts Table
CREATE TABLE IF NOT EXISTS public.blog_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    featured_image TEXT NOT NULL,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}',
    author_name TEXT NOT NULL,
    author_role TEXT NOT NULL,
    publication_date TEXT NOT NULL,
    read_time TEXT DEFAULT '5 min read',
    seo_title TEXT,
    seo_description TEXT,
    status TEXT DEFAULT 'published' NOT NULL,
    views INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 10: Farms Table
CREATE TABLE IF NOT EXISTS public.farms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    location TEXT NOT NULL,
    state TEXT NOT NULL,
    type TEXT NOT NULL,
    acreage TEXT NOT NULL,
    description TEXT NOT NULL,
    key_crops TEXT[] DEFAULT '{}',
    output_stats TEXT NOT NULL,
    image TEXT NOT NULL,
    coordinates_x NUMERIC(5, 2) DEFAULT 50,
    coordinates_y NUMERIC(5, 2) DEFAULT 50,
    highlights TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 11: Services Table
CREATE TABLE IF NOT EXISTS public.services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    image TEXT NOT NULL,
    key_activities TEXT[] DEFAULT '{}',
    cta_text TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 11b: Institutional Partners Table
CREATE TABLE IF NOT EXISTS public.institutional_partners (
    id TEXT PRIMARY KEY,
    acronym TEXT NOT NULL,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    mandate TEXT NOT NULL,
    key_initiatives TEXT[] DEFAULT '{}',
    logo TEXT,
    badge TEXT NOT NULL,
    location TEXT NOT NULL,
    alliance_type TEXT NOT NULL,
    year_established TEXT,
    portal_link TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 12: Contact Messages Table
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    company TEXT,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'new' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 13: Newsletter Subscribers
CREATE TABLE IF NOT EXISTS public.subscribers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    subscribed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 14: Analytics Visits Table
CREATE TABLE IF NOT EXISTS public.site_visits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    path TEXT NOT NULL,
    referrer TEXT,
    user_agent TEXT,
    session_id TEXT NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Step 15: Media Assets (Storage Bucket "site-media" Catalog)
CREATE TABLE IF NOT EXISTS public.media_assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    file_name TEXT NOT NULL,
    file_url TEXT NOT NULL,
    category TEXT NOT NULL,
    alt_text TEXT NOT NULL,
    caption TEXT,
    size_bytes BIGINT NOT NULL,
    uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 16: Impact Metrics Table
CREATE TABLE IF NOT EXISTS public.impact_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    label TEXT NOT NULL,
    value TEXT NOT NULL,
    unit TEXT NOT NULL,
    description TEXT NOT NULL
);

-- Step 17: Storage Bucket Setup
INSERT INTO storage.buckets (id, name, public)
VALUES ('site-media', 'site-media', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public Read Media Objects"
ON storage.objects FOR SELECT
USING (bucket_id = 'site-media');

CREATE POLICY "Authenticated Insert Media Objects"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'site-media');

CREATE POLICY "Authenticated Delete Media Objects"
ON storage.objects FOR DELETE
USING (bucket_id = 'site-media');

-- Step 18: Row Level Security (RLS)
ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.institutional_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.impact_metrics ENABLE ROW LEVEL SECURITY;

-- Public Read Policies
CREATE POLICY "Allow Public Read Settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Allow Public Read Products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Allow Public Read Posts" ON public.blog_posts FOR SELECT USING (true);
CREATE POLICY "Allow Public Read Farms" ON public.farms FOR SELECT USING (true);
CREATE POLICY "Allow Public Read Services" ON public.services FOR SELECT USING (true);
CREATE POLICY "Allow Public Read Partners" ON public.institutional_partners FOR SELECT USING (true);
CREATE POLICY "Allow Public Read Media" ON public.media_assets FOR SELECT USING (true);
CREATE POLICY "Allow Public Read Impact" ON public.impact_metrics FOR SELECT USING (true);

-- Public Insert Policies (Orders, Messages, Newsletter, Telemetry, Admin Requests)
CREATE POLICY "Allow Public Insert Orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow Public Insert Order Items" ON public.order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow Public Insert Messages" ON public.contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow Public Insert Subscribers" ON public.subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow Public Insert Visits" ON public.site_visits FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow Public Insert Requests" ON public.admin_requests FOR INSERT WITH CHECK (true);

-- Full Access Policies for Operations
CREATE POLICY "Full Access Admin Profiles" ON public.admin_profiles FOR ALL USING (true);
CREATE POLICY "Full Access Admin Requests" ON public.admin_requests FOR ALL USING (true);
CREATE POLICY "Full Access Settings" ON public.site_settings FOR ALL USING (true);
CREATE POLICY "Full Access Products" ON public.products FOR ALL USING (true);
CREATE POLICY "Full Access Orders" ON public.orders FOR ALL USING (true);
CREATE POLICY "Full Access Order Items" ON public.order_items FOR ALL USING (true);
CREATE POLICY "Full Access Posts" ON public.blog_posts FOR ALL USING (true);
CREATE POLICY "Full Access Farms" ON public.farms FOR ALL USING (true);
CREATE POLICY "Full Access Services" ON public.services FOR ALL USING (true);
CREATE POLICY "Full Access Partners" ON public.institutional_partners FOR ALL USING (true);
CREATE POLICY "Full Access Messages" ON public.contact_messages FOR ALL USING (true);
CREATE POLICY "Full Access Media" ON public.media_assets FOR ALL USING (true);
CREATE POLICY "Full Access Impact" ON public.impact_metrics FOR ALL USING (true);

-- Step 19: Seed Default Super Admin
INSERT INTO public.admin_profiles (email, full_name, role, status)
VALUES ('farmgreenvest@gmail.com', 'Greenvest Executive Directorate', 'super_admin', 'active')
ON CONFLICT (email) DO NOTHING;

-- Step 20: Seed Initial Settings
INSERT INTO public.site_settings (id, company_name, slogan, hero_headline, hero_subtext)
VALUES (
    'default',
    'Greenvest Farms',
    'Cultivating Wealth, Feeding Nations.',
    'Growing Tomorrow’s Prosperity Today.',
    'Sustainable farming. Smart investment. A healthier, food-secure Africa.'
) ON CONFLICT (id) DO NOTHING;
`;
