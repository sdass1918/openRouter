import { Link } from "react-router-dom";
import "./LandingPage.css";

export function LandingPage() {
    return (
      <>
      <main className="landing-page">
        <header className="landing-header">
          <div className="landing-brand" aria-label="OpenRouter home">
            OpenRouter
          </div>

          <nav className="landing-nav" aria-label="Top navigation">
            <Link to="/sign-in" className="landing-link">
              Sign in
            </Link>
            <Link to="/sign-up" className="landing-button landing-button--primary">
              Get started
            </Link>
          </nav>
        </header>

        <section className="landing-hero" aria-label="Landing hero">
          <div className="landing-hero-content">
            <h1 className="landing-title">
              Route to the best models
              <span className="landing-title-highlight">.</span>
            </h1>
            <p className="landing-subtitle">
              An open UI for building on top of multiple providers. Send one request,
              get routed intelligently to the model that fits.
            </p>

            <div className="landing-cta">
              <Link to="/sign-up" className="landing-button landing-button--primary landing-button--cta">
                Create your account
              </Link>
              <Link to="/sign-in" className="landing-button landing-button--secondary landing-button--cta">
                Sign in to dashboard
              </Link>
            </div>

            <div className="landing-badges" aria-label="Highlights">
              <span className="landing-badge">Multi-provider routing</span>
              <span className="landing-badge">Simple onboarding</span>
              <span className="landing-badge">Developer-first</span>
            </div>
          </div>
        </section>

        <section className="landing-features" aria-label="Features">
          <div className="landing-features-grid">
            <div className="landing-card">
              <div className="landing-card-title">Intelligent model routing</div>
              <div className="landing-card-text">
                Choose a request once and let the system route across providers to help
                you hit your quality and cost goals.
              </div>
            </div>

            <div className="landing-card">
              <div className="landing-card-title">Clean dashboard flow</div>
              <div className="landing-card-text">
                Start quickly with sign up/sign in, then manage your usage in a simple
                dashboard experience.
              </div>
            </div>

            <div className="landing-card">
              <div className="landing-card-title">Minimal, fast UI</div>
              <div className="landing-card-text">
                Lightweight layout and consistent styling to keep focus on building.
              </div>
            </div>
          </div>
        </section>

        <footer className="landing-footer" aria-label="Footer">
          <span>© {new Date().getFullYear()} OpenRouter</span>
        </footer>
      </main>
      </>
    );
}