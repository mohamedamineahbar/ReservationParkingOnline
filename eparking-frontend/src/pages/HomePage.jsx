// src/pages/HomePage.jsx
import React, { useEffect, useRef, useState, useCallback } from 'react';

/* ─── tiny hooks ─────────────────────────────── */
const useInView = (opts = {}) => {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } },
      { threshold: 0.15, ...opts }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, seen];
};

const useCounter = (target, active) => {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!active) return;
    const dur = 1800;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setN(Math.round(ease * target));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [active, target]);
  return n;
};

/* ─── parking lot SVG visual ─────────────────── */
const ParkingVisual = () => (
  <svg viewBox="0 0 480 200" fill="none" xmlns="http://www.w3.org/2000/svg"
    style={{ width: '100%', maxWidth: 480, display: 'block' }}>
    {/* ground */}
    <rect x="20" y="140" width="440" height="40" rx="6" fill="#1e3a8a" opacity=".07" />
    {/* road markings */}
    {[60,120,180,240,300,360].map(x => (
      <rect key={x} x={x} y="148" width="36" height="4" rx="2" fill="#93c5fd" opacity=".5" />
    ))}
    {/* Car 1 – blue, parked */}
    <g transform="translate(48,90)">
      <rect width="72" height="52" rx="10" fill="#2563eb" />
      <rect x="8" y="6" width="56" height="22" rx="6" fill="#bfdbfe" opacity=".9" />
      <rect x="14" y="7" width="20" height="18" rx="4" fill="#93c5fd" />
      <rect x="38" y="7" width="20" height="18" rx="4" fill="#93c5fd" />
      <circle cx="14" cy="46" r="6" fill="#1e3a8a" />
      <circle cx="58" cy="46" r="6" fill="#1e3a8a" />
      <circle cx="14" cy="46" r="3" fill="#60a5fa" />
      <circle cx="58" cy="46" r="3" fill="#60a5fa" />
    </g>
    {/* Car 2 – slate, driving in */}
    <g transform="translate(160,88)">
      <rect width="72" height="52" rx="10" fill="#475569" />
      <rect x="8" y="6" width="56" height="22" rx="6" fill="#e2e8f0" opacity=".8" />
      <rect x="14" y="7" width="20" height="18" rx="4" fill="#cbd5e1" />
      <rect x="38" y="7" width="20" height="18" rx="4" fill="#cbd5e1" />
      <circle cx="14" cy="46" r="6" fill="#1e293b" />
      <circle cx="58" cy="46" r="6" fill="#1e293b" />
      <circle cx="14" cy="46" r="3" fill="#94a3b8" />
      <circle cx="58" cy="46" r="3" fill="#94a3b8" />
      {/* Available badge */}
      <rect x="8" y="-18" width="56" height="14" rx="7" fill="#10b981" />
      <text x="36" y="-8" textAnchor="middle" fill="white" fontSize="8" fontWeight="700" fontFamily="sans-serif">AVAILABLE</text>
    </g>
    {/* Car 3 – amber */}
    <g transform="translate(272,90)">
      <rect width="72" height="52" rx="10" fill="#d97706" />
      <rect x="8" y="6" width="56" height="22" rx="6" fill="#fde68a" opacity=".9" />
      <rect x="14" y="7" width="20" height="18" rx="4" fill="#fcd34d" />
      <rect x="38" y="7" width="20" height="18" rx="4" fill="#fcd34d" />
      <circle cx="14" cy="46" r="6" fill="#92400e" />
      <circle cx="58" cy="46" r="6" fill="#92400e" />
      <circle cx="14" cy="46" r="3" fill="#fbbf24" />
      <circle cx="58" cy="46" r="3" fill="#fbbf24" />
    </g>
    {/* Empty spot */}
    <rect x="380" y="90" width="72" height="52" rx="10" fill="none"
      stroke="#93c5fd" strokeWidth="2" strokeDasharray="6 4" />
    <text x="416" y="122" textAnchor="middle" fill="#3b82f6" fontSize="22"
      fontWeight="800" fontFamily="sans-serif">P</text>
    {/* Spot numbers */}
    {[84,196,308].map((x,i) => (
      <text key={i} x={x} y="172" textAnchor="middle" fill="#94a3b8"
        fontSize="11" fontFamily="sans-serif" fontWeight="600">{`A-0${i+1}`}</text>
    ))}
    <text x="416" y="172" textAnchor="middle" fill="#3b82f6"
      fontSize="11" fontFamily="sans-serif" fontWeight="600">A-04</text>
    {/* Overhead sign */}
    <rect x="30" y="20" width="420" height="42" rx="10" fill="#1e3a8a" opacity=".06" />
    <text x="240" y="47" textAnchor="middle" fill="#1e3a8a" fontSize="13"
      fontFamily="sans-serif" fontWeight="700" opacity=".5" letterSpacing="3">PARKING LOT A — CITY CENTER</text>
  </svg>
);

/* ─── stat item ──────────────────────────────── */
const Stat = ({ value, suffix, label, active }) => {
  const n = useCounter(value, active);
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{
        fontFamily: "'Syne', sans-serif",
        fontSize: 'clamp(2.2rem, 5vw, 3.2rem)',
        fontWeight: 800,
        color: '#0f172a',
        lineHeight: 1,
        letterSpacing: '-0.03em',
      }}>
        {n.toLocaleString()}{suffix}
      </div>
      <div style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '0.4rem', fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
        {label}
      </div>
    </div>
  );
};

/* ─── step ───────────────────────────────────── */
const Step = ({ num, title, body, seen, delay }) => (
  <div style={{
    opacity: seen ? 1 : 0,
    transform: seen ? 'none' : 'translateY(28px)',
    transition: `opacity .7s ${delay}s, transform .7s ${delay}s`,
  }}>
    <div style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      width: 44, height: 44, borderRadius: '50%',
      border: '2px solid #2563eb', color: '#2563eb',
      fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: '1rem',
      marginBottom: '1rem',
    }}>{num}</div>
    <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', marginBottom: '.4rem' }}>{title}</h3>
    <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: 1.7, margin: 0 }}>{body}</p>
  </div>
);

/* ─── feature card ───────────────────────────── */
const Feature = ({ title, body, accent, seen, delay }) => (
  <div style={{
    padding: '1.8rem',
    border: '1px solid #e2e8f0',
    borderRadius: '16px',
    background: '#fff',
    opacity: seen ? 1 : 0,
    transform: seen ? 'none' : 'translateY(24px)',
    transition: `opacity .6s ${delay}s, transform .6s ${delay}s, box-shadow .25s`,
    cursor: 'default',
  }}
    onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 12px 40px rgba(15,23,42,.1)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
    onMouseLeave={e => { e.currentTarget.style.boxShadow = ''; e.currentTarget.style.transform = seen ? 'none' : 'translateY(24px)'; }}
  >
    <div style={{ width: 36, height: 4, borderRadius: 2, background: accent, marginBottom: '1.2rem' }} />
    <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '.5rem' }}>{title}</h3>
    <p style={{ fontSize: '0.88rem', color: '#64748b', lineHeight: 1.7, margin: 0 }}>{body}</p>
  </div>
);

/* ─── testimonial ────────────────────────────── */
const Review = ({ name, role, text, seen, delay }) => (
  <div style={{
    background: '#fff',
    border: '1px solid #e2e8f0',
    borderRadius: '16px',
    padding: '1.6rem',
    opacity: seen ? 1 : 0,
    transform: seen ? 'none' : 'translateY(20px)',
    transition: `opacity .6s ${delay}s, transform .6s ${delay}s`,
  }}>
    <div style={{ display: 'flex', gap: 3, marginBottom: '1rem' }}>
      {[...Array(5)].map((_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="#f59e0b">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
    <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.75, marginBottom: '1.2rem', fontStyle: 'italic' }}>"{text}"</p>
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
      <div style={{
        width: 38, height: 38, borderRadius: '50%',
        background: '#1e3a8a',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: '0.9rem', color: '#93c5fd',
      }}>{name[0]}</div>
      <div>
        <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#0f172a', fontFamily: "'Syne', sans-serif" }}>{name}</div>
        <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{role}</div>
      </div>
    </div>
  </div>
);

/* ═══════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════ */
export default function HomePage() {
  const [loaded, setLoaded] = useState(false);
  const [statsRef, statsVisible] = useInView();
  const [stepsRef, stepsVisible] = useInView();
  const [featRef, featVisible] = useInView();
  const [revRef, revVisible] = useInView();
  const [ctaRef, ctaVisible] = useInView();

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:ital,wght@0,400;0,500;0,600;1,400&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .ep-root {
          font-family: 'DM Sans', sans-serif;
          background: #f8fafc;
          color: #0f172a;
        }

        @keyframes bgScroll {
          from { background-position: 0 0; }
          to   { background-position: 64px 64px; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(32px); }
          to   { opacity: 1; transform: none; }
        }
        @keyframes floatY {
          0%,100% { transform: translateY(0); }
          50%      { transform: translateY(-12px); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }

        .ep-hero-bg {
          background-image: radial-gradient(circle, #bfdbfe 1px, transparent 1px);
          background-size: 32px 32px;
          animation: bgScroll 20s linear infinite;
        }

        .ep-visual-wrap {
          animation: floatY 6s ease-in-out infinite;
        }

        .ep-btn-primary {
          display: inline-flex;
          align-items: center;
          gap: .5rem;
          background: #1e3a8a;
          color: #fff;
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: .95rem;
          padding: .78rem 1.8rem;
          border-radius: 10px;
          text-decoration: none;
          border: none;
          cursor: pointer;
          transition: background .2s, transform .15s, box-shadow .2s;
          letter-spacing: .01em;
        }
        .ep-btn-primary:hover {
          background: #1d4ed8;
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(30,58,138,.28);
        }
        .ep-btn-primary:active { transform: scale(.97); }

        .ep-btn-ghost {
          display: inline-flex;
          align-items: center;
          gap: .5rem;
          background: transparent;
          color: #1e3a8a;
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: .95rem;
          padding: .76rem 1.8rem;
          border-radius: 10px;
          text-decoration: none;
          border: 1.5px solid #1e3a8a;
          cursor: pointer;
          transition: background .2s, transform .15s;
          letter-spacing: .01em;
        }
        .ep-btn-ghost:hover {
          background: #eff6ff;
          transform: translateY(-2px);
        }

        .ep-link {
          display: inline-flex;
          align-items: center;
          gap: .35rem;
          color: #2563eb;
          font-weight: 600;
          font-size: .9rem;
          text-decoration: none;
          transition: gap .2s;
        }
        .ep-link:hover { gap: .6rem; }

        .ep-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, #e2e8f0 30%, #e2e8f0 70%, transparent);
          border: none;
          margin: 0;
        }

        .ep-section {
          padding: 5rem 1.5rem;
          max-width: 1140px;
          margin: 0 auto;
        }

        .ep-label {
          display: inline-block;
          font-size: .72rem;
          font-weight: 700;
          letter-spacing: .12em;
          text-transform: uppercase;
          color: #2563eb;
          background: #eff6ff;
          border: 1px solid #bfdbfe;
          border-radius: 999px;
          padding: .22rem .85rem;
          margin-bottom: .9rem;
        }

        .ep-heading {
          font-family: 'Syne', sans-serif;
          font-size: clamp(1.7rem, 4vw, 2.4rem);
          font-weight: 800;
          color: #0f172a;
          line-height: 1.15;
          letter-spacing: -.025em;
        }

        .ep-stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0;
        }
        @media (max-width: 640px) {
          .ep-stats-grid { grid-template-columns: repeat(2, 1fr); }
        }

        .ep-stat-sep {
          border-right: 1px solid #e2e8f0;
        }
        .ep-stat-sep:last-child { border-right: none; }

        .ep-steps-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 2.5rem;
        }

        .ep-features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1.25rem;
        }

        .ep-reviews-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 1.25rem;
        }

        .ep-footer-grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr 1fr 1fr;
          gap: 2.5rem;
        }
        @media (max-width: 768px) {
          .ep-footer-grid { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 480px) {
          .ep-footer-grid { grid-template-columns: 1fr; }
        }

        .ep-footer-link {
          display: block;
          color: #94a3b8;
          text-decoration: none;
          font-size: .88rem;
          margin-bottom: .5rem;
          transition: color .2s;
        }
        .ep-footer-link:hover { color: #e2e8f0; }
      `}</style>

      <div className="ep-root">

        {/* ── HERO ─────────────────────────────── */}
        <section style={{ position: 'relative', overflow: 'hidden', background: '#f0f6ff' }}>
          <div className="ep-hero-bg" style={{ position: 'absolute', inset: 0, opacity: .35, zIndex: 0 }} />

          {/* gradient fade bottom */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 120,
            background: 'linear-gradient(to bottom, transparent, #f8fafc)', zIndex: 1 }} />

          <div style={{ position: 'relative', zIndex: 2, maxWidth: 1140, margin: '0 auto',
            padding: '5rem 1.5rem 4rem',
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}
            className="ep-hero-grid"
          >
            <style>{`.ep-hero-grid { grid-template-columns: 1fr 1fr; }
              @media(max-width:768px){ .ep-hero-grid{ grid-template-columns:1fr; text-align:center; } }
            `}</style>

            {/* left copy */}
            <div style={{
              opacity: loaded ? 1 : 0,
              transform: loaded ? 'none' : 'translateY(24px)',
              transition: 'opacity .8s, transform .8s',
            }}>
              <div className="ep-label">Bitola, Morocco</div>
              <h1 style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: 'clamp(2rem, 5vw, 3.2rem)',
                fontWeight: 800,
                color: '#0f172a',
                lineHeight: 1.1,
                letterSpacing: '-.03em',
                marginBottom: '1.2rem',
              }}>
                Park smarter.<br />
                <span style={{ color: '#2563eb' }}>Stress less.</span>
              </h1>
              <p style={{ fontSize: '1.05rem', color: '#475569', lineHeight: 1.8,
                marginBottom: '2rem', maxWidth: 420 }}>
                Find, reserve, and check in to parking spots across Bitola —
                in seconds. Real-time availability, zero guesswork.
              </p>

              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
                <a href="/register" className="ep-btn-primary">Get Started</a>
                <a href="/login" className="ep-btn-ghost">Login</a>
              </div>

              <a href="/parking-lots" className="ep-link">
                View all parking lots
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </a>

              {/* trust badges */}
              <div style={{ display: 'flex', gap: '1.5rem', marginTop: '2.2rem', flexWrap: 'wrap' }}>
                {[['12', 'Parking Lots'], ['500+', 'Spots'], ['24/7', 'Online']].map(([v, l]) => (
                  <div key={l} style={{ display: 'flex', alignItems: 'center', gap: '.4rem' }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981' }} />
                    <span style={{ fontWeight: 700, fontSize: '.85rem', color: '#0f172a' }}>{v}</span>
                    <span style={{ fontSize: '.82rem', color: '#94a3b8' }}>{l}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* right visual */}
            <div className="ep-visual-wrap" style={{
              opacity: loaded ? 1 : 0,
              transition: 'opacity 1s .3s',
              background: '#fff',
              borderRadius: 24,
              boxShadow: '0 24px 72px rgba(15,23,42,.12), 0 2px 8px rgba(15,23,42,.06)',
              padding: '2rem 1.5rem',
              border: '1px solid #e2e8f0',
            }}>
              {/* mini status bar */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                marginBottom: '1rem' }}>
                <span style={{ fontSize: '.78rem', fontWeight: 700, color: '#94a3b8',
                  letterSpacing: '.08em', textTransform: 'uppercase' }}>Live View</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '.4rem' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981',
                    boxShadow: '0 0 0 3px rgba(16,185,129,.2)', animation: 'pulse 2s infinite' }} />
                  <span style={{ fontSize: '.78rem', color: '#10b981', fontWeight: 600 }}>Live</span>
                </div>
              </div>
              <style>{`@keyframes pulse { 0%,100%{box-shadow:0 0 0 3px rgba(16,185,129,.2)} 50%{box-shadow:0 0 0 7px rgba(16,185,129,.0)} }`}</style>

              <ParkingVisual />

              {/* legend */}
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem',
                flexWrap: 'wrap', justifyContent: 'center' }}>
                {[['#10b981','Available'],['#2563eb','Occupied'],['#d97706','Reserved']].map(([c,l]) => (
                  <div key={l} style={{ display: 'flex', alignItems: 'center', gap: '.35rem' }}>
                    <div style={{ width: 10, height: 10, borderRadius: 3, background: c }} />
                    <span style={{ fontSize: '.78rem', color: '#64748b', fontWeight: 500 }}>{l}</span>
                  </div>
                ))}
              </div>

              {/* CTA inside card */}
              <div style={{ marginTop: '1.2rem', padding: '1rem', background: '#f0f6ff',
                borderRadius: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '.9rem', color: '#0f172a' }}>A-04 is free right now</div>
                  <div style={{ fontSize: '.78rem', color: '#64748b' }}>City Center — 2 min walk</div>
                </div>
                <a href="/parking-lots" className="ep-btn-primary" style={{ padding: '.55rem 1.1rem', fontSize: '.82rem' }}>
                  Reserve
                </a>
              </div>
            </div>
          </div>
        </section>

        <hr className="ep-divider" />

        {/* ── STATS ────────────────────────────── */}
        <section style={{ background: '#fff', padding: '3rem 1.5rem' }}>
          <div ref={statsRef} className="ep-stats-grid" style={{ maxWidth: 1140, margin: '0 auto' }}>
            {[
              { v: 1200, s: '+', l: 'Registered Users' },
              { v: 500,  s: '+', l: 'Parking Spots' },
              { v: 12,   s: '',  l: 'Lots in Bitola' },
              { v: 98,   s: '%', l: 'Satisfaction Rate' },
            ].map(({ v, s, l }, i) => (
              <div key={l} className={i < 3 ? 'ep-stat-sep' : ''} style={{ padding: '1.8rem 1rem' }}>
                <Stat value={v} suffix={s} label={l} active={statsVisible} />
              </div>
            ))}
          </div>
        </section>

        <hr className="ep-divider" />

        {/* ── HOW IT WORKS ─────────────────────── */}
        <section style={{ background: '#f8fafc' }}>
          <div className="ep-section">
            <div style={{ marginBottom: '3rem' }}>
              <div className="ep-label">How it works</div>
              <h2 className="ep-heading">Ready in three steps</h2>
            </div>
            <div ref={stepsRef} className="ep-steps-grid">
              <Step num="01" title="Pick your lot" body="Browse the map and choose a parking lot close to where you're headed. See real-time spot availability before you commit." seen={stepsVisible} delay={0} />
              <Step num="02" title="Reserve your spot" body="Tap to reserve — it's instant. Get a confirmation with your spot number and arrival window." seen={stepsVisible} delay={.15} />
              <Step num="03" title="Arrive and check in" body="Drive in, tap Check-In, and you're done. The barrier opens, the app tracks your time, and you park stress-free." seen={stepsVisible} delay={.3} />
            </div>
          </div>
        </section>

        <hr className="ep-divider" />

        {/* ── FEATURES ─────────────────────────── */}
        <section id="about-section" style={{ background: '#fff' }}>
          <div className="ep-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
              flexWrap: 'wrap', gap: '1rem', marginBottom: '2.5rem' }}>
              <div>
                <div className="ep-label">Features</div>
                <h2 className="ep-heading">Everything you need,<br />nothing you don't</h2>
              </div>
              <a href="/register" className="ep-link" style={{ marginBottom: '.4rem' }}>
                Start for free
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
            <div ref={featRef} className="ep-features-grid">
              {[
                { title: 'Real-time availability', body: 'See live spot counts across all lots. Updates every 30 seconds so you always have the latest picture.', accent: '#2563eb', delay: 0 },
                { title: 'One-tap reservations', body: 'Reserve in under five seconds. Choose your arrival window and receive an instant booking confirmation.', accent: '#10b981', delay: .1 },
                { title: 'Seamless check-in', body: 'No paper tickets. No barriers to operate manually. Just tap Check-In and the system handles the rest.', accent: '#f59e0b', delay: .2 },
                { title: 'Parking history', body: 'Every reservation, every payment in one place. Useful for expense reports or just keeping track.', accent: '#8b5cf6', delay: .3 },
                { title: 'Smart reminders', body: "Get a notification before your time runs out so you're never caught off guard or fined.", accent: '#ef4444', delay: .4 },
                { title: 'Flexible payments', body: 'Pay online when you book or on-site when you leave. Card, cash, and digital wallets accepted.', accent: '#0ea5e9', delay: .5 },
              ].map(f => (
                <Feature key={f.title} {...f} seen={featVisible} />
              ))}
            </div>
          </div>
        </section>

        <hr className="ep-divider" />

        {/* ── TESTIMONIALS ─────────────────────── */}
        <section style={{ background: '#f8fafc' }}>
          <div className="ep-section">
            <div style={{ marginBottom: '2.5rem' }}>
              <div className="ep-label">From our users</div>
              <h2 className="ep-heading">Real people, real results</h2>
            </div>
            <div ref={revRef} className="ep-reviews-grid">
              {[
                { name: 'Ana Petrova', role: 'Daily commuter', text: "I used to spend 15 minutes circling the city center every morning. Now I reserve on my way out the door and drive straight in. It sounds simple, but it genuinely changed my day.", delay: 0 },
                { name: 'Marko Iliev', role: 'Business owner, Bitola', text: "My clients used to complain about parking before meetings. Now I just send them the link and they sort it themselves. The whole thing takes two minutes. Highly recommend.", delay: .15 },
                { name: 'Elena Kostadinova', role: 'University student', text: "The pricing is fair and the app is really clean. I like that I can see exactly which spot is free on the map. Never had a problem in six months of using it.", delay: .3 },
              ].map(r => <Review key={r.name} {...r} seen={revVisible} />)}
            </div>
          </div>
        </section>

        {/* ── CTA BAND ─────────────────────────── */}
        <section style={{ background: '#1e3a8a', padding: '4rem 1.5rem' }}>
          <div ref={ctaRef} style={{
            maxWidth: 680, margin: '0 auto', textAlign: 'center',
            opacity: ctaVisible ? 1 : 0,
            transform: ctaVisible ? 'none' : 'translateY(24px)',
            transition: 'opacity .7s, transform .7s',
          }}>
            <h2 style={{
              fontFamily: "'Syne', sans-serif", fontWeight: 800,
              fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', color: '#fff',
              letterSpacing: '-.025em', marginBottom: '1rem',
            }}>
              Stop hunting for parking.<br />Start reserving it.
            </h2>
            <p style={{ color: '#93c5fd', fontSize: '1rem', lineHeight: 1.7, marginBottom: '2rem' }}>
              Join over 1,200 drivers in Bitola who already park smarter every day.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="/register" style={{
                display: 'inline-flex', alignItems: 'center', gap: '.5rem',
                background: '#fff', color: '#1e3a8a',
                fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '.95rem',
                padding: '.78rem 1.8rem', borderRadius: 10, textDecoration: 'none',
                transition: 'background .2s, transform .15s',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = '#eff6ff'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.transform = 'none'; }}
              >Create free account</a>
              <a href="/parking-lots" style={{
                display: 'inline-flex', alignItems: 'center', gap: '.5rem',
                background: 'transparent', color: '#93c5fd',
                fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '.95rem',
                padding: '.76rem 1.8rem', borderRadius: 10, textDecoration: 'none',
                border: '1.5px solid rgba(147,197,253,.4)',
                transition: 'border-color .2s, transform .15s',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#93c5fd'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(147,197,253,.4)'; e.currentTarget.style.transform = 'none'; }}
              >Browse parking lots</a>
            </div>
          </div>
        </section>

        {/* ── FOOTER ───────────────────────────── */}
        <footer id="contact-section" style={{ background: '#0f172a', padding: '3.5rem 1.5rem 2rem' }}>
          <div style={{ maxWidth: 1140, margin: '0 auto' }}>
            <div className="ep-footer-grid" style={{ marginBottom: '2.5rem' }}>
              <div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: '1.2rem',
                  color: '#fff', marginBottom: '.8rem', letterSpacing: '-.02em' }}>
                  eParking Bitola
                </div>
                <p style={{ fontSize: '.85rem', color: '#64748b', lineHeight: 1.7, maxWidth: 240 }}>
                  The fastest way to find and reserve parking in Bitola. Built for the city, designed for real people.
                </p>
              </div>

              <div>
                <div style={{ fontSize: '.72rem', fontWeight: 700, letterSpacing: '.1em',
                  textTransform: 'uppercase', color: '#475569', marginBottom: '1rem' }}>Navigation</div>
                <a href="/" className="ep-footer-link">Home</a>
                <a href="/parking-lots" className="ep-footer-link">Parking Lots</a>
                <a href="#" className="ep-footer-link" onClick={(e) => { e.preventDefault(); document.getElementById('about-section')?.scrollIntoView({ behavior: 'smooth' }); }}>About Us</a>
                <a href="#" className="ep-footer-link" onClick={(e) => { e.preventDefault(); document.getElementById('contact-section')?.scrollIntoView({ behavior: 'smooth' }); }}>Contact</a>
                <a href="/login" className="ep-footer-link">Login</a>
                <a href="/register" className="ep-footer-link">Create Account</a>
              </div>

              <div>
                <div style={{ fontSize: '.72rem', fontWeight: 700, letterSpacing: '.1em',
                  textTransform: 'uppercase', color: '#475569', marginBottom: '1rem' }}>Contact</div>
                {['Bitola, Morocco', 'info.eparking@gmail.Com', '+212628271238'].map(v => (
                  <p key={v} style={{ fontSize: '.85rem', color: '#64748b', marginBottom: '.4rem' }}>{v}</p>
                ))}
              </div>

              <div>
                <div style={{ fontSize: '.72rem', fontWeight: 700, letterSpacing: '.1em',
                  textTransform: 'uppercase', color: '#475569', marginBottom: '1rem' }}>Hours</div>
                <p style={{ fontSize: '.85rem', color: '#64748b', marginBottom: '.4rem' }}>Mon – Fri: 07:00 – 22:00</p>
                <p style={{ fontSize: '.85rem', color: '#64748b', marginBottom: '.9rem' }}>Sat – Sun: 08:00 – 20:00</p>
                <span style={{ fontSize: '.75rem', fontWeight: 700, background: '#10b981',
                  color: '#fff', borderRadius: 999, padding: '.2rem .7rem' }}>Online 24 / 7</span>
              </div>
            </div>
            <div style={{ borderTop: '1px solid #1e293b', paddingTop: '1.5rem',
              display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '.5rem' }}>
              <span style={{ fontSize: '.8rem', color: '#334155' }}>© 2026 eParking Bitola. All rights reserved.</span>
              <span style={{ fontSize: '.8rem', color: '#334155' }}>Bitola, Morocco</span>
            </div>
          </div>
        </footer>

      </div>
    </>
  );
}
