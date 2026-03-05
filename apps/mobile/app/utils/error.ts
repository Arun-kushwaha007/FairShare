import axios from 'axios';

export function getErrorMessage(error: unknown, fallback: string): string {
  if (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as { message?: unknown }).message === 'string'
  ) {
    return (error as { message: string }).message;
  }

  if (axios.isAxiosError(error)) {
    const apiMessage = (error.response?.data as { message?: string | string[] } | undefined)?.message;
    if (typeof apiMessage === 'string' && apiMessage.length > 0) {
      return apiMessage;
    }
    if (Array.isArray(apiMessage) && apiMessage.length > 0) {
      const first = apiMessage[0];
      if (typeof first === 'string' && first.length > 0) {
        return first;
      }
    }
    if (typeof error.message === 'string' && error.message.length > 0) {
      return error.message;
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}
