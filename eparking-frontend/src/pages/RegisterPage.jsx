import React, { useState } from "react";
import { registerUser } from "../repository/userRepository";
import { useNavigate } from "react-router-dom";

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

  .rp-root {
    min-height: 100vh;
    display: flex;
    font-family: 'DM Sans', sans-serif;
    background: var(--white);
    overflow: hidden;
    position: relative;
  }

  /* ── Left panel (blue) ── */
  .rp-panel {
    display: none;
    position: relative;
    width: 46%;
    background: linear-gradient(155deg, var(--blue-deep) 0%, var(--blue-mid) 55%, var(--blue-bright) 100%);
    overflow: hidden;
    padding: 52px 48px;
    flex-direction: column;
    justify-content: space-between;
  }
  @media (min-width: 900px) { .rp-panel { display: flex; } }

  .rp-ring {
    position: absolute;
    border-radius: 50%;
    border: 1px solid rgba(255,255,255,0.1);
    pointer-events: none;
  }
  .rp-ring-1 { width: 500px; height: 500px; top: -180px; right: -180px; }
  .rp-ring-2 { width: 340px; height: 340px; top: -80px;  right: -80px;  border-color: rgba(255,255,255,0.07); }
  .rp-ring-3 { width: 260px; height: 260px; bottom: -80px; left: -80px; }
  .rp-ring-4 { width: 160px; height: 160px; bottom: -20px; left: -20px; border-color: rgba(255,255,255,0.15); }

  .rp-dots {
    position: absolute; inset: 0;
    background-image: radial-gradient(circle, rgba(255,255,255,0.12) 1px, transparent 1px);
    background-size: 28px 28px;
    pointer-events: none;
  }

  .rp-panel-logo {
    display: flex;
    align-items: center;
    gap: 12px;
    position: relative;
    z-index: 2;
  }
  .rp-panel-logo-icon {
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
  .rp-panel-logo-name {
    font-family: 'Syne', sans-serif;
    font-weight: 700;
    font-size: 18px;
    color: #fff;
    letter-spacing: 0.02em;
  }

  .rp-panel-body {
    position: relative; z-index: 2;
  }
  .rp-panel-tagline {
    font-family: 'Syne', sans-serif;
    font-size: clamp(28px, 3.2vw, 40px);
    font-weight: 700;
    color: #fff;
    line-height: 1.18;
    margin-bottom: 16px;
  }
  .rp-panel-tagline span {
    color: rgba(255,255,255,0.5);
  }
  .rp-panel-desc {
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    color: rgba(255,255,255,0.6);
    line-height: 1.7;
    max-width: 300px;
  }

  .rp-features {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 14px;
    position: relative; z-index: 2;
  }
  .rp-features li {
    display: flex;
    align-items: center;
    gap: 12px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    color: rgba(255,255,255,0.75);
  }
  .rp-feature-dot {
    width: 8px; height: 8px;
    border-radius: 50%;
    background: rgba(255,255,255,0.4);
    flex-shrink: 0;
  }

  /* ── Right panel (white / form) ── */
  .rp-form-side {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--white);
    padding: clamp(24px, 5vw, 60px) clamp(20px, 5vw, 56px);
    position: relative;
  }

  .rp-form-side::before {
    content: '';
    position: absolute; inset: 0;
    background-image:
      linear-gradient(var(--blue-light) 1px, transparent 1px),
      linear-gradient(90deg, var(--blue-light) 1px, transparent 1px);
    background-size: 40px 40px;
    opacity: 0.35;
    pointer-events: none;
  }

  .rp-card {
    position: relative;
    z-index: 2;
    width: min(460px, 100%);
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

  /* Mobile logo */
  .rp-mobile-logo {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 28px;
  }
  @media (min-width: 900px) { .rp-mobile-logo { display: none; } }
  .rp-mobile-logo-icon {
    width: 36px; height: 36px;
    background: var(--blue-bright);
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-family: 'Syne', sans-serif;
    font-size: 16px; font-weight: 800;
    color: #fff;
  }
  .rp-mobile-logo-name {
    font-family: 'Syne', sans-serif;
    font-weight: 700; font-size: 16px;
    color: var(--blue-deep);
  }

  .rp-heading {
    font-family: 'Syne', sans-serif;
    font-size: clamp(22px, 4vw, 28px);
    font-weight: 700;
    color: var(--text-dark);
    margin-bottom: 6px;
    line-height: 1.2;
  }
  .rp-sub {
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    color: var(--text-muted);
    margin-bottom: 28px;
    line-height: 1.5;
  }

  /* Two-column grid for name + surname */
  .rp-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
  }

  /* Fields */
  .rp-field {
    position: relative;
    margin-bottom: 16px;
  }
  .rp-field-icon {
    position: absolute;
    left: 14px; top: 50%;
    transform: translateY(-50%);
    color: var(--text-muted);
    font-size: 15px;
    pointer-events: none;
    transition: color 0.2s;
    line-height: 1;
  }
  .rp-field input {
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
  .rp-field input::placeholder {
    color: var(--text-muted);
    font-size: 13px;
  }
  .rp-field input:focus {
    border-color: var(--blue-bright);
    background: var(--white);
    box-shadow: 0 0 0 3px rgba(45,110,245,0.1);
  }
  .rp-field input:focus ~ .rp-field-icon {
    color: var(--blue-bright);
  }

  /* Button */
  .rp-btn {
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
    margin-top: 8px;
  }
  .rp-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 8px 28px rgba(45,110,245,0.4);
  }
  .rp-btn:active { transform: translateY(0); }
  .rp-btn-shine {
    position: absolute; inset: 0;
    background: linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.2) 50%, transparent 65%);
    transform: translateX(-100%);
    transition: transform 0.55s;
  }
  .rp-btn:hover .rp-btn-shine { transform: translateX(100%); }
  .rp-btn.loading { pointer-events: none; opacity: 0.75; }

  @keyframes spin { to { transform: rotate(360deg); } }
  .rp-spinner {
    display: inline-block;
    width: 13px; height: 13px;
    border: 2px solid rgba(255,255,255,0.35);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    vertical-align: middle;
    margin-right: 8px;
  }

  /* Secure badge */
  .rp-secure {
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
  .rp-secure-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: #27ae60;
  }

  /* Error */
  .rp-error {
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
  .rp-divider {
    display: flex; align-items: center; gap: 12px;
    margin: 22px 0;
  }
  .rp-divider hr { flex: 1; border: none; border-top: 1px solid var(--border); }
  .rp-divider span { font-family: 'DM Sans', sans-serif; font-size: 11px; color: var(--text-muted); white-space: nowrap; }

  /* Footer */
  .rp-footer {
    margin-top: 24px;
    text-align: center;
    font-family: 'DM Sans', sans-serif;
    font-size: 12px;
    color: var(--text-muted);
  }
  .rp-footer a {
    font-family: 'DM Sans', sans-serif;
    color: var(--blue-bright);
    font-weight: 600;
    text-decoration: none;
    transition: color 0.2s;
  }
  .rp-footer a:hover { color: var(--blue-deep); }
`;

const RegisterPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await registerUser({ username, password, name, surname, email });
            navigate("/login");
        } catch {
            setError("Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <style>{styles}</style>
            <div className="rp-root">

                {/* ── Left blue panel ── */}
                <div className="rp-panel">
                    <div className="rp-dots" />
                    <div className="rp-ring rp-ring-1" />
                    <div className="rp-ring rp-ring-2" />
                    <div className="rp-ring rp-ring-3" />
                    <div className="rp-ring rp-ring-4" />

                    <div className="rp-panel-logo">
                        <div className="rp-panel-logo-icon">e</div>
                        <span className="rp-panel-logo-name">eParking Bitola</span>
                    </div>

                    <div className="rp-panel-body">
                        <h2 className="rp-panel-tagline">
                            Join us today,<br />
                            <span>park smarter.</span>
                        </h2>
                        <p className="rp-panel-desc">
                            Create your account and start managing parking spaces, reservations, and analytics — all in one place.
                        </p>
                    </div>

                    <ul className="rp-features">
                        <li><span className="rp-feature-dot" />Real-time space availability</li>
                        <li><span className="rp-feature-dot" />Instant reservation management</li>
                        <li><span className="rp-feature-dot" />Secure &amp; encrypted data</li>
                    </ul>
                </div>

                {/* ── Right white panel (form) ── */}
                <div className="rp-form-side">
                    <div className="rp-card">

                        {/* Mobile-only logo */}
                        <div className="rp-mobile-logo">
                            <div className="rp-mobile-logo-icon">e</div>
                            <span className="rp-mobile-logo-name">eParking Bitola</span>
                        </div>

                        <h2 className="rp-heading">Create your account</h2>
                        <p className="rp-sub">Fill in your details to get started with eParking.</p>

                        <form onSubmit={handleRegister}>
                            {/* Username */}
                            <div className="rp-field">
                                <input
                                    type="text"
                                    id="username"
                                    placeholder="Username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                                <span className="rp-field-icon">👤</span>
                            </div>

                            {/* Name + Surname */}
                            <div className="rp-row">
                                <div className="rp-field">
                                    <input
                                        type="text"
                                        id="name"
                                        placeholder="First name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                    <span className="rp-field-icon">✏️</span>
                                </div>
                                <div className="rp-field">
                                    <input
                                        type="text"
                                        id="surname"
                                        placeholder="Last name"
                                        value={surname}
                                        onChange={(e) => setSurname(e.target.value)}
                                        required
                                    />
                                    <span className="rp-field-icon">✏️</span>
                                </div>
                            </div>

                            {/* Email */}
                            <div className="rp-field">
                                <input
                                    type="email"
                                    id="email"
                                    placeholder="Email address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                <span className="rp-field-icon">📧</span>
                            </div>

                            {/* Password */}
                            <div className="rp-field">
                                <input
                                    type="password"
                                    id="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <span className="rp-field-icon">🔒</span>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                className={`rp-btn${loading ? " loading" : ""}`}
                                disabled={loading}
                            >
                                <span className="rp-btn-shine" />
                                {loading && <span className="rp-spinner" />}
                                {loading ? "Creating account…" : "Create account"}
                            </button>
                        </form>

                        <div className="rp-secure">
                            <span className="rp-secure-dot" />
                            256-bit SSL encrypted
                        </div>

                        {error && (
                            <div className="rp-error">
                                <span>⚠️</span> {error}
                            </div>
                        )}

                        <div className="rp-divider">
                            <hr /><span>OR</span><hr />
                        </div>

                        <p className="rp-footer">
                            Already have an account?{" "}
                            <a href="/login">Sign in</a>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default RegisterPage;
