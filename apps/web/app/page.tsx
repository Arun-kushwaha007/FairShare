'use client';

import { motion } from 'framer-motion';

const features = [
  'Smart expense splits',
  'Automatic balance tracking',
  'Settle-up suggestions',
  'Receipt uploads',
];

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <section className="mx-auto max-w-6xl px-6 py-20">
        <motion.h1 initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="text-5xl font-bold tracking-tight">
          Split smarter with FairShare
        </motion.h1>
        <p className="mt-4 max-w-2xl text-lg text-slate-600">Track group expenses, simplify debts, and settle transparently.</p>
        <div className="mt-8 flex gap-4">
          <a href="/login" className="rounded bg-brand px-5 py-3 text-white">Get Started</a>
          <a href="/features" className="rounded border border-slate-300 px-5 py-3">View Features</a>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-6 pb-16 md:grid-cols-2">
        <div className="rounded-xl bg-white p-6 shadow">
          <h2 className="text-2xl font-semibold">Product Preview</h2>
          <p className="mt-3 text-slate-600">Mobile-first flows for adding expenses, viewing balances, and settling up quickly.</p>
        </div>
        <div className="rounded-xl bg-white p-6 shadow">
          <h2 className="text-2xl font-semibold">How It Works</h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-slate-600">
            <li>Create group</li>
            <li>Add expense and splits</li>
            <li>Review balances</li>
            <li>Settle and close out</li>
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <h2 className="text-3xl font-semibold">Features</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {features.map((item) => (
            <div key={item} className="rounded-lg border border-slate-200 bg-white p-4">
              {item}
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-16">
        <h2 className="text-3xl font-semibold">Testimonials</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <blockquote className="rounded-lg bg-white p-5 shadow">"FairShare removed all confusion in our travel group."</blockquote>
          <blockquote className="rounded-lg bg-white p-5 shadow">"Settle-up suggestions are excellent and fast."</blockquote>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
          <p>FairShare</p>
          <div className="flex gap-4 text-sm text-slate-600">
            <a href="/about">About</a>
            <a href="/pricing">Pricing</a>
            <a href="/login">Login</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
