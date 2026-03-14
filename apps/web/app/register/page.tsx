'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

type RegisterResponse = { user: unknown | null };

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      if (!response.ok) {
        throw new Error('Register failed');
      }
      (await response.json()) as RegisterResponse;
      router.push('/dashboard');
    } catch {
      setError('Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-md px-6 py-24 min-h-screen flex flex-col justify-center">
      <div className="text-center mb-12">
        <h1 className="text-6xl font-black italic tracking-tighter uppercase mb-4 glitch-text" data-text="JOIN US">
          JOIN US
        </h1>
        <p className="text-lg font-bold uppercase tracking-widest text-zinc-400">
          Initialize your profile.
        </p>
      </div>

      <form
        className="neo-border neo-shadow-cyan bg-zinc-900 p-8 space-y-6"
        onSubmit={onSubmit}
      >
        <div>
          <label className="block text-sm font-black uppercase tracking-tighter mb-2 text-zinc-300">Display Name</label>
          <input
            className="w-full neo-border bg-black p-4 font-bold text-white placeholder:text-zinc-600 outline-none focus:bg-zinc-800 transition-colors"
            placeholder="NAME"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
        </div>

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
          className="w-full neo-pop-hover bg-white p-4 font-black uppercase text-black shadow-[4px_4px_0px_0px_#22d3ee] hover:bg-zinc-200 transition-all disabled:opacity-50"
          disabled={loading}
          type="submit"
        >
          {loading ? 'INITIALIZING...' : 'CREATE ACCOUNT'}
        </button>

        <p className="text-center text-sm font-bold uppercase tracking-widest text-zinc-500">
          Already a member?{' '}
          <Link className="text-white underline decoration-purple-400 decoration-2 underline-offset-4 hover:text-purple-400 transition-colors" href="/login">
            Sign in
          </Link>
        </p>
      </form>
    </main>
  );
}