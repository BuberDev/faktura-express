import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "@/core/domain/schema";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set in environment variables");
}

// For queries/mutations in Server Components and API Routes
const client = postgres(connectionString, { prepare: false });
export const db = drizzle(client, { schema });
