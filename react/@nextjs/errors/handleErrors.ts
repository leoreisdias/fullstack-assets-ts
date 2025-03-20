import axios from "axios";
import { Failure } from "../types/response";

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

export const handleError = (
  error: unknown,
  fallbackMessage?: string
): Failure<unknown> => {
  // console.error("Server Action Error:", JSON.stringify(error), (error as any)?.response?.data);
  let message = fallbackMessage || defaultErrorMessage;
  let status =
    (error as any)?.response?.status ?? (error as any)?.status ?? 400;

  if (axios.isAxiosError(error)) {
    message = error?.response?.data?.message || defaultErrorMessage;
    status = error?.response?.status || 400;

    if (Array.isArray(message)) message = defaultErrorMessage;
  }

  if (error instanceof Response) {
    message = error.statusText || defaultErrorMessage;
    status = error.status || 400;
  }

  return {
    message: sanitizeErrorMessage(message),
    statusCode: status,
    payload: null,
    error: sanitizeError(error),
    ok: false,
  };
};
