// Selected Work — Premium Bento Grid
// Galaxy-Glass Fusion aesthetic | No section background
// Converted from Framer TS → plain React JSX

import {
  useEffect,
  useRef,
  useState,
  startTransition,
  useCallback,
} from "react";

const defaultProjects = [
  {
    title: "FinTech Mobile Banking",
    description:
      "Complete redesign of mobile banking experience with focus on accessibility and speed.",
    category: "Mobile App",
    year: "2024",
    tools: "Figma, Protopie",
    image: {
      src: "https://framerusercontent.com/images/GfGkADagM4KEibNcIiRUWlfrR0.jpg",
      alt: "Screenshot of FinTech Mobile Banking app interface",
    },
    link: "#",
  },
  {
    title: "SaaS Dashboard Platform",
    description:
      "Analytics dashboard for enterprise clients with real-time data visualization.",
    category: "Dashboard",
    year: "2024",
    tools: "Figma, React",
    image: {
      src: "https://framerusercontent.com/images/aNsAT3jCvt4zglbWCUoFe33Q.jpg",
      alt: "Screenshot of SaaS Dashboard Platform",
    },
    link: "#",
  },
  {
    title: "E-Commerce Redesign",
    description:
      "Modern shopping experience with personalized recommendations and seamless checkout.",
    category: "Web Platform",
    year: "2023",
    tools: "Figma, Framer",
    image: {
      src: "https://framerusercontent.com/images/BYnxEV1zjYb9bhWh1IwBZ1ZoS60.jpg",
      alt: "Screenshot of E-Commerce platform redesign",
    },
    link: "#",
  },
  {
    title: "Design System 2.0",
    description:
      "Comprehensive component library for cross-platform consistency.",
    category: "Design System",
    year: "2023",
    tools: "Figma, Storybook",
    image: {
      src: "https://framerusercontent.com/images/2uTNEj5aTl2K3NJaEFWMbnrA.jpg",
      alt: "Screenshot of Design System components",
    },
    link: "#",
  },
  {
    title: "Health & Wellness App",
    description: "Holistic wellness tracking with AI-powered insights.",
    category: "Mobile App",
    year: "2023",
    tools: "Figma, Principle",
    image: {
      src: "https://framerusercontent.com/images/f9RiWoNpmlCMqVRIHz8l8wYfeI.jpg",
      alt: "Screenshot of Health & Wellness mobile app",
    },
    link: "#",
  },
];

// Bento grid positions — desktop 12-col
const gridStyles = [
  { gridColumn: "1 / 9", gridRow: "1 / 3", minHeight: "520px" }, // A — large left
  { gridColumn: "9 / 13", gridRow: "1 / 3", minHeight: "520px" }, // B — tall right
  { gridColumn: "1 / 7", gridRow: "3", minHeight: "280px" }, // C
  { gridColumn: "7 / 10", gridRow: "3", minHeight: "280px" }, // D
  { gridColumn: "10 / 13", gridRow: "3", minHeight: "280px" }, // E
];

export default function WorkSection({
  heading = "Projects That Speak",
  subheading = "A curated selection of UI/UX work across mobile, web, and systems.",
  viewAllText = "View All Work",
  viewAllLink = "#",
  showFilters = false,
  projects = defaultProjects,
  accentColor = "#FDB813",
  textPrimary = "rgba(255, 255, 255, 0.92)",
  textMuted = "rgba(255, 255, 255, 0.50)",
  textSecondary = "rgba(255, 255, 255, 0.35)",
  categoryTagColor = "#FDB813",
}) {
  const [activeFilter, setActiveFilter] = useState("All");
  const [visibleCards, setVisibleCards] = useState(new Set());
  const cardRefs = useRef([]);

  // Mouse-tracking halo for each card
  const handleCardMouseMove = useCallback((e, index) => {
    const card = cardRefs.current[index];
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const halo = card.querySelector(".card-halo");
    if (halo) {
      halo.style.opacity = "1";
      halo.style.left = x + "px";
      halo.style.top = y + "px";
    }
  }, []);

  const handleCardMouseLeave = useCallback((e, index) => {
    const card = cardRefs.current[index];
    if (!card) return;
    const halo = card.querySelector(".card-halo");
    if (halo) {
      halo.style.opacity = "0";
    }
  }, []);

  // Scroll-triggered entrance animations
  useEffect(() => {
    if (typeof window === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = cardRefs.current.indexOf(entry.target);
            if (index !== -1) {
              startTransition(() => {
                setVisibleCards((prev) => new Set(prev).add(index));
              });
            }
          }
        });
      },
      { threshold: 0.12 },
    );
    cardRefs.current.forEach((card) => {
      if (card) observer.observe(card);
    });
    return () => observer.disconnect();
  }, [projects.length]);

  const filters = [
    "All",
    "Mobile App",
    "Web Platform",
    "Design System",
    "Dashboard",
  ];

  const filteredProjects =
    activeFilter === "All"
      ? projects
      : projects.filter((p) => p.category === activeFilter);

  const displayProjects =
    filteredProjects.length > 0
      ? filteredProjects.slice(0, 5)
      : projects.slice(0, 5);

  // Split heading into individual words for even spacing
  const headingWords = String(heading).split(" ");

  return (
    <section
      id="work"
      aria-label="Selected work and case studies"
      style={{
        /* No background — inherits site's #050508 */
        paddingTop: "clamp(80px, 10vw, 140px)",
        paddingBottom: "clamp(80px, 12vw, 160px)",
        paddingLeft: "clamp(16px, 4vw, max(40px, calc(50% - 640px)))",
        paddingRight: "clamp(16px, 4vw, max(40px, calc(50% - 640px)))",
        width: "100%",
        position: "relative",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sahitya:wght@400;700&family=Montserrat:wght@400;500;600;700&display=swap');

        /* ── Bento grid responsive ── */
        .bento-grid {
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          gap: clamp(12px, 2vw, 24px);
        }
        @media (max-width: 767px) {
          .bento-grid { grid-template-columns: 1fr !important; }
          .bento-grid > * { grid-column: 1 / -1 !important; grid-row: auto !important; min-height: 360px !important; }
        }
        @media (min-width: 768px) and (max-width: 1023px) {
          .bento-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .bento-grid > * { grid-column: auto !important; grid-row: auto !important; }
        }

        /* ── Heading size ── */
        @media (min-width: 768px) { .projects-heading { font-size: 3rem !important; } }

        /* ── Reduced motion ── */
        @media (prefers-reduced-motion: reduce) {
          .work-card { opacity: 1 !important; transform: none !important; transition: none !important; }
        }

        /* ── Liquid wave inside glass panel ── */
        @keyframes liquidWave {
          0%,100% { transform: translateX(0%) translateY(0%) scale(1);    filter: blur(20px) hue-rotate(0deg);  }
          25%      { transform: translateX(5%) translateY(-3%) scale(1.05); filter: blur(25px) hue-rotate(10deg); }
          50%      { transform: translateX(-3%) translateY(5%) scale(0.98); filter: blur(30px) hue-rotate(20deg); }
          75%      { transform: translateX(3%) translateY(-5%) scale(1.02); filter: blur(25px) hue-rotate(10deg); }
        }

        /* ── Mouse-follow halo ── */
        .card-halo {
          position: absolute;
          width: 180px;
          height: 180px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(253,184,19,0.18) 0%, rgba(253,184,19,0.06) 40%, transparent 70%);
          pointer-events: none;
          z-index: 2;
          transform: translate(-50%, -50%);
          opacity: 0;
          transition: opacity 300ms ease;
          filter: blur(8px);
        }
      `}</style>

      {/* ── Section Header ── */}
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginBottom: "clamp(24px, 4vw, 48px)",
          flexWrap: "wrap",
          gap: "16px",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div>
          <h2
            className="projects-heading"
            style={{
              fontSize: "1.875rem",
              fontWeight: 700,
              lineHeight: 1.25,
              margin: "0 0 8px 0",
              display: "flex",
              flexWrap: "wrap",
              gap: "0.3em",
            }}
          >
            {headingWords.map((word, wi) => (
              <span
                key={wi}
                style={{
                  display: "inline-block",
                  fontFamily: "Sahitya, serif",
                  fontWeight: 700,
                  background:
                    wi === 0
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
          <p
            style={{
              fontSize: "16px",
              fontWeight: 400,
              color: textMuted,
              maxWidth: "480px",
              margin: 0,
              lineHeight: 1.5,
              fontFamily: "'Montserrat', sans-serif",
            }}
          >
            {subheading}
          </p>
        </div>

        <a
          href={viewAllLink}
          style={{
            fontSize: "14px",
            fontWeight: 500,
            color: textMuted,
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            minHeight: "44px",
            fontFamily: "'Montserrat', sans-serif",
            transition: "color 200ms ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = accentColor;
            e.currentTarget.style.textDecoration = "underline";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = textMuted;
            e.currentTarget.style.textDecoration = "none";
          }}
          onFocus={(e) => {
            e.currentTarget.style.outline = `2px solid ${accentColor}`;
            e.currentTarget.style.outlineOffset = "3px";
          }}
          onBlur={(e) => {
            e.currentTarget.style.outline = "none";
          }}
        >
          {viewAllText}
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M7 17L17 7M17 7H7M17 7V17" />
          </svg>
        </a>
      </header>

      {/* ── Filter Bar ── */}
      {showFilters && (
        <div
          style={{
            display: "flex",
            gap: "8px",
            flexWrap: "wrap",
            marginBottom: "clamp(24px, 3vw, 32px)",
          }}
          role="group"
          aria-label="Filter projects by category"
        >
          {filters.map((filter) => {
            const isActive = activeFilter === filter;
            return (
              <button
                key={filter}
                onClick={() => startTransition(() => setActiveFilter(filter))}
                aria-pressed={isActive}
                style={{
                  background: isActive
                    ? "rgba(253,184,19,0.12)"
                    : "transparent",
                  border: isActive
                    ? "1px solid rgba(253,184,19,0.50)"
                    : "1px solid rgba(255,255,255,0.14)",
                  borderRadius: "100px",
                  padding: "8px 18px",
                  minHeight: "44px",
                  fontSize: "13px",
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? accentColor : "rgba(255,255,255,0.55)",
                  cursor: "pointer",
                  fontFamily: "'Montserrat', sans-serif",
                  transition: "all 200ms ease",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.borderColor =
                      "rgba(255,255,255,0.30)";
                    e.currentTarget.style.color = "rgba(255,255,255,0.85)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.borderColor =
                      "rgba(255,255,255,0.14)";
                    e.currentTarget.style.color = "rgba(255,255,255,0.55)";
                  }
                }}
              >
                {filter}
              </button>
            );
          })}
        </div>
      )}

      {/* ── Bento Grid ── */}
      {displayProjects.length > 0 ? (
        <div className="bento-grid">
          {displayProjects.map((project, index) => {
            const isSmallCard = index >= 3;
            const isVisible = visibleCards.has(index);
            const delay = index * 80;

            return (
              <a
                key={index}
                ref={(el) => {
                  cardRefs.current[index] = el;
                }}
                href={project.link}
                className="work-card"
                aria-label={`View case study: ${project.title} — ${project.category}`}
                onMouseMove={(e) => handleCardMouseMove(e, index)}
                style={{
                  ...gridStyles[index],
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  background: "transparent",
                  borderRadius: "clamp(16px, 2.5vw, 32px)",
                  overflow: "hidden",
                  textDecoration: "none",
                  cursor: "pointer",
                  touchAction: "manipulation",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.30)",
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? "translateY(0)" : "translateY(32px)",
                  transition: `transform 220ms cubic-bezier(0.16,1,0.3,1), box-shadow 220ms ease, opacity 500ms ease-out ${delay}ms, transform 500ms cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform =
                    "translateY(-8px) scale(1.01)";
                  e.currentTarget.style.boxShadow =
                    "0 32px 80px rgba(0,0,0,0.60), 0 0 60px rgba(253,184,19,0.15)";
                  const arrow = e.currentTarget.querySelector(".arrow-icon");
                  if (arrow) {
                    arrow.style.color = accentColor;
                    arrow.style.transform = "translate(3px,-3px)";
                  }
                  const glass = e.currentTarget.querySelector(".glass-panel");
                  if (glass) {
                    glass.style.background = "rgba(255,255,255,0.12)";
                    glass.style.backdropFilter = "blur(30px) saturate(180%)";
                    glass.style.webkitBackdropFilter =
                      "blur(30px) saturate(180%)";
                  }
                }}
                onMouseLeave={(e) => {
                  handleCardMouseLeave(e, index);
                  e.currentTarget.style.transform = "translateY(0) scale(1)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 32px rgba(0,0,0,0.30)";
                  const arrow = e.currentTarget.querySelector(".arrow-icon");
                  if (arrow) {
                    arrow.style.color = textSecondary;
                    arrow.style.transform = "translate(0,0)";
                  }
                  const glass = e.currentTarget.querySelector(".glass-panel");
                  if (glass) {
                    glass.style.background = "rgba(255,255,255,0.06)";
                    glass.style.backdropFilter =
                      "blur(40px) saturate(180%) brightness(1.1)";
                    glass.style.webkitBackdropFilter =
                      "blur(40px) saturate(180%) brightness(1.1)";
                  }
                }}
                onFocus={(e) => {
                  e.currentTarget.style.outline = `3px solid ${accentColor}`;
                  e.currentTarget.style.outlineOffset = "4px";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.outline = "none";
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.transform =
                    "translateY(-4px) scale(0.98)";
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.transform =
                    "translateY(-8px) scale(1.01)";
                }}
              >
                {/* ── Cursor-following yellow halo ── */}
                <div className="card-halo" aria-hidden="true" />

                {/* ── Subtle corner border — top-right + bottom-left only ── */}
                <svg
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    zIndex: 1,
                    pointerEvents: "none",
                    borderRadius: "inherit",
                  }}
                >
                  <defs>
                    <linearGradient
                      id={`corner-grad-${index}`}
                      x1="1"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="rgba(253,184,19,0.45)" />
                      <stop offset="25%" stopColor="rgba(253,184,19,0.0)" />
                      <stop offset="75%" stopColor="rgba(253,184,19,0.0)" />
                      <stop offset="100%" stopColor="rgba(253,184,19,0.45)" />
                    </linearGradient>
                  </defs>
                  <rect
                    x="1"
                    y="1"
                    width="calc(100% - 2px)"
                    height="calc(100% - 2px)"
                    rx="clamp(16px, 2.5vw, 32px)"
                    ry="clamp(16px, 2.5vw, 32px)"
                    fill="none"
                    stroke={`url(#corner-grad-${index})`}
                    strokeWidth="1.5"
                  />
                </svg>

                {/* ── Thumbnail ── */}
                <figure
                  style={{
                    margin: 0,
                    flex: "0 0 65%",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={project.image.src}
                    alt={project.image.alt}
                    loading="lazy"
                    width="800"
                    height="600"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      objectPosition: "center",
                      display: "block",
                    }}
                  />
                  {/* Bottom gradient fade */}
                  <div
                    aria-hidden="true"
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: "60%",
                      background:
                        "linear-gradient(to bottom, transparent 0%, rgba(5,5,8,0.3) 40%, rgba(5,5,8,0.85) 100%)",
                      pointerEvents: "none",
                    }}
                  />
                </figure>

                {/* ── Glass Details Panel ── */}
                <div
                  className="glass-panel"
                  style={{
                    padding: "clamp(20px, 2.5vw, 32px)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    flex: 1,
                    position: "relative",
                    background: "rgba(255,255,255,0.06)",
                    backdropFilter: "blur(40px) saturate(180%) brightness(1.1)",
                    WebkitBackdropFilter:
                      "blur(40px) saturate(180%) brightness(1.1)",
                    borderTop: "1px solid rgba(255,255,255,0.18)",
                    transition: "all 350ms cubic-bezier(0.16,1,0.3,1)",
                    boxShadow:
                      "inset 0 1px 0 0 rgba(255,255,255,0.1), 0 10px 30px rgba(0,0,0,0.2)",
                  }}
                >
                  {/* Liquid radial overlay */}
                  <div
                    aria-hidden="true"
                    style={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "radial-gradient(circle at 30% 50%, rgba(253,184,19,0.15) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(138,43,226,0.12) 0%, transparent 50%), radial-gradient(circle at 50% 20%, rgba(65,105,225,0.10) 0%, transparent 50%)",
                      pointerEvents: "none",
                      zIndex: 0,
                      backdropFilter: "blur(60px) saturate(200%)",
                      WebkitBackdropFilter: "blur(60px) saturate(200%)",
                      mixBlendMode: "overlay",
                      opacity: 0.8,
                    }}
                  />
                  {/* Animated liquid gradient */}
                  <div
                    aria-hidden="true"
                    style={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(135deg, rgba(253,184,19,0.12) 0%, rgba(138,43,226,0.08) 50%, rgba(65,105,225,0.10) 100%)",
                      pointerEvents: "none",
                      zIndex: 0,
                      filter: "blur(20px)",
                      animation: "liquidWave 8s ease-in-out infinite",
                    }}
                  />

                  {/* Text content */}
                  <div
                    style={{
                      position: "relative",
                      zIndex: 1,
                      display: "flex",
                      flexDirection: "column",
                      height: "100%",
                      gap: "10px",
                    }}
                  >
                    {/* Category tag */}
                    <span
                      style={{
                        display: "inline-block",
                        fontSize: "10px",
                        fontWeight: 600,
                        letterSpacing: "0.20em",
                        textTransform: "uppercase",
                        color: categoryTagColor,
                        background: "rgba(253,184,19,0.15)",
                        border: "1px solid rgba(253,184,19,0.35)",
                        borderRadius: "6px",
                        padding: "4px 10px",
                        width: "fit-content",
                        backdropFilter: "blur(10px)",
                        fontFamily: "'Montserrat', sans-serif",
                      }}
                    >
                      {project.category}
                    </span>

                    {/* Title */}
                    <h3
                      style={{
                        fontSize: isSmallCard
                          ? "clamp(16px, 1.8vw, 20px)"
                          : "clamp(20px, 2.2vw, 28px)",
                        fontWeight: 700,
                        lineHeight: 1.2,
                        color: textPrimary,
                        margin: 0,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        textShadow: "0 2px 8px rgba(0,0,0,0.3)",
                        fontFamily: "'Montserrat', sans-serif",
                      }}
                    >
                      {project.title}
                    </h3>

                    {/* Description — large cards only */}
                    {!isSmallCard && (
                      <p
                        style={{
                          fontSize: "14px",
                          fontWeight: 400,
                          color: "rgba(255,255,255,0.65)",
                          lineHeight: 1.5,
                          margin: 0,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          fontFamily: "'Montserrat', sans-serif",
                        }}
                      >
                        {project.description}
                      </p>
                    )}

                    {/* Bottom row — year · tools + arrow */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginTop: "auto",
                        paddingTop: "16px",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "12px",
                          fontWeight: 500,
                          color: "rgba(253,184,19,0.70)",
                          fontFamily: "'Montserrat', sans-serif",
                        }}
                      >
                        {project.year} · {project.tools}
                      </span>
                      <svg
                        className="arrow-icon"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        aria-hidden="true"
                        style={{
                          color: textSecondary,
                          transition: "color 200ms ease, transform 200ms ease",
                        }}
                      >
                        <path d="M7 17L17 7M17 7H7M17 7V17" />
                      </svg>
                    </div>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      ) : (
        /* ── Empty State ── */
        <div
          style={{
            textAlign: "center",
            padding: "80px 24px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <svg
            width="64"
            height="64"
            viewBox="0 0 64 64"
            fill="none"
            style={{ color: "rgba(253,184,19,0.40)" }}
          >
            <circle cx="32" cy="32" r="2" fill="currentColor" />
            <circle cx="20" cy="20" r="1.5" fill="currentColor" />
            <circle cx="44" cy="20" r="1.5" fill="currentColor" />
            <circle cx="20" cy="44" r="1.5" fill="currentColor" />
            <circle cx="44" cy="44" r="1.5" fill="currentColor" />
          </svg>
          <h3
            style={{
              fontSize: "24px",
              fontStyle: "italic",
              fontWeight: 700,
              color: "rgba(255,255,255,0.70)",
              margin: 0,
              fontFamily: "'Montserrat', sans-serif",
            }}
          >
            Nothing here yet
          </h3>
          <p
            style={{
              fontSize: "16px",
              color: "rgba(255,255,255,0.40)",
              margin: 0,
              fontFamily: "'Montserrat', sans-serif",
            }}
          >
            Projects are on their way. Check back soon.
          </p>
          <a
            href="#contact"
            style={{
              marginTop: "16px",
              padding: "12px 24px",
              minHeight: "44px",
              background: "rgba(253,184,19,0.12)",
              border: "1px solid rgba(253,184,19,0.50)",
              borderRadius: "8px",
              color: "#FDB813",
              fontSize: "14px",
              fontWeight: 600,
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              fontFamily: "'Montserrat', sans-serif",
              transition: "all 200ms ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(253,184,19,0.20)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(253,184,19,0.12)";
            }}
            onFocus={(e) => {
              e.currentTarget.style.outline = "2px solid #FDB813";
              e.currentTarget.style.outlineOffset = "3px";
            }}
            onBlur={(e) => {
              e.currentTarget.style.outline = "none";
            }}
          >
            Get in Touch
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      )}
    </section>
  );
}
