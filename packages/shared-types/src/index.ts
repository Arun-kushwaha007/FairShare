export interface LoginRequestDto {
  email: string;
  password: string;
}

export interface RegisterRequestDto {
  email: string;
  name: string;
  password: string;
}

export interface AuthUserDto {
  id: string;
  email: string;
  name: string;
}

export interface AuthTokensResponseDto {
  accessToken: string;
  user: AuthUserDto;
}

export interface GroupDto {
  id: string;
  name: string;
}

export interface ExpenseDto {
  id: string;
  groupId: string;
  description: string;
  amountCents: string;
  paidByUserId: string;
}
