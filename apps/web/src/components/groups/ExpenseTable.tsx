import { ExpenseDto } from '@fairshare/shared-types';

interface ExpenseTableProps {
  expenses: ExpenseDto[];
}

export function ExpenseTable({ expenses }: ExpenseTableProps) {
  function formatUsd(cents: string): string {
    const dollars = Number(cents) / 100;
    return dollars.toLocaleString(undefined, { style: 'currency', currency: 'USD' });
  }

  return (
    <div className="rounded-2xl border border-border bg-card shadow-glass backdrop-blur-glass overflow-hidden">
      <div className="p-5 border-b border-border bg-surface/5">
        <h2 className="text-base font-semibold text-text-primary">Expenses</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="bg-surface/5 text-text-secondary font-medium">
              <th className="px-5 py-3 border-b border-border">Description</th>
              <th className="px-5 py-3 border-b border-border text-right">Amount</th>
              <th className="px-5 py-3 border-b border-border text-right">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {expenses.map((expense) => (
              <tr key={expense.id} className="hover:bg-surface/5 transition-colors group">
                <td className="px-5 py-4 text-text-primary font-medium">
                  {expense.description}
                </td>
                <td className="px-5 py-4 text-right text-text-primary font-mono">
                  {formatUsd(expense.totalAmountCents)}
                </td>
                <td className="px-5 py-4 text-right text-text-secondary">
                  {new Date(expense.createdAt).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                  })}
                </td>
              </tr>
            ))}
            {expenses.length === 0 && (
              <tr>
                <td colSpan={3} className="px-5 py-10 text-center text-text-secondary italic">
                  No expenses recorded yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
