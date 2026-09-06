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

async function parseResponse(response: Response) {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail || 'Something went wrong. Please try again.',
    );
  }

  return data;
}

export async function login(data: LoginData): Promise<AuthUser> {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(data),
  });

  const result = await parseResponse(response);

  return result.user;
}

export async function signup(data: SignupData): Promise<AuthUser> {
  const response = await fetch('/api/auth/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(data),
  });

  const result = await parseResponse(response);

  return result.user;
}

export async function getMe(): Promise<AuthUser> {
  const response = await fetch('/api/auth/me', {
    method: 'GET',
    credentials: 'include',
  });

  return parseResponse(response);
}

export async function logout(): Promise<void> {
  const response = await fetch('/api/auth/logout', {
    method: 'POST',
    credentials: 'include',
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));

    throw new Error(
      data.detail || 'Logout failed. Please try again.',
    );
  }
}