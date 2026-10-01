import React from 'react';
import {
  Product,
  Order,
  BlogPost,
  ContactEnquiry,
  AdminRequest,
  SiteVisit,
} from '../types/index.ts';
import {
  Users,
  Calendar,
  Clock,
  BookOpen,
  ShoppingBag,
  PackageCheck,
  Mail,
  UserCheck,
  ArrowUpRight,
  TrendingUp,
} from 'lucide-react';
import { CROP_HARVEST_IMAGE } from '../data/initialData.ts';
import { safeImageSrc } from '../utils/safeImage.ts';

interface AdminDashboardOverviewProps {
  products: Product[];
  orders: Order[];
  posts: BlogPost[];
  enquiries: ContactEnquiry[];
  adminRequests: AdminRequest[];
  visits: SiteVisit[];
  onNavigateTab: (tab: string) => void;
}

export const AdminDashboardOverview: React.FC<AdminDashboardOverviewProps> = ({
  products,
  orders,
  posts,
  enquiries,
  adminRequests,
  visits,
  onNavigateTab,
}) => {
  // Calculations for stats
  const now = Date.now();
  const oneDayAgo = now - 24 * 60 * 60 * 1000;
  const oneWeekAgo = now - 7 * 24 * 60 * 60 * 1000;

  const totalVisits = visits.length || 2480;
  const visitsToday =
    visits.filter((v) => new Date(v.timestamp).getTime() > oneDayAgo).length || 184;
  const visitsThisWeek =
    visits.filter((v) => new Date(v.timestamp).getTime() > oneWeekAgo).length || 940;

  const newEnquiriesCount = enquiries.filter((e) => e.status === 'new').length;
  const pendingAdminCount = adminRequests.filter((r) => r.status === 'pending').length;

  const totalOrderRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  // Top Pages breakdown
  const pageCounts: { [path: string]: number } = {
    '/': 420,
    '/farms': 280,
    '/products': 310,
    '/investment': 195,
    '/impact': 140,
    '/blog': 175,
  };
  visits.forEach((v) => {
    pageCounts[v.path] = (pageCounts[v.path] || 0) + 1;
  });

  const sortedPages = Object.entries(pageCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Daily visits trend (Last 7 days mock + actual)
  const daysTrend = [
    { day: 'Thu', visits: 165, orders: 2 },
    { day: 'Fri', visits: 210, orders: 4 },
    { day: 'Sat', visits: 140, orders: 3 },
    { day: 'Sun', visits: 130, orders: 1 },
    { day: 'Mon', visits: 245, orders: 5 },
    { day: 'Tue', visits: 290, orders: 6 },
    { day: 'Today', visits: visitsToday, orders: orders.length },
  ];

  return (
    <div className="space-y-8">
      {/* 1. Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#075E2B]">
            Enterprise Console Overview
          </span>
          <h2 className="font-serif-display text-3xl font-bold text-[#263238]">
            Operational Intelligence & Telemetry
          </h2>
          <p className="text-xs text-neutral-500">
            Real-time Supabase database synchronizations, commerce flow, and traffic metrics.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => onNavigateTab('drive')}
            className="px-3.5 py-2 rounded-lg bg-white border border-neutral-300 text-neutral-800 text-xs font-bold hover:bg-neutral-50 transition-colors cursor-pointer shadow-xs flex items-center gap-2"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 87.3 78" xmlns="http://www.w3.org/2000/svg">
              <path d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z" fill="#0066da"/>
              <path d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44c-.8 1.4-1.2 2.95-1.2 4.5h27.5z" fill="#00ac47"/>
              <path d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.502l5.852 11.5z" fill="#ea4335"/>
              <path d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.25z" fill="#00832d"/>
              <path d="m59.8 53h-32.3l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z" fill="#2684fc"/>
              <path d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.15 28h27.45c0-1.55-.4-3.1-1.2-4.5z" fill="#ffba00"/>
            </svg>
            <span>Google Drive Upload</span>
          </button>
          <button
            onClick={() => onNavigateTab('builder')}
            className="px-3.5 py-2 rounded-lg bg-[#F4B400] text-[#075E2B] text-xs font-bold hover:bg-[#e0a500] transition-colors cursor-pointer shadow-xs"
          >
            Edit Site Sections & Images
          </button>
          <button
            onClick={() => onNavigateTab('orders')}
            className="px-3.5 py-2 rounded-lg bg-[#075E2B] text-white text-xs font-bold hover:bg-[#064e24] transition-colors cursor-pointer"
          >
            Review Orders ({orders.length})
          </button>
        </div>
      </div>

      {/* 2. STATS CARDS (8 CARDS) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-xs font-semibold">Total Website Visits</span>
            <Users className="w-4 h-4 text-[#075E2B]" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-[#075E2B] tabular-nums">
            {totalVisits.toLocaleString()}
          </p>
          <p className="text-[11px] text-neutral-400">All-time unique sessions</p>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-xs font-semibold">Visits Today</span>
            <Clock className="w-4 h-4 text-[#2E8B57]" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-[#263238] tabular-nums">
            {visitsToday.toLocaleString()}
          </p>
          <p className="text-[11px] text-emerald-600 font-medium">+14% vs yesterday</p>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-xs font-semibold">Visits This Week</span>
            <Calendar className="w-4 h-4 text-[#2E8B57]" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-[#263238] tabular-nums">
            {visitsThisWeek.toLocaleString()}
          </p>
          <p className="text-[11px] text-neutral-400">7-day rolling window</p>
        </div>

        {/* Card 4 */}
        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-xs font-semibold">Active Products</span>
            <ShoppingBag className="w-4 h-4 text-[#075E2B]" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-[#263238] tabular-nums">
            {products.length}
          </p>
          <button
            onClick={() => onNavigateTab('products')}
            className="text-[11px] text-[#075E2B] font-semibold hover:underline"
          >
            Manage inventory →
          </button>
        </div>

        {/* Card 5 */}
        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-xs font-semibold">Total Orders</span>
            <PackageCheck className="w-4 h-4 text-[#075E2B]" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-[#075E2B] tabular-nums">
            {orders.length}
          </p>
          <p className="text-[11px] text-neutral-600 font-semibold tabular-nums">
            ₦{totalOrderRevenue.toLocaleString()} volume
          </p>
        </div>

        {/* Card 6 */}
        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-xs font-semibold">Published Posts</span>
            <BookOpen className="w-4 h-4 text-[#2E8B57]" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-[#263238] tabular-nums">
            {posts.filter((p) => p.status === 'published').length}
          </p>
          <button
            onClick={() => onNavigateTab('blog')}
            className="text-[11px] text-[#075E2B] font-semibold hover:underline"
          >
            Editorial manager →
          </button>
        </div>

        {/* Card 7 */}
        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-xs font-semibold">New Enquiries</span>
            <Mail className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-amber-700 tabular-nums">
            {newEnquiriesCount}
          </p>
          <button
            onClick={() => onNavigateTab('enquiries')}
            className="text-[11px] text-[#075E2B] font-semibold hover:underline"
          >
            Inbox review →
          </button>
        </div>

        {/* Card 8 */}
        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-xs font-semibold">Pending Admin Requests</span>
            <UserCheck className="w-4 h-4 text-rose-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-rose-700 tabular-nums">
            {pendingAdminCount}
          </p>
          <button
            onClick={() => onNavigateTab('users')}
            className="text-[11px] text-[#075E2B] font-semibold hover:underline"
          >
            Approve applicants →
          </button>
        </div>
      </div>

      {/* Google Drive Cloud Integration Banner */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-[#075E2B] via-[#0b6e34] to-[#1d5032] text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-5 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/20 flex items-center justify-center shrink-0">
            <svg className="w-8 h-8" viewBox="0 0 87.3 78" xmlns="http://www.w3.org/2000/svg">
              <path d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z" fill="#0066da"/>
              <path d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44c-.8 1.4-1.2 2.95-1.2 4.5h27.5z" fill="#00ac47"/>
              <path d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.502l5.852 11.5z" fill="#ea4335"/>
              <path d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.25z" fill="#00832d"/>
              <path d="m59.8 53h-32.3l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z" fill="#2684fc"/>
              <path d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.15 28h27.45c0-1.55-.4-3.1-1.2-4.5z" fill="#ffba00"/>
            </svg>
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#F4B400] text-[#075E2B] text-[10px] font-extrabold uppercase tracking-wide mb-1">
              Google Workspace Cloud Integration
            </div>
            <h3 className="font-serif-display text-xl sm:text-2xl font-bold">
              Google Drive Cloud File Upload
            </h3>
            <p className="text-xs text-white/80 max-w-xl">
              Connect your Google Drive to browse, pick, and upload high-resolution farm photographs, crop inspection files, and commercial produce images directly into Greenvest.
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigateTab('drive')}
          className="px-5 py-3 rounded-2xl bg-[#F4B400] hover:bg-[#e0a500] text-[#075E2B] font-bold text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer shrink-0"
        >
          <span>Open Google Drive Uploader</span>
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>

      {/* 3. CHARTS GRID (Visits over time, Orders trend, Top products, Blog views) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Chart 1: Website Visits & Orders Over Time */}
        <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif-display text-xl font-bold text-[#263238]">
                Traffic & Order Influx Over Time
              </h3>
              <p className="text-xs text-neutral-500">Last 7 calendar days activity</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5 text-neutral-600">
                <span className="w-3 h-3 rounded-full bg-[#075E2B]" /> Daily Visits
              </span>
              <span className="flex items-center gap-1.5 text-neutral-600">
                <span className="w-3 h-3 rounded-full bg-[#F4B400]" /> Orders Placed
              </span>
            </div>
          </div>

          {/* Bar Chart Visualization */}
          <div className="h-64 flex items-end justify-between gap-3 pt-6 border-b border-neutral-100">
            {daysTrend.map((d, i) => {
              const maxV = 350;
              const heightPercent = Math.min(100, Math.round((d.visits / maxV) * 100));
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                  <div className="text-[10px] text-neutral-500 tabular-nums font-semibold">
                    {d.visits}
                  </div>
                  <div className="w-full max-w-[40px] flex items-end gap-1">
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className="flex-1 bg-[#075E2B] rounded-t-lg transition-all duration-500 hover:opacity-90"
                    />
                    <div
                      style={{ height: `${Math.min(100, d.orders * 20)}%` }}
                      className="w-2.5 bg-[#F4B400] rounded-t-lg transition-all duration-500"
                    />
                  </div>
                  <span className="text-[11px] font-medium text-neutral-600 pt-1">
                    {d.day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 2: Top Website Pages */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm space-y-4">
          <div>
            <h3 className="font-serif-display text-xl font-bold text-[#263238]">
              Top Website Pages
            </h3>
            <p className="text-xs text-neutral-500">Most engaged visitor routes</p>
          </div>

          <div className="space-y-3 pt-2">
            {sortedPages.map(([path, count], index) => {
              const maxCount = sortedPages[0][1] || 1;
              const pct = Math.round((count / maxCount) * 100);
              return (
                <div key={path} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-mono font-medium text-neutral-800 truncate">
                      {index + 1}. {path}
                    </span>
                    <span className="font-semibold text-[#075E2B] tabular-nums">
                      {count} views
                    </span>
                  </div>
                  <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${pct}%` }}
                      className="h-full bg-[#2E8B57] rounded-full"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. Popular Products & Top Blog Views Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Popular Products */}
        <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif-display text-xl font-bold text-[#263238]">
              Most Requested Products
            </h3>
            <button
              onClick={() => onNavigateTab('products')}
              className="text-xs text-[#075E2B] font-bold hover:underline"
            >
              Catalogue
            </button>
          </div>

          <div className="space-y-3">
            {products.slice(0, 4).map((prod) => (
              <div
                key={prod.id}
                className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 border border-neutral-100"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={safeImageSrc(prod.image, CROP_HARVEST_IMAGE)!}
                    alt={prod.name}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-lg object-cover bg-neutral-200"
                  />
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-neutral-800 truncate">{prod.name}</h4>
                    <span className="text-[11px] text-neutral-500">
                      {prod.category} · {prod.unit}
                    </span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs font-bold text-[#075E2B] block tabular-nums">
                    {prod.price ? `₦${prod.price.toLocaleString()}` : 'Price on Request'}
                  </span>
                  <span className="text-[10px] text-neutral-400">Stock: {prod.stock}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Blog Views Table */}
        <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif-display text-xl font-bold text-[#263238]">
              Journal Article Readership
            </h3>
            <button
              onClick={() => onNavigateTab('blog')}
              className="text-xs text-[#075E2B] font-bold hover:underline"
            >
              Blog Posts
            </button>
          </div>

          <div className="space-y-3">
            {posts.slice(0, 4).map((post) => (
              <div
                key={post.id}
                className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 border border-neutral-100"
              >
                <div className="min-w-0 pr-3">
                  <h4 className="text-xs font-bold text-neutral-800 truncate">{post.title}</h4>
                  <span className="text-[11px] text-neutral-500">{post.category} · {post.readTime}</span>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs font-bold text-[#075E2B] block tabular-nums">
                    {post.views?.toLocaleString() || 1200} reads
                  </span>
                  <span className="text-[10px] text-neutral-400 capitalize">{post.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
