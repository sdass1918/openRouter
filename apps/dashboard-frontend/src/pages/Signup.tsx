import { useRef, useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Signup.css";

export function SignupPage() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const email = useRef<HTMLInputElement>(null);
  const password = useRef<HTMLInputElement>(null);

  async function signUp(emailValue: string, passwordValue: string) {
    const response = await fetch("http://localhost:3000/auth/sign-up", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify({
        email: emailValue,
        password: passwordValue,
      }),
    });

    if (!response.ok) {
      throw new Error("Sign up failed");
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);

    const emailValue = email.current?.value.trim() ?? "";
    const passwordValue = password.current?.value ?? "";

    if (!emailValue || !passwordValue) {
      setErrorMessage("Please fill in both email and password.");
      return;
    }

    try {
      setIsSubmitting(true);
      await signUp(emailValue, passwordValue);
      navigate("/sign-in");
    } catch {
      setErrorMessage("Could not create account. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="signup-page">
      <section className="signup-card" aria-label="Sign up form">
        <h1 className="signup-title">Create your account</h1>
        <p className="signup-subtitle">
          Use your email and password to get started.
        </p>

        <form className="signup-form" onSubmit={handleSubmit}>
          <label className="signup-label" htmlFor="signup-email">
            Email
          </label>
          <input
            id="signup-email"
            className="signup-input"
            type="email"
            placeholder="you@example.com"
            ref={email}
            autoComplete="email"
          />

          <label className="signup-label" htmlFor="signup-password">
            Password
          </label>
          <input
            id="signup-password"
            className="signup-input"
            type="password"
            placeholder="Enter your password"
            ref={password}
            autoComplete="new-password"
          />

          {errorMessage && <p className="signup-error">{errorMessage}</p>}

          <button className="signup-button" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating account..." : "Sign up"}
          </button>
        </form>

        <p className="signup-footer">
          Already have an account?{" "}
          <Link to="/sign-in" className="signup-link">
            Sign in
          </Link>
        </p>
      </section>
    </main>
  );
}