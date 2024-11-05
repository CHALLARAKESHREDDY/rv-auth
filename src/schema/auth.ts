import z from "zod";

// Define the common fields in a base schema
const BaseSignupSchema = z.object({
  name: z
    .string()
    .min(4, { message: "Name must be at least 4 characters long." })
    .max(30, { message: "Name cannot exceed 30 characters." }),
  phoneNumber: z
    .string()
    .length(10, { message: "Phone number must be exactly 10 digits." }),
  email: z.string().email({ message: "Invalid email address." }).optional(),
  occupation: z.enum([
    "FARMER",
    "MECHANIC",
    "ELECTRICIAN",
    "VETERINARY",
    "FARMLABOUR",
    "GUEST"
  ]),
});

// Define the OTP schema independently
export const OtpSchema = z
  .object({
    otp: z
      .string()
      .length(4, { message: "OTP must be exactly 4 characters long." })
      .refine((value) => /^[0-9]+$/.test(value), {
        message: "OTP must consist of only digits."
      }),
  })
  .strict();

// Signup schema using the base schema
export const SignupSchema = BaseSignupSchema.strict();

// Login schema for phone number only
export const LoginSchema = z
  .object({
    phoneNumber: z
      .string()
      .length(10, { message: "Phone number must be exactly 10 digits." }),
  })
  .strict();

// SignupVerify schema that extends BaseSignupSchema with OTP
export const SignupVerifySchema = BaseSignupSchema.merge(OtpSchema).strict();

// LoginVerify schema for OTP only
export const LoginVerifySchema = OtpSchema.merge(LoginSchema).strict();

// User update details schema, excluding phoneNumber
export const userUpdateDetailsSchema = BaseSignupSchema.partial();

