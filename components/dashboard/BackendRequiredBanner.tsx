import { Info } from "lucide-react";

export function BackendRequiredBanner({ feature }: { feature: string }) {
  return (
    <div className="flex gap-3 rounded-[var(--radius-lg)] border border-rule bg-paper-raised p-5">
      <Info size={18} className="mt-0.5 shrink-0 text-ink-soft" />
      <div>
        <p className="text-sm font-medium text-ink">
          {feature} needs a connected database to be fully functional.
        </p>
        <p className="mt-1.5 max-w-[64ch] text-sm leading-relaxed text-ink-soft">
          This screen is built against the real planned schema and API
          routes (see the planning document), but this preview build isn&apos;t
          connected to a live PostgreSQL instance, so there&apos;s no real user
          data behind it yet. The UI below is the actual interface — wiring
          it up is a matter of connecting Prisma and Auth.js, not rebuilding
          the screen.
        </p>
      </div>
    </div>
  );
}
