import { BalanceDto, CurrencyCode, GroupMemberSummaryDto, GroupSummaryDto, formatCurrencyFromCents } from '@fairshare/shared-types';

function getNetBalanceCents(balances: BalanceDto[], userId: string) {
  return balances
    .filter((balance) => balance.userId === userId)
    .reduce((sum, balance) => sum + Number(balance.amountCents), 0);
}

export function GroupSummaryPanel({
  currency,
  summary,
  balances,
  currentUserId,
  members,
  isGuest = false,
}: {
  currency: CurrencyCode;
  summary: GroupSummaryDto;
  balances: BalanceDto[];
  currentUserId?: string;
  members: GroupMemberSummaryDto[];
  isGuest?: boolean;
}) {
  const netBalanceCents = isGuest || !currentUserId ? 0 : getNetBalanceCents(balances, currentUserId);
  const balanceLabel = isGuest 
    ? 'Viewing as guest'
    : netBalanceCents > 0
      ? 'You are owed'
      : netBalanceCents < 0
        ? 'You owe'
        : 'All settled';

  const topSpenderName = summary.topSpenderUserId
    ? members.find((member) => member.userId === summary.topSpenderUserId)?.name ?? 'Unknown'
    : 'None yet';

  return (
    <div className="rounded-3xl border border-[var(--fs-border)] bg-[var(--fs-card)] p-4 sm:p-6 shadow-[var(--fs-shadow-soft)]">
      <div className="space-y-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--fs-text-muted)]">Summary</p>
        <h2 className="text-xl font-extrabold tracking-tight text-[var(--fs-text-primary)]">Your group snapshot</h2>
        <p className="text-[12px] font-medium text-[var(--fs-text-muted)]">
          Clear at-a-glance answers for total spend, settlement progress, and your current position.
        </p>
      </div>

      <div className="mt-5 grid min-w-0 grid-cols-2 gap-3 lg:grid-cols-2">
        <div className="rounded-2xl border border-[var(--fs-border)] bg-[var(--fs-background)]/60 p-4">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--fs-text-muted)]">Your balance</p>
          <p className={`mt-2 text-xl font-extrabold ${netBalanceCents > 0 ? 'text-emerald-600' : netBalanceCents < 0 ? 'text-rose-600' : 'text-[var(--fs-text-primary)]'}`}>
            {netBalanceCents === 0 ? formatCurrencyFromCents(0, currency) : formatCurrencyFromCents(Math.abs(netBalanceCents), currency)}
          </p>
          <p className="mt-1 text-sm font-medium text-[var(--fs-text-muted)]">{balanceLabel}</p>
        </div>

        <div className="rounded-2xl border border-[var(--fs-border)] bg-[var(--fs-background)]/60 p-4">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--fs-text-muted)]">Total settled</p>
          <p className="mt-2 text-xl font-extrabold text-[var(--fs-text-primary)]">{formatCurrencyFromCents(summary.totalSettledCents, currency)}</p>
          <p className="mt-1 text-sm font-medium text-[var(--fs-text-muted)]">Recorded settlement volume</p>
        </div>

        <div className="rounded-2xl border border-[var(--fs-border)] bg-[var(--fs-background)]/60 p-4">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--fs-text-muted)]">Largest expense</p>
          <p className="mt-2 text-xl font-extrabold text-[var(--fs-text-primary)]">
            {summary.largestExpenseCents ? formatCurrencyFromCents(summary.largestExpenseCents, currency) : formatCurrencyFromCents(0, currency)}
          </p>
          <p className="mt-1 text-sm font-medium text-[var(--fs-text-muted)]">Highest single ledger entry</p>
        </div>

        <div className="rounded-2xl border border-[var(--fs-border)] bg-[var(--fs-background)]/60 p-4">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--fs-text-muted)]">Top spender</p>
          <p className="mt-2 text-xl font-extrabold text-[var(--fs-text-primary)]">{topSpenderName}</p>
          <p className="mt-1 text-sm font-medium text-[var(--fs-text-muted)]">Most total spend recorded</p>
        </div>
      </div>
    </div>
  );
}
