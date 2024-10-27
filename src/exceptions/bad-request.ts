import { ErrorCode, RootException } from "./root";

export class BadRequestException extends RootException{
  constructor(message: string, errorCode:ErrorCode) {
    super(message, 400, null, errorCode )
  }
    
}