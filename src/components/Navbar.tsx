import React, { useState, useEffect } from 'react';
import { SiteSettings } from '../types/index.ts';
import { ShoppingBag, Menu, X, ArrowRight } from 'lucide-react';
import { GreenvestLogo } from './GreenvestLogo';

interface NavbarProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenPartnerModal: () => void;
  onOpenAdmin?: () => void;
  settings: SiteSettings;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onNavigate,
  cartCount,
  onOpenCart,
  onOpenPartnerModal,
  onOpenAdmin,
  settings,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About Us' },
    { id: 'farms', label: 'Our Farms' },
    { id: 'services', label: 'What We Do' },
    { id: 'products', label: 'Products' },
    { id: 'investment', label: 'Investment' },
    { id: 'impact', label: 'Impact' },
    { id: 'blog', label: 'Blog' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const headerBg = settings.headerBgColor || '#075E2B';
  const headerText = settings.headerTextColor || '#FFFFFF';

  return (
    <>
      <header
        style={{
          backgroundColor: isScrolled ? `${headerBg}F5` : headerBg,
          color: headerText,
        }}
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 shadow-md ${
          isScrolled ? 'py-3 backdrop-blur-md border-b border-white/10' : 'py-4 border-b border-white/10'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Zone 1: Single Clean Wordmark & Brand Seal */}
          <button
            onClick={() => handleNavClick('home')}
            onDoubleClick={(e) => {
              e.preventDefault();
              if (onOpenAdmin) onOpenAdmin();
              else window.location.hash = '#/admin';
            }}
            className="flex items-center text-left focus:outline-none group cursor-pointer"
          >
            <GreenvestLogo theme="on-dark" variant="horizontal" onSecretTrigger={onOpenAdmin} />
          </button>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden xl:flex items-center gap-6">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`text-sm font-medium tracking-wide transition-colors cursor-pointer py-1 relative ${
                  currentTab === link.id
                    ? 'font-bold'
                    : 'opacity-90 hover:opacity-100'
                }`}
                style={{
                  color: currentTab === link.id ? (settings.colorGold || '#F4B400') : headerText,
                }}
              >
                {link.label}
                {currentTab === link.id && (
                  <span
                    style={{ backgroundColor: settings.colorGold || '#F4B400' }}
                    className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                  />
                )}
              </button>
            ))}
          </nav>

          {/* Zone 3: Actions (Order Farm Products + Partner CTA + Basket) */}
          <div className="flex items-center gap-3">
            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              aria-label="View Order Basket"
              className="relative p-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition-colors cursor-pointer flex items-center gap-2 text-xs font-medium"
            >
              <ShoppingBag
                style={{ color: settings.colorGold || '#F4B400' }}
                className="w-5 h-5"
              />
              <span className="hidden sm:inline">Order Basket</span>
              {cartCount > 0 && (
                <span
                  style={{
                    backgroundColor: settings.colorGold || '#F4B400',
                    color: settings.colorForest || '#075E2B',
                  }}
                  className="w-5 h-5 rounded-full font-bold text-xs flex items-center justify-center tabular-nums shadow-sm animate-pulse"
                >
                  {cartCount}
                </span>
              )}
            </button>

            {/* Secondary CTA: Order Farm Products */}
            <button
              onClick={() => handleNavClick('products')}
              className="hidden lg:inline-flex items-center px-3.5 py-2 text-xs font-semibold border rounded-xl hover:bg-white/10 transition-colors whitespace-nowrap cursor-pointer"
              style={{
                borderColor: `${settings.colorGold || '#F4B400'}B0`,
                color: headerText,
              }}
            >
              {settings.headerCtaSecondaryText || 'Order Farm Products'}
            </button>

            {/* Primary CTA: Partner With Us */}
            <button
              onClick={onOpenPartnerModal}
              style={{
                backgroundColor: settings.colorGold || '#F4B400',
                color: settings.colorForest || '#075E2B',
              }}
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl hover:opacity-90 active:scale-[0.98] transition-all shadow-md whitespace-nowrap cursor-pointer"
            >
              <span>{settings.headerCtaPrimaryText || 'Partner With Us'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Open Navigation Menu"
              className="xl:hidden p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 xl:hidden bg-black/60 backdrop-blur-sm transition-opacity">
          <div
            style={{ backgroundColor: headerBg, color: headerText }}
            className="absolute top-0 right-0 w-4/5 max-w-sm h-full p-6 flex flex-col shadow-2xl overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <GreenvestLogo theme="on-dark" variant="horizontal" showTagline={false} />
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col gap-2 py-6">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`text-left px-3 py-2.5 rounded-lg text-base font-medium transition-colors ${
                    currentTab === link.id
                      ? 'bg-white/20 font-bold'
                      : 'hover:bg-white/10'
                  }`}
                  style={{
                    color: currentTab === link.id ? (settings.colorGold || '#F4B400') : headerText,
                  }}
                >
                  {link.label}
                </button>
              ))}
            </div>

            <div className="mt-auto pt-6 border-t border-white/10 flex flex-col gap-3">
              <button
                onClick={() => handleNavClick('products')}
                className="w-full py-2.5 text-center text-sm font-semibold border border-white/30 rounded-xl hover:bg-white/10 transition-colors"
              >
                {settings.headerCtaSecondaryText || 'Order Farm Products'}
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenPartnerModal();
                }}
                style={{
                  backgroundColor: settings.colorGold || '#F4B400',
                  color: settings.colorForest || '#075E2B',
                }}
                className="w-full py-2.5 text-center text-sm font-bold rounded-xl hover:opacity-90 transition-opacity shadow-md"
              >
                {settings.headerCtaPrimaryText || 'Partner With Us'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
