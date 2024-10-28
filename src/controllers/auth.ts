import { Request, Response } from "express";
import { prismaClient } from "..";
import otpGenerator from "otp-generator";
import { hash, compare } from "bcrypt";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../secrets";
import { BadRequestException } from "../exceptions/bad-request";
import { ErrorCode } from "../exceptions/root";
import {
  LoginVerifySchema,
  SignupSchema,
  SignupVerifySchema,
} from "../schema/auth";
import { NotFoundException } from "../exceptions/not-found";

const OTP_EXPIRATION_MINUTES = 4;

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

  // Generate and hash a new OTP
  const generatedOtp = otpGenerator.generate(4, {
    upperCaseAlphabets: false,
    specialChars: false,
    lowerCaseAlphabets: false,
  });
  console.log("Generated OTP:", generatedOtp);

  const hashedOtp = await hash(generatedOtp, 10);

  // Save the OTP in the database
  await prismaClient.otp.create({
    data: {
      hashedOtp: hashedOtp,
      phoneNumber: phoneNumber,
    },
  });

  // Send a success response
  res.json({ message: "OTP sent successfully" });
};



export const login = async (req: Request, res: Response) => {
  const { phoneNumber } = req.body;

  // Check if the user exists
  const user = await prismaClient.user.findUnique({
    where: { phoneNumber },
  });

  if (!user) {
    throw new NotFoundException("User Not Found!", ErrorCode.USER_NOT_FOUND);
  }

  // Generate a new OTP
  const generatedOtp = otpGenerator.generate(4, {
    upperCaseAlphabets: false,
    specialChars: false,
    lowerCaseAlphabets: false,
  });

  console.log("Generated OTP:", generatedOtp); // Consider removing in production

  const hashedOtp = await hash(generatedOtp, 10);

  // Save the OTP to the database
  await prismaClient.otp.create({
    data: {
      hashedOtp: hashedOtp,
      phoneNumber,
    },
  });

  // Send success response
  res.json({ message: "OTP sent successfully" });
};




export const signupVerifyOtp = async (req: Request, res: Response) => {
  // Validate request body with Zod schema
  SignupVerifySchema.parse(req.body);

  const { name, phoneNumber, email, occupation, otp } = req.body;

  // Find stored OTP for the provided phone number
  const storedOtp = await prismaClient.otp.findFirst({
    where: { phoneNumber },
    orderBy: {
      createdAt: "desc", // Orders by the newest OTP first
    },
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
    throw new NotFoundException("OTP Expired", ErrorCode.OTP_EXPIRED);
  }

  // Verify OTP using async compare
  const isValidOtp = await compare(otp, storedOtp.hashedOtp);

  // Verify OTP
  if (!isValidOtp) {
    throw new BadRequestException("Invalid OTP", ErrorCode.OTP_INVALID);
  }

  // Create user
  const user = await prismaClient.user.create({
    data: { name, phoneNumber, email, occupation },
  });

  // Delete all OTPs after successful signup
  await prismaClient.otp.deleteMany({ where: { phoneNumber } });

  // Generate JWT token
  const token = jwt.sign({ phoneNumber }, SECRET_KEY);

  res.json({ message: "Signup Successful", jwt: token });
};




export const loginVerifyOtp = async (req: Request, res: Response) => {
  // Validate request body
  LoginVerifySchema.parse(req.body);

  const { phoneNumber, otp } = req.body;

  // Find stored OTP for the provided phone number
  const storedOtp = await prismaClient.otp.findFirst({
    where: { phoneNumber },
    orderBy: {
      createdAt: "desc", // Orders by the newest OTP first
    },
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
    throw new NotFoundException("OTP Expired", ErrorCode.OTP_EXPIRED);
  }

  // Verify OTP using async compare
  const isValidOtp = await compare(otp, storedOtp.hashedOtp);

  // Verify OTP
  if (!isValidOtp) {
    throw new BadRequestException("Invalid OTP", ErrorCode.OTP_INVALID);
  }

  // Delete all OTPs after successful signup
  await prismaClient.otp.deleteMany({ where: { phoneNumber } });

  const token = jwt.sign({ phoneNumber }, SECRET_KEY);

  res.json({ message: "Login Successful", jwt: token });
};
