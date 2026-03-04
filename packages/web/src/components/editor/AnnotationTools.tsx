"use client";

import { useCallback, useState } from "react";
import {
  Type,
  Square,
  ArrowUpRight,
  Sparkles,
  CircleDot,
  Trash2,
  Plus,
  Clock,
  Move,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Annotation } from "@/hooks/useProject";

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

interface AnnotationToolsProps {
  annotations: Annotation[];
  currentTime: number;
  duration: number;
  onAdd: (type: Annotation["type"]) => void;
  onUpdate: (id: string, patch: Partial<Annotation>) => void;
  onDelete: (id: string) => void;
}

/* ------------------------------------------------------------------ */
/*  Tool definitions                                                   */
/* ------------------------------------------------------------------ */

const TOOLS: { type: Annotation["type"]; icon: React.ElementType; label: string }[] = [
  { type: "text", icon: Type, label: "Text" },
  { type: "blur", icon: Square, label: "Blur" },
  { type: "spotlight", icon: CircleDot, label: "Spotlight" },
  { type: "arrow", icon: ArrowUpRight, label: "Arrow" },
  { type: "shape", icon: Square, label: "Shape" },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function formatTime(s: number) {
  return `${Math.floor(s / 60)}:${Math.floor(s % 60)
    .toString()
    .padStart(2, "0")}`;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function AnnotationTools({
  annotations,
  currentTime,
  duration,
  onAdd,
  onUpdate,
  onDelete,
}: AnnotationToolsProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = annotations.find((a) => a.id === selectedId) ?? null;

  const updateSelected = useCallback(
    (patch: Partial<Annotation>) => {
      if (selectedId) onUpdate(selectedId, patch);
    },
    [selectedId, onUpdate],
  );

  return (
    <div className="flex flex-col gap-5">
      {/* header */}
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-indigo-400" />
        <h3 className="text-sm font-semibold text-zinc-200">Annotations</h3>
      </div>

      {/* add tools */}
      <div className="grid grid-cols-5 gap-1">
        {TOOLS.map(({ type, icon: Icon, label }) => (
          <button
            key={type}
            onClick={() => onAdd(type)}
            className="flex flex-col items-center gap-1 rounded-lg border border-white/[0.04] bg-white/[0.02] py-2.5 text-zinc-500 hover:text-indigo-400 hover:border-indigo-500/20 hover:bg-indigo-600/5 transition-colors"
          >
            <Icon className="h-4 w-4" />
            <span className="text-[9px] font-medium">{label}</span>
          </button>
        ))}
      </div>

      {/* annotation list */}
      {annotations.length > 0 && (
        <div className="flex flex-col gap-1">
          <span className="text-xs text-zinc-500 mb-1">Active</span>
          {annotations.map((ann) => {
            const isVisible = currentTime >= ann.startTime && currentTime <= ann.endTime;
            return (
              <button
                key={ann.id}
                onClick={() => setSelectedId(ann.id === selectedId ? null : ann.id)}
                className={cn(
                  "group flex items-center justify-between rounded-lg border px-3 py-2 text-left transition-colors",
                  ann.id === selectedId
                    ? "border-indigo-500/30 bg-indigo-600/10"
                    : "border-white/[0.04] bg-white/[0.02] hover:border-white/[0.08]",
                )}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "h-1.5 w-1.5 rounded-full",
                      isVisible ? "bg-green-500" : "bg-zinc-600",
                    )}
                  />
                  <span className="text-xs text-zinc-300 capitalize">{ann.type}</span>
                  <span className="text-[10px] text-zinc-600 font-mono">
                    {formatTime(ann.startTime)}-{formatTime(ann.endTime)}
                  </span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(ann.id);
                  }}
                  className="flex h-5 w-5 items-center justify-center rounded text-zinc-700 opacity-0 group-hover:opacity-100 hover:text-red-400 transition-all"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </button>
            );
          })}
        </div>
      )}

      {/* selected annotation editor */}
      {selected && (
        <div className="flex flex-col gap-3 rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
          <span className="text-xs font-medium text-zinc-300 capitalize">
            Edit {selected.type}
          </span>

          {/* content (text only) */}
          {selected.type === "text" && (
            <div>
              <span className="text-[10px] text-zinc-600 mb-1 block">Content</span>
              <input
                value={selected.content}
                onChange={(e) => updateSelected({ content: e.target.value })}
                className="w-full rounded-md border border-white/[0.06] bg-white/[0.03] px-2.5 py-1.5 text-xs text-zinc-200 placeholder:text-zinc-600 outline-none focus:border-indigo-500/40 transition-colors"
                placeholder="Annotation text..."
              />
            </div>
          )}

          {/* position */}
          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <Move className="h-3 w-3 text-zinc-600" />
              <span className="text-[10px] text-zinc-600">Position</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-[9px] text-zinc-700 mb-0.5 block">X</span>
                <input
                  type="number"
                  min={0}
                  max={1}
                  step={0.01}
                  value={selected.x}
                  onChange={(e) => updateSelected({ x: parseFloat(e.target.value) })}
                  className="w-full rounded-md border border-white/[0.06] bg-white/[0.03] px-2 py-1 text-[11px] font-mono text-zinc-300 outline-none focus:border-indigo-500/40 transition-colors"
                />
              </div>
              <div>
                <span className="text-[9px] text-zinc-700 mb-0.5 block">Y</span>
                <input
                  type="number"
                  min={0}
                  max={1}
                  step={0.01}
                  value={selected.y}
                  onChange={(e) => updateSelected({ y: parseFloat(e.target.value) })}
                  className="w-full rounded-md border border-white/[0.06] bg-white/[0.03] px-2 py-1 text-[11px] font-mono text-zinc-300 outline-none focus:border-indigo-500/40 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* size */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-[9px] text-zinc-700 mb-0.5 block">Width</span>
              <input
                type="number"
                min={0.01}
                max={1}
                step={0.01}
                value={selected.width}
                onChange={(e) => updateSelected({ width: parseFloat(e.target.value) })}
                className="w-full rounded-md border border-white/[0.06] bg-white/[0.03] px-2 py-1 text-[11px] font-mono text-zinc-300 outline-none focus:border-indigo-500/40 transition-colors"
              />
            </div>
            <div>
              <span className="text-[9px] text-zinc-700 mb-0.5 block">Height</span>
              <input
                type="number"
                min={0.01}
                max={1}
                step={0.01}
                value={selected.height}
                onChange={(e) => updateSelected({ height: parseFloat(e.target.value) })}
                className="w-full rounded-md border border-white/[0.06] bg-white/[0.03] px-2 py-1 text-[11px] font-mono text-zinc-300 outline-none focus:border-indigo-500/40 transition-colors"
              />
            </div>
          </div>

          {/* timing */}
          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <Clock className="h-3 w-3 text-zinc-600" />
              <span className="text-[10px] text-zinc-600">Timing</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-[9px] text-zinc-700 mb-0.5 block">Start</span>
                <input
                  type="number"
                  min={0}
                  max={duration}
                  step={0.1}
                  value={selected.startTime}
                  onChange={(e) => updateSelected({ startTime: parseFloat(e.target.value) })}
                  className="w-full rounded-md border border-white/[0.06] bg-white/[0.03] px-2 py-1 text-[11px] font-mono text-zinc-300 outline-none focus:border-indigo-500/40 transition-colors"
                />
              </div>
              <div>
                <span className="text-[9px] text-zinc-700 mb-0.5 block">End</span>
                <input
                  type="number"
                  min={0}
                  max={duration}
                  step={0.1}
                  value={selected.endTime}
                  onChange={(e) => updateSelected({ endTime: parseFloat(e.target.value) })}
                  className="w-full rounded-md border border-white/[0.06] bg-white/[0.03] px-2 py-1 text-[11px] font-mono text-zinc-300 outline-none focus:border-indigo-500/40 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* color (for applicable types) */}
          {(selected.type === "text" || selected.type === "arrow" || selected.type === "shape") && (
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-zinc-600">Color</span>
              <input
                type="color"
                value={String(selected.style.color ?? "#6366f1")}
                onChange={(e) =>
                  updateSelected({ style: { ...selected.style, color: e.target.value } })
                }
                className="h-6 w-6 cursor-pointer rounded border-0 bg-transparent p-0"
              />
            </div>
          )}
        </div>
      )}

      {/* empty state */}
      {annotations.length === 0 && (
        <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-white/[0.06] py-6">
          <Plus className="h-5 w-5 text-zinc-700" />
          <span className="text-xs text-zinc-600">Add an annotation above</span>
        </div>
      )}
    </div>
  );
}
