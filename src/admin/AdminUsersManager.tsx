import React, { useState, useEffect } from 'react';
import { AdminProfile, AdminRequest, AdminRole } from '../types/index.ts';
import { GreenvestDB } from '../lib/supabaseClient.ts';
import {
  UserCheck,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Trash2,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Mail,
  Lock,
  RefreshCw,
} from 'lucide-react';

interface AdminUsersManagerProps {
  currentAdmin: AdminProfile;
  adminProfiles: AdminProfile[];
  adminRequests: AdminRequest[];
  onAdminsUpdated: () => void;
}

export const AdminUsersManager: React.FC<AdminUsersManagerProps> = ({
  currentAdmin,
  adminProfiles,
  adminRequests,
  onAdminsUpdated,
}) => {
  const isSuperAdmin = currentAdmin.role === 'super_admin';
  const [successNotice, setSuccessNotice] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const handleSyncRequests = async () => {
    setRefreshing(true);
    await Promise.all([
      GreenvestDB.pullAdminRequestsFromSupabase(),
      GreenvestDB.pullAdminProfilesFromSupabase(),
    ]);
    onAdminsUpdated();
    setRefreshing(false);
  };

  useEffect(() => {
    handleSyncRequests();
  }, []);

  const handleApproveRequest = (
    requestId: string,
    role: AdminRole = 'admin'
  ) => {
    GreenvestDB.updateAdminRequestStatus(requestId, 'approved', role, currentAdmin.email);
    onAdminsUpdated();
    setSuccessNotice(`Admin confirmed and assigned role "${role.toUpperCase()}". Confirmation notification recorded for farmgreenvest@gmail.com.`);
    setTimeout(() => setSuccessNotice(null), 4000);
  };

  const handleRejectRequest = (requestId: string) => {
    GreenvestDB.updateAdminRequestStatus(requestId, 'rejected', 'editor', currentAdmin.email);
    onAdminsUpdated();
    setSuccessNotice(`Admin request rejected.`);
    setTimeout(() => setSuccessNotice(null), 3000);
  };

  const handleRoleChange = (adminId: string, role: AdminRole) => {
    GreenvestDB.updateAdminRole(adminId, role);
    onAdminsUpdated();
  };

  const handleToggleStatus = (adminId: string) => {
    GreenvestDB.toggleAdminStatus(adminId);
    onAdminsUpdated();
  };

  const handleDeleteAdmin = (adminId: string) => {
    if (confirm('Delete this administrator profile permanently?')) {
      GreenvestDB.deleteAdmin(adminId);
      onAdminsUpdated();
    }
  };

  const pendingRequests = adminRequests.filter((r) => r.status === 'pending');

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#075E2B]">
            Governance & IAM Security
          </span>
          <h2 className="font-serif-display text-3xl font-bold text-[#263238]">
            Admin Signups & Role Approvals
          </h2>
          <p className="text-xs text-neutral-500">
            Confirm new administrator signups and assign administrative privileges via farmgreenvest@gmail.com.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold">
          <ShieldAlert className="w-4 h-4 text-amber-600" />
          <span>Logged in as: {currentAdmin.fullName} ({currentAdmin.role.toUpperCase()})</span>
        </div>
      </div>

      {successNotice && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successNotice}</span>
        </div>
      )}

      {/* Pending Access Requests Queue */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-[#075E2B]" />
            <div>
              <h3 className="font-serif-display text-xl font-bold text-[#075E2B]">
                New Admin Signups Awaiting Confirmation
              </h3>
              <p className="text-xs text-neutral-500">
                People who signed up with their email and password requesting administrator assignment.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleSyncRequests}
              disabled={refreshing}
              className="px-3 py-1.5 rounded-xl border border-neutral-300 hover:bg-neutral-100 text-neutral-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-60"
              title="Refresh and sync signups from live Supabase database"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#075E2B] ${refreshing ? 'animate-spin' : ''}`} />
              <span>{refreshing ? 'Syncing...' : 'Sync Live Requests'}</span>
            </button>
            <span className="text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full">
              {pendingRequests.length} Pending Confirmation
            </span>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-neutral-200 overflow-hidden shadow-sm">
          {pendingRequests.length === 0 ? (
            <div className="text-center py-12 space-y-2 text-xs text-neutral-500">
              <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto" />
              <p className="font-semibold text-neutral-700">All admin signup requests have been reviewed.</p>
              <p>When new people sign up via the console, their application will appear here for confirmation.</p>
            </div>
          ) : (
            <div className="divide-y divide-neutral-100">
              {pendingRequests.map((req) => (
                <div
                  key={req.id}
                  className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-amber-50/20"
                >
                  <div className="space-y-1.5 max-w-xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-neutral-900 text-sm">{req.fullName}</span>
                      <span className="text-xs text-neutral-500 font-mono">({req.email})</span>
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-amber-200 text-amber-900">
                        Pending Super Admin Confirmation
                      </span>
                    </div>

                    <p className="text-xs text-neutral-700">
                      <strong>Reason / Department:</strong> {req.reason}
                    </p>

                    <div className="flex items-center gap-3 text-[11px] text-neutral-400">
                      <span>Submitted: {new Date(req.createdAt).toLocaleString()}</span>
                      <span>·</span>
                      <span>Target: farmgreenvest@gmail.com</span>
                    </div>
                  </div>

                  {/* Super Admin Action Controls */}
                  {isSuperAdmin && (
                    <div className="flex flex-wrap items-center gap-2 pt-2 lg:pt-0">
                      <button
                        onClick={() => handleApproveRequest(req.id, 'admin')}
                        className="px-3.5 py-2 bg-[#075E2B] text-white text-xs font-bold rounded-xl hover:bg-[#064e24] transition-colors cursor-pointer shadow-sm"
                      >
                        Confirm as Admin
                      </button>
                      <button
                        onClick={() => handleApproveRequest(req.id, 'editor')}
                        className="px-3.5 py-2 bg-[#2E8B57] text-white text-xs font-bold rounded-xl hover:bg-[#257348] transition-colors cursor-pointer shadow-sm"
                      >
                        Confirm as Editor
                      </button>
                      <button
                        onClick={() => handleRejectRequest(req.id)}
                        className="px-3.5 py-2 border border-neutral-300 text-neutral-700 text-xs font-semibold rounded-xl hover:bg-neutral-100 transition-colors cursor-pointer"
                      >
                        Reject
                      </button>
                    </div>
                  )}

                  {!isSuperAdmin && (
                    <span className="text-xs text-neutral-500 italic">
                      Confirmation must be performed by Super Admin (farmgreenvest@gmail.com).
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Active Administrators Table */}
      <div className="space-y-4">
        <div>
          <h3 className="font-serif-display text-xl font-bold text-[#075E2B]">
            Confirmed & Active Administrators
          </h3>
          <p className="text-xs text-neutral-500">
            Profiles with active credentials and assigned permissions.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-neutral-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F7F3E8] border-b border-neutral-200 text-neutral-600 uppercase font-semibold text-[11px]">
                <tr>
                  <th className="p-4">Administrator</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Assigned Role</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Last Login</th>
                  {isSuperAdmin && <th className="p-4 text-right">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {adminProfiles.map((adm) => (
                  <tr key={adm.id} className="hover:bg-neutral-50">
                    <td className="p-4 font-bold text-neutral-800">{adm.fullName}</td>
                    <td className="p-4 text-neutral-600 font-mono text-[11px]">{adm.email}</td>

                    <td className="p-4">
                      {isSuperAdmin && adm.email !== 'farmgreenvest@gmail.com' ? (
                        <select
                          value={adm.role}
                          onChange={(e) => handleRoleChange(adm.id, e.target.value as AdminRole)}
                          className="px-2 py-1 border border-neutral-300 rounded-lg text-xs bg-white cursor-pointer font-semibold text-[#075E2B]"
                        >
                          <option value="super_admin">Super Admin</option>
                          <option value="admin">Admin</option>
                          <option value="editor">Editor</option>
                        </select>
                      ) : (
                        <span className="font-semibold text-[#075E2B] capitalize bg-[#075E2B]/10 px-2 py-0.5 rounded">
                          {adm.role.replace('_', ' ')}
                        </span>
                      )}
                    </td>

                    <td className="p-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          adm.status === 'active'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {adm.status}
                      </span>
                    </td>

                    <td className="p-4 text-neutral-500">
                      {adm.lastLogin ? new Date(adm.lastLogin).toLocaleDateString() : 'Never'}
                    </td>

                    {isSuperAdmin && (
                      <td className="p-4 text-right space-x-2">
                        {adm.email !== 'farmgreenvest@gmail.com' ? (
                          <>
                            <button
                              onClick={() => handleToggleStatus(adm.id)}
                              className="text-xs text-neutral-600 hover:text-neutral-900 underline"
                            >
                              {adm.status === 'active' ? 'Suspend' : 'Activate'}
                            </button>
                            <button
                              onClick={() => handleDeleteAdmin(adm.id)}
                              className="p-1 text-neutral-400 hover:text-red-600 cursor-pointer"
                              title="Delete administrator"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <span className="text-[10px] text-neutral-400 italic">Root Super Admin</span>
                        )}
                      </td>
                    )}
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
