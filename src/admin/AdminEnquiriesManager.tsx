import React, { useState } from 'react';
import { ContactEnquiry } from '../types/index.ts';
import { GreenvestDB } from '../lib/supabaseClient.ts';
import { Mail, CheckCircle, MessageSquare, Trash2, Search, X, MessageCircle } from 'lucide-react';

interface AdminEnquiriesManagerProps {
  enquiries: ContactEnquiry[];
  onEnquiriesUpdated: (enquiries: ContactEnquiry[]) => void;
}

export const AdminEnquiriesManager: React.FC<AdminEnquiriesManagerProps> = ({
  enquiries,
  onEnquiriesUpdated,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEnquiry, setSelectedEnquiry] = useState<ContactEnquiry | null>(null);

  const handleUpdateStatus = (id: string, status: ContactEnquiry['status']) => {
    GreenvestDB.updateEnquiryStatus(id, status);
    const updated = GreenvestDB.getEnquiries();
    onEnquiriesUpdated(updated);
    if (selectedEnquiry && selectedEnquiry.id === id) {
      setSelectedEnquiry({ ...selectedEnquiry, status });
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this contact enquiry permanently?')) {
      GreenvestDB.deleteEnquiry(id);
      const updated = GreenvestDB.getEnquiries();
      onEnquiriesUpdated(updated);
      setSelectedEnquiry(null);
    }
  };

  const filtered = enquiries.filter(
    (e) =>
      e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#075E2B]">
            Commercial Inbound
          </span>
          <h2 className="font-serif-display text-3xl font-bold text-[#263238]">
            Contact Enquiries & Communications
          </h2>
          <p className="text-xs text-neutral-500">
            Messages, partnership submissions, and offtake requests stored in the Supabase contact_messages table.
          </p>
        </div>

        <span className="text-xs font-semibold text-neutral-500">
          {enquiries.length} Total Messages Logged
        </span>
      </div>

      {/* Filter */}
      <div className="relative max-w-sm">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
        <input
          type="text"
          placeholder="Search by sender, email, or subject..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-3 py-2 text-xs border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#075E2B]"
        />
      </div>

      {/* List */}
      <div className="bg-white rounded-3xl border border-neutral-200 overflow-hidden shadow-sm">
        {filtered.length === 0 ? (
          <div className="text-center py-16 space-y-2">
            <Mail className="w-8 h-8 text-neutral-300 mx-auto" />
            <p className="text-sm font-semibold text-neutral-700">No enquiries found.</p>
            <p className="text-xs text-neutral-400">Incoming inquiries from the public contact page will show here.</p>
          </div>
        ) : (
          <div className="divide-y divide-neutral-100">
            {filtered.map((enq) => (
              <div
                key={enq.id}
                onClick={() => setSelectedEnquiry(enq)}
                className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-neutral-50 transition-colors cursor-pointer ${
                  enq.status === 'new' ? 'bg-amber-50/40' : ''
                }`}
              >
                <div className="space-y-1 min-w-0 max-w-lg">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                        enq.status === 'new'
                          ? 'bg-amber-500 text-white'
                          : enq.status === 'replied'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-neutral-100 text-neutral-600'
                      }`}
                    >
                      {enq.status}
                    </span>
                    <span className="font-bold text-[#263238] text-sm truncate">{enq.name}</span>
                    {enq.company && (
                      <span className="text-xs text-neutral-400 truncate">({enq.company})</span>
                    )}
                  </div>

                  <h4 className="text-xs font-semibold text-[#075E2B] truncate">{enq.subject}</h4>
                  <p className="text-xs text-neutral-500 line-clamp-1">{enq.message}</p>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
                  <span className="text-[11px] text-neutral-400">
                    {new Date(enq.createdAt).toLocaleDateString()}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(enq.id);
                    }}
                    className="p-1.5 text-neutral-400 hover:text-red-600 rounded-lg"
                    title="Delete message"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Enquiry Detail Modal */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-bold">
                  Enquiry Reference
                </span>
                <h3 className="font-serif-display text-2xl font-bold text-[#075E2B]">
                  {selectedEnquiry.subject}
                </h3>
              </div>
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="text-neutral-400 hover:text-neutral-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3.5 rounded-xl bg-[#F7F3E8] border border-[#2E8B57]/20 space-y-1">
                <p>
                  <strong>Sender:</strong> {selectedEnquiry.name} {selectedEnquiry.company ? `(${selectedEnquiry.company})` : ''}
                </p>
                <p>
                  <strong>Email:</strong> {selectedEnquiry.email}
                </p>
                <p>
                  <strong>Phone:</strong> {selectedEnquiry.phone}
                </p>
                <p>
                  <strong>Date:</strong> {new Date(selectedEnquiry.createdAt).toLocaleString()}
                </p>
              </div>

              <div>
                <span className="text-neutral-500 uppercase tracking-wider text-[10px] font-bold block mb-1">
                  Message Content:
                </span>
                <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 text-neutral-800 leading-relaxed whitespace-pre-wrap">
                  {selectedEnquiry.message}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="font-bold text-neutral-700">Update Status:</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleUpdateStatus(selectedEnquiry.id, 'read')}
                    className="px-3 py-1.5 rounded-lg border border-neutral-300 text-xs hover:bg-neutral-100"
                  >
                    Mark Read
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedEnquiry.id, 'replied')}
                    className="px-3 py-1.5 rounded-lg bg-[#075E2B] text-white text-xs font-bold hover:bg-[#064e24]"
                  >
                    Mark Replied
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedEnquiry.id, 'archived')}
                    className="px-3 py-1.5 rounded-lg border border-neutral-300 text-xs hover:bg-neutral-100"
                  >
                    Archive
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
              <a
                href={`https://wa.me/${selectedEnquiry.phone.replace(/[^\d+]/g, '')}?text=Hello%20${encodeURIComponent(
                  selectedEnquiry.name
                )},%20this%20is%20Greenvest%20Farms%20following%20up%20on%20your%20enquiry.`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-[#25D366] text-white font-bold text-xs flex items-center gap-1.5"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Contact via WhatsApp</span>
              </a>

              <button
                onClick={() => handleDelete(selectedEnquiry.id)}
                className="text-xs text-red-600 hover:underline"
              >
                Delete Enquiry
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
