import dotenv from "dotenv";

dotenv.config({ path: ".env" });

export const PORT = process.env.PORT;

export const SECRET_KEY = process.env.JWT_SECRET_KEY!;