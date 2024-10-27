import { ErrorCode, RootException } from "./root"

export class UnprocessableEntity extends RootException {
  constructor(message: string, error: any, errorCode: ErrorCode) {
    super(message, 422, error, errorCode);
  }
}