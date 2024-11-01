//Message ErrorCode statusCode error

export class RootException extends Error {
  message: string;
  statusCode: number;
  errors: any;
  errorCode:ErrorCode;

  constructor(message: string, statusCode: number, error: any, errorCode: ErrorCode) {
    super(message);
    this.message=message
    this.statusCode = statusCode;
    this.errors = error;
    this.errorCode = errorCode;
  }
}

export enum ErrorCode {
  USER_NOT_FOUND = 1101, // User related errors start with 11
  USER_ALREADY_EXISTS = 1102,
  INCORRECT_PASSWORD = 1103,
  OTP_NOT_FOUND = 1201, // OTP related errors start with 12
  OTP_INVALID = 1202,
  OTP_EXPIRED = 1203,
  UNAUTHORIZED = 1301, // Authentication/authorization errors start with 13
  UNPROCESSABLE_ENTITY = 1401, // Client-side validation errors start with 14
  INTERNAL_EXCEPTION = 1501, // Server-side errors start with 15
}

