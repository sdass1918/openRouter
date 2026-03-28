import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Signin.css";

export function SigninPage() {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const signIn = async (emailValue: string, passwordValue: string) => {
    const response = await fetch("http://localhost:3000/auth/sign-in", {
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
      throw new Error("Sign in failed");
    }

    const data = await response.json();
    localStorage.setItem("token", data.token);
  };

  const email = useRef<HTMLInputElement>(null);
  const password = useRef<HTMLInputElement>(null);

  const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
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
      await signIn(emailValue, passwordValue);
      navigate("/dashboard");
    } catch {
      setErrorMessage("Invalid credentials. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="signin-page">
      <section className="signin-card" aria-label="Sign in form">
        <h1 className="signin-title">Welcome back</h1>
        <p className="signin-subtitle">Sign in to continue to your dashboard.</p>

        <form className="signin-form" onSubmit={handleSubmit}>
          <label className="signin-label" htmlFor="signin-email">
            Email
          </label>
          <input
            id="signin-email"
            className="signin-input"
            type="email"
            placeholder="you@example.com"
            ref={email}
            autoComplete="email"
          />

          <label className="signin-label" htmlFor="signin-password">
            Password
          </label>
          <input
            id="signin-password"
            className="signin-input"
            type="password"
            placeholder="Enter your password"
            ref={password}
            autoComplete="current-password"
          />

          {errorMessage && <p className="signin-error">{errorMessage}</p>}

          <button className="signin-button" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="signin-footer">
          New here?{" "}
          <Link to="/sign-up" className="signin-link">
            Create an account
          </Link>
        </p>
      </section>
    </main>
  );
}
