import z from "zod";

// Define the common fields in a base schema
const BaseSignupSchema = z.object({
  name: z.string().min(4).max(30),
  phoneNumber: z.string().length(10),
  email: z.string().email().optional(),
  occupation: z.enum([
    "FARMER",
    "MECHANIC",
    "ELECTRICIAN",
    "VETERINARY",
    "FARM-LABOUR",
  ]),
});

// Define the OTP schema independently
export const OtpSchema = z
  .object({
    otp: z.string().length(4),
  })
  .strict();

// Signup schema using the base schema
export const SignupSchema = BaseSignupSchema.strict();

// Login schema for phone number only
export const LoginSchema = z
  .object({
    phoneNumber: z.string().length(10),
  })
  .strict();

// SignupVerify schema that extends BaseSignupSchema with OTP
export const SignupVerifySchema = BaseSignupSchema.merge(OtpSchema).strict();

// LoginVerify schema for OTP only
export const LoginVerifySchema = OtpSchema.merge(LoginSchema).strict();

// User update details schema, excluding phoneNumber
export const userUpdateDetailsSchema = z
  .object({
    name: z.string().min(4).max(30).optional(),
    email: z.string().email().optional(),
    occupation: z
      .enum(["FARMER", "MECHANIC", "ELECTRICIAN", "VETERINARY", "FARMLABOUR"])
      .optional(),
    // phoneNumber omitted from this schema
  })
  .strict();
