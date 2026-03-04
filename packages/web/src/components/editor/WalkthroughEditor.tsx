"use client";

import { useCallback, useState } from "react";
import {
  Plus,
  Trash2,
  Pencil,
  Check,
  X,
  Play,
  Code,
  Copy,
  GripVertical,
  MousePointerClick,
  Globe,
  MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { WalkthroughStep } from "@/hooks/useProject";

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

interface WalkthroughEditorProps {
  steps: WalkthroughStep[];
  onAdd: () => void;
  onUpdate: (id: string, patch: Partial<WalkthroughStep>) => void;
  onDelete: (id: string) => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
  onPreview: () => void;
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const TOOLTIP_POSITIONS: WalkthroughStep["tooltipPosition"][] = [
  "top",
  "bottom",
  "left",
  "right",
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function WalkthroughEditor({
  steps,
  onAdd,
  onUpdate,
  onDelete,
  onReorder,
  onPreview,
}: WalkthroughEditorProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showEmbed, setShowEmbed] = useState(false);

  const embedCode = `<script src="https://cdn.screenflow.dev/walkthrough.js" data-id="wt_xxxxx"></script>`;

  const handleDragStart = useCallback(
    (e: React.DragEvent, index: number) => {
      e.dataTransfer.setData("text/plain", String(index));
    },
    [],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent, toIndex: number) => {
      e.preventDefault();
      const fromIndex = parseInt(e.dataTransfer.getData("text/plain"), 10);
      if (fromIndex !== toIndex) onReorder(fromIndex, toIndex);
    },
    [onReorder],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 p-6">
      {/* header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-zinc-200">Interactive Walkthrough</h3>
          <p className="mt-0.5 text-sm text-zinc-500">
            Guide users step-by-step through your product
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onPreview}
            className="flex h-8 items-center gap-1.5 rounded-md border border-white/[0.06] bg-white/[0.02] px-3 text-xs font-medium text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04] transition-colors"
          >
            <Play className="h-3.5 w-3.5" />
            Preview
          </button>
          <button
            onClick={() => setShowEmbed(!showEmbed)}
            className="flex h-8 items-center gap-1.5 rounded-md border border-white/[0.06] bg-white/[0.02] px-3 text-xs font-medium text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04] transition-colors"
          >
            <Code className="h-3.5 w-3.5" />
            Embed
          </button>
          <button
            onClick={onAdd}
            className="flex h-8 items-center gap-1.5 rounded-md bg-indigo-600 px-3 text-xs font-medium text-white hover:bg-indigo-500 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Step
          </button>
        </div>
      </div>

      {/* embed code */}
      {showEmbed && (
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-zinc-400">Widget embed code</span>
            <button
              onClick={() => navigator.clipboard.writeText(embedCode)}
              className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              <Copy className="h-3 w-3" />
              Copy
            </button>
          </div>
          <pre className="rounded-lg bg-[#09090b] border border-white/[0.04] p-3 text-xs font-mono text-zinc-400 overflow-x-auto">
            {embedCode}
          </pre>
        </div>
      )}

      {/* step list */}
      <div className="flex flex-col gap-2">
        {steps.map((step, index) => {
          const isEditing = editingId === step.id;

          return (
            <div
              key={step.id}
              draggable={!isEditing}
              onDragStart={(e) => handleDragStart(e, index)}
              onDrop={(e) => handleDrop(e, index)}
              onDragOver={handleDragOver}
              className={cn(
                "rounded-xl border transition-colors",
                isEditing
                  ? "border-indigo-500/30 bg-indigo-600/5"
                  : "border-white/[0.06] bg-white/[0.02] hover:border-white/[0.08]",
              )}
            >
              {/* step row */}
              <div className="flex items-center gap-3 px-4 py-3">
                <div className="flex items-center gap-2 text-zinc-700 cursor-grab active:cursor-grabbing">
                  <GripVertical className="h-4 w-4" />
                </div>

                {/* step number */}
                <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-indigo-600/15 text-xs font-bold text-indigo-400">
                  {index + 1}
                </div>

                {/* content */}
                <div className="flex flex-1 items-center gap-4 min-w-0">
                  <div className="flex-1 min-w-0">
                    {isEditing ? (
                      <input
                        value={step.instruction}
                        onChange={(e) =>
                          onUpdate(step.id, { instruction: e.target.value })
                        }
                        className="w-full rounded-md border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 text-sm text-zinc-200 outline-none focus:border-indigo-500/40"
                        placeholder="Instruction text..."
                        autoFocus
                      />
                    ) : (
                      <span className="text-sm text-zinc-300 truncate block">
                        {step.instruction || "Untitled step"}
                      </span>
                    )}
                  </div>

                  {/* metadata badges */}
                  {!isEditing && (
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <div className="flex items-center gap-1 rounded-md bg-white/[0.03] px-2 py-1" title="CSS Selector">
                        <MousePointerClick className="h-3 w-3 text-zinc-600" />
                        <span className="text-[10px] font-mono text-zinc-500 max-w-[120px] truncate">
                          {step.cssSelector || "none"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 rounded-md bg-white/[0.03] px-2 py-1" title="URL">
                        <Globe className="h-3 w-3 text-zinc-600" />
                        <span className="text-[10px] font-mono text-zinc-500 max-w-[100px] truncate">
                          {step.url || "/"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 rounded-md bg-white/[0.03] px-2 py-1" title="Tooltip position">
                        <MessageSquare className="h-3 w-3 text-zinc-600" />
                        <span className="text-[10px] text-zinc-500 capitalize">
                          {step.tooltipPosition}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* actions */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  {isEditing ? (
                    <>
                      <button
                        onClick={() => setEditingId(null)}
                        className="flex h-7 w-7 items-center justify-center rounded-md bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/30 transition-colors"
                      >
                        <Check className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="flex h-7 w-7 items-center justify-center rounded-md text-zinc-600 hover:text-zinc-400 hover:bg-white/[0.04] transition-colors"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => setEditingId(step.id)}
                        className="flex h-7 w-7 items-center justify-center rounded-md text-zinc-600 hover:text-zinc-300 hover:bg-white/[0.04] transition-colors"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => onDelete(step.id)}
                        className="flex h-7 w-7 items-center justify-center rounded-md text-zinc-600 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* expanded edit panel */}
              {isEditing && (
                <div className="border-t border-white/[0.04] px-4 py-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="mb-1.5 block text-xs text-zinc-500">CSS Selector</label>
                      <input
                        value={step.cssSelector}
                        onChange={(e) =>
                          onUpdate(step.id, { cssSelector: e.target.value })
                        }
                        placeholder='e.g. #signup-btn, .nav-link'
                        className="w-full rounded-md border border-white/[0.06] bg-white/[0.03] px-2.5 py-1.5 text-xs font-mono text-zinc-300 placeholder:text-zinc-700 outline-none focus:border-indigo-500/40 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs text-zinc-500">Page URL</label>
                      <input
                        value={step.url}
                        onChange={(e) =>
                          onUpdate(step.id, { url: e.target.value })
                        }
                        placeholder="https://app.example.com/dashboard"
                        className="w-full rounded-md border border-white/[0.06] bg-white/[0.03] px-2.5 py-1.5 text-xs font-mono text-zinc-300 placeholder:text-zinc-700 outline-none focus:border-indigo-500/40 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs text-zinc-500">
                        Tooltip position
                      </label>
                      <div className="grid grid-cols-4 gap-1">
                        {TOOLTIP_POSITIONS.map((pos) => (
                          <button
                            key={pos}
                            onClick={() => onUpdate(step.id, { tooltipPosition: pos })}
                            className={cn(
                              "rounded-md py-1.5 text-[11px] font-medium capitalize transition-colors",
                              step.tooltipPosition === pos
                                ? "bg-indigo-600/20 text-indigo-400 ring-1 ring-indigo-500/30"
                                : "bg-white/[0.03] text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.06]",
                            )}
                          >
                            {pos}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* empty state */}
      {steps.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-white/[0.08] py-16">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/[0.03] border border-white/[0.06]">
            <MousePointerClick className="h-6 w-6 text-zinc-700" />
          </div>
          <div className="text-center">
            <p className="text-sm text-zinc-400">No walkthrough steps yet</p>
            <p className="mt-1 text-xs text-zinc-600">
              Add steps to create an interactive product tour
            </p>
          </div>
          <button
            onClick={onAdd}
            className="mt-2 flex h-8 items-center gap-1.5 rounded-md bg-indigo-600 px-3 text-xs font-medium text-white hover:bg-indigo-500 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            Add first step
          </button>
        </div>
      )}
    </div>
  );
}
