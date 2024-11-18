import z from "zod";

// Define the common fields in a base schema
const BaseSignupSchema = z.object({
  name: z.string().min(4).max(20),
  phoneNumber: z.string().length(10),
  email: z.string().email().optional().nullable(),
  occupation: z.enum([
    "Farmer",
    "Mechanic",
    "Electrician",
    "Veterinary",
    "Guest",
  ]),
});

// Define the OTP schema independently
export const OtpSchema = z
  .object({
    otp: z
      .string()
      .length(4)
      .refine((value) => /^[0-9]+$/.test(value)),
    action:z.enum(["login", "signup"])
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
