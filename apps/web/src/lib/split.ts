import { ExpenseSplitType } from '@fairshare/shared-types';

export type SplitType = ExpenseSplitType;

export function toCents(input: string): number {
  const parsed = Number(input);
  if (Number.isNaN(parsed) || parsed < 0) {
    return 0;
  }
  return Math.round(parsed);
}

export function equalShares(totalAmountCents: number, participantIds: string[]): Record<string, number> {
  if (participantIds.length === 0) {
    return {};
  }

  const base = Math.floor(totalAmountCents / participantIds.length);
  let remainder = totalAmountCents - base * participantIds.length;
  const result: Record<string, number> = {};

  participantIds.forEach((id) => {
    result[id] = base + (remainder > 0 ? 1 : 0);
    if (remainder > 0) {
      remainder -= 1;
    }
  });

  return result;
}

export function exactShares(participantIds: string[], exactByUser: Record<string, string>): Record<string, number> {
  const result: Record<string, number> = {};
  participantIds.forEach((id) => {
    result[id] = toCents(exactByUser[id] ?? '0');
  });
  return result;
}

export function percentageShares(
  totalAmountCents: number,
  participantIds: string[],
  percentagesByUser: Record<string, string>,
): Record<string, number> {
  const result: Record<string, number> = {};
  let allocated = 0;

  participantIds.forEach((id) => {
    const pct = Number(percentagesByUser[id] ?? '0');
    const share = Math.round((totalAmountCents * (Number.isNaN(pct) ? 0 : pct)) / 100);
    result[id] = share;
    allocated += share;
  });

  const diff = totalAmountCents - allocated;
  if (participantIds.length > 0 && diff !== 0) {
    result[participantIds[0]] += diff;
  }

  return result;
}

export function sumShares(shares: Record<string, number>): number {
  return Object.values(shares).reduce((sum, value) => sum + value, 0);
}
