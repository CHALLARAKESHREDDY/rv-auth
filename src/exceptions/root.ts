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
  // User-related errors (11xx)
  USER_NOT_FOUND = 1101,
  USER_ALREADY_EXISTS = 1102,
  INCORRECT_PASSWORD = 1103,
  USER_INACTIVE = 1104, // e.g., account inactive or locked

  // OTP-related errors (12xx)
  OTP_NOT_FOUND = 1201,
  OTP_INVALID = 1202,
  OTP_EXPIRED = 1203,
  INCORRECT_OTP = 1204,

  // Authentication/Authorization errors (13xx)
  UNAUTHORIZED = 1301,
  TOKEN_EXPIRED = 1302,
  ACCESS_DENIED = 1303,

  // Client-side validation errors (14xx)
  VALIDATION_ERROR = 1400,
  UNPROCESSABLE_ENTITY = 1401,
  MISSING_REQUIRED_FIELDS = 1402,

  // Server-side errors (15xx)
  INTERNAL_EXCEPTION = 1501,
  SERVICE_UNAVAILABLE = 1502,
  DATABASE_ERROR = 1503,
}

export enum SuccessCode {
  // User-related successes (21xx)
  SIGNUP_SUCCESSFUL = 2101,
  PROFILE_UPDATED = 2102,
  USER_VERIFIED = 2103,

  // OTP-related successes (22xx)
  OTP_SENT_SUCCESSFULLY = 2201,
  OTP_VERIFIED_SUCCESSFULLY = 2202,

  // Authentication/Authorization successes (23xx)
  LOGIN_SUCCESSFUL = 2301,
  LOGOUT_SUCCESSFUL = 2302,
  PASSWORD_RESET_SUCCESSFUL = 2303,
}

