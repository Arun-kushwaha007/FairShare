'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiPost, setStoredToken } from '../../lib/api';

type LoginResponse = {
  accessToken: string;
};

export default function LoginPage() {
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
      const response = await apiPost<LoginResponse>('/auth/login', { email, password });
      setStoredToken(response.accessToken);
      router.push('/dashboard');
    } catch {
      setError('Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-md px-6 py-14">
      <h1 className="text-3xl font-bold">Login</h1>
      <form className="mt-6 space-y-4 rounded-lg bg-white p-6 shadow" onSubmit={onSubmit}>
        <input
          className="w-full rounded border border-slate-300 p-3"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <input
          className="w-full rounded border border-slate-300 p-3"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <button className="w-full rounded bg-brand p-3 font-semibold text-white" disabled={loading} type="submit">
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </main>
  );
}