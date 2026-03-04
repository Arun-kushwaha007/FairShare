export type CurrencyCode = 'USD' | 'EUR' | 'INR';

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

export interface GroupMemberDto {
  id: string;
  userId: string;
  groupId: string;
  role: 'OWNER' | 'MEMBER';
  joinedAt: string;
}

export interface GroupDto {
  id: string;
  name: string;
  currency: CurrencyCode;
  createdBy: string;
  createdAt: string;
  members?: GroupMemberDto[];
}

export interface CreateExpenseSplitDto {
  userId: string;
  owedAmountCents: string;
  paidAmountCents: string;
}

export interface CreateExpenseRequestDto {
  payerId: string;
  description: string;
  totalAmountCents: string;
  currency: CurrencyCode;
  splits: CreateExpenseSplitDto[];
}

export interface UpdateExpenseRequestDto {
  description?: string;
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
  createdAt: string;
  splits?: SplitDto[];
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

export type ActivityType =
  | 'expense_created'
  | 'expense_updated'
  | 'expense_deleted'
  | 'settlement_created'
  | 'member_joined'
  | 'member_invited';

export interface ActivityDto {
  id: string;
  groupId: string;
  actorUserId: string;
  type: ActivityType;
  entityId: string;
  metadata: Record<string, unknown>;
  createdAt: string;
}

export interface RegisterPushTokenRequestDto {
  token: string;
  deviceType: 'ios' | 'android' | 'web';
}
