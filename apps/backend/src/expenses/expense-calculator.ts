import { CreateExpenseSplitInputDto } from './dto/create-expense.dto';

export interface BalanceDelta {
  userId: string;
  counterpartyUserId: string;
  delta: bigint;
}

export const calculateBalanceDeltas = (payerId: string, splits: CreateExpenseSplitInputDto[]): BalanceDelta[] => {
  const deltas: BalanceDelta[] = [];

  for (const split of splits) {
    if (split.userId === payerId) {
      continue;
    }

    const owed = BigInt(split.owedAmountCents);
    const paid = BigInt(split.paidAmountCents);
    const net = owed - paid;

    if (net > 0n) {
      deltas.push({
        userId: split.userId,
        counterpartyUserId: payerId,
        delta: -net,
      });
      deltas.push({
        userId: payerId,
        counterpartyUserId: split.userId,
        delta: net,
      });
    }
  }

  return deltas;
};
