import { Router } from "express";
import { login, loginVerifyOtp, signup, signupVerifyOtp } from "../controllers/auth";
import { errorHandler } from "../error-handler";

const authRoutes: Router = Router();

authRoutes.post("/signup/request-otp",errorHandler(signup));
authRoutes.post("/login/request-otp",errorHandler(login));
authRoutes.post("/signup/verify-otp", errorHandler(signupVerifyOtp));
authRoutes.post("/login/verify-otp", errorHandler(loginVerifyOtp));

export default authRoutes;
