import { api } from './api';
import { AuthTokensDto, GoogleLoginRequestDto, LoginRequestDto, RegisterRequestDto } from '@fairshare/shared-types';

export const authService = {
  register: async (payload: RegisterRequestDto) => (await api.post<AuthTokensDto>('/auth/register', payload)).data,
  login: async (payload: LoginRequestDto) => (await api.post<AuthTokensDto>('/auth/login', payload)).data,
  google: async (payload: GoogleLoginRequestDto) => (await api.post<AuthTokensDto>('/auth/google', payload)).data,
};
