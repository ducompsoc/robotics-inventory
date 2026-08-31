import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    accelerateUrl: process.env.DATABASE_URL as string,
  });

// Without this, every dev-server hot reload would leak another client.
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
