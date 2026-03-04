"use client";

import { useCallback } from "react";
import { Palette, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BackgroundConfig } from "@/hooks/useProject";

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

interface BackgroundPickerProps {
  config: BackgroundConfig;
  onChange: (config: BackgroundConfig) => void;
}

/* ------------------------------------------------------------------ */
/*  Gradient presets                                                    */
/* ------------------------------------------------------------------ */

const GRADIENT_PRESETS: { from: string; to: string; angle: number; label: string }[] = [
  { from: "#6366f1", to: "#8b5cf6", angle: 135, label: "Indigo" },
  { from: "#2563eb", to: "#06b6d4", angle: 135, label: "Ocean" },
  { from: "#ec4899", to: "#f97316", angle: 135, label: "Sunset" },
  { from: "#10b981", to: "#6366f1", angle: 135, label: "Aurora" },
  { from: "#1e1b4b", to: "#312e81", angle: 180, label: "Midnight" },
  { from: "#09090b", to: "#18181b", angle: 180, label: "Carbon" },
  { from: "#7c3aed", to: "#db2777", angle: 135, label: "Violet" },
  { from: "#0ea5e9", to: "#22d3ee", angle: 135, label: "Sky" },
];

const SOLID_PRESETS = [
  "#09090b",
  "#18181b",
  "#1e1b4b",
  "#172554",
  "#1a2e05",
  "#450a0a",
  "#ffffff",
  "#f4f4f5",
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function BackgroundPicker({ config, onChange }: BackgroundPickerProps) {
  const update = useCallback(
    (patch: Partial<BackgroundConfig>) => onChange({ ...config, ...patch }),
    [config, onChange],
  );

  return (
    <div className="flex flex-col gap-5">
      {/* header */}
      <div className="flex items-center gap-2">
        <Palette className="h-4 w-4 text-indigo-400" />
        <h3 className="text-sm font-semibold text-zinc-200">Background</h3>
      </div>

      {/* type selector */}
      <div className="grid grid-cols-3 gap-1">
        {(["gradient", "solid", "custom"] as const).map((type) => (
          <button
            key={type}
            onClick={() => update({ type })}
            className={cn(
              "rounded-md px-2 py-1.5 text-xs font-medium capitalize transition-colors",
              config.type === type
                ? "bg-indigo-600/20 text-indigo-400 ring-1 ring-indigo-500/30"
                : "bg-white/[0.03] text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.06]",
            )}
          >
            {type}
          </button>
        ))}
      </div>

      {/* gradient presets */}
      {config.type === "gradient" && (
        <div>
          <span className="mb-2 block text-xs text-zinc-500">Presets</span>
          <div className="grid grid-cols-4 gap-1.5">
            {GRADIENT_PRESETS.map((preset) => (
              <button
                key={preset.label}
                onClick={() =>
                  update({
                    gradient: { from: preset.from, to: preset.to, angle: preset.angle },
                  })
                }
                className={cn(
                  "group relative h-10 rounded-lg border transition-all overflow-hidden",
                  config.gradient.from === preset.from && config.gradient.to === preset.to
                    ? "border-indigo-500/50 ring-1 ring-indigo-500/20"
                    : "border-white/[0.06] hover:border-white/[0.12]",
                )}
                style={{
                  background: `linear-gradient(${preset.angle}deg, ${preset.from}, ${preset.to})`,
                }}
                title={preset.label}
              />
            ))}
          </div>

          {/* gradient color pickers */}
          <div className="mt-3 flex gap-3">
            <div className="flex-1">
              <span className="mb-1 block text-[10px] text-zinc-600">From</span>
              <div className="flex items-center gap-2 rounded-md border border-white/[0.06] bg-white/[0.02] px-2 py-1.5">
                <input
                  type="color"
                  value={config.gradient.from}
                  onChange={(e) =>
                    update({
                      gradient: { ...config.gradient, from: e.target.value },
                    })
                  }
                  className="h-5 w-5 cursor-pointer rounded border-0 bg-transparent p-0"
                />
                <span className="text-[11px] font-mono text-zinc-400">
                  {config.gradient.from}
                </span>
              </div>
            </div>
            <div className="flex-1">
              <span className="mb-1 block text-[10px] text-zinc-600">To</span>
              <div className="flex items-center gap-2 rounded-md border border-white/[0.06] bg-white/[0.02] px-2 py-1.5">
                <input
                  type="color"
                  value={config.gradient.to}
                  onChange={(e) =>
                    update({
                      gradient: { ...config.gradient, to: e.target.value },
                    })
                  }
                  className="h-5 w-5 cursor-pointer rounded border-0 bg-transparent p-0"
                />
                <span className="text-[11px] font-mono text-zinc-400">
                  {config.gradient.to}
                </span>
              </div>
            </div>
          </div>

          {/* angle */}
          <div className="mt-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-zinc-600">Angle</span>
              <span className="text-[10px] font-mono text-zinc-500">{config.gradient.angle}deg</span>
            </div>
            <input
              type="range"
              min={0}
              max={360}
              step={15}
              value={config.gradient.angle}
              onChange={(e) =>
                update({
                  gradient: { ...config.gradient, angle: parseInt(e.target.value) },
                })
              }
              className="w-full accent-indigo-500 h-1 bg-zinc-800 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-indigo-500 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#0c0c0f] [&::-webkit-slider-thumb]:cursor-pointer"
            />
          </div>
        </div>
      )}

      {/* solid presets */}
      {config.type === "solid" && (
        <div>
          <span className="mb-2 block text-xs text-zinc-500">Color</span>
          <div className="grid grid-cols-4 gap-1.5">
            {SOLID_PRESETS.map((color) => (
              <button
                key={color}
                onClick={() => update({ color })}
                className={cn(
                  "h-10 rounded-lg border transition-all",
                  config.color === color
                    ? "border-indigo-500/50 ring-1 ring-indigo-500/20"
                    : "border-white/[0.06] hover:border-white/[0.12]",
                )}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
          <div className="mt-3 flex items-center gap-2 rounded-md border border-white/[0.06] bg-white/[0.02] px-2 py-1.5">
            <input
              type="color"
              value={config.color}
              onChange={(e) => update({ color: e.target.value })}
              className="h-5 w-5 cursor-pointer rounded border-0 bg-transparent p-0"
            />
            <span className="text-[11px] font-mono text-zinc-400">{config.color}</span>
          </div>
        </div>
      )}

      {/* padding */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-zinc-500">Padding</span>
          <span className="text-xs font-mono text-zinc-400">{config.padding}px</span>
        </div>
        <input
          type="range"
          min={0}
          max={120}
          step={4}
          value={config.padding}
          onChange={(e) => update({ padding: parseInt(e.target.value) })}
          className="w-full accent-indigo-500 h-1 bg-zinc-800 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-indigo-500 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#0c0c0f] [&::-webkit-slider-thumb]:cursor-pointer"
        />
      </div>

      {/* corner radius */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-zinc-500">Corner radius</span>
          <span className="text-xs font-mono text-zinc-400">{config.borderRadius}px</span>
        </div>
        <input
          type="range"
          min={0}
          max={48}
          step={2}
          value={config.borderRadius}
          onChange={(e) => update({ borderRadius: parseInt(e.target.value) })}
          className="w-full accent-indigo-500 h-1 bg-zinc-800 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-indigo-500 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#0c0c0f] [&::-webkit-slider-thumb]:cursor-pointer"
        />
      </div>

      {/* shadow */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Sun className="h-3 w-3 text-zinc-600" />
          <span className="text-xs text-zinc-500">Shadow</span>
        </div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] text-zinc-600">Blur</span>
          <span className="text-[10px] font-mono text-zinc-500">{config.shadow.blur}px</span>
        </div>
        <input
          type="range"
          min={0}
          max={80}
          step={2}
          value={config.shadow.blur}
          onChange={(e) =>
            update({ shadow: { ...config.shadow, blur: parseInt(e.target.value) } })
          }
          className="w-full accent-indigo-500 h-1 bg-zinc-800 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-indigo-500 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#0c0c0f] [&::-webkit-slider-thumb]:cursor-pointer"
        />
      </div>
    </div>
  );
}
