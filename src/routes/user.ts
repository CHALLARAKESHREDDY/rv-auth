import { Router } from "express";
import { errorHandler } from "../error-handler";
import { getMyPosts, getUserDetails, updateUserDetails } from "../controllers/user";
import authMiddleware from '../middlewares/auth';

const userRoutes: Router = Router();


userRoutes.get("/", [authMiddleware], errorHandler(getUserDetails)) 
userRoutes.put("/", [authMiddleware], errorHandler(updateUserDetails)); 
userRoutes.get("/myposts", [authMiddleware], errorHandler(getMyPosts));
userRoutes.delete("/mypost/:id", [authMiddleware], errorHandler(getMyPosts)); 


export default userRoutes;
