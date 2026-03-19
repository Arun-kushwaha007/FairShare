export function getBackendBaseUrl(): string {
  return process.env.FAIRSHARE_API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api/v1';
}

export function getPublicS3BaseUrl(): string | null {
  return process.env.FAIRSHARE_S3_BASE_URL ?? process.env.NEXT_PUBLIC_S3_BASE_URL ?? null;
}
