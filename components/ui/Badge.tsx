import { cn } from "@/lib/cn";

type Tone = "ledger" | "gold" | "success" | "warning" | "error" | "neutral";

const toneClasses: Record<Tone, string> = {
  ledger: "bg-ledger-tint text-ledger-strong",
  gold: "bg-gold-tint text-[var(--gold)]",
  success: "bg-success-tint text-success",
  warning: "bg-warning-tint text-warning",
  error: "bg-error-tint text-error",
  neutral: "bg-rule/60 text-ink-soft",
};

export function Badge({
  tone = "neutral",
  children,
  className,
}: {
  tone?: Tone;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        toneClasses[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
