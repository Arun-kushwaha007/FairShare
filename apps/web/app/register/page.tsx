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
      await response.json();
      router.push('/dashboard');
    } catch {
      setError('Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-lg px-6 min-h-screen flex flex-col justify-center">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight text-[var(--fs-text-primary)] mb-3">
          Join FairShare
        </h1>
        <p className="text-[var(--fs-text-secondary)] font-medium">
          Start your royal expense sharing journey
        </p>
      </div>

      <div className="card-royal p-10 bg-[var(--fs-surface)]">
        <form className="space-y-6" onSubmit={onSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-bold text-[var(--fs-text-primary)]">Full Name</label>
            <input
              className="w-full bg-[var(--fs-background)] border border-[var(--fs-border)] rounded-xl p-4 font-medium text-[var(--fs-text-primary)] outline-none focus:border-[var(--fs-primary)] transition-all"
              placeholder="Royal Name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </div>

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
            {loading ? 'Initializing...' : 'Create Account'}
          </button>

          <p className="text-center text-sm font-bold text-[var(--fs-text-secondary)]">
            Already have an account?{' '}
            <Link className="text-[var(--fs-primary)] hover:underline decoration-2 underline-offset-4" href="/login">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}
