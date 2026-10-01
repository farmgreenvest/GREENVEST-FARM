import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  Image as ImageIcon,
  FolderOpen,
  Link2,
  X,
  Check,
  Sparkles,
} from 'lucide-react';
import { GreenvestDB } from '../lib/supabaseClient.ts';
import {
  HERO_IMAGE,
  AGRONOMISTS_IMAGE,
  CROP_HARVEST_IMAGE,
  AGRO_PROCESSING_IMAGE,
} from '../data/initialData.ts';
import { optimizeImageFile } from '../utils/imageOptimizer.ts';
import { safeImageSrc } from '../utils/safeImage.ts';
import { GoogleDrivePicker } from './GoogleDrivePicker.tsx';

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  helperText?: string;
  category?: string;
  recommendedAspect?: string;
  className?: string;
}

export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  label,
  value,
  onChange,
  helperText,
  category = 'General',
  recommendedAspect = '16:9 or 4:3',
  className = '',
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'drive' | 'library' | 'presets' | 'url'>('upload');
  const [urlInput, setUrlInput] = useState(value);
  const [dragOver, setDragOver] = useState(false);
  const [uploadNotice, setUploadNotice] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const mediaList = GreenvestDB.getMediaAssets();

  const curatedPresets = [
    { label: 'Kaduna Grain Hub Sunrise', url: HERO_IMAGE },
    { label: 'Ogun Agronomists Field', url: AGRONOMISTS_IMAGE },
    { label: 'Commercial Crop Harvest', url: CROP_HARVEST_IMAGE },
    { label: 'Benue Agro-Processing Mill', url: AGRO_PROCESSING_IMAGE },
    { label: 'Greenvest Official Emblem', url: '/greenvest_emblem.png' },
    { label: 'Greenvest Primary Crest Logo', url: '/greenvest_logo.png' },
  ];

  const handleFile = async (file: File) => {
    if (!file || !file.type.startsWith('image/')) {
      setUploadNotice('Please select an image file (PNG, JPG, WEBP, GIF, SVG).');
      setTimeout(() => setUploadNotice(null), 3500);
      return;
    }

    setUploadNotice('Optimizing & compressing image for fast web performance...');
    try {
      const optimizedUrl = await optimizeImageFile(file, { maxWidth: 1280, maxHeight: 1280, quality: 0.82 });
      if (optimizedUrl) {
        // Save to Media Assets persistent library
        GreenvestDB.uploadMedia({
          fileName: file.name,
          fileUrl: optimizedUrl,
          category: category,
          altText: `Uploaded ${file.name}`,
          caption: `${category} Asset - Uploaded from device`,
          sizeBytes: Math.round(optimizedUrl.length * 0.75),
        });

        onChange(optimizedUrl);
        setUrlInput(optimizedUrl);
        setUploadNotice(`Optimized & uploaded "${file.name}"!`);
        setTimeout(() => setUploadNotice(null), 3500);
      }
    } catch (err) {
      console.warn('Image optimization notice:', err);
      // Fallback to FileReader
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (result) {
          onChange(result);
          setUrlInput(result);
          setUploadNotice(`Uploaded "${file.name}"!`);
          setTimeout(() => setUploadNotice(null), 3500);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (urlInput.trim()) {
      onChange(urlInput.trim());
      setUploadNotice('Image URL updated successfully.');
      setTimeout(() => setUploadNotice(null), 2500);
    }
  };

  return (
    <div className={`space-y-2.5 ${className}`}>
      {/* Label & Aspect info */}
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-neutral-800">
          {label}
        </label>
        {recommendedAspect && (
          <span className="text-[10px] text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-full font-mono">
            {recommendedAspect}
          </span>
        )}
      </div>

      {helperText && (
        <p className="text-[11px] text-neutral-500 leading-snug">{helperText}</p>
      )}

      {/* Preview Card */}
      <div className="flex items-start gap-4 p-3 bg-neutral-50 border border-neutral-200 rounded-2xl">
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-neutral-200 shrink-0 border border-neutral-300 shadow-inner flex items-center justify-center group">
          {safeImageSrc(value) ? (
            <>
              <img
                src={safeImageSrc(value)!}
                alt="Selected preview"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => {
                  onChange('');
                  setUrlInput('');
                }}
                title="Remove image"
                className="absolute top-1 right-1 p-1 bg-black/70 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </>
          ) : (
            <div className="text-center p-2 text-neutral-400 space-y-1">
              <ImageIcon className="w-6 h-6 mx-auto opacity-50" />
              <span className="text-[9px] block uppercase font-bold">No Image</span>
            </div>
          )}
        </div>

        {/* Action Tabs & Controls */}
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex flex-wrap gap-1 p-1 bg-white rounded-xl border border-neutral-200 w-fit">
            <button
              type="button"
              onClick={() => setActiveTab('upload')}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'upload'
                  ? 'bg-[#075E2B] text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>Upload File</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('drive')}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'drive'
                  ? 'bg-[#075E2B] text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 87.3 78" xmlns="http://www.w3.org/2000/svg">
                <path d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z" fill="#0066da"/>
                <path d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44c-.8 1.4-1.2 2.95-1.2 4.5h27.5z" fill="#00ac47"/>
                <path d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.502l5.852 11.5z" fill="#ea4335"/>
                <path d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.25z" fill="#00832d"/>
                <path d="m59.8 53h-32.3l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z" fill="#2684fc"/>
                <path d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.15 28h27.45c0-1.55-.4-3.1-1.2-4.5z" fill="#ffba00"/>
              </svg>
              <span>Google Drive</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('library')}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'library'
                  ? 'bg-[#075E2B] text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <FolderOpen className="w-3.5 h-3.5" />
              <span>Media Library ({mediaList.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('presets')}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'presets'
                  ? 'bg-[#075E2B] text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#F4B400]" />
              <span>Presets</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('url')}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'url'
                  ? 'bg-[#075E2B] text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <Link2 className="w-3.5 h-3.5" />
              <span>Web URL</span>
            </button>
          </div>

          {/* TAB 1: Upload from Computer */}
          {activeTab === 'upload' && (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-3 sm:p-4 text-center cursor-pointer transition-all ${
                dragOver
                  ? 'border-[#075E2B] bg-[#075E2B]/5'
                  : 'border-neutral-300 hover:border-[#075E2B] bg-white'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    handleFile(e.target.files[0]);
                  }
                }}
              />
              <div className="flex flex-col items-center justify-center gap-1">
                <UploadCloud className="w-5 h-5 text-[#075E2B]" />
                <span className="text-xs font-bold text-neutral-800">
                  Click to Browse or Drag & Drop Image Here
                </span>
                <span className="text-[10px] text-neutral-500">
                  Upload directly from your device (PNG, JPG, WEBP, SVG)
                </span>
              </div>
            </div>
          )}

          {/* TAB 2: Google Drive Picker */}
          {activeTab === 'drive' && (
            <div className="bg-white p-3 rounded-xl border border-neutral-200">
              <GoogleDrivePicker
                category={category}
                isCompact={true}
                onSelectImage={(url, fileName) => {
                  onChange(url);
                  setUrlInput(url);
                  setUploadNotice(`Imported "${fileName}" from Google Drive!`);
                  setTimeout(() => setUploadNotice(null), 3500);
                }}
              />
            </div>
          )}

          {/* TAB 3: Media Library Picker */}
          {activeTab === 'library' && (
            <div className="bg-white p-2.5 rounded-xl border border-neutral-200 space-y-2">
              <span className="text-[10px] font-bold text-neutral-500 uppercase block">
                Click any asset to select
              </span>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-36 overflow-y-auto p-1">
                {mediaList.map((asset) => (
                  <button
                    key={asset.id}
                    type="button"
                    onClick={() => {
                      onChange(asset.fileUrl);
                      setUrlInput(asset.fileUrl);
                    }}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-transform active:scale-95 cursor-pointer bg-neutral-100 group ${
                      value === asset.fileUrl
                        ? 'border-[#075E2B] ring-2 ring-[#075E2B]/30'
                        : 'border-transparent hover:border-neutral-300'
                    }`}
                    title={asset.fileName}
                  >
                    <img
                      src={safeImageSrc(asset.fileUrl, HERO_IMAGE)!}
                      alt={asset.altText}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    {value === asset.fileUrl && (
                      <div className="absolute inset-0 bg-[#075E2B]/40 flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: Curated Presets */}
          {activeTab === 'presets' && (
            <div className="bg-white p-2.5 rounded-xl border border-neutral-200 space-y-1.5">
              <span className="text-[10px] font-bold text-neutral-500 uppercase block">
                Official Greenvest Agribusiness Photography
              </span>
              <div className="flex flex-wrap gap-1.5">
                {curatedPresets.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      onChange(preset.url);
                      setUrlInput(preset.url);
                    }}
                    className={`px-2.5 py-1 text-[11px] rounded-lg border font-medium transition-colors cursor-pointer ${
                      value === preset.url
                        ? 'bg-[#075E2B] text-white border-[#075E2B]'
                        : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: Direct URL */}
          {activeTab === 'url' && (
            <div className="flex gap-2">
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleUrlSubmit(e);
                  }
                }}
                placeholder="https://example.com/image.jpg"
                className="flex-1 px-3 py-1.5 text-xs border border-neutral-300 rounded-xl focus:ring-2 focus:ring-[#075E2B] bg-white"
              />
              <button
                type="button"
                onClick={handleUrlSubmit}
                className="px-3 py-1.5 bg-[#075E2B] hover:bg-[#064e24] text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Apply
              </button>
            </div>
          )}

          {/* Upload notice message */}
          {uploadNotice && (
            <div className="flex items-center gap-1.5 text-emerald-700 text-[11px] font-semibold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 animate-in fade-in">
              <Check className="w-3.5 h-3.5" />
              <span>{uploadNotice}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
