import React, { useState, useContext } from "react";
import { loginUser } from "../repository/userRepository";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

/* ─── Inline styles & keyframes ─── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:ital,wght@0,400;0,500;0,600;1,400&display=swap');

  :root {
    --blue-deep:   #0f2d6b;
    --blue-mid:    #1a4db3;
    --blue-bright: #2d6ef5;
    --blue-light:  #e8f0fe;
    --blue-pale:   #f0f5ff;
    --white:       #ffffff;
    --text-dark:   #0f2040;
    --text-mid:    #4a6080;
    --text-muted:  #8ca0bc;
    --border:      #d0ddf0;
    --err:         #c0392b;
    --radius:      16px;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .lp-root {
    min-height: 100vh;
    display: flex;
    font-family: 'DM Sans', sans-serif;
    background: var(--white);
    overflow: hidden;
    position: relative;
  }

  /* ── Left panel (blue) ── */
  .lp-panel {
    display: none;
    position: relative;
    width: 46%;
    background: linear-gradient(155deg, var(--blue-deep) 0%, var(--blue-mid) 55%, var(--blue-bright) 100%);
    overflow: hidden;
    padding: 52px 48px;
    flex-direction: column;
    justify-content: space-between;
  }
  @media (min-width: 900px) { .lp-panel { display: flex; } }

  /* Geometric rings */
  .lp-ring {
    position: absolute;
    border-radius: 50%;
    border: 1px solid rgba(255,255,255,0.1);
    pointer-events: none;
  }
  .lp-ring-1 { width: 500px; height: 500px; top: -180px; right: -180px; }
  .lp-ring-2 { width: 340px; height: 340px; top: -80px;  right: -80px;  border-color: rgba(255,255,255,0.07); }
  .lp-ring-3 { width: 260px; height: 260px; bottom: -80px; left: -80px; }
  .lp-ring-4 { width: 160px; height: 160px; bottom: -20px; left: -20px; border-color: rgba(255,255,255,0.15); }

  /* Dot grid */
  .lp-dots {
    position: absolute; inset: 0;
    background-image: radial-gradient(circle, rgba(255,255,255,0.12) 1px, transparent 1px);
    background-size: 28px 28px;
    pointer-events: none;
  }

  .lp-panel-logo {
    display: flex;
    align-items: center;
    gap: 12px;
    position: relative;
    z-index: 2;
  }
  .lp-panel-logo-icon {
    width: 42px; height: 42px;
    background: rgba(255,255,255,0.15);
    border: 1px solid rgba(255,255,255,0.25);
    border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    font-family: 'Syne', sans-serif;
    font-size: 20px;
    font-weight: 800;
    color: #fff;
    letter-spacing: -1px;
  }
  .lp-panel-logo-name {
    font-family: 'Syne', sans-serif;
    font-weight: 700;
    font-size: 18px;
    color: #fff;
    letter-spacing: 0.02em;
  }

  .lp-panel-body {
    position: relative; z-index: 2;
  }
  .lp-panel-tagline {
    font-family: 'Syne', sans-serif;
    font-size: clamp(28px, 3.2vw, 40px);
    font-weight: 700;
    color: #fff;
    line-height: 1.18;
    margin-bottom: 16px;
  }
  .lp-panel-tagline span {
    color: rgba(255,255,255,0.5);
  }
  .lp-panel-desc {
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    color: rgba(255,255,255,0.6);
    line-height: 1.7;
    max-width: 300px;
  }

  /* Feature bullets */
  .lp-features {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 14px;
    position: relative; z-index: 2;
  }
  .lp-features li {
    display: flex;
    align-items: center;
    gap: 12px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    color: rgba(255,255,255,0.75);
  }
  .lp-feature-dot {
    width: 8px; height: 8px;
    border-radius: 50%;
    background: rgba(255,255,255,0.4);
    flex-shrink: 0;
  }

  /* ── Right panel (white / form) ── */
  .lp-form-side {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--white);
    padding: clamp(24px, 5vw, 60px) clamp(20px, 5vw, 56px);
    position: relative;
  }

  /* Subtle background grid on white side */
  .lp-form-side::before {
    content: '';
    position: absolute; inset: 0;
    background-image:
      linear-gradient(var(--blue-light) 1px, transparent 1px),
      linear-gradient(90deg, var(--blue-light) 1px, transparent 1px);
    background-size: 40px 40px;
    opacity: 0.35;
    pointer-events: none;
  }

  .lp-card {
    position: relative;
    z-index: 2;
    width: min(420px, 100%);
    background: var(--white);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: clamp(28px, 5vw, 44px) clamp(24px, 5vw, 40px);
    box-shadow:
      0 2px 8px rgba(15,45,107,0.06),
      0 16px 48px rgba(15,45,107,0.09);
    animation: rise 0.65s cubic-bezier(0.16,1,0.3,1) both;
  }
  @keyframes rise {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* Mobile logo (shown only when left panel is hidden) */
  .lp-mobile-logo {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 28px;
  }
  @media (min-width: 900px) { .lp-mobile-logo { display: none; } }
  .lp-mobile-logo-icon {
    width: 36px; height: 36px;
    background: var(--blue-bright);
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-family: 'Syne', sans-serif;
    font-size: 16px; font-weight: 800;
    color: #fff;
  }
  .lp-mobile-logo-name {
    font-family: 'Syne', sans-serif;
    font-weight: 700; font-size: 16px;
    color: var(--blue-deep);
  }

  /* Heading */
  .lp-heading {
    font-family: 'Syne', sans-serif;
    font-size: clamp(22px, 4vw, 28px);
    font-weight: 700;
    color: var(--text-dark);
    margin-bottom: 6px;
    line-height: 1.2;
  }
  .lp-sub {
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    color: var(--text-muted);
    margin-bottom: 32px;
    line-height: 1.5;
  }

  /* Fields */
  .lp-field {
    position: relative;
    margin-bottom: 18px;
  }
  .lp-field-icon {
    position: absolute;
    left: 14px; top: 50%;
    transform: translateY(-50%);
    color: var(--text-muted);
    font-size: 15px;
    pointer-events: none;
    transition: color 0.2s;
    line-height: 1;
  }
  .lp-field input {
    width: 100%;
    background: var(--blue-pale);
    border: 1.5px solid var(--border);
    border-radius: 10px;
    color: var(--text-dark);
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    padding: 14px 14px 14px 42px;
    outline: none;
    transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
  }
  .lp-field input::placeholder {
    color: var(--text-muted);
    font-size: 13px;
  }
  .lp-field input:focus {
    border-color: var(--blue-bright);
    background: var(--white);
    box-shadow: 0 0 0 3px rgba(45,110,245,0.1);
  }
  .lp-field input:focus ~ .lp-field-icon {
    color: var(--blue-bright);
  }

  /* Forgot link */
  .lp-forgot {
    display: block;
    text-align: right;
    font-family: 'DM Sans', sans-serif;
    font-size: 12px;
    color: var(--blue-bright);
    text-decoration: none;
    margin-top: -10px;
    margin-bottom: 24px;
    transition: color 0.2s;
  }
  .lp-forgot:hover { color: var(--blue-deep); }

  /* Button */
  .lp-btn {
    width: 100%;
    border: none;
    border-radius: 10px;
    padding: 15px 24px;
    font-family: 'Syne', sans-serif;
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 0.04em;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    background: linear-gradient(135deg, var(--blue-bright) 0%, var(--blue-mid) 100%);
    color: #fff;
    transition: transform 0.15s, box-shadow 0.2s, opacity 0.2s;
    box-shadow: 0 4px 18px rgba(45,110,245,0.3);
  }
  .lp-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 8px 28px rgba(45,110,245,0.4);
  }
  .lp-btn:active { transform: translateY(0); }
  .lp-btn-shine {
    position: absolute; inset: 0;
    background: linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.2) 50%, transparent 65%);
    transform: translateX(-100%);
    transition: transform 0.55s;
  }
  .lp-btn:hover .lp-btn-shine { transform: translateX(100%); }
  .lp-btn.loading { pointer-events: none; opacity: 0.75; }

  @keyframes spin { to { transform: rotate(360deg); } }
  .lp-spinner {
    display: inline-block;
    width: 13px; height: 13px;
    border: 2px solid rgba(255,255,255,0.35);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    vertical-align: middle;
    margin-right: 8px;
  }

  /* Badge under button */
  .lp-secure {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    margin-top: 14px;
    font-family: 'DM Sans', sans-serif;
    font-size: 11px;
    color: var(--text-muted);
    letter-spacing: 0.04em;
  }
  .lp-secure-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: #27ae60;
  }

  /* Error */
  .lp-error {
    margin-top: 16px;
    padding: 11px 14px;
    background: #fdf2f1;
    border: 1.5px solid #f5c0bb;
    border-radius: 8px;
    font-family: 'DM Sans', sans-serif;
    font-size: 12px;
    color: var(--err);
    animation: shake 0.35s ease both;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  @keyframes shake {
    0%,100% { transform: translateX(0); }
    25%      { transform: translateX(-5px); }
    75%      { transform: translateX(5px); }
  }

  /* Divider */
  .lp-divider {
    display: flex; align-items: center; gap: 12px;
    margin: 22px 0;
  }
  .lp-divider hr { flex: 1; border: none; border-top: 1px solid var(--border); }
  .lp-divider span { font-family: 'DM Sans', sans-serif; font-size: 11px; color: var(--text-muted); white-space: nowrap; }

  /* Footer */
  .lp-footer {
    margin-top: 24px;
    text-align: center;
    font-family: 'DM Sans', sans-serif;
    font-size: 12px;
    color: var(--text-muted);
  }
  .lp-footer a {
    font-family: 'DM Sans', sans-serif;
    color: var(--blue-bright);
    font-weight: 600;
    text-decoration: none;
    transition: color 0.2s;
  }
  .lp-footer a:hover { color: var(--blue-deep); }
`;

const LoginPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const response = await loginUser({ username, password });
            await login(response.user, response.token);
            navigate("/");
        } catch {
            setError("Invalid credentials. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <style>{styles}</style>
            <div className="lp-root">

                {/* ── Left blue panel ── */}
                <div className="lp-panel">
                    <div className="lp-dots" />
                    <div className="lp-ring lp-ring-1" />
                    <div className="lp-ring lp-ring-2" />
                    <div className="lp-ring lp-ring-3" />
                    <div className="lp-ring lp-ring-4" />

                    <div className="lp-panel-logo">
                        <div className="lp-panel-logo-icon">e</div>
                        <span className="lp-panel-logo-name">eParking Bitola</span>
                    </div>

                    <div className="lp-panel-body">
                        <h2 className="lp-panel-tagline">
                            Smart parking,<br />
                            <span>made simple.</span>
                        </h2>
                        <p className="lp-panel-desc">
                            Manage spaces, track availability, and access your dashboard — all in one place.
                        </p>
                    </div>

                    <ul className="lp-features">
                        <li><span className="lp-feature-dot" />Real-time space availability</li>
                        <li><span className="lp-feature-dot" />Instant reservation management</li>
                        <li><span className="lp-feature-dot" />Analytics & occupancy reports</li>
                    </ul>
                </div>

                {/* ── Right white form side ── */}
                <div className="lp-form-side">
                    <div className="lp-card">

                        {/* Mobile-only logo */}
                        <div className="lp-mobile-logo">
                            <div className="lp-mobile-logo-icon">e</div>
                            <span className="lp-mobile-logo-name">eParking Bitola</span>
                        </div>

                        <h1 className="lp-heading">Welcome back</h1>
                        <p className="lp-sub">Sign in to access your parking dashboard</p>

                        <form onSubmit={handleLogin}>
                            <div className="lp-field">
                                <input
                                    type="text"
                                    id="username"
                                    placeholder="Enter your username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    autoComplete="username"
                                />
                                <span className="lp-field-icon">👤</span>
                            </div>

                            <div className="lp-field">
                                <input
                                    type="password"
                                    id="password"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    autoComplete="current-password"
                                />
                                <span className="lp-field-icon">🔒</span>
                            </div>

                            <a href="/forgot-password" className="lp-forgot">Forgot password?</a>

                            <button
                                type="submit"
                                className={`lp-btn${loading ? " loading" : ""}`}
                            >
                                <span className="lp-btn-shine" />
                                {loading && <span className="lp-spinner" />}
                                {loading ? "Signing in…" : "Sign in"}
                            </button>
                        </form>

                        <div className="lp-secure">
                            <span className="lp-secure-dot" />
                            Secured with 256-bit encryption
                        </div>

                        {error && (
                            <p className="lp-error">
                                <span>⚠</span> {error}
                            </p>
                        )}

                        <div className="lp-divider">
                            <hr /><span>no account yet?</span><hr />
                        </div>

                        <p className="lp-footer">
                            <a href="/register">Create an account</a>
                        </p>
                    </div>
                </div>

            </div>
        </>
    );
};

export default LoginPage;
