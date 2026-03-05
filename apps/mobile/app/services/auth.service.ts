import { api } from './api';
import { AuthTokensDto, GoogleLoginRequestDto, LoginRequestDto, RegisterRequestDto } from '@fairshare/shared-types';

export const authService = {
  register: async (payload: RegisterRequestDto) => {
    if (__DEV__) {
      console.log('[auth] register payload:', { ...payload, password: '***' });
    }
    return (await api.post<AuthTokensDto>('/auth/register', payload)).data;
  },
  login: async (payload: LoginRequestDto) => {
    if (__DEV__) {
      console.log('[auth] login payload:', { ...payload, password: '***' });
    }
    return (await api.post<AuthTokensDto>('/auth/login', payload)).data;
  },
  google: async (payload: GoogleLoginRequestDto) => {
    if (__DEV__) {
      console.log('[auth] google payload:', payload.email);
    }
    return (await api.post<AuthTokensDto>('/auth/google', payload)).data;
  },
};
