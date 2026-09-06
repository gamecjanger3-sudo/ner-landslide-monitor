import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { pool } from "./postgresDb.js";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_key_change_in_prod";

export interface UserPayload {
  id: number;
  full_name: string;
  email: string;
  is_active?: boolean;
  created_at?: string;
}

export interface AuthResult {
  access_token: string;
  user: UserPayload;
}

export async function signup(
  fullName: string,
  email: string,
  pass: string
): Promise<AuthResult> {
  const normalizedEmail = email.trim().toLowerCase();

  const existingUser = await pool.query(
    "SELECT id FROM users WHERE email = $1",
    [normalizedEmail]
  );

  if (existingUser.rows.length > 0) {
    throw new Error("User with this email already exists.");
  }

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(pass, saltRounds);

  const insertResult = await pool.query(
    `INSERT INTO users (full_name, email, password_hash)
     VALUES ($1, $2, $3)
     RETURNING id, full_name, email, created_at`,
    [fullName.trim(), normalizedEmail, hashedPassword]
  );

  const user = insertResult.rows[0];

  const access_token = jwt.sign(
    { id: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: "24h" }
  );

  return { access_token, user };
}

export async function login(
  email: string,
  pass: string
): Promise<AuthResult> {
  const normalizedEmail = email.trim().toLowerCase();

  const userResult = await pool.query(
    "SELECT id, full_name, email, password_hash, created_at FROM users WHERE email = $1",
    [normalizedEmail]
  );

  if (userResult.rows.length === 0) {
    throw new Error("Invalid email or password.");
  }

  const user = userResult.rows[0];

  const isValidPassword = await bcrypt.compare(pass, user.password_hash);
  if (!isValidPassword) {
    throw new Error("Invalid email or password.");
  }

  const access_token = jwt.sign(
    { id: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: "24h" }
  );

  const userPayload: UserPayload = {
    id: user.id,
    full_name: user.full_name,
    email: user.email,
    created_at: user.created_at,
  };

  return { access_token, user: userPayload };
}

export async function getUserFromToken(token: string): Promise<UserPayload> {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number; email: string };

    const userResult = await pool.query(
      "SELECT id, full_name, email, created_at FROM users WHERE id = $1",
      [decoded.id]
    );

    if (userResult.rows.length === 0) {
      throw new Error("User not found.");
    }

    return userResult.rows[0];
  } catch (err) {
    throw new Error("Invalid or expired session token.");
  }
}