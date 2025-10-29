const defaultErrorMessage = "☹️ Something went wrong. Please try again later.";

const sanitizeErrorMessage = (message: string | undefined | null): string => {
  if (!message) {
    return defaultErrorMessage;
  }

  if (message.toLowerCase().includes("error")) return defaultErrorMessage;
  if (message.toLowerCase().includes("invalid")) return defaultErrorMessage;
  if (message.toLowerCase().includes("unexpected")) return defaultErrorMessage;

  return message;
};


export class HttpError<E = unknown> extends Error {
  readonly status: number;
  readonly payload?: E;
  readonly timestamp: string;
  readonly stack?: string;

  constructor(message: string, opts: { status: number; payload?: E }) {
    super(message);
    this.name = "HttpError";
    this.status = opts.status;
    this.payload = opts.payload;
    this.timestamp = new Date().toISOString();

    // Ensure proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, HttpError);
    }
  }

  /**
   * Creates an HttpError from an unknown error in catch blocks
   * Automatically extracts messages from API responses, Axios errors, etc.
   */
  static fromUnknown(error: unknown, fallbackStatus = 500): HttpError {
    if (isHttpError(error)) {
      return error;
    }

    let message = "An unknown error occurred";
    let status = fallbackStatus;
    let payload: unknown = null;


    // Handle Axios errors specifically
    if (error instanceof AxiosError) {
      message = error.response?.data?.message || defaultErrorMessage;
      payload = error.response?.data?.payload || null;
      status = error.response?.status || fallbackStatus;

      if (Array.isArray(message)) {
        message = defaultErrorMessage;
      }
    }

    // Handle regular Error instances
    else if (error instanceof Error) {
      message = error.message;
      payload = { originalError: error.name };
    }

    // Handle string errors
    else if (typeof error === "string") {
      message = error;
    }

    // Handle other objects that might have a message
    else if (error && typeof error === "object" && "message" in error) {
      message = String((error as any).message);
      payload = error;
    }

    return new HttpError(message, { status, payload });
  }

  /**
   * Serializes the error for logging/debugging
   */
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      status: this.status,
      payload: this.payload,
      timestamp: this.timestamp,
      stack: this.stack,
    };
  }

  /**
   * Creates a user-friendly error message (sanitized)
   */
  getUserMessage(): string {
    return sanitizeErrorMessage(this.message);
  }
}


export function isHttpError<E = unknown>(e: unknown): e is HttpError<E> {
  return e instanceof HttpError;
}

/**
 * DX: Converts ANY error to HttpError automatically
 * Use this in onError callbacks - it handles everything
 */
export function asHttpError(error: unknown): HttpError {
  if (isHttpError(error)) {
    return error;
  }

  // If it's a serialized HttpError from server actions, reconstruct it
  if (error && typeof error === "object") {
    const errorObj = error as any;

    if (errorObj.name === "HttpError" && typeof errorObj.status === "number" && typeof errorObj.message === "string") {
      return new HttpError(errorObj.message, {
        status: errorObj.status,
        payload: errorObj.payload,
      });
    }
  }

  // For everything else, use fromUnknown
  return HttpError.fromUnknown(error);
}

/* USAGE EXAMPLE IN SERVER FUNCTIONS 
```
'use server'

export const doSomething = async (body) => {
  try {
    const { data } = await api.post('', body)

    return data;
  } catch (error) {
    throw HttpError.fromUnknown(error); -> Auto extract from API
  }
};

```
*/

/* USAGE EXAMPLE IN useMutations 
```
 onError: (error) => {
    const httpError = asHttpError(error);
    toast.error(httpError.getUserMessage());
},
```
*/
