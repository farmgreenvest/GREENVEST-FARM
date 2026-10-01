import React, { useState, useEffect } from 'react';
import {
  Product,
  Farm,
  BlogPost,
  Order,
  ContactEnquiry,
  AdminProfile,
  AdminRequest,
  SiteVisit,
  SiteSettings,
  ImpactMetric,
  CartItem,
  InstitutionalPartner,
} from './types/index.ts';
import { GreenvestDB } from './lib/supabaseClient.ts';
import { INITIAL_FARMS, INITIAL_SERVICES } from './data/initialData.ts';

// Public Components & Pages
import { Navbar } from './components/Navbar.tsx';
import { Footer } from './components/Footer.tsx';
import { WhatsAppFloating } from './components/WhatsAppFloating.tsx';
import { OrderBasketDrawer } from './components/OrderBasketDrawer.tsx';
import { OrderConfirmationModal } from './components/OrderConfirmationModal.tsx';
import { PartnerModal } from './components/PartnerModal.tsx';

import { HomePage } from './pages/HomePage.tsx';
import { AboutPage } from './pages/AboutPage.tsx';
import { OurFarmsPage } from './pages/OurFarmsPage.tsx';
import { WhatWeDoPage } from './pages/WhatWeDoPage.tsx';
import { ProductsPage } from './pages/ProductsPage.tsx';
import { InvestmentPage } from './pages/InvestmentPage.tsx';
import { ImpactPage } from './pages/ImpactPage.tsx';
import { BlogPage } from './pages/BlogPage.tsx';
import { BlogPostDetail } from './pages/BlogPostDetail.tsx';
import { ContactPage } from './pages/ContactPage.tsx';

// Private Admin Suite Components (/gv-console-2026)
import { AdminLogin } from './admin/AdminLogin.tsx';
import { AdminRequestAccess } from './admin/AdminRequestAccess.tsx';
import { AdminLayout } from './admin/AdminLayout.tsx';

export default function App() {
  // Live State from Supabase persistent DB
  const [settings, setSettings] = useState<SiteSettings>(GreenvestDB.getSettings());
  const [products, setProducts] = useState<Product[]>(GreenvestDB.getProducts());
  const [farms, setFarms] = useState<Farm[]>(GreenvestDB.getFarms());
  const [services, setServices] = useState(GreenvestDB.getServices());
  const [partners, setPartners] = useState<InstitutionalPartner[]>(GreenvestDB.getInstitutionalPartners());
  const [posts, setPosts] = useState<BlogPost[]>(GreenvestDB.getPosts());
  const [orders, setOrders] = useState<Order[]>(GreenvestDB.getOrders());
  const [enquiries, setEnquiries] = useState<ContactEnquiry[]>(GreenvestDB.getEnquiries());
  const [impactMetrics, setImpactMetrics] = useState<ImpactMetric[]>(GreenvestDB.getImpactMetrics());
  const [adminProfiles, setAdminProfiles] = useState<AdminProfile[]>(GreenvestDB.getAdminProfiles());
  const [adminRequests, setAdminRequests] = useState<AdminRequest[]>(GreenvestDB.getAdminRequests());
  const [visits, setVisits] = useState<SiteVisit[]>(GreenvestDB.getVisits());

  // Routing State
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [selectedFarmModal, setSelectedFarmModal] = useState<Farm | null>(null);

  // Admin routing state (triggered by /gv-console-2026 path or hash)
  const [isAdminRoute, setIsAdminRoute] = useState<boolean>(false);
  const [adminSubView, setAdminSubView] = useState<'login' | 'request-access' | 'dashboard'>('login');
  const [currentAdmin, setCurrentAdmin] = useState<AdminProfile | null>(GreenvestDB.getActiveAdminSession());

  // Shopping Cart & Order Basket
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartDrawerOpen, setCartDrawerOpen] = useState<boolean>(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [confirmedWhatsAppText, setConfirmedWhatsAppText] = useState<string>('');

  // Partner Modal
  const [partnerModalOpen, setPartnerModalOpen] = useState<boolean>(false);

  // Synchronize route with browser URL / hash
  useEffect(() => {
    const handleLocation = () => {
      const pathname = window.location.pathname;
      const hash = window.location.hash;
      const search = window.location.search;

      const isAdmin =
        pathname.includes('/admin') ||
        hash.includes('admin') ||
        pathname.includes('/gv-console-2026') ||
        hash.includes('gv-console-2026') ||
        pathname.includes('/staff') ||
        hash.includes('staff') ||
        pathname.includes('/portal') ||
        hash.includes('portal') ||
        pathname.includes('/console') ||
        hash.includes('console') ||
        search.includes('admin=true');

      if (isAdmin) {
        setIsAdminRoute(true);
        if (pathname.includes('request-access') || hash.includes('request-access')) {
          setAdminSubView('request-access');
        } else {
          const session = GreenvestDB.getActiveAdminSession();
          if (session) {
            setCurrentAdmin(session);
            setAdminSubView('dashboard');
          } else {
            setAdminSubView('login');
          }
        }
      } else {
        setIsAdminRoute(false);
        // Track public page visit
        GreenvestDB.trackVisit(pathname || '/' + currentTab);
        setVisits(GreenvestDB.getVisits());
      }
    };

    const openAdminPortal = () => {
      setIsAdminRoute(true);
      const session = GreenvestDB.getActiveAdminSession();
      if (session) {
        setCurrentAdmin(session);
        setAdminSubView('dashboard');
      } else {
        setAdminSubView('login');
      }
      window.location.hash = '#/admin';
      window.scrollTo({ top: 0, behavior: 'instant' });
    };

    let keyBuffer = '';
    let bufferTimeout: any = null;

    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      const isInput =
        activeEl &&
        (activeEl.tagName === 'INPUT' ||
          activeEl.tagName === 'TEXTAREA' ||
          (activeEl as HTMLElement).isContentEditable);

      // Fast Shortcuts:
      // 1. Alt + A (instant single-hand)
      // 2. Ctrl + Shift + A / Cmd + Shift + A
      // 3. Ctrl + Shift + L
      // 4. Backtick ` or ~ when not in an input
      if (
        ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) ||
        (e.altKey && (e.key === 'a' || e.key === 'A')) ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'L' || e.key === 'l')) ||
        (!isInput && (e.key === '`' || e.key === '~'))
      ) {
        e.preventDefault();
        openAdminPortal();
        return;
      }

      // Fast Word Detector: simply typing "admin" anywhere on the screen
      if (!isInput && e.key && e.key.length === 1) {
        keyBuffer += e.key.toLowerCase();
        if (keyBuffer.length > 8) {
          keyBuffer = keyBuffer.slice(-8);
        }
        if (keyBuffer.endsWith('admin') || keyBuffer.endsWith('gv26')) {
          keyBuffer = '';
          e.preventDefault();
          openAdminPortal();
          return;
        }
        clearTimeout(bufferTimeout);
        bufferTimeout = setTimeout(() => {
          keyBuffer = '';
        }, 1500);
      }
    };

    handleLocation();
    window.addEventListener('popstate', handleLocation);
    window.addEventListener('hashchange', handleLocation);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('popstate', handleLocation);
      window.removeEventListener('hashchange', handleLocation);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentTab]);

  // Two-way Supabase Cloud Synchronization & Real-time Live Listener
  useEffect(() => {
    // 1. Initial Cloud Sync from Supabase
    GreenvestDB.syncFromSupabase()
      .then((cloudData) => {
        if (cloudData.settings) setSettings(cloudData.settings);
        if (cloudData.products && cloudData.products.length > 0) setProducts(cloudData.products);
        if (cloudData.farms && cloudData.farms.length > 0) setFarms(cloudData.farms);
        if (cloudData.services && cloudData.services.length > 0) setServices(cloudData.services);
        if (cloudData.posts && cloudData.posts.length > 0) setPosts(cloudData.posts);
        if (cloudData.orders && cloudData.orders.length > 0) setOrders(cloudData.orders);
        if (cloudData.enquiries && cloudData.enquiries.length > 0) setEnquiries(cloudData.enquiries);
        if (cloudData.partners && cloudData.partners.length > 0) setPartners(cloudData.partners);
        if (cloudData.adminRequests && cloudData.adminRequests.length > 0) setAdminRequests(cloudData.adminRequests);
        if (cloudData.adminProfiles && cloudData.adminProfiles.length > 0) setAdminProfiles(cloudData.adminProfiles);
      })
      .catch((err) => {
        console.warn('Initial Supabase sync notice:', err);
      });

    // 2. Real-time Subscription for changes made locally or in Supabase
    const unsubscribe = GreenvestDB.subscribe((event, data) => {
      if (event === 'settings_updated' && data) {
        setSettings(data);
      } else if (event === 'products_updated' && data) {
        setProducts(data);
      } else if (event === 'farms_updated' && data) {
        setFarms(data);
      } else if (event === 'services_updated' && data) {
        setServices(data);
      } else if (event === 'partners_updated' && data) {
        setPartners(data);
      } else if (event === 'posts_updated' && data) {
        setPosts(data);
      } else if (event === 'orders_updated' && data) {
        setOrders(data);
      } else if (event === 'enquiries_updated' && data) {
        setEnquiries(data);
      } else if (event === 'admin_requests_updated' && data) {
        setAdminRequests(data);
      } else if (event === 'admin_profiles_updated' && data) {
        setAdminProfiles(data);
      } else if (event === 'initial_sync_completed' && data) {
        if (data.settings) setSettings(data.settings);
        if (data.products && data.products.length > 0) setProducts(data.products);
        if (data.farms && data.farms.length > 0) setFarms(data.farms);
        if (data.services && data.services.length > 0) setServices(data.services);
        if (data.posts && data.posts.length > 0) setPosts(data.posts);
        if (data.orders && data.orders.length > 0) setOrders(data.orders);
        if (data.enquiries && data.enquiries.length > 0) setEnquiries(data.enquiries);
        if (data.partners && data.partners.length > 0) setPartners(data.partners);
        if (data.adminRequests) setAdminRequests(data.adminRequests);
        if (data.adminProfiles) setAdminProfiles(data.adminProfiles);
      }
    });

    return () => unsubscribe();
  }, []);

  // Track page visits on public tab changes
  const handleNavigate = (tab: string) => {
    setSelectedPost(null);
    setCurrentTab(tab);
    GreenvestDB.trackVisit(`/${tab}`);
    setVisits(GreenvestDB.getVisits());
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cart operations
  const handleAddToCart = (product: Product, quantity = 1) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.product.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevCart, { product, quantity }];
    });
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveCartItem = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleOrderCompleted = (order: Order, prefilledWhatsAppText: string) => {
    setOrders(GreenvestDB.getOrders());
    setConfirmedOrder(order);
    setConfirmedWhatsAppText(prefilledWhatsAppText);
  };

  const handleAdminLoginSuccess = (admin: AdminProfile) => {
    setCurrentAdmin(admin);
    setAdminSubView('dashboard');
  };

  const handleAdminLogout = () => {
    GreenvestDB.setActiveAdminSession(null);
    setCurrentAdmin(null);
    setAdminSubView('login');
  };

  const handleExitAdminToPublic = () => {
    // Immediately pull latest saved state so public site reflects all edits instantly
    setSettings(GreenvestDB.getSettings());
    setProducts(GreenvestDB.getProducts());
    setFarms(GreenvestDB.getFarms());
    setServices(GreenvestDB.getServices());
    setPartners(GreenvestDB.getInstitutionalPartners());
    setPosts(GreenvestDB.getPosts());
    setImpactMetrics(GreenvestDB.getImpactMetrics());
    window.location.hash = '';
    window.history.pushState({}, '', '/');
    setIsAdminRoute(false);
    handleNavigate('home');
  };

  // --- RENDER PRIVATE ADMIN SUITE (/gv-console-2026) ---
  if (isAdminRoute) {
    if (adminSubView === 'request-access') {
      return (
        <AdminRequestAccess
          onBackToLogin={() => setAdminSubView('login')}
          onExitToPublicSite={handleExitAdminToPublic}
        />
      );
    }

    if (!currentAdmin || adminSubView === 'login') {
      return (
        <AdminLogin
          onLoginSuccess={handleAdminLoginSuccess}
          onRequestAccessClick={() => setAdminSubView('request-access')}
          onExitToPublicSite={handleExitAdminToPublic}
        />
      );
    }

    return (
      <AdminLayout
        currentAdmin={currentAdmin}
        onLogout={handleAdminLogout}
        onReturnToPublicSite={handleExitAdminToPublic}
        settings={settings}
        onSettingsUpdated={(updated) => setSettings(updated)}
        products={products}
        onProductsUpdated={(prods) => setProducts(prods)}
        farms={farms}
        onFarmsUpdated={(f) => setFarms(f)}
        services={services}
        onServicesUpdated={(s) => setServices(s)}
        partners={partners}
        onPartnersUpdated={(p) => setPartners(p)}
        impactMetrics={impactMetrics}
        onImpactMetricsUpdated={(i) => setImpactMetrics(i)}
        orders={orders}
        onOrdersUpdated={(ords) => setOrders(ords)}
        posts={posts}
        onPostsUpdated={(psts) => setPosts(psts)}
        enquiries={enquiries}
        onEnquiriesUpdated={(enqs) => setEnquiries(enqs)}
        adminProfiles={adminProfiles}
        adminRequests={adminRequests}
        onAdminsUpdated={() => {
          setAdminProfiles(GreenvestDB.getAdminProfiles());
          setAdminRequests(GreenvestDB.getAdminRequests());
        }}
        visits={visits}
      />
    );
  }

  // --- RENDER PUBLIC WEBSITE ---
  const totalCartUnits = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFCF7] text-[#263238] font-sans selection:bg-[#075E2B] selection:text-white">
      {/* Dynamic Fonts & Colors injected from Admin Customizer */}
      <style>{`
        h1, h2, h3, .font-display, .font-serif-display {
          font-family: '${settings.headingFont || 'Cormorant Garamond'}', Georgia, serif !important;
        }
        body, .font-sans-body {
          font-family: '${settings.bodyFont || 'Plus Jakarta Sans'}', system-ui, sans-serif !important;
        }
        :root {
          --color-forest: ${settings.colorForest || '#075E2B'};
          --color-agri: ${settings.colorAgri || '#2E8B57'};
          --color-leaf: ${settings.colorLeaf || '#7CB342'};
          --color-gold: ${settings.colorGold || '#F4B400'};
          --color-cream: ${settings.colorCream || '#F7F3E8'};
          --color-charcoal: ${settings.colorCharcoal || '#263238'};
        }
      `}</style>

      {/* Announcement Bar if configured in Settings */}
      {settings.isAnnouncementActive && settings.announcementText && (
        <div
          style={{
            backgroundColor: settings.announcementBgColor || '#F4B400',
            color: settings.announcementTextColor || '#075E2B',
          }}
          className="py-1.5 px-4 text-center text-xs font-bold tracking-wide z-50 transition-colors"
        >
          <span>{settings.announcementText}</span>
        </div>
      )}

      {/* Top Bar Navigation */}
      <Navbar
        currentTab={currentTab}
        onNavigate={handleNavigate}
        cartCount={totalCartUnits}
        onOpenCart={() => setCartDrawerOpen(true)}
        onOpenPartnerModal={() => setPartnerModalOpen(true)}
        onOpenAdmin={() => {
          setIsAdminRoute(true);
          const session = GreenvestDB.getActiveAdminSession();
          if (session) {
            setCurrentAdmin(session);
            setAdminSubView('dashboard');
          } else {
            setAdminSubView('login');
          }
          window.location.hash = '#/admin';
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        settings={settings}
      />

      {/* Main Page Routing Container */}
      <main className="flex-1 pt-16">
        {selectedPost ? (
          <BlogPostDetail
            post={selectedPost}
            allPosts={posts}
            onBack={() => setSelectedPost(null)}
            onSelectPost={(post) => {
              setSelectedPost(post);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        ) : (
          <>
            {currentTab === 'home' && (
              <HomePage
                settings={settings}
                products={products}
                farms={farms}
                posts={posts}
                impactMetrics={impactMetrics}
                onNavigate={handleNavigate}
                onAddToCart={(p) => {
                  handleAddToCart(p, 1);
                  setCartDrawerOpen(true);
                }}
                onOpenPartnerModal={() => setPartnerModalOpen(true)}
                onSelectPost={(p) => setSelectedPost(p)}
                onSelectFarm={(f) => {
                  setSelectedFarmModal(f);
                  setCurrentTab('farms');
                }}
              />
            )}

            {currentTab === 'about' && (
              <AboutPage
                onNavigate={handleNavigate}
                onOpenPartnerModal={() => setPartnerModalOpen(true)}
                settings={settings}
                partners={partners}
              />
            )}

            {currentTab === 'farms' && (
              <OurFarmsPage
                farms={farms}
                onOpenPartnerModal={() => setPartnerModalOpen(true)}
                selectedFarmModal={selectedFarmModal}
                setSelectedFarmModal={setSelectedFarmModal}
                settings={settings}
              />
            )}

            {currentTab === 'services' && (
              <WhatWeDoPage
                services={services}
                onOpenPartnerModal={() => setPartnerModalOpen(true)}
                onNavigate={handleNavigate}
                settings={settings}
              />
            )}

            {currentTab === 'products' && (
              <ProductsPage
                products={products}
                onAddToCart={(p, qty) => {
                  handleAddToCart(p, qty || 1);
                }}
                onOpenCart={() => setCartDrawerOpen(true)}
                cartCount={totalCartUnits}
                settings={settings}
              />
            )}

            {currentTab === 'investment' && (
              <InvestmentPage
                onOpenPartnerModal={() => setPartnerModalOpen(true)}
                settings={settings}
              />
            )}

            {currentTab === 'impact' && (
              <ImpactPage
                impactMetrics={impactMetrics}
                onOpenPartnerModal={() => setPartnerModalOpen(true)}
                settings={settings}
              />
            )}

            {currentTab === 'blog' && (
              <BlogPage
                posts={posts}
                onSelectPost={(p) => {
                  setSelectedPost(p);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}

            {currentTab === 'contact' && <ContactPage settings={settings} />}
          </>
        )}
      </main>

      {/* Slide-out Order Basket Drawer */}
      <OrderBasketDrawer
        isOpen={cartDrawerOpen}
        onClose={() => setCartDrawerOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        onOrderCompleted={handleOrderCompleted}
        onBrowseProducts={() => handleNavigate('products')}
      />

      {/* Order Confirmation Modal with Editable WhatsApp text */}
      <OrderConfirmationModal
        order={confirmedOrder}
        initialWhatsAppText={confirmedWhatsAppText}
        onClose={() => setConfirmedOrder(null)}
      />

      {/* Institutional Partner Modal */}
      <PartnerModal
        isOpen={partnerModalOpen}
        onClose={() => setPartnerModalOpen(false)}
        settings={settings}
      />

      {/* Permanent WhatsApp Contact Floating Action Button */}
      <WhatsAppFloating settings={settings} />

      {/* Corporate Footer with Live Theme Colors & Discreet Admin Entry */}
      <Footer
        onNavigate={handleNavigate}
        settings={settings}
        onOpenAdminConsole={() => {
          setIsAdminRoute(true);
          const session = GreenvestDB.getActiveAdminSession();
          if (session) {
            setCurrentAdmin(session);
            setAdminSubView('dashboard');
          } else {
            setAdminSubView('login');
          }
          window.location.hash = '#/admin';
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
}
