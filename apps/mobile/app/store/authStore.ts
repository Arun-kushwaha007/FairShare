import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { AuthUserDto } from '@fairshare/shared-types';

type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  user: AuthUserDto | null;
  setSession: (token: string, refresh: string, user: AuthUserDto) => Promise<void>;
  clearSession: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  refreshToken: null,
  user: null,
  setSession: async (token, refresh, user) => {
    await SecureStore.setItemAsync('access_token', token);
    await SecureStore.setItemAsync('refresh_token', refresh);
    set({ accessToken: token, refreshToken: refresh, user });
  },
  clearSession: async () => {
    await SecureStore.deleteItemAsync('access_token');
    await SecureStore.deleteItemAsync('refresh_token');
    set({ accessToken: null, refreshToken: null, user: null });
  },
}));
