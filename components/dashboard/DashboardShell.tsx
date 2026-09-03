"use client";

import Link from "next/link";
import { useDemoSession } from "@/lib/demo-session";
import { DashboardSidebar } from "./Sidebar";
import { Button } from "@/components/ui/Button";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useDemoSession();

  if (isLoading) {
    return <div className="p-8 text-sm text-ink-faint">Loading…</div>;
  }

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="font-display text-xl text-ink">You&apos;re not logged in</p>
        <p className="max-w-[42ch] text-sm text-ink-soft">
          Log in (or continue with the demo account) to see the dashboard.
        </p>
        <Link href="/login">
          <Button>Log in</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <DashboardSidebar />
      <div className="min-w-0 flex-1 bg-paper">{children}</div>
    </div>
  );
}
