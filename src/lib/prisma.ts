import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

// `accelerateUrl` and `adapter` are mutually exclusive in Prisma 7 and exactly
// one is required. A `prisma+postgres://` URL is the Accelerate HTTP transport,
// so no driver adapter is involved.
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    accelerateUrl: process.env.DATABASE_URL as string,
  });

// Without this, every dev-server hot reload would leak another client.
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
