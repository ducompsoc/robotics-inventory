// The Prisma 7 CLI does not load `.env` itself, so dotenv is required here.
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Deliberately `process.env` rather than Prisma's `env()` helper: `env()`
    // throws when the variable is missing, which would break `prisma generate`
    // in builds that have no database URL (e.g. the `postinstall` script on CI).
    url: process.env.DATABASE_URL,
  },
});
