"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface SliderProps {
  value?: number;
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  onChange?: (value: number) => void;
  className?: string;
  disabled?: boolean;
}

function Slider({
  value: controlledValue,
  defaultValue = 0,
  min = 0,
  max = 100,
  step = 1,
  onChange,
  className,
  disabled,
}: SliderProps) {
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue);
  const value = controlledValue ?? uncontrolledValue;
  const percentage = ((value - min) / (max - min)) * 100;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value);
    setUncontrolledValue(newValue);
    onChange?.(newValue);
  };

  return (
    <div className={cn("relative flex w-full items-center", className)}>
      <div className="relative h-2 w-full rounded-full bg-muted">
        <div
          className="absolute h-full rounded-full bg-gradient-to-r from-indigo-600 to-violet-600"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleChange}
        disabled={disabled}
        className="absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
      />
      <div
        className="pointer-events-none absolute h-4 w-4 rounded-full border-2 border-primary bg-background shadow-sm transition-transform"
        style={{ left: `calc(${percentage}% - 8px)` }}
      />
    </div>
  );
}

export { Slider };
