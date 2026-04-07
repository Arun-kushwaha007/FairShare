import { CurrencyCode, formatCurrencyFromCents } from '@fairshare/shared-types';

export const sumMoney = (values: Array<bigint | number | string>): bigint =>
  values.reduce<bigint>((acc, value) => acc + BigInt(value), 0n);

export const assertMoneyEquality = (left: bigint, right: bigint, message = 'Money totals mismatch'): void => {
  if (left !== right) {
    throw new Error(message);
  }
};

export const formatMoney = (amountCents: bigint | number | string, currency: CurrencyCode = 'USD'): string =>
  formatCurrencyFromCents(amountCents, currency);
