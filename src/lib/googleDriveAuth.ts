import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
  User,
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);

// Configure Google Auth Provider with Google Drive readonly scope
const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/drive.readonly');
provider.setCustomParameters({
  prompt: 'select_account',
});

// In-memory token cache (strictly NO localStorage or sessionStorage)
let cachedAccessToken: string | null = null;
let isSigningIn = false;

export interface DriveFileItem {
  id: string;
  name: string;
  mimeType: string;
  thumbnailLink?: string;
  webContentLink?: string;
  size?: string;
  createdTime?: string;
}

/**
 * Initialize auth listener on mount
 */
export const initGoogleDriveAuth = (
  onSuccess?: (user: User, token: string) => void,
  onFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onSuccess) onSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        cachedAccessToken = null;
        if (onFailure) onFailure();
      }
    } else {
      cachedAccessToken = null;
      if (onFailure) onFailure();
    }
  });
};

/**
 * Google Sign In popup flow requesting Google Drive access
 */
export const loginWithGoogleDrive = async (): Promise<{
  user: User;
  accessToken: string;
}> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Google Drive access token was not returned.');
    }
    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: credential.accessToken };
  } catch (error: any) {
    console.error('Google Drive sign-in error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

/**
 * Get current active in-memory access token
 */
export const getDriveAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

/**
 * Log out of Google Drive session and purge token
 */
export const logoutGoogleDrive = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (err) {
    console.warn('Error during Google sign out:', err);
  } finally {
    cachedAccessToken = null;
  }
};

/**
 * Query files from Google Drive v3 REST API
 */
export const fetchDriveFiles = async (
  query = '',
  nextPageToken?: string
): Promise<{ files: DriveFileItem[]; nextPageToken?: string }> => {
  const token = await getDriveAccessToken();
  if (!token) {
    throw new Error('Please connect your Google account to access Google Drive.');
  }

  // Filter for images (JPEG, PNG, WEBP, GIF, SVG) and not in trash
  let qParts = [
    "trashed = false",
    "(mimeType contains 'image/' or mimeType = 'application/vnd.google-apps.photo' or mimeType = 'application/pdf')",
  ];
  if (query.trim()) {
    const sanitized = query.replace(/'/g, "\\'");
    qParts.push(`name contains '${sanitized}'`);
  }
  const q = qParts.join(' and ');

  const url = new URL('https://www.googleapis.com/drive/v3/files');
  url.searchParams.set('q', q);
  url.searchParams.set(
    'fields',
    'nextPageToken, files(id, name, mimeType, thumbnailLink, webContentLink, size, createdTime)'
  );
  url.searchParams.set('pageSize', '24');
  url.searchParams.set('orderBy', 'modifiedTime desc');
  if (nextPageToken) {
    url.searchParams.set('pageToken', nextPageToken);
  }

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      cachedAccessToken = null;
      throw new Error('Your Google Drive session has expired. Please sign in again.');
    }
    const errText = await response.text();
    throw new Error(`Failed to load Google Drive files: ${response.statusText} (${errText})`);
  }

  const data = await response.json();
  return {
    files: data.files || [],
    nextPageToken: data.nextPageToken,
  };
};

/**
 * Download a file from Google Drive as a local Blob / File for processing
 */
export const downloadDriveFile = async (
  fileId: string,
  fileName: string,
  mimeType: string
): Promise<File> => {
  const token = await getDriveAccessToken();
  if (!token) {
    throw new Error('Google Drive authentication is required to download this asset.');
  }

  const downloadUrl = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`;
  const response = await fetch(downloadUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Could not download image from Google Drive: ${response.statusText}`);
  }

  const blob = await response.blob();
  return new File([blob], fileName || 'google-drive-image.jpg', {
    type: mimeType || blob.type || 'image/jpeg',
  });
};
