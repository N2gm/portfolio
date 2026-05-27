// GlowCard — Mouse-tracked spotlight glow card
// Gold-only color scheme to match site design system
// Converted from TypeScript, adapted for portfolio

import { useEffect, useRef } from "react";

// Gold hue = ~43, subtle spread so it stays gold across mouse movement
const GOLD_BASE = 43;
const GOLD_SPREAD = 18;

const sizeMap = {
  sm: { width: "192px", height: "256px" },
  md: { width: "256px", height: "320px" },
  lg: { width: "320px", height: "384px" },
};

const BEFORE_AFTER_CSS = `
  [data-glow]::before,
  [data-glow]::after {
    pointer-events: none;
    content: "";
    position: absolute;
    inset: calc(var(--border-size) * -1);
    border: var(--border-size) solid transparent;
    border-radius: calc(var(--radius) * 1px);
    background-attachment: fixed;
    background-size: calc(100% + (2 * var(--border-size))) calc(100% + (2 * var(--border-size)));
    background-repeat: no-repeat;
    background-position: 50% 50%;
    mask: linear-gradient(transparent, transparent), linear-gradient(white, white);
    mask-clip: padding-box, border-box;
    mask-composite: intersect;
    -webkit-mask: linear-gradient(transparent, transparent), linear-gradient(white, white);
    -webkit-mask-clip: padding-box, border-box;
    -webkit-mask-composite: destination-in;
  }

  [data-glow]::before {
    background-image: radial-gradient(
      calc(var(--spotlight-size) * 0.75) calc(var(--spotlight-size) * 0.75) at
      calc(var(--x, 0) * 1px)
      calc(var(--y, 0) * 1px),
      hsl(var(--hue, 43) calc(var(--saturation, 100) * 1%) calc(var(--lightness, 50) * 1%) / var(--border-spot-opacity, 1)), transparent 100%
    );
    filter: brightness(2);
  }

  [data-glow]::after {
    background-image: radial-gradient(
      calc(var(--spotlight-size) * 0.5) calc(var(--spotlight-size) * 0.5) at
      calc(var(--x, 0) * 1px)
      calc(var(--y, 0) * 1px),
      hsl(0 100% 100% / var(--border-light-opacity, 1)), transparent 100%
    );
  }

  [data-glow] [data-glow] {
    position: absolute;
    inset: 0;
    will-change: filter;
    opacity: var(--outer, 1);
    border-radius: calc(var(--radius) * 1px);
    border-width: calc(var(--border-size) * 20);
    filter: blur(calc(var(--border-size) * 10));
    background: none;
    pointer-events: none;
    border: none;
  }

  [data-glow] > [data-glow]::before {
    inset: -10px;
    border-width: 10px;
  }
`;

export default function GlowCard({
  children,
  className = "",
  size = "md",
  width,
  height,
  customSize = false,
  style = {},
}) {
  const cardRef = useRef(null);

  useEffect(() => {
    const syncPointer = (e) => {
      const { clientX: x, clientY: y } = e;
      if (cardRef.current) {
        cardRef.current.style.setProperty("--x", x.toFixed(2));
        cardRef.current.style.setProperty(
          "--xp",
          (x / window.innerWidth).toFixed(2),
        );
        cardRef.current.style.setProperty("--y", y.toFixed(2));
        cardRef.current.style.setProperty(
          "--yp",
          (y / window.innerHeight).toFixed(2),
        );
      }
    };
    document.addEventListener("pointermove", syncPointer);
    return () => document.removeEventListener("pointermove", syncPointer);
  }, []);

  // Compute inline styles
  const resolvedWidth = width
    ? typeof width === "number"
      ? `${width}px`
      : width
    : !customSize
      ? sizeMap[size].width
      : undefined;
  const resolvedHeight = height
    ? typeof height === "number"
      ? `${height}px`
      : height
    : !customSize
      ? sizeMap[size].height
      : undefined;

  const inlineStyle = {
    // ── CSS custom properties ──────────────────────────────────────────
    "--base": GOLD_BASE,
    "--spread": GOLD_SPREAD,
    "--radius": "14",
    "--border": "2",
    // subtle frosted-glass backdrop — very low opacity
    "--backdrop": "rgba(255, 255, 255, 0.04)",
    "--backup-border": "rgba(253, 184, 19, 0.18)",
    "--size": "220",
    "--outer": "1",
    "--border-size": "calc(var(--border, 2) * 1px)",
    "--spotlight-size": "calc(var(--size, 220) * 1px)",
    "--hue": `calc(var(--base) + (var(--xp, 0) * var(--spread, 0)))`,
    // ── Background spotlight ────────────────────────────────────────────
    backgroundImage: `radial-gradient(
      var(--spotlight-size) var(--spotlight-size) at
      calc(var(--x, 0) * 1px)
      calc(var(--y, 0) * 1px),
      hsl(var(--hue, 43) calc(var(--saturation, 100) * 1%) calc(var(--lightness, 70) * 1%) / var(--bg-spot-opacity, 0.08)), transparent
    )`,
    backgroundColor: "var(--backdrop, transparent)",
    backgroundSize:
      "calc(100% + (2 * var(--border-size))) calc(100% + (2 * var(--border-size)))",
    backgroundPosition: "50% 50%",
    backgroundAttachment: "fixed",
    border: "var(--border-size) solid var(--backup-border)",
    // ── Layout ──────────────────────────────────────────────────────────
    position: "relative",
    touchAction: "none",
    borderRadius: "14px",
    backdropFilter: "blur(6px)",
    WebkitBackdropFilter: "blur(6px)",
    boxShadow: "0 1rem 2rem -1rem rgba(0,0,0,0.6)",
    display: "grid",
    gridTemplateRows: "1fr auto",
    padding: "24px",
    gap: "16px",
    ...(resolvedWidth ? { width: resolvedWidth } : {}),
    ...(resolvedHeight ? { height: resolvedHeight } : {}),
    ...style,
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: BEFORE_AFTER_CSS }} />
      <div ref={cardRef} data-glow style={inlineStyle} className={className}>
        {/* Ambient outer glow layer */}
        <div data-glow />
        {children}
      </div>
    </>
  );
}
