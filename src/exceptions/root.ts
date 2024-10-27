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
  USER_NOT_FOUND = 1000,
  USER_ALREADY_EXISTS = 1001,
  INCORRECT_PASSWORD = 1003,
  UNPROCESSABLEE_ENTITY = 2001,
  INTERNAL_EXCEPTION = 3001,
  OTP_NOT_FOUND = 1002,
  OTP_INVALID = 1002,
  OTP_EXPIRED= 1003,
  UNAUTHORIZED = 1004
}
