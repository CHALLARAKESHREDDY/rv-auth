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
  console.log(req.body)
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

  console.log(user)

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
      id: true
    }
    });
  // Send a success response
  res.json({
    message: "OTP sent successfully",
    successCode: SuccessCode.OTP_SENT_SUCCESSFULLY,
  });
};

export const login = async (req: Request, res: Response) => {
  const { phoneNumber } = req.body;
  console.log(phoneNumber);

  const user = await prisma.users.findUnique({
    where: { phoneNumber },
    select: { id: true},
  });
  
  if (!user) {
    throw new NotFoundException("User Not Found!", ErrorCode.USER_NOT_FOUND);
  }

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
    farmerId:user.id
  });
};

export const signupVerifyOtp = async (req: Request, res: Response) => {
  // Validate request body with Zod schema
  SignupVerifySchema.parse(req.body);
  console.log(req.body)

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
        data: { userName:name, phoneNumber, email, occupation },
        select: { id: true },
      })
      .then((createdUser) =>
        tx.otp.deleteMany({ where: { phoneNumber } }).then(() => createdUser)
      )
  );

  // Generate JWT token
  const token = jwt.sign({ phoneNumber, id: user.id }, SECRET_KEY);

  res.json({
    jwt: token,
    successCode: SuccessCode.SIGNUP_SUCCESSFUL,
    userDetails:{id:user.id, userName:name, phoneNumber:phoneNumber, occupation:occupation, calls:true, messages:true, email:email}
  });
};

export const loginVerifyOtp = async (req: Request, res: Response) => {
    // Validate request body
    LoginVerifySchema.parse(req.body);
  
    const { phoneNumber, otp } = req.body;
  
    // Query user details
    const user = await prisma.users.findUnique({
      where: { phoneNumber },
      select: {
        id: true,
        userName: true,
        occupation: true,
        phoneNumber:true,
        imageUrl:true,
        calls:true,
        messages:true,
        email:true
      },
    });
  
    if (!user) {
      throw new NotFoundException("User Not Found!", ErrorCode.USER_NOT_FOUND);
    }
  
    // Validate OTP
    const storedOtp = await prisma.otp.findFirst({
      where: { phoneNumber },
      orderBy: { createdAt: "desc" },
    });
  
    if (!storedOtp) {
      throw new NotFoundException("OTP Not Found!", ErrorCode.OTP_NOT_FOUND);
    }
  
    const createdAt = new Date(storedOtp.createdAt);
    const differenceInMinutes = Math.floor(
      (Date.now() - createdAt.getTime()) / 60000
    );
  
    if (differenceInMinutes > 4) {
      throw new NotFoundException("OTP Expired", ErrorCode.OTP_EXPIRED);
    }
  
    const isValidOtp = await compare(otp, storedOtp.hashedOtp);
  
    if (!isValidOtp) {
      throw new BadRequestException("Invalid OTP", ErrorCode.INCORRECT_OTP);
    }
  
    // Delete all OTPs after successful login
    await prisma.otp.deleteMany({ where: { phoneNumber } });
  
    // Fetch registration details based on occupation
    let registrationDetails = null;
    let registrationStatus = false;
  
    if (user.occupation === "Veterinary") {
      registrationDetails = await prisma.veterinarian.findUnique({
        where: { userId: user.id },
        select: {
          experience: true,
          imageUrl: true,
          specialty: true,
          availability: true,
        },
      });
    } else if (user.occupation === "Electrician" || user.occupation === "Mechanic") {
      registrationDetails = await prisma.technicians.findUnique({
        where: { userId: user.id },
        select: {
          experience: true,
          imageUrl: true,
          type: true,
          availability: true,
        },
      });
    }
  
    if (registrationDetails) {
      registrationStatus = true;
    }
  
    // Create JWT
    const token = jwt.sign(
      { phoneNumber, id: user.id, occupation: user.occupation },
      SECRET_KEY
    );
  
    // Send response
    res.json({
      jwt: token,
      successCode: SuccessCode.LOGIN_SUCCESSFUL,
      userDetails:user,
      registrationDetails,
      registrationStatus
    });
  };
  

  /*export const loginVerifyOtps = async (req: Request, res: Response) => {
  // Validate request body
  LoginVerifySchema.parse(req.body);

  const { phoneNumber, otp } = req.body;

  const user = await prisma.users.findUnique({
    where: { phoneNumber },
    select: {
      id: true,
      userName:true,
      Veterinarian :{
        select:{
            experience:true,
            imageUrl:true,
            info:true,
            specialty:true,
            availability:true
        }
      }
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
    throw new BadRequestException("Invalid OTP", ErrorCode.INCORRECT_OTP);
  }

  // Delete all OTPs after successful signup
  await prisma.otp.deleteMany({ where: { phoneNumber } });

  const token = jwt.sign({ phoneNumber, id: user.id }, SECRET_KEY);

  res.json({
    message: "Login Successful",
    jwt: token,
    successCode: SuccessCode.LOGIN_SUCCESSFUL,
    userId:user.id
  });
};*/