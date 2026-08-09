import postgres from "postgres";

async function main(): Promise<void> {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is required");
  }

  const sql = postgres(url, { max: 1, prepare: false });
  await sql`CREATE EXTENSION IF NOT EXISTS postgis;`;
  await sql.end({ timeout: 5 });
  console.log("PostGIS extension ensured.");
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
