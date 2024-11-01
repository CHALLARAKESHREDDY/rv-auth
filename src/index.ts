import express, { Express } from "express";
import { PORT } from "./secrets";
import rootRouter from "./routes";
import { PrismaClient } from "@prisma/client";
import { errorMiddleware } from "./middlewares/errorMiddleware";

const app: Express = express();

app.use(express.json());

app.use("/", rootRouter);

export const prismaClient = new PrismaClient(/*{ log: ["query"] }*/);

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.clear();
  console.log("server is running on port 3000");
});