"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Video,
  BookOpen,
  GraduationCap,
  BarChart3,
  Settings,
  LogOut,
  Search,
  Bell,
  ChevronDown,
  User,
  CreditCard,
  HelpCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/lib/store/auth";
import { Avatar } from "@/components/ui/avatar";
import { Tooltip } from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

/* ─── Types ─────────────────────────────────────────────── */

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

/* ─── Navigation config ─────────────────────────────────── */

const menuItems: NavItem[] = [
  { label: "Recordings", href: "/recordings", icon: Video },
  { label: "Knowledge Base", href: "/kb", icon: BookOpen },
  { label: "Academy", href: "/academy", icon: GraduationCap },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
];

const generalItems: NavItem[] = [
  { label: "Settings", href: "/settings", icon: Settings },
];

const pageTitles: Record<string, string> = {
  "/recordings": "Recordings",
  "/editor": "Editor",
  "/kb": "Knowledge Base",
  "/academy": "Academy",
  "/analytics": "Analytics",
  "/settings": "Settings",
};

/* ─── Helpers ───────────────────────────────────────────── */

function resolvePageTitle(pathname: string): string {
  if (pageTitles[pathname]) return pageTitles[pathname];

  const match = Object.keys(pageTitles).find((key) =>
    pathname.startsWith(key)
  );
  return match ? pageTitles[match] : "Dashboard";
}

function getUserDisplayName(user: { email?: string; user_metadata?: Record<string, unknown> } | null): string {
  if (!user) return "User";
  const meta = user.user_metadata;
  if (meta?.full_name) return meta.full_name as string;
  if (meta?.name) return meta.name as string;
  if (user.email) return user.email.split("@")[0];
  return "User";
}

function getUserEmail(user: { email?: string } | null): string {
  return user?.email ?? "";
}

/* ─── Sidebar nav link ──────────────────────────────────── */

function NavLink({ item, active }: { item: NavItem; active: boolean }) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      className={cn(
        "group relative flex items-center gap-3 rounded-md px-3 py-2 text-[13px] font-medium transition-colors duration-150",
        active
          ? "bg-white/10 text-white"
          : "text-green-100 hover:bg-white/5 hover:text-white"
      )}
    >
      {active && (
        <span className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r bg-green-400" />
      )}
      <Icon
        className={cn(
          "h-4 w-4 shrink-0 transition-colors duration-150",
          active ? "text-green-400" : "text-green-300 group-hover:text-white"
        )}
      />
      <span>{item.label}</span>
    </Link>
  );
}

/* ─── Sidebar ───────────────────────────────────────────── */

function Sidebar() {
  const pathname = usePathname();
  const { user, signOut } = useAuthStore();

  const displayName = getUserDisplayName(user);
  const email = getUserEmail(user);

  return (
    <aside className="flex h-full w-[240px] flex-col bg-green-900">
      {/* Logo */}
      <div className="flex h-14 items-center gap-2.5 px-5">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-green-600">
          <span className="text-xs font-bold text-white leading-none">S</span>
        </div>
        <span className="text-[15px] font-semibold tracking-tight text-white">
          ScreenFlow
        </span>
      </div>

      {/* Nav sections */}
      <ScrollArea className="flex-1 px-3 pt-4">
        {/* MENU */}
        <p className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-widest text-green-300/50">
          Menu
        </p>
        <nav className="flex flex-col gap-px">
          {menuItems.map((item) => {
            const active = pathname.startsWith(item.href);
            return <NavLink key={item.label} item={item} active={active} />;
          })}
        </nav>

        {/* GENERAL */}
        <p className="mb-1.5 mt-6 px-3 text-[10px] font-semibold uppercase tracking-widest text-green-300/50">
          General
        </p>
        <nav className="flex flex-col gap-px">
          {generalItems.map((item) => {
            const active = pathname.startsWith(item.href);
            return <NavLink key={item.label} item={item} active={active} />;
          })}
        </nav>
      </ScrollArea>

      {/* User section */}
      <div className="border-t border-green-800 p-3">
        <div className="flex items-center gap-3 rounded-md px-2 py-2">
          <Avatar
            fallback={displayName}
            size="sm"
          />
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-[13px] font-medium text-green-100">
              {displayName}
            </p>
            <p className="truncate text-[11px] text-green-400">
              {email}
            </p>
          </div>
          <Tooltip content="Sign out" side="top">
            <button
              onClick={signOut}
              className="shrink-0 rounded-md p-1.5 text-green-400 transition-colors hover:bg-white/10 hover:text-white"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </Tooltip>
        </div>
      </div>
    </aside>
  );
}

/* ─── Header ────────────────────────────────────────────── */

function Header() {
  const pathname = usePathname();
  const { user, signOut } = useAuthStore();
  const title = resolvePageTitle(pathname);
  const displayName = getUserDisplayName(user);
  const email = getUserEmail(user);

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-6">
      {/* Left: page title */}
      <h1 className="text-[15px] font-semibold text-slate-900">{title}</h1>

      {/* Right: search + notifications + avatar */}
      <div className="flex items-center gap-1">
        {/* Search */}
        <div className="relative mr-2">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search..."
            className={cn(
              "h-8 w-56 rounded-md border border-slate-200 bg-slate-50 pl-8 pr-8 text-[13px] text-slate-900",
              "placeholder:text-slate-400 transition-all duration-200",
              "focus:w-72 focus:border-green-300 focus:outline-none focus:ring-1 focus:ring-green-500/40"
            )}
          />
          <kbd className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 rounded border border-slate-200 bg-slate-100 px-1.5 py-px text-[10px] font-mono text-slate-400">
            /
          </kbd>
        </div>

        {/* Notifications */}
        <Tooltip content="Notifications" side="bottom">
          <button className="relative rounded-md p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600">
            <Bell className="h-4 w-4" />
            <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-green-500" />
          </button>
        </Tooltip>

        {/* Separator */}
        <div className="mx-2 h-5 w-px bg-slate-200" />

        {/* User dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-md px-2 py-1.5 transition-colors hover:bg-slate-100">
              <Avatar fallback={displayName} size="sm" />
              <ChevronDown className="h-3 w-3 text-slate-400" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span className="text-[13px] font-medium text-slate-900">
                  {displayName}
                </span>
                <span className="text-[11px] font-normal text-slate-500">
                  {email}
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => window.location.assign("/settings")}>
              <User className="h-3.5 w-3.5 text-slate-400" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => window.location.assign("/settings")}>
              <CreditCard className="h-3.5 w-3.5 text-slate-400" />
              Billing
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => window.location.assign("/settings")}>
              <HelpCircle className="h-3.5 w-3.5 text-slate-400" />
              Help & Support
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={signOut} destructive>
              <LogOut className="h-3.5 w-3.5" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

/* ─── Layout ────────────────────────────────────────────── */

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { init } = useAuthStore();

  React.useEffect(() => {
    init();
  }, [init]);

  return (
    <div className="flex h-screen overflow-hidden bg-[#f5f5f5]">
      <Sidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-7xl px-6 py-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
