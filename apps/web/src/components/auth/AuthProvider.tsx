'use client';

import { AuthUserDto } from '@fairshare/shared-types';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type LoginInput = { email: string; password: string };
type RegisterInput = { name: string; email: string; password: string };

type AuthContextValue = {
  user: AuthUserDto | null;
  loading: boolean;
  login: (input: LoginInput) => Promise<AuthUserDto | null>;
  register: (input: RegisterInput) => Promise<AuthUserDto | null>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUserDto | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/session', { cache: 'no-store' });
      if (res.ok) {
        const data = (await res.json()) as { user: AuthUserDto | null };
        setUser(data.user ?? null);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const login = useCallback(
    async ({ email, password }: LoginInput) => {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = (await res.json().catch(() => ({}))) as { user?: AuthUserDto; message?: string };
      if (!res.ok) {
        throw new Error(data.message ?? 'Login failed');
      }

      setUser(data.user ?? null);
      await refresh();
      return data.user ?? null;
    },
    [refresh],
  );

  const register = useCallback(
    async ({ name, email, password }: RegisterInput) => {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = (await res.json().catch(() => ({}))) as { user?: AuthUserDto; message?: string };
      if (!res.ok) {
        throw new Error(data.message ?? 'Registration failed');
      }

      setUser(data.user ?? null);
      await refresh();
      return data.user ?? null;
    },
    [refresh],
  );

  const logout = useCallback(async () => {
    await fetch('/api/auth/logout', { method: 'POST' }).catch(() => null);
    setUser(null);
    router.push('/login');
  }, [router]);

  const value: AuthContextValue = {
    user,
    loading,
    login,
    register,
    logout,
    refresh,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
