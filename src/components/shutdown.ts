import { server } from "..";
import { prisma } from "../prisma";

export const gracefulShutdown = async (signal: string) => {
  console.log(`Received ${signal}. Starting graceful shutdown...`);

  server.close(async (err:any) => {
    if (err) {
      console.error("Error during server shutdown:", err);
      return process.exit(1);
    }

    // Clean up resources (e.g., close DB connections)
    await prisma.$disconnect();
    console.log("Disconnected from the database.");

    // Exit the process
    process.exit(0);
  });
};


