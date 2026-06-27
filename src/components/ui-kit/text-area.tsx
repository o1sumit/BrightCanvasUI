import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, error, rows = 4, ...props }, ref) => (
    <textarea
      ref={ref}
      rows={rows}
      {...props}
      className={cn(
        "input-base !h-auto py-3 min-h-[96px] resize-y leading-relaxed",
        error && "border-rose-400 focus:border-rose-500",
        className,
      )}
    />
  ),
);
TextArea.displayName = "TextArea";
