import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "motion/react";

// ─── Types & data ────────────────────────────────────────────────────────────

interface Project {
  title: string;
  description: string;
  category: string;
  year: string;
  tools: string;
  image: { src: string; alt: string };
  link: string;
}

const projects: Project[] = [
  { title: "FinTech Mobile Banking",    description: "Complete redesign of mobile banking experience with focus on accessibility and speed.",       category: "Mobile App",    year: "2024", tools: "Figma · Protopie", image: { src: "https://framerusercontent.com/images/GfGkADagM4KEibNcIiRUWlfrR0.jpg", alt: "FinTech Mobile Banking"    }, link: "#" },
  { title: "SaaS Dashboard Platform",   description: "Analytics dashboard for enterprise clients with real-time data visualization.",               category: "Dashboard",     year: "2024", tools: "Figma · React",    image: { src: "https://framerusercontent.com/images/aNsAT3jCvt4zglbWCUoFe33Q.jpg", alt: "SaaS Dashboard Platform"   }, link: "#" },
  { title: "E-Commerce Redesign",       description: "Modern shopping experience with personalized recommendations and seamless checkout.",          category: "Web Platform",  year: "2023", tools: "Figma · Framer",   image: { src: "https://framerusercontent.com/images/BYnxEV1zjYb9bhWh1IwBZ1ZoS60.jpg", alt: "E-Commerce Redesign"       }, link: "#" },
  { title: "Design System 2.0",         description: "Comprehensive component library for cross-platform consistency.",                               category: "Design System", year: "2023", tools: "Figma · Storybook", image: { src: "https://framerusercontent.com/images/2uTNEj5aTl2K3NJaEFWMbnrA.jpg", alt: "Design System 2.0"         }, link: "#" },
  { title: "Health & Wellness App",     description: "Holistic wellness tracking with AI-powered insights.",                                         category: "Mobile App",    year: "2023", tools: "Figma · Principle", image: { src: "https://framerusercontent.com/images/f9RiWoNpmlCMqVRIHz8l8wYfeI.jpg", alt: "Health & Wellness App"     }, link: "#" },
];

const N = projects.length; // 5
const TOTAL_VH = N * 300;  // 1500vh total — more room = naturally slower feel

// ─── Surrounding slot configs ─────────────────────────────────────────────

const surroundingSlots = [
  { top: "-30vh",   left: "5vw",     h: "30vh", w: "35vw", maxScale: 5 },
  { top: "-10vh",   left: "-25vw",   h: "45vh", w: "20vw", maxScale: 6 },
  { top: "0px",     left: "27.5vw",  h: "25vh", w: "25vw", maxScale: 5 },
  { top: "27.5vh",  left: "-22.5vw", h: "25vh", w: "30vw", maxScale: 6 },
];

// ─── Ripple hook ──────────────────────────────────────────────────────────

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

// ─── ZoomRound: one "chapter" = zoom-in → show details → zoom-out ─────────

type ScrollProgress = ReturnType<typeof useScroll>["scrollYProgress"];

function ZoomRound({
  roundIndex,
  scrollYProgress,
}: {
  roundIndex: number;
  scrollYProgress: ScrollProgress;
}) {
  const start = roundIndex / N;
  const mid   = start + 0.5 / N;    // peak of zoom for this round
  const end   = (roundIndex + 1) / N;

  // ── Helper: normalised local progress (0→1) within this round ──────────
  const localT = (p: number) => {
    if (p <= start) return 0;
    if (p >= end)   return 1;
    return (p - start) / (end - start);
  };

  // Sine ease-in-out: 0→peak→0, much smoother than linear
  const sineScale = (maxScale: number) => (p: number) => {
    const t = localT(p);
    return 1 + (maxScale - 1) * Math.sin(Math.PI * t);
  };

  // Round opacity — first round fades out at end; subsequent rounds
  // appear immediately (the slide-in animation handles the reveal) and fade out at end.
  const opacity = useTransform(scrollYProgress, (p: number) => {
    const t = localT(p);
    if (p < start) return 0;
    if (roundIndex === N - 1) return 1; // last round stays on forever
    // Fade out over the last 16% of the round
    if (t > 0.84) return Math.max(0, 1 - (t - 0.84) / 0.16);
    return 1;
  });

  // Swap animation: incoming card slides in from above; outgoing gets a gentle push down.
  const y = useTransform(scrollYProgress, (p: number) => {
    const t = localT(p);

    // Incoming slide — all rounds except the first
    if (roundIndex > 0 && t < 0.22) {
      const progress = t / 0.22;
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      return `${-72 * (1 - eased)}vh`;
    }

    // Outgoing push — gentle downward drift in last stretch, except last round
    if (roundIndex < N - 1 && t > 0.82) {
      const progress = (t - 0.82) / 0.18;
      const eased = progress * progress; // ease-in quad
      return `${18 * eased}vh`;
    }

    return "0vh";
  });

  // pointer-events only when visible
  const pointerEvents = useTransform(opacity, (o: number) => (o > 0.3 ? "auto" : "none"));

  // Scale transforms — smooth sine curve for all cards
  const scaleCenter = useTransform(scrollYProgress, sineScale(4));
  const scaleS = [
    useTransform(scrollYProgress, sineScale(surroundingSlots[0].maxScale)),
    useTransform(scrollYProgress, sineScale(surroundingSlots[1].maxScale)),
    useTransform(scrollYProgress, sineScale(surroundingSlots[2].maxScale)),
    useTransform(scrollYProgress, sineScale(surroundingSlots[3].maxScale)),
  ];

  // Overlay: visible in the middle 40% of the round (t ∈ 0.30–0.70)
  const overlayOpacity = useTransform(scrollYProgress, (p: number) => {
    const t = localT(p);
    const fadeIn  = 0.12; // how wide the fade-in window is (in local t)
    const tCenter = 0.50;
    const half    = 0.22; // half-width of visible window
    const dist = Math.abs(t - tCenter);
    if (dist > half + fadeIn) return 0;
    if (dist <= half) return 1;
    return 1 - (dist - half) / fadeIn;
  });

  // Overlay pointer events — only interactive when overlay is actually visible
  const overlayPointerEvents = useTransform(overlayOpacity, (o: number) => (o > 0.15 ? "auto" : "none"));

  // "View Project" button ripple
  const ripple = useRipple();
  const [btnActive, setBtnActive] = useState(false);

  // Project assignments for this round — center card rotates each round
  const centerProject    = projects[roundIndex];
  const surroundingProjs = [
    projects[(roundIndex + 1) % N],
    projects[(roundIndex + 2) % N],
    projects[(roundIndex + 3) % N],
    projects[(roundIndex + 4) % N],
  ];

  return (
    <motion.div
      style={{
        opacity,
        y,
        pointerEvents,
        willChange: "transform, opacity",
        position: "absolute",
        inset: 0,
      }}
    >
      {/* ── Center card — zooms to fill screen (image only, no text inside) ── */}
      <motion.div
        style={{
          scale: scaleCenter,
          willChange: "transform",
          position: "absolute",
          top: 0, left: 0,
          width: "100%", height: "100%",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >
        <div
          style={{
            position: "relative",
            width: "25vw", height: "25vh",
            borderRadius: "clamp(8px, 1.5vw, 20px)",
            overflow: "hidden",
            flexShrink: 0,
          }}
        >
          <img
            src={centerProject.image.src}
            alt={centerProject.image.alt}
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", display: "block" }}
          />
          {/* Vignette inside card */}
          <div aria-hidden="true" style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(5,5,8,0.02) 0%, rgba(5,5,8,0.25) 40%, rgba(5,5,8,0.85) 75%, rgba(5,5,8,0.98) 100%)", pointerEvents: "none" }} />
        </div>
      </motion.div>

      {/* ── Overlay at VIEWPORT level — not inside scaled div, so text stays crisp ── */}
      <style>{`
        @keyframes wk-ripple {
          0%   { transform: translate(-50%,-50%) scale(0); opacity: 0.55; }
          100% { transform: translate(-50%,-50%) scale(5); opacity: 0; }
        }
        @keyframes wk-flash {
          0%   { opacity: 0; }
          30%  { opacity: 1; }
          100% { opacity: 0; }
        }
        .wk-ripple-dot {
          position: absolute; border-radius: 50%;
          width: 80px; height: 80px; pointer-events: none;
          animation: wk-ripple 700ms cubic-bezier(0.22,1,0.36,1) forwards;
        }
        .wk-flash {
          position: absolute; inset: 0; border-radius: inherit; pointer-events: none;
          animation: wk-flash 500ms ease-out forwards;
        }
        .wk-btn {
          position: relative; display: inline-flex; align-items: center; gap: 8px; overflow: hidden;
          font-family: 'Montserrat', sans-serif; font-weight: 600; letter-spacing: 0.06em;
          font-size: clamp(13px, 1.4vw, 15px);
          color: #FDB813; text-decoration: none;
          background: rgba(253,184,19,0.10); border: 1px solid rgba(253,184,19,0.35);
          border-radius: 10px; padding: clamp(10px,1.5vh,14px) clamp(20px,2.5vw,28px);
          cursor: pointer; outline: none; white-space: nowrap;
          touch-action: manipulation; -webkit-tap-highlight-color: transparent;
          transition: background 200ms ease, box-shadow 220ms ease, transform 180ms ease;
        }
        .wk-btn:hover {
          background: rgba(253,184,19,0.20);
          box-shadow: 0 8px 28px rgba(253,184,19,0.25);
          transform: translateY(-2px);
        }
        .wk-btn:active { transform: scale(0.97) translateY(0); }
      `}</style>
      <motion.div
        style={{
          position: "absolute", inset: 0, zIndex: 10,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "flex-end",
          padding: "clamp(28px, 6vh, 64px) clamp(20px, 5vw, 60px)",
          opacity: overlayOpacity,
          pointerEvents: overlayPointerEvents,
        }}
      >
        <div style={{ width: "100%", maxWidth: "540px" }}>
          {/* Title */}
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 700, fontSize: "clamp(22px, 3.5vw, 38px)", lineHeight: 1.15, color: "#fff", margin: "0 0 clamp(8px,1.5vh,14px) 0", textShadow: "0 2px 20px rgba(0,0,0,0.7)" }}>
            {centerProject.title}
          </h3>

          {/* Description */}
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 400, fontSize: "clamp(13px, 1.5vw, 17px)", lineHeight: 1.6, color: "rgba(255,255,255,0.72)", margin: "0 0 clamp(6px,1.2vh,12px) 0" }}>
            {centerProject.description}
          </p>

          {/* Tools */}
          <span style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500, fontSize: "clamp(11px, 1.1vw, 14px)", color: "rgba(253,184,19,0.75)", display: "block", marginBottom: "clamp(16px,2.5vh,24px)", letterSpacing: "0.03em" }}>
            {centerProject.tools}
          </span>

          {/* View Project button */}
          <button
            type="button"
            className="wk-btn"
            onClick={(e) => {
              ripple.trigger(e);
              const link = centerProject.link;
              if (link && link !== "#") {
                window.location.href = link;
              } else {
                const el = document.getElementById("contact");
                if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
              }
            }}
            data-active={btnActive}
            onPointerDown={() => setBtnActive(true)}
            onPointerUp={() => setBtnActive(false)}
            onPointerCancel={() => setBtnActive(false)}
            onPointerLeave={() => setBtnActive(false)}
            aria-label={`View project: ${centerProject.title}`}
          >
            {/* Animated stroke border */}
            <svg aria-hidden="true" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
              <rect x="1" y="1" width="calc(100% - 2px)" height="calc(100% - 2px)" rx="9" ry="9" fill="none" stroke="#FDB813" strokeWidth="1.5" vectorEffect="non-scaling-stroke"
                style={{ strokeDasharray: 1, strokeDashoffset: btnActive ? 0 : 1, opacity: btnActive ? 1 : 0, transition: "stroke-dashoffset 0.4s ease, opacity 160ms ease" }}
              />
            </svg>
            {ripple.ripples.map(r => (
              <span key={r.id} className="wk-ripple-dot" style={{ left: r.x, top: r.y, background: "radial-gradient(circle, rgba(253,184,19,0.65) 0%, rgba(253,184,19,0) 70%)" }} />
            ))}
            {ripple.ripples.length > 0 && <span className="wk-flash" style={{ background: "rgba(253,184,19,0.12)" }} />}
            View Project
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
              <path d="M7 17L17 7M17 7H7M17 7V17" />
            </svg>
          </button>
        </div>
      </motion.div>

      {/* ── Surrounding cards — fly out at higher scale multipliers ──── */}
      {surroundingProjs.map((proj, i) => (
        <motion.div
          key={i}
          style={{
            scale: scaleS[i],
            willChange: "transform",
            position: "absolute",
            top: 0, left: 0,
            width: "100%", height: "100%",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <div
            style={{
              position: "relative",
              width: surroundingSlots[i].w,
              height: surroundingSlots[i].h,
              top: surroundingSlots[i].top,
              left: surroundingSlots[i].left,
              borderRadius: "clamp(6px, 1.2vw, 16px)",
              overflow: "hidden",
              flexShrink: 0,
            }}
          >
            <img
              src={proj.image.src}
              alt={proj.image.alt}
              style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", display: "block" }}
            />
            <div aria-hidden="true" style={{ position: "absolute", inset: 0, background: "rgba(5,5,8,0.35)", pointerEvents: "none" }} />
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

// ─── Progress indicator dot ───────────────────────────────────────────────

function ProgressDot({
  roundIndex,
  scrollYProgress,
}: {
  roundIndex: number;
  scrollYProgress: ScrollProgress;
}) {
  const start = roundIndex / N;
  const end   = (roundIndex + 1) / N;

  const scale = useTransform(scrollYProgress, (p: number) => {
    if (p <= start || p >= end) return 1;
    const t = (p - start) / (end - start);
    return 1 + 0.7 * Math.sin(Math.PI * t);
  });

  const bg = useTransform(scrollYProgress, (p: number) => {
    if (p <= start || p >= end) return "rgba(255,255,255,0.22)";
    const t = (p - start) / (end - start);
    const intensity = Math.sin(Math.PI * t);
    const r = Math.round(255 * intensity + 255 * (1 - intensity));
    const g = Math.round(184 * intensity + 255 * (1 - intensity));
    const b = Math.round(19  * intensity + 255 * (1 - intensity));
    const a = 0.22 + 0.78 * intensity;
    return `rgba(${r},${g},${b},${a.toFixed(2)})`;
  });

  return (
    <motion.div
      aria-hidden="true"
      style={{
        width: 8, height: 8,
        borderRadius: "50%",
        background: bg,
        scale,
        transformOrigin: "center",
        flexShrink: 0,
      }}
    />
  );
}

// ─── WorkSection ─────────────────────────────────────────────────────────

export default function WorkSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  // useScroll() with no options tracks window.scrollY — avoids Motion's
  // container-position warning which fires whenever the resolved container
  // is document.documentElement (always position:static).
  const { scrollY } = useScroll();

  // Cache the container's absolute top once on mount (and on resize).
  const metricsRef = useRef({ top: 0, height: 0 });
  useEffect(() => {
    const measure = () => {
      if (!containerRef.current) return;
      metricsRef.current = {
        top:    containerRef.current.getBoundingClientRect().top + window.scrollY,
        height: containerRef.current.offsetHeight,
      };
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // Convert raw scrollY → 0-1 progress within this container.
  const scrollYProgress = useTransform(scrollY, (y: number) => {
    const { top, height } = metricsRef.current;
    const vh = window.innerHeight;
    if (height <= vh) return 0;
    return Math.max(0, Math.min(1, (y - top) / (height - vh)));
  });

  return (
    <section id="work" aria-label="Selected work and case studies" style={{ background: "#050508", position: "relative" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,700;1,700&family=Sahitya:wght@400;700&display=swap');
      `}</style>

      {/* ── Section heading ── */}
      <header style={{ textAlign: "center", paddingTop: "clamp(80px, 10vw, 140px)", paddingBottom: "clamp(40px, 6vw, 80px)" }}>
        <h2 style={{ display: "inline-flex", flexWrap: "wrap", gap: "0.3em", justifyContent: "center", fontSize: "clamp(2rem, 5vw, 4rem)", fontWeight: 700, lineHeight: 1.2, margin: "0 0 16px 0" }}>
          {["Projects", "That", "Speak"].map((word, wi) => (
            <span
              key={wi}
              style={{
                display: "inline-block",
                fontFamily: "Sahitya, serif",
                fontWeight: 700,
                background: wi === 0
                  ? "linear-gradient(135deg, #806C9B 0%, #FDB813 55%, #483D6F 100%)"
                  : "linear-gradient(135deg, #FFFFFF 0%, #806C9B 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              {word}
            </span>
          ))}
        </h2>
        <p style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 400, fontSize: "clamp(14px, 1.6vw, 17px)", color: "rgba(255,255,255,0.48)", maxWidth: "460px", margin: "0 auto", lineHeight: 1.65 }}>
          A curated selection of UI/UX work across mobile, web, and systems.
        </p>
      </header>

      {/* ── Scroll-zoom zone: N × 200vh ── */}
      <div ref={containerRef} style={{ height: `${TOTAL_VH}vh`, position: "relative" }}>
        {/* Sticky viewport */}
        <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden" }}>

          {/* All rounds stacked — only the active one is visible */}
          <div style={{ position: "absolute", inset: 0 }}>
            {Array.from({ length: N }).map((_, i) => (
              <ZoomRound key={i} roundIndex={i} scrollYProgress={scrollYProgress} />
            ))}
          </div>

          {/* Progress dots — right side */}
          <div
            style={{
              position: "absolute",
              right: "clamp(16px, 3vw, 48px)",
              top: "50%",
              transform: "translateY(-50%)",
              display: "flex",
              flexDirection: "column",
              gap: "14px",
              zIndex: 40,
            }}
          >
            {Array.from({ length: N }).map((_, i) => (
              <ProgressDot key={i} roundIndex={i} scrollYProgress={scrollYProgress} />
            ))}
          </div>

        </div>
      </div>

      {/* ── Bottom padding ── */}
      <div style={{ height: "clamp(80px, 10vw, 140px)" }} />
    </section>
  );
}
