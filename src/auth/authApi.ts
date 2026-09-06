export interface AuthUser {
  id: number;
  full_name: string;
  email: string;
  is_active?: boolean;
  created_at?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface SignupData {
  full_name: string;
  email: string;
  password: string;
}

// Clean up trailing slashes from API_BASE_URL to avoid double slashes in fetch routes
const RAW_API_URL =
  import.meta.env.VITE_API_URL ||
  "https://ner-landslide-monitor-pj1l.onrender.com";

const API_BASE_URL = RAW_API_URL.replace(/\/+$/, "");

async function parseResponse(response: Response) {
  const contentType = response.headers.get("content-type");

  // Check if response is HTML instead of JSON (prevents JSON parse crashes)
  if (!contentType || !contentType.includes("application/json")) {
    throw new Error(
      "Unable to connect to backend server. Please verify backend status on Render."
    );
  }

  const data = await response.json();

  if (!response.ok) {
    // Check both Express ('error' / 'message') and FastAPI ('detail') formats
    const errorMessage =
      data.error ||
      data.message ||
      data.detail ||
      "Something went wrong. Please try again.";
    throw new Error(errorMessage);
  }

  return data;
}

export async function login(data: LoginData): Promise<AuthUser> {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  const result = await parseResponse(response);

  // Return user object whether returned as { user: ... } or root object
  return result.user || result;
}

export async function signup(data: SignupData): Promise<AuthUser> {
  const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  const result = await parseResponse(response);

  return result.user || result;
}

export async function getMe(): Promise<AuthUser> {
  const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
    method: "GET",
    credentials: "include",
  });

  const result = await parseResponse(response);

  return result.user || result;
}

export async function logout(): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));

    throw new Error(
      data.error || data.message || data.detail || "Logout failed. Please try again."
    );
  }
}