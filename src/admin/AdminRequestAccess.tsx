import React, { useState } from 'react';
import { GreenvestDB } from '../lib/supabaseClient.ts';
import { ArrowLeft, CheckCircle2, Send, Lock, ShieldCheck, Mail } from 'lucide-react';
import { GreenvestLogo } from '../components/GreenvestLogo.tsx';

interface AdminRequestAccessProps {
  onBackToLogin: () => void;
  onExitToPublicSite: () => void;
}

export const AdminRequestAccess: React.FC<AdminRequestAccessProps> = ({
  onBackToLogin,
  onExitToPublicSite,
}) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [reason, setReason] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Create admin request with pending status and store desired password
    GreenvestDB.createAdminRequest(fullName, email, password, reason);

    setLoading(false);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#263238] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Navigation row */}
        <div className="mb-6 flex justify-between items-center">
          <button
            onClick={onExitToPublicSite}
            className="inline-flex items-center gap-2 text-xs font-semibold text-white/70 hover:text-white bg-white/5 hover:bg-white/10 px-3.5 py-2 rounded-xl transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>← Return to Public Website</span>
          </button>
          <span className="text-[11px] font-mono text-emerald-400/80 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-800/40">
            Staff Portal
          </span>
        </div>

        <div className="text-center space-y-3">
          <div className="flex justify-center mb-1">
            <GreenvestLogo theme="on-dark" variant="horizontal" showTagline={true} />
          </div>
          <span className="text-[11px] uppercase tracking-widest text-[#F4B400] font-bold block">
            Administrator Onboarding
          </span>
          <h1 className="font-serif-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Sign Up for Admin Access
          </h1>
          <p className="text-xs text-white/70">
            New administrator signups require confirmation by farmgreenvest@gmail.com
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-6 shadow-2xl rounded-3xl sm:px-10 border border-neutral-700/40">
            {submitted ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="font-serif-display text-2xl font-bold text-[#075E2B]">
                  Admin Application Submitted
                </h3>
                
                {/* Confirmation message explicitly sent to farmgreenvest@gmail.com */}
                <div className="p-4 bg-emerald-50 rounded-2xl text-xs text-neutral-700 text-left space-y-2.5 border border-emerald-200">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold">
                    <Mail className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Confirmation Sent to Super Admin</span>
                  </div>
                  <p className="leading-relaxed">
                    A confirmation notification has been dispatched to <strong>farmgreenvest@gmail.com</strong>. The Super Admin will review your details and confirm your assignment as an administrator.
                  </p>
                  <div className="pt-1 border-t border-emerald-100 text-[11px] text-neutral-500">
                    Applicant: <strong>{fullName}</strong> ({email})
                  </div>
                </div>

                <div className="pt-3 flex flex-col gap-2.5">
                  <button
                    onClick={onBackToLogin}
                    className="w-full py-3 rounded-xl bg-[#075E2B] text-white font-bold text-xs hover:bg-[#064e24] transition-colors cursor-pointer shadow-md"
                  >
                    Return to Admin Login
                  </button>
                  <button
                    onClick={onExitToPublicSite}
                    className="w-full py-2.5 rounded-xl text-neutral-500 text-xs hover:text-neutral-800 transition-colors cursor-pointer"
                  >
                    Return to Public Website
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Full Legal Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Samuel K. Adeyemi"
                    className="w-full px-3 py-2.5 text-xs border border-neutral-300 rounded-xl focus:ring-2 focus:ring-[#075E2B] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. samuel@greenvestfarms.africa"
                    className="w-full px-3 py-2.5 text-xs border border-neutral-300 rounded-xl focus:ring-2 focus:ring-[#075E2B] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Password *
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Choose your password"
                    className="w-full px-3 py-2.5 text-xs border border-neutral-300 rounded-xl focus:ring-2 focus:ring-[#075E2B] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Reason / Department for Admin Assignment *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="State your operational responsibility (e.g. Agronomy Content Editor, Orders Dispatch Manager, Farm Overseer)..."
                    className="w-full px-3 py-2.5 text-xs border border-neutral-300 rounded-xl focus:ring-2 focus:ring-[#075E2B] focus:outline-none"
                  />
                </div>

                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-[11px] leading-relaxed">
                  <strong>Notice:</strong> Submitting will send an authorization request to <strong>farmgreenvest@gmail.com</strong>. You will be able to log in immediately once the Super Admin confirms your application.
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-4 rounded-xl bg-[#075E2B] hover:bg-[#064e24] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
                  >
                    <Send className="w-4 h-4 text-[#F4B400]" />
                    <span>{loading ? 'Submitting...' : 'Sign Up & Send Confirmation to farmgreenvest@gmail.com'}</span>
                  </button>
                </div>

                <div className="pt-4 border-t border-neutral-100 flex items-center justify-between text-xs">
                  <button
                    type="button"
                    onClick={onBackToLogin}
                    className="text-[#075E2B] hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Login</span>
                  </button>
                  <button
                    type="button"
                    onClick={onExitToPublicSite}
                    className="text-neutral-400 hover:text-neutral-600 cursor-pointer"
                  >
                    Public Website
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
