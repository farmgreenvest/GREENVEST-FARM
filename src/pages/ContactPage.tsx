import React, { useState } from 'react';
import { GreenvestDB } from '../lib/supabaseClient.ts';
import { SiteSettings } from '../types/index.ts';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, MessageCircle } from 'lucide-react';

interface ContactPageProps {
  settings?: SiteSettings;
}

export const ContactPage: React.FC<ContactPageProps> = ({ settings: propSettings }) => {
  const settings = propSettings || GreenvestDB.getSettings();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [subject, setSubject] = useState('Commercial Grain Offtake Enquiry');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    GreenvestDB.createEnquiry({
      name,
      email,
      phone,
      company,
      subject,
      message,
    });

    setLoading(false);
    setSubmitted(true);
  };

  const cleanWhatsApp = (settings.whatsappNumber || '2348139487363').replace(/[^0-9]/g, '');

  const handleOpenDirectWhatsApp = () => {
    const text = `Hello Greenvest Farms,
My name is ${name}${company ? ` from ${company}` : ''}.
Regarding: ${subject}
Phone: ${phone}
Email: ${email}
Message: ${message}`;
    window.open(`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="space-y-16 sm:space-y-24 py-8">
      {/* Page Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#075E2B]/10 text-[#075E2B] text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#075E2B]" />
            <span>Direct Commercial Trade Desk</span>
          </div>

          <h1 className="font-serif-display text-4xl sm:text-6xl font-bold text-[#075E2B]">
            Connect With Greenvest Farms
          </h1>

          <p className="text-base sm:text-lg text-neutral-700 leading-relaxed">
            Contact our trade desk for wholesale agricultural contracts, institutional partnership proposals, farm visits, or product specifications.
          </p>
        </div>
      </section>

      {/* Main Grid: Info + Contact Form */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Contact Details Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#075E2B] text-white rounded-3xl p-8 sm:p-10 space-y-8 shadow-xl">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#F4B400] font-semibold">
                  Corporate Headquarters
                </span>
                <h2 className="font-serif-display text-2xl sm:text-3xl font-bold mt-1">
                  Executive & Trading Offices
                </h2>
              </div>

              <div className="space-y-5 text-sm">
                <div className="flex items-start gap-3.5">
                  <MapPin className="w-5 h-5 text-[#F4B400] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">Abuja Headquarters:</span>
                    <span className="text-white/80 text-xs leading-relaxed">
                      {settings.officeAddressAbuja || 'Plot 104, Commercial Agriculture Boulevard, Central Business District, Abuja, FCT, Nigeria'}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <MapPin className="w-5 h-5 text-[#F4B400] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">Lagos Commercial Office:</span>
                    <span className="text-white/80 text-xs leading-relaxed">
                      {settings.officeAddressLagos || 'Epe Agribusiness Logistics Hub, Lekki-Epe Expressway, Lagos State, Nigeria'}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <Phone className="w-5 h-5 text-[#F4B400] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">Direct Phone & WhatsApp:</span>
                    <span className="text-white/80 text-xs">
                      {settings.primaryPhone || '+234 813 948 7363'}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <Mail className="w-5 h-5 text-[#F4B400] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">Official Communications:</span>
                    <span className="text-white/80 text-xs">{settings.contactEmail || 'farmgreenvest@gmail.com'}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <Clock className="w-5 h-5 text-[#F4B400] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">Trade Desk Operations:</span>
                    <span className="text-white/80 text-xs">
                      Monday – Friday: 08:00 – 18:00 WAT<br />
                      Saturday (Dispatches): 09:00 – 14:00 WAT
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/15">
                <a
                  href={`https://wa.me/${cleanWhatsApp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Chat Direct on WhatsApp ({settings.whatsappNumber || '08139487363'})</span>
                </a>
              </div>
            </div>
          </div>

          {/* Form Column */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-8 sm:p-10 border border-neutral-200 shadow-sm">
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="font-serif-display text-2xl font-bold text-[#263238]">
                  Enquiry Logged in Supabase Database
                </h3>
                <p className="text-sm text-neutral-600 max-w-md mx-auto">
                  Thank you, {name}. Your transmission has been saved to our commercial enquiries registry. A Greenvest trade representative will review and contact you promptly.
                </p>
                <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={handleOpenDirectWhatsApp}
                    className="px-5 py-2.5 rounded-lg bg-[#25D366] text-white font-bold text-xs flex items-center justify-center gap-2 hover:bg-[#20ba5a] cursor-pointer"
                  >
                    <span>Also Transmit via WhatsApp</span>
                  </button>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setMessage('');
                    }}
                    className="px-5 py-2.5 rounded-lg border border-neutral-300 text-neutral-700 font-semibold text-xs hover:bg-neutral-50 cursor-pointer"
                  >
                    Send Another Enquiry
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <h3 className="font-serif-display text-2xl font-bold text-[#075E2B]">
                    Send Corporate Message
                  </h3>
                  <p className="text-xs text-neutral-500 mt-1">
                    Fill out the form below to connect directly with our sales, agronomy, or partnership teams.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Oladipo Adeleke"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg focus:ring-2 focus:ring-[#075E2B] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="oladipo@enterprise.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg focus:ring-2 focus:ring-[#075E2B] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+234 803 000 0000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg focus:ring-2 focus:ring-[#075E2B] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Company / Organisation
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Flour Mills & Bakeries Ltd"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg focus:ring-2 focus:ring-[#075E2B] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Subject / Enquiry Nature *
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg focus:ring-2 focus:ring-[#075E2B] focus:outline-none bg-white"
                  >
                    <option>Commercial Grain Offtake Enquiry</option>
                    <option>Bulk Vegetable & Horticultural Supply</option>
                    <option>Aquaculture & Fisheries Bulk Order</option>
                    <option>Agro-Processing & Milling Services</option>
                    <option>Institutional Investment Dialogue</option>
                    <option>Outgrower & Smallholder Collaboration</option>
                    <option>Farm Tour / Due Diligence Visit</option>
                    <option>General Agronomic Enquiry</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Message / Specifications *
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Provide details on quantities required, desired delivery schedule, or partnership specifics..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg focus:ring-2 focus:ring-[#075E2B] focus:outline-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 px-6 rounded-xl bg-[#075E2B] hover:bg-[#064e24] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
                  >
                    <Send className="w-4 h-4 text-[#F4B400]" />
                    <span>{loading ? 'Submitting Enquiry...' : 'Send Enquiry'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
