import { ReactNode } from "react";

interface FilterField {
  label: string;
  placeholder: string;
  icon?: ReactNode;
}

export function FilterBar({ fields, right }: { fields: FilterField[]; right?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-end gap-3">
      {fields.map((f) => (
        <div key={f.label} className="flex-1 min-w-[160px]">
          <label className="block text-xs font-medium text-muted-foreground mb-1.5">{f.label}</label>
          <div className="relative">
            {f.icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">{f.icon}</span>}
            <input
              placeholder={f.placeholder}
              className={`w-full h-10 rounded-xl border border-border bg-card text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-mint/40 focus:border-mint transition-all ${f.icon ? "pl-9 pr-3" : "px-3"}`}
            />
          </div>
        </div>
      ))}
      {right && <div className="flex items-end gap-2">{right}</div>}
    </div>
  );
}
