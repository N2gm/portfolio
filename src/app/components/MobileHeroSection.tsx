import { useState, useRef, startTransition } from "react";
import imgPortrait from "figma:asset/868b1ddb7a99e0d4d30c9acc8b8e8378e1414bf4.png";

type Ripple = { id: number; x: number; y: number };

function useRipple() {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const counter = useRef(0);
  const trigger = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const r: Ripple = { id: counter.current++, x: e.clientX - rect.left, y: e.clientY - rect.top };
    setRipples(prev => [...prev, r]);
    setTimeout(() => setRipples(prev => prev.filter(p => p.id !== r.id)), 700);
  };
  return { ripples, trigger };
}

// Particles as percentage of viewport — safe on any width/height
const PARTICLES = [
  { topPct: 14,  leftPct: 17.5, size: 3, color: "#FDB813", blur: 9,  opacity: 0.76, delay: "0s",   dur: "4.8s" },
  { topPct: 32,  leftPct: 69.0, size: 2, color: "#806C9B", blur: 6,  opacity: 0.41, delay: "1.2s", dur: "5.6s" },
  { topPct: 6,   leftPct: 53.0, size: 2, color: "#806C9B", blur: 6,  opacity: 0.65, delay: "3.6s", dur: "6.0s" },
  { topPct: 62,  leftPct: 38.5, size: 3, color: "#FDB813", blur: 9,  opacity: 0.44, delay: "0.8s", dur: "5.2s" },
  { topPct: 48,  leftPct: 82.0, size: 4, color: "#FDB813", blur: 12, opacity: 0.82, delay: "2.4s", dur: "4.2s" },
];

export default function MobileHeroSection() {
  const goldRipple  = useRipple();
  const whiteRipple = useRipple();
  const [pActive, setPActive] = useState(false);
  const [sActive, setSActive] = useState(false);

  return (
    <section
      id="hero"
      aria-label="Hero introduction"
      style={{
        position: "relative",
        width: "100%",
        height: "100dvh",
        overflow: "hidden",
        background: "#050508",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,700;1,700&display=swap');

        @keyframes mhero-float  { 0%, 100% { transform: translateY(0); }  50% { transform: translateY(-10px); } }
        @keyframes mhero-fade   { from { opacity: 0; } to { opacity: 1; } }
        @keyframes mhero-up     { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes mhero-ripple { 0% { transform: translate(-50%,-50%) scale(0); opacity: 0.6; } 100% { transform: translate(-50%,-50%) scale(5); opacity: 0; } }
        @keyframes mhero-flash  { 0% { opacity: 0; } 30% { opacity: 1; } 100% { opacity: 0; } }

        .mhero-particle { animation: mhero-float var(--dur) ease-in-out var(--delay) infinite; }
        .mhero-name     { animation: mhero-up   550ms ease-out 350ms both; }
        .mhero-tagline  { animation: mhero-fade 500ms ease-out 450ms both; }
        .mhero-btns     { animation: mhero-up   500ms ease-out 550ms both; }
        .mhero-stats    { animation: mhero-fade 400ms ease-out 650ms both; }

        .mhero-btn {
          position: relative; display: flex; align-items: center; justify-content: center;
          flex: 1; height: 48px; padding: 0 16px;
          border: 0; border-radius: 10px; cursor: pointer; user-select: none;
          font-family: 'Montserrat', sans-serif; font-weight: 600;
          letter-spacing: 0.84px; font-size: 14px; white-space: nowrap;
          overflow: hidden; outline: none;
          touch-action: manipulation; -webkit-tap-highlight-color: transparent;
          transition: transform 160ms ease, background 200ms ease;
        }
        .mhero-btn:active  { transform: scale(0.96); }
        .mhero-btn-gold    { background: rgba(253,184,19,0.12);    color: #FDB813; }
        .mhero-btn-white   { background: rgba(255,255,255,0.12);   color: rgba(255,255,255,0.95); }
        .mhero-ripple-dot  {
          position: absolute; border-radius: 50%; width: 70px; height: 70px;
          pointer-events: none;
          animation: mhero-ripple 700ms cubic-bezier(0.22,1,0.36,1) forwards;
        }
        .mhero-flash {
          position: absolute; inset: 0; border-radius: inherit; pointer-events: none;
          animation: mhero-flash 500ms ease-out forwards;
        }

        @media (prefers-reduced-motion: reduce) {
          .mhero-particle, .mhero-name, .mhero-tagline, .mhero-btns, .mhero-stats {
            animation: none !important; opacity: 1 !important; transform: none !important;
          }
        }
      `}</style>

      {/* ── Portrait: fills top portion, height scales with viewport ── */}
      <div
        style={{
          position: "absolute",
          left: 0, top: "56px",
          width: "100%",
          height: "clamp(340px, 60dvh, 540px)",
          pointerEvents: "none", zIndex: 1,
        }}
      >
        <img
          alt="" aria-hidden="true" src={imgPortrait}
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", display: "block" }}
        />
        {/* Top inner shadow */}
        <div style={{ position: "absolute", inset: 0, boxShadow: "inset 0px 28px 23.6px rgba(0,0,0,0.25)" }} />
        {/* Bottom dark fade — deeper on shorter screens */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 30%, rgba(5,5,8,0.45) 60%, #050508 100%)" }} />
      </div>

      {/* ── Particles ── */}
      {PARTICLES.map((p, i) => (
        <div
          key={i}
          className="mhero-particle"
          aria-hidden="true"
          style={{
            position: "absolute",
            top: `${p.topPct}dvh`,
            left: `${p.leftPct}%`,
            width: p.size, height: p.size, borderRadius: p.size / 2,
            background: p.color,
            boxShadow: `0 0 ${p.blur}px ${p.color}`,
            opacity: p.opacity,
            zIndex: 3, pointerEvents: "none",
            ["--delay" as string]: p.delay,
            ["--dur" as string]: p.dur,
          }}
        />
      ))}

      {/* ── Name + tagline — anchored from bottom ── */}
      <div
        style={{
          position: "absolute",
          left: "24px", right: "24px",
          bottom: "clamp(164px, 24dvh, 230px)",
          zIndex: 4,
          display: "flex", flexDirection: "column",
          gap: "clamp(10px, 1.8dvh, 16px)",
        }}
      >
        <p
          className="mhero-name"
          style={{
            fontFamily: "'Montserrat', sans-serif", fontWeight: 500,
            fontSize: "14px", letterSpacing: "3px", lineHeight: "1.5",
            margin: 0, color: "rgba(255,255,255,0.55)",
          }}
        >
          <span style={{ color: "#FDB813", fontWeight: 600 }}>Abdrhman Negm</span>
          <span>{" - UI/UX Designer"}</span>
        </p>
        <p
          className="mhero-tagline"
          style={{
            fontFamily: "'Montserrat', sans-serif", fontWeight: 400,
            fontSize: "14px", lineHeight: "1.6",
            margin: 0, color: "rgba(255,255,255,0.55)",
          }}
        >
          Crafting digital experiences that live between art and function.
        </p>
      </div>

      {/* ── CTA Buttons — anchored from bottom ── */}
      <div
        className="mhero-btns"
        style={{
          position: "absolute",
          left: "20px", right: "20px",
          bottom: "clamp(96px, 14dvh, 160px)",
          zIndex: 4,
          display: "flex", alignItems: "center", gap: "12px",
        }}
      >
        <button
          type="button"
          className="mhero-btn mhero-btn-gold"
          onClick={(e) => {
            goldRipple.trigger(e);
            document.getElementById("work")?.scrollIntoView({ behavior: "smooth", block: "start" });
          }}
          onPointerDown={() => startTransition(() => setPActive(true))}
          onPointerUp={() => startTransition(() => setPActive(false))}
          onPointerCancel={() => startTransition(() => setPActive(false))}
          onPointerLeave={() => startTransition(() => setPActive(false))}
        >
          {goldRipple.ripples.map(r => (
            <span key={r.id} className="mhero-ripple-dot" style={{ left: r.x, top: r.y, background: "radial-gradient(circle, rgba(253,184,19,0.7) 0%, rgba(253,184,19,0) 70%)" }} />
          ))}
          {goldRipple.ripples.length > 0 && <span className="mhero-flash" style={{ background: "rgba(253,184,19,0.12)" }} />}
          View My Work
        </button>

        <button
          type="button"
          className="mhero-btn mhero-btn-white"
          aria-label="Download Abdrhman Negm's CV"
          onClick={(e) => {
            whiteRipple.trigger(e);
            document.getElementById("contact")?.scrollIntoView({ behavior: "smooth", block: "start" });
          }}
          onPointerDown={() => startTransition(() => setSActive(true))}
          onPointerUp={() => startTransition(() => setSActive(false))}
          onPointerCancel={() => startTransition(() => setSActive(false))}
          onPointerLeave={() => startTransition(() => setSActive(false))}
        >
          {whiteRipple.ripples.map(r => (
            <span key={r.id} className="mhero-ripple-dot" style={{ left: r.x, top: r.y, background: "radial-gradient(circle, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0) 70%)" }} />
          ))}
          {whiteRipple.ripples.length > 0 && <span className="mhero-flash" style={{ background: "rgba(255,255,255,0.08)" }} />}
          Download CV
        </button>
      </div>

      {/* ── Stats — pinned near bottom, with safe-area awareness ── */}
      <div
        className="mhero-stats"
        style={{
          position: "absolute",
          left: 0, right: 0,
          bottom: "clamp(16px, 3.5dvh, 48px)",
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
          zIndex: 4,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "4px", alignItems: "center", minWidth: "88px" }}>
          <p style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 700, fontSize: "clamp(20px, 3dvh, 24px)", lineHeight: 1, color: "#FDB813", margin: 0, textAlign: "center" }}>3+</p>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 400, fontSize: "clamp(10px, 1.5dvh, 12px)", lineHeight: "1.5", color: "rgba(255,255,255,0.45)", letterSpacing: "0.96px", textTransform: "uppercase", margin: 0, textAlign: "center" }}>Years Experience</p>
        </div>

        <div aria-hidden="true" style={{ width: "1px", height: "36px", background: "rgba(255,255,255,0.12)", flexShrink: 0, margin: "0 clamp(6px,2vw,12px)" }} />

        <div style={{ display: "flex", flexDirection: "column", gap: "4px", alignItems: "center", minWidth: "96px" }}>
          <p style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 700, fontSize: "clamp(20px, 3dvh, 24px)", lineHeight: 1, color: "#FDB813", margin: 0, textAlign: "center" }}>20+</p>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 400, fontSize: "clamp(10px, 1.5dvh, 12px)", lineHeight: "1.5", color: "rgba(255,255,255,0.45)", letterSpacing: "0.96px", textTransform: "uppercase", margin: 0, textAlign: "center" }}>Projects Delivered</p>
        </div>

        <div aria-hidden="true" style={{ width: "1px", height: "36px", background: "rgba(255,255,255,0.12)", flexShrink: 0, margin: "0 clamp(6px,2vw,12px)" }} />

        <div style={{ display: "flex", flexDirection: "column", gap: "4px", alignItems: "center", minWidth: "80px" }}>
          <p style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 700, fontSize: "clamp(20px, 3dvh, 24px)", lineHeight: 1, color: "#FDB813", margin: 0, textAlign: "center" }}>15+</p>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 400, fontSize: "clamp(10px, 1.5dvh, 12px)", lineHeight: "1.5", color: "rgba(255,255,255,0.45)", letterSpacing: "0.96px", textTransform: "uppercase", margin: 0, textAlign: "center" }}>Happy Clients</p>
        </div>
      </div>
    </section>
  );
}
