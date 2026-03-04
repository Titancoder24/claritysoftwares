"use client";

import { useCallback } from "react";
import {
  ZoomIn,
  Trash2,
  Pencil,
  Sparkles,
  MousePointerClick,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { ZoomConfig, ZoomKeyframe } from "@/hooks/useProject";

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

interface ZoomControlsProps {
  config: ZoomConfig;
  keyframes: ZoomKeyframe[];
  onConfigChange: (config: ZoomConfig) => void;
  onKeyframeDelete: (id: string) => void;
  onKeyframeEdit: (id: string) => void;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const EASING_OPTIONS: { value: ZoomConfig["easing"]; label: string }[] = [
  { value: "spring", label: "Spring" },
  { value: "smooth", label: "Smooth" },
  { value: "linear", label: "Linear" },
];

function formatTime(s: number) {
  return `${Math.floor(s / 60)}:${Math.floor(s % 60)
    .toString()
    .padStart(2, "0")}`;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function ZoomControls({
  config,
  keyframes,
  onConfigChange,
  onKeyframeDelete,
  onKeyframeEdit,
}: ZoomControlsProps) {
  const update = useCallback(
    (patch: Partial<ZoomConfig>) => onConfigChange({ ...config, ...patch }),
    [config, onConfigChange],
  );

  return (
    <div className="flex flex-col gap-5">
      {/* header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ZoomIn className="h-4 w-4 text-indigo-400" />
          <h3 className="text-sm font-semibold text-zinc-200">Zoom</h3>
        </div>
        <button
          onClick={() => update({ enabled: !config.enabled })}
          className={cn(
            "relative h-5 w-9 rounded-full transition-colors",
            config.enabled ? "bg-indigo-600" : "bg-zinc-700",
          )}
        >
          <span
            className={cn(
              "absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform",
              config.enabled ? "left-[18px]" : "left-0.5",
            )}
          />
        </button>
      </div>

      {config.enabled && (
        <>
          {/* intensity */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs text-zinc-500">Intensity</span>
              <span className="text-xs font-mono text-zinc-400">
                {config.intensity.toFixed(1)}x
              </span>
            </div>
            <input
              type="range"
              min={1.2}
              max={3.5}
              step={0.1}
              value={config.intensity}
              onChange={(e) => update({ intensity: parseFloat(e.target.value) })}
              className="w-full accent-indigo-500 h-1 bg-zinc-800 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-indigo-500 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#0c0c0f] [&::-webkit-slider-thumb]:cursor-pointer"
            />
          </div>

          {/* easing */}
          <div>
            <span className="mb-2 block text-xs text-zinc-500">Easing</span>
            <div className="grid grid-cols-3 gap-1">
              {EASING_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => update({ easing: opt.value })}
                  className={cn(
                    "rounded-md px-2 py-1.5 text-xs font-medium transition-colors",
                    config.easing === opt.value
                      ? "bg-indigo-600/20 text-indigo-400 ring-1 ring-indigo-500/30"
                      : "bg-white/[0.03] text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.06]",
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* auto-zoom */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MousePointerClick className="h-3.5 w-3.5 text-zinc-500" />
              <span className="text-xs text-zinc-400">Auto-zoom on clicks</span>
            </div>
            <button
              onClick={() => update({ autoZoom: !config.autoZoom })}
              className={cn(
                "relative h-5 w-9 rounded-full transition-colors",
                config.autoZoom ? "bg-indigo-600" : "bg-zinc-700",
              )}
            >
              <span
                className={cn(
                  "absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform",
                  config.autoZoom ? "left-[18px]" : "left-0.5",
                )}
              />
            </button>
          </div>

          {/* keyframe list */}
          {keyframes.length > 0 && (
            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs text-zinc-500">Keyframes</span>
                <span className="text-[10px] text-zinc-600">{keyframes.length}</span>
              </div>
              <div className="flex flex-col gap-1">
                {keyframes.map((kf) => (
                  <div
                    key={kf.id}
                    className="group flex items-center justify-between rounded-lg bg-white/[0.02] border border-white/[0.04] px-3 py-2"
                  >
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-3 w-3 text-indigo-400/60" />
                      <span className="text-xs text-zinc-400 font-mono">
                        {formatTime(kf.startTime)} - {formatTime(kf.endTime)}
                      </span>
                      <span className="text-[10px] text-zinc-600">
                        {kf.scale.toFixed(1)}x
                      </span>
                    </div>
                    <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onKeyframeEdit(kf.id)}
                        className="flex h-6 w-6 items-center justify-center rounded text-zinc-600 hover:text-zinc-300 hover:bg-white/[0.06] transition-colors"
                      >
                        <Pencil className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => onKeyframeDelete(kf.id)}
                        className="flex h-6 w-6 items-center justify-center rounded text-zinc-600 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
