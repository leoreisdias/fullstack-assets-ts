import axios from "axios";
import { Failure } from "../@types/response";

const sanitizeErrorMessage = (message: string | undefined | null): string => {
  if (!message) {
    return defaultErrorMessage;
  }

  const lowerMessage = message.toLowerCase();

  const blockedKeywords = [
    "error",
    "invalid",
    "unexpected",
    "prisma",
    "sql",
    "database",
    "failed",
    "unauthorized",
  ];

  if (blockedKeywords.some((word) => lowerMessage.includes(word))) {
    return defaultErrorMessage;
  }

  return message;
};

const defaultErrorMessage = "☹️ Something went wrong. Please try again later.";

const sanitizeError = (error: unknown) => {
  if (!error || typeof error !== "object") return null;

  if (axios.isAxiosError(error)) {
    return {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      url: error.config?.url,
    };
  }

  if (error instanceof Error) {
    return {
      message: error.message,
      name: error.name,
    };
  }

  return null; // Se não for um erro conhecido, retorna null
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
    if (error instanceof HttpError) {
      return error;
    }

    let message = "An unknown error occurred";
    let status = fallbackStatus;
    let payload: unknown = null;

    // Handle API response errors (like your existing handleAPIError logic)
    if (error && typeof error === "object" && "response" in error) {
      const apiError = error as ErrorResponse;
      message = apiError?.response?.data?.message || defaultErrorMessage;
      payload = apiError?.response?.data?.payload || null;
      status = apiError?.response?.data?.statusCode || fallbackStatus;

      if (Array.isArray(message)) {
        message = defaultErrorMessage;
      }
    }

    // Handle Axios errors specifically
    else if (error instanceof AxiosError) {
      message = error.response?.data?.message || defaultErrorMessage;
      payload = error.response?.data?.payload || null;
      status = error.response?.status || fallbackStatus;
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
   * Creates an HttpError directly from an API response
   * Useful when you want to throw an error from a successful API call that contains an error
   */
  static fromAPIResponse(response: TResponse, fallbackStatus = 400): HttpError {
    return new HttpError(response.message, {
      status: response.statusCode || fallbackStatus,
      payload: response.payload,
    });
  }

  /**
   * Creates a standardized error response compatible with your TResponse type
   */
  toResponse(): TResponse {
    return {
      message: this.message,
      statusCode: this.status,
      payload: this.payload,
      ok: false,
    };
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
  return (
    e instanceof HttpError ||
    (!!e &&
      typeof e === "object" &&
      "name" in e &&
      "status" in e &&
      "timestamp" in e &&
      (e as any).name === "HttpError" &&
      typeof (e as any).status === "number")
  );
}

