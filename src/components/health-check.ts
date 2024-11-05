import { Request, Response } from "express";
import { prisma } from "../prisma";

export const healthCheck = async (
  req: Request,
  res: Response
): Promise<void> => {
  // change Promise<any> to Promise<void>
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`; // Simple query to check connection

    res.status(200).json({
      status: "healthy",
      database: "connected",
    });
  } catch (error: any) {
    res.status(500).json({
      status: "unhealthy",
      database: "disconnected",
      error: error.message,
    });
  }
};
