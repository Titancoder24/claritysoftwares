"use client";

import { useCallback } from "react";
import { GripVertical, Plus, Trash2, Clock, Image } from "lucide-react";
import { cn } from "@/lib/utils";
import type { GuideStep } from "@/hooks/useProject";

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

interface GuideStepListProps {
  steps: GuideStep[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onAdd: () => void;
  onDelete: (id: string) => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
}

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

export function GuideStepList({
  steps,
  selectedId,
  onSelect,
  onAdd,
  onDelete,
  onReorder,
}: GuideStepListProps) {
  const handleDragStart = useCallback(
    (e: React.DragEvent, index: number) => {
      e.dataTransfer.setData("text/plain", String(index));
      e.dataTransfer.effectAllowed = "move";
    },
    [],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent, toIndex: number) => {
      e.preventDefault();
      const fromIndex = parseInt(e.dataTransfer.getData("text/plain"), 10);
      if (fromIndex !== toIndex) {
        onReorder(fromIndex, toIndex);
      }
    },
    [onReorder],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);

  return (
    <div className="flex h-full flex-col">
      {/* header */}
      <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
        <h3 className="text-sm font-semibold text-zinc-200">Steps</h3>
        <button
          onClick={onAdd}
          className="flex h-7 items-center gap-1.5 rounded-md bg-indigo-600 px-2.5 text-xs font-medium text-white hover:bg-indigo-500 transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          Add
        </button>
      </div>

      {/* step list */}
      <div className="flex-1 overflow-y-auto p-2">
        <div className="flex flex-col gap-1">
          {steps.map((step, index) => (
            <div
              key={step.id}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDrop={(e) => handleDrop(e, index)}
              onDragOver={handleDragOver}
              onClick={() => onSelect(step.id)}
              className={cn(
                "group flex gap-3 rounded-lg border p-2.5 cursor-pointer transition-colors",
                step.id === selectedId
                  ? "border-indigo-500/30 bg-indigo-600/8"
                  : "border-white/[0.04] bg-white/[0.01] hover:border-white/[0.08] hover:bg-white/[0.03]",
              )}
            >
              {/* drag handle */}
              <div className="flex items-center pt-0.5 cursor-grab active:cursor-grabbing text-zinc-700 group-hover:text-zinc-500 transition-colors">
                <GripVertical className="h-4 w-4" />
              </div>

              {/* thumbnail */}
              <div className="relative h-14 w-20 flex-shrink-0 rounded-md bg-zinc-900 border border-white/[0.04] overflow-hidden">
                {step.screenshotUrl ? (
                  <img
                    src={step.screenshotUrl}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <Image className="h-4 w-4 text-zinc-800" />
                  </div>
                )}
                {/* step number badge */}
                <div className="absolute top-1 left-1 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-[9px] font-bold text-white">
                  {index + 1}
                </div>
              </div>

              {/* content */}
              <div className="flex flex-1 flex-col gap-0.5 min-w-0">
                <span className="text-xs font-medium text-zinc-300 truncate">
                  {step.title || "Untitled step"}
                </span>
                <span className="text-[11px] text-zinc-600 line-clamp-2">
                  {step.description || "No description"}
                </span>
                <div className="mt-auto flex items-center gap-1">
                  <Clock className="h-2.5 w-2.5 text-zinc-700" />
                  <span className="text-[9px] font-mono text-zinc-600">
                    {formatTime(step.timestamp)}
                  </span>
                </div>
              </div>

              {/* delete */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(step.id);
                }}
                className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded text-zinc-700 opacity-0 group-hover:opacity-100 hover:text-red-400 hover:bg-red-500/10 transition-all self-start mt-0.5"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>

        {/* empty state */}
        {steps.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-2 py-12">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/[0.03] border border-white/[0.06]">
              <Plus className="h-5 w-5 text-zinc-700" />
            </div>
            <span className="text-xs text-zinc-600">No steps yet</span>
            <button
              onClick={onAdd}
              className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              Add your first step
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
