import { db } from "#app/db/db.js";

export type Transaction = Parameters<Parameters<typeof db.transaction>[0]>[0];
