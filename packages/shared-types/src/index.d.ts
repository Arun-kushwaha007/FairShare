export type CurrencyCode = 'USD' | 'EUR' | 'INR';
/**
 * Formats an integer-cent amount into a currency string with symbol, thousands separators, and two decimal places.
 *
 * @param amountCents - The amount in cents provided as a `bigint`, integer `number`, or integer `string` (may include a leading `-` for negative amounts). Strings may include surrounding whitespace.
 * @param currency - The currency code whose symbol will prefix the formatted output (defaults to `'USD'`).
 * @returns The formatted currency string, preserving a leading `-` for negative values, using `,` as the thousands separator and exactly two digits after the decimal point (e.g., `-$1,234.56`).
 */
export declare function formatCurrencyFromCents(amountCents: bigint | number | string, currency?: CurrencyCode): string;
export declare const EXPENSE_CATEGORIES: readonly ["FOOD", "TRAVEL", "UTILITIES", "GROCERIES", "ENTERTAINMENT", "OTHER"];
export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number];
export declare const EXPENSE_SPLIT_TYPES: readonly ["equal", "exact", "percentage"];
export type ExpenseSplitType = (typeof EXPENSE_SPLIT_TYPES)[number];
export declare const RECURRING_EXPENSE_FREQUENCIES: readonly ["daily", "weekly", "monthly"];
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
export type ActivityType = 'expense_created' | 'expense_updated' | 'expense_deleted' | 'settlement_created' | 'settlement_reminder' | 'member_joined' | 'member_invited';
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
