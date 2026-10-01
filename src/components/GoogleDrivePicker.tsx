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
} from 'lucide-react';
import { User } from 'firebase/auth';

interface GoogleDrivePickerProps {
  onSelectImage?: (imageUrl: string, fileName: string) => void;
  category?: string;
  className?: string;
  isCompact?: boolean;
}

export const GoogleDrivePicker: React.FC<GoogleDrivePickerProps> = ({
  onSelectImage,
  category = 'General',
  className = '',
  isCompact = false,
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState<boolean>(true);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);

  const [files, setFiles] = useState<DriveFileItem[]>([]);
  const [isLoadingFiles, setIsLoadingFiles] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [downloadingFileId, setDownloadingFileId] = useState<string | null>(null);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

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

    // Initial token check
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

  const handleSelectFile = async (file: DriveFileItem) => {
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
        // Fallback for non-image or uncompressed
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
        category: category || 'Google Drive Imports',
        sizeBytes: file.size ? parseInt(file.size, 10) : Math.round(finalUrl.length * 0.75),
        altText: file.name.replace(/\.[^/.]+$/, ''),
        caption: `Imported from Google Drive (${file.name})`,
      });

      setSuccessNotice(`Successfully imported "${file.name}" to Greenvest Media Library!`);
      setTimeout(() => setSuccessNotice(null), 4000);

      // 3. Callback to parent if supplied
      if (onSelectImage) {
        onSelectImage(finalUrl, file.name);
      }
    } catch (err: any) {
      console.error('File import error:', err);
      setErrorNotice(err.message || 'Failed to download and import selected Drive file.');
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
      <div className="flex flex-col items-center justify-center p-8 space-y-3 text-neutral-500">
        <Loader2 className="w-6 h-6 animate-spin text-[#075E2B]" />
        <span className="text-xs">Checking Google Drive authorization...</span>
      </div>
    );
  }

  // If not authenticated, display official Sign In with Google button
  if (!isAuthenticated) {
    return (
      <div className={`flex flex-col items-center justify-center p-8 text-center bg-white border border-neutral-200 rounded-3xl space-y-4 shadow-xs ${className}`}>
        <div className="w-14 h-14 rounded-2xl bg-neutral-50 border border-neutral-200 flex items-center justify-center shadow-xs">
          {/* Official Google Drive icon SVG */}
          <svg className="w-8 h-8" viewBox="0 0 87.3 78" xmlns="http://www.w3.org/2000/svg">
            <path d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z" fill="#0066da"/>
            <path d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44c-.8 1.4-1.2 2.95-1.2 4.5h27.5z" fill="#00ac47"/>
            <path d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.502l5.852 11.5z" fill="#ea4335"/>
            <path d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.25z" fill="#00832d"/>
            <path d="m59.8 53h-32.3l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z" fill="#2684fc"/>
            <path d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.15 28h27.45c0-1.55-.4-3.1-1.2-4.5z" fill="#ffba00"/>
          </svg>
        </div>

        <div className="max-w-md space-y-1.5">
          <h4 className="font-serif-display text-lg sm:text-xl font-bold text-neutral-800">
            Connect Your Google Drive
          </h4>
          <p className="text-xs text-neutral-600 leading-relaxed">
            Link your Google account with permission to browse, search, and upload files directly from Google Drive into Greenvest farm dossiers, commercial harvest records, and media galleries.
          </p>
        </div>

        {errorNotice && (
          <div className="w-full max-w-sm p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2 text-left">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{errorNotice}</span>
          </div>
        )}

        {/* Official styled Sign In With Google button */}
        <button
          type="button"
          onClick={handleLogin}
          disabled={isLoggingIn}
          className="inline-flex items-center justify-center gap-3 px-6 py-3 bg-white hover:bg-neutral-50 active:bg-neutral-100 text-neutral-700 font-semibold text-xs sm:text-sm border border-neutral-300 rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-50 hover:shadow-md"
        >
          {isLoggingIn ? (
            <Loader2 className="w-4 h-4 animate-spin text-[#075E2B]" />
          ) : (
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
          )}
          <span>{isLoggingIn ? 'Connecting to Google...' : 'Sign in with Google'}</span>
        </button>

        <p className="text-[10px] text-neutral-400 max-w-xs">
          Access is read-only. Your files in Google Drive will never be modified or altered.
        </p>
      </div>
    );
  }

  // Authenticated state
  return (
    <div className={`space-y-4 ${className}`}>
      {/* Top Session Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-neutral-50 border border-neutral-200 rounded-2xl">
        <div className="flex items-center gap-2.5 min-w-0">
          {currentUser?.photoURL ? (
            <img
              src={currentUser.photoURL}
              alt="Google user avatar"
              referrerPolicy="no-referrer"
              className="w-7 h-7 rounded-full shrink-0 border border-neutral-300"
            />
          ) : (
            <div className="w-7 h-7 rounded-full bg-[#075E2B] text-white text-xs font-bold flex items-center justify-center">
              G
            </div>
          )}
          <div className="min-w-0">
            <span className="text-xs font-bold text-neutral-800 block truncate">
              {currentUser?.displayName || currentUser?.email || 'Connected to Google Drive'}
            </span>
            <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 inline-block" />
              Google Drive Active
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => loadFiles(searchQuery)}
            disabled={isLoadingFiles}
            title="Refresh files from Drive"
            className="px-2.5 py-1.5 text-xs text-neutral-600 hover:text-neutral-900 rounded-xl hover:bg-neutral-200/60 transition-colors cursor-pointer flex items-center gap-1 border border-neutral-200 bg-white"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoadingFiles ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <button
            type="button"
            onClick={handleLogout}
            title="Disconnect Google Drive"
            className="px-2.5 py-1.5 text-xs text-neutral-600 hover:text-red-600 rounded-xl hover:bg-red-50 transition-colors cursor-pointer flex items-center gap-1 border border-neutral-200 bg-white"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Disconnect</span>
          </button>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="flex gap-2">
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
            placeholder="Search files or images in your Google Drive..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-neutral-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#075E2B]"
          />
        </div>
        <button
          type="button"
          onClick={() => loadFiles(searchQuery)}
          className="px-4 py-2 bg-[#075E2B] text-white text-xs font-bold rounded-xl hover:bg-[#064e24] transition-colors cursor-pointer flex items-center gap-1.5"
        >
          <Search className="w-3.5 h-3.5" />
          <span>Search</span>
        </button>
      </div>

      {errorNotice && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{errorNotice}</span>
        </div>
      )}

      {successNotice && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{successNotice}</span>
        </div>
      )}

      {/* File Grid */}
      {isLoadingFiles ? (
        <div className="flex flex-col items-center justify-center p-12 space-y-2 text-neutral-400 bg-neutral-50 rounded-2xl border border-neutral-200">
          <Loader2 className="w-7 h-7 animate-spin text-[#075E2B]" />
          <span className="text-xs font-semibold">Retrieving files from Google Drive...</span>
        </div>
      ) : files.length === 0 ? (
        <div className="text-center py-12 px-4 bg-neutral-50 rounded-2xl border border-dashed border-neutral-300 space-y-2">
          <FolderOpen className="w-10 h-10 text-neutral-400 mx-auto opacity-60" />
          <p className="text-xs font-bold text-neutral-700">No files found in your Google Drive</p>
          <p className="text-[11px] text-neutral-500 max-w-sm mx-auto">
            {searchQuery
              ? `No matches for "${searchQuery}". Try a different keyword.`
              : 'Add photos or documents to your Google Drive, then click Refresh above to pick them here.'}
          </p>
        </div>
      ) : (
        <div className={`grid gap-3 overflow-y-auto max-h-80 p-1 ${
          isCompact ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4'
        }`}>
          {files.map((file) => {
            const isDownloading = downloadingFileId === file.id;
            const isImage = file.mimeType.startsWith('image/');
            return (
              <button
                key={file.id}
                type="button"
                onClick={() => handleSelectFile(file)}
                disabled={Boolean(downloadingFileId)}
                className="group relative flex flex-col rounded-2xl overflow-hidden border border-neutral-200 bg-white hover:border-[#075E2B] hover:shadow-lg transition-all text-left cursor-pointer disabled:opacity-50"
              >
                {/* Thumbnail / Icon */}
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
                    <div className="absolute inset-0 bg-[#075E2B]/80 backdrop-blur-xs flex flex-col items-center justify-center p-2 text-white text-center">
                      <Loader2 className="w-6 h-6 animate-spin mb-1" />
                      <span className="text-[10px] font-bold">Importing...</span>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="px-3 py-1 bg-white text-[#075E2B] font-bold text-xs rounded-xl shadow-md flex items-center gap-1">
                      <UploadCloud className="w-3.5 h-3.5" />
                      <span>Upload</span>
                    </span>
                  </div>
                </div>

                {/* File Details */}
                <div className="p-2.5 space-y-1">
                  <h5 className="text-xs font-bold text-neutral-800 truncate" title={file.name}>
                    {file.name}
                  </h5>
                  <div className="flex items-center justify-between text-[10px] text-neutral-400">
                    <span>
                      {file.size ? `${(parseInt(file.size, 10) / (1024 * 1024)).toFixed(1)} MB` : 'Drive Item'}
                    </span>
                    <span>
                      {file.createdTime ? new Date(file.createdTime).toLocaleDateString() : ''}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
