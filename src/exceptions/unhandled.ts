import { ErrorCode, RootException } from "./root";

export  class  InternalException extends RootException{
  constructor(message: string, error: any, errorCode:ErrorCode) {
      super(message, 500, error, errorCode )
  }
}