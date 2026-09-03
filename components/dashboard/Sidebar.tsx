"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FilePlus2,
  Layers,
  History,
  FolderOpen,
  Wrench,
  Settings,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { useDemoSession } from "@/lib/demo-session";
import { useRouter } from "next/navigation";
import { LogoMark } from "@/components/marketing/Navbar";

const links = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/tools", label: "New Conversion", icon: FilePlus2 },
  { href: "/bulk", label: "Bulk Convert", icon: Layers },
  { href: "/dashboard/history", label: "History", icon: History },
  { href: "/dashboard/files", label: "Files", icon: FolderOpen },
  { href: "/tools", label: "Converters", icon: Wrench },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useDemoSession();

  return (
    <aside className="flex w-full shrink-0 flex-col justify-between border-r border-rule bg-paper-raised p-4 md:h-screen md:w-60 md:sticky md:top-0">
      <div>
        <Link href="/" className="flex items-center gap-2 px-2 py-2">
          <LogoMark size={22} />
          <span className="font-display text-[1.05rem] text-ink">LedgerFlow</span>
        </Link>
        <nav className="mt-6 flex flex-col gap-0.5">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.label}
                href={l.href}
                className={cn(
                  "flex items-center gap-2.5 rounded-[var(--radius-md)] px-3 py-2 text-sm transition-colors",
                  active ? "bg-ledger-tint text-ledger-strong font-medium" : "text-ink-soft hover:bg-rule/50 hover:text-ink"
                )}
              >
                <l.icon size={16} />
                {l.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {user && (
        <div className="flex items-center justify-between rounded-[var(--radius-md)] border border-rule px-3 py-2.5">
          <div className="overflow-hidden">
            <p className="truncate text-sm text-ink">{user.name}</p>
            <p className="truncate text-xs text-ink-faint">{user.email}</p>
          </div>
          <button
            onClick={() => {
              logout();
              router.push("/");
            }}
            aria-label="Log out"
            className="shrink-0 text-ink-faint hover:text-ink"
          >
            <LogOut size={15} />
          </button>
        </div>
      )}
    </aside>
  );
}
