"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface SwitchProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  id?: string;
}

function Switch({
  checked: controlledChecked,
  defaultChecked = false,
  onCheckedChange,
  disabled,
  className,
  id,
}: SwitchProps) {
  const [uncontrolledChecked, setUncontrolledChecked] =
    React.useState(defaultChecked);
  const checked = controlledChecked ?? uncontrolledChecked;

  const toggle = () => {
    if (disabled) return;
    const newValue = !checked;
    setUncontrolledChecked(newValue);
    onCheckedChange?.(newValue);
  };

  return (
    <button
      id={id}
      role="switch"
      aria-checked={checked}
      onClick={toggle}
      disabled={disabled}
      className={cn(
        "peer relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "disabled:cursor-not-allowed disabled:opacity-50",
        checked
          ? "bg-green-600"
          : "bg-slate-300",
        className
      )}
    >
      <span
        className={cn(
          "pointer-events-none block h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200",
          checked ? "translate-x-4.5" : "translate-x-0.5"
        )}
      />
    </button>
  );
}

export { Switch };
