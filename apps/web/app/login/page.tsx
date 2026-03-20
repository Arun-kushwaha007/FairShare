'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { ArrowRight } from 'lucide-react';
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
    <main className="relative min-h-screen overflow-hidden bg-[#030303] text-white flex flex-col justify-center px-6">
      {/* Background Ambience */}
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-10" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-full max-w-4xl bg-purple-600/5 blur-[120px]" />

      <div className="relative z-10 mx-auto w-full max-w-lg">
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-purple-700 shadow-xl shadow-purple-500/20 mb-6 group transition-transform hover:scale-105 active:scale-95">
            <span className="text-white font-black text-3xl">FS</span>
          </Link>
          <h1 className="text-4xl font-extrabold tracking-tight text-white mb-3">
            Welcome Back
          </h1>
          <p className="text-zinc-400 font-medium tracking-wide uppercase text-[10px] tracking-[0.2em]">
            Sign in to your FairShare account
          </p>
        </div>

        <div className="relative overflow-hidden rounded-[2.5rem] border border-white/5 bg-white/[0.03] backdrop-blur-2xl p-8 sm:p-12 shadow-2xl">
          {/* Internal Glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-transparent pointer-events-none" />
          
          <form className="relative z-10 space-y-6" onSubmit={onSubmit}>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 ml-1">Email Address</label>
              <input
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 font-medium text-white outline-none focus:border-purple-500/50 focus:bg-white/[0.08] transition-all"
                placeholder="name@company.com"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 ml-1">Password</label>
              <input
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 font-medium text-white outline-none focus:border-purple-500/50 focus:bg-white/[0.08] transition-all"
                placeholder="••••••••"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </div>

            {error ? (
              <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-red-400 font-bold text-sm text-center">
                {error}
              </div>
            ) : null}

            <button
              className="btn-royal w-full group py-4 h-14"
              disabled={loading}
              type="submit"
            >
              <span className="flex items-center justify-center gap-2">
                {loading ? 'Authenticating...' : 'Sign In'}
                {!loading && <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />}
              </span>
            </button>

            <p className="text-center text-sm font-medium text-zinc-500">
              New to FairShare?{' '}
              <Link className="text-purple-400 hover:text-purple-300 transition-colors font-bold underline decoration-purple-500/30 underline-offset-8 decoration-2" href="/register">
                Create account
              </Link>
            </p>
          </form>
          
          {/* Top light leak */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
        </div>
      </div>
    </main>
  );
}
