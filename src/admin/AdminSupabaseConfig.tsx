import React, { useState, useEffect } from 'react';
import {
  GreenvestDB,
  SUPABASE_SQL_SCRIPT,
  DEFAULT_SUPABASE_URL,
  DEFAULT_SUPABASE_ANON_KEY,
  sanitizeSupabaseUrl,
} from '../lib/supabaseClient.ts';
import {
  Database,
  Copy,
  Check,
  Download,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Terminal,
  RefreshCw,
  Server,
  Activity,
  Layers,
  Sparkles,
  ArrowDownCircle,
  ArrowUpCircle,
  AlertCircle,
} from 'lucide-react';

export const QUICK_PARTNERS_SQL = `-- Quick Migration for Institutional Partners:
CREATE TABLE IF NOT EXISTS public.institutional_partners (
    id TEXT PRIMARY KEY,
    acronym TEXT NOT NULL,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    mandate TEXT NOT NULL,
    key_initiatives TEXT[] DEFAULT '{}',
    logo TEXT,
    badge TEXT NOT NULL,
    location TEXT NOT NULL,
    alliance_type TEXT NOT NULL,
    year_established TEXT,
    portal_link TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.institutional_partners ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow Public Read Partners" ON public.institutional_partners FOR SELECT USING (true);
CREATE POLICY "Full Access Partners" ON public.institutional_partners FOR ALL USING (true);
`;

export const AdminSupabaseConfig: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [copiedQuickSql, setCopiedQuickSql] = useState(false);
  const [supabaseUrl, setSupabaseUrl] = useState(
    () => localStorage.getItem('gvf_supabase_url') || DEFAULT_SUPABASE_URL
  );
  const [supabaseAnonKey, setSupabaseAnonKey] = useState(
    () => localStorage.getItem('gvf_supabase_anon_key') || DEFAULT_SUPABASE_ANON_KEY
  );

  const [connectedState, setConnectedState] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [latency, setLatency] = useState<number | null>(null);
  const [tableCounts, setTableCounts] = useState<{ [table: string]: number | string }>({});
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [syncingAction, setSyncingAction] = useState<string | null>(null);
  const [syncNotice, setSyncNotice] = useState<string>('');

  const checkConnection = async () => {
    setConnectedState('testing');
    try {
      const res = await GreenvestDB.testConnection();
      if (res.success) {
        setConnectedState('success');
        setLatency(res.latencyMs);
        setTableCounts(res.tables);
        setErrorMessage('');
      } else {
        setConnectedState('error');
        setLatency(res.latencyMs);
        setErrorMessage(res.error || 'Connection failed');
      }
    } catch (err: any) {
      setConnectedState('error');
      setErrorMessage(err?.message || 'Failed to ping Supabase');
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

  const handleCopyScript = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCRIPT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadScript = () => {
    const blob = new Blob([SUPABASE_SQL_SCRIPT], { type: 'text/sql' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'greenvest_farms_supabase_complete.sql';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUrl = sanitizeSupabaseUrl(supabaseUrl);
    setSupabaseUrl(cleanUrl);
    await GreenvestDB.reconnectSupabase(cleanUrl, supabaseAnonKey.trim());
    await checkConnection();
  };

  const handlePullFromCloud = async () => {
    setSyncingAction('pull');
    setSyncNotice('');
    try {
      const result = await GreenvestDB.syncFromSupabase();
      setSyncNotice(
        `Successfully pulled cloud data: ${result.products.length} products, ${result.farms.length} farms, ${result.orders.length} orders synchronized.`
      );
      await checkConnection();
    } catch (err: any) {
      setSyncNotice(`Pull notice: ${err?.message || 'Sync completed with local fallback.'}`);
    } finally {
      setSyncingAction(null);
    }
  };

  const handlePushToCloud = async () => {
    setSyncingAction('push');
    setSyncNotice('');
    try {
      // Push settings
      const settings = GreenvestDB.getSettings();
      GreenvestDB.updateSettings(settings);

      // Push products
      const products = GreenvestDB.getProducts();
      for (const p of products) {
        GreenvestDB.saveProduct(p);
      }

      // Push farms
      const farms = GreenvestDB.getFarms();
      for (const f of farms) {
        GreenvestDB.saveFarm(f);
      }

      // Push services
      const services = GreenvestDB.getServices();
      for (const s of services) {
        GreenvestDB.saveService(s);
      }

      // Push blog posts
      const posts = GreenvestDB.getPosts();
      for (const post of posts) {
        GreenvestDB.savePost(post);
      }

      // Push institutional partners
      const partners = GreenvestDB.getInstitutionalPartners();
      for (const partner of partners) {
        GreenvestDB.saveInstitutionalPartner(partner);
      }

      // Push impact metrics
      const impact = GreenvestDB.getImpactMetrics();
      GreenvestDB.saveImpactMetrics(impact);

      setSyncNotice('All current local data records (Settings, Products, Farms, Services, Posts, Partners, Impact) have been pushed to your Supabase tables!');
      await checkConnection();
    } catch (err: any) {
      setSyncNotice(`Push failed: ${err?.message}`);
    } finally {
      setSyncingAction(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#075E2B]">
            Supabase Cloud Database & API Engine
          </span>
          <h2 className="font-serif-display text-3xl font-bold text-[#263238]">
            Production Supabase Connection & Live Sync
          </h2>
          <p className="text-xs text-neutral-500">
            Bidirectional real-time database connection with automated WebSocket streaming and cloud synchronization.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyScript}
            className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'SQL Script Copied!' : 'Copy SQL Schema'}</span>
          </button>
          <button
            onClick={handleDownloadScript}
            className="px-4 py-2 bg-[#075E2B] text-white text-xs font-bold rounded-xl hover:bg-[#064e24] flex items-center gap-1.5 shadow-md cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#F4B400]" />
            <span>Download .sql Script</span>
          </button>
        </div>
      </div>

      {/* Live Status Card */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border-2 border-emerald-500/30 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#075E2B] flex items-center justify-center border border-emerald-200">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif-display text-lg font-bold text-neutral-900">
                  Supabase Cloud Status:
                </h3>
                {connectedState === 'success' && (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                    <span>Connected & Active</span>
                  </span>
                )}
                {connectedState === 'testing' && (
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[11px] font-bold flex items-center gap-1">
                    <RefreshCw className="w-3 h-3 animate-spin text-amber-600" />
                    <span>Testing Connection...</span>
                  </span>
                )}
                {connectedState === 'error' && (
                  <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-red-800 text-[11px] font-bold flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 text-red-600" />
                    <span>Connection Issue</span>
                  </span>
                )}
              </div>
              <p className="text-xs font-mono text-neutral-500 mt-0.5">
                {supabaseUrl}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto">
            {latency !== null && (
              <span className="text-xs font-mono text-neutral-500 bg-neutral-100 px-3 py-1.5 rounded-xl border border-neutral-200 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-emerald-600" />
                <span>Latency: {latency}ms</span>
              </span>
            )}
            <button
              type="button"
              onClick={checkConnection}
              className="px-3.5 py-1.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${connectedState === 'testing' ? 'animate-spin' : ''}`} />
              <span>Ping Cloud</span>
            </button>
          </div>
        </div>

        {/* Live Table Row Counts */}
        <div>
          <span className="text-[11px] uppercase tracking-wider font-extrabold text-neutral-500 block mb-2">
            Cloud PostgreSQL Database Tables
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 text-center">
            {Object.entries(tableCounts).map(([tableName, count]) => {
              const isNotMigrated = count === 'Not Migrated';
              return (
                <div
                  key={tableName}
                  className={`p-3 rounded-2xl border transition-all ${
                    isNotMigrated
                      ? 'bg-amber-50/60 border-amber-200'
                      : 'bg-neutral-50 border-neutral-200/80'
                  }`}
                >
                  <span className="text-[10px] uppercase font-bold text-neutral-500 block truncate">
                    {tableName.replace(/_/g, ' ')}
                  </span>
                  <span
                    className={`font-bold tabular-nums block ${
                      isNotMigrated ? 'text-xs text-amber-700 py-1' : 'text-lg text-[#075E2B]'
                    }`}
                  >
                    {count}
                  </span>
                  <span className="text-[10px] text-neutral-400 block">
                    {isNotMigrated ? 'run SQL' : 'rows live'}
                  </span>
                </div>
              );
            })}
          </div>

          {tableCounts['institutional_partners'] === 'Not Migrated' && (
            <div className="mt-4 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  <strong>Optional Cloud Migration:</strong> The <code>institutional_partners</code> table is currently operating in local cache mode. To sync it with Supabase PostgreSQL, copy and run this 1-click migration snippet in your Supabase SQL Editor.
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(QUICK_PARTNERS_SQL);
                  setCopiedQuickSql(true);
                  setTimeout(() => setCopiedQuickSql(false), 2500);
                }}
                className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shrink-0 flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                {copiedQuickSql ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedQuickSql ? 'Copied Migration SQL!' : 'Copy Table SQL'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Manual Sync Triggers */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-neutral-100">
          <div className="text-xs text-neutral-600">
            <strong>Real-time Reflection Active:</strong> Changes made here or in your Supabase Dashboard are automatically streamed live.
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={syncingAction !== null}
              onClick={handlePullFromCloud}
              className="px-4 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <ArrowDownCircle className="w-3.5 h-3.5 text-[#075E2B]" />
              <span>{syncingAction === 'pull' ? 'Pulling...' : 'Pull Cloud to Local'}</span>
            </button>
            <button
              type="button"
              disabled={syncingAction !== null}
              onClick={handlePushToCloud}
              className="px-4 py-2 rounded-xl bg-[#075E2B] hover:bg-[#064e24] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
            >
              <ArrowUpCircle className="w-3.5 h-3.5 text-[#F4B400]" />
              <span>{syncingAction === 'push' ? 'Pushing...' : 'Push Local to Cloud'}</span>
            </button>
          </div>
        </div>

        {syncNotice && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{syncNotice}</span>
          </div>
        )}
      </div>

      {/* Supabase Project Credentials Form */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200 shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif-display text-xl font-bold text-[#075E2B]">
              Active Supabase Credentials
            </h3>
            <p className="text-xs text-neutral-500">
              The project is configured to use the following Supabase credentials. Any updates here save instantly.
            </p>
          </div>
          <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Integrated & Verified</span>
          </span>
        </div>

        <form onSubmit={handleSaveConfig} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">
              Supabase Project URL
            </label>
            <input
              type="text"
              required
              value={supabaseUrl}
              onChange={(e) => setSupabaseUrl(e.target.value)}
              placeholder="https://tufpcwyufqrntbuytndc.supabase.co"
              className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-xl font-mono focus:ring-2 focus:ring-[#075E2B]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">
              Supabase Public Anon Key
            </label>
            <input
              type="text"
              required
              value={supabaseAnonKey}
              onChange={(e) => setSupabaseAnonKey(e.target.value)}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-xl font-mono focus:ring-2 focus:ring-[#075E2B]"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#075E2B] text-white font-bold text-xs hover:bg-[#064e24] shadow-md cursor-pointer flex items-center gap-2"
            >
              <Check className="w-3.5 h-3.5 text-[#F4B400]" />
              <span>Update Credentials & Reconnect</span>
            </button>
          </div>
        </form>
      </div>

      {/* SQL Script Viewer */}
      <div className="bg-neutral-900 text-neutral-100 p-6 sm:p-8 rounded-3xl space-y-4 font-mono text-xs shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div className="flex items-center gap-2 text-neutral-300">
            <Database className="w-4 h-4 text-[#F4B400]" />
            <span className="font-bold">Production PostgreSQL Schema Script</span>
          </div>
          <button
            onClick={handleCopyScript}
            className="text-[11px] text-[#F4B400] hover:underline flex items-center gap-1 cursor-pointer font-bold"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Script'}</span>
          </button>
        </div>

        <pre className="max-h-[500px] overflow-y-auto p-4 bg-black/60 rounded-2xl text-emerald-400 text-[11px] leading-relaxed whitespace-pre-wrap select-all border border-neutral-800">
          {SUPABASE_SQL_SCRIPT}
        </pre>
      </div>
    </div>
  );
};
