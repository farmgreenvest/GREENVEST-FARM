export type FarmCategory =
  | 'All'
  | 'Crop Farming'
  | 'Greenhouse Farming'
  | 'Livestock'
  | 'Poultry'
  | 'Aquaculture'
  | 'Agro-Processing'
  | 'Agricultural Estates';

export type ProductCategory =
  | 'All'
  | 'Grains & Cereals'
  | 'Oilseeds & Legumes'
  | 'Horticulture & Vegetables'
  | 'Aquaculture & Livestock'
  | 'Fresh Produce'
  | 'Vegetables'
  | 'Maize'
  | 'Grains'
  | 'Fish'
  | 'Eggs'
  | 'Poultry'
  | 'Livestock'
  | 'Processed Agricultural Products';

export type OrderStatus =
  | 'New'
  | 'Contacted'
  | 'Confirmed'
  | 'Processing'
  | 'Ready'
  | 'Delivered'
  | 'Cancelled';

export type AdminRole = 'super_admin' | 'admin' | 'editor';

export type AdminRequestStatus = 'pending' | 'approved' | 'rejected' | 'suspended';

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: ProductCategory;
  description: string;
  price: number | null; // null means 'Price on Request'
  currency: string;
  unit: string; // e.g. '50kg Bag', 'Crate', 'Kg', 'Metric Tonne'
  stock: number;
  image: string;
  featured: boolean;
  available: boolean;
  minOrderQty?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItemRecord {
  productId: string;
  productName: string;
  quantity: number;
  unit: string;
  unitPrice: number | null;
  subtotal: number | null;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  email: string;
  deliveryAddress: string;
  notes?: string;
  items: OrderItemRecord[];
  totalAmount: number;
  hasPriceOnRequest: boolean;
  status: OrderStatus;
  createdAt: string;
  updatedAt?: string;
}

export interface Farm {
  id: string;
  name: string;
  slug: string;
  location: string;
  state: string;
  type: FarmCategory;
  acreage: string;
  description: string;
  keyCrops: string[];
  outputStats: string;
  image: string;
  coordinates: { x: number; y: number }; // Percentage for interactive map
  highlights: string[];
}

export interface ServiceItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  image: string;
  keyActivities: string[];
  ctaText: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  featuredImage: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  author: {
    name: string;
    role: string;
    avatar?: string;
  };
  publicationDate: string;
  readTime: string;
  seoTitle: string;
  seoDescription: string;
  status: 'published' | 'draft' | 'archived';
  views?: number;
}

export interface ContactEnquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied' | 'archived';
  createdAt: string;
}

export interface NewsletterSubscriber {
  id: string;
  name: string;
  email: string;
  subscribedAt: string;
}

export interface AdminProfile {
  id: string;
  email: string;
  fullName: string;
  role: AdminRole;
  status: 'active' | 'suspended';
  createdAt: string;
  lastLogin?: string;
}

export interface AdminRequest {
  id: string;
  fullName: string;
  email: string;
  password?: string;
  reason: string;
  status: AdminRequestStatus;
  requestedRole?: AdminRole;
  createdAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

export interface SiteVisit {
  id: string;
  path: string;
  referrer: string;
  userAgent: string;
  timestamp: string;
  sessionId: string;
}

export interface MediaAsset {
  id: string;
  fileName: string;
  fileUrl: string;
  category: string;
  altText: string;
  caption?: string;
  uploadedAt: string;
  sizeBytes: number;
}

export interface ImpactMetric {
  id: string;
  label: string;
  value: string;
  numericTarget?: number;
  unit: string;
  description: string;
}

export interface InstitutionalPartner {
  id: string;
  acronym: string;
  name: string;
  category: string;
  mandate: string;
  keyInitiatives: string[];
  logo?: string;
  badge?: string;
  location?: string;
  allianceType?: string;
  yearEstablished?: string;
  portalLink?: string;
}

export interface SiteSettings {
  // Brand Identity
  companyName: string;
  slogan: string;
  logoUrl?: string;

  // Header & Navigation
  headerBgColor: string;
  headerTextColor: string;
  headerCtaPrimaryText: string;
  headerCtaSecondaryText: string;
  isAnnouncementActive: boolean;
  announcementText: string;
  announcementBgColor: string;
  announcementTextColor: string;

  // Typography & Global Styling
  headingFont: string;
  bodyFont: string;
  headingScale?: 'normal' | 'large' | 'extralarge';
  colorForest: string;
  colorAgri: string;
  colorLeaf: string;
  colorGold: string;
  colorCream: string;
  colorCharcoal: string;

  // Home Page Section
  heroHeadline: string;
  heroSubtext: string;
  heroImage: string;
  heroCta1Text: string;
  heroCta2Text: string;
  heroEyebrow?: string;
  homeFeaturesTitle?: string;
  homeFeaturesSubtext?: string;

  // About Us Page Section
  aboutHeadline: string;
  aboutDescription: string;
  aboutImage: string;
  visionHeadline?: string;
  visionText: string;
  missionHeadline?: string;
  missionText: string;
  approachHeadline?: string;
  approachDescription?: string;
  approachImage?: string;
  approachTag?: string;
  commitment1Title?: string;
  commitment1Desc?: string;
  commitment2Title?: string;
  commitment2Desc?: string;
  commitment3Title?: string;
  commitment3Desc?: string;

  // Institution Leadership / Partnerships Section (About Us)
  partnersSectionTitle?: string;
  partnersSectionBadge?: string;
  partnersSectionSubtext?: string;

  // Our Farms Page Section
  farmsHeadline?: string;
  farmsSubtext?: string;
  farmsHeroImage?: string;
  farmsEyebrow?: string;

  // What We Do Page Section
  servicesHeadline?: string;
  servicesSubtext?: string;
  servicesHeroImage?: string;
  servicesEyebrow?: string;

  // Products Page Section
  productsHeadline?: string;
  productsSubtext?: string;
  productsBannerImage?: string;
  productsEyebrow?: string;

  // Investment Page Section
  investmentHeadline?: string;
  investmentSubtext?: string;
  investmentHeroImage?: string;
  investmentEyebrow?: string;
  investmentCtaText?: string;
  investmentModel1Title?: string;
  investmentModel1Desc?: string;
  investmentModel2Title?: string;
  investmentModel2Desc?: string;
  investmentModel3Title?: string;
  investmentModel3Desc?: string;

  // Impact Page Section
  impactHeadline?: string;
  impactSubtext?: string;
  impactHeroImage?: string;
  impactEyebrow?: string;

  // Direct Contacts
  primaryPhone: string;
  whatsappNumber: string;
  contactEmail: string;
  officeAddressAbuja: string;
  officeAddressLagos: string;

  // Footer Section
  footerBgColor: string;
  footerTextColor: string;
  footerDescription: string;
  footerCopyright: string;

  // Audited Numbers
  totalHectaresManaged: string;
  foodProducedTonnes: string;
  smallholdersSupported: string;
  jobsCreated: string;
}
