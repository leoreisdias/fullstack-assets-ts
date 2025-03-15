import { TResponse } from '@/app/types/responses';

type ErrorResponse = {
  response: {
    data: TResponse;
  };
};

const sanitizeErrorMessage = (message: string | undefined | null): string => {
  if (!message) {
    return defaultErrorMessage;
  }

  if (message.toLowerCase().includes('error')) return defaultErrorMessage;
  if (message.toLowerCase().includes('invalid')) return defaultErrorMessage;

  return message;
};

const defaultErrorMessage = 'Ops... ☹️';

export const handleAPIError = (
  error: unknown,
  fallbackMessage?: string,
): TResponse & {
  isSuccess: false;
} => {
  console.error(
    'Server Action Error:',
    JSON.stringify(error),
    (error as any)?.response?.data,
  );
  let message = fallbackMessage || defaultErrorMessage;
  let payload: unknown = null;

  if (error && typeof error === 'object' && 'response' in error) {
    message =
      (error as ErrorResponse)?.response?.data?.message || defaultErrorMessage;
    payload = (error as ErrorResponse)?.response?.data?.payload || null;

    if (Array.isArray(message)) message = defaultErrorMessage;
  }

  return {
    message: sanitizeErrorMessage(message),
    statusCode: 400,
    payload: payload,
    isSuccess: false,
  };
};
