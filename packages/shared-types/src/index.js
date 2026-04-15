"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RECURRING_EXPENSE_FREQUENCIES = exports.EXPENSE_SPLIT_TYPES = exports.EXPENSE_CATEGORIES = void 0;
exports.formatCurrencyFromCents = formatCurrencyFromCents;
const CURRENCY_SYMBOLS = {
    USD: '$',
    EUR: '€',
    INR: '₹',
};
/**
 * Normalize and validate an integer cents input into a canonical representation.
 *
 * @param amountCents - The cents value to normalize; may be a `bigint`, a `number` (must be an integer), or a `string` (may include surrounding whitespace and must represent an integer).
 * @returns The normalized integer cents value as a trimmed string.
 * @throws Error('Currency formatter expects whole cents.') if a `number` is not an integer.
 * @throws Error('Currency formatter expects a valid integer string.') if a `string` does not represent a valid integer after trimming.
 */
function normalizeCentsInput(amountCents) {
    if (typeof amountCents === 'bigint') {
        return amountCents.toString();
    }
    if (typeof amountCents === 'number') {
        if (!Number.isInteger(amountCents)) {
            throw new Error('Currency formatter expects whole cents.');
        }
        return String(amountCents);
    }
    const trimmed = amountCents.trim();
    if (!/^-?\d+$/.test(trimmed)) {
        throw new Error('Currency formatter expects a valid integer string.');
    }
    return trimmed;
}
/**
 * Formats an integer-cent amount into a currency string with symbol, thousands separators, and two decimal places.
 *
 * @param amountCents - The amount in cents provided as a `bigint`, integer `number`, or integer `string` (may include a leading `-` for negative amounts). Strings may include surrounding whitespace.
 * @param currency - The currency code whose symbol will prefix the formatted output (defaults to `'USD'`).
 * @returns The formatted currency string, preserving a leading `-` for negative values, using `,` as the thousands separator and exactly two digits after the decimal point (e.g., `-$1,234.56`).
 */
function formatCurrencyFromCents(amountCents, currency = 'USD') {
    const normalized = normalizeCentsInput(amountCents);
    const negative = normalized.startsWith('-');
    const digits = negative ? normalized.slice(1) : normalized;
    const safeDigits = digits.replace(/^0+(?=\d)/, '') || '0';
    const padded = safeDigits.padStart(3, '0');
    const whole = padded.slice(0, -2);
    const fraction = padded.slice(-2);
    const groupedWhole = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    const symbol = CURRENCY_SYMBOLS[currency];
    return `${negative ? '-' : ''}${symbol}${groupedWhole}.${fraction}`;
}
exports.EXPENSE_CATEGORIES = [
    'FOOD',
    'TRAVEL',
    'UTILITIES',
    'GROCERIES',
    'ENTERTAINMENT',
    'OTHER',
];
exports.EXPENSE_SPLIT_TYPES = ['equal', 'exact', 'percentage'];
exports.RECURRING_EXPENSE_FREQUENCIES = ['daily', 'weekly', 'monthly'];
//# sourceMappingURL=index.js.map