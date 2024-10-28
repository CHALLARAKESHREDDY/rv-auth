import { Router } from "express";
import { errorHandler } from "../error-handler";
import { getUserDetails, updateUserDetails } from "../controllers/user";
import authMiddleware from '../middlewares/auth';

const userRoutes: Router = Router();


userRoutes.get("/user-details", [authMiddleware], errorHandler(getUserDetails)) 
userRoutes.put("/update-user-details", [authMiddleware], errorHandler(updateUserDetails)); 


export default userRoutes;
