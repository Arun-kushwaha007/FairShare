export function centsToCurrency(cents: bigint | number): string {
  const value = typeof cents === 'bigint' ? Number(cents) : cents;
  return (value / 100).toFixed(2);
}
