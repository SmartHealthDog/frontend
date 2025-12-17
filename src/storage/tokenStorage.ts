import { AuthTokens } from '../api/auth';

// Lazy-load AsyncStorage to avoid crashing when the native module is missing.
let AsyncStorage: any = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  AsyncStorage = require('@react-native-async-storage/async-storage').default;
} catch (error) {
  console.warn(
    '[auth] AsyncStorage native module not found at import time; will use in-memory fallback until the app is rebuilt with the native module.',
    error
  );
}

const ACCESS_TOKEN_KEY = 'auth.accessToken';
const REFRESH_TOKEN_KEY = 'auth.refreshToken';
const EXPIRATION_KEY = 'auth.expiration';

// In-memory fallback when native AsyncStorage is unavailable (e.g., not linked/rebuilt).
let memoryStore: Partial<AuthTokens> = {};

const isAsyncStorageAvailable = () =>
  AsyncStorage &&
  typeof AsyncStorage.multiSet === 'function' &&
  typeof AsyncStorage.multiGet === 'function';

const warnIfFallback = () => {
  console.warn(
    '[auth] AsyncStorage native module not available; using in-memory fallback. Rebuild the app after installing @react-native-async-storage/async-storage.'
  );
};

const getStorage = () => {
  if (isAsyncStorageAvailable()) {
    return AsyncStorage;
  }
  warnIfFallback();
  return null;
};

export const storeAuthTokens = async (tokens: AuthTokens) => {
  const storage = getStorage();
  if (storage) {
    try {
      await storage.multiSet([
        [ACCESS_TOKEN_KEY, tokens.accessToken],
        [REFRESH_TOKEN_KEY, tokens.refreshToken],
        [EXPIRATION_KEY, tokens.expiration],
      ]);
      return;
    } catch (error) {
      console.warn('[auth] AsyncStorage store failed, falling back to memory', error);
    }
  } else {
    warnIfFallback();
  }
  memoryStore = tokens;
};

export const getStoredRefreshToken = async () => {
  const storage = getStorage();
  if (storage) {
    try {
      return storage.getItem(REFRESH_TOKEN_KEY);
    } catch (error) {
      console.warn('[auth] AsyncStorage get refreshToken failed, using memory', error);
    }
  } else {
    warnIfFallback();
  }
  return memoryStore.refreshToken ?? null;
};

export const getStoredAccessToken = async () => {
  const storage = getStorage();
  if (storage) {
    try {
      return storage.getItem(ACCESS_TOKEN_KEY);
    } catch (error) {
      console.warn('[auth] AsyncStorage get accessToken failed, using memory', error);
    }
  } else {
    warnIfFallback();
  }
  return memoryStore.accessToken ?? null;
};

export const clearAuthTokens = async () => {
  const storage = getStorage();
  if (storage) {
    try {
      await storage.multiRemove([
        ACCESS_TOKEN_KEY,
        REFRESH_TOKEN_KEY,
        EXPIRATION_KEY,
      ]);
      return;
    } catch (error) {
      console.warn('[auth] AsyncStorage clear failed, clearing memory only', error);
    }
  } else {
    warnIfFallback();
  }
  memoryStore = {};
};


