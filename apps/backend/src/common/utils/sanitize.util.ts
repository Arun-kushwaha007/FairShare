export function sanitizeText(value: unknown): string {
  if (typeof value !== 'string') {
    return '';
  }

  return value
    .replace(/[<>]/g, '')
    .replace(/[\u0000-\u001f\u007f]/g, '')
    .trim();
}
