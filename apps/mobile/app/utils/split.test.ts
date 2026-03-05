import { equalShares, exactShares, percentageShares, sumShares } from './split';

describe('split utils', () => {
  it('builds equal shares with remainder', () => {
    const shares = equalShares(1001, ['a', 'b', 'c']);
    expect(sumShares(shares)).toBe(1001);
    expect(shares.a).toBe(334);
    expect(shares.b).toBe(334);
    expect(shares.c).toBe(333);
  });

  it('builds exact shares from user-entered values', () => {
    const shares = exactShares(['a', 'b'], { a: '400', b: '600' });
    expect(shares).toEqual({ a: 400, b: 600 });
    expect(sumShares(shares)).toBe(1000);
  });

  it('builds percentage shares and normalizes rounding', () => {
    const shares = percentageShares(1000, ['a', 'b', 'c'], { a: '33.33', b: '33.33', c: '33.34' });
    expect(sumShares(shares)).toBe(1000);
  });
});
