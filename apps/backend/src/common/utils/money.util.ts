export const sumMoney = (values: Array<bigint | number | string>): bigint =>
  values.reduce<bigint>((acc, value) => acc + BigInt(value), 0n);

export const assertMoneyEquality = (left: bigint, right: bigint, message = 'Money totals mismatch'): void => {
  if (left !== right) {
    throw new Error(message);
  }
};

export const formatMoney = (amountCents: bigint | number | string, currency = 'USD'): string => {
  const value = Number(BigInt(amountCents)) / 100;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(value);
};
