"use client";

import React, { useEffect, useRef, useState } from "react";

interface GrainSculpture3DProps {
  scrollProgress: number;
  className?: string;
}

const STRAND_COUNT = 148;
const SEGMENTS_PER_STRAND = 26;
const CLOUD_COLS = 144;
const CLOUD_ROWS = 104;

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

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
    console.error("Shader compile error:", gl.getShaderInfoLog(shader));
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
    console.error("Program link error:", gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }
  gl.deleteShader(vs);
  gl.deleteShader(fs);
  return program;
}

/* ============================================================================
   1. SCULPTURAL 3D WIRE CIRCLE (Stage 1 ONLY)
   - Stage 1 (0.00-0.22): Crisp wired circle positioned cleanly on the right
   - Stage 1->2 (0.20-0.38): Breaks apart & dissolves directly into Grains
   - Once transformed (>= 0.38): Wire visibility is 0.0 FOREVER — never returns!
============================================================================ */
const STRAND_VS = `#version 300 es
precision highp float;

in vec3 aPosHero;
in vec3 aPosNextHero;
in float aT;
in float aSide;
in float aSeed;

uniform mat4 uViewProj;
uniform vec2 uMouse;
uniform float uScroll;
uniform float uTime;
uniform float uAspect;

out float vT;
out float vSide;
out float vSeed;
out float vDepth;
out float vVisibility;

vec3 evalPosition(vec3 pH, float tVal, float seed, float scroll, float time) {
  vec3 pos = pH;

  // Subtle organic breathing
  pos.y += sin(time * 1.1 + seed * 11.0 + tVal * 3.2) * 0.035 * (0.25 + tVal);

  // As Stage 1 transforms into Stage 2 Grains (0.16 -> 0.38), strands burst outward and dissolve away
  float dissolveProgress = smoothstep(0.16, 0.38, scroll);
  vec3 center = vec3(1.02, 0.02, 0.0);
  vec3 outward = normalize((pH - center) + vec3(0.001));
  pos += outward * (dissolveProgress * dissolveProgress * 1.45 * (0.4 + tVal));

  // Mouse parallax tilt
  float rotY = uMouse.x * 0.25 + sin(time * 0.22) * 0.05;
  float rotX = -uMouse.y * 0.16;

  float cy = cos(rotY), sy = sin(rotY);
  float cx = cos(rotX), sx = sin(rotX);

  vec3 rel = pos - center;
  vec3 r1 = vec3(rel.x * cy + rel.z * sy, rel.y, -rel.x * sy + rel.z * cy);
  vec3 r2 = vec3(r1.x, r1.y * cx - r1.z * sx, r1.y * sx + r1.z * cx);
  return r2 + center;
}

void main() {
  // Completely cull wire once transformation into grains is complete
  float visibility = 1.0 - smoothstep(0.18, 0.36, uScroll);

  vec3 pos = evalPosition(aPosHero, aT, aSeed, uScroll, uTime);
  vec3 posNext = evalPosition(aPosNextHero, min(1.0, aT + 0.038), aSeed, uScroll, uTime);

  vec4 clipPos = uViewProj * vec4(pos, 1.0);
  vec4 clipNext = uViewProj * vec4(posNext, 1.0);

  vec2 ndc = clipPos.xy / max(0.001, clipPos.w);
  vec2 ndcNext = clipNext.xy / max(0.001, clipNext.w);

  vec2 dir = ndcNext - ndc;
  dir.x *= uAspect;
  float len = length(dir);
  vec2 tangent = len > 0.00001 ? dir / len : vec2(0.0, 1.0);
  vec2 normal2D = vec2(-tangent.y, tangent.x);
  normal2D.x /= uAspect;

  float baseRadius = 0.021;
  float taper = mix(0.85, 1.12, sin(aT * 2.6)) * (1.0 - smoothstep(0.92, 1.0, aT) * 0.35);
  float screenWidth = (baseRadius * taper * visibility) / max(1.1, clipPos.w * 0.42);

  clipPos.xy += normal2D * (aSide * screenWidth * clipPos.w);

  gl_Position = clipPos;
  vT = aT;
  vSide = aSide;
  vSeed = aSeed;
  vDepth = clipPos.z / clipPos.w;
  vVisibility = visibility;
}
`;

const STRAND_FS = `#version 300 es
precision highp float;

in float vT;
in float vSide;
in float vSeed;
in float vDepth;
in float vVisibility;

out vec4 fragColor;

void main() {
  if (vVisibility < 0.01) discard;

  float s = clamp(vSide, -1.0, 1.0);
  float nz = sqrt(max(0.001, 1.0 - s * s));
  vec3 normal = normalize(vec3(s * 0.92, 0.22 + (vT - 0.5) * 0.25, nz));

  vec3 lightDir = normalize(vec3(0.45, 0.72, 0.65));
  vec3 fillDir = normalize(vec3(-0.6, -0.3, 0.45));
  float diff = max(0.0, dot(normal, lightDir));
  float fill = max(0.0, dot(normal, fillDir));
  float fresnel = pow(1.0 - nz, 2.2);

  vec3 baseStone = mix(vec3(0.76, 0.72, 0.65), vec3(0.95, 0.92, 0.86), fract(vSeed * 7.31));
  vec3 sageTint = vec3(0.60, 0.72, 0.56);
  vec3 stalkColor = mix(baseStone, sageTint, 0.18 * fract(vSeed * 13.7));

  float ao = mix(0.45, 1.0, smoothstep(0.10, 0.85, vT));
  vec3 shaded = stalkColor * (0.42 + 0.65 * diff + 0.16 * fill) * ao;
  shaded += vec3(1.0, 0.98, 0.92) * fresnel * 0.22;

  float tipGlow = smoothstep(0.84, 0.99, vT);
  vec3 emberOuter = vec3(0.92, 0.45, 0.10);
  vec3 emberCore = vec3(1.0, 0.86, 0.42);
  vec3 tipColor = mix(emberOuter, emberCore, smoothstep(0.91, 1.0, vT) * (0.65 + 0.35 * nz));

  vec3 finalColor = mix(shaded, tipColor * 1.15, tipGlow);

  float depthFade = smoothstep(1.0, -0.3, vDepth);
  float edgeAA = smoothstep(1.0, 0.80, abs(s));
  float alpha = edgeAA * mix(0.86, 0.98, depthFade) * vVisibility;

  fragColor = vec4(finalColor, alpha);
}
`;

/* ============================================================================
   2. PHOTO-SAMPLED 3D GRAINS -> GRAIN BLEND MORPH CLOUD
   - Stage 1 (0.00-0.18): Hidden inside the wired circle (alpha 0)
   - Stage 2 (0.20-0.56): Morphs directly out of the dissolving wire into the
                           uploaded GRAINS photo (grains.jpg)
   - Stage 3 (0.56-1.00): Whole grains swirl in 3D and transform cleanly into
                           the uploaded GRAIN BLEND photo (grain-blend.jpg)!
============================================================================ */
const CLOUD_VS = `#version 300 es
precision highp float;

in vec3 aOriginPos;
in vec3 aGrainsPos;
in vec4 aGrainsCol;
in vec3 aBlendPos;
in vec4 aBlendCol;
in float aSeed;

uniform mat4 uViewProj;
uniform vec2 uMouse;
uniform float uScroll;
uniform float uTime;

out vec4 vColor;
out float vSoftness;

float easeInOutCubic(float x) {
  return x < 0.5 ? 4.0 * x * x * x : 1.0 - pow(-2.0 * x + 2.0, 3.0) / 2.0;
}

void main() {
  // Stage 1 -> Stage 2 (0.18 -> 0.40): Wire transforms into Grains
  // Stage 2 -> Stage 3 (0.56 -> 0.80): Grains transform into Grain Blend
  float toGrains = easeInOutCubic(smoothstep(0.18, 0.40, uScroll));
  float toBlend = easeInOutCubic(smoothstep(0.56, 0.80, uScroll));

  vec3 pos = mix(aOriginPos, aGrainsPos, toGrains);
  pos = mix(pos, aBlendPos, toBlend);

  vec4 col = mix(vec4(0.92, 0.66, 0.24, 0.0), aGrainsCol, smoothstep(0.18, 0.34, uScroll));
  col = mix(col, aBlendCol, toBlend);

  // Smooth organic 3D swirl during transformation peaks
  float burst12 = sin(smoothstep(0.18, 0.40, uScroll) * 3.14159265);
  float burst23 = sin(smoothstep(0.56, 0.80, uScroll) * 3.14159265);
  float turb = burst12 * 0.62 + burst23 * 0.88;

  vec3 swirl = vec3(
    sin(aSeed * 29.3 + uTime * 1.1 + uScroll * 8.0),
    cos(aSeed * 19.7 - uTime * 0.9 + uScroll * 6.5),
    sin(aSeed * 41.1 + uTime * 0.8)
  );
  pos += swirl * turb * 0.68;

  // Living depth shimmer when settled
  pos.z += sin(uTime * 1.3 + aSeed * 18.0) * 0.02;

  // Cursor parallax around right-center focal point
  vec3 center = vec3(0.84, 0.0, 0.0);
  vec3 rel = pos - center;
  float rotY = uMouse.x * 0.24;
  float rotX = -uMouse.y * 0.16;
  float cy = cos(rotY), sy = sin(rotY);
  float cx = cos(rotX), sx = sin(rotX);
  vec3 r1 = vec3(rel.x * cy + rel.z * sy, rel.y, -rel.x * sy + rel.z * cy);
  vec3 r2 = vec3(r1.x, r1.y * cx - r1.z * sx, r1.y * sx + r1.z * cx) + center;

  vec4 clip = uViewProj * vec4(r2, 1.0);
  gl_Position = clip;

  float lockedness = 1.0 - clamp(turb, 0.0, 1.0);
  float basePx = mix(10.5, 19.0, lockedness);
  gl_PointSize = clamp(basePx / max(0.8, clip.w * 0.28), 2.0, 26.0);

  vColor = col;
  vSoftness = mix(0.65, 0.22, lockedness);
}
`;

const CLOUD_FS = `#version 300 es
precision highp float;

in vec4 vColor;
in float vSoftness;

out vec4 fragColor;

void main() {
  if (vColor.a < 0.02) discard;

  vec2 c = gl_PointCoord - vec2(0.5);
  float d = length(c) * 2.0;
  if (d > 1.0) discard;

  float alpha = smoothstep(1.0, 1.0 - max(0.18, vSoftness), d) * vColor.a;
  fragColor = vec4(vColor.rgb, alpha);
}
`;

function createPerspectiveMatrix(
  fovRad: number,
  aspect: number,
  near: number,
  far: number
): Float32Array {
  const f = 1.0 / Math.tan(fovRad / 2);
  const nf = 1 / (near - far);
  return new Float32Array([
    f / aspect, 0, 0, 0,
    0, f, 0, 0,
    0, 0, (far + near) * nf, -1,
    0, 0, 2 * far * near * nf, 0,
  ]);
}

function multiplyMat4(a: Float32Array, b: Float32Array): Float32Array {
  const out = new Float32Array(16);
  for (let c = 0; c < 4; c++) {
    for (let r = 0; r < 4; r++) {
      out[c * 4 + r] =
        a[0 * 4 + r] * b[c * 4 + 0] +
        a[1 * 4 + r] * b[c * 4 + 1] +
        a[2 * 4 + r] * b[c * 4 + 2] +
        a[3 * 4 + r] * b[c * 4 + 3];
    }
  }
  return out;
}

function createLookAtMatrix(
  eye: [number, number, number],
  center: [number, number, number],
  up: [number, number, number]
): Float32Array {
  let zx = eye[0] - center[0];
  let zy = eye[1] - center[1];
  let zz = eye[2] - center[2];
  let len = Math.hypot(zx, zy, zz) || 1;
  zx /= len;
  zy /= len;
  zz /= len;

  let xx = up[1] * zz - up[2] * zy;
  let xy = up[2] * zx - up[0] * zz;
  let xz = up[0] * zy - up[1] * zx;
  len = Math.hypot(xx, xy, xz) || 1;
  xx /= len;
  xy /= len;
  xz /= len;

  const yx = zy * xz - zz * xy;
  const yy = zz * xx - zx * xz;
  const yz = zx * xy - zy * xx;

  return new Float32Array([
    xx, yx, zx, 0,
    xy, yy, zy, 0,
    xz, yz, zz, 0,
    -(xx * eye[0] + xy * eye[1] + xz * eye[2]),
    -(yx * eye[0] + yy * eye[1] + yz * eye[2]),
    -(zx * eye[0] + zy * eye[1] + zz * eye[2]),
    1,
  ]);
}

function buildStrandGeometry() {
  const rand = mulberry32(20261114);
  const vertsPerStrand = SEGMENTS_PER_STRAND * 2;
  const totalVerts = STRAND_COUNT * vertsPerStrand;

  const posHero = new Float32Array(totalVerts * 3);
  const nextHero = new Float32Array(totalVerts * 3);
  const aT = new Float32Array(totalVerts);
  const aSide = new Float32Array(totalVerts);
  const aSeed = new Float32Array(totalVerts);
  const indices: number[] = [];

  for (let i = 0; i < STRAND_COUNT; i++) {
    const seed = rand();
    const phi = Math.acos(1 - (2 * (i + 0.5)) / STRAND_COUNT);
    const theta = Math.PI * (1 + Math.sqrt(5)) * i;

    const dirX = Math.sin(phi) * Math.cos(theta);
    const dirY = Math.sin(phi) * Math.sin(theta);
    const dirZ = Math.cos(phi);

    const hPts: [number, number, number][] = [];

    for (let s = 0; s < SEGMENTS_PER_STRAND; s++) {
      const t = s / (SEGMENTS_PER_STRAND - 1);
      // Positioned cleanly at X = 1.02 so it never touches left Hero typography
      const budR = 0.20 + t * 0.90;
      const twist = t * 1.45 + seed * 3.14;
      hPts.push([
        1.02 + dirX * budR + Math.cos(twist) * 0.14 * t,
        0.02 + dirY * budR * 1.08 + Math.sin(twist) * 0.13 * t,
        dirZ * budR * 0.88,
      ]);
    }

    for (let s = 0; s < SEGMENTS_PER_STRAND; s++) {
      const t = s / (SEGMENTS_PER_STRAND - 1);
      const nextIdx = Math.min(SEGMENTS_PER_STRAND - 1, s + 1);
      const cH = hPts[s];
      const nH =
        s === SEGMENTS_PER_STRAND - 1
          ? [
              cH[0] + (cH[0] - hPts[s - 1][0]),
              cH[1] + (cH[1] - hPts[s - 1][1]),
              cH[2] + (cH[2] - hPts[s - 1][2]),
            ]
          : hPts[nextIdx];

      for (let sideIdx = 0; sideIdx < 2; sideIdx++) {
        const vIdx = i * vertsPerStrand + s * 2 + sideIdx;
        const side = sideIdx === 0 ? -1 : 1;

        posHero[vIdx * 3 + 0] = cH[0];
        posHero[vIdx * 3 + 1] = cH[1];
        posHero[vIdx * 3 + 2] = cH[2];

        nextHero[vIdx * 3 + 0] = nH[0];
        nextHero[vIdx * 3 + 1] = nH[1];
        nextHero[vIdx * 3 + 2] = nH[2];

        aT[vIdx] = t;
        aSide[vIdx] = side;
        aSeed[vIdx] = seed;
      }

      if (s < SEGMENTS_PER_STRAND - 1) {
        const base = i * vertsPerStrand + s * 2;
        indices.push(base, base + 1, base + 2);
        indices.push(base + 1, base + 3, base + 2);
      }
    }
  }

  return {
    posHero,
    nextHero,
    aT,
    aSide,
    aSeed,
    indices: new Uint16Array(indices),
  };
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function sampleImageToGrid(
  img: HTMLImageElement,
  cols: number,
  rows: number,
  options: {
    centerX: number;
    width3D: number;
    height3D: number;
    keyOutWhite: boolean;
    roundedVignette: boolean;
  }
) {
  const canvas = document.createElement("canvas");
  canvas.width = cols;
  canvas.height = rows;
  const ctx = canvas.getContext("2d");
  const pos = new Float32Array(cols * rows * 3);
  const col = new Float32Array(cols * rows * 4);
  if (!ctx) return { pos, col };

  const imgAspect = img.width / Math.max(1, img.height);
  const gridAspect = cols / rows;
  let sx = 0,
    sy = 0,
    sw = img.width,
    sh = img.height;
  if (imgAspect > gridAspect) {
    sw = img.height * gridAspect;
    sx = (img.width - sw) * 0.5;
  } else {
    sh = img.width / gridAspect;
    sy = (img.height - sh) * 0.5;
  }

  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, cols, rows);
  const pixels = ctx.getImageData(0, 0, cols, rows).data;
  const rand = mulberry32(options.keyOutWhite ? 8811 : 3377);

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const idx = r * cols + c;
      const pIdx = idx * 4;
      const R = pixels[pIdx] / 255;
      const G = pixels[pIdx + 1] / 255;
      const B = pixels[pIdx + 2] / 255;
      const luma = 0.299 * R + 0.587 * G + 0.114 * B;

      const u = c / (cols - 1);
      const v = r / (rows - 1);

      let alpha = 1.0;
      if (options.keyOutWhite) {
        const maxCh = Math.max(R, G, B);
        const minCh = Math.min(R, G, B);
        const sat = maxCh - minCh;
        if (luma > 0.78 && sat < 0.08) {
          alpha = 0.0;
        } else if (luma > 0.7 && sat < 0.12) {
          alpha = smoothstep(0.8, 0.68, luma);
        }
      }

      if (options.roundedVignette) {
        const dx = (u - 0.5) * 2.0;
        const dy = (v - 0.5) * 2.0;
        const dist = Math.hypot(dx * 0.92, dy * 0.95);
        alpha *= 1.0 - smoothstep(0.82, 1.02, dist);
      }

      const jx = (rand() - 0.5) * (options.width3D / cols) * 0.75;
      const jy = (rand() - 0.5) * (options.height3D / rows) * 0.75;

      pos[idx * 3 + 0] = options.centerX + (u - 0.5) * options.width3D + jx;
      pos[idx * 3 + 1] = (0.5 - v) * options.height3D + jy;
      pos[idx * 3 + 2] = (luma - 0.45) * 0.36 + (rand() - 0.5) * 0.06;

      col[idx * 4 + 0] = R;
      col[idx * 4 + 1] = G;
      col[idx * 4 + 2] = B;
      col[idx * 4 + 3] = alpha;
    }
  }

  return { pos, col };
}

function buildFallbackCloudPositions(count: number) {
  const rand = mulberry32(445566);
  const originPos = new Float32Array(count * 3);
  const seeds = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    const r0 = 0.18 + rand() * 0.88;
    const th0 = rand() * Math.PI * 2;
    const ph0 = Math.acos(2 * rand() - 1);
    originPos[i * 3 + 0] = 1.02 + Math.sin(ph0) * Math.cos(th0) * r0;
    originPos[i * 3 + 1] = Math.sin(ph0) * Math.sin(th0) * r0;
    originPos[i * 3 + 2] = Math.cos(ph0) * r0;
    seeds[i] = rand();
  }

  return { originPos, seeds };
}

export function GrainSculpture3D({
  scrollProgress,
  className = "",
}: GrainSculpture3DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [webglAvailable, setWebglAvailable] = useState(true);
  const targetScrollRef = useRef(scrollProgress);
  const currentScrollRef = useRef(scrollProgress);
  const mouseTargetRef = useRef({ x: 0, y: 0 });
  const mouseCurrentRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    targetScrollRef.current = scrollProgress;
  }, [scrollProgress]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const isLowPowerOrMobile =
      window.innerWidth < 768 ||
      (typeof navigator !== "undefined" &&
        navigator.hardwareConcurrency > 0 &&
        navigator.hardwareConcurrency <= 4);

    const activeCols = isLowPowerOrMobile ? 76 : CLOUD_COLS;
    const activeRows = isLowPowerOrMobile ? 54 : CLOUD_ROWS;
    const activeCloudCount = activeCols * activeRows;

    const reducedMotionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );
    let prefersReducedMotion = reducedMotionQuery.matches;
    const onReducedMotionChange = (e: MediaQueryListEvent) => {
      prefersReducedMotion = e.matches;
    };
    reducedMotionQuery.addEventListener("change", onReducedMotionChange);

    const handlePointerMove = (e: PointerEvent) => {
      if (isLowPowerOrMobile || prefersReducedMotion) return;
      mouseTargetRef.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1,
      };
    };
    window.addEventListener("pointermove", handlePointerMove, { passive: true });

    const gl = canvas.getContext("webgl2", {
      alpha: true,
      antialias: !isLowPowerOrMobile,
      powerPreference: "high-performance",
    });

    if (!gl) {
      setWebglAvailable(false);
      return () => {
        reducedMotionQuery.removeEventListener("change", onReducedMotionChange);
        window.removeEventListener("pointermove", handlePointerMove);
      };
    }

    const strandProgram = createProgram(gl, STRAND_VS, STRAND_FS);
    const cloudProgram = createProgram(gl, CLOUD_VS, CLOUD_FS);
    if (!strandProgram || !cloudProgram) {
      setWebglAvailable(false);
      return () => {
        reducedMotionQuery.removeEventListener("change", onReducedMotionChange);
        window.removeEventListener("pointermove", handlePointerMove);
      };
    }

    const allocatedBuffers: WebGLBuffer[] = [];

    const bindAttr = (
      program: WebGLProgram,
      name: string,
      data: Float32Array,
      size: number
    ) => {
      const loc = gl.getAttribLocation(program, name);
      if (loc === -1) return null;
      const buf = gl.createBuffer();
      if (buf) allocatedBuffers.push(buf);
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0);
      return buf;
    };

    const strandGeom = buildStrandGeometry();
    const strandVao = gl.createVertexArray();
    gl.bindVertexArray(strandVao);
    bindAttr(strandProgram, "aPosHero", strandGeom.posHero, 3);
    bindAttr(strandProgram, "aPosNextHero", strandGeom.nextHero, 3);
    bindAttr(strandProgram, "aT", strandGeom.aT, 1);
    bindAttr(strandProgram, "aSide", strandGeom.aSide, 1);
    bindAttr(strandProgram, "aSeed", strandGeom.aSeed, 1);
    const ebo = gl.createBuffer();
    if (ebo) allocatedBuffers.push(ebo);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ebo);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, strandGeom.indices, gl.STATIC_DRAW);

    const fallback = buildFallbackCloudPositions(activeCloudCount);
    const emptyCol = new Float32Array(activeCloudCount * 4);
    const cloudVao = gl.createVertexArray();
    gl.bindVertexArray(cloudVao);
    bindAttr(cloudProgram, "aOriginPos", fallback.originPos, 3);
    const grainsPosBuf = bindAttr(
      cloudProgram,
      "aGrainsPos",
      fallback.originPos,
      3
    );
    const grainsColBuf = bindAttr(cloudProgram, "aGrainsCol", emptyCol, 4);
    const blendPosBuf = bindAttr(
      cloudProgram,
      "aBlendPos",
      fallback.originPos,
      3
    );
    const blendColBuf = bindAttr(cloudProgram, "aBlendCol", emptyCol, 4);
    bindAttr(cloudProgram, "aSeed", fallback.seeds, 1);

    gl.bindVertexArray(null);

    let disposed = false;

    Promise.all([
      loadImage("/images/grains.jpg"),
      loadImage("/images/grain-blend.jpg"),
    ])
      .then(([grainsImg, blendImg]) => {
        if (disposed) return;

        const grainsData = sampleImageToGrid(grainsImg, activeCols, activeRows, {
          centerX: 0.84,
          width3D: 2.55,
          height3D: 1.9,
          keyOutWhite: false,
          roundedVignette: true,
        });

        const blendData = sampleImageToGrid(blendImg, activeCols, activeRows, {
          centerX: 0.84,
          width3D: 2.38,
          height3D: 2.2,
          keyOutWhite: true,
          roundedVignette: false,
        });

        if (grainsPosBuf) {
          gl.bindBuffer(gl.ARRAY_BUFFER, grainsPosBuf);
          gl.bufferData(gl.ARRAY_BUFFER, grainsData.pos, gl.STATIC_DRAW);
        }
        if (grainsColBuf) {
          gl.bindBuffer(gl.ARRAY_BUFFER, grainsColBuf);
          gl.bufferData(gl.ARRAY_BUFFER, grainsData.col, gl.STATIC_DRAW);
        }
        if (blendPosBuf) {
          gl.bindBuffer(gl.ARRAY_BUFFER, blendPosBuf);
          gl.bufferData(gl.ARRAY_BUFFER, blendData.pos, gl.STATIC_DRAW);
        }
        if (blendColBuf) {
          gl.bindBuffer(gl.ARRAY_BUFFER, blendColBuf);
          gl.bufferData(gl.ARRAY_BUFFER, blendData.col, gl.STATIC_DRAW);
        }
      })
      .catch((err) => {
        console.error("Failed to sample grain images:", err);
      });

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      const width = Math.max(1, Math.floor(rect.width * dpr));
      const height = Math.max(1, Math.floor(rect.height * dpr));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      gl.viewport(0, 0, width, height);
    };

    resize();
    window.addEventListener("resize", resize);

    let isVisible = true;
    let isDocVisible = !document.hidden;

    const handleVisibilityChange = () => {
      isDocVisible = !document.hidden;
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    const observer = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0]?.isIntersecting ?? true;
      },
      { threshold: 0.01 }
    );
    observer.observe(canvas);

    let rafId = 0;
    const startTime = performance.now();

    const render = (now: number) => {
      rafId = requestAnimationFrame(render);
      if (!isVisible || !isDocVisible) return;

      const t = prefersReducedMotion ? 0 : (now - startTime) * 0.001;

      currentScrollRef.current +=
        (targetScrollRef.current - currentScrollRef.current) *
        (prefersReducedMotion ? 0.35 : 0.095);
      mouseCurrentRef.current.x +=
        (mouseTargetRef.current.x - mouseCurrentRef.current.x) * 0.06;
      mouseCurrentRef.current.y +=
        (mouseTargetRef.current.y - mouseCurrentRef.current.y) * 0.06;

      const scroll = currentScrollRef.current;
      const aspect = canvas.width / Math.max(1, canvas.height);

      const proj = createPerspectiveMatrix(
        (44 * Math.PI) / 180,
        aspect,
        0.1,
        30
      );
      const m = Math.min(1, Math.max(0, (1.3 - aspect) / 0.5));
      const mobileDist = Math.min(
        9.5,
        Math.max(4.4, 1.62 / (0.404 * Math.max(0.3, aspect)))
      );
      const mix = (a: number, b: number, k: number) => a + (b - a) * k;
      const eye: [number, number, number] = [
        mix(0.0, 0.9, m),
        mix(0.02, -1.03, m),
        mix(4.4, mobileDist, m),
      ];
      const target: [number, number, number] = [
        mix(0.15, 0.9, m),
        mix(0, -1.05, m),
        0,
      ];
      const view = createLookAtMatrix(eye, target, [0, 1, 0]);
      const viewProj = multiplyMat4(proj, view);

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

      if (scroll < 0.42) {
        gl.enable(gl.DEPTH_TEST);
        gl.depthMask(true);
        gl.useProgram(strandProgram);
        gl.bindVertexArray(strandVao);
        gl.uniformMatrix4fv(
          gl.getUniformLocation(strandProgram, "uViewProj"),
          false,
          viewProj
        );
        gl.uniform2f(
          gl.getUniformLocation(strandProgram, "uMouse"),
          mouseCurrentRef.current.x,
          mouseCurrentRef.current.y
        );
        gl.uniform1f(gl.getUniformLocation(strandProgram, "uScroll"), scroll);
        gl.uniform1f(gl.getUniformLocation(strandProgram, "uTime"), t);
        gl.uniform1f(gl.getUniformLocation(strandProgram, "uAspect"), aspect);
        gl.drawElements(
          gl.TRIANGLES,
          strandGeom.indices.length,
          gl.UNSIGNED_SHORT,
          0
        );
      }

      gl.depthMask(false);
      gl.useProgram(cloudProgram);
      gl.bindVertexArray(cloudVao);
      gl.uniformMatrix4fv(
        gl.getUniformLocation(cloudProgram, "uViewProj"),
        false,
        viewProj
      );
      gl.uniform2f(
        gl.getUniformLocation(cloudProgram, "uMouse"),
        mouseCurrentRef.current.x,
        mouseCurrentRef.current.y
      );
      gl.uniform1f(gl.getUniformLocation(cloudProgram, "uScroll"), scroll);
      gl.uniform1f(gl.getUniformLocation(cloudProgram, "uTime"), t);
      gl.drawArrays(gl.POINTS, 0, activeCloudCount);

      gl.depthMask(true);
    };

    rafId = requestAnimationFrame(render);

    return () => {
      disposed = true;
      cancelAnimationFrame(rafId);
      observer.disconnect();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      reducedMotionQuery.removeEventListener("change", onReducedMotionChange);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", handlePointerMove);
      allocatedBuffers.forEach((b) => gl.deleteBuffer(b));
      if (strandVao) gl.deleteVertexArray(strandVao);
      if (cloudVao) gl.deleteVertexArray(cloudVao);
      gl.deleteProgram(strandProgram);
      gl.deleteProgram(cloudProgram);
    };
  }, []);

  if (!webglAvailable) {
    return (
      <div
        aria-hidden="true"
        className={`w-full h-full flex items-center justify-center lg:justify-end lg:pr-16 pointer-events-none ${className}`}
      >
        <div className="w-60 h-60 sm:w-80 sm:h-80 rounded-full overflow-hidden border-4 border-white/60 shadow-xl opacity-85">
          <img
            src={scrollProgress > 0.6 ? "/images/grain-blend.jpg" : "/images/grains.jpg"}
            alt=""
            width={600}
            height={600}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    );
  }

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-full block pointer-events-none ${className}`}
      aria-hidden="true"
    />
  );
}
