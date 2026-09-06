import { useState } from "react";
import type { FormEvent } from "react";
import { signup } from "./authApi";
import {
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  User,
} from "lucide-react";
import "./Auth.css";

interface SignupProps {
  onSwitchToLogin: () => void;
  onSignupSuccess: () => void;
}

export default function Signup({
  onSwitchToLogin,
  onSignupSuccess,
}: SignupProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!name || !email || !password || !confirmPassword) {
      setError("Please complete all required fields.");
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!agree) {
      setError("Please accept the terms to continue.");
      return;
    }

    try {
      await signup({
        full_name: name,
        email,
        password,
      });

      onSignupSuccess();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Signup failed. Please try again.",
      );
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">
            <ShieldCheck size={28} />
          </div>

          <h1>Create Account</h1>
          <p>Join the NER Landslide Monitoring platform</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {error && <div className="auth-error">{error}</div>}

          <div className="form-group">
            <label htmlFor="signup-name">Full Name</label>

            <div className="input-wrapper">
              <User size={18} />

              <input
                id="signup-name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                autoComplete="name"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="signup-email">Email Address</label>

            <div className="input-wrapper">
              <Mail size={18} />

              <input
                id="signup-email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="signup-password">Password</label>

            <div className="input-wrapper">
              <LockKeyhole size={18} />

              <input
                id="signup-password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="new-password"
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((value) => !value)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="signup-confirm-password">
              Confirm Password
            </label>

            <div className="input-wrapper">
              <LockKeyhole size={18} />

              <input
                id="signup-confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                autoComplete="new-password"
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowConfirmPassword((value) => !value)
                }
                aria-label={
                  showConfirmPassword
                    ? "Hide confirm password"
                    : "Show confirm password"
                }
              >
                {showConfirmPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
          </div>

          <label className="terms-row">
            <input
              type="checkbox"
              checked={agree}
              onChange={(event) => setAgree(event.target.checked)}
            />

            <span className="custom-checkbox">
              {agree && <Check size={14} />}
            </span>

            <span>
              I agree to the platform's terms and privacy policy
            </span>
          </label>

          <button type="submit" className="auth-submit">
            Create Account
            <ArrowRight size={18} />
          </button>
        </form>

        <div className="auth-switch">
          <span>Already have an account?</span>

          <button type="button" onClick={onSwitchToLogin}>
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
}