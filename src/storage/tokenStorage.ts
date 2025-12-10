import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthTokens } from '../api/auth';

const ACCESS_TOKEN_KEY = 'auth.accessToken';
const REFRESH_TOKEN_KEY = 'auth.refreshToken';
const EXPIRATION_KEY = 'auth.expiration';

export const storeAuthTokens = async (tokens: AuthTokens) => {
  await AsyncStorage.multiSet([
    [ACCESS_TOKEN_KEY, tokens.accessToken],
    [REFRESH_TOKEN_KEY, tokens.refreshToken],
    [EXPIRATION_KEY, tokens.expiration],
  ]);
};

export const getStoredRefreshToken = async () => {
  return AsyncStorage.getItem(REFRESH_TOKEN_KEY);
};

export const getStoredAccessToken = async () => {
  return AsyncStorage.getItem(ACCESS_TOKEN_KEY);
};

export const clearAuthTokens = async () => {
  await AsyncStorage.multiRemove([
    ACCESS_TOKEN_KEY,
    REFRESH_TOKEN_KEY,
    EXPIRATION_KEY,
  ]);
};

