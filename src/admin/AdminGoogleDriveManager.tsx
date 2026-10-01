import React, { useState, useEffect } from 'react';
import {
  initGoogleDriveAuth,
  loginWithGoogleDrive,
  logoutGoogleDrive,
  fetchDriveFiles,
  downloadDriveFile,
  DriveFileItem,
  getDriveAccessToken,
} from '../lib/googleDriveAuth.ts';
import { optimizeImageFile } from '../utils/imageOptimizer.ts';
import { GreenvestDB } from '../lib/supabaseClient.ts';
import {
  Search,
  RefreshCw,
  LogOut,
  FolderOpen,
  Check,
  AlertCircle,
  Loader2,
  FileImage,
  UploadCloud,
  FileText,
  ExternalLink,
  HardDrive,
  Sparkles,
} from 'lucide-react';
import { User } from 'firebase/auth';

interface AdminGoogleDriveManagerProps {
  onNavigateTab?: (tab: string) => void;
}

export const AdminGoogleDriveManager: React.FC<AdminGoogleDriveManagerProps> = ({
  onNavigateTab,
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState<boolean>(true);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);

  const [files, setFiles] = useState<DriveFileItem[]>([]);
  const [isLoadingFiles, setIsLoadingFiles] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [targetCategory, setTargetCategory] = useState<string>('Field Operations');
  const [downloadingFileId, setDownloadingFileId] = useState<string | null>(null);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  const categories = [
    'Field Operations',
    'Estate Banners',
    'Harvest & Machinery',
    'Processing & Facilities',
    'Products',
    'General',
  ];

  // Initialize Auth listener on mount
  useEffect(() => {
    const unsubscribe = initGoogleDriveAuth(
      (user) => {
        setCurrentUser(user);
        setIsAuthenticated(true);
        setIsLoadingAuth(false);
      },
      () => {
        setCurrentUser(null);
        setIsAuthenticated(false);
        setIsLoadingAuth(false);
      }
    );

    getDriveAccessToken().then((tok) => {
      if (tok) {
        setIsAuthenticated(true);
      }
      setIsLoadingAuth(false);
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Fetch files when authenticated
  const loadFiles = async (query = '') => {
    if (!isAuthenticated) return;
    setIsLoadingFiles(true);
    setErrorNotice(null);
    try {
      const result = await fetchDriveFiles(query);
      setFiles(result.files);
    } catch (err: any) {
      console.error('Failed to load drive files:', err);
      setErrorNotice(err.message || 'Failed to retrieve Google Drive files.');
    } finally {
      setIsLoadingFiles(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadFiles(searchQuery);
    }
  }, [isAuthenticated]);

  const handleLogin = async () => {
    setIsLoggingIn(true);
    setErrorNotice(null);
    try {
      const res = await loginWithGoogleDrive();
      setCurrentUser(res.user);
      setIsAuthenticated(true);
      loadFiles();
    } catch (err: any) {
      console.error('Sign in error:', err);
      if (err.code !== 'auth/popup-closed-by-user') {
        setErrorNotice(err.message || 'Could not sign in to Google. Please try again.');
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await logoutGoogleDrive();
    setIsAuthenticated(false);
    setCurrentUser(null);
    setFiles([]);
  };

  const handleImportFile = async (file: DriveFileItem) => {
    setDownloadingFileId(file.id);
    setErrorNotice(null);
    setSuccessNotice(null);
    try {
      // 1. Download file binary from Google Drive API
      const downloadedFile = await downloadDriveFile(file.id, file.name, file.mimeType);

      let finalUrl = '';
      if (file.mimeType.startsWith('image/')) {
        // Optimize image using client canvas
        const optimizedUrl = await optimizeImageFile(downloadedFile, {
          maxWidth: 1600,
          maxHeight: 1600,
          quality: 0.85,
        });
        finalUrl = optimizedUrl || '';
      }

      if (!finalUrl) {
        finalUrl = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(downloadedFile);
        });
      }

      // 2. Register to Greenvest Media Assets Library
      GreenvestDB.uploadMedia({
        fileName: file.name,
        fileUrl: finalUrl,
        category: targetCategory,
        sizeBytes: file.size ? parseInt(file.size, 10) : Math.round(finalUrl.length * 0.75),
        altText: file.name.replace(/\.[^/.]+$/, ''),
        caption: `Uploaded from Google Drive (${file.name})`,
      });

      setSuccessNotice(`Successfully uploaded "${file.name}" to Greenvest Media Library under "${targetCategory}"!`);
      setTimeout(() => setSuccessNotice(null), 5000);
    } catch (err: any) {
      console.error('File import error:', err);
      setErrorNotice(err.message || 'Failed to download and upload selected Drive file.');
    } finally {
      setDownloadingFileId(null);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadFiles(searchQuery);
  };

  if (isLoadingAuth) {
    return (
      <div className="flex flex-col items-center justify-center p-16 space-y-4 text-neutral-500">
        <Loader2 className="w-8 h-8 animate-spin text-[#075E2B]" />
        <span className="text-sm font-semibold">Connecting to Google Drive session...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white border border-neutral-200 flex items-center justify-center shadow-xs shrink-0">
            <svg className="w-7 h-7" viewBox="0 0 87.3 78" xmlns="http://www.w3.org/2000/svg">
              <path d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z" fill="#0066da"/>
              <path d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44c-.8 1.4-1.2 2.95-1.2 4.5h27.5z" fill="#00ac47"/>
              <path d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.502l5.852 11.5z" fill="#ea4335"/>
              <path d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.25z" fill="#00832d"/>
              <path d="m59.8 53h-32.3l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z" fill="#2684fc"/>
              <path d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.15 28h27.45c0-1.55-.4-3.1-1.2-4.5z" fill="#ffba00"/>
            </svg>
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#075E2B]">
              Google Workspace Cloud Integration
            </span>
            <h2 className="font-serif-display text-3xl font-bold text-[#263238]">
              Google Drive File Uploader
            </h2>
            <p className="text-xs text-neutral-500">
              Browse, search, and import high-resolution agricultural photos, field inspections, and harvest media directly from Google Drive.
            </p>
          </div>
        </div>

        {isAuthenticated && onNavigateTab && (
          <button
            onClick={() => onNavigateTab('media')}
            className="px-4 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
          >
            <span>View Media Library</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* 2. Unauthenticated Banner */}
      {!isAuthenticated ? (
        <div className="bg-white border border-neutral-200 rounded-3xl p-8 sm:p-12 text-center max-w-2xl mx-auto space-y-6 shadow-sm">
          <div className="w-16 h-16 rounded-3xl bg-neutral-50 border border-neutral-200 flex items-center justify-center mx-auto shadow-xs">
            <svg className="w-10 h-10" viewBox="0 0 87.3 78" xmlns="http://www.w3.org/2000/svg">
              <path d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z" fill="#0066da"/>
              <path d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44c-.8 1.4-1.2 2.95-1.2 4.5h27.5z" fill="#00ac47"/>
              <path d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.502l5.852 11.5z" fill="#ea4335"/>
              <path d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.25z" fill="#00832d"/>
              <path d="m59.8 53h-32.3l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z" fill="#2684fc"/>
              <path d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.15 28h27.45c0-1.55-.4-3.1-1.2-4.5z" fill="#ffba00"/>
            </svg>
          </div>

          <div className="space-y-2">
            <h3 className="font-serif-display text-2xl font-bold text-neutral-800">
              Connect Google Drive to Greenvest
            </h3>
            <p className="text-sm text-neutral-600 max-w-md mx-auto leading-relaxed">
              Authenticate with your Google account with permission to access your Drive files. Once linked, you can select and upload photos directly to farm dossiers, crop harvests, and product pages.
            </p>
          </div>

          {errorNotice && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2 text-left max-w-md mx-auto">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{errorNotice}</span>
            </div>
          )}

          <div className="pt-2">
            <button
              type="button"
              onClick={handleLogin}
              disabled={isLoggingIn}
              className="inline-flex items-center justify-center gap-3 px-8 py-3.5 bg-white hover:bg-neutral-50 active:bg-neutral-100 text-neutral-800 font-bold text-sm border border-neutral-300 rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              {isLoggingIn ? (
                <Loader2 className="w-5 h-5 animate-spin text-[#075E2B]" />
              ) : (
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                </svg>
              )}
              <span>{isLoggingIn ? 'Connecting to Google Drive...' : 'Sign in with Google'}</span>
            </button>
          </div>

          <div className="flex items-center justify-center gap-4 text-[11px] text-neutral-400 pt-4 border-t border-neutral-100">
            <span className="flex items-center gap-1">
              <Check className="w-3.5 h-3.5 text-emerald-600" /> Read-only permission
            </span>
            <span className="flex items-center gap-1">
              <Check className="w-3.5 h-3.5 text-emerald-600" /> Automatic web optimization
            </span>
            <span className="flex items-center gap-1">
              <Check className="w-3.5 h-3.5 text-emerald-600" /> Supabase storage sync
            </span>
          </div>
        </div>
      ) : (
        /* 3. Authenticated Workspace */
        <div className="space-y-6">
          {/* User Session Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white border border-neutral-200 rounded-3xl shadow-xs">
            <div className="flex items-center gap-3 min-w-0">
              {currentUser?.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt="Google Avatar"
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-full border border-neutral-300 shadow-xs"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-[#075E2B] text-white font-bold flex items-center justify-center shadow-xs">
                  G
                </div>
              )}
              <div className="min-w-0">
                <span className="text-sm font-bold text-neutral-800 block truncate">
                  {currentUser?.displayName || currentUser?.email || 'Google Account Connected'}
                </span>
                <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block animate-pulse" />
                  Google Drive API Active ({currentUser?.email})
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => loadFiles(searchQuery)}
                disabled={isLoadingFiles}
                className="px-3 py-2 text-xs font-bold text-neutral-700 hover:text-neutral-900 rounded-xl hover:bg-neutral-100 border border-neutral-200 bg-white transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingFiles ? 'animate-spin text-[#075E2B]' : ''}`} />
                <span>Refresh Files</span>
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="px-3 py-2 text-xs font-bold text-red-600 hover:text-red-700 rounded-xl hover:bg-red-50 border border-neutral-200 bg-white transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Disconnect</span>
              </button>
            </div>
          </div>

          {/* Search, Filter & Target Category Bar */}
          <div className="bg-white p-5 rounded-3xl border border-neutral-200 shadow-xs space-y-4">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              {/* Search Form */}
              <div className="flex-1 flex gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        loadFiles(searchQuery);
                      }
                    }}
                    placeholder="Search image or document name in Google Drive..."
                    className="w-full pl-10 pr-4 py-2.5 text-xs bg-neutral-50 border border-neutral-300 rounded-2xl focus:outline-hidden focus:ring-2 focus:ring-[#075E2B]"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => loadFiles(searchQuery)}
                  className="px-5 py-2.5 bg-[#075E2B] text-white text-xs font-bold rounded-2xl hover:bg-[#064e24] transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
                >
                  <Search className="w-4 h-4" />
                  <span>Search Drive</span>
                </button>
              </div>

              {/* Target Category Selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-neutral-600 shrink-0">
                  Import into Category:
                </span>
                <select
                  value={targetCategory}
                  onChange={(e) => setTargetCategory(e.target.value)}
                  className="px-3 py-2 text-xs font-semibold bg-neutral-50 border border-neutral-300 rounded-2xl focus:ring-2 focus:ring-[#075E2B]"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {errorNotice && (
              <div className="p-3 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{errorNotice}</span>
              </div>
            )}

            {successNotice && (
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 animate-in fade-in">
                <Check className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{successNotice}</span>
              </div>
            )}
          </div>

          {/* Drive Files Grid */}
          <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif-display text-xl font-bold text-[#263238]">
                Google Drive Files & Images ({files.length})
              </h3>
              <span className="text-xs text-neutral-400">
                Click any asset below to upload & optimize into Greenvest
              </span>
            </div>

            {isLoadingFiles ? (
              <div className="flex flex-col items-center justify-center p-20 space-y-3 text-neutral-400">
                <Loader2 className="w-8 h-8 animate-spin text-[#075E2B]" />
                <span className="text-sm font-semibold">Loading files from your Google Drive...</span>
              </div>
            ) : files.length === 0 ? (
              <div className="text-center py-20 px-4 bg-neutral-50 rounded-2xl border border-dashed border-neutral-300 space-y-3">
                <FolderOpen className="w-12 h-12 text-neutral-400 mx-auto opacity-50" />
                <h4 className="text-sm font-bold text-neutral-700">No files found in Google Drive</h4>
                <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                  {searchQuery
                    ? `No Drive files match "${searchQuery}". Try a different keyword.`
                    : 'Upload photos or inspection files to your Google Drive, then click Refresh above to pick and upload them here.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {files.map((file) => {
                  const isDownloading = downloadingFileId === file.id;
                  const isImage = file.mimeType.startsWith('image/');
                  return (
                    <div
                      key={file.id}
                      className="group flex flex-col rounded-2xl overflow-hidden border border-neutral-200 bg-white hover:border-[#075E2B] hover:shadow-lg transition-all"
                    >
                      {/* Image Thumbnail */}
                      <div className="aspect-square w-full bg-neutral-100 overflow-hidden relative flex items-center justify-center">
                        {file.thumbnailLink ? (
                          <img
                            src={file.thumbnailLink}
                            alt={file.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : isImage ? (
                          <FileImage className="w-10 h-10 text-neutral-400" />
                        ) : (
                          <FileText className="w-10 h-10 text-neutral-400" />
                        )}

                        {isDownloading && (
                          <div className="absolute inset-0 bg-[#075E2B]/85 backdrop-blur-xs flex flex-col items-center justify-center p-2 text-white text-center">
                            <Loader2 className="w-6 h-6 animate-spin mb-1.5" />
                            <span className="text-[10px] font-bold">Uploading to Greenvest...</span>
                          </div>
                        )}
                      </div>

                      {/* File Details & Upload Action */}
                      <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
                        <div>
                          <h5
                            className="text-xs font-bold text-neutral-800 truncate"
                            title={file.name}
                          >
                            {file.name}
                          </h5>
                          <span className="text-[10px] text-neutral-400 block mt-0.5">
                            {file.size
                              ? `${(parseInt(file.size, 10) / (1024 * 1024)).toFixed(2)} MB`
                              : 'Drive File'}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleImportFile(file)}
                          disabled={Boolean(downloadingFileId)}
                          className="w-full py-1.5 px-2 bg-[#075E2B] hover:bg-[#064e24] text-white font-bold text-[11px] rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                        >
                          <UploadCloud className="w-3.5 h-3.5 text-[#F4B400]" />
                          <span>Upload File</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
