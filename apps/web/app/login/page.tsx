'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { useAuth } from '../../src/components/auth/AuthProvider';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login({ email, password });
      const next = searchParams.get('next') || '/dashboard';
      router.push(next);
    } catch (err) {
      setError((err as Error).message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-lg px-6 min-h-screen flex flex-col justify-center">
      <div className="text-center mb-10">
        <div className="w-16 h-16 bg-[var(--fs-primary)] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl relative overflow-hidden">
          <span className="text-white font-black text-3xl">FS</span>
          <div className="absolute top-0 left-0 right-0 h-px bg-white/30" />
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-[var(--fs-text-primary)] mb-3">
          FairShare
        </h1>
        <p className="text-[var(--fs-text-secondary)] font-medium">
          Sign in to your royal SaaS dashboard
        </p>
      </div>

      <div className="card-royal p-10 bg-[var(--fs-surface)]">
        <form className="space-y-6" onSubmit={onSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-bold text-[var(--fs-text-primary)]">Email Address</label>
            <input
              className="w-full bg-[var(--fs-background)] border border-[var(--fs-border)] rounded-xl p-4 font-medium text-[var(--fs-text-primary)] outline-none focus:border-[var(--fs-primary)] transition-all"
              placeholder="name@company.com"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-[var(--fs-text-primary)]">Password</label>
            <input
              className="w-full bg-[var(--fs-background)] border border-[var(--fs-border)] rounded-xl p-4 font-medium text-[var(--fs-text-primary)] outline-none focus:border-[var(--fs-primary)] transition-all"
              placeholder="••••••••"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>

          {error ? (
            <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl text-rose-600 dark:text-rose-400 font-bold text-sm text-center">
              {error}
            </div>
          ) : null}

          <button
            className="btn-royal w-full"
            disabled={loading}
            type="submit"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <p className="text-center text-sm font-bold text-[var(--fs-text-secondary)]">
            New here?{' '}
            <Link className="text-[var(--fs-primary)] hover:underline decoration-2 underline-offset-4" href="/register">
              Create account
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}
