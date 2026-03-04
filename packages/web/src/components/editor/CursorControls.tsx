"use client";

import { useCallback } from "react";
import { MousePointer2, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CursorConfig } from "@/hooks/useProject";

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

interface CursorControlsProps {
  config: CursorConfig;
  onChange: (config: CursorConfig) => void;
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const SMOOTHING_OPTIONS: { value: CursorConfig["smoothing"]; label: string }[] = [
  { value: "off", label: "Off" },
  { value: "gentle", label: "Gentle" },
  { value: "smooth", label: "Smooth" },
  { value: "cinematic", label: "Cinematic" },
];

const STYLE_OPTIONS: { value: CursorConfig["style"]; label: string; preview: string }[] = [
  { value: "macos", label: "macOS", preview: "cursor-default" },
  { value: "windows", label: "Windows", preview: "cursor-default" },
  { value: "custom", label: "Custom", preview: "cursor-crosshair" },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function CursorControls({ config, onChange }: CursorControlsProps) {
  const update = useCallback(
    (patch: Partial<CursorConfig>) => onChange({ ...config, ...patch }),
    [config, onChange],
  );

  return (
    <div className="flex flex-col gap-5">
      {/* header */}
      <div className="flex items-center gap-2">
        <MousePointer2 className="h-4 w-4 text-violet-400" />
        <h3 className="text-sm font-semibold text-zinc-200">Cursor</h3>
      </div>

      {/* smoothing */}
      <div>
        <span className="mb-2 block text-xs text-zinc-500">Smoothing</span>
        <div className="grid grid-cols-4 gap-1">
          {SMOOTHING_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => update({ smoothing: opt.value })}
              className={cn(
                "rounded-md px-1.5 py-1.5 text-[11px] font-medium transition-colors text-center",
                config.smoothing === opt.value
                  ? "bg-violet-600/20 text-violet-400 ring-1 ring-violet-500/30"
                  : "bg-white/[0.03] text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.06]",
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* size */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs text-zinc-500">Size</span>
          <span className="text-xs font-mono text-zinc-400">{config.size.toFixed(1)}x</span>
        </div>
        <input
          type="range"
          min={0.8}
          max={2.5}
          step={0.1}
          value={config.size}
          onChange={(e) => update({ size: parseFloat(e.target.value) })}
          className="w-full accent-violet-500 h-1 bg-zinc-800 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-violet-500 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#0c0c0f] [&::-webkit-slider-thumb]:cursor-pointer"
        />
      </div>

      {/* style */}
      <div>
        <span className="mb-2 block text-xs text-zinc-500">Style</span>
        <div className="grid grid-cols-3 gap-1.5">
          {STYLE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => update({ style: opt.value })}
              className={cn(
                "flex flex-col items-center gap-1.5 rounded-lg border py-3 px-2 transition-colors",
                config.style === opt.value
                  ? "border-violet-500/40 bg-violet-600/10"
                  : "border-white/[0.04] bg-white/[0.02] hover:border-white/[0.08] hover:bg-white/[0.04]",
              )}
            >
              <MousePointer2
                className={cn(
                  "h-5 w-5",
                  config.style === opt.value ? "text-violet-400" : "text-zinc-600",
                )}
              />
              <span
                className={cn(
                  "text-[10px] font-medium",
                  config.style === opt.value ? "text-violet-400" : "text-zinc-500",
                )}
              >
                {opt.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* click effects */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-zinc-400">Click effects</span>
        <button
          onClick={() => update({ clickEffects: !config.clickEffects })}
          className={cn(
            "relative h-5 w-9 rounded-full transition-colors",
            config.clickEffects ? "bg-violet-600" : "bg-zinc-700",
          )}
        >
          <span
            className={cn(
              "absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform",
              config.clickEffects ? "left-[18px]" : "left-0.5",
            )}
          />
        </button>
      </div>

      {/* auto-hide */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {config.autoHide ? (
            <EyeOff className="h-3.5 w-3.5 text-zinc-500" />
          ) : (
            <Eye className="h-3.5 w-3.5 text-zinc-500" />
          )}
          <span className="text-xs text-zinc-400">Auto-hide when idle</span>
        </div>
        <button
          onClick={() => update({ autoHide: !config.autoHide })}
          className={cn(
            "relative h-5 w-9 rounded-full transition-colors",
            config.autoHide ? "bg-violet-600" : "bg-zinc-700",
          )}
        >
          <span
            className={cn(
              "absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform",
              config.autoHide ? "left-[18px]" : "left-0.5",
            )}
          />
        </button>
      </div>
    </div>
  );
}
