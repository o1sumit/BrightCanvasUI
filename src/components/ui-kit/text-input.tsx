import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  error?: boolean;
}

export const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  ({ className, leftIcon, rightIcon, error, ...props }, ref) => {
    if (leftIcon || rightIcon) {
      return (
        <div
          className={cn(
            "input-base flex items-center gap-2 p-0",
            error && "border-rose-400 focus-within:border-rose-500",
            className,
          )}
        >
          {leftIcon && <span className="pl-3 text-muted-foreground flex shrink-0">{leftIcon}</span>}
          <input
            ref={ref}
            {...props}
            className="flex-1 bg-transparent outline-none h-full px-3 text-sm placeholder:text-muted-foreground"
          />
          {rightIcon && <span className="pr-3 text-muted-foreground flex shrink-0">{rightIcon}</span>}
        </div>
      );
    }
    return (
      <input
        ref={ref}
        {...props}
        className={cn("input-base", error && "border-rose-400 focus:border-rose-500", className)}
      />
    );
  },
);
TextInput.displayName = "TextInput";
