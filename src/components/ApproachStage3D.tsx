"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Filter,
  Layers,
  PackageCheck,
  ShieldCheck,
} from "lucide-react";
import { PROCESS_STEPS } from "@/data/siteData";
import { Reveal } from "./MotionPrimitives";

const STAGE_ICONS = [CheckCircle2, Filter, Layers, PackageCheck];

const STAGE_TAGS = [
  "Grain Grading & Moisture Check",
  "Destoning & Air-Cleaning",
  "Precision Temperature Milling",
  "Sealed Batch Dispatch",
];

function compileShader(
  gl: WebGL2RenderingContext,
  type: number,
  source: string
): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createProgram(
  gl: WebGL2RenderingContext,
  vsSource: string,
  fsSource: string
): WebGLProgram | null {
  const vs = compileShader(gl, gl.VERTEX_SHADER, vsSource);
  const fs = compileShader(gl, gl.FRAGMENT_SHADER, fsSource);
  if (!vs || !fs) return null;
  const program = gl.createProgram();
  if (!program) return null;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program);
    return null;
  }
  gl.deleteShader(vs);
  gl.deleteShader(fs);
  return program;
}

const POINT_VS = `#version 300 es
precision highp float;

in vec3 aPos0;
in vec3 aPos1;
in vec3 aPos2;
in vec3 aPos3;
in vec3 aColor0;
in vec3 aColor1;
in vec3 aColor2;
in vec3 aColor3;
in float aSize;
in float aSeed;

uniform float uStage;
uniform float uTime;
uniform vec2 uRot;
uniform vec2 uResolution;

out vec3 vColor;
out float vDepth;
out float vHighlight;

mat2 rot2(float a) {
  float c = cos(a);
  float s = sin(a);
  return mat2(c, -s, s, c);
}

void main() {
  vec3 pos = aPos0;
  vec3 col = aColor0;

  if (uStage <= 1.0) {
    float k = smoothstep(0.0, 1.0, uStage);
    pos = mix(aPos0, aPos1, k);
    col = mix(aColor0, aColor1, k);
  } else if (uStage <= 2.0) {
    float k = smoothstep(1.0, 2.0, uStage);
    pos = mix(aPos1, aPos2, k);
    col = mix(aColor1, aColor2, k);
  } else {
    float k = smoothstep(2.0, 3.0, uStage);
    pos = mix(aPos2, aPos3, k);
    col = mix(aColor2, aColor3, k);
  }

  float wave = sin(uTime * 1.4 + aSeed * 6.2831);
  pos.y += wave * 0.035;
  pos.xz = rot2(uTime * 0.28 + uRot.x * 1.35) * pos.xz;
  pos.yz = rot2(0.26 + uRot.y * 0.75) * pos.yz;

  float camDist = 3.35;
  float zDepth = camDist - pos.z;
  float perspective = 2.45 / max(0.8, zDepth);
  float aspect = uResolution.y / max(1.0, uResolution.x);

  gl_Position = vec4(pos.x * perspective * aspect, pos.y * perspective, clamp(pos.z * 0.25, -0.95, 0.95), 1.0);
  gl_PointSize = clamp(aSize * perspective * (uResolution.y * 0.0115), 3.0, 26.0);

  vColor = col;
  vDepth = clamp((pos.z + 1.2) * 0.45, 0.25, 1.0);
  vHighlight = 0.5 + 0.5 * wave;
}
`;

const POINT_FS = `#version 300 es
precision highp float;

in vec3 vColor;
in float vDepth;
in float vHighlight;

out vec4 outColor;

void main() {
  vec2 uv = gl_PointCoord * 2.0 - 1.0;
  float r2 = dot(uv, uv);
  if (r2 > 1.0) discard;

  float nz = sqrt(max(0.0, 1.0 - r2));
  vec3 normal = normalize(vec3(uv.x, -uv.y, nz));
  vec3 lightDir = normalize(vec3(-0.45, 0.72, 0.85));
  float diff = max(dot(normal, lightDir), 0.0);
  vec3 halfVec = normalize(lightDir + vec3(0.0, 0.0, 1.0));
  float spec = pow(max(dot(normal, halfVec), 0.0), 22.0);

  vec3 shaded = vColor * (0.58 + 0.52 * diff) + vec3(1.0, 0.98, 0.88) * spec * (0.28 + 0.14 * vHighlight);
  shaded *= mix(0.76, 1.08, vDepth);

  float alpha = smoothstep(1.0, 0.72, r2) * 0.96;
  outColor = vec4(shaded, alpha);
}
`;

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function ApproachCore3D({
  activeStep,
  pointer,
}: {
  activeStep: number;
  pointer: { x: number; y: number };
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [webglSupported, setWebglSupported] = useState(true);
  const stateRef = useRef({
    targetStage: activeStep,
    currentStage: activeStep,
    targetRot: { x: 0, y: 0 },
    currentRot: { x: 0, y: 0 },
  });

  useEffect(() => {
    stateRef.current.targetStage = activeStep;
  }, [activeStep]);

  useEffect(() => {
    stateRef.current.targetRot = { x: pointer.x, y: pointer.y };
  }, [pointer.x, pointer.y]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const isMobile =
      window.innerWidth < 768 ||
      (typeof navigator !== "undefined" &&
        navigator.hardwareConcurrency > 0 &&
        navigator.hardwareConcurrency <= 4);

    const gl = canvas.getContext("webgl2", {
      alpha: true,
      antialias: !isMobile,
      powerPreference: "high-performance",
    });
    if (!gl) {
      setWebglSupported(false);
      return;
    }

    const program = createProgram(gl, POINT_VS, POINT_FS);
    if (!program) {
      setWebglSupported(false);
      return;
    }

    const COUNT = isMobile ? 780 : 1650;
    const rand = mulberry32(90210);

    const pos0 = new Float32Array(COUNT * 3);
    const pos1 = new Float32Array(COUNT * 3);
    const pos2 = new Float32Array(COUNT * 3);
    const pos3 = new Float32Array(COUNT * 3);

    const col0 = new Float32Array(COUNT * 3);
    const col1 = new Float32Array(COUNT * 3);
    const col2 = new Float32Array(COUNT * 3);
    const col3 = new Float32Array(COUNT * 3);

    const sizes = new Float32Array(COUNT);
    const seeds = new Float32Array(COUNT);

    for (let i = 0; i < COUNT; i++) {
      const u = i / COUNT;
      const phi = Math.acos(1 - 2 * ((i + 0.5) / COUNT));
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;

      if (i < COUNT * 0.72) {
        const r = 0.25 + Math.pow(rand(), 0.45) * 0.62;
        pos0[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        pos0[i * 3 + 1] = r * Math.cos(phi) * 0.88;
        pos0[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);

        const tone = rand();
        col0[i * 3] = 0.82 + tone * 0.16;
        col0[i * 3 + 1] = 0.62 + tone * 0.22;
        col0[i * 3 + 2] = 0.22 + tone * 0.18;
      } else {
        const ringA = ((i - COUNT * 0.72) / (COUNT * 0.28)) * Math.PI * 2;
        const ringTilt = (i % 2 === 0 ? 1 : -1) * 0.48;
        const rr = 1.04 + (rand() - 0.5) * 0.05;
        const rx = Math.cos(ringA) * rr;
        const rz = Math.sin(ringA) * rr;
        pos0[i * 3] = rx;
        pos0[i * 3 + 1] = rz * Math.sin(ringTilt);
        pos0[i * 3 + 2] = rz * Math.cos(ringTilt);

        col0[i * 3] = 0.74;
        col0[i * 3 + 1] = 0.88;
        col0[i * 3 + 2] = 0.46;
      }

      const h = (u - 0.5) * 1.95;
      const coneR = 0.28 + Math.abs(h + 0.25) * 0.48 + (rand() - 0.5) * 0.12;
      const helixA = u * Math.PI * 22 + (i % 3) * 2.094;
      pos1[i * 3] = Math.cos(helixA) * coneR;
      pos1[i * 3 + 1] = h;
      pos1[i * 3 + 2] = Math.sin(helixA) * coneR;

      const bright = 0.5 + 0.5 * Math.sin(helixA);
      col1[i * 3] = 0.48 + bright * 0.42;
      col1[i * 3 + 1] = 0.78 + bright * 0.15;
      col1[i * 3 + 2] = 0.52 + bright * 0.28;

      if (i < COUNT * 0.65) {
        const t1 = rand() * Math.PI * 2;
        const t2 = rand() * Math.PI * 2;
        const majorR = 0.76;
        const minorR = 0.22 + (rand() - 0.5) * 0.08;
        const layerY = i % 2 === 0 ? 0.2 : -0.2;
        pos2[i * 3] = (majorR + minorR * Math.cos(t2)) * Math.cos(t1);
        pos2[i * 3 + 1] = layerY + minorR * Math.sin(t2) * 0.75;
        pos2[i * 3 + 2] = (majorR + minorR * Math.cos(t2)) * Math.sin(t1);

        col2[i * 3] = 0.96;
        col2[i * 3 + 1] = 0.86 - rand() * 0.12;
        col2[i * 3 + 2] = 0.52 + rand() * 0.18;
      } else {
        const cr = Math.pow(rand(), 0.5) * 0.45;
        pos2[i * 3] = cr * Math.sin(phi) * Math.cos(theta);
        pos2[i * 3 + 1] = cr * Math.cos(phi) * 0.65;
        pos2[i * 3 + 2] = cr * Math.sin(phi) * Math.sin(theta);

        col2[i * 3] = 0.98;
        col2[i * 3 + 1] = 0.95;
        col2[i * 3 + 2] = 0.82;
      }

      if (i < COUNT * 0.82) {
        const face = i % 6;
        const sx = (rand() - 0.5) * 2.0;
        const sy = (rand() - 0.5) * 2.0;
        let bx = sx * 0.56;
        let by = sy * 0.78;
        let bz = 0;

        if (face === 0) bz = 0.28;
        else if (face === 1) bz = -0.28;
        else if (face === 2) {
          bx = 0.56;
          bz = sx * 0.28;
        } else if (face === 3) {
          bx = -0.56;
          bz = sx * 0.28;
        } else if (face === 4) {
          by = 0.78;
          bz = sy * 0.28;
        } else {
          by = -0.78;
          bz = sy * 0.28;
        }

        const taper = 1.0 - Math.abs(by) * 0.08;
        pos3[i * 3] = bx * taper;
        pos3[i * 3 + 1] = by;
        pos3[i * 3 + 2] = bz + Math.cos(bx * 2.1) * 0.04;

        const isSealBand = Math.abs(by) < 0.22;
        if (isSealBand) {
          col3[i * 3] = 0.83;
          col3[i * 3 + 1] = 0.92;
          col3[i * 3 + 2] = 0.53;
        } else {
          col3[i * 3] = 0.14 + rand() * 0.12;
          col3[i * 3 + 1] = 0.44 + rand() * 0.18;
          col3[i * 3 + 2] = 0.25 + rand() * 0.1;
        }
      } else {
        const ha = ((i - COUNT * 0.82) / (COUNT * 0.18)) * Math.PI * 2;
        pos3[i * 3] = Math.cos(ha) * 1.02;
        pos3[i * 3 + 1] = Math.sin(ha * 2) * 0.12 - 0.52;
        pos3[i * 3 + 2] = Math.sin(ha) * 1.02;

        col3[i * 3] = 0.93;
        col3[i * 3 + 1] = 0.77;
        col3[i * 3 + 2] = 0.34;
      }

      sizes[i] = (isMobile ? 1.45 : 1.15) + rand() * 1.15;
      seeds[i] = rand();
    }

    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    const buffers: WebGLBuffer[] = [];

    const bindAttr = (name: string, data: Float32Array, size: number) => {
      const loc = gl.getAttribLocation(program, name);
      if (loc === -1) return;
      const buf = gl.createBuffer();
      if (buf) buffers.push(buf);
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0);
    };

    bindAttr("aPos0", pos0, 3);
    bindAttr("aPos1", pos1, 3);
    bindAttr("aPos2", pos2, 3);
    bindAttr("aPos3", pos3, 3);
    bindAttr("aColor0", col0, 3);
    bindAttr("aColor1", col1, 3);
    bindAttr("aColor2", col2, 3);
    bindAttr("aColor3", col3, 3);
    bindAttr("aSize", sizes, 1);
    bindAttr("aSeed", seeds, 1);

    const uStage = gl.getUniformLocation(program, "uStage");
    const uTime = gl.getUniformLocation(program, "uTime");
    const uRot = gl.getUniformLocation(program, "uRot");
    const uRes = gl.getUniformLocation(program, "uResolution");

    let rafId = 0;
    const start = performance.now();
    let isVisible = true;
    let isDocVisible = !document.hidden;

    const reducedMotionMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    let prefersReducedMotion = reducedMotionMq.matches;
    const onReducedMotionChange = (e: MediaQueryListEvent) => {
      prefersReducedMotion = e.matches;
    };
    reducedMotionMq.addEventListener("change", onReducedMotionChange);

    const onVisibilityChange = () => {
      isDocVisible = !document.hidden;
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    const observer = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0]?.isIntersecting ?? true;
      },
      { threshold: 0.02 }
    );
    observer.observe(canvas);

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (w > 0 && h > 0) {
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
        gl.viewport(0, 0, canvas.width, canvas.height);
      }
    };
    resize();
    window.addEventListener("resize", resize);

    const render = () => {
      rafId = requestAnimationFrame(render);
      if (!isVisible || !isDocVisible) return;

      const st = stateRef.current;
      st.currentStage +=
        (st.targetStage - st.currentStage) * (prefersReducedMotion ? 0.35 : 0.08);
      st.currentRot.x += (st.targetRot.x - st.currentRot.x) * 0.08;
      st.currentRot.y += (st.targetRot.y - st.currentRot.y) * 0.08;

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.enable(gl.DEPTH_TEST);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

      gl.useProgram(program);
      gl.bindVertexArray(vao);
      gl.uniform1f(uStage, st.currentStage);
      gl.uniform1f(
        uTime,
        prefersReducedMotion ? 0 : (performance.now() - start) * 0.001
      );
      gl.uniform2f(uRot, st.currentRot.x, st.currentRot.y);
      gl.uniform2f(uRes, canvas.width || 1, canvas.height || 1);

      gl.drawArrays(gl.POINTS, 0, COUNT);
    };

    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      reducedMotionMq.removeEventListener("change", onReducedMotionChange);
      window.removeEventListener("resize", resize);
      buffers.forEach((b) => gl.deleteBuffer(b));
      if (vao) gl.deleteVertexArray(vao);
      gl.deleteProgram(program);
    };
  }, []);

  if (!webglSupported) {
    const FallbackIcon = STAGE_ICONS[activeStep] || CheckCircle2;
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center gap-3">
        <div className="w-16 h-16 rounded-2xl bg-[#D5EA88] text-[#103822] flex items-center justify-center shadow-lg">
          <FallbackIcon className="w-8 h-8" />
        </div>
        <p className="text-xs font-bold tracking-[0.16em] uppercase text-[#D5EA88]">
          Stage {PROCESS_STEPS[activeStep]?.number} — {PROCESS_STEPS[activeStep]?.title}
        </p>
      </div>
    );
  }

  return (
    <canvas
      ref={canvasRef}
      aria-label="Interactive 3D Raj Vel Processing Stage Model"
      className="w-full h-full block"
    />
  );
}

export function ApproachStage3D() {
  const [activeStep, setActiveStep] = useState(0);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const prefersReducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 80%", "center 45%"],
  });
  const lineScaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  const handlePointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (prefersReducedMotion || window.innerWidth < 768) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setPointer({ x: nx, y: ny });
  };

  const currentStep = PROCESS_STEPS[activeStep];

  return (
    <section
      ref={sectionRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={() => setPointer({ x: 0, y: 0 })}
      className="py-16 sm:py-24 relative overflow-hidden"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-10 left-1/2 -translate-x-1/2 w-[760px] h-[420px] rounded-full bg-radial from-[#D5EA88]/30 via-[#124328]/5 to-transparent blur-3xl"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#286B43]">
                OUR APPROACH
              </p>
              <h2 className="font-serif-display text-3xl sm:text-5xl text-[#10291B] mt-2">
                Care in every step
              </h2>
              <p className="text-sm sm:text-base text-[#4A5E52] mt-2.5 max-w-xl leading-relaxed">
                From selected grains to a carefully packed product, every stage
                matters.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 self-start md:self-auto bg-white/90 backdrop-blur-sm border border-[#103822]/15 rounded-full p-1.5 shadow-sm">
              <button
                type="button"
                onClick={() =>
                  setActiveStep(
                    (prev) =>
                      (prev - 1 + PROCESS_STEPS.length) % PROCESS_STEPS.length
                  )
                }
                aria-label="Previous process stage"
                className="w-9 h-9 rounded-full flex items-center justify-center text-[#103822] hover:bg-[#103822] hover:text-white transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-2.5 text-[11px] font-extrabold tracking-[0.16em] uppercase text-[#103822] tabular-nums">
                STAGE {currentStep.number} / 04
              </span>
              <button
                type="button"
                onClick={() =>
                  setActiveStep((prev) => (prev + 1) % PROCESS_STEPS.length)
                }
                aria-label="Next process stage"
                className="w-9 h-9 rounded-full flex items-center justify-center text-[#103822] hover:bg-[#103822] hover:text-white transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </Reveal>

        {/* Process Stage Cards */}
        <div className="relative mt-10 sm:mt-12" style={{ perspective: "1500px" }}>
          <div className="hidden lg:block absolute top-11 left-[11%] right-[11%] h-[3px] rounded-full bg-[#103822]/10 overflow-hidden z-0">
            <motion.div
              style={{ scaleX: lineScaleX }}
              className="h-full bg-gradient-to-r from-[#9ED34E] via-[#276942] to-[#103822] origin-left"
            />
          </div>

          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 relative z-10"
            style={{ transformStyle: "preserve-3d" }}
          >
            {PROCESS_STEPS.map((step, idx) => {
              const isSelected = activeStep === idx;
              const StepIcon = STAGE_ICONS[idx];
              return (
                <button
                  key={step.number}
                  type="button"
                  onClick={() => setActiveStep(idx)}
                  onMouseEnter={() => {
                    if (window.innerWidth >= 768) setActiveStep(idx);
                  }}
                  aria-pressed={isSelected}
                  className={`group relative text-left rounded-2xl sm:rounded-3xl p-5 sm:p-7 transition-all duration-300 cursor-pointer border ${
                    isSelected
                      ? "bg-[#103822] text-white border-[#D5EA88]/40 shadow-[0_24px_48px_-16px_rgba(16,56,34,0.42)] sm:-translate-y-1.5"
                      : "bg-[#FFFDF7] text-[#10291B] border-[#103822]/12 shadow-sm hover:border-[#103822]/30 hover:bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div
                      className={`w-11 h-11 rounded-2xl font-bold text-xs tracking-wider flex items-center justify-center shadow-sm transition-colors ${
                        isSelected
                          ? "bg-[#D5EA88] text-[#103822]"
                          : `${step.accentBg} text-[#103822]`
                      }`}
                    >
                      {step.number}
                    </div>
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center border transition-colors ${
                        isSelected
                          ? "border-white/25 bg-white/10 text-[#D5EA88]"
                          : "border-[#103822]/10 bg-[#FAF5E8] text-[#286B43]"
                      }`}
                    >
                      <StepIcon className="w-4 h-4" />
                    </div>
                  </div>

                  <div className="mt-5">
                    <p
                      className={`text-[11px] font-bold tracking-[0.14em] uppercase ${
                        isSelected ? "text-[#D5EA88]" : "text-[#286B43]"
                      }`}
                    >
                      {STAGE_TAGS[idx]}
                    </p>
                    <h3
                      className={`font-sans text-sm font-extrabold tracking-[0.15em] uppercase mt-1.5 ${
                        isSelected ? "text-white" : "text-[#103822]"
                      }`}
                    >
                      {step.title}
                    </h3>
                    <p
                      className={`text-sm mt-2 leading-relaxed ${
                        isSelected ? "text-white/85" : "text-[#4A5E52]"
                      }`}
                    >
                      {step.shortDesc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3D Interactive Stage Hologram + Detailed Panel */}
        <div className="mt-7 sm:mt-8 rounded-3xl bg-gradient-to-br from-[#103822] via-[#175132] to-[#0D321D] text-white border border-white/15 shadow-[0_28px_60px_-22px_rgba(12,42,24,0.48)] overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
            <div className="lg:col-span-5 relative h-[220px] sm:h-[280px] bg-radial from-[#D5EA88]/18 via-transparent to-transparent border-b lg:border-b-0 lg:border-r border-white/10">
              <ApproachCore3D activeStep={activeStep} pointer={pointer} />
            </div>

            <div className="lg:col-span-7 p-6 sm:p-9 lg:p-10 flex flex-col justify-between gap-6">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.18em] uppercase text-[#D5EA88]">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  STAGE {currentStep.number} — {currentStep.title}
                </div>
                <h3 className="font-serif-display text-2xl sm:text-3xl text-white">
                  {STAGE_TAGS[activeStep]}
                </h3>
                <p className="text-sm sm:text-base text-[#DCE9DF] leading-relaxed max-w-2xl">
                  {currentStep.detail}
                </p>
              </div>

              <div className="pt-4 border-t border-white/12 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  {PROCESS_STEPS.map((st, idx) => (
                    <button
                      key={st.number}
                      type="button"
                      onClick={() => setActiveStep(idx)}
                      aria-label={`Select Stage ${st.number} ${st.title}`}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-bold tracking-[0.14em] uppercase transition-all cursor-pointer ${
                        activeStep === idx
                          ? "bg-[#D5EA88] text-[#103822]"
                          : "bg-white/10 text-white/80 hover:bg-white/20"
                      }`}
                    >
                      {st.number}
                    </button>
                  ))}
                </div>

                <Link
                  href="/facilities"
                  className="inline-flex items-center gap-2 rounded-full bg-[#FFFDF7] hover:bg-[#D5EA88] text-[#103822] text-xs font-bold tracking-[0.15em] uppercase px-6 py-3 shadow-sm transition-colors"
                >
                  SEE FACILITY
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
