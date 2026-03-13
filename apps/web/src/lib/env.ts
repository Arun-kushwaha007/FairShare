export function getBackendBaseUrl(): string {
  // Prefer a non-public env var for server-side calls.
  return (
    process.env.FAIRSHARE_API_URL ??
    process.env.NEXT_PUBLIC_API_URL ??
    // Keep parity with existing web client default.
    'http://localhost:3001/api/v1'
  );
}

