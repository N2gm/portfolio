import { useState, startTransition, useRef } from "react";

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

const HERO_IMAGE =
  "https://dtvoeevhaseb5.cloudfront.net/user-uploads/f65d71cd-371d-49d7-993d-7a504042210a.jpg";

const stats = [
  { number: "3+", label: "Years Experience", aria: "3 or more years of experience" },
  { number: "20+", label: "Projects Delivered", aria: "20 or more projects delivered" },
  { number: "15+", label: "Happy Clients", aria: "15 or more happy clients" },
];

const particles = [
  { top: "22%", left: "18%", size: 3, color: "#FDB813", delay: "0s", duration: "4.8s" },
  { top: "38%", left: "72%", size: 2, color: "#806C9B", delay: "1.2s", duration: "5.6s" },
  { top: "55%", left: "85%", size: 4, color: "#FDB813", delay: "2.4s", duration: "4.2s" },
  { top: "14%", left: "55%", size: 2, color: "#806C9B", delay: "3.6s", duration: "6.0s" },
  { top: "68%", left: "40%", size: 3, color: "#FDB813", delay: "0.8s", duration: "5.2s" },
];

export default function HeroSection() {
  const [pActive, setPActive] = useState(false);
  const [sActive, setSActive] = useState(false);
  const goldRipple = useRipple();
  const whiteRipple = useRipple();

  return (
    <section
      id="hero"
      aria-label="Hero introduction"
      style={{ position: "relative", width: "100%", height: "100dvh", overflow: "hidden", background: "#050508" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,700;1,700&display=swap');

        @keyframes hero-img-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes glow-in { from { opacity: 0; transform: translateY(-50%) scale(0.6); } to { opacity: 1; transform: translateY(-50%) scale(1); } }
        @keyframes name-in { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes subtitle-in { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fade-in-up { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes gold-pulse {
          0%, 100% { opacity: 0.7; transform: translateY(-50%) scale(1); }
          50%       { opacity: 1.0; transform: translateY(-50%) scale(1.08); }
        }
        @keyframes float-particle {
          0%, 100% { transform: translateY(0px);  opacity: 0.4; }
          50%       { transform: translateY(-12px); opacity: 0.9; }
        }
        @keyframes hero-ripple {
          0%   { transform: translate(-50%,-50%) scale(0); opacity: 0.55; }
          100% { transform: translate(-50%,-50%) scale(5); opacity: 0; }
        }
        @keyframes hero-btn-flash {
          0%   { opacity: 0; }
          30%  { opacity: 1; }
          100% { opacity: 0; }
        }
        .hero-ripple-dot {
          position: absolute; border-radius: 50%;
          width: 80px; height: 80px; pointer-events: none;
          animation: hero-ripple 700ms cubic-bezier(0.22,1,0.36,1) forwards;
        }
        .hero-btn-flash {
          position: absolute; inset: 0; border-radius: inherit; pointer-events: none;
          animation: hero-btn-flash 500ms ease-out forwards;
        }

        .hero-img-anim      { animation: hero-img-in 800ms ease-out 0ms both; }
        .hero-glow-anim     { animation: gold-pulse 5s ease-in-out infinite, glow-in 1000ms cubic-bezier(0.16,1,0.3,1) 200ms both; }
        .hero-subtitle-anim { animation: subtitle-in 600ms ease-out 550ms both; }
        .hero-tagline-anim  { animation: fade-in 500ms ease-out 650ms both; }
        .hero-cta-anim      { animation: fade-in-up 500ms ease-out 750ms both; }
        .hero-stats-anim    { animation: fade-in 400ms ease-out 850ms both; }
        .float-particle     { animation: float-particle var(--dur) ease-in-out var(--delay) infinite; }

        .ctaRow { display: flex; flex-direction: row; gap: 16px; flex-wrap: wrap; }
        .ctaBtn {
          position: relative; display: inline-flex; align-items: center; justify-content: center;
          height: 52px; min-width: 160px; padding: 14px 28px; border: 0; border-radius: 10px;
          cursor: pointer; user-select: none; backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
          font-family: 'Montserrat', sans-serif; font-weight: 600; letter-spacing: 0.06em; font-size: 14px;
          transition: transform 180ms ease, box-shadow 220ms ease, background 220ms ease; overflow: hidden; outline: none;
        }
        .ctaBtn:active { transform: scale(0.97); }
        .ctaStroke { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; }
        .ctaStroke rect { fill: none; stroke-width: 2; vector-effect: non-scaling-stroke; pathLength: 1; stroke-dasharray: 1; stroke-dashoffset: 1; opacity: 0; transition: stroke-dashoffset 6.5s cubic-bezier(0.16,1,0.3,1), opacity 160ms ease; }
        .ctaBtn:hover .ctaStroke rect, .ctaBtn[data-active="true"] .ctaStroke rect { opacity: 1; stroke-dashoffset: 0; }

        .ctaBtnGold { background: rgba(253,184,19,0.12); color: #FDB813; }
        .ctaBtnGold:hover { background: rgba(253,184,19,0.18); box-shadow: 0 10px 36px rgba(253,184,19,0.20); transform: translateY(-2px); }
        .ctaBtnGold .ctaStroke rect { stroke: #FDB813; }

        .ctaBtnWhite { background: rgba(255,255,255,0.12); color: rgba(255,255,255,0.95); }
        .ctaBtnWhite:hover { background: rgba(255,255,255,0.18); box-shadow: 0 10px 36px rgba(255,255,255,0.12); transform: translateY(-2px); }
        .ctaBtnWhite .ctaStroke rect { stroke: rgba(255,255,255,0.8); }

        .hero-content-block {
          position: absolute; bottom: 80px;
          left: max(40px, calc(50% - 600px));
          max-width: 560px; z-index: 4;
        }
        @media (max-width: 1023px) { .hero-content-block { bottom: 56px; left: 24px; max-width: 480px; } }
        @media (max-width: 767px)  { .hero-content-block { bottom: 40px; left: 16px; right: 16px; max-width: unset; } .ctaBtn { height: 48px; padding: 12px 20px; } .ctaRow { gap: 10px; } }

        .hero-stats-bar { display: flex; flex-direction: row; gap: 32px; margin-top: 32px; align-items: flex-start; }
        @media (max-width: 1023px) { .hero-stats-bar { gap: 20px; } }
        @media (max-width: 767px) { .hero-stats-bar { gap: 16px; margin-top: 24px; } .stat-label { font-size: 10px !important; } }

        @media (prefers-reduced-motion: reduce) {
          .hero-img-anim, .hero-glow-anim, .hero-subtitle-anim,
          .hero-tagline-anim, .hero-cta-anim, .hero-stats-anim, .float-particle {
            animation: none !important; opacity: 1 !important; transform: none !important;
          }
          .hero-glow-anim { transform: translateY(-50%) scale(1) !important; }
        }
      `}</style>

      {/* Portrait image — full bleed */}
      <div className="hero-img-anim" style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <div aria-hidden="true" style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(5,5,8,0.55) 0%, transparent 30%), linear-gradient(to left, rgba(5,5,8,0.55) 0%, transparent 30%)", zIndex: 2, pointerEvents: "none" }} />
        <div aria-hidden="true" style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(5,5,8,0.00) 0%, rgba(5,5,8,0.00) 40%, rgba(5,5,8,0.30) 60%, rgba(5,5,8,0.75) 78%, rgba(5,5,8,0.95) 90%, rgba(5,5,8,1.00) 100%)", zIndex: 1, pointerEvents: "none" }} />
        <img
          src={HERO_IMAGE}
          alt="Abdrhman Negm — UI/UX Designer portrait with galaxy background"
          loading="eager"
          decoding="sync"
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", display: "block" }}
        />
      </div>

      {/* Ambient gold glow */}
      <div className="hero-glow-anim" aria-hidden="true" style={{ position: "absolute", width: "500px", height: "500px", background: "radial-gradient(circle, rgba(253,184,19,0.12) 0%, rgba(72,61,111,0.08) 50%, transparent 75%)", filter: "blur(60px)", top: "50%", left: "-80px", zIndex: 3, pointerEvents: "none" }} />

      {/* Floating particles */}
      {particles.map((p, i) => (
        <div
          key={i}
          className="float-particle"
          aria-hidden="true"
          style={{
            position: "absolute", top: p.top, left: p.left,
            width: `${p.size}px`, height: `${p.size}px`, borderRadius: "50%",
            background: p.color, boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
            zIndex: 3, pointerEvents: "none",
            ["--delay" as string]: p.delay, ["--dur" as string]: p.duration,
          }}
        />
      ))}

      {/* Text content block */}
      <div className="hero-content-block">
        {/* Subtitle — name in gold */}
        <p className="hero-subtitle-anim" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500, fontSize: "clamp(14px, 2vw, 18px)", letterSpacing: "0.18em", color: "rgba(255,255,255,0.55)", margin: 0 }}>
          <span style={{ color: "#FDB813", fontWeight: 600 }}>Abdrhman Negm</span>
          {" - UI/UX Designer"}
        </p>

        {/* Tagline */}
        <p className="hero-tagline-anim" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 400, fontSize: "clamp(14px, 1.5vw, 16px)", color: "rgba(255,255,255,0.45)", lineHeight: 1.6, maxWidth: "400px", marginTop: "16px", marginBottom: 0 }}>
          Crafting digital experiences that live between art and function.
        </p>

        {/* CTA Buttons */}
        <div className="hero-cta-anim" style={{ marginTop: "32px" }}>
          <div className="ctaRow">
            <button type="button" className="ctaBtn ctaBtnGold"
              onClick={(e) => { goldRipple.trigger(e); const el = document.getElementById("work"); if (el) el.scrollIntoView({ behavior: "smooth", block: "start" }); }}
              data-active={pActive}
              onPointerDown={() => startTransition(() => setPActive(true))}
              onPointerUp={() => startTransition(() => setPActive(false))}
              onPointerCancel={() => startTransition(() => setPActive(false))}
              onPointerLeave={() => startTransition(() => setPActive(false))}
            >
              <svg className="ctaStroke" aria-hidden="true"><rect x="1" y="1" width="calc(100% - 2px)" height="calc(100% - 2px)" rx="9" ry="9" /></svg>
              {goldRipple.ripples.map(r => (
                <span key={r.id} className="hero-ripple-dot" style={{ left: r.x, top: r.y, background: "radial-gradient(circle, rgba(253,184,19,0.7) 0%, rgba(253,184,19,0) 70%)" }} />
              ))}
              {goldRipple.ripples.length > 0 && <span className="hero-btn-flash" style={{ background: "rgba(253,184,19,0.12)" }} />}
              View My Work
            </button>
            <button type="button" className="ctaBtn ctaBtnWhite"
              aria-label="Download Abdrhman Negm's CV"
              onClick={(e) => { whiteRipple.trigger(e); const el = document.getElementById("cv"); if (el) el.scrollIntoView({ behavior: "smooth", block: "start" }); }}
              data-active={sActive}
              onPointerDown={() => startTransition(() => setSActive(true))}
              onPointerUp={() => startTransition(() => setSActive(false))}
              onPointerCancel={() => startTransition(() => setSActive(false))}
              onPointerLeave={() => startTransition(() => setSActive(false))}
            >
              <svg className="ctaStroke" aria-hidden="true"><rect x="1" y="1" width="calc(100% - 2px)" height="calc(100% - 2px)" rx="9" ry="9" /></svg>
              {whiteRipple.ripples.map(r => (
                <span key={r.id} className="hero-ripple-dot" style={{ left: r.x, top: r.y, background: "radial-gradient(circle, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0) 70%)" }} />
              ))}
              {whiteRipple.ripples.length > 0 && <span className="hero-btn-flash" style={{ background: "rgba(255,255,255,0.08)" }} />}
              Download CV
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="hero-stats-bar hero-stats-anim">
          {stats.map((stat, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start" }}>
              {i > 0 && (
                <div aria-hidden="true" style={{ width: "1px", height: "40px", background: "rgba(255,255,255,0.12)", marginInlineEnd: "32px", alignSelf: "center", flexShrink: 0 }} />
              )}
              <div aria-label={stat.aria} style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 700, fontSize: "clamp(24px, 3vw, 36px)", color: "#FDB813", lineHeight: 1 }}>
                  {stat.number}
                </span>
                <span className="stat-label" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 400, fontSize: "12px", color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: "0.08em", marginTop: "4px" }}>
                  {stat.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
