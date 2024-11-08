import { NextFunction, Request, Response } from "express";
import { RootException } from "../exceptions/root";


export const errorMiddleware = (error:RootException, req:Request, res:Response, next:NextFunction)=>{
  res.status(error.statusCode).json({
    message: error.message,
    errorCode: error.errorCode,
    errors: error.errors,
  });

} 

