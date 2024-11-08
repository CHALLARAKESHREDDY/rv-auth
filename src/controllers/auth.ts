import { Request, Response } from "express";
import { prisma } from "../prisma";
import otpGenerator from "otp-generator";
import { hash, compare } from "bcrypt";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../secrets";
import { BadRequestException } from "../exceptions/bad-request";
import { ErrorCode, SuccessCode } from "../exceptions/root";
import {
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
  const user = await prisma.users.findFirst({
    where: {
      OR: [{ email }, { phoneNumber }],
    },
    select: {
      id: true,
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
  await prisma.otp.create({
    data: {
      hashedOtp: hashedOtp,
      phoneNumber: phoneNumber,
    },
    select: {
      id: true,
      hashedOtp: true,
    },
  });
  // Send a success response
  res.json({
    message: "OTP sent successfully",
    successCode: SuccessCode.OTP_SENT_SUCCESSFULLY,
  });
};

export const login = async (req: Request, res: Response) => {
  const { phoneNumber } = req.body;

  // Check if the user exists
  const user = await prisma.users.findUnique({
    where: { phoneNumber },
    select: {
      id: true,
    },
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
  await prisma.otp.create({
    data: {
      hashedOtp: hashedOtp,
      phoneNumber,
    },
    select: {
      id: true,
      hashedOtp: true,
    },
  });

  res.json({
    message: "OTP sent successfully",
    successCode: SuccessCode.OTP_SENT_SUCCESSFULLY,
  });
};

export const signupVerifyOtp = async (req: Request, res: Response) => {
  // Validate request body with Zod schema
  SignupVerifySchema.parse(req.body);

  const { name, phoneNumber, email, occupation, otp } = req.body;

  // Find stored OTP for the provided phone number
  const storedOtp = await prisma.otp.findFirst({
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

  if (differenceInMinutes > 4) {
    throw new NotFoundException("OTP Expired", ErrorCode.OTP_EXPIRED);
  }

  // Verify OTP using async compare
  const isValidOtp = await compare(otp, storedOtp.hashedOtp);

  // Verify OTP
  if (!isValidOtp) {
    throw new BadRequestException("Invalid OTP", ErrorCode.INCORRECT_OTP);
  }

const user = await prisma.$transaction((tx) =>
      tx.users
        .create({
          data: { name, phoneNumber, email, occupation },
          select: { id: true },
        })
        .then((createdUser) =>
          tx.otp.deleteMany({ where: { phoneNumber } }).then(() => createdUser)
        )
    );

  // Generate JWT token
  const token = jwt.sign({ phoneNumber, id: user.id }, SECRET_KEY);

  res.json({ message: "Signup Successful", jwt: token, successCode:SuccessCode.SIGNUP_SUCCESSFUL });
};

export const loginVerifyOtp = async (req: Request, res: Response) => {
  // Validate request body
  LoginVerifySchema.parse(req.body);

  const { phoneNumber, otp } = req.body;

  const user = await prisma.users.findUnique({
    where: { phoneNumber },
    select: {
      id: true,
    },
  });

  if (!user) {
    throw new NotFoundException("User Not Found!", ErrorCode.USER_NOT_FOUND);
  }

  // Find stored OTP for the provided phone number
  const storedOtp = await prisma.otp.findFirst({
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

  if (differenceInMinutes > 4) {
    throw new NotFoundException("OTP Expired", ErrorCode.OTP_EXPIRED);
  }

  // Verify OTP using async compare
  const isValidOtp = await compare(otp, storedOtp.hashedOtp);

  // Verify OTP
  if (!isValidOtp) {
    throw new BadRequestException("Invalid OTP", ErrorCode.OTP_INVALID);
  }

  // Delete all OTPs after successful signup
  await prisma.otp.deleteMany({ where: { phoneNumber } });

  const token = jwt.sign({ phoneNumber, id: user.id }, SECRET_KEY);

  res.json({ message: "Login Successful", jwt: token , successCode: SuccessCode.LOGIN_SUCCESSFUL});
};
