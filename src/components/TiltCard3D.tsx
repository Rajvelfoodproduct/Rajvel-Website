"use client";

import React, { useRef, useState, useSyncExternalStore } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface TiltCard3DProps {
  children: React.ReactNode;
  className?: string;
}

const HOVER_QUERY = "(hover: hover) and (pointer: fine)";

function subscribeHover(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const mq = window.matchMedia(HOVER_QUERY);
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function getHoverSnapshot() {
  if (typeof window === "undefined") return false;
  return window.matchMedia(HOVER_QUERY).matches;
}

function getHoverServerSnapshot() {
  return false;
}

export function TiltCard3D({ children, className = "" }: TiltCard3DProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const canHover = useSyncExternalStore(
    subscribeHover,
    getHoverSnapshot,
    getHoverServerSnapshot
  );
  const [tilt, setTilt] = useState({
    rotateX: 0,
    rotateY: 0,
    glareX: 50,
    glareY: 50,
    active: false,
  });

  if (prefersReducedMotion || !canHover) {
    return <div className={`relative h-full ${className}`}>{children}</div>;
  }

  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setTilt({
      rotateX: (0.5 - y) * 7,
      rotateY: (x - 0.5) * 7,
      glareX: x * 100,
      glareY: y * 100,
      active: true,
    });
  };

  const handleLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50, active: false });
  };

  return (
    <div style={{ perspective: "1100px" }} className="h-full">
      <motion.div
        ref={ref}
        onPointerMove={handleMove}
        onPointerLeave={handleLeave}
        animate={{
          rotateX: tilt.rotateX,
          rotateY: tilt.rotateY,
          y: tilt.active ? -5 : 0,
        }}
        transition={{ type: "spring", stiffness: 260, damping: 24 }}
        style={{ transformStyle: "preserve-3d" }}
        className={`relative h-full ${className}`}
      >
        {children}

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-3xl transition-opacity duration-300"
          style={{
            opacity: tilt.active ? 0.16 : 0,
            background: `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(255,255,255,0.85), transparent 55%)`,
          }}
        />
      </motion.div>
    </div>
  );
}
