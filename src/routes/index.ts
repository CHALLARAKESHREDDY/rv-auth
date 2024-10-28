import { Router } from "express";
import authRoutes from "./auth";
import userRoutes from "./user";

const rootRouter:Router = Router()

rootRouter.use("/auth", authRoutes)
rootRouter.use("/user", userRoutes)

export default rootRouter