import React, { useState } from 'react';
import { SiteVisit } from '../types/index.ts';
import { BarChart2, Globe, Laptop, Smartphone, Search, RefreshCw, Compass } from 'lucide-react';

interface AdminAnalyticsViewProps {
  visits: SiteVisit[];
}

export const AdminAnalyticsView: React.FC<AdminAnalyticsViewProps> = ({ visits }) => {
  const [searchPath, setSearchPath] = useState('');

  // Path frequencies
  const pathMap: { [p: string]: number } = {};
  const referrerMap: { [r: string]: number } = {};

  visits.forEach((v) => {
    pathMap[v.path] = (pathMap[v.path] || 0) + 1;
    referrerMap[v.referrer] = (referrerMap[v.referrer] || 0) + 1;
  });

  const sortedPaths = Object.entries(pathMap).sort((a, b) => b[1] - a[1]);
  const sortedReferrers = Object.entries(referrerMap).sort((a, b) => b[1] - a[1]);

  const filteredVisits = visits.filter(
    (v) =>
      v.path.toLowerCase().includes(searchPath.toLowerCase()) ||
      v.referrer.toLowerCase().includes(searchPath.toLowerCase()) ||
      v.sessionId.toLowerCase().includes(searchPath.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#075E2B]">
            Traffic Intelligence
          </span>
          <h2 className="font-serif-display text-3xl font-bold text-[#263238]">
            Website Analytics & Telemetry Log
          </h2>
          <p className="text-xs text-neutral-500">
            Real visitor interactions, landing paths, referrers, and user agents logged in Supabase site_visits table.
          </p>
        </div>

        <span className="text-xs font-semibold text-neutral-500 tabular-nums">
          {visits.length} Recorded Sessions
        </span>
      </div>

      {/* Top Routes & Referrers Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif-display text-lg font-bold text-[#263238]">
              Top Page Routes
            </h3>
            <Compass className="w-4 h-4 text-[#075E2B]" />
          </div>
          <div className="space-y-2">
            {sortedPaths.slice(0, 6).map(([path, count], idx) => (
              <div key={idx} className="flex items-center justify-between text-xs p-2 rounded-lg bg-neutral-50">
                <span className="font-mono text-neutral-700 truncate max-w-xs">{path}</span>
                <span className="font-bold text-[#075E2B] tabular-nums">{count} hits</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif-display text-lg font-bold text-[#263238]">
              Inbound Traffic Referrers
            </h3>
            <Globe className="w-4 h-4 text-[#2E8B57]" />
          </div>
          <div className="space-y-2">
            {sortedReferrers.slice(0, 6).map(([ref, count], idx) => (
              <div key={idx} className="flex items-center justify-between text-xs p-2 rounded-lg bg-neutral-50">
                <span className="text-neutral-700 truncate max-w-xs">{ref || 'Direct Visit'}</span>
                <span className="font-bold text-[#2E8B57] tabular-nums">{count} sessions</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Live Visits Log Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="relative max-w-sm w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search route or session..."
              value={searchPath}
              onChange={(e) => setSearchPath(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#075E2B]"
            />
          </div>
          <span className="text-xs text-neutral-400">Showing last 200 visits</span>
        </div>

        <div className="bg-white rounded-3xl border border-neutral-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F7F3E8] border-b border-neutral-200 text-neutral-600 uppercase font-semibold text-[11px]">
                <tr>
                  <th className="p-4">Session ID</th>
                  <th className="p-4">Route Path</th>
                  <th className="p-4">Referrer</th>
                  <th className="p-4">Timestamp</th>
                  <th className="p-4">Device / User Agent</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredVisits.slice(0, 50).map((v) => (
                  <tr key={v.id} className="hover:bg-neutral-50 font-mono text-[11px]">
                    <td className="p-4 font-semibold text-neutral-800">{v.sessionId}</td>
                    <td className="p-4 text-[#075E2B] font-bold">{v.path}</td>
                    <td className="p-4 text-neutral-500">{v.referrer || 'Direct'}</td>
                    <td className="p-4 text-neutral-500 font-sans text-xs">
                      {new Date(v.timestamp).toLocaleString()}
                    </td>
                    <td className="p-4 text-neutral-400 font-sans text-xs truncate max-w-xs" title={v.userAgent}>
                      {v.userAgent}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
