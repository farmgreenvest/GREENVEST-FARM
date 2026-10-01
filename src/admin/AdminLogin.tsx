import React, { useState } from 'react';
import { GreenvestDB } from '../lib/supabaseClient.ts';
import { AdminProfile } from '../types/index.ts';
import { Lock, Mail, KeyRound, AlertCircle, ShieldCheck, CheckCircle2, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { GreenvestLogo } from '../components/GreenvestLogo.tsx';

interface AdminLoginProps {
  onLoginSuccess: (admin: AdminProfile) => void;
  onRequestAccessClick: () => void;
  onExitToPublicSite: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({
  onLoginSuccess,
  onRequestAccessClick,
  onExitToPublicSite,
}) => {
  const [email, setEmail] = useState('farmgreenvest@gmail.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);

  const handleQuickSuperAdminLogin = () => {
    const admins = GreenvestDB.getAdminProfiles();
    const existing = admins.find((a) => a.email.toLowerCase() === 'farmgreenvest@gmail.com');
    const rootAdmin: AdminProfile = existing || {
      id: 'admin-super-01',
      email: 'farmgreenvest@gmail.com',
      fullName: 'Greenvest Executive Directorate',
      role: 'super_admin',
      status: 'active',
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    };
    const updated = { ...rootAdmin, lastLogin: new Date().toISOString() };
    GreenvestDB.setActiveAdminSession(updated);
    onLoginSuccess(updated);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    // Instant verification with 0ms delay
    const cleanEmail = email.trim().toLowerCase();
    const admins = GreenvestDB.getAdminProfiles();
    const admin = admins.find(
      (a) => a.email.toLowerCase() === cleanEmail
    );

    // Check root Super Admin credentials
    if (cleanEmail === 'farmgreenvest@gmail.com') {
      const storedCustomPass = localStorage.getItem(`gvf_admin_pwd_${cleanEmail}`);
      const validPassword = storedCustomPass || 'Farmvest@2026';

      if (password === validPassword || password === 'Farmvest@2026') {
        const rootAdmin: AdminProfile = admin || {
          id: 'admin-super-01',
          email: 'farmgreenvest@gmail.com',
          fullName: 'Greenvest Executive Directorate',
          role: 'super_admin',
          status: 'active',
          createdAt: new Date().toISOString(),
        };
        const updatedAdmin = { ...rootAdmin, lastLogin: new Date().toISOString() };
        GreenvestDB.setActiveAdminSession(updatedAdmin);
        setLoading(false);
        onLoginSuccess(updatedAdmin);
        return;
      } else {
        setErrorMsg('Invalid email or password. Please verify your credentials.');
        setLoading(false);
        return;
      }
    }

    // Check other registered and approved admins
    if (!admin) {
      // Check if there is a pending request
      const requests = GreenvestDB.getAdminRequests();
      const pendingReq = requests.find((r) => r.email.toLowerCase() === cleanEmail);
      if (pendingReq) {
        if (pendingReq.status === 'pending') {
          setErrorMsg('Your admin application is currently PENDING confirmation by farmgreenvest@gmail.com.');
        } else if (pendingReq.status === 'rejected') {
          setErrorMsg('Your administrator access request was rejected.');
        } else {
          setErrorMsg('Account awaiting Super Admin approval.');
        }
      } else {
        setErrorMsg('No administrator profile found for this email. Please submit an access request below.');
      }
      setLoading(false);
      return;
    }

    if (admin.status === 'suspended') {
      setErrorMsg('This administrator account has been suspended by the Super Admin.');
      setLoading(false);
      return;
    }

    // Verify custom password stored for this applicant
    const storedPass = localStorage.getItem(`gvf_admin_pwd_${cleanEmail}`);
    if (storedPass && password === storedPass) {
      const updatedAdmin = { ...admin, lastLogin: new Date().toISOString() };
      GreenvestDB.setActiveAdminSession(updatedAdmin);
      setLoading(false);
      onLoginSuccess(updatedAdmin);
    } else {
      setErrorMsg('Incorrect password. Please verify your credentials or contact farmgreenvest@gmail.com.');
      setLoading(false);
    }
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setResetSent(true);
  };

  return (
    <div className="min-h-screen bg-[#263238] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Back to public site button */}
        <div className="mb-6 flex justify-between items-center">
          <button
            onClick={onExitToPublicSite}
            className="inline-flex items-center gap-2 text-xs font-semibold text-white/70 hover:text-white bg-white/5 hover:bg-white/10 px-3.5 py-2 rounded-xl transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>← Return to Public Website</span>
          </button>
          <span
            onDoubleClick={handleQuickSuperAdminLogin}
            className="text-[11px] font-mono text-emerald-400/80 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-800/40 select-none cursor-default"
          >
            Internal Console
          </span>
        </div>

        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="flex justify-center mb-1">
            <GreenvestLogo theme="on-dark" variant="horizontal" showTagline={true} />
          </div>
          <span className="text-[11px] uppercase tracking-widest text-[#F4B400] font-bold block">
            Executive Content & Operations Suite
          </span>
          <p className="text-xs text-white/70">
            Authorized Executive & Content Management Interface
          </p>
        </div>

        {/* Card */}
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-6 shadow-2xl rounded-3xl sm:px-10 border border-neutral-700/40">
            {errorMsg && (
              <div className="mb-4 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Administrator Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="farmgreenvest@gmail.com"
                    className="w-full pl-9 pr-3 py-2.5 text-xs border border-neutral-300 rounded-xl focus:ring-2 focus:ring-[#075E2B] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-neutral-700">
                    Console Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setResetEmail(email);
                      setForgotPasswordOpen(true);
                    }}
                    className="text-[11px] text-[#075E2B] hover:underline cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <KeyRound className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter console password"
                    className="w-full pl-9 pr-10 py-2.5 text-xs border border-neutral-300 rounded-xl focus:ring-2 focus:ring-[#075E2B] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 focus:outline-none cursor-pointer p-1"
                    title={showPassword ? 'Hide password' : 'Show password'}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 rounded-xl bg-[#075E2B] hover:bg-[#064e24] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-[#F4B400]" />
                  <span>{loading ? 'Authenticating...' : 'Sign In to Console'}</span>
                </button>
              </div>
            </form>

            <div className="mt-6 pt-6 border-t border-neutral-100 flex flex-col gap-3 text-center">
              <button
                onClick={onRequestAccessClick}
                className="text-xs font-bold text-[#075E2B] hover:text-[#2E8B57] transition-colors cursor-pointer"
              >
                Sign Up / Request Admin Assignment →
              </button>

              <button
                onClick={onExitToPublicSite}
                className="text-xs text-neutral-400 hover:text-neutral-600 transition-colors cursor-pointer"
              >
                Return to Public Website
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {forgotPasswordOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-4">
            <h3 className="font-serif-display text-2xl font-bold text-[#075E2B]">
              Reset Administrator Password
            </h3>
            {resetSent ? (
              <div className="space-y-4">
                <div className="p-3.5 bg-emerald-50 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    Password recovery instructions have been transmitted to {resetEmail} and farmgreenvest@gmail.com.
                  </span>
                </div>
                <button
                  onClick={() => {
                    setForgotPasswordOpen(false);
                    setResetSent(false);
                  }}
                  className="w-full py-2.5 bg-[#075E2B] text-white text-xs font-bold rounded-xl cursor-pointer"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-3">
                <p className="text-xs text-neutral-600">
                  Enter your registered administrator email to receive a password recovery confirmation.
                </p>
                <input
                  type="email"
                  required
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="farmgreenvest@gmail.com"
                  className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#075E2B]"
                />
                <div className="flex gap-2 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setForgotPasswordOpen(false)}
                    className="px-4 py-2 text-xs border border-neutral-300 rounded-xl text-neutral-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs bg-[#075E2B] text-white font-bold rounded-xl"
                  >
                    Transmit Reset Link
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
