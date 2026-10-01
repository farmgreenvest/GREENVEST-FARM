import React, { useState } from 'react';
import {
  AdminProfile,
  Product,
  Order,
  BlogPost,
  ContactEnquiry,
  AdminRequest,
  SiteVisit,
  SiteSettings,
  Farm,
  ServiceItem,
  InstitutionalPartner,
  ImpactMetric,
} from '../types/index.ts';
import { AdminDashboardOverview } from './AdminDashboardOverview.tsx';
import { AdminWebsiteBuilder } from './AdminWebsiteBuilder.tsx';
import { AdminMediaLibrary } from './AdminMediaLibrary.tsx';
import { AdminBlogManager } from './AdminBlogManager.tsx';
import { AdminProductsManager } from './AdminProductsManager.tsx';
import { AdminOrdersManager } from './AdminOrdersManager.tsx';
import { AdminEnquiriesManager } from './AdminEnquiriesManager.tsx';
import { AdminUsersManager } from './AdminUsersManager.tsx';
import { AdminAnalyticsView } from './AdminAnalyticsView.tsx';
import { AdminSupabaseConfig } from './AdminSupabaseConfig.tsx';
import { AdminGoogleDriveManager } from './AdminGoogleDriveManager.tsx';
import {
  LayoutDashboard,
  Palette,
  Image,
  BookOpen,
  ShoppingBag,
  PackageCheck,
  Mail,
  Users,
  BarChart2,
  Database,
  LogOut,
  KeyRound,
  ExternalLink,
  Shield,
  X,
  CheckCircle2,
  HardDrive,
} from 'lucide-react';
import { GreenvestLogo } from '../components/GreenvestLogo.tsx';

interface AdminLayoutProps {
  currentAdmin: AdminProfile;
  onLogout: () => void;
  onReturnToPublicSite: () => void;
  // Shared state props
  settings: SiteSettings;
  onSettingsUpdated: (updated: SiteSettings) => void;
  products: Product[];
  onProductsUpdated: (products: Product[]) => void;
  farms?: Farm[];
  onFarmsUpdated?: (farms: Farm[]) => void;
  services?: ServiceItem[];
  onServicesUpdated?: (services: ServiceItem[]) => void;
  partners?: InstitutionalPartner[];
  onPartnersUpdated?: (partners: InstitutionalPartner[]) => void;
  impactMetrics?: ImpactMetric[];
  onImpactMetricsUpdated?: (metrics: ImpactMetric[]) => void;
  orders: Order[];
  onOrdersUpdated: (orders: Order[]) => void;
  posts: BlogPost[];
  onPostsUpdated: (posts: BlogPost[]) => void;
  enquiries: ContactEnquiry[];
  onEnquiriesUpdated: (enquiries: ContactEnquiry[]) => void;
  adminProfiles: AdminProfile[];
  adminRequests: AdminRequest[];
  onAdminsUpdated: () => void;
  visits: SiteVisit[];
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentAdmin,
  onLogout,
  onReturnToPublicSite,
  settings,
  onSettingsUpdated,
  products,
  onProductsUpdated,
  farms,
  onFarmsUpdated,
  services,
  onServicesUpdated,
  partners,
  onPartnersUpdated,
  impactMetrics,
  onImpactMetricsUpdated,
  orders,
  onOrdersUpdated,
  posts,
  onPostsUpdated,
  enquiries,
  onEnquiriesUpdated,
  adminProfiles,
  adminRequests,
  onAdminsUpdated,
  visits,
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [passwordChangeModal, setPasswordChangeModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwdChangedSuccess, setPwdChangedSuccess] = useState(false);
  const [pwdError, setPwdError] = useState('');

  const isSuperAdmin = currentAdmin.role === 'super_admin';
  const isAdminOrSuper = currentAdmin.role === 'super_admin' || currentAdmin.role === 'admin';

  const menuItems = [
    { id: 'overview', label: 'Overview & Telemetry', icon: LayoutDashboard, allowed: true },
    { id: 'builder', label: 'Visual Website Builder', icon: Palette, allowed: true },
    { id: 'media', label: 'Media Library (site-media)', icon: Image, allowed: true },
    { id: 'drive', label: 'Google Drive Upload', icon: HardDrive, allowed: true },
    { id: 'blog', label: 'Editorial & Journal', icon: BookOpen, allowed: true },
    { id: 'products', label: 'Products & Catalogue', icon: ShoppingBag, allowed: isAdminOrSuper },
    { id: 'orders', label: 'Orders & Dispatches', icon: PackageCheck, allowed: isAdminOrSuper },
    { id: 'enquiries', label: 'Inbound Enquiries', icon: Mail, allowed: isAdminOrSuper },
    { id: 'users', label: 'Users & Permissions', icon: Users, allowed: isSuperAdmin },
    { id: 'analytics', label: 'Analytics Telemetry', icon: BarChart2, allowed: isAdminOrSuper },
    { id: 'supabase', label: 'Supabase SQL & Config', icon: Database, allowed: isSuperAdmin },
  ];

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setPwdError('');

    if (newPassword.length < 8) {
      setPwdError('Password must contain at least 8 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPwdError('Passwords do not match. Please re-enter.');
      return;
    }

    localStorage.setItem(`gvf_admin_pwd_${currentAdmin.email.toLowerCase()}`, newPassword);
    setPwdChangedSuccess(true);
    setTimeout(() => {
      setPasswordChangeModal(false);
      setPwdChangedSuccess(false);
      setNewPassword('');
      setConfirmPassword('');
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-[#F7F3E8]/50 flex">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-[#263238] text-white flex flex-col justify-between shrink-0 shadow-xl border-r border-neutral-700/50">
        <div>
          {/* Brand Header */}
          <div className="p-5 border-b border-neutral-700/60 space-y-2">
            <GreenvestLogo theme="on-dark" variant="horizontal" showTagline={false} />
            <div className="flex items-center justify-between pt-1">
              <span className="text-[10px] text-[#F4B400] font-semibold uppercase tracking-wider">
                Executive Portal
              </span>
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-900/60 text-emerald-300 font-mono">
                v2026.4
              </span>
            </div>
          </div>

          {/* Current Admin Session Badge */}
          <div className="px-6 py-4 border-b border-neutral-700/40 bg-neutral-800/40">
            <span className="text-[10px] uppercase font-bold text-neutral-400 block">Logged In As</span>
            <span className="text-xs font-bold text-white truncate block">{currentAdmin.fullName}</span>
            <span className="text-[10px] font-mono text-[#F4B400] capitalize">
              Role: {currentAdmin.role.replace('_', ' ')}
            </span>
          </div>

          {/* Nav List */}
          <nav className="p-4 space-y-1">
            {menuItems
              .filter((item) => item.allowed)
              .map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                const pendingAdminCount = (adminRequests || []).filter((r) => r.status === 'pending').length;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#075E2B] text-white shadow-md font-bold'
                        : 'text-neutral-300 hover:bg-neutral-800 hover:text-white'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#F4B400]' : 'text-neutral-400'}`} />
                    <span className="truncate flex-1 text-left">{item.label}</span>
                    {item.id === 'users' && pendingAdminCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-[#F4B400] text-neutral-900 font-extrabold text-[10px] shrink-0 animate-pulse">
                        {pendingAdminCount}
                      </span>
                    )}
                  </button>
                );
              })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-neutral-700/60 space-y-2">
          <button
            onClick={() => setPasswordChangeModal(true)}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-neutral-300 hover:text-white hover:bg-neutral-800 rounded-xl transition-colors cursor-pointer"
          >
            <KeyRound className="w-4 h-4 text-neutral-400" />
            <span>Change Password</span>
          </button>

          <button
            onClick={onReturnToPublicSite}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-neutral-300 hover:text-white hover:bg-neutral-800 rounded-xl transition-colors cursor-pointer"
          >
            <ExternalLink className="w-4 h-4 text-neutral-400" />
            <span>View Public Website</span>
          </button>

          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-bold text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 rounded-xl transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Terminate Session</span>
          </button>
        </div>
      </aside>

      {/* Main Workspace */}
      <main className="flex-1 overflow-y-auto p-6 sm:p-10">
        <div className="max-w-7xl mx-auto">
          {activeTab === 'overview' && (
            <AdminDashboardOverview
              products={products}
              orders={orders}
              posts={posts}
              enquiries={enquiries}
              adminRequests={adminRequests}
              visits={visits}
              onNavigateTab={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'builder' && (
            <AdminWebsiteBuilder
              settings={settings}
              onSettingsUpdated={onSettingsUpdated}
              farms={farms}
              onFarmsUpdated={onFarmsUpdated}
              services={services}
              onServicesUpdated={onServicesUpdated}
              products={products}
              onProductsUpdated={onProductsUpdated}
              partners={partners}
              onPartnersUpdated={onPartnersUpdated}
              impactMetrics={impactMetrics}
              onImpactMetricsUpdated={onImpactMetricsUpdated}
            />
          )}

          {activeTab === 'media' && <AdminMediaLibrary />}

          {activeTab === 'drive' && (
            <AdminGoogleDriveManager onNavigateTab={(tab) => setActiveTab(tab)} />
          )}

          {activeTab === 'blog' && (
            <AdminBlogManager posts={posts} onPostsUpdated={onPostsUpdated} />
          )}

          {activeTab === 'products' && (
            <AdminProductsManager
              products={products}
              onProductsUpdated={onProductsUpdated}
            />
          )}

          {activeTab === 'orders' && (
            <AdminOrdersManager
              orders={orders}
              onOrdersUpdated={onOrdersUpdated}
            />
          )}

          {activeTab === 'enquiries' && (
            <AdminEnquiriesManager
              enquiries={enquiries}
              onEnquiriesUpdated={onEnquiriesUpdated}
            />
          )}

          {activeTab === 'users' && (
            <AdminUsersManager
              currentAdmin={currentAdmin}
              adminProfiles={adminProfiles}
              adminRequests={adminRequests}
              onAdminsUpdated={onAdminsUpdated}
            />
          )}

          {activeTab === 'analytics' && <AdminAnalyticsView visits={visits} />}

          {activeTab === 'supabase' && <AdminSupabaseConfig />}
        </div>
      </main>

      {/* Change Password Modal */}
      {passwordChangeModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <h3 className="font-serif-display text-xl font-bold text-[#075E2B]">
                Update Console Password
              </h3>
              <button
                onClick={() => setPasswordChangeModal(false)}
                className="text-neutral-400 hover:text-neutral-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {pwdChangedSuccess ? (
              <div className="p-4 bg-emerald-50 rounded-2xl text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Password successfully changed. Your new credentials have been updated.</span>
              </div>
            ) : (
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <p className="text-xs text-neutral-600">
                  Update your personal login password for {currentAdmin.email}.
                </p>

                {pwdError && (
                  <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
                    {pwdError}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    New Secure Password *
                  </label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimum 8 characters"
                    className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-xl focus:ring-2 focus:ring-[#075E2B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Confirm New Password *
                  </label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat new password"
                    className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-xl focus:ring-2 focus:ring-[#075E2B]"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setPasswordChangeModal(false)}
                    className="px-4 py-2 border border-neutral-300 rounded-xl text-xs font-semibold text-neutral-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#075E2B] text-white font-bold text-xs rounded-xl hover:bg-[#064e24]"
                  >
                    Update Password
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
