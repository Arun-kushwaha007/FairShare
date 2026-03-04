import { calculateBalanceDeltas } from './expense-calculator';

describe('calculateBalanceDeltas', () => {
  it('should create symmetric balance updates when payer covers another member', () => {
    const deltas = calculateBalanceDeltas('A', [
      { userId: 'A', owedAmountCents: '500', paidAmountCents: '1000' },
      { userId: 'B', owedAmountCents: '500', paidAmountCents: '0' },
    ]);

    expect(deltas).toEqual([
      { userId: 'B', counterpartyUserId: 'A', delta: -500n },
      { userId: 'A', counterpartyUserId: 'B', delta: 500n },
    ]);
  });
});
