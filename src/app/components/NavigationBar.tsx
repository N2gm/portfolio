import { useState, useEffect, useCallback, useRef, startTransition } from "react";
import { LiquidMetalButton } from "./LiquidMetalButton";

interface NavLink {
  label: string;
  href: string;
  isActive?: boolean;
}

interface NavigationBarProps {
  logoText?: string;
  navLinks?: NavLink[];
  ctaLabel?: string;
  ctaHref?: string;
  accentColor?: string;
  textPrimary?: string;
  textSecondary?: string;
  style?: React.CSSProperties;
}

export default function NavigationBar(props: NavigationBarProps) {
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
  } = props;

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const scrollTimeoutRef = useRef<number | null>(null);
  const hamburgerButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollTimeoutRef.current !== null) return;
      scrollTimeoutRef.current = window.requestAnimationFrame(() => {
        startTransition(() => { setIsScrolled(window.scrollY > 80); });
        scrollTimeoutRef.current = null;
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeoutRef.current !== null) window.cancelAnimationFrame(scrollTimeoutRef.current);
    };
  }, []);


  const handleNavClick = useCallback((e: React.MouseEvent, href: string) => {
    e.preventDefault();
    const id = href.replace("#", "");
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMobileMenuOpen) {
        startTransition(() => setIsMobileMenuOpen(false));
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
    setTimeout(() => hamburgerButtonRef.current?.focus(), 100);
  }, []);

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,700;1,700&display=swap" rel="stylesheet" />
      <style>{`
        :root {
          --color-bg-base: #050508;
          --color-accent-gold: #FDB813;
          --color-accent-indigo: #483D6F;
          --color-accent-lavender: #806C9B;
          --color-text-primary: rgba(255, 255, 255, 0.95);
          --color-text-secondary: rgba(255, 255, 255, 0.65);
          --color-text-muted: rgba(255, 255, 255, 0.40);
          --color-text-on-gold: #050508;
          --color-border-glass: rgba(255, 255, 255, 0.08);
          --color-hover-overlay: rgba(253, 184, 19, 0.07);
          --color-active-overlay: rgba(253, 184, 19, 0.14);
          --color-focus-ring: #FDB813;
          --z-sticky: 100;
          --z-modal: 1000;
        }
        *:focus:not(:focus-visible) { outline: none; }
        *:focus-visible { outline: 2px solid var(--color-focus-ring); outline-offset: 3px; }
        .nav-link { transition: all 300ms cubic-bezier(0.16, 1, 0.3, 1) !important; }
        @keyframes logoFloat { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-3px); } }
        @keyframes shimmer { 0% { background-position: 200% center; } 100% { background-position: -200% center; } }
        @keyframes slideInStagger { from { opacity: 0; transform: translateX(30px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes cosmicPulse { 0%, 100% { box-shadow: 0 0 20px rgba(253, 184, 19, 0.3); } 50% { box-shadow: 0 0 40px rgba(253, 184, 19, 0.6), 0 0 60px rgba(128, 108, 155, 0.4); } }
        @media (max-width: 1023px) {
          .portfolio-nav { height: 56px !important; min-height: 56px !important; }
          .portfolio-nav > div { padding-inline: 24px !important; }
          .desktop-nav { display: none !important; }
          .mobile-menu-button { display: flex !important; }
        }
        @media (max-width: 767px) {
          .portfolio-nav > div { padding-inline: 16px !important; }
        }
        html { scroll-padding-top: 80px; }
        @media (max-width: 1023px) { html { scroll-padding-top: 72px; } }
      `}</style>

      <a
        href="#main-content"
        style={{ position: "absolute", left: "-9999px", zIndex: 9999, padding: "12px 24px", background: "var(--color-accent-gold)", color: "var(--color-text-on-gold)", fontFamily: "'Montserrat', sans-serif", fontWeight: 600, fontSize: "14px", textDecoration: "none", borderRadius: "8px" }}
        onFocus={(e) => { e.currentTarget.style.left = "16px"; e.currentTarget.style.top = "16px"; }}
        onBlur={(e) => { e.currentTarget.style.left = "-9999px"; }}
      >
        Skip to main content
      </a>

      <nav
        className="portfolio-nav"
        aria-label="Primary navigation"
        style={{
          ...props.style,
          position: "fixed", top: 0, left: 0, right: 0, width: "100%", minWidth: "320px",
          height: "64px", minHeight: "64px",
          background: isScrolled ? "rgba(255, 255, 255, 0.07)" : "transparent",
          backdropFilter: isScrolled ? "blur(28px) saturate(200%)" : "none",
          WebkitBackdropFilter: isScrolled ? "blur(28px) saturate(200%)" : "none",
          borderBottom: isScrolled ? "1px solid rgba(255, 255, 255, 0.10)" : "1px solid transparent",
          boxShadow: isScrolled ? "0 1px 0 rgba(255,255,255,0.06), 0 4px 24px rgba(0,0,0,0.30)" : "none",
          transition: "all 300ms ease",
          zIndex: "var(--z-sticky)",
        }}
      >
        <div style={{ maxWidth: "1280px", margin: "0 auto", height: "100%", paddingInline: "40px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <a
            href="#hero"
            aria-label={`${logoText} — Home`}
            onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
            style={{
              fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 700, fontSize: "20px",
              background: "linear-gradient(90deg, var(--color-accent-lavender), var(--color-accent-gold))",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
              textDecoration: "none", transition: "opacity 200ms ease, filter 200ms ease",
              animation: "logoFloat 3s ease-in-out infinite, shimmer 4s linear infinite",
              backgroundSize: "200% 100%", touchAction: "manipulation", cursor: "pointer",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.8"; e.currentTarget.style.filter = "drop-shadow(0 0 12px rgba(253, 184, 19, 0.7))"; }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.filter = "none"; }}
          >
            {logoText}
          </a>

          <div style={{ display: "flex", gap: "8px", alignItems: "center" }} className="desktop-nav">
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
                    position: "relative", minHeight: "44px", minWidth: "44px", display: "flex", alignItems: "center", paddingInline: "12px",
                    fontFamily: "'Montserrat', sans-serif", fontWeight: isActive ? 600 : 500, fontSize: "14px", letterSpacing: "0.04em",
                    color: isActive ? "var(--color-accent-gold)" : "var(--color-text-secondary)",
                    textDecoration: "none", transition: "color 200ms ease, transform 150ms ease, filter 200ms ease",
                    touchAction: "manipulation", cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "var(--color-text-primary)";
                    e.currentTarget.style.filter = "drop-shadow(0 0 8px rgba(253, 184, 19, 0.4))";
                    e.currentTarget.style.transform = "translateY(-2px)";
                    const underline = e.currentTarget.querySelector(".underline") as HTMLElement;
                    if (underline) underline.style.transform = "scaleX(1)";
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.color = "var(--color-text-secondary)";
                    e.currentTarget.style.filter = "none";
                    e.currentTarget.style.transform = "translateY(0)";
                    const underline = e.currentTarget.querySelector(".underline") as HTMLElement;
                    if (underline && !isActive) underline.style.transform = "scaleX(0)";
                  }}
                >
                  {link.label}
                  <span className="underline" aria-hidden="true" style={{ position: "absolute", bottom: 0, left: "12px", right: "12px", height: "2px", background: "var(--color-accent-gold)", transform: isActive ? "scaleX(1)" : "scaleX(0)", transformOrigin: "left", transition: "transform 220ms cubic-bezier(0.16, 1, 0.3, 1)" }} />
                </a>
              );
            })}
            <div style={{ marginLeft: "16px" }}>
              <LiquidMetalButton label={ctaLabel} onClick={() => {
                const id = ctaHref.replace("#", "");
                const el = document.getElementById(id);
                if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
              }} />
            </div>
          </div>

          <div className="mobile-menu-button" style={{ display: "none", alignItems: "center", gap: "8px" }}>
            <LiquidMetalButton
              viewMode="icon"
              label="Hire Me"
              onClick={() => {
                const id = ctaHref.replace("#", "");
                const el = document.getElementById(id);
                if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
            />
          <button
            ref={hamburgerButtonRef}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileMenuOpen}
            onClick={toggleMobileMenu}
            style={{ width: "44px", height: "44px", minWidth: "44px", minHeight: "44px", background: "transparent", border: "none", cursor: "pointer", padding: 0, color: "rgba(255, 255, 255, 0.85)", touchAction: "manipulation", transition: "transform 150ms ease, color 200ms ease", display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <title>{isMobileMenuOpen ? "Close" : "Menu"}</title>
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          </div>
        </div>
      </nav>

      {isMobileMenuOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0, 0, 0, 0.5)", zIndex: 999 }} onClick={closeMobileMenu} aria-hidden="true" />
      )}

      {isMobileMenuOpen && (
        <div
          role="dialog" aria-modal="true" aria-label="Navigation menu"
          style={{ position: "fixed", top: 0, right: 0, height: "100dvh", width: "min(320px, 85vw)", background: "rgba(10, 8, 20, 0.96)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)", borderLeft: "1px solid var(--color-border-glass)", zIndex: 1000, padding: "32px 24px", animation: "slideIn 280ms cubic-bezier(0.16, 1, 0.3, 1)", display: "flex", flexDirection: "column", overflowY: "auto" }}
        >
          <style>{`
            @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
            @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
            @keyframes slideInStagger { from { opacity: 0; transform: translateX(18px); } to { opacity: 1; transform: translateX(0); } }
            @keyframes navRipple {
              0%   { transform: translate(-50%,-50%) scale(0); opacity: 0.6; }
              100% { transform: translate(-50%,-50%) scale(6); opacity: 0; }
            }
          `}</style>
          <button onClick={closeMobileMenu} aria-label="Close menu" style={{ position: "absolute", top: "16px", right: "16px", width: "44px", height: "44px", background: "transparent", border: "none", cursor: "pointer", color: "rgba(255, 255, 255, 0.85)", fontSize: "32px", lineHeight: "1", display: "flex", alignItems: "center", justifyContent: "center", touchAction: "manipulation" }}>
            ×
          </button>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "40px" }}>
            {navLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                onClick={(e) => {
                  const el = e.currentTarget;
                  const rect = el.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const y = e.clientY - rect.top;
                  const ripple = document.createElement("span");
                  ripple.style.cssText = `position:absolute;left:${x}px;top:${y}px;width:80px;height:80px;border-radius:50%;transform:translate(-50%,-50%) scale(0);background:radial-gradient(circle,rgba(253,184,19,0.55) 0%,rgba(253,184,19,0) 70%);pointer-events:none;animation:navRipple 700ms cubic-bezier(0.22,1,0.36,1) forwards;`;
                  el.appendChild(ripple);
                  setTimeout(() => ripple.remove(), 720);
                  el.style.background = "rgba(253,184,19,0.10)";
                  setTimeout(() => { el.style.background = "transparent"; }, 350);
                  closeMobileMenu();
                }}
                style={{ minHeight: "52px", display: "flex", alignItems: "center", paddingInline: "16px", fontFamily: "'Montserrat', sans-serif", fontWeight: link.isActive ? 600 : 500, fontSize: "18px", color: link.isActive ? "var(--color-accent-gold)" : "var(--color-text-secondary)", textDecoration: "none", borderRadius: "8px", transition: "all 300ms cubic-bezier(0.16, 1, 0.3, 1)", animation: `slideInStagger 400ms cubic-bezier(0.16, 1, 0.3, 1) ${index * 80}ms backwards`, touchAction: "manipulation", cursor: "pointer", position: "relative", overflow: "hidden" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "var(--color-hover-overlay)"; e.currentTarget.style.color = "var(--color-text-primary)"; e.currentTarget.style.transform = "translateX(8px)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; if (!link.isActive) e.currentTarget.style.color = "var(--color-text-secondary)"; e.currentTarget.style.transform = "translateX(0)"; }}
              >
                {link.label}
              </a>
            ))}
          </div>
          
        </div>
      )}
    </>
  );
}
