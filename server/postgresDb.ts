import 'dotenv/config';

import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    'DATABASE_URL is not configured. Set it before starting the server.',
  );
}

export const pool = new Pool({
  connectionString,
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 10_000,
});

pool.on('error', (error) => {
  console.error('Unexpected PostgreSQL pool error:', error);
});

export async function query<T = any>(
  text: string,
  values: unknown[] = [],
) {
  return pool.query<T>(text, values);
}

export async function initializePostgres(): Promise<void> {
  await query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      full_name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      is_active BOOLEAN NOT NULL DEFAULT TRUE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
}