import React, { useState } from 'react';
import { MediaAsset } from '../types/index.ts';
import { GreenvestDB } from '../lib/supabaseClient.ts';
import { HERO_IMAGE } from '../data/initialData.ts';
import { safeImageSrc } from '../utils/safeImage.ts';
import { optimizeImageFile } from '../utils/imageOptimizer.ts';
import {
  UploadCloud,
  Search,
  Trash2,
  Edit2,
  Copy,
  Check,
  Image as ImageIcon,
  FolderOpen,
  X,
} from 'lucide-react';
import { GoogleDrivePicker } from '../components/GoogleDrivePicker.tsx';

export const AdminMediaLibrary: React.FC = () => {
  const [mediaList, setMediaList] = useState<MediaAsset[]>(GreenvestDB.getMediaAssets());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // New Image Upload Dialog State
  const [uploadOpen, setUploadOpen] = useState(false);
  const [driveModalOpen, setDriveModalOpen] = useState(false);
  const [uploadName, setUploadName] = useState('');
  const [uploadCategory, setUploadCategory] = useState('Field Operations');
  const [uploadAlt, setUploadAlt] = useState('');
  const [uploadCaption, setUploadCaption] = useState('');
  const [uploadUrl, setUploadUrl] = useState('');

  const categories = ['All', 'Estate Banners', 'Field Operations', 'Harvest & Machinery', 'Processing & Facilities', 'Products'];

  const filteredMedia = mediaList.filter((m) => {
    const matchesCat = selectedCategory === 'All' || m.category === selectedCategory;
    const matchesSearch =
      m.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.altText.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this image asset from Supabase site-media storage?')) {
      GreenvestDB.deleteMedia(id);
      setMediaList(GreenvestDB.getMediaAssets());
    }
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadUrl || !uploadName) return;

    GreenvestDB.uploadMedia({
      fileName: uploadName.endsWith('.jpg') || uploadName.endsWith('.png') ? uploadName : `${uploadName}.jpg`,
      fileUrl: uploadUrl,
      category: uploadCategory,
      altText: uploadAlt || uploadName,
      caption: uploadCaption,
      sizeBytes: 1540000,
    });

    setMediaList(GreenvestDB.getMediaAssets());
    setUploadOpen(false);
    setUploadName('');
    setUploadUrl('');
    setUploadAlt('');
    setUploadCaption('');
  };

  // Handle direct file input conversion to optimized DataURL
  const handleLocalFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadName(file.name);
      try {
        const optimized = await optimizeImageFile(file, { maxWidth: 1280, maxHeight: 1280, quality: 0.82 });
        setUploadUrl(optimized || '');
      } catch {
        const reader = new FileReader();
        reader.onload = (loadEvt) => {
          if (loadEvt.target?.result) {
            setUploadUrl(loadEvt.target.result as string);
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#075E2B]">
            Supabase Storage Manager
          </span>
          <h2 className="font-serif-display text-3xl font-bold text-[#263238]">
            Media Assets Library (site-media)
          </h2>
          <p className="text-xs text-neutral-500">
            Store, categorize, and reuse high-resolution agricultural photographs across all corporate pages.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setDriveModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-neutral-50 text-neutral-700 font-bold text-xs flex items-center gap-2 border border-neutral-300 shadow-xs cursor-pointer"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 87.3 78" xmlns="http://www.w3.org/2000/svg">
              <path d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z" fill="#0066da"/>
              <path d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44c-.8 1.4-1.2 2.95-1.2 4.5h27.5z" fill="#00ac47"/>
              <path d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.502l5.852 11.5z" fill="#ea4335"/>
              <path d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.25z" fill="#00832d"/>
              <path d="m59.8 53h-32.3l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z" fill="#2684fc"/>
              <path d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.15 28h27.45c0-1.55-.4-3.1-1.2-4.5z" fill="#ffba00"/>
            </svg>
            <span>Import from Google Drive</span>
          </button>

          <button
            type="button"
            onClick={() => setUploadOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-[#075E2B] hover:bg-[#064e24] text-white font-bold text-xs flex items-center gap-2 shadow-md cursor-pointer"
          >
            <UploadCloud className="w-4 h-4 text-[#F4B400]" />
            <span>Upload Image Asset</span>
          </button>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative max-w-md w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search media by filename, alt text..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-[#075E2B]"
          />
        </div>

        <div className="flex flex-wrap gap-1.5 p-1 bg-neutral-100 rounded-xl">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                selectedCategory === cat ? 'bg-white text-[#075E2B] shadow-sm' : 'text-neutral-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Assets Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredMedia.map((asset) => (
          <div
            key={asset.id}
            className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            <div className="h-44 overflow-hidden bg-neutral-100 relative group">
              <img
                src={safeImageSrc(asset.fileUrl, HERO_IMAGE)!}
                alt={asset.altText}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <span className="absolute top-2 left-2 bg-[#075E2B]/90 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                {asset.category}
              </span>
            </div>

            <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-bold text-neutral-800 truncate" title={asset.fileName}>
                  {asset.fileName}
                </h4>
                <p className="text-[11px] text-neutral-500 line-clamp-2 mt-0.5">
                  {asset.altText}
                </p>
                {asset.caption && (
                  <p className="text-[10px] text-[#075E2B] italic mt-1">{asset.caption}</p>
                )}
              </div>

              <div className="pt-2 border-t border-neutral-100 flex items-center justify-between">
                <button
                  onClick={() => handleCopyUrl(asset.fileUrl, asset.id)}
                  className="text-xs text-neutral-600 hover:text-[#075E2B] flex items-center gap-1 cursor-pointer"
                >
                  {copiedId === asset.id ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>{copiedId === asset.id ? 'Copied' : 'Copy URL'}</span>
                </button>

                <button
                  onClick={() => handleDelete(asset.id)}
                  className="p-1.5 text-neutral-400 hover:text-red-600 transition-colors cursor-pointer"
                  title="Delete image"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Modal */}
      {uploadOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-[#075E2B]" />
                <h3 className="font-serif-display text-xl font-bold text-[#075E2B]">
                  Upload Asset to site-media Bucket
                </h3>
              </div>
              <button
                onClick={() => setUploadOpen(false)}
                className="text-neutral-400 hover:text-neutral-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Local Image File (Instant Upload)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLocalFileSelect}
                  className="w-full text-xs text-neutral-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#075E2B] file:text-white hover:file:bg-[#064e24] cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Or Direct Image URL
                </label>
                <input
                  type="text"
                  required
                  placeholder="https://... or data:image/..."
                  value={uploadUrl}
                  onChange={(e) => setUploadUrl(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-xl focus:ring-2 focus:ring-[#075E2B]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  File Asset Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. kaduna_sorghum_harvest.jpg"
                  value={uploadName}
                  onChange={(e) => setUploadName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-xl focus:ring-2 focus:ring-[#075E2B]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={uploadCategory}
                    onChange={(e) => setUploadCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-xl bg-white focus:ring-2 focus:ring-[#075E2B]"
                  >
                    <option>Estate Banners</option>
                    <option>Field Operations</option>
                    <option>Harvest & Machinery</option>
                    <option>Processing & Facilities</option>
                    <option>Products</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Alt Text (Accessibility) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aerial crop irrigation"
                    value={uploadAlt}
                    onChange={(e) => setUploadAlt(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-xl focus:ring-2 focus:ring-[#075E2B]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Optional Caption / Dossier Tag
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ogun Horticultural Complex - March 2026"
                  value={uploadCaption}
                  onChange={(e) => setUploadCaption(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-xl focus:ring-2 focus:ring-[#075E2B]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setUploadOpen(false)}
                  className="px-4 py-2 rounded-xl border border-neutral-300 text-neutral-700 text-xs font-semibold hover:bg-neutral-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#075E2B] text-white font-bold text-xs hover:bg-[#064e24]"
                >
                  Save Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Google Drive Import Modal */}
      {driveModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-4 shadow-2xl border border-neutral-100 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div className="flex items-center gap-2.5">
                <svg className="w-6 h-6 shrink-0" viewBox="0 0 87.3 78" xmlns="http://www.w3.org/2000/svg">
                  <path d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z" fill="#0066da"/>
                  <path d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44c-.8 1.4-1.2 2.95-1.2 4.5h27.5z" fill="#00ac47"/>
                  <path d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.502l5.852 11.5z" fill="#ea4335"/>
                  <path d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.25z" fill="#00832d"/>
                  <path d="m59.8 53h-32.3l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z" fill="#2684fc"/>
                  <path d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.15 28h27.45c0-1.55-.4-3.1-1.2-4.5z" fill="#ffba00"/>
                </svg>
                <div>
                  <h3 className="font-serif-display text-xl font-bold text-[#263238]">
                    Import from Google Drive
                  </h3>
                  <p className="text-xs text-neutral-500">
                    Select photos from your connected Google Drive to import directly into the Media Library.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDriveModalOpen(false)}
                className="p-2 text-neutral-400 hover:text-neutral-700 rounded-full hover:bg-neutral-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-2">
              <GoogleDrivePicker
                category={selectedCategory === 'All' ? 'Field Operations' : selectedCategory}
                onSelectImage={() => {
                  setMediaList(GreenvestDB.getMediaAssets());
                  setDriveModalOpen(false);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
