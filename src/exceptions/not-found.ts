import { ErrorCode, RootException } from "./root";

export class NotFoundException extends RootException {
  constructor(message: string, errorCode: ErrorCode) {
    super(message, 404, null, errorCode);
  }
}
