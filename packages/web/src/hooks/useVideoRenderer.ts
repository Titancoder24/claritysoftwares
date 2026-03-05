"use client";

import { useCallback, useEffect, useRef } from "react";
import type {
  Annotation,
  BackgroundConfig,
  CursorConfig,
  CursorEvent,
  ZoomConfig,
  ZoomKeyframe,
} from "./useProject";

/* ------------------------------------------------------------------ */
/*  Math helpers                                                       */
/* ------------------------------------------------------------------ */

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

/** Attempt a spring-physics ease: critically-damped spring approximation. */
function springEase(t: number): number {
  return 1 - Math.exp(-6 * t) * Math.cos(4 * t);
}

function smoothEase(t: number): number {
  return t * t * (3 - 2 * t);
}

function easeByName(name: string, t: number): number {
  if (name === "spring") return springEase(t);
  if (name === "smooth") return smoothEase(t);
  return t; // linear
}

/** Catmull-Rom spline interpolation for cursor positions. */
function catmullRom(
  p0: number,
  p1: number,
  p2: number,
  p3: number,
  t: number,
): number {
  const t2 = t * t;
  const t3 = t2 * t;
  return (
    0.5 *
    (2 * p1 +
      (-p0 + p2) * t +
      (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 +
      (-p0 + 3 * p1 - 3 * p2 + p3) * t3)
  );
}

/* ------------------------------------------------------------------ */
/*  Smoothing coefficients                                             */
/* ------------------------------------------------------------------ */

const SMOOTHING_ALPHA: Record<string, number> = {
  off: 1,
  gentle: 0.35,
  smooth: 0.18,
  cinematic: 0.08,
};

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface RendererOptions {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  zoomKeyframes: ZoomKeyframe[];
  cursorEvents: CursorEvent[];
  annotations: Annotation[];
  background: BackgroundConfig;
  cursorConfig: CursorConfig;
  zoomConfig: ZoomConfig;
  videoWidth: number;
  videoHeight: number;
  isPlaying: boolean;
  currentTime: number;
}

/* ------------------------------------------------------------------ */
/*  Hook                                                               */
/* ------------------------------------------------------------------ */

export function useVideoRenderer({
  canvasRef,
  videoRef,
  zoomKeyframes,
  cursorEvents,
  annotations,
  background,
  cursorConfig,
  zoomConfig,
  videoWidth,
  videoHeight,
  isPlaying,
  currentTime,
}: RendererOptions) {
  const rafRef = useRef<number>(0);
  const smoothCursorRef = useRef({ x: 0, y: 0 });
  const clickEffectsRef = useRef<{ x: number; y: number; time: number; birth: number }[]>([]);

  /* ---------- zoom interpolation ---------- */

  const getZoomAt = useCallback(
    (time: number) => {
      if (!zoomConfig.enabled) return { scale: 1, x: 0.5, y: 0.5 };

      const active = zoomKeyframes.find((k) => time >= k.startTime && time <= k.endTime);
      if (!active) return { scale: 1, x: 0.5, y: 0.5 };

      const span = active.endTime - active.startTime;
      const blendIn = 0.15 * span;
      const blendOut = 0.15 * span;

      let t = 1;
      if (time < active.startTime + blendIn) {
        t = easeByName(active.easing, (time - active.startTime) / blendIn);
      } else if (time > active.endTime - blendOut) {
        t = easeByName(active.easing, (active.endTime - time) / blendOut);
      }

      const scale = lerp(1, active.scale * zoomConfig.intensity, t);
      const x = lerp(0.5, active.x, t);
      const y = lerp(0.5, active.y, t);

      return { scale: clamp(scale, 1, 5), x: clamp(x, 0, 1), y: clamp(y, 0, 1) };
    },
    [zoomKeyframes, zoomConfig],
  );

  /* ---------- cursor position ---------- */

  const getCursorAt = useCallback(
    (time: number): { x: number; y: number; visible: boolean } | null => {
      if (cursorEvents.length === 0) return null;

      // find bracketing events
      let before: CursorEvent | null = null;
      let after: CursorEvent | null = null;

      for (const evt of cursorEvents) {
        if (evt.time <= time) before = evt;
        if (evt.time >= time && !after) after = evt;
      }

      if (!before) return after ? { x: after.x, y: after.y, visible: true } : null;
      if (!after) return { x: before.x, y: before.y, visible: true };
      if (before === after) return { x: before.x, y: before.y, visible: true };

      // Find four control points for Catmull-Rom
      const idx = cursorEvents.indexOf(before);
      const p0 = cursorEvents[Math.max(0, idx - 1)];
      const p3 = cursorEvents[Math.min(cursorEvents.length - 1, cursorEvents.indexOf(after) + 1)];

      const tLocal = (time - before.time) / (after.time - before.time);
      const x = catmullRom(p0.x, before.x, after.x, p3.x, tLocal);
      const y = catmullRom(p0.y, before.y, after.y, p3.y, tLocal);

      return { x, y, visible: true };
    },
    [cursorEvents],
  );

  /* ---------- click effects ---------- */

  const updateClickEffects = useCallback(
    (time: number) => {
      if (!cursorConfig.clickEffects) return;

      for (const evt of cursorEvents) {
        if (evt.type !== "click") continue;
        if (Math.abs(evt.time - time) < 0.02) {
          const already = clickEffectsRef.current.some(
            (e) => Math.abs(e.time - evt.time) < 0.05,
          );
          if (!already) {
            clickEffectsRef.current.push({
              x: evt.x,
              y: evt.y,
              time: evt.time,
              birth: performance.now(),
            });
          }
        }
      }

      // prune old
      const now = performance.now();
      clickEffectsRef.current = clickEffectsRef.current.filter(
        (e) => now - e.birth < 600,
      );
    },
    [cursorEvents, cursorConfig.clickEffects],
  );

  /* ---------- main render ---------- */

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cw = canvas.width;
    const ch = canvas.height;

    ctx.clearRect(0, 0, cw, ch);

    /* -- background -- */
    const pad = background.padding;
    const br = background.borderRadius;

    if (background.type === "gradient") {
      const angle = (background.gradient.angle * Math.PI) / 180;
      const cx = cw / 2;
      const cy = ch / 2;
      const len = Math.max(cw, ch);
      const g = ctx.createLinearGradient(
        cx - Math.cos(angle) * len,
        cy - Math.sin(angle) * len,
        cx + Math.cos(angle) * len,
        cy + Math.sin(angle) * len,
      );
      g.addColorStop(0, background.gradient.from);
      g.addColorStop(1, background.gradient.to);
      ctx.fillStyle = g;
    } else {
      ctx.fillStyle = background.color;
    }

    ctx.beginPath();
    ctx.roundRect(0, 0, cw, ch, br);
    ctx.fill();

    /* -- shadow behind video -- */
    if (background.shadow.blur > 0) {
      ctx.save();
      ctx.shadowColor = background.shadow.color;
      ctx.shadowBlur = background.shadow.blur;
      ctx.shadowOffsetX = background.shadow.x;
      ctx.shadowOffsetY = background.shadow.y;
      ctx.fillStyle = "rgba(0,0,0,0.01)";
      ctx.beginPath();
      ctx.roundRect(pad, pad, cw - pad * 2, ch - pad * 2, Math.max(0, br - 2));
      ctx.fill();
      ctx.restore();
    }

    /* -- zoom transform -- */
    const time = video.currentTime;
    const { scale, x: zx, y: zy } = getZoomAt(time);

    ctx.save();
    const videoDstW = cw - pad * 2;
    const videoDstH = ch - pad * 2;

    ctx.beginPath();
    ctx.roundRect(pad, pad, videoDstW, videoDstH, Math.max(0, br - 2));
    ctx.clip();

    // translate so that zoom focus stays centered
    const tx = pad + videoDstW / 2 - zx * videoDstW * scale;
    const ty = pad + videoDstH / 2 - zy * videoDstH * scale;

    ctx.translate(tx, ty);
    ctx.scale(scale, scale);

    // draw video
    ctx.drawImage(video, 0, 0, videoDstW, videoDstH);

    /* -- annotations -- */
    for (const ann of annotations) {
      if (time < ann.startTime || time > ann.endTime) continue;

      ctx.save();
      ctx.translate(ann.x * videoDstW, ann.y * videoDstH);
      ctx.rotate((ann.rotation * Math.PI) / 180);

      const aw = ann.width * videoDstW;
      const ah = ann.height * videoDstH;

      switch (ann.type) {
        case "blur": {
          ctx.filter = "blur(12px)";
          ctx.drawImage(
            video,
            (ann.x * videoWidth) | 0,
            (ann.y * videoHeight) | 0,
            (ann.width * videoWidth) | 0,
            (ann.height * videoHeight) | 0,
            0,
            0,
            aw,
            ah,
          );
          ctx.filter = "none";
          break;
        }
        case "spotlight": {
          ctx.fillStyle = "rgba(0,0,0,0.55)";
          ctx.fillRect(-videoDstW, -videoDstH, videoDstW * 3, videoDstH * 3);
          ctx.clearRect(0, 0, aw, ah);
          break;
        }
        case "text": {
          const fontSize = Number(ann.style.fontSize ?? 16);
          ctx.font = `600 ${fontSize}px Inter, system-ui, sans-serif`;
          ctx.fillStyle = String(ann.style.color ?? "#ffffff");
          ctx.fillText(ann.content, 0, fontSize);
          break;
        }
        case "arrow": {
          ctx.strokeStyle = String(ann.style.color ?? "#6366f1");
          ctx.lineWidth = Number(ann.style.lineWidth ?? 3);
          ctx.lineCap = "round";
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(aw, ah);
          ctx.stroke();
          // arrowhead
          const angle = Math.atan2(ah, aw);
          const headLen = 12;
          ctx.beginPath();
          ctx.moveTo(aw, ah);
          ctx.lineTo(
            aw - headLen * Math.cos(angle - 0.5),
            ah - headLen * Math.sin(angle - 0.5),
          );
          ctx.moveTo(aw, ah);
          ctx.lineTo(
            aw - headLen * Math.cos(angle + 0.5),
            ah - headLen * Math.sin(angle + 0.5),
          );
          ctx.stroke();
          break;
        }
        case "shape": {
          ctx.strokeStyle = String(ann.style.color ?? "#8b5cf6");
          ctx.lineWidth = Number(ann.style.lineWidth ?? 2);
          ctx.strokeRect(0, 0, aw, ah);
          break;
        }
      }

      ctx.restore();
    }

    ctx.restore(); // un-clip & un-zoom

    /* -- cursor -- */
    const rawCursor = getCursorAt(time);
    if (rawCursor && rawCursor.visible) {
      const alpha = SMOOTHING_ALPHA[cursorConfig.smoothing] ?? 1;

      smoothCursorRef.current.x = lerp(
        smoothCursorRef.current.x,
        rawCursor.x,
        alpha,
      );
      smoothCursorRef.current.y = lerp(
        smoothCursorRef.current.y,
        rawCursor.y,
        alpha,
      );

      const cx = pad + smoothCursorRef.current.x * videoDstW;
      const cy = pad + smoothCursorRef.current.y * videoDstH;

      // click ripples
      const now = performance.now();
      for (const effect of clickEffectsRef.current) {
        const age = (now - effect.birth) / 600;
        if (age > 1) continue;
        const radius = 6 + age * 30;
        const opacity = 1 - age;
        ctx.beginPath();
        ctx.arc(
          pad + effect.x * videoDstW,
          pad + effect.y * videoDstH,
          radius,
          0,
          Math.PI * 2,
        );
        ctx.strokeStyle = `rgba(99, 102, 241, ${opacity})`;
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // draw cursor
      const cursorSize = 20 * cursorConfig.size;
      ctx.save();
      ctx.translate(cx, cy);

      // default macOS-style pointer
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, cursorSize);
      ctx.lineTo(cursorSize * 0.35, cursorSize * 0.72);
      ctx.lineTo(cursorSize * 0.55, cursorSize);
      ctx.lineTo(cursorSize * 0.72, cursorSize * 0.88);
      ctx.lineTo(cursorSize * 0.48, cursorSize * 0.6);
      ctx.lineTo(cursorSize * 0.82, cursorSize * 0.58);
      ctx.closePath();
      ctx.fillStyle = "#ffffff";
      ctx.fill();
      ctx.strokeStyle = "#e2e8f0";
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();
    }

    updateClickEffects(time);
  }, [
    canvasRef,
    videoRef,
    background,
    annotations,
    getZoomAt,
    getCursorAt,
    cursorConfig,
    updateClickEffects,
    videoWidth,
    videoHeight,
  ]);

  /* ---------- animation loop ---------- */

  useEffect(() => {
    let running = true;

    function loop() {
      if (!running) return;
      render();
      rafRef.current = requestAnimationFrame(loop);
    }

    if (isPlaying) {
      loop();
    } else {
      render(); // single frame
    }

    return () => {
      running = false;
      cancelAnimationFrame(rafRef.current);
    };
  }, [isPlaying, render, currentTime]);

  return { render };
}
