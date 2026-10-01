import React, { useState } from 'react';
import { SiteSettings } from '../types/index.ts';
import { GreenvestDB } from '../lib/supabaseClient.ts';
import { Mail, Phone, MapPin, CheckCircle, ArrowRight, Shield } from 'lucide-react';
import { GreenvestLogo } from './GreenvestLogo';

interface FooterProps {
  onNavigate: (tab: string) => void;
  settings: SiteSettings;
  onOpenAdminConsole?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, settings, onOpenAdminConsole }) => {
  const [newsName, setNewsName] = useState('');
  const [newsEmail, setNewsEmail] = useState('');
  const [newsSubmitted, setNewsSubmitted] = useState(false);
  const [subscribing, setSubscribing] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsEmail || !newsName) return;
    setSubscribing(true);
    setTimeout(() => {
      GreenvestDB.addSubscriber(newsName, newsEmail);
      setSubscribing(false);
      setNewsSubmitted(true);
      setNewsName('');
      setNewsEmail('');
    }, 400);
  };

  const [sealClicks, setSealClicks] = useState(0);

  const handleSealClick = () => {
    const next = sealClicks + 1;
    setSealClicks(next);
    if (next >= 3) {
      setSealClicks(0);
      if (onOpenAdminConsole) {
        onOpenAdminConsole();
      } else {
        window.location.hash = '#/admin';
      }
    }
  };

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

  const footerBg = settings.footerBgColor || '#05441F';
  const footerText = settings.footerTextColor || '#FFFFFF';

  return (
    <footer
      style={{ backgroundColor: footerBg, color: footerText }}
      className="border-t border-white/10 pt-16 pb-12 transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          {/* Col 1: Brand & Slogan */}
          <div className="lg:col-span-4 space-y-4">
            <GreenvestLogo
              theme="on-dark"
              variant="horizontal"
              onSecretTrigger={() => {
                if (onOpenAdminConsole) onOpenAdminConsole();
                else window.location.hash = '#/admin';
              }}
            />

            <p className="opacity-80 text-sm leading-relaxed max-w-sm">
              {settings.footerDescription ||
                'Greenvest Farms is a forward-looking African agribusiness committed to modern, sustainable and profitable farming that creates value for investors, empowers communities and contributes to food security across Africa.'}
            </p>

            <div className="pt-2">
              <a
                href={`https://wa.me/${settings.whatsappNumber || '2348139487363'}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold transition-colors"
                style={{ color: settings.colorGold || '#F4B400' }}
              >
                <span>WhatsApp Desk: {settings.primaryPhone || '08139487363'}</span>
              </a>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="lg:col-span-3 space-y-3">
            <h4
              style={{ color: settings.colorGold || '#F4B400' }}
              className="text-xs font-bold uppercase tracking-wider"
            >
              Corporate Navigation
            </h4>
            <ul className="grid grid-cols-2 gap-2 text-sm opacity-85">
              {navLinks.map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => {
                      onNavigate(link.id);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:opacity-100 transition-opacity text-left py-1"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Direct Contact */}
          <div className="lg:col-span-2 space-y-3">
            <h4
              style={{ color: settings.colorGold || '#F4B400' }}
              className="text-xs font-bold uppercase tracking-wider"
            >
              Agribusiness Hubs
            </h4>
            <div className="space-y-2 text-xs opacity-85">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 shrink-0 mt-0.5" style={{ color: settings.colorGold || '#F4B400' }} />
                <span>{settings.officeAddressAbuja || 'CBD, Abuja, Nigeria'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 shrink-0" style={{ color: settings.colorGold || '#F4B400' }} />
                <span>{settings.primaryPhone || '+234 813 948 7363'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 shrink-0" style={{ color: settings.colorGold || '#F4B400' }} />
                <span>{settings.contactEmail || 'farmgreenvest@gmail.com'}</span>
              </div>
            </div>
          </div>

          {/* Col 4: Newsletter Signup */}
          <div className="lg:col-span-3 space-y-3">
            <h4
              style={{ color: settings.colorGold || '#F4B400' }}
              className="text-xs font-bold uppercase tracking-wider"
            >
              Agricultural Intelligence
            </h4>
            <p className="text-xs opacity-80 leading-relaxed">
              Subscribe to our harvest bulletins, commodity pricing index, and agribusiness investment briefings.
            </p>
            {newsSubmitted ? (
              <div className="p-3 rounded-xl bg-white/10 border border-white/20 text-xs flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Thank you. You are registered for our market updates.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <input
                  type="text"
                  required
                  placeholder="Full Name"
                  value={newsName}
                  onChange={(e) => setNewsName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none"
                />
                <div className="flex gap-1.5">
                  <input
                    type="email"
                    required
                    placeholder="Corporate Email"
                    value={newsEmail}
                    onChange={(e) => setNewsEmail(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={subscribing}
                    aria-label="Subscribe"
                    style={{
                      backgroundColor: settings.colorGold || '#F4B400',
                      color: settings.colorForest || '#075E2B',
                    }}
                    className="px-3 py-2 rounded-xl font-bold text-xs transition-opacity shrink-0 flex items-center justify-center cursor-pointer hover:opacity-90"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar: Copyright, Trust Notice & Admin Access */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs opacity-75">
          <p
            onClick={handleSealClick}
            onDoubleClick={onOpenAdminConsole || (() => { window.location.hash = '#/admin'; })}
            className="cursor-default select-none"
            title=""
          >
            {settings.footerCopyright || `© ${new Date().getFullYear()} Greenvest Farms Limited. All rights reserved.`}
          </p>
          <div className="flex items-center gap-4 sm:gap-5 flex-wrap">
            <span>NAFDAC & GAP Compliant</span>
            <span>Food Security Partner</span>
            <span className="opacity-40 hover:opacity-100 transition-opacity text-[11px]">
              ISO 22000 Certified
            </span>
            <button
              onClick={onOpenAdminConsole || (() => { window.location.hash = '#/admin'; })}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white/90 hover:text-white transition-all flex items-center gap-1.5 text-xs font-semibold cursor-pointer border border-white/10 hover:border-white/25 active:scale-95 shadow-sm"
              title="Staff & Administrator Portal"
            >
              <Shield className="w-3.5 h-3.5 text-[#F4B400]" />
              <span>Admin Portal</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
