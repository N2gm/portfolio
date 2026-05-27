// LiquidMetalButton — CSS-only liquid metal effect
// Dark pill with rotating chromatic aberration border (gold accents)
// Matches reference: thin silver/gold edge with subtle color spill at corners

import { useState, useRef, useCallback } from "react";

export default function LiquidMetalButton({
  label = "Hire Me",
  onClick,
  width = 142,
  height = 46,
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [ripples, setRipples] = useState([]);
  const buttonRef = useRef(null);
  const rippleId = useRef(0);

  const handleClick = useCallback(
    (e) => {
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const id = rippleId.current++;
        setRipples((prev) => [...prev, { x, y, id }]);
        setTimeout(() => {
          setRipples((prev) => prev.filter((r) => r.id !== id));
        }, 600);
      }
      if (onClick) onClick(e);
    },
    [onClick],
  );

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <style>{`
        @keyframes lmbRotate {
          0%   { transform: translate(-50%, -50%) rotate(0deg); }
          100% { transform: translate(-50%, -50%) rotate(360deg); }
        }
        @keyframes lmbRipple {
          0%   { transform: translate(-50%, -50%) scale(0); opacity: 0.6; }
          100% { transform: translate(-50%, -50%) scale(4); opacity: 0; }
        }
        @keyframes lmbGlowPulse {
          0%, 100% { opacity: 0.30; }
          50%      { opacity: 0.55; }
        }
      `}</style>

      {/* Ambient gold glow behind the button */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: width + 50,
          height: height + 35,
          transform: "translate(-50%, -50%)",
          borderRadius: 100,
          background:
            "radial-gradient(ellipse, rgba(253,184,19,0.22) 0%, transparent 70%)",
          filter: "blur(16px)",
          pointerEvents: "none",
          zIndex: 0,
          animation: isHovered
            ? "lmbGlowPulse 2.5s ease-in-out infinite"
            : "none",
          opacity: isHovered ? 0.7 : 0.25,
          transition: "opacity 0.4s ease",
        }}
      />

      <div
        style={{
          position: "relative",
          width: width,
          height: height,
          zIndex: 1,
          transform: isPressed
            ? "translateY(1px) scale(0.98)"
            : "translateY(0) scale(1)",
          transition: "transform 0.15s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        {/* ── BORDER FRAME — rotating conic gradient creates chromatic aberration ── */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 100,
            overflow: "hidden",
            boxShadow: isHovered
              ? "0 0 24px rgba(253,184,19,0.30), 0 0 48px rgba(253,184,19,0.12), 0 8px 18px rgba(0,0,0,0.45)"
              : "0 0 12px rgba(253,184,19,0.10), 0 6px 14px rgba(0,0,0,0.35)",
            transition: "box-shadow 0.3s ease",
          }}
        >
          {/* Rotating conic gradient — produces moving color spills around edge */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: width * 2.4,
              height: width * 2.4,
              background: `conic-gradient(
                from 0deg,
                #FDB813 0deg,
                rgba(190, 190, 200, 0.9) 25deg,
                rgba(210, 210, 220, 0.95) 55deg,
                #FFD96B 80deg,
                #C8960F 105deg,
                rgba(190, 190, 200, 0.9) 140deg,
                rgba(210, 210, 220, 0.95) 180deg,
                #FDB813 210deg,
                #8C6408 235deg,
                rgba(190, 190, 200, 0.9) 270deg,
                rgba(210, 210, 220, 0.95) 310deg,
                #FDB813 340deg,
                #FDB813 360deg
              )`,
              animation: isHovered
                ? "lmbRotate 2.5s linear infinite"
                : "lmbRotate 7s linear infinite",
              pointerEvents: "none",
              filter: "blur(0.5px)",
            }}
          />
        </div>

        {/* ── INNER DARK PILL — covers everything except 1.5px edge ── */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 1.5,
            left: 1.5,
            right: 1.5,
            bottom: 1.5,
            borderRadius: 100,
            background:
              "linear-gradient(180deg, #1f1f23 0%, #0a0a0c 55%, #050507 100%)",
            boxShadow: isPressed
              ? "inset 0 2px 6px rgba(0,0,0,0.6), inset 0 1px 3px rgba(0,0,0,0.5)"
              : "inset 0 1px 2px rgba(0,0,0,0.45), inset 0 -1px 2px rgba(255,255,255,0.03)",
            transition: "box-shadow 0.15s ease",
            zIndex: 2,
          }}
        />

        {/* Subtle top gloss on dark pill */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 3,
            left: "10%",
            right: "10%",
            height: "40%",
            borderRadius: "100px 100px 50% 50%",
            background:
              "linear-gradient(to bottom, rgba(255,255,255,0.07) 0%, transparent 100%)",
            pointerEvents: "none",
            zIndex: 3,
          }}
        />

        {/* ── Text label ── */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 4,
            pointerEvents: "none",
          }}
        >
          <span
            style={{
              fontSize: 13,
              color: isHovered ? "#FDB813" : "rgba(253, 184, 19, 0.78)",
              fontWeight: 600,
              fontFamily: "'Montserrat', sans-serif",
              letterSpacing: "0.06em",
              textShadow: isHovered
                ? "0 0 14px rgba(253,184,19,0.7), 0 1px 3px rgba(0,0,0,0.7)"
                : "0 1px 3px rgba(0,0,0,0.7)",
              transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
              transform: isPressed ? "scale(0.96)" : "scale(1)",
              whiteSpace: "nowrap",
            }}
          >
            {label}
          </span>
        </div>

        {/* ── Click target ── */}
        <button
          ref={buttonRef}
          type="button"
          onClick={handleClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => {
            setIsHovered(false);
            setIsPressed(false);
          }}
          onMouseDown={() => setIsPressed(true)}
          onMouseUp={() => setIsPressed(false)}
          aria-label={label}
          style={{
            position: "absolute",
            inset: 0,
            background: "transparent",
            border: "none",
            cursor: "pointer",
            outline: "none",
            zIndex: 5,
            overflow: "hidden",
            borderRadius: 100,
            padding: 0,
            color: "transparent",
            minHeight: 44,
            minWidth: 44,
            touchAction: "manipulation",
          }}
          onFocus={(e) => {
            e.currentTarget.style.outline = "2px solid #FDB813";
            e.currentTarget.style.outlineOffset = "4px";
          }}
          onBlur={(e) => {
            e.currentTarget.style.outline = "none";
          }}
        >
          {ripples.map((ripple) => (
            <span
              key={ripple.id}
              style={{
                position: "absolute",
                left: ripple.x,
                top: ripple.y,
                width: 20,
                height: 20,
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, rgba(253,184,19,0.5) 0%, rgba(253,184,19,0) 70%)",
                pointerEvents: "none",
                animation: "lmbRipple 0.6s ease-out forwards",
              }}
            />
          ))}
        </button>
      </div>
    </div>
  );
}
