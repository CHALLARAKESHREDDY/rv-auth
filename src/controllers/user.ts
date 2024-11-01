import { NextFunction, Request, Response } from "express";
import { userUpdateDetailsSchema } from "../schema/auth";
import { prismaClient } from '../index';

export const getUserDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.json(req.user)
};

export const updateUserDetails = async (req:Request, res: Response, next:NextFunction)=>{
    const validatedData=userUpdateDetailsSchema.parse(req.body)
    // Update the user in the database
     const updatedUser = await prismaClient.user.update({
       where: { id: req.user?.id },
       data: validatedData,
     });
    res.json({message:"Updated Sucessfully"})
}