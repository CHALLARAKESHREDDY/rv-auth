import { Request, Response } from "express";
import { prismaClient } from "..";
import otpGenerator from "otp-generator";
import { hashSync, compareSync } from "bcrypt";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../secrets";
import { BadRequestException } from "../exceptions/bad-request";
import { ErrorCode } from "../exceptions/root";
import {
  LoginSchema,
  LoginVerifySchema,
  SignupSchema,
  SignupVerifySchema,
} from "../schema/auth";
import { NotFoundException } from "../exceptions/not-found";

export const signup = async (req: Request, res: Response) => {
  // Validate input data using SignupSchema
  SignupSchema.parse(req.body);
  
  const { phoneNumber, email } = req.body;

  // Check if the user already exists
  const user = await prismaClient.user.findFirst({
    where: {
      OR: [{ email }, { phoneNumber }],
    },
  });
  if (user) {
    throw new BadRequestException(
      "User already exists!",
      ErrorCode.USER_ALREADY_EXISTS
    );
  }

  // Remove any existing OTPs for the phone number
  await prismaClient.otp.deleteMany({
    where: { phoneNumber },
  });

  // Generate and hash a new OTP
  const generatedOtp = otpGenerator.generate(4, {
    upperCaseAlphabets: false,
    specialChars: false,
    lowerCaseAlphabets: false,
  });
  console.log("Generated OTP:", generatedOtp);

  // Save the OTP in the database
  await prismaClient.otp.create({
    data: {
      hashedOtp: hashSync(generatedOtp, 10),
      phoneNumber: phoneNumber,
    },
  });

  // Send a success response
  res.json({ message: "OTP sent successfully" });
};


export const login = async (req: Request, res: Response) => {
  // Validate the request body using LoginSchema
  LoginSchema.parse(req.body);

  const { phoneNumber } = req.body;

  // Check if the user exists
  const user = await prismaClient.user.findUnique({
    where: { phoneNumber },
  });

  if (!user) {
    throw new NotFoundException("User Not Found!", ErrorCode.USER_NOT_FOUND);
  }

  // Delete any existing OTP for this phone number
  /*await prismaClient.otp.delete({
    where: { phoneNumber },
  });*/

  // Generate a new OTP
  const generatedOtp = otpGenerator.generate(4, {
    upperCaseAlphabets: false,
    specialChars: false,
    lowerCaseAlphabets: false,
  });

  console.log("Generated OTP:", generatedOtp); // Consider removing in production

  // Save the OTP to the database
  await prismaClient.otp.create({
    data: {
      hashedOtp: hashSync(generatedOtp, 10),
      phoneNumber,
    },
  });

  // Send success response
  res.json({ message: "OTP sent successfully" });
};


const OTP_EXPIRATION_MINUTES = 4;

export const signupVerifyOtp = async (req: Request, res: Response) => {
  // Validate request body with Zod schema
  SignupVerifySchema.parse(req.body);

  const { name, phoneNumber, email, occupation, otp } = req.body;

  // Find stored OTP for the provided phone number
  const storedOtp = await prismaClient.otp.findUnique({
    where: { phoneNumber },
  });

  console.log(storedOtp)

  if (!storedOtp) {
    throw new NotFoundException("OTP Not Found!", ErrorCode.OTP_NOT_FOUND);
  }

  // Check OTP expiration
  const createdAt = new Date(storedOtp.createdAt);
  const differenceInMinutes = Math.floor(
    (Date.now() - createdAt.getTime()) / 60000
  );

  if (differenceInMinutes > OTP_EXPIRATION_MINUTES) {
    await prismaClient.otp.delete({ where: { phoneNumber } });
    throw new NotFoundException("OTP Expired", ErrorCode.OTP_EXPIRED);
  }

  // Verify OTP
  if (!compareSync(otp, storedOtp.hashedOtp)) {
    throw new BadRequestException("Invalid OTP", ErrorCode.OTP_INVALID);
  }

  // Create user
  const user = await prismaClient.user.create({
    data: { name, phoneNumber, email, occupation },
  });

  // Generate JWT token
  const token = jwt.sign({ phoneNumber }, SECRET_KEY);

  res.json({ message: "Signup Successful", jwt: token });
};

export const loginVerifyOtp = async (req: Request, res: Response) => {
  // Validate request body
  LoginVerifySchema.parse(req.body);

  const { phoneNumber, otp } = req.body;

  // Fetch stored OTP by phone number
  const storedOtp = await prismaClient.otp.findUnique({
    where: { phoneNumber },
  });

  if (!storedOtp) {
    throw new NotFoundException("OTP Not Found!", ErrorCode.OTP_NOT_FOUND);
  }
  // Check OTP expiration
  const createdAt = new Date(storedOtp.createdAt);
  const differenceInMinutes = Math.floor(
    (Date.now() - createdAt.getTime()) / 60000
  );

  if (differenceInMinutes > OTP_EXPIRATION_MINUTES) {
    await prismaClient.otp.delete({ where: { phoneNumber } });
    throw new NotFoundException("OTP Expired", ErrorCode.OTP_EXPIRED);
  }

  // Validate OTP
  if (!compareSync(otp, storedOtp.hashedOtp)) {
    throw new BadRequestException("Invalid OTP", ErrorCode.OTP_INVALID);
  }

  // OTP is valid; delete it and create JWT token
  await prismaClient.otp.delete({ where: { phoneNumber } });
  const token = jwt.sign({ phoneNumber }, SECRET_KEY);

  res.json({ message: "Login Successful", jwt: token });
};