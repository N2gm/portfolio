// Premium dark-mode portfolio Navigation Bar for UI/UX Designer "Abdrhman Negm"
// Galaxy-Glass Fusion aesthetic with Frozen Glass treatment
// Responsive with mobile hamburger menu and scroll behavior
// Full Design System v2 compliance with semantic tokens

import {
  useState,
  useEffect,
  useCallback,
  useRef,
  startTransition,
} from "react";
import LiquidMetalButton from "@/components/LiquidMetalButton";

export default function NavigationBar(props) {
  const {
    logoText = "Abdrhman Negm",
    navLinks = [
      { label: "Work", href: "#work", isActive: false },
      { label: "About", href: "#about", isActive: false },
      { label: "Services", href: "#services", isActive: false },
      { label: "Contact", href: "#contact", isActive: false },
    ],
    ctaLabel = "Hire Me",
    ctaHref = "#contact",
    accentColor = "#FDB813",
    textPrimary = "rgba(255, 255, 255, 0.95)",
    textSecondary = "rgba(255, 255, 255, 0.60)",
  } = props;

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const scrollTimeoutRef = useRef(null);
  const hamburgerButtonRef = useRef(null);

  // Handle scroll behavior with debouncing (rAF)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleScroll = () => {
      if (scrollTimeoutRef.current !== null) return;
      scrollTimeoutRef.current = window.requestAnimationFrame(() => {
        startTransition(() => {
          setIsScrolled(window.scrollY > 80);
        });
        scrollTimeoutRef.current = null;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeoutRef.current !== null) {
        window.cancelAnimationFrame(scrollTimeoutRef.current);
      }
    };
  }, []);

  // Track active section via IntersectionObserver
  useEffect(() => {
    if (typeof window === "undefined") return;

    const sectionIds = navLinks.map((l) => l.href.replace("#", ""));
    const observers = [];

    // Also observe "hero" — when hero is visible, clear active section
    const heroEl = document.getElementById("hero");
    if (heroEl) {
      const heroObs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            startTransition(() => setActiveSection(""));
          }
        },
        { rootMargin: "-10% 0px -60% 0px", threshold: 0 },
      );
      heroObs.observe(heroEl);
      observers.push(heroObs);
    }

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            startTransition(() => setActiveSection(id));
          }
        },
        { rootMargin: "-40% 0px -55% 0px", threshold: 0 },
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((obs) => obs.disconnect());
  }, [navLinks]);

  // Smooth scroll on nav link click
  const handleNavClick = useCallback((e, href) => {
    e.preventDefault();
    const id = href.replace("#", "");
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (typeof document === "undefined") return;

    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  // Handle escape key to close menu
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleEscape = (e) => {
      if (e.key === "Escape" && isMobileMenuOpen) {
        startTransition(() => setIsMobileMenuOpen(false));
        // Return focus to hamburger button
        setTimeout(() => hamburgerButtonRef.current?.focus(), 100);
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = useCallback(() => {
    startTransition(() => setIsMobileMenuOpen((prev) => !prev));
  }, []);

  const closeMobileMenu = useCallback(() => {
    startTransition(() => setIsMobileMenuOpen(false));
    // Return focus to hamburger button
    setTimeout(() => hamburgerButtonRef.current?.focus(), 100);
  }, []);

  return (
    <>
      {/* Google Fonts with font-display: swap */}
      <link
        href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,700;1,700&display=swap"
        rel="stylesheet"
      />

      {/* CSS Custom Properties - Semantic Token System */}
      <style>{`
                :root {
                    /* Core Palette */
                    --color-bg-base: #050508;
                    --color-bg-surface: rgba(255, 255, 255, 0.06);
                    --color-bg-nav: rgba(255, 255, 255, 0.10);
                    --color-bg-blob: #483D6F;
                    
                    /* Brand Accents */
                    --color-accent-gold: #FDB813;
                    --color-accent-indigo: #483D6F;
                    --color-accent-lavender: #806C9B;
                    
                    /* Text */
                    --color-text-primary: rgba(255, 255, 255, 0.95);
                    --color-text-secondary: rgba(255, 255, 255, 0.65);
                    --color-text-muted: rgba(255, 255, 255, 0.40);
                    --color-text-on-gold: #050508;
                    
                    /* Borders */
                    --color-border-glass: rgba(255, 255, 255, 0.08);
                    --color-border-accent: linear-gradient(135deg, #483D6F, #FDB813, #806C9B);
                    
                    /* Interactive States */
                    --color-hover-overlay: rgba(253, 184, 19, 0.07);
                    --color-active-overlay: rgba(253, 184, 19, 0.14);
                    --color-focus-ring: #FDB813;
                    
                    /* Z-Index Scale */
                    --z-base: 0;
                    --z-raised: 10;
                    --z-sticky: 100;
                    --z-modal: 1000;
                }
            `}</style>

      {/* Skip to main content link */}
      <a
        href="#main-content"
        style={{
          position: "absolute",
          left: "-9999px",
          zIndex: 9999,
          padding: "12px 24px",
          background: "var(--color-accent-gold)",
          color: "var(--color-text-on-gold)",
          fontFamily: "'Montserrat', sans-serif",
          fontWeight: 600,
          fontSize: "14px",
          textDecoration: "none",
          borderRadius: "8px",
        }}
        onFocus={(e) => {
          e.currentTarget.style.left = "16px";
          e.currentTarget.style.top = "16px";
        }}
        onBlur={(e) => {
          e.currentTarget.style.left = "-9999px";
        }}
      >
        Skip to main content
      </a>

      {/* Navigation Bar — fixed, floats over hero */}
      <nav
        aria-label="Primary navigation"
        style={{
          ...props.style,
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          width: "100%",
          minWidth: "320px",
          height: "64px",
          minHeight: "64px",
          background: isScrolled
            ? "rgba(255, 255, 255, 0.08)"
            : "rgba(0, 0, 0, 0.02)",
          backdropFilter: isScrolled
            ? "blur(14px) saturate(180%)"
            : "blur(8px)",
          WebkitBackdropFilter: isScrolled
            ? "blur(14px) saturate(180%)"
            : "blur(8px)",
          borderBottom: isScrolled
            ? "1px solid rgba(255, 255, 255, 0.07)"
            : "1px solid rgba(255, 255, 255, 0.04)",
          boxShadow: isScrolled
            ? "0 4px 32px rgba(0, 0, 0, 0.4), 0 1px 0px rgba(253, 184, 19, 0.06)"
            : "none",
          transition: "all 300ms ease",
          willChange: isScrolled ? "backdrop-filter" : "auto",
          zIndex: "var(--z-sticky)",
        }}
      >
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            height: "100%",
            paddingInline: "40px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Logo — scrolls back to top */}
          <a
            href="#hero"
            aria-label={`${logoText} — Home`}
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            style={{
              fontFamily: "'Playfair Display', serif",
              fontStyle: "italic",
              fontWeight: 700,
              fontSize: "20px",
              background:
                "linear-gradient(90deg, var(--color-accent-lavender), var(--color-accent-gold))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              textDecoration: "none",
              transition: "opacity 200ms ease, filter 200ms ease",
              position: "relative",
              animation:
                "logoFloat 3s ease-in-out infinite, shimmer 4s linear infinite",
              backgroundSize: "200% 100%",
              touchAction: "manipulation",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = "0.8";
              e.currentTarget.style.filter =
                "drop-shadow(0 0 12px rgba(253, 184, 19, 0.7))";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = "1";
              e.currentTarget.style.filter = "none";
            }}
            onFocus={(e) => {
              e.currentTarget.style.outline =
                "2px solid var(--color-focus-ring)";
              e.currentTarget.style.outlineOffset = "4px";
              e.currentTarget.style.borderRadius = "4px";
            }}
            onBlur={(e) => {
              e.currentTarget.style.outline = "none";
            }}
          >
            {logoText}
          </a>

          {/* Desktop Nav Links */}
          <div
            style={{ display: "flex", gap: "8px", alignItems: "center" }}
            className="desktop-nav"
          >
            {navLinks.map((link, index) => {
              const sectionId = link.href.replace("#", "");
              const isActive = activeSection === sectionId;
              return (
                <a
                  key={index}
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  className="nav-link"
                  onClick={(e) => handleNavClick(e, link.href)}
                  style={{
                    position: "relative",
                    minHeight: "44px",
                    minWidth: "44px",
                    display: "flex",
                    alignItems: "center",
                    paddingInline: "12px",
                    fontFamily: "'Montserrat', sans-serif",
                    fontWeight: isActive ? 600 : 500,
                    fontSize: "14px",
                    letterSpacing: "0.04em",
                    color: isActive
                      ? "var(--color-accent-gold)"
                      : "var(--color-text-secondary)",
                    textDecoration: "none",
                    transition:
                      "color 200ms ease, transform 150ms ease, filter 200ms ease",
                    touchAction: "manipulation",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "var(--color-text-primary)";
                    e.currentTarget.style.filter =
                      "drop-shadow(0 0 8px rgba(253, 184, 19, 0.4))";
                    e.currentTarget.style.transform = "translateY(-2px)";
                    const underline =
                      e.currentTarget.querySelector(".underline");
                    if (underline) underline.style.transform = "scaleX(1)";
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive)
                      e.currentTarget.style.color =
                        "var(--color-text-secondary)";
                    e.currentTarget.style.filter = "none";
                    e.currentTarget.style.transform = "translateY(0)";
                    const underline =
                      e.currentTarget.querySelector(".underline");
                    if (underline && !isActive)
                      underline.style.transform = "scaleX(0)";
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.outline =
                      "2px solid var(--color-focus-ring)";
                    e.currentTarget.style.outlineOffset = "3px";
                    e.currentTarget.style.borderRadius = "4px";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.outline = "none";
                  }}
                >
                  {link.label}
                  <span
                    className="underline"
                    aria-hidden="true"
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: "12px",
                      right: "12px",
                      height: "2px",
                      background: "var(--color-accent-gold)",
                      transform: isActive ? "scaleX(1)" : "scaleX(0)",
                      transformOrigin: "left",
                      transition:
                        "transform 220ms cubic-bezier(0.16, 1, 0.3, 1)",
                    }}
                  />
                </a>
              );
            })}

            {/* CTA Button — Liquid Metal */}
            <div style={{ marginLeft: "16px" }}>
              <LiquidMetalButton
                label={ctaLabel}
                onClick={() => {
                  const id = ctaHref.replace("#", "");
                  const el = document.getElementById(id);
                  if (el)
                    el.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
              />
            </div>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            ref={hamburgerButtonRef}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileMenuOpen}
            onClick={toggleMobileMenu}
            className="mobile-menu-button"
            style={{
              display: "none",
              width: "44px",
              height: "44px",
              minWidth: "44px",
              minHeight: "44px",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: 0,
              color: "rgba(255, 255, 255, 0.85)",
              touchAction: "manipulation",
              transition: "transform 150ms ease, color 200ms ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "var(--color-text-primary)";
              e.currentTarget.style.transform = "scale(1.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "rgba(255, 255, 255, 0.85)";
              e.currentTarget.style.transform = "scale(1)";
            }}
            onFocus={(e) => {
              e.currentTarget.style.outline =
                "2px solid var(--color-focus-ring)";
              e.currentTarget.style.outlineOffset = "3px";
              e.currentTarget.style.borderRadius = "4px";
            }}
            onBlur={(e) => {
              e.currentTarget.style.outline = "none";
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <title>{isMobileMenuOpen ? "Close" : "Menu"}</title>
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>

        {/* Mobile & Responsive Styles */}
        <style>{`
                    @keyframes logoFloat {
                        0%, 100% {
                            transform: translateY(0px);
                        }
                        50% {
                            transform: translateY(-3px);
                        }
                    }
                    
                    @keyframes shimmer {
                        0% {
                            background-position: 200% center;
                        }
                        100% {
                            background-position: -200% center;
                        }
                    }
                    
                    @keyframes slideInStagger {
                        from {
                            opacity: 0;
                            transform: translateX(30px);
                        }
                        to {
                            opacity: 1;
                            transform: translateX(0);
                        }
                    }
                    
                    @keyframes cosmicPulse {
                        0%, 100% {
                            box-shadow: 0 0 20px rgba(253, 184, 19, 0.3);
                        }
                        50% {
                            box-shadow: 0 0 40px rgba(253, 184, 19, 0.6), 0 0 60px rgba(128, 108, 155, 0.4);
                        }
                    }
                    
                    /* Remove default focus outline only when custom is applied */
                    *:focus:not(:focus-visible) {
                        outline: none;
                    }
                    
                    *:focus-visible {
                        outline: 2px solid var(--color-focus-ring);
                        outline-offset: 3px;
                    }
                    
                    .nav-link {
                        transition: all 300ms cubic-bezier(0.16, 1, 0.3, 1) !important;
                    }
                    
                    /* Tablet breakpoint */
                    @media (max-width: 1023px) {
                        nav {
                            height: 56px !important;
                            min-height: 56px !important;
                        }
                        nav > div {
                            padding-inline: 24px !important;
                        }
                        .desktop-nav {
                            display: none !important;
                        }
                        .mobile-menu-button {
                            display: flex !important;
                            align-items: center;
                            justify-content: center;
                        }
                    }
                    
                    /* Mobile breakpoint */
                    @media (max-width: 767px) {
                        nav > div {
                            padding-inline: 16px !important;
                        }
                        nav a[aria-label*="Home"] {
                            font-size: 18px !important;
                        }
                    }
                    
                    /* Scroll padding for anchor links */
                    html {
                        scroll-padding-top: 80px;
                    }
                    
                    @media (max-width: 1023px) {
                        html {
                            scroll-padding-top: 72px;
                        }
                    }
                `}</style>
      </nav>

      {/* Mobile Menu Backdrop */}
      {isMobileMenuOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.5)",
            zIndex: 999,
            animation: "fadeIn 200ms ease",
          }}
          onClick={closeMobileMenu}
          aria-hidden="true"
        />
      )}

      {/* Mobile Slide-In Drawer */}
      {isMobileMenuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
          style={{
            position: "fixed",
            top: 0,
            right: 0,
            height: "100dvh",
            width: "min(320px, 85vw)",
            background: "rgba(10, 8, 20, 0.96)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            borderLeft: "1px solid var(--color-border-glass)",
            zIndex: 1000,
            padding: "32px 24px",
            animation: "slideIn 280ms cubic-bezier(0.16, 1, 0.3, 1)",
            display: "flex",
            flexDirection: "column",
            overflowY: "auto",
          }}
        >
          {/* Close Button */}
          <button
            onClick={closeMobileMenu}
            aria-label="Close menu"
            style={{
              position: "absolute",
              top: "16px",
              right: "16px",
              width: "44px",
              height: "44px",
              minWidth: "44px",
              minHeight: "44px",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: "rgba(255, 255, 255, 0.85)",
              fontSize: "32px",
              lineHeight: "1",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              touchAction: "manipulation",
              transition: "all 200ms ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "var(--color-text-primary)";
              e.currentTarget.style.transform = "rotate(90deg) scale(1.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "rgba(255, 255, 255, 0.85)";
              e.currentTarget.style.transform = "rotate(0deg) scale(1)";
            }}
            onFocus={(e) => {
              e.currentTarget.style.outline =
                "2px solid var(--color-focus-ring)";
              e.currentTarget.style.outlineOffset = "3px";
              e.currentTarget.style.borderRadius = "4px";
            }}
            onBlur={(e) => {
              e.currentTarget.style.outline = "none";
            }}
          >
            ×
          </button>

          {/* Mobile Nav Links */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              marginTop: "40px",
            }}
          >
            {navLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                aria-current={link.isActive ? "page" : undefined}
                onClick={closeMobileMenu}
                style={{
                  minHeight: "52px",
                  display: "flex",
                  alignItems: "center",
                  paddingInline: "16px",
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: link.isActive ? 600 : 500,
                  fontSize: "18px",
                  color: link.isActive
                    ? "var(--color-accent-gold)"
                    : "var(--color-text-secondary)",
                  textDecoration: "none",
                  borderRadius: "8px",
                  transition: "all 300ms cubic-bezier(0.16, 1, 0.3, 1)",
                  animation: `slideInStagger 400ms cubic-bezier(0.16, 1, 0.3, 1) ${index * 80}ms backwards`,
                  touchAction: "manipulation",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background =
                    "var(--color-hover-overlay)";
                  e.currentTarget.style.color = "var(--color-text-primary)";
                  e.currentTarget.style.transform = "translateX(8px)";
                  e.currentTarget.style.boxShadow =
                    "0 0 20px rgba(253, 184, 19, 0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  if (!link.isActive)
                    e.currentTarget.style.color = "var(--color-text-secondary)";
                  e.currentTarget.style.transform = "translateX(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
                onFocus={(e) => {
                  e.currentTarget.style.outline =
                    "2px solid var(--color-focus-ring)";
                  e.currentTarget.style.outlineOffset = "3px";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.outline = "none";
                }}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Mobile CTA Button */}
          <a
            href={ctaHref}
            onClick={closeMobileMenu}
            style={{
              marginTop: "24px",
              width: "100%",
              background: "rgba(253, 184, 19, 0.08)",
              border: "1.5px solid var(--color-accent-gold)",
              borderRadius: "8px",
              padding: "14px 20px",
              minHeight: "52px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 600,
              fontSize: "15px",
              letterSpacing: "0.06em",
              color: "var(--color-accent-gold)",
              textDecoration: "none",
              transition: "all 300ms cubic-bezier(0.16, 1, 0.3, 1)",
              animation: `slideInStagger 400ms cubic-bezier(0.16, 1, 0.3, 1) ${navLinks.length * 80 + 100}ms backwards, cosmicPulse 2s ease-in-out infinite`,
              touchAction: "manipulation",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--color-active-overlay)";
              e.currentTarget.style.transform = "scale(1.05)";
              e.currentTarget.style.boxShadow =
                "0 0 30px rgba(253, 184, 19, 0.6), 0 0 50px rgba(128, 108, 155, 0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(253, 184, 19, 0.08)";
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "none";
            }}
            onFocus={(e) => {
              e.currentTarget.style.outline =
                "2px solid var(--color-focus-ring)";
              e.currentTarget.style.outlineOffset = "3px";
            }}
            onBlur={(e) => {
              e.currentTarget.style.outline = "none";
            }}
          >
            {ctaLabel}
          </a>

          <style>{`
                        @keyframes slideIn {
                            from {
                                transform: translateX(100%);
                            }
                            to {
                                transform: translateX(0);
                            }
                        }
                        
                        @keyframes fadeIn {
                            from {
                                opacity: 0;
                            }
                            to {
                                opacity: 1;
                            }
                        }
                    `}</style>
        </div>
      )}
    </>
  );
}
