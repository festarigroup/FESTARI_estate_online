import path from "node:path";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

async function main(): Promise<void> {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is required");
  }

  const migrationsFolder = path.join(__dirname, "../../drizzle");
  const client = postgres(url, { max: 1, prepare: false });
  const db = drizzle(client);

  await migrate(db, { migrationsFolder });
  await client.end({ timeout: 5 });
  console.log("Migrations applied successfully.");
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});