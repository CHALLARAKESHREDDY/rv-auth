import { NextFunction, Request, Response } from "express";
import { userUpdateDetailsSchema } from "../schema/auth";
import { prisma } from "../prisma";

export const getUserDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.json(req.user)
};

export const updateUserDetails = async (req:Request, res: Response, next:NextFunction)=>{
    const validatedData=userUpdateDetailsSchema.parse(req.body)
     const updatedUser = await prisma.user.update({
       where: { id: req.user?.id },
       data: validatedData,
     });
    res.json({message:"Updated Sucessfully"})
}