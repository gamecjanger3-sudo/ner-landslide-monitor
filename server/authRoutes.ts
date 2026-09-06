import { Router, Request, Response } from "express";
import rateLimit from "express-rate-limit";
import { signup, login, getUserFromToken } from "./authService.js";

const router = Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    detail: "Too many login attempts. Please try again later.",
  },
});

function setAuthCookie(res: Response, token: string) {
  res.cookie("token", token, {
    httpOnly: true,
    secure: true, // Essential for cross-site cookies over HTTPS
    sameSite: "none", // Essential when Vercel and Render are on different domains
    maxAge: 24 * 60 * 60 * 1000,
  });
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

router.post("/login", loginLimiter, async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        detail: "Email and password are required.",
      });
    }

    const result = await login(String(email), String(password));

    setAuthCookie(res, result.access_token);

    return res.json({
      user: result.user,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Login failed.";

    return res.status(401).json({ detail: message });
  }
});

router.get("/me", async (req: Request, res: Response) => {
  try {
    const token = req.cookies?.ner_access_token;

    if (!token) {
      return res.status(401).json({
        detail: "Authentication required.",
      });
    }

    const user = await getUserFromToken(token);

    return res.json(user);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Authentication failed.";

    return res.status(401).json({ detail: message });
  }
});
router.post("/logout", (_req: Request, res: Response) => {
  res.clearCookie("ner_access_token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  });

  return res.json({ message: "Logged out successfully." });
});

export default router;
