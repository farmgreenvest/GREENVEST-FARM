import React, { useState } from 'react';
import { Order } from '../types/index.ts';
import { CheckCircle2, MessageCircle, Copy, Check, X } from 'lucide-react';

interface OrderConfirmationModalProps {
  order: Order | null;
  initialWhatsAppText: string;
  onClose: () => void;
  whatsappNumber?: string;
}

export const OrderConfirmationModal: React.FC<OrderConfirmationModalProps> = ({
  order,
  initialWhatsAppText,
  onClose,
  whatsappNumber,
}) => {
  const [whatsAppMessage, setWhatsAppMessage] = useState(initialWhatsAppText);
  const [copied, setCopied] = useState(false);

  if (!order) return null;

  const cleanNumber = (whatsappNumber || '2348139487363').replace(/[^0-9]/g, '');

  const handleOpenWhatsApp = () => {
    const encoded = encodeURIComponent(whatsAppMessage);
    const url = `https://wa.me/${cleanNumber}?text=${encoded}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(whatsAppMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl border border-neutral-100 animate-in fade-in zoom-in duration-200">
        {/* Banner */}
        <div className="bg-[#075E2B] text-white p-6 sm:p-8 text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="w-16 h-16 rounded-full bg-[#F4B400] text-[#075E2B] mx-auto flex items-center justify-center shadow-lg mb-3">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <span className="text-xs uppercase tracking-widest text-[#F4B400] font-semibold">
            Order Successfully Placed
          </span>
          <h2 className="font-serif-display text-2xl sm:text-3xl font-bold mt-1">
            Order #{order.orderNumber}
          </h2>
          <p className="text-white/80 text-xs mt-1">
            Thank you, {order.customerName}. Your farm request has been logged into our database.
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Order Summary Chips */}
          <div className="grid grid-cols-2 gap-3 p-3.5 bg-[#F7F3E8] rounded-xl border border-[#2E8B57]/20 text-xs">
            <div>
              <span className="text-neutral-500 block">Total Amount:</span>
              <span className="font-bold text-[#075E2B] text-sm tabular-nums">
                ₦{order.totalAmount.toLocaleString()}
              </span>
            </div>
            <div>
              <span className="text-neutral-500 block">Order Status:</span>
              <span className="font-bold text-[#2E8B57] capitalize">{order.status}</span>
            </div>
            <div>
              <span className="text-neutral-500 block">Phone Contact:</span>
              <span className="font-medium text-neutral-800">{order.phone}</span>
            </div>
            <div>
              <span className="text-neutral-500 block">Delivery:</span>
              <span className="font-medium text-neutral-800 truncate">{order.deliveryAddress}</span>
            </div>
          </div>

          {/* WhatsApp Message Preview & Edit */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-[#075E2B] flex items-center gap-1.5">
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                <span>Pre-filled WhatsApp Message (You can edit before sending)</span>
              </label>
              <button
                type="button"
                onClick={handleCopy}
                className="text-[11px] text-neutral-600 hover:text-[#075E2B] flex items-center gap-1 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Text'}</span>
              </button>
            </div>
            <textarea
              rows={7}
              value={whatsAppMessage}
              onChange={(e) => setWhatsAppMessage(e.target.value)}
              className="w-full p-3 font-mono text-xs border border-neutral-300 rounded-lg bg-neutral-50 text-neutral-800 focus:ring-2 focus:ring-[#075E2B] focus:outline-none"
            />
            <p className="text-[11px] text-neutral-500 mt-1">
              WhatsApp Desk: <span className="font-semibold text-neutral-700">08139487363</span> (+2348139487363). Our trade desk confirms orders within 30 minutes during work hours.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleOpenWhatsApp}
              className="flex-1 py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.98] cursor-pointer"
            >
              <MessageCircle className="w-5 h-5 fill-current" />
              <span>Open in WhatsApp & Confirm Order</span>
            </button>
            <button
              onClick={onClose}
              className="py-3 px-5 rounded-xl border border-neutral-300 text-neutral-700 text-xs font-semibold hover:bg-neutral-100 transition-colors cursor-pointer"
            >
              Done / Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
