import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';

type AuthState = {
  accessToken: string | null;
  setAccessToken: (token: string | null) => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  setAccessToken: async (token) => {
    if (token) {
      await SecureStore.setItemAsync('accessToken', token);
    } else {
      await SecureStore.deleteItemAsync('accessToken');
    }

    set({ accessToken: token });
  },
}));
