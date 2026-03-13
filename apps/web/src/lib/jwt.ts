type JwtPayload = { exp?: number };

function base64UrlToBase64(input: string): string {
  const base64 = input.replace(/-/g, '+').replace(/_/g, '/');
  const pad = base64.length % 4 === 0 ? '' : '='.repeat(4 - (base64.length % 4));
  return `${base64}${pad}`;
}

export function getJwtExpiryMs(token: string): number | null {
  const parts = token.split('.');
  if (parts.length < 2) {
    return null;
  }
  try {
    const payloadRaw = atob(base64UrlToBase64(parts[1] ?? ''));
    const payload = JSON.parse(payloadRaw) as JwtPayload;
    if (typeof payload.exp !== 'number') {
      return null;
    }
    return payload.exp * 1000;
  } catch {
    return null;
  }
}

export function isJwtExpiringSoon(token: string, withinMs: number): boolean {
  const expMs = getJwtExpiryMs(token);
  if (!expMs) {
    return false;
  }
  return expMs - Date.now() < withinMs;
}

