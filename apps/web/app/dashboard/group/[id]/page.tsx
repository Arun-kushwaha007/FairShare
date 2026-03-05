'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { apiFetch } from '../../../../lib/api';

type Balance = { id: string; userId: string; counterpartyUserId: string; amountCents: string };
type Expense = { id: string; description: string; totalAmountCents: string; createdAt: string };

export default function DashboardGroupPage() {
  const params = useParams<{ id: string }>();
  const groupId = params.id;
  const [balances, setBalances] = useState<Balance[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  useEffect(() => {
    if (!groupId) {
      return;
    }
    void apiFetch<Balance[]>(`/groups/${groupId}/balances`).then(setBalances).catch(() => setBalances([]));
    void apiFetch<{ items: Expense[] }>(`/groups/${groupId}/expenses?cursor=0&limit=20`)
      .then((data) => setExpenses(data.items))
      .catch(() => setExpenses([]));
  }, [groupId]);

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-3xl font-bold">Group Dashboard</h1>
      <p className="mt-2 text-slate-600">{groupId}</p>

      <section className="mt-6">
        <h2 className="text-xl font-semibold">Balances</h2>
        <div className="mt-3 space-y-2">
          {balances.map((balance) => (
            <div key={balance.id} className="rounded border bg-white p-3">
              {balance.userId} vs {balance.counterpartyUserId}: $
              {(Number(balance.amountCents) / 100).toFixed(2)}
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold">Recent Expenses</h2>
        <div className="mt-3 space-y-2">
          {expenses.map((expense) => (
            <div key={expense.id} className="rounded border bg-white p-3">
              <p className="font-medium">{expense.description}</p>
              <p className="text-sm text-slate-600">${(Number(expense.totalAmountCents) / 100).toFixed(2)}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
