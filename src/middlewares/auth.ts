import { NextFunction, Request, Response } from "express";
import { UnAuthorizedException } from "../exceptions/unauthorized";
import { ErrorCode } from "../exceptions/root";
import * as jwt from "jsonwebtoken";
import { SECRET_KEY } from "../secrets";
import { prisma } from "../prisma";

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization;
  if (!token) {
    return next(new UnAuthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED));
  }
  try {
    const payload = jwt.verify(token, SECRET_KEY) as { phoneNumber: string };
    const user = await prisma.users.findUnique({
      where: { phoneNumber: payload.phoneNumber },
    });
    if (!user) {
      return next(
        new UnAuthorizedException(
          "Unauthorized access: User not found",
          ErrorCode.UNAUTHORIZED
        )
      );
    }
    req.user= user;
    return next();
  } catch (err) {
    return next(
      new UnAuthorizedException(
        "Unauthorized access: Invalid or expired token",
        ErrorCode.UNAUTHORIZED
      )
    );
  }
};

export default authMiddleware;
