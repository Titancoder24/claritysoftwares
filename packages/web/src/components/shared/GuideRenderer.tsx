"use client";

import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  MousePointer2,
  CheckCircle2,
  Circle,
  Clock,
  Maximize2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface GuideStep {
  id: string;
  number: number;
  title: string;
  description: string;
  screenshotUrl?: string;
  highlightArea?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  elementLabel?: string;
  videoTimestamp?: number;
}

interface GuideRendererProps {
  title?: string;
  steps?: GuideStep[];
  onVideoTimestamp?: (timestamp: number) => void;
  className?: string;
}

const mockSteps: GuideStep[] = [
  {
    id: "s1",
    number: 1,
    title: "Open the Dashboard",
    description:
      'Navigate to your project dashboard by clicking the "Dashboard" link in the main navigation bar. This will take you to the overview page where you can see all your projects.',
    highlightArea: { x: 15, y: 5, width: 12, height: 5 },
    elementLabel: "Dashboard Link",
    videoTimestamp: 0,
  },
  {
    id: "s2",
    number: 2,
    title: "Click New Recording",
    description:
      'In the top-right corner of the dashboard, locate and click the "New Recording" button. This will open the recording setup dialog where you can configure your recording preferences.',
    highlightArea: { x: 78, y: 5, width: 16, height: 5 },
    elementLabel: "New Recording Button",
    videoTimestamp: 12,
  },
  {
    id: "s3",
    number: 3,
    title: "Select Recording Area",
    description:
      "Choose whether you want to record the full screen, a specific application window, or a custom area. Click on your preferred option to highlight it.",
    highlightArea: { x: 30, y: 35, width: 40, height: 20 },
    elementLabel: "Recording Area Selector",
    videoTimestamp: 28,
  },
  {
    id: "s4",
    number: 4,
    title: "Configure Audio Settings",
    description:
      "Toggle microphone and system audio on or off depending on your needs. You can also select specific audio devices from the dropdown menus.",
    highlightArea: { x: 30, y: 58, width: 40, height: 12 },
    elementLabel: "Audio Controls",
    videoTimestamp: 45,
  },
  {
    id: "s5",
    number: 5,
    title: "Start Recording",
    description:
      'Click the "Start Recording" button to begin capturing your screen. A 3-second countdown will appear before recording begins. You can stop recording at any time by pressing Ctrl+Shift+R.',
    highlightArea: { x: 38, y: 78, width: 24, height: 7 },
    elementLabel: "Start Button",
    videoTimestamp: 62,
  },
];

function ScreenshotWithHighlight({
  step,
  isActive,
}: {
  step: GuideStep;
  isActive: boolean;
}) {
  return (
    <div className="relative overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900">
      {/* Mock screenshot background */}
      <div className="aspect-video w-full bg-gradient-to-br from-zinc-900 via-zinc-800/50 to-zinc-900">
        {/* Mock UI elements */}
        <div className="relative h-full w-full">
          {/* Mock nav bar */}
          <div className="absolute inset-x-0 top-0 h-[8%] border-b border-zinc-700/30 bg-zinc-900/80">
            <div className="flex h-full items-center px-4">
              <div className="h-2 w-16 rounded bg-zinc-700/40" />
              <div className="ml-8 flex gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-1.5 w-12 rounded bg-zinc-700/30" />
                ))}
              </div>
              <div className="ml-auto h-2.5 w-24 rounded bg-zinc-700/30" />
            </div>
          </div>

          {/* Mock sidebar */}
          <div className="absolute bottom-0 left-0 top-[8%] w-[12%] border-r border-zinc-700/20 bg-zinc-900/60">
            <div className="space-y-2 p-2 pt-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-2 w-full rounded bg-zinc-700/20" />
              ))}
            </div>
          </div>

          {/* Mock content area */}
          <div className="absolute bottom-0 left-[12%] right-0 top-[8%] p-6">
            <div className="space-y-3">
              <div className="h-3 w-48 rounded bg-zinc-700/25" />
              <div className="h-2 w-72 rounded bg-zinc-700/15" />
              <div className="mt-6 grid grid-cols-3 gap-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-20 rounded-lg border border-zinc-700/20 bg-zinc-800/30"
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Highlight Area */}
          {step.highlightArea && isActive && (
            <>
              {/* Semi-transparent overlay */}
              <div className="absolute inset-0 bg-black/40" />
              {/* Highlight cutout */}
              <div
                className="absolute z-10 rounded-lg ring-2 ring-indigo-500 shadow-lg shadow-indigo-500/20"
                style={{
                  left: `${step.highlightArea.x}%`,
                  top: `${step.highlightArea.y}%`,
                  width: `${step.highlightArea.width}%`,
                  height: `${step.highlightArea.height}%`,
                }}
              >
                <div className="absolute inset-0 rounded-lg bg-indigo-500/5" />
                {/* Label */}
                {step.elementLabel && (
                  <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-indigo-500 px-2.5 py-1 text-[10px] font-medium text-white shadow-lg">
                    <MousePointer2 className="mr-1 inline h-2.5 w-2.5" />
                    {step.elementLabel}
                    <div className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-indigo-500" />
                  </div>
                )}
                {/* Pulse animation */}
                <div className="absolute -inset-1 animate-pulse rounded-lg ring-1 ring-indigo-400/30" />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Zoom button */}
      <button className="absolute right-2 top-2 rounded-lg bg-zinc-900/80 p-1.5 text-zinc-400 opacity-0 transition-all hover:bg-zinc-800 hover:text-white group-hover:opacity-100">
        <Maximize2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

export default function GuideRenderer({
  title = "Recording Setup Guide",
  steps = mockSteps,
  onVideoTimestamp,
  className,
}: GuideRendererProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const currentStep = steps[activeStep];

  const markComplete = (index: number) => {
    setCompletedSteps((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const goToStep = (index: number) => {
    if (index >= 0 && index < steps.length) {
      setActiveStep(index);
    }
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Title */}
      {title && (
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <span>{completedSteps.size}/{steps.length} completed</span>
            <div className="h-1.5 w-24 overflow-hidden rounded-full bg-zinc-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all"
                style={{ width: `${(completedSteps.size / steps.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        {/* Screenshot Area */}
        <div className="group">
          <ScreenshotWithHighlight step={currentStep} isActive={true} />

          {/* Step Navigation */}
          <div className="mt-4 flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToStep(activeStep - 1)}
              disabled={activeStep === 0}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>

            <span className="text-xs text-zinc-500">
              Step {activeStep + 1} of {steps.length}
            </span>

            <Button
              variant="outline"
              size="sm"
              onClick={() => goToStep(activeStep + 1)}
              disabled={activeStep === steps.length - 1}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Steps List */}
        <div className="space-y-2">
          {steps.map((step, index) => {
            const isActive = index === activeStep;
            const isComplete = completedSteps.has(index);

            return (
              <button
                key={step.id}
                onClick={() => setActiveStep(index)}
                className={cn(
                  "flex w-full items-start gap-3 rounded-xl border p-3 text-left transition-all",
                  isActive
                    ? "border-indigo-500/30 bg-indigo-500/5"
                    : "border-zinc-800/50 hover:border-zinc-700 hover:bg-zinc-900/50"
                )}
              >
                {/* Step Number / Check */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    markComplete(index);
                  }}
                  className="mt-0.5 shrink-0"
                >
                  {isComplete ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                  ) : (
                    <div
                      className={cn(
                        "flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold",
                        isActive
                          ? "bg-indigo-500 text-white"
                          : "bg-zinc-800 text-zinc-500"
                      )}
                    >
                      {step.number}
                    </div>
                  )}
                </button>

                <div className="min-w-0 flex-1">
                  <div
                    className={cn(
                      "text-sm font-medium",
                      isActive ? "text-white" : "text-zinc-300",
                      isComplete && "line-through text-zinc-500"
                    )}
                  >
                    {step.title}
                  </div>
                  {isActive && (
                    <p className="mt-1 text-xs leading-relaxed text-zinc-400">
                      {step.description}
                    </p>
                  )}
                  {step.videoTimestamp !== undefined && isActive && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onVideoTimestamp?.(step.videoTimestamp!);
                      }}
                      className="mt-2 flex items-center gap-1.5 text-[11px] font-medium text-indigo-400 transition-colors hover:text-indigo-300"
                    >
                      <Play className="h-3 w-3" />
                      Watch at {Math.floor(step.videoTimestamp / 60)}:
                      {(step.videoTimestamp % 60).toString().padStart(2, "0")}
                    </button>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
