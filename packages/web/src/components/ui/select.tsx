"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  value?: string;
  defaultValue?: string;
  options: SelectOption[];
  onValueChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

function Select({
  value: controlledValue,
  defaultValue = "",
  options,
  onValueChange,
  placeholder = "Select...",
  className,
  disabled,
}: SelectProps) {
  const [uncontrolledValue, setUncontrolledValue] =
    React.useState(defaultValue);
  const value = controlledValue ?? uncontrolledValue;

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    setUncontrolledValue(newValue);
    onValueChange?.(newValue);
  };

  return (
    <div className={cn("relative", className)}>
      <select
        value={value}
        onChange={handleChange}
        disabled={disabled}
        className={cn(
          "flex h-10 w-full appearance-none rounded-lg border border-input bg-muted px-3 py-2 pr-8 text-sm text-foreground transition-all duration-200",
          "focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-primary",
          "disabled:cursor-not-allowed disabled:opacity-50",
        )}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
    </div>
  );
}

export { Select };
export type { SelectOption };
