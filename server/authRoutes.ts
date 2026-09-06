import { Router, Request, Response } from "express";
import { signup, login, getUserFromToken } from "./authService.js";

const router = Router();

const COOKIE_NAME = "ner_access_token";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,
  sameSite: "none" as const,
  path: "/",
  maxAge: 24 * 60 * 60 * 1000,
};

function setAuthCookie(res: Response, token: string) {
  res.cookie(COOKIE_NAME, token, COOKIE_OPTIONS);
}

function extractToken(req: Request): string | null {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.split(" ")[1];
  }
  return req.cookies?.[COOKIE_NAME] || null;
}

router.post("/signup", async (req: Request, res: Response) => {
  try {
    const { full_name, email, password } = req.body;

    if (!full_name || !email || !password) {
      return res.status(400).json({
        detail: "Full name, email, and password are required.",
      });
    }

    if (String(password).length < 8) {
      return res.status(400).json({
        detail: "Password must be at least 8 characters.",
      });
    }

    const result = await signup(
      String(full_name),
      String(email),
      String(password)
    );

    setAuthCookie(res, result.access_token);

    return res.status(201).json({
      user: result.user,
      access_token: result.access_token,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Signup failed.";

    if (message.includes("already exists")) {
      return res.status(409).json({ detail: message });
    }

    return res.status(500).json({ detail: message });
  }
});

router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        detail: "Email and password are required.",
      });
    }

    const result = await login(String(email), String(password));

    setAuthCookie(res, result.access_token);

    return res.status(200).json({
      user: result.user,
      access_token: result.access_token,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Login failed.";

    return res.status(401).json({ detail: message });
  }
});

router.get("/me", async (req: Request, res: Response) => {
  try {
    const token = extractToken(req);

    if (!token) {
      return res.status(401).json({
        detail: "Authentication required.",
      });
    }

    const user = await getUserFromToken(token);

    return res.status(200).json({
      user: user,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Authentication failed.";

    return res.status(401).json({ detail: message });
  }
});

router.post("/logout", (_req: Request, res: Response) => {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
  });

  return res.status(200).json({ message: "Logged out successfully." });
});

export default router;