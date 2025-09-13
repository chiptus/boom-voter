import type { SoundCloudErrorResponse } from "./schemas.ts";

export interface SoundCloudErrorDetails {
  status: number;
  statusText: string;
  url: string;
  endpoint: string;
  body: string;
  parsedError?: SoundCloudErrorResponse | null;
}

export class SoundCloudAPIError extends Error {
  public readonly details: SoundCloudErrorDetails;

  constructor(message: string, details: SoundCloudErrorDetails) {
    super(message);
    this.name = "SoundCloudAPIError";
    this.details = details;
  }
}

export function isSoundCloudAPIError(
  error: unknown,
): error is SoundCloudAPIError {
  return error instanceof SoundCloudAPIError;
}

export function getErrorContext(error: unknown) {
  return {
    timestamp: new Date().toISOString(),
    error:
      error instanceof Error
        ? {
            message: error.message,
            name: error.name,
            stack: error.stack,
            details: isSoundCloudAPIError(error) ? error.details : undefined,
          }
        : String(error),
  };
}

export function determineErrorResponse(error: unknown) {
  let userMessage = "Unable to fetch SoundCloud content";
  let statusCode = 500;
  let errorCode = "INTERNAL_ERROR";

  if (error instanceof Error) {
    userMessage = error.message;

    // Set appropriate status codes for different error types
    if (error.message.includes("not found")) {
      statusCode = 404;
      errorCode = "CONTENT_NOT_FOUND";
    } else if (error.message.includes("authentication")) {
      statusCode = 503;
      errorCode = "SERVICE_CONFIG_ERROR";
    } else if (error.message.includes("access denied")) {
      statusCode = 403;
      errorCode = "ACCESS_DENIED";
    }
  }

  return { userMessage, statusCode, errorCode };
}
