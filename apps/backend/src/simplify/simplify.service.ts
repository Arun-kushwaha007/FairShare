import { Injectable } from '@nestjs/common';
import { SimplifySuggestionDto } from '@fairshare/shared-types';
import { PrismaService } from '../common/prisma.service';

interface Position {
  userId: string;
  amount: bigint;
}

@Injectable()
export class SimplifyService {
  constructor(private readonly prisma: PrismaService) {}

  async simplifyGroup(groupId: string): Promise<SimplifySuggestionDto[]> {
    const balances = await this.prisma.balance.findMany({ where: { groupId } });
    const net = new Map<string, bigint>();

    for (const balance of balances) {
      const current = net.get(balance.userId) ?? 0n;
      net.set(balance.userId, current + balance.amountCents);
    }

    const creditors: Position[] = [];
    const debtors: Position[] = [];

    for (const [userId, amount] of net.entries()) {
      if (amount > 0n) {
        creditors.push({ userId, amount });
      } else if (amount < 0n) {
        debtors.push({ userId, amount: -amount });
      }
    }

    creditors.sort((a, b) => Number(b.amount - a.amount));
    debtors.sort((a, b) => Number(b.amount - a.amount));

    const suggestions: SimplifySuggestionDto[] = [];
    let i = 0;
    let j = 0;

    while (i < debtors.length && j < creditors.length) {
      const debtor = debtors[i];
      const creditor = creditors[j];

      const amount = debtor.amount < creditor.amount ? debtor.amount : creditor.amount;
      if (amount > 0n) {
        suggestions.push({
          fromUserId: debtor.userId,
          toUserId: creditor.userId,
          amountCents: amount.toString(),
        });
      }

      debtor.amount -= amount;
      creditor.amount -= amount;

      if (debtor.amount === 0n) {
        i += 1;
      }
      if (creditor.amount === 0n) {
        j += 1;
      }
    }

    return suggestions;
  }
}
