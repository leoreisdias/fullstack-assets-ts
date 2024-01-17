interface IResponse<T = any> {
    payload: T;
    statusCode: number;
    message: string;
}

type ErrorResponse = {
  response: {
    data: IResponse;
  };
};


const sanitizeErrorMessage = (
    message: string | undefined | null,
  ): string => {
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
  payloadFallback: unknown = null,
): IResponse => {
  let message = defaultErrorMessage;
  let payload: unknown = payloadFallback;

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
  };
};
