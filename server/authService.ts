import "dotenv/config";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { query } from "./postgresDb.js";

const JWT_SECRET = process.env.JWT_SECRET_KEY;

if (!JWT_SECRET) {
  throw new Error(
    "JWT_SECRET_KEY is not configured. Set it in the environment before starting the server.",
  );
}

const JWT_EXPIRES_IN = "1h";

export type AuthUser = {
  id: number;
  full_name: string;
  email: string;
  is_active: boolean;
  created_at: string;
};

type UserRow = {
  id: number;
  full_name: string;
  email: string;
  password_hash?: string;
  is_active: boolean;
  created_at: string | Date;
};

function rowToUser(row: UserRow): AuthUser {
  return {
    id: Number(row.id),
    full_name: String(row.full_name),
    email: String(row.email),
    is_active: Boolean(row.is_active),
    created_at: new Date(row.created_at).toISOString(),
  };
}

export async function signup(
  fullName: string,
  email: string,
  password: string,
) {
  const normalizedEmail = email.trim().toLowerCase();

  const existing = await query<{ id: number }>(
    "SELECT id FROM users WHERE email = $1",
    [normalizedEmail],
  );

  if (existing.rowCount && existing.rowCount > 0) {
    throw new Error("An account with this email already exists.");
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const result = await query<UserRow>(
    `
      INSERT INTO users
        (full_name, email, password_hash, is_active)
      VALUES
        ($1, $2, $3, TRUE)
      RETURNING id, full_name, email, is_active, created_at
    `,
    [fullName.trim(), normalizedEmail, passwordHash],
  );

  if (result.rows.length === 0) {
    throw new Error("User was created but could not be loaded.");
  }

  const user = rowToUser(result.rows[0]);

  return {
    user,
    access_token: createToken(user.id),
  };
}

export async function login(email: string, password: string) {
  const normalizedEmail = email.trim().toLowerCase();

  const result = await query<UserRow>(
    `
      SELECT
        id,
        full_name,
        email,
        password_hash,
        is_active,
        created_at
      FROM users
      WHERE email = $1
    `,
    [normalizedEmail],
  );

  if (result.rows.length === 0) {
    throw new Error("Invalid email or password.");
  }

  const row = result.rows[0];

  const validPassword = await bcrypt.compare(
    password,
    String(row.password_hash),
  );

  if (!validPassword) {
    throw new Error("Invalid email or password.");
  }

  if (!row.is_active) {
    throw new Error("This account is disabled.");
  }

  const user = rowToUser(row);

  return {
    user,
    access_token: createToken(user.id),
  };
}

export async function getUserFromToken(token: string) {
  try {
    const payload = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;

    if (!payload.sub) {
      throw new Error("Invalid token.");
    }

    const userId = Number(payload.sub);

    if (!Number.isInteger(userId)) {
      throw new Error("Invalid token.");
    }

    const result = await query<UserRow>(
      `
        SELECT
          id,
          full_name,
          email,
          is_active,
          created_at
        FROM users
        WHERE id = $1
      `,
      [userId],
    );

    if (result.rows.length === 0) {
      throw new Error("User not found.");
    }

    const user = rowToUser(result.rows[0]);

    if (!user.is_active) {
      throw new Error("This account is disabled.");
    }

    return user;
  } catch {
    throw new Error("Invalid or expired authentication token.");
  }
}

function createToken(userId: number): string {
  return jwt.sign(
    { sub: String(userId) },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN },
  );
}