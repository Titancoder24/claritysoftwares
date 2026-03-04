"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Video,
  Film,
  BookOpen,
  GraduationCap,
  BarChart3,
  Settings,
  ChevronsLeft,
  ChevronsRight,
  LogOut,
  Search,
  Bell,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { Tooltip } from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const mainNav: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Recordings", href: "/recordings", icon: Video },
  { label: "Editor", href: "/editor", icon: Film },
  { label: "Knowledge Base", href: "/knowledge-base", icon: BookOpen },
  { label: "Academy", href: "/academy", icon: GraduationCap },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
];

const bottomNav: NavItem[] = [
  { label: "Settings", href: "/settings", icon: Settings },
];

function SidebarLink({
  item,
  collapsed,
  isActive,
}: {
  item: NavItem;
  collapsed: boolean;
  isActive: boolean;
}) {
  const Icon = item.icon;
  const content = (
    <Link
      href={item.href}
      className={cn(
        "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
        isActive
          ? "bg-white/10 text-white shadow-sm ring-1 ring-white/10"
          : "text-zinc-400 hover:bg-white/5 hover:text-white",
        collapsed && "justify-center px-2.5"
      )}
    >
      <Icon
        className={cn(
          "h-[18px] w-[18px] shrink-0 transition-colors",
          isActive
            ? "text-white"
            : "text-zinc-500 group-hover:text-zinc-300"
        )}
      />
      {!collapsed && <span>{item.label}</span>}
      {isActive && !collapsed && (
        <div className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
      )}
    </Link>
  );

  if (collapsed) {
    return <Tooltip content={item.label} side="right">{content}</Tooltip>;
  }

  return content;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside
        className={cn(
          "flex flex-col border-r border-white/[0.05] bg-black/40 backdrop-blur-xl transition-all duration-300 ease-in-out relative z-20",
          collapsed ? "w-[60px]" : "w-[240px]"
        )}
      >
        {/* Logo */}
        <div
          className={cn(
            "flex h-16 items-center border-b border-white/[0.05] px-5",
            collapsed && "justify-center px-2"
          )}
        >
          {collapsed ? (
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600">
              <span className="text-sm font-bold text-white">S</span>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600">
                <span className="text-sm font-bold text-white">S</span>
              </div>
              <span className="text-base font-semibold text-foreground tracking-tight">
                ScreenFlow
              </span>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        {!collapsed && (
          <div className="px-3 pt-4 pb-2">
            <button className="flex w-full items-center gap-2 rounded-xl border border-dashed border-white/10 bg-white/[0.02] px-3 py-2.5 text-sm text-zinc-400 transition-all hover:border-white/20 hover:bg-white/[0.04] hover:text-white">
              <Plus className="h-4 w-4" />
              <span>New Recording</span>
              <kbd className="ml-auto rounded bg-muted px-1.5 py-0.5 text-[10px] font-mono text-zinc-500">
                R
              </kbd>
            </button>
          </div>
        )}

        {/* Navigation */}
        <ScrollArea className="flex-1 px-3 py-2">
          {!collapsed && (
            <div className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-zinc-600">
              Menu
            </div>
          )}
          <nav className="flex flex-col gap-0.5">
            {mainNav.map((item) => {
              const isActive =
                item.href === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname.startsWith(item.href);
              return (
                <SidebarLink
                  key={item.href}
                  item={item}
                  collapsed={collapsed}
                  isActive={isActive}
                />
              );
            })}
          </nav>
        </ScrollArea>

        {/* Bottom Nav */}
        <div className="border-t border-border px-3 py-2">
          {bottomNav.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <SidebarLink
                key={item.href}
                item={item}
                collapsed={collapsed}
                isActive={isActive}
              />
            );
          })}
        </div>

        {/* User section */}
        <div
          className={cn(
            "flex items-center border-t border-white/[0.05] p-3",
            collapsed ? "justify-center" : "gap-3"
          )}
        >
          <Avatar fallback="John Doe" size="sm" />
          {!collapsed && (
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm font-medium text-foreground">
                John Doe
              </p>
              <p className="truncate text-xs text-muted-foreground">
                john@company.com
              </p>
            </div>
          )}
          {!collapsed && (
            <button className="shrink-0 rounded-md p-1 text-zinc-500 transition-colors hover:bg-muted hover:text-foreground">
              <LogOut className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Collapse toggle */}
        <div className="border-t border-white/[0.05] p-2">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={cn(
              "flex w-full items-center justify-center rounded-md py-1.5 text-zinc-500 transition-colors hover:bg-muted hover:text-foreground",
            )}
          >
            {collapsed ? (
              <ChevronsRight className="h-4 w-4" />
            ) : (
              <ChevronsLeft className="h-4 w-4" />
            )}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex h-16 items-center justify-between border-b border-white/[0.05] bg-black/20 backdrop-blur-md px-6 relative z-10">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                placeholder="Search..."
                className="h-9 w-64 rounded-full border border-white/10 bg-black/40 pl-9 pr-3 text-sm text-white placeholder:text-zinc-500 transition-all focus:outline-none focus:ring-1 focus:ring-white/20 focus:w-80 shadow-inner"
              />
              <kbd className="absolute right-3 top-1/2 -translate-y-1/2 rounded bg-zinc-800 px-1.5 py-0.5 text-[10px] font-mono text-zinc-500">
                /
              </kbd>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="relative rounded-full p-2 text-zinc-400 transition-colors hover:bg-white/10 hover:text-white">
              <Bell className="h-4 w-4" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-7xl px-8 py-8 relative">
            {/* Background elements for the premium vibe */}
            <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
              <div className="absolute top-[-20%] left-[-10%] h-[500px] w-[500px] rounded-full bg-indigo-500/10 blur-[120px]" />
              <div className="absolute bottom-[-20%] right-[-10%] h-[500px] w-[500px] rounded-full bg-violet-500/10 blur-[120px]" />
            </div>
            {/* Wrapping children so they sit above the effect */}
            <div className="relative z-10">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
}
