'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, useState } from 'react';

type LoginResponse = { user: unknown | null };

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        throw new Error('Login failed');
      }
      (await response.json()) as LoginResponse;
      const next = searchParams.get('next') || '/dashboard';
      router.push(next);
    } catch {
      setError('Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-md px-6 py-24 min-h-screen flex flex-col justify-center">
      <div className="text-center mb-12">
        <h1 className="text-6xl font-black italic tracking-tighter uppercase mb-4 glitch-text" data-text="LOGIN">
          LOGIN
        </h1>
        <p className="text-lg font-bold uppercase tracking-widest text-zinc-400">
          Access the mainframe.
        </p>
      </div>

      <form
        className="neo-border neo-shadow-purple bg-zinc-900 p-8 space-y-6"
        onSubmit={onSubmit}
      >
        <div>
          <label className="block text-sm font-black uppercase tracking-tighter mb-2 text-zinc-300">Email Address</label>
          <input
            className="w-full neo-border bg-black p-4 font-bold text-white placeholder:text-zinc-600 outline-none focus:bg-zinc-800 transition-colors"
            placeholder="YOU@EMAIL.XYZ"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-black uppercase tracking-tighter mb-2 text-zinc-300">Password</label>
          <input
            className="w-full neo-border bg-black p-4 font-bold text-white placeholder:text-zinc-600 outline-none focus:bg-zinc-800 transition-colors"
            placeholder="••••••••"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>

        {error ? (
          <div className="neo-border border-pink-500 bg-pink-500/10 p-4 text-pink-500 font-black uppercase tracking-tighter text-sm">
            ERROR: {error}
          </div>
        ) : null}

        <button
          className="w-full neo-pop-hover bg-white p-4 font-black uppercase text-black shadow-[4px_4px_0px_0px_#a855f7] hover:bg-zinc-200 transition-all disabled:opacity-50"
          disabled={loading}
          type="submit"
        >
          {loading ? 'SYNCING...' : 'SIGN IN'}
        </button>

        <p className="text-center text-sm font-bold uppercase tracking-widest text-zinc-500">
          New here?{' '}
          <Link className="text-white underline decoration-yellow-400 decoration-2 underline-offset-4 hover:text-yellow-400 transition-colors" href="/register">
            Create account
          </Link>
        </p>
      </form>
    </main>
  );
}