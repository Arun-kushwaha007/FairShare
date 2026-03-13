import { DashboardLayout } from '../../../../src/components/layout';
import { backendFetch } from '../../../../src/lib/backend';

type Balance = { id: string; userId: string; counterpartyUserId: string; amountCents: string };

type Expense = {
  id: string;
  description: string;
  totalAmountCents: string;
  createdAt: string;
  payerId: string;
};

type ExpensesResponse = { items: Expense[]; nextCursor: number | null };

type PageProps = { params: { id: string } };

export default async function DashboardGroupPage({ params }: PageProps) {
  const groupId = params.id;

  let balances: Balance[] = [];
  let expenses: Expense[] = [];

  try {
    balances = await backendFetch<Balance[]>(`/groups/${groupId}/balances`);
  } catch {
    balances = [];
  }

  try {
    const data = await backendFetch<ExpensesResponse>(`/groups/${groupId}/expenses?cursor=0&limit=20`);
    expenses = data.items;
  } catch {
    expenses = [];
  }

  return (
    <DashboardLayout>
      <div className="rounded-2xl border border-border bg-card p-5 shadow-glass backdrop-blur-glass">
        <p className="text-sm text-text-secondary">Group</p>
        <p className="mt-1 font-semibold text-text-primary">{groupId}</p>
      </div>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-glass backdrop-blur-glass">
          <h2 className="text-base font-semibold text-text-primary">Balances</h2>
          <div className="mt-3 space-y-2">
            {balances.map((balance) => (
              <div key={balance.id} className="rounded-xl border border-border/60 bg-surface/20 p-3 text-sm">
                <span className="text-text-secondary">{balance.userId}</span> <span className="text-text-secondary">vs</span>{' '}
                <span className="text-text-secondary">{balance.counterpartyUserId}</span>
                <span className="ml-2 font-medium text-text-primary">
                  ${(Number(balance.amountCents) / 100).toFixed(2)}
                </span>
              </div>
            ))}
            {balances.length === 0 ? <p className="text-sm text-text-secondary">No balances found.</p> : null}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-glass backdrop-blur-glass">
          <h2 className="text-base font-semibold text-text-primary">Recent expenses</h2>
          <div className="mt-3 space-y-2">
            {expenses.map((expense) => (
              <div key={expense.id} className="rounded-xl border border-border/60 bg-surface/20 p-3">
                <p className="text-sm font-medium text-text-primary">{expense.description}</p>
                <p className="mt-1 text-sm text-text-secondary">
                  ${(Number(expense.totalAmountCents) / 100).toFixed(2)}
                </p>
              </div>
            ))}
            {expenses.length === 0 ? <p className="text-sm text-text-secondary">No expenses yet.</p> : null}
          </div>
        </div>
      </section>
    </DashboardLayout>
  );
}
