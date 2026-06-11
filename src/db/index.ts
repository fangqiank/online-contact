import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import * as schema from "./schema";

let _db: ReturnType<typeof drizzle> | undefined;

function getDb() {
  if (!_db) {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    _db = drizzle({ client: pool, schema });
  }
  return _db;
}

export const db = new Proxy({} as ReturnType<typeof drizzle>, {
  get(_, prop) {
    return Reflect.get(getDb(), prop);
  },
});
