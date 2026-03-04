import { api } from './api';

export const userService = {
  registerPushToken: async (token: string, deviceType: 'ios' | 'android' | 'web') =>
    (await api.post('/users/push-token', { token, deviceType })).data,
};
