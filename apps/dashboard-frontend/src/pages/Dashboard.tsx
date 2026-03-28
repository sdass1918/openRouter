import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Dashboard.css";

type ApiKey = {
  id: string;
  name: string;
  apikey: string;
  lastUsed: string | null;
  creditsConsumed: number;
  disabled: boolean;
};

type ApiKeyCreateResponse = {
  created: boolean;
  apiKey: ApiKey | null;
};

const API_BASE = "http://localhost:3000";

export function DashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const navigate = useNavigate();

  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);

  const [showActiveOnly, setShowActiveOnly] = useState(true);
  const [newKeyName, setNewKeyName] = useState("");
  const [isCreatingKey, setIsCreatingKey] = useState(false);

  const [apiBusy, setApiBusy] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const filteredKeys = useMemo(() => {
    if (!showActiveOnly) return apiKeys;
    return apiKeys.filter((k) => !k.disabled);
  }, [apiKeys, showActiveOnly]);

  const authedFetch = async (path: string, options: RequestInit = {}) => {
    if (!token) throw new Error("No auth token");

    const headers: Record<string, string> = {
      ...(options.headers as Record<string, string> | undefined),
      Authorization: `Bearer ${token}`,
    };

    // Keep default JSON behavior for POST/PUT.
    if (options.body && !headers["Content-Type"]) {
      headers["Content-Type"] = "application/json; charset=UTF-8";
    }

    const res = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers,
    });

    let parsed: any = null;
    try {
      parsed = await res.json();
    } catch {
      // Some endpoints might not return JSON on error.
      parsed = null;
    }

    if (!res.ok) {
      const msg = parsed?.message ?? parsed?.error ?? res.statusText;
      throw new Error(String(msg));
    }

    return parsed;
  };

  useEffect(() => {
    const stored = localStorage.getItem("token");
    setToken(stored);
    setIsAuthenticated(!!stored);
  }, []);

  useEffect(() => {
    if (!token) return;
    void (async () => {
      setErrorMessage(null);
      try {
        const [keysRes] = await Promise.all([
          authedFetch("/api-key", { method: "GET" }),
          authedFetch("/models", { method: "GET" }),
          authedFetch("/models/providers", { method: "GET" }),
        ]);
        setApiKeys(Array.isArray(keysRes) ? keysRes : []);
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Failed to load dashboard";
        // Likely token expired.
        setErrorMessage(msg);
        setIsAuthenticated(false);
        navigate("/sign-in", { replace: true });
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setIsAuthenticated(false);
    navigate("/", { replace: true });
  };

  const refreshApiKeys = async () => {
    const keysRes = await authedFetch("/api-key", { method: "GET" });
    setApiKeys(Array.isArray(keysRes) ? keysRes : []);
  };

  const createApiKey = async (name: string) => {
    setIsCreatingKey(true);
    setApiBusy("creating");
    setErrorMessage(null);
    try {
      const res = await authedFetch("/api-key", {
        method: "POST",
        body: JSON.stringify({ name }),
      });

      const parsed: ApiKeyCreateResponse = res;
      if (!parsed?.created || !parsed?.apiKey) {
        throw new Error("Unable to create API key");
      }

      // Refresh list so we include the new key.
      await refreshApiKeys();
      setNewKeyName("");
    } finally {
      setIsCreatingKey(false);
      setApiBusy(null);
    }
  };

  const setKeyDisabled = async (id: string, disabled: boolean) => {
    setApiBusy(disabled ? "disabling" : "enabling");
    setErrorMessage(null);
    try {
      await authedFetch("/api-key", {
        method: "PUT",
        body: JSON.stringify({ id, disable: disabled }),
      });
      await refreshApiKeys();
    } finally {
      setApiBusy(null);
    }
  };

  const deleteKey = async (id: string) => {
    setApiBusy("deleting");
    setErrorMessage(null);
    try {
      await authedFetch(`/api-key/${id}`, { method: "DELETE" });
      await refreshApiKeys();
    } finally {
      setApiBusy(null);
    }
  };

  if (isAuthenticated === null) return <div>Loading...</div>;
  if (!isAuthenticated) {
    return (
      <main className="dashboard-page">
        <div className="dashboard-container">
          <div className="dashboard-card">
            <div className="dashboard-title">Sign in required</div>
            <div className="dashboard-muted">Please sign in to manage API keys and view models.</div>
            <div className="dashboard-spacer" />
            <Link to="/sign-in" className="dashboard-button dashboard-button--primary">
              Go to sign in
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="dashboard-page">
      <header className="dashboard-header">
        <div className="dashboard-brand">OpenRouter Dashboard</div>
        <div className="dashboard-header-actions">
          <Link to="/models" className="dashboard-button dashboard-button--ghost">
            Models
          </Link>
          <button className="dashboard-button dashboard-button--secondary" onClick={logout}>
            Logout
          </button>
        </div>
      </header>

      <div className="dashboard-container">
        {errorMessage && <div className="dashboard-error">{errorMessage}</div>}

        <section className="dashboard-grid">
          <div className="dashboard-col">
            <div className="dashboard-card">
              <div className="dashboard-section-title">API Keys</div>

              <label className="dashboard-checkbox">
                <input
                  type="checkbox"
                  checked={showActiveOnly}
                  onChange={(e) => setShowActiveOnly(e.target.checked)}
                />
                <span>Show active only</span>
              </label>

              <form
                className="dashboard-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  const trimmed = newKeyName.trim();
                  if (!trimmed) return;
                  void createApiKey(trimmed);
                }}
              >
                <label className="dashboard-label" htmlFor="new-key-name">
                  New key name
                </label>
                <div className="dashboard-form-row">
                  <input
                    id="new-key-name"
                    className="dashboard-input"
                    type="text"
                    placeholder="e.g. my dev key"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                  />
                  <button
                    className="dashboard-button dashboard-button--primary"
                    type="submit"
                    disabled={isCreatingKey || !newKeyName.trim()}
                  >
                    {isCreatingKey ? "Creating..." : "Create"}
                  </button>
                </div>
              </form>

              <div className="dashboard-spacer" />

              <div className="dashboard-table">
                <div className="dashboard-table-head">
                  <div>Name</div>
                  <div>Key</div>
                  <div>Status</div>
                  <div>Last used</div>
                  <div>Credits</div>
                  <div />
                </div>

                {filteredKeys.length === 0 ? (
                  <div className="dashboard-muted">No API keys found.</div>
                ) : (
                  filteredKeys.map((k) => (
                    <div key={k.id} className="dashboard-table-row">
                      <div className="dashboard-cell dashboard-cell--name">
                        <div className="dashboard-row-title">{k.name}</div>
                      </div>

                      <div className="dashboard-cell">
                        <div className="dashboard-key">
                          <code className="dashboard-key-code">{k.apikey}</code>
                          <button
                            type="button"
                            className="dashboard-button dashboard-button--ghost dashboard-button--small"
                            onClick={() => {
                              void (async () => {
                                try {
                                  if (navigator.clipboard?.writeText) {
                                    await navigator.clipboard.writeText(k.apikey);
                                  } else {
                                    const el = document.createElement("textarea");
                                    el.value = k.apikey;
                                    document.body.appendChild(el);
                                    el.select();
                                    document.execCommand("copy");
                                    el.remove();
                                  }
                                } catch {
                                  // best-effort
                                }
                              })();
                            }}
                          >
                            Copy
                          </button>
                        </div>
                      </div>

                      <div className="dashboard-cell">
                        {k.disabled ? (
                          <span className="dashboard-pill dashboard-pill--disabled">Disabled</span>
                        ) : (
                          <span className="dashboard-pill dashboard-pill--active">Active</span>
                        )}
                      </div>

                      <div className="dashboard-cell">
                        {k.lastUsed ? new Date(k.lastUsed).toLocaleString() : <span className="dashboard-muted">Never</span>}
                      </div>

                      <div className="dashboard-cell">
                        {k.creditsConsumed ?? 0}
                      </div>

                      <div className="dashboard-cell dashboard-cell--actions">
                        <button
                          className="dashboard-button dashboard-button--secondary dashboard-button--small"
                          type="button"
                          disabled={apiBusy === "disabling" || apiBusy === "enabling"}
                          onClick={() => void setKeyDisabled(k.id, !k.disabled)}
                        >
                          {k.disabled ? "Enable" : "Disable"}
                        </button>
                        <button
                          className="dashboard-button dashboard-button--danger dashboard-button--small"
                          type="button"
                          disabled={apiBusy === "deleting"}
                          onClick={() => void deleteKey(k.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
