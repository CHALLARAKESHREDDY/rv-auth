import { ErrorCode, RootException } from "./root";

export class UnAuthorizedException extends RootException {
  constructor(message: string, errorCode: ErrorCode) {
    super(message, 401, null, errorCode);
  }
}
