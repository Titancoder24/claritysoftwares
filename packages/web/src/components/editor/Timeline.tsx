"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { ZoomKeyframe, CursorEvent } from "@/hooks/useProject";

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

interface TimelineProps {
  duration: number;
  currentTime: number;
  isPlaying: boolean;
  trimStart: number;
  trimEnd: number;
  zoomKeyframes: ZoomKeyframe[];
  cursorEvents: CursorEvent[];
  onSeek: (time: number) => void;
  onPlay: () => void;
  onPause: () => void;
  onTrimChange: (start: number, end: number) => void;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 10);
  return `${m}:${s.toString().padStart(2, "0")}.${ms}`;
}

const SPEED_OPTIONS = [0.5, 0.75, 1, 1.25, 1.5, 2];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function Timeline({
  duration,
  currentTime,
  isPlaying,
  trimStart,
  trimEnd,
  zoomKeyframes,
  cursorEvents,
  onSeek,
  onPlay,
  onPause,
  onTrimChange,
}: TimelineProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [speed, setSpeed] = useState(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragTarget, setDragTarget] = useState<"playhead" | "trimStart" | "trimEnd" | null>(null);

  const effectiveDuration = duration || 1;

  /* ---- pointer helpers ---- */

  const timeFromPointer = useCallback(
    (clientX: number) => {
      const track = trackRef.current;
      if (!track) return 0;
      const rect = track.getBoundingClientRect();
      const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      return ratio * effectiveDuration;
    },
    [effectiveDuration],
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent, target: "playhead" | "trimStart" | "trimEnd") => {
      e.preventDefault();
      setIsDragging(true);
      setDragTarget(target);
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    [],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging || !dragTarget) return;
      const time = timeFromPointer(e.clientX);
      if (dragTarget === "playhead") {
        onSeek(time);
      } else if (dragTarget === "trimStart") {
        onTrimChange(Math.min(time, trimEnd - 0.1), trimEnd);
      } else if (dragTarget === "trimEnd") {
        onTrimChange(trimStart, Math.max(time, trimStart + 0.1));
      }
    },
    [isDragging, dragTarget, timeFromPointer, onSeek, onTrimChange, trimStart, trimEnd],
  );

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
    setDragTarget(null);
  }, []);

  const handleTrackClick = useCallback(
    (e: React.MouseEvent) => {
      if (isDragging) return;
      onSeek(timeFromPointer(e.clientX));
    },
    [isDragging, timeFromPointer, onSeek],
  );

  /* ---- keyboard shortcuts ---- */
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.code === "Space") {
        e.preventDefault();
        isPlaying ? onPause() : onPlay();
      } else if (e.code === "ArrowLeft") {
        onSeek(Math.max(0, currentTime - 5));
      } else if (e.code === "ArrowRight") {
        onSeek(Math.min(effectiveDuration, currentTime + 5));
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isPlaying, onPause, onPlay, onSeek, currentTime, effectiveDuration]);

  const playheadPct = (currentTime / effectiveDuration) * 100;
  const trimStartPct = (trimStart / effectiveDuration) * 100;
  const trimEndPct = (trimEnd / effectiveDuration) * 100;

  return (
    <div className="flex flex-col border-t border-white/[0.06] bg-[#0c0c0f]">
      {/* ---- track area ---- */}
      <div
        ref={trackRef}
        className="relative mx-4 mt-3 h-24 cursor-crosshair select-none"
        onClick={handleTrackClick}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        {/* grid lines */}
        <div className="absolute inset-0">
          {Array.from({ length: Math.ceil(effectiveDuration / 5) + 1 }).map((_, i) => {
            const pct = ((i * 5) / effectiveDuration) * 100;
            if (pct > 100) return null;
            return (
              <div
                key={i}
                className="absolute top-0 h-full w-px bg-white/[0.04]"
                style={{ left: `${pct}%` }}
              >
                <span className="absolute -top-0.5 left-1 text-[10px] text-zinc-600 font-mono">
                  {formatTime(i * 5)}
                </span>
              </div>
            );
          })}
        </div>

        {/* thumbnail strip placeholder */}
        <div className="absolute inset-x-0 top-4 h-12 rounded-md bg-white/[0.03] border border-white/[0.04] overflow-hidden">
          {/* waveform visualization (decorative) */}
          <div className="absolute inset-x-0 bottom-0 h-6 flex items-end gap-px px-1">
            {Array.from({ length: 120 }).map((_, i) => {
              const h = 4 + Math.sin(i * 0.3) * 8 + Math.random() * 6;
              return (
                <div
                  key={i}
                  className="flex-1 min-w-[1px] bg-indigo-500/20 rounded-t-sm"
                  style={{ height: `${h}px` }}
                />
              );
            })}
          </div>
        </div>

        {/* zoom keyframe regions */}
        {zoomKeyframes.map((kf) => {
          const left = (kf.startTime / effectiveDuration) * 100;
          const width = ((kf.endTime - kf.startTime) / effectiveDuration) * 100;
          return (
            <div
              key={kf.id}
              className="absolute top-4 h-12 rounded-sm bg-indigo-500/15 border border-indigo-500/25"
              style={{ left: `${left}%`, width: `${width}%` }}
            >
              <span className="absolute top-0.5 left-1 text-[9px] text-indigo-400/70 font-medium">
                {kf.scale.toFixed(1)}x
              </span>
            </div>
          );
        })}

        {/* click markers */}
        {cursorEvents
          .filter((e) => e.type === "click")
          .map((evt) => {
            const pct = (evt.time / effectiveDuration) * 100;
            return (
              <div
                key={evt.id}
                className="absolute top-[3.5rem] h-2 w-2 -ml-1 rounded-full bg-violet-500 ring-2 ring-violet-500/20"
                style={{ left: `${pct}%` }}
              />
            );
          })}

        {/* trim handles */}
        <div
          className="absolute top-4 h-12 bg-white/[0.02] pointer-events-none"
          style={{
            left: 0,
            width: `${trimStartPct}%`,
          }}
        />
        <div
          className="absolute top-4 h-12 bg-white/[0.02] pointer-events-none"
          style={{
            left: `${trimEndPct}%`,
            width: `${100 - trimEndPct}%`,
          }}
        />
        <div
          className="absolute top-3 h-14 w-1.5 rounded-full bg-zinc-500 cursor-col-resize hover:bg-zinc-400 transition-colors z-10"
          style={{ left: `${trimStartPct}%`, marginLeft: -3 }}
          onPointerDown={(e) => handlePointerDown(e, "trimStart")}
        />
        <div
          className="absolute top-3 h-14 w-1.5 rounded-full bg-zinc-500 cursor-col-resize hover:bg-zinc-400 transition-colors z-10"
          style={{ left: `${trimEndPct}%`, marginLeft: -3 }}
          onPointerDown={(e) => handlePointerDown(e, "trimEnd")}
        />

        {/* playhead */}
        <div
          className="absolute top-0 h-full w-0.5 bg-indigo-500 z-20"
          style={{ left: `${playheadPct}%` }}
        >
          <div
            className="absolute -top-1 -left-2 h-3 w-4 rounded-sm bg-indigo-500 cursor-grab active:cursor-grabbing"
            onPointerDown={(e) => handlePointerDown(e, "playhead")}
          />
          <span className="absolute -top-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-mono text-indigo-400 bg-[#0c0c0f] px-1 rounded">
            {formatTime(currentTime)}
          </span>
        </div>
      </div>

      {/* ---- transport controls ---- */}
      <div className="flex items-center justify-between px-4 py-2.5">
        <div className="flex items-center gap-1">
          <button
            onClick={() => onSeek(Math.max(0, currentTime - 5))}
            className="flex h-8 w-8 items-center justify-center rounded-md text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.04] transition-colors"
            title="Back 5s"
          >
            <SkipBack className="h-4 w-4" />
          </button>

          <button
            onClick={() => (isPlaying ? onPause() : onPlay())}
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 transition-colors"
          >
            {isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4 ml-0.5" />
            )}
          </button>

          <button
            onClick={() => onSeek(Math.min(effectiveDuration, currentTime + 5))}
            className="flex h-8 w-8 items-center justify-center rounded-md text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.04] transition-colors"
            title="Forward 5s"
          >
            <SkipForward className="h-4 w-4" />
          </button>
        </div>

        {/* time display */}
        <div className="font-mono text-xs text-zinc-500">
          <span className="text-zinc-300">{formatTime(currentTime)}</span>
          <span className="mx-1.5">/</span>
          <span>{formatTime(effectiveDuration)}</span>
        </div>

        {/* speed selector */}
        <div className="relative">
          <button
            onClick={() => setShowSpeedMenu(!showSpeedMenu)}
            className="flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.04] transition-colors"
          >
            {speed}x
            <ChevronDown className="h-3 w-3" />
          </button>

          {showSpeedMenu && (
            <div className="absolute bottom-full right-0 mb-1 rounded-lg border border-white/[0.06] bg-[#111114] p-1 shadow-xl z-50">
              {SPEED_OPTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setSpeed(s);
                    setShowSpeedMenu(false);
                    const v = document.querySelector("video");
                    if (v) v.playbackRate = s;
                  }}
                  className={cn(
                    "block w-full rounded-md px-3 py-1.5 text-left text-xs transition-colors",
                    s === speed
                      ? "bg-indigo-600/20 text-indigo-400"
                      : "text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-200",
                  )}
                >
                  {s}x
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
