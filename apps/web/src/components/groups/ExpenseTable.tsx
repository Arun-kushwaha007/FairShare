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
    <div className="neo-border bg-black shadow-[6px_6px_0px_0px_#22d3ee] overflow-hidden">
      <div className="p-8 border-b-4 border-zinc-900 bg-zinc-900/50 flex items-center justify-between">
        <h2 className="text-2xl font-black uppercase italic tracking-tighter text-white">Expense Buffer</h2>
        <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-widest">FS_TRANSACTION_RECORDS</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="bg-zinc-900/30 text-[10px] font-mono font-black uppercase tracking-widest text-zinc-500">
              <th className="px-8 py-4 border-b-2 border-zinc-900">DESCRIPTION_ID</th>
              <th className="px-8 py-4 border-b-2 border-zinc-900 text-right">VAL_CREDIT</th>
              <th className="px-8 py-4 border-b-2 border-zinc-900 text-right">TIMESTAMP_SIG</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-zinc-900">
            {expenses.map((expense) => (
              <tr key={expense.id} className="hover:bg-zinc-900/40 transition-colors group">
                <td className="px-8 py-6 text-lg font-black uppercase tracking-tighter text-white">
                  {expense.description}
                </td>
                <td className="px-8 py-6 text-right text-lg font-black italic tracking-tighter text-cyan-400">
                  {formatUsd(expense.totalAmountCents)}
                </td>
                <td className="px-8 py-6 text-right text-[10px] font-mono font-black text-zinc-500 group-hover:text-white transition-colors uppercase tracking-tighter">
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
                <td colSpan={3} className="px-8 py-20 text-center font-mono text-zinc-700 uppercase italic">
                  NO_RECORDS_STORED_IN_CURRENT_BUFFER
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>

  );
}
