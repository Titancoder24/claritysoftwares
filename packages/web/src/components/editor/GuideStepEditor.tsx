"use client";

import { useCallback } from "react";
import {
  Image,
  Link2,
  Bold,
  Italic,
  List,
  Highlighter,
  Square,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { GuideStep } from "@/hooks/useProject";

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

interface GuideStepEditorProps {
  step: GuideStep | null;
  onUpdate: (id: string, patch: Partial<GuideStep>) => void;
  onLinkToTimestamp: (stepId: string) => void;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function GuideStepEditor({
  step,
  onUpdate,
  onLinkToTimestamp,
}: GuideStepEditorProps) {
  const update = useCallback(
    (patch: Partial<GuideStep>) => {
      if (step) onUpdate(step.id, patch);
    },
    [step, onUpdate],
  );

  if (!step) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-white/[0.03] border border-white/[0.06]">
            <Image className="h-6 w-6 text-zinc-700" />
          </div>
          <p className="text-sm text-zinc-600">Select a step to edit</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      {/* screenshot preview */}
      <div className="relative mx-6 mt-6 aspect-video rounded-xl bg-zinc-900 border border-white/[0.04] overflow-hidden">
        {step.screenshotUrl ? (
          <>
            <img
              src={step.screenshotUrl}
              alt=""
              className="h-full w-full object-contain"
            />
            {/* highlight overlay */}
            {step.highlightRect && (
              <div
                className="absolute border-2 border-indigo-500 rounded-md bg-indigo-500/10 pointer-events-none"
                style={{
                  left: `${step.highlightRect.x}%`,
                  top: `${step.highlightRect.y}%`,
                  width: `${step.highlightRect.w}%`,
                  height: `${step.highlightRect.h}%`,
                }}
              />
            )}
          </>
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2">
            <Image className="h-8 w-8 text-zinc-800" />
            <span className="text-xs text-zinc-700">No screenshot</span>
          </div>
        )}

        {/* screenshot annotation tools */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1 rounded-lg bg-[#111114]/90 border border-white/[0.08] px-2 py-1.5">
          <button className="flex h-6 w-6 items-center justify-center rounded text-zinc-500 hover:text-indigo-400 hover:bg-white/[0.06] transition-colors" title="Highlight area">
            <Highlighter className="h-3.5 w-3.5" />
          </button>
          <button className="flex h-6 w-6 items-center justify-center rounded text-zinc-500 hover:text-indigo-400 hover:bg-white/[0.06] transition-colors" title="Draw box">
            <Square className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* step editor content */}
      <div className="flex flex-col gap-4 p-6">
        {/* title */}
        <div>
          <label className="mb-1.5 block text-xs text-zinc-500">Step title</label>
          <input
            value={step.title}
            onChange={(e) => update({ title: e.target.value })}
            placeholder="e.g. Click the Settings icon"
            className="w-full rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-700 outline-none focus:border-indigo-500/40 transition-colors"
          />
        </div>

        {/* description - rich text editor */}
        <div>
          <label className="mb-1.5 block text-xs text-zinc-500">Description</label>
          {/* mini toolbar */}
          <div className="flex items-center gap-0.5 rounded-t-lg border border-b-0 border-white/[0.06] bg-white/[0.02] px-2 py-1.5">
            <button className="flex h-6 w-6 items-center justify-center rounded text-zinc-600 hover:text-zinc-300 hover:bg-white/[0.06] transition-colors">
              <Bold className="h-3.5 w-3.5" />
            </button>
            <button className="flex h-6 w-6 items-center justify-center rounded text-zinc-600 hover:text-zinc-300 hover:bg-white/[0.06] transition-colors">
              <Italic className="h-3.5 w-3.5" />
            </button>
            <button className="flex h-6 w-6 items-center justify-center rounded text-zinc-600 hover:text-zinc-300 hover:bg-white/[0.06] transition-colors">
              <List className="h-3.5 w-3.5" />
            </button>
            <div className="mx-1 h-4 w-px bg-white/[0.06]" />
            <button className="flex h-6 w-6 items-center justify-center rounded text-zinc-600 hover:text-zinc-300 hover:bg-white/[0.06] transition-colors">
              <Link2 className="h-3.5 w-3.5" />
            </button>
          </div>
          <textarea
            value={step.description}
            onChange={(e) => update({ description: e.target.value })}
            placeholder="Describe what the user should do..."
            rows={5}
            className="w-full rounded-b-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2.5 text-sm text-zinc-300 placeholder:text-zinc-700 outline-none focus:border-indigo-500/40 transition-colors resize-none"
          />
        </div>

        {/* link to timestamp */}
        <button
          onClick={() => onLinkToTimestamp(step.id)}
          className="flex items-center justify-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.02] py-2.5 text-xs text-zinc-500 hover:text-indigo-400 hover:border-indigo-500/20 hover:bg-indigo-600/5 transition-colors"
        >
          <Link2 className="h-3.5 w-3.5" />
          Link to video timestamp
        </button>

        {/* element selector */}
        {step.highlightSelector !== undefined && (
          <div>
            <label className="mb-1.5 block text-xs text-zinc-500">Element selector</label>
            <input
              value={step.highlightSelector ?? ""}
              onChange={(e) => update({ highlightSelector: e.target.value })}
              placeholder='e.g. button[data-testid="settings"]'
              className="w-full rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2 text-xs font-mono text-zinc-300 placeholder:text-zinc-700 outline-none focus:border-indigo-500/40 transition-colors"
            />
          </div>
        )}
      </div>
    </div>
  );
}
