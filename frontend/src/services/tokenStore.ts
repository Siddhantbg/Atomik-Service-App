import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'atomik_token';

let secureStoreAvailable: boolean | null = null;

/** Offline demo sessions must not survive app restarts. */
export function isDemoSessionToken(token: string | null | undefined): boolean {
  return !!token && token.startsWith('demo-token-');
}

async function canUseSecureStore(): Promise<boolean> {
  if (secureStoreAvailable !== null) return secureStoreAvailable;
  try {
    secureStoreAvailable = await SecureStore.isAvailableAsync();
  } catch {
    secureStoreAvailable = false;
  }
  return secureStoreAvailable;
}

export async function getToken(): Promise<string | null> {
  if (await canUseSecureStore()) {
    try {
      return await SecureStore.getItemAsync(TOKEN_KEY);
    } catch {
      // fall through
    }
  }
  return AsyncStorage.getItem(TOKEN_KEY);
}

export async function purgeDemoSessionToken(): Promise<void> {
  const token = await getToken();
  if (isDemoSessionToken(token)) {
    await clearToken();
  }
}

export async function setToken(token: string): Promise<void> {
  if (isDemoSessionToken(token)) {
    return;
  }
  if (await canUseSecureStore()) {
    try {
      await SecureStore.setItemAsync(TOKEN_KEY, token);
      await AsyncStorage.removeItem(TOKEN_KEY);
      return;
    } catch {
      // fall through
    }
  }
  await AsyncStorage.setItem(TOKEN_KEY, token);
}

export async function clearToken(): Promise<void> {
  if (await canUseSecureStore()) {
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
    } catch {
      // ignore
    }
  }
  await AsyncStorage.removeItem(TOKEN_KEY);
}