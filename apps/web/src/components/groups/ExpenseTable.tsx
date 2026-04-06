'use client';

import { useMemo, useState } from 'react';
import { ExpenseDto, EXPENSE_CATEGORIES, GroupMemberSummaryDto } from '@fairshare/shared-types';
import { glassPanel } from '../layout/layoutStyles';
import { ExpenseRow } from './ExpenseRow';

interface ExpenseTableProps {
  expenses: ExpenseDto[];
  members: GroupMemberSummaryDto[];
  isGuest?: boolean;
}

const categoryLabels: Record<string, string> = {
  FOOD: 'Food',
  TRAVEL: 'Travel',
  UTILITIES: 'Utilities',
  GROCERIES: 'Groceries',
  ENTERTAINMENT: 'Entertainment',
  OTHER: 'Other',
};

export function ExpenseTable({ expenses, members, isGuest = false }: ExpenseTableProps) {
  const [query, setQuery] = useState('');
  const [payerId, setPayerId] = useState('');
  const [category, setCategory] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const memberNameById = useMemo(() => Object.fromEntries(members.map((member) => [member.userId, member.name])), [members]);

  const filteredExpenses = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return expenses.filter((expense) => {
      if (payerId && expense.payerId !== payerId) {
        return false;
      }

      if (category && expense.category !== category) {
        return false;
      }

      const expenseDate = expense.createdAt.slice(0, 10);
      if (startDate && expenseDate < startDate) {
        return false;
      }
      if (endDate && expenseDate > endDate) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      const amount = (Number(expense.totalAmountCents) / 100).toFixed(2);
      const dateLabel = new Date(expense.createdAt).toLocaleDateString();
      const haystack = [
        expense.description,
        memberNameById[expense.payerId] ?? expense.payerId,
        amount,
        dateLabel,
        expense.category ? categoryLabels[expense.category] ?? expense.category : '',
      ]
        .join(' ')
        .toLowerCase();

      return haystack.includes(normalizedQuery);
    });
  }, [category, endDate, expenses, memberNameById, payerId, query, startDate]);

  const resetFilters = () => {
    setQuery('');
    setPayerId('');
    setCategory('');
    setStartDate('');
    setEndDate('');
  };

  return (
    <div className={`${glassPanel} overflow-hidden`}>
      <div className="p-4 sm:p-6 border-b border-[var(--fs-border)] bg-[var(--fs-background)]/40 flex flex-col gap-4 sm:gap-5">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-xl font-extrabold tracking-tight text-[var(--fs-text-primary)]">Expense history</h2>
            <p className="text-[12px] font-medium text-[var(--fs-text-muted)]">Search the ledger by description, payer, amount, date, or category.</p>
          </div>
          <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--fs-text-muted)]">
            {filteredExpenses.length}/{expenses.length} records
          </span>
        </div>

        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 xl:grid-cols-[minmax(0,2fr)_repeat(4,minmax(0,1fr))]">
          <input
            className="rounded-xl border border-[var(--fs-border)] bg-[var(--fs-background)] px-3 py-2 text-sm text-[var(--fs-text-primary)] outline-none focus:border-[var(--fs-primary)]"
            placeholder="Search description, payer, amount, date..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <select
            className="rounded-xl border border-[var(--fs-border)] bg-[var(--fs-background)] px-3 py-2 text-sm text-[var(--fs-text-primary)] outline-none focus:border-[var(--fs-primary)]"
            value={payerId}
            onChange={(event) => setPayerId(event.target.value)}
          >
            <option value="">All payers</option>
            {members.map((member) => (
              <option key={member.userId} value={member.userId}>
                {member.name}
              </option>
            ))}
          </select>
          <select
            className="rounded-xl border border-[var(--fs-border)] bg-[var(--fs-background)] px-3 py-2 text-sm text-[var(--fs-text-primary)] outline-none focus:border-[var(--fs-primary)]"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            <option value="">All categories</option>
            {EXPENSE_CATEGORIES.map((value) => (
              <option key={value} value={value}>
                {categoryLabels[value]}
              </option>
            ))}
          </select>
          <input
            type="date"
            className="rounded-xl border border-[var(--fs-border)] bg-[var(--fs-background)] px-3 py-2 text-sm text-[var(--fs-text-primary)] outline-none focus:border-[var(--fs-primary)]"
            value={startDate}
            onChange={(event) => setStartDate(event.target.value)}
          />
          <div className="flex gap-3">
            <input
              type="date"
              className="min-w-0 flex-1 rounded-xl border border-[var(--fs-border)] bg-[var(--fs-background)] px-3 py-2 text-sm text-[var(--fs-text-primary)] outline-none focus:border-[var(--fs-primary)]"
              value={endDate}
              onChange={(event) => setEndDate(event.target.value)}
            />
            <button
              type="button"
              className="rounded-xl border border-[var(--fs-border)] bg-[var(--fs-background)] px-4 py-2 text-sm font-bold text-[var(--fs-text-primary)] hover:border-[var(--fs-primary)]"
              onClick={resetFilters}
            >
              Reset
            </button>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="bg-[var(--fs-background)]/40 text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--fs-text-muted)]">
              <th className="px-6 py-3 border-b border-[var(--fs-border)]">Description</th>
              <th className="px-6 py-3 border-b border-[var(--fs-border)] text-right">Amount</th>
              <th className="hidden sm:table-cell px-6 py-3 border-b border-[var(--fs-border)] text-right">Recorded</th>
              <th className="hidden sm:table-cell px-6 py-3 border-b border-[var(--fs-border)] text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--fs-border)]">
            {filteredExpenses.map((expense) => (
              <ExpenseRow 
                key={expense.id} 
                expense={expense} 
                payerName={memberNameById[expense.payerId]} 
                members={members}
                isGuest={isGuest}
              />
            ))}
            {filteredExpenses.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-10 text-center text-sm font-medium text-[var(--fs-text-muted)]">
                  No expenses match the current search and filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
