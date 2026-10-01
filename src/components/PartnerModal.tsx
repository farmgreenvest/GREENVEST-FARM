import React, { useState } from 'react';
import { GreenvestDB } from '../lib/supabaseClient.ts';
import { SiteSettings } from '../types/index.ts';
import { X, CheckCircle, Handshake, ArrowRight } from 'lucide-react';

interface PartnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings?: SiteSettings;
}

export const PartnerModal: React.FC<PartnerModalProps> = ({ isOpen, onClose, settings }) => {
  const [partnerType, setPartnerType] = useState('Institutional Agricultural Investment');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [organization, setOrganization] = useState('');
  const [proposal, setProposal] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    GreenvestDB.createEnquiry({
      name: fullName,
      email,
      phone,
      company: organization,
      subject: `Partnership Proposal: ${partnerType}`,
      message: proposal,
    });

    setLoading(false);
    setSubmitted(true);
  };

  const handleOpenWhatsApp = () => {
    const rawPhone = settings?.whatsappNumber || '2348139487363';
    const cleanPhone = rawPhone.replace(/[^0-9]/g, '');
    const text = `Hello Greenvest Farms,

My name is ${fullName} from ${organization || 'Private Entity'}.
I am reaching out regarding a partnership proposal:
- Interest: ${partnerType}
- Phone: ${phone}
- Email: ${email}
- Brief: ${proposal}

We would like to discuss collaboration with your executive team.`;
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl border border-neutral-100">
        {/* Modal Header */}
        <div className="bg-[#075E2B] text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#F4B400] text-[#075E2B] flex items-center justify-center">
              <Handshake className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-widest text-[#F4B400] font-semibold">
                Strategic Alliance
              </span>
              <h2 className="font-serif-display text-2xl font-bold">Partner With Greenvest Farms</h2>
            </div>
          </div>
          <p className="text-white/80 text-xs mt-2">
            We collaborate with institutional investors, commercial offtakers, financial institutions, and agricultural development agencies across Africa and globally.
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {submitted ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
                <CheckCircle className="w-10 h-10" />
              </div>
              <h3 className="font-serif-display text-2xl font-bold text-[#263238]">
                Partnership Request Received
              </h3>
              <p className="text-sm text-neutral-600 max-w-md mx-auto">
                Thank you, {fullName}. Our Executive Directorate has logged your proposal in our records and will reach out within 24 business hours.
              </p>
              <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={handleOpenWhatsApp}
                  className="px-5 py-2.5 rounded-lg bg-[#25D366] text-white font-bold text-xs flex items-center justify-center gap-2 hover:bg-[#20ba5a] cursor-pointer"
                >
                  <span>Connect Immediately on WhatsApp</span>
                </button>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-lg border border-neutral-300 text-neutral-700 font-semibold text-xs hover:bg-neutral-100 cursor-pointer"
                >
                  Close Window
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Partnership Category *
                </label>
                <select
                  value={partnerType}
                  onChange={(e) => setPartnerType(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg focus:ring-2 focus:ring-[#075E2B] focus:outline-none bg-white"
                >
                  <option>Institutional Agricultural Investment</option>
                  <option>Commercial Grain / Commodity Offtake Agreement</option>
                  <option>Outgrower & Smallholder Program Funding</option>
                  <option>Agro-Processing Joint Venture</option>
                  <option>Farmland Acquisition & Development</option>
                  <option>Equipment & Input Supply Partnership</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Contact Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Kemi Alade"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg focus:ring-2 focus:ring-[#075E2B] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Official Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="kemi@investmentfund.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg focus:ring-2 focus:ring-[#075E2B] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Phone / WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+234 800 000 0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg focus:ring-2 focus:ring-[#075E2B] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Organization / Fund Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Sahel Agro Capital"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg focus:ring-2 focus:ring-[#075E2B] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Brief Overview of Proposed Collaboration *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe your mandate, intended capital deployment or commodity volume requirements..."
                  value={proposal}
                  onChange={(e) => setProposal(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg focus:ring-2 focus:ring-[#075E2B] focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-medium text-neutral-600 hover:text-neutral-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="py-2.5 px-6 rounded-lg bg-[#075E2B] hover:bg-[#064e24] text-white font-bold text-xs flex items-center gap-2 shadow-md disabled:opacity-50 cursor-pointer"
                >
                  <span>{loading ? 'Transmitting...' : 'Submit Partnership Proposal'}</span>
                  <ArrowRight className="w-4 h-4 text-[#F4B400]" />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
