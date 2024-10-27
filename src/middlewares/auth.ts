import { NextFunction, Request, Response } from "express";
import { UnAuthorizedException } from "../exceptions/unauthorized";
import { ErrorCode } from "../exceptions/root";
import * as jwt from "jsonwebtoken";
import { SECRET_KEY } from "../secrets";
import { prismaClient } from "..";

const authMiddleware = async (req: Request, res: Response, next:NextFunction) => {
  const token = req.headers.authorization;
  if (!token) {
    throw new UnAuthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED);
  }
  try {
    const payload = jwt.verify(token, SECRET_KEY) as { phoneNumber: string };
    const user = await prismaClient.user.findFirst({
      where: {
        phoneNumber: payload.phoneNumber,
      },
    });
    if (!user) {
      throw new UnAuthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED);
    }
   
      req.user = user
      next()
  } catch (err) {
    throw new UnAuthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED);
  }
};

export default authMiddleware
