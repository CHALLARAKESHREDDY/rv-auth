import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { RootException, ErrorCode } from "./exceptions/root";
import { InternalException } from "./exceptions/unhandled";
import { UnprocessableEntity } from "./exceptions/validation";

export const errorHandler = (
  method: (req: Request, res: Response, next: NextFunction) => Promise<void>
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await method(req, res, next);
    } catch (err) {
        console.log(err)
      let exception: RootException;

      if (err instanceof ZodError) {
        exception = new UnprocessableEntity(
          "Validation error",
          err.issues[0].path,
          ErrorCode.UNPROCESSABLE_ENTITY
        );
      } else if (err instanceof RootException) {
        exception = err;
      } else {
        exception = new InternalException(
          "INTERNAL SERVER ERROR",
          err,
          ErrorCode.INTERNAL_EXCEPTION
        );
      }

      next(exception);
    }
  };
};
