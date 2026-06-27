import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export interface SelectOption {
  value: string;
  label: React.ReactNode;
  disabled?: boolean;
}

export interface ThemedSelectProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  contentClassName?: string;
  id?: string;
  "aria-label"?: string;
}

/**
 * Themed Select primitive. Uses the same input-base surface as TextInput,
 * but opens a rounded mint-bordered popover (Radix), not the native OS dropdown.
 */
export function ThemedSelect({
  value,
  defaultValue,
  onChange,
  options,
  placeholder,
  disabled,
  className,
  contentClassName,
  id,
  ...rest
}: ThemedSelectProps) {
  return (
    <Select value={value} defaultValue={defaultValue} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger
        id={id}
        aria-label={rest["aria-label"]}
        className={cn(
          "input-base !h-11 flex items-center justify-between gap-2 text-left font-normal",
          "data-[placeholder]:text-muted-foreground",
          "[&>span]:line-clamp-1 [&>svg]:opacity-60",
          className,
        )}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent
        align="start"
        sideOffset={6}
        position="popper"
        className={cn(
          "min-w-[var(--radix-select-trigger-width)] w-[var(--radix-select-trigger-width)] rounded-xl border-border bg-popover shadow-elevated p-1",
          contentClassName,
        )}
      >
        {options.map((opt) => (
          <SelectItem
            key={opt.value}
            value={opt.value}
            disabled={opt.disabled}
            className={cn(
              "rounded-lg !pl-[0.625rem] !pr-2 py-2 text-sm cursor-pointer",
              "focus:bg-mint-soft focus:text-mint-deep",
              "data-[state=checked]:bg-mint-soft data-[state=checked]:text-mint-deep data-[state=checked]:font-medium",
            )}
          >
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
