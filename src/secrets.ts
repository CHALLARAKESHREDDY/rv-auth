import dotenv from "dotenv";

dotenv.config({ path: ".env" });

export const PORT = process.env.PORT;

export const SECRET_KEY = process.env.JWT_SECRET_KEY!;

export const BUCKET_NAME = process.env.BUCKET_NAME!;
export const AWS_ACCESS_KEY_ID = process.env.ACCESS_KEY_ID!;
export const AWS_SECRET_ACCESS_KEY = process.env.SECRET_ACCESS_KEY!;
export const AWS_REGION = process.env.REGION_NAME!;


export const TAKE_LIMIT = process.env.TAKE_LIMIT!;

export const PRISMA_OPTIMIZE_TOKEN = process.env.PRISMA_OPTIMIZE_TOKEN!;