import { Router, Request, Response } from "express";
import rateLimit from "express-rate-limit";
import { signup, login, getUserFromToken } from "./authService.js";

const router = Router();

// Define consistent cookie configuration for cross-domain (Vercel <-> Render)
const COOKIE_NAME = "ner_access_token";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,        // REQUIRED for cross-domain HTTPS
  sameSite: "none" as const, // REQUIRED for Vercel -> Render requests
  path: "/",          // Ensures cookie is sent on all endpoints
  maxAge: 24 * 60 * 60 * 1000, // 24 hours
};

// Rate limiter configured with proxy-safe key generator
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 50,                // Higher limit for testing/development
  standardHeaders: "draft-8",
  legacyHeaders: false,
  validate: { xForwardedForHeader: false },
  keyGenerator: (req) => {
    const forwarded = req.headers['x-forwarded-for'];
    if (typeof forwarded === 'string') {
      return forwarded.split(',')[0].trim();
    }
    return req.ip || 'unknown';
  },
  message: {
    detail: "Too many login attempts. Please try again later.",
  },
});

function setAuthCookie(res: Response, token: string) {
  res.cookie(COOKIE_NAME, token, COOKIE_OPTIONS);
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
      String(password),
    );

    setAuthCookie(res, result.access_token);

    return res.status(201).json({
      user: result.user,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Signup failed.";

    if (message.includes("already exists")) {
      return res.status(409).json({ detail: message });
    }

    return res.status(500).json({ detail: message });
  }
});

// Removed loginLimiter temporarily from this route handler
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
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Login failed.";

    return res.status(401).json({ detail: message });
  }
});

router.get("/me", async (req: Request, res: Response) => {
  try {
    const token = req.cookies?.[COOKIE_NAME];

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