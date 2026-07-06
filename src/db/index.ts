import { drizzle } from "drizzle-orm/node-postgres";
import pkg from "pg";
import * as schema from "./schema.ts";

const { Pool } = pkg;

export const createPool = () => {
  return new Pool({
    host: process.env.SQL_HOST,
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    database: process.env.SQL_DB_NAME,
    connectionTimeoutMillis: 15000,
    idleTimeoutMillis: 30000,
    max: 20,
    min: 5,
    statement_timeout: 30000,
    query_timeout: 30000,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  });
};

const pool = createPool();

pool.on("error", (err) => {
  console.error("Unexpected error on idle SQL pool client:", err);
  setTimeout(() => {
    console.log("Attempting database reconnection...");
    createPool();
  }, 5000);
});

pool.on("connect", () => {
  console.log("New database connection established");
});

export const db = drizzle(pool, { schema });

export async function checkDatabaseHealth(): Promise<boolean> {
  try {
    const client = await pool.connect();
    await client.query('SELECT 1');
    client.release();
    return true;
  } catch (err) {
    console.error("Database health check failed:", err);
    return false;
  }
}
