import { ExpenseDto } from '@fairshare/shared-types';
import { glassPanel } from '../layout/layoutStyles';

interface ExpenseTableProps {
  expenses: ExpenseDto[];
}

export function ExpenseTable({ expenses }: ExpenseTableProps) {
  function formatUsd(cents: string): string {
    const dollars = Number(cents) / 100;
    return dollars.toLocaleString(undefined, { style: 'currency', currency: 'USD' });
  }

  return (
    <div className={`${glassPanel} overflow-hidden`}>
      <div className="p-6 border-b border-[var(--fs-border)] bg-[var(--fs-background)]/40 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight text-[var(--fs-text-primary)]">Expense history</h2>
          <p className="text-[12px] font-medium text-[var(--fs-text-muted)]">Chronological ledger for this group.</p>
        </div>
        <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--fs-text-muted)]">records</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="bg-[var(--fs-background)]/40 text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--fs-text-muted)]">
              <th className="px-6 py-3 border-b border-[var(--fs-border)]">Description</th>
              <th className="px-6 py-3 border-b border-[var(--fs-border)] text-right">Amount</th>
              <th className="px-6 py-3 border-b border-[var(--fs-border)] text-right">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--fs-border)]">
            {expenses.map((expense) => (
              <tr key={expense.id} className="hover:bg-[var(--fs-background)]/50 transition-colors group">
                <td className="px-6 py-4 text-base font-semibold text-[var(--fs-text-primary)]">
                  {expense.description}
                </td>
                <td className="px-6 py-4 text-right text-base font-bold text-[var(--fs-primary)]">
                  {formatUsd(expense.totalAmountCents)}
                </td>
                <td className="px-6 py-4 text-right text-[12px] font-medium text-[var(--fs-text-muted)] group-hover:text-[var(--fs-text-primary)] transition-colors">
                  {new Date(expense.createdAt).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: '2-digit'
                  })}
                </td>
              </tr>
            ))}
            {expenses.length === 0 && (
              <tr>
                <td colSpan={3} className="px-6 py-10 text-center text-sm font-medium text-[var(--fs-text-muted)]">
                  No expenses have been recorded for this group yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>

  );
}
