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
    <main className="mx-auto max-w-md px-6 py-14">
      <h1 className="text-3xl font-semibold tracking-tight">Create account</h1>
      <p className="mt-2 text-sm text-text-secondary">Start tracking shared expenses in minutes.</p>
      <form
        className="mt-6 space-y-4 rounded-2xl border border-border bg-card p-6 shadow-glass backdrop-blur-glass"
        onSubmit={onSubmit}
      >
        <input
          className="w-full rounded-xl border border-border bg-surface/40 p-3 text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-brand/60"
          placeholder="Name"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
        <input
          className="w-full rounded-xl border border-border bg-surface/40 p-3 text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-brand/60"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <input
          className="w-full rounded-xl border border-border bg-surface/40 p-3 text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-brand/60"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        {error ? <p className="text-sm text-danger">{error}</p> : null}
        <button
          className="w-full rounded-xl bg-brand p-3 font-semibold text-white transition hover:brightness-110 disabled:opacity-60"
          disabled={loading}
          type="submit"
        >
          {loading ? 'Creating...' : 'Create account'}
        </button>
        <p className="text-center text-sm text-text-secondary">
          Already have an account?{' '}
          <Link className="text-text-primary underline underline-offset-4 hover:opacity-90" href="/login">
            Sign in
          </Link>
        </p>
      </form>
    </main>
  );
}