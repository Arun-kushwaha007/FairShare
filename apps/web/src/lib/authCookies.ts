export const authCookies = {
  accessToken: 'fairshare_access',
  refreshToken: 'refresh_token',
} as const;

export const accessCookieOptions = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  path: '/',
  maxAge: 15 * 60, // 15 minutes
};

export const refreshCookieOptions = {
  httpOnly: true,
  sameSite: 'strict' as const,
  secure: process.env.NODE_ENV === 'production',
  path: '/',
  maxAge: 7 * 24 * 60 * 60, // 7 days
};

