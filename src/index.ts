import express, { Express } from "express";
import { PORT } from "./secrets";
import rootRouter from "./routes";
import { errorMiddleware } from "./middlewares/error-middleware";
import { healthCheck } from "./components/health-check";
import { gracefulShutdown } from "./components/shutdown";

const app: Express = express();

app.use(express.json());

app.use("/", rootRouter);

app.get("/health", healthCheck)

app.use(errorMiddleware);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});


export const server=app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});


process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));