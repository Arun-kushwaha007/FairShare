export type CurrencyCode = 'USD' | 'EUR' | 'INR';
const CURRENCY_SYMBOLS: Record<CurrencyCode, string> = {
  USD: '$',
  EUR: '€',
  INR: '₹',
};

/**
 * Normalize a cents amount input into a trimmed string representing whole cents.
 *
 * @param amountCents - A `bigint`, `number`, or `string` representing cents. If a `number`, it must be an integer; if a `string`, surrounding whitespace will be trimmed.
 * @returns The normalized string representation of whole cents.
 * @throws Error if `amountCents` is a `number` that is not an integer.
 */
function normalizeCentsInput(amountCents: bigint | number | string): string {
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
    throw new Error('Currency formatter expects an integer-cent string.');
  }
  return trimmed;
}

/**
 * Format a whole-cents monetary value into a currency string with symbol, thousands separators, and two decimal places.
 *
 * @param amountCents - The amount in whole cents (`bigint | number | string`). If a `number` is provided it must be an integer; `string` inputs are trimmed.
 * @param currency - The target currency code used to pick the symbol (defaults to `'USD'`).
 * @returns The formatted currency string including the currency symbol, grouped thousands, a decimal point, and exactly two fractional digits; a leading `-` is preserved for negative values.
 * @throws If `amountCents` is a `number` that is not an integer.
 */
export function formatCurrencyFromCents(amountCents: bigint | number | string, currency: CurrencyCode = 'USD'): string {
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

export const EXPENSE_CATEGORIES = [
  'FOOD',
  'TRAVEL',
  'UTILITIES',
  'GROCERIES',
  'ENTERTAINMENT',
  'OTHER',
] as const;
export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number];
export const EXPENSE_SPLIT_TYPES = ['equal', 'exact', 'percentage'] as const;
export type ExpenseSplitType = (typeof EXPENSE_SPLIT_TYPES)[number];
export const RECURRING_EXPENSE_FREQUENCIES = ['daily', 'weekly', 'monthly'] as const;
export type RecurringExpenseFrequency = (typeof RECURRING_EXPENSE_FREQUENCIES)[number];

export interface AuthUserDto {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
}

export interface RegisterRequestDto {
  email: string;
  password: string;
  name: string;
}

export interface LoginRequestDto {
  email: string;
  password: string;
}

export interface GoogleLoginRequestDto {
  email: string;
  name: string;
  avatarUrl?: string;
}

export interface AuthTokensDto {
  accessToken: string;
  refreshToken: string;
  user: AuthUserDto;
}

export interface CreateGroupRequestDto {
  name: string;
  currency: CurrencyCode;
}

export interface InviteMemberRequestDto {
  email: string;
}

export interface RemindSettlementRequestDto {
  payerId: string;
  receiverId: string;
  amountCents: string;
}

export interface RemindSettlementResponseDto {
  success: true;
  activity: ActivityDto;
}

export interface GroupMemberDto {
  id: string;
  userId: string;
  groupId: string;
  role: 'OWNER' | 'MEMBER';
  joinedAt: string;
}

export interface GroupMemberSummaryDto {
  memberId: string;
  userId: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  role: 'OWNER' | 'MEMBER';
}

export interface GroupSummaryDto {
  totalExpensesCents: string;
  totalSettledCents: string;
  perUserSpentCents: Record<string, string>;
  perUserOwedCents: Record<string, string>;
  largestExpenseCents: string | null;
  lastExpenseCents: string | null;
  topSpenderUserId: string | null;
}

export interface GroupDashboardItemDto {
  groupId: string;
  groupName: string;
  currency: CurrencyCode;
  memberCount: number;
  netBalanceCents: string;
  settlementCount: number;
  dueRecurringCount: number;
  pendingActionCount: number;
}

export interface GroupDashboardDto {
  totalBalanceCents: string;
  activeGroupCount: number;
  groups: Array<{
    id: string;
    name: string;
    currency: CurrencyCode;
  }>;
  attentionItems: GroupDashboardItemDto[];
}

export interface GroupDefaultSplitDto {
  splitType: ExpenseSplitType;
  participantUserIds: string[];
  exactAmountsCentsByUser?: Record<string, string>;
  percentagesByUser?: Record<string, string>;
}

export interface GroupDto {
  id: string;
  name: string;
  currency: CurrencyCode;
  createdBy: string;
  createdAt: string;
  shareEnabled: boolean;
  shareToken?: string | null;
  defaultSplitPreference?: GroupDefaultSplitDto | null;
  members?: GroupMemberDto[];
}

export interface CreateExpenseSplitDto {
  userId: string;
  owedAmountCents: string;
  paidAmountCents: string;
}

export interface RecurringExpenseConfigDto {
  frequency: RecurringExpenseFrequency;
}

export interface CreateExpenseRequestDto {
  payerId: string;
  description: string;
  totalAmountCents: string;
  currency: CurrencyCode;
  category?: ExpenseCategory;
  recurring?: RecurringExpenseConfigDto;
  splits: CreateExpenseSplitDto[];
}

export interface UpdateExpenseRequestDto {
  description?: string;
  category?: ExpenseCategory | null;
}

export interface UpdateRecurringExpenseRequestDto {
  description?: string;
  totalAmountCents?: string;
  category?: ExpenseCategory | null;
  frequency?: RecurringExpenseFrequency;
}

export interface SplitDto {
  id: string;
  userId: string;
  owedAmountCents: string;
  paidAmountCents: string;
}

export interface ExpenseDto {
  id: string;
  groupId: string;
  payerId: string;
  description: string;
  totalAmountCents: string;
  currency: CurrencyCode;
  category?: ExpenseCategory | null;
  receiptFileKey?: string | null;
  createdAt: string;
  splits?: SplitDto[];
}

export interface RecurringExpenseDto {
  id: string;
  groupId: string;
  payerId: string;
  createdBy: string;
  description: string;
  totalAmountCents: string;
  currency: CurrencyCode;
  category?: ExpenseCategory | null;
  frequency: RecurringExpenseFrequency;
  nextOccurrenceAt: string;
  lastGeneratedAt?: string | null;
  active: boolean;
  createdAt: string;
  splits: CreateExpenseSplitDto[];
}

export interface PaginatedExpensesResponseDto {
  items: ExpenseDto[];
  nextCursor: number | null;
}

export interface BalanceDto {
  id: string;
  groupId: string;
  userId: string;
  counterpartyUserId: string;
  amountCents: string;
}

export interface CreateSettlementRequestDto {
  payerId: string;
  receiverId: string;
  amountCents: string;
}

export interface SettlementDto {
  id: string;
  groupId: string;
  payerId: string;
  receiverId: string;
  amountCents: string;
  createdAt: string;
}

export interface PresignedReceiptUrlResponseDto {
  uploadUrl: string;
  fileKey: string;
}

export interface SimplifySuggestionDto {
  fromUserId: string;
  toUserId: string;
  amountCents: string;
}

export interface UpdateGroupDefaultSplitRequestDto {
  defaultSplitPreference: GroupDefaultSplitDto | null;
}

export type ActivityType =
  | 'expense_created'
  | 'expense_updated'
  | 'expense_deleted'
  | 'settlement_created'
  | 'settlement_reminder'
  | 'member_joined'
  | 'member_invited';

export interface ActivityDto {
  id: string;
  groupId: string;
  actorUserId: string;
  actorName?: string;
  groupName?: string;
  type: ActivityType;
  entityId: string;
  metadata: Record<string, unknown>;
  createdAt: string;
}

export interface RegisterPushTokenRequestDto {
  token: string;
  deviceType: 'ios' | 'android' | 'web';
}

export interface CreatePaymentIntentRequestDto {
  groupId: string;
  payerId: string;
  receiverId: string;
  amountCents: string;
  currency: CurrencyCode;
}

export interface CreatePaymentIntentResponseDto {
  paymentId: string;
  clientSecret: string;
  paymentIntentId: string;
}
