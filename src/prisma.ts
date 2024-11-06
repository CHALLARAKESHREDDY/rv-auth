import { PrismaClient } from "@prisma/client";
import { withOptimize } from "@prisma/extension-optimize";
import { PRISMA_OPTIMIZE_TOKEN } from "./secrets";

export const prisma = new PrismaClient().$extends(withOptimize({apiKey:PRISMA_OPTIMIZE_TOKEN}));
