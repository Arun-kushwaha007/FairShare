import { ExpenseDto } from '@fairshare/shared-types';
import { glassPanel } from '../layout/layoutStyles';
import { ExpenseRow } from './ExpenseRow';

interface ExpenseTableProps {
  expenses: ExpenseDto[];
}

export function ExpenseTable({ expenses }: ExpenseTableProps) {
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
              <th className="px-6 py-3 border-b border-[var(--fs-border)] text-right">Receipt</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--fs-border)]">
            {expenses.map((expense) => (
              <ExpenseRow key={expense.id} expense={expense} />
            ))}
            {expenses.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-10 text-center text-sm font-medium text-[var(--fs-text-muted)]">
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
