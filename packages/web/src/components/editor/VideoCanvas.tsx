"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Pause, Play, Maximize2, Minimize2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useVideoRenderer } from "@/hooks/useVideoRenderer";
import type {
  Annotation,
  BackgroundConfig,
  CursorConfig,
  CursorEvent,
  ZoomConfig,
  ZoomKeyframe,
} from "@/hooks/useProject";

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

interface VideoCanvasProps {
  videoUrl: string;
  videoWidth: number;
  videoHeight: number;
  isPlaying: boolean;
  currentTime: number;
  zoomKeyframes: ZoomKeyframe[];
  cursorEvents: CursorEvent[];
  annotations: Annotation[];
  background: BackgroundConfig;
  cursorConfig: CursorConfig;
  zoomConfig: ZoomConfig;
  onPlay: () => void;
  onPause: () => void;
  onTimeUpdate: (time: number) => void;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function VideoCanvas({
  videoUrl,
  videoWidth,
  videoHeight,
  isPlaying,
  currentTime,
  zoomKeyframes,
  cursorEvents,
  annotations,
  background,
  cursorConfig,
  zoomConfig,
  onPlay,
  onPause,
  onTimeUpdate,
}: VideoCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showControls, setShowControls] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const hideTimeout = useRef<ReturnType<typeof setTimeout>>();

  /* -- resize canvas to container -- */
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const { width, height } = entry.contentRect;
      // maintain aspect ratio
      const aspect = videoWidth / videoHeight;
      let cw = width;
      let ch = width / aspect;
      if (ch > height) {
        ch = height;
        cw = height * aspect;
      }
      canvas.width = cw * window.devicePixelRatio;
      canvas.height = ch * window.devicePixelRatio;
      canvas.style.width = `${cw}px`;
      canvas.style.height = `${ch}px`;
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, [videoWidth, videoHeight]);

  /* -- sync video element -- */
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (isPlaying) {
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (Math.abs(v.currentTime - currentTime) > 0.1) {
      v.currentTime = currentTime;
    }
  }, [currentTime]);

  /* -- time updates from video element -- */
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const handler = () => onTimeUpdate(v.currentTime);
    v.addEventListener("timeupdate", handler);
    return () => v.removeEventListener("timeupdate", handler);
  }, [onTimeUpdate]);

  /* -- renderer -- */
  useVideoRenderer({
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
  });

  /* -- controls visibility -- */
  const handleMouseMove = useCallback(() => {
    setShowControls(true);
    if (hideTimeout.current) clearTimeout(hideTimeout.current);
    hideTimeout.current = setTimeout(() => setShowControls(false), 2500);
  }, []);

  /* -- fullscreen -- */
  const toggleFullscreen = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen().then(() => setIsFullscreen(true));
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false));
    }
  }, []);

  const togglePlay = useCallback(() => {
    if (isPlaying) onPause();
    else onPlay();
  }, [isPlaying, onPause, onPlay]);

  return (
    <div
      ref={containerRef}
      className="relative flex h-full w-full items-center justify-center bg-[#09090b] overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setShowControls(false)}
    >
      {/* hidden video source */}
      <video
        ref={videoRef}
        src={videoUrl}
        className="absolute opacity-0 pointer-events-none"
        playsInline
        muted
        preload="auto"
      />

      {/* canvas */}
      <canvas
        ref={canvasRef}
        className="rounded-lg"
        onClick={togglePlay}
      />

      {/* hover controls overlay */}
      <div
        className={cn(
          "absolute inset-0 flex items-center justify-center transition-opacity duration-200",
          showControls || !isPlaying ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
      >
        {/* center play/pause */}
        <button
          onClick={togglePlay}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-white hover:bg-white/20 transition-colors"
        >
          {isPlaying ? (
            <Pause className="h-6 w-6" />
          ) : (
            <Play className="h-6 w-6 ml-0.5" />
          )}
        </button>

        {/* fullscreen toggle */}
        <button
          onClick={toggleFullscreen}
          className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-md bg-white/10 text-white/70 hover:text-white hover:bg-white/20 transition-colors"
        >
          {isFullscreen ? (
            <Minimize2 className="h-4 w-4" />
          ) : (
            <Maximize2 className="h-4 w-4" />
          )}
        </button>
      </div>
    </div>
  );
}
