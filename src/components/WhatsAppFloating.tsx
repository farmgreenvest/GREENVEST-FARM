import React from 'react';
import { MessageCircle } from 'lucide-react';
import { SiteSettings } from '../types/index.ts';

interface WhatsAppFloatingProps {
  customMessage?: string;
  settings?: SiteSettings;
}

export const WhatsAppFloating: React.FC<WhatsAppFloatingProps> = ({ customMessage, settings }) => {
  const rawPhone = settings?.whatsappNumber || '2348139487363';
  const cleanPhone = rawPhone.replace(/[^0-9]/g, '');
  const defaultText = 'Hello Greenvest Farms, I would like to make an enquiry about your farm products and investment partnerships.';
  const message = encodeURIComponent(customMessage || defaultText);
  const href = `https://wa.me/${cleanPhone}?text=${message}`;

  return (
    <aside
      aria-label="Instant WhatsApp Assistance"
      className="fixed bottom-6 right-6 z-40 flex items-center group pointer-events-auto"
    >
      {/* Tooltip Label */}
      <span className="hidden sm:inline-block mr-3 px-3 py-1.5 rounded-full bg-[#075E2B] text-white text-xs font-semibold shadow-lg border border-[#2E8B57]/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
        Chat with Farm Desk · {rawPhone}
      </span>

      {/* Floating Action Button */}
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Open Greenvest Farms WhatsApp Chat"
        className="w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-300 transform group-hover:scale-110 active:scale-95 focus:outline-none focus:ring-4 focus:ring-[#25D366]/40 cursor-pointer"
      >
        <MessageCircle className="w-8 h-8 fill-current text-white stroke-none" />
      </a>
    </aside>
  );
};
