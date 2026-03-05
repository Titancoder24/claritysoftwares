"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Search,
  BookOpen,
  Globe,
  FileText,
  MoreHorizontal,
  ExternalLink,
  Settings,
  Trash2,
  Copy,
  ArrowUpRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface KBSite {
  id: string;
  name: string;
  subdomain: string;
  customDomain?: string;
  description: string;
  pageCount: number;
  categoryCount: number;
  status: "published" | "draft" | "archived";
  lastUpdated: string;
  views: number;
}

const mockSites: KBSite[] = [
  {
    id: "1",
    name: "Product Documentation",
    subdomain: "docs",
    customDomain: "docs.acme.com",
    description: "Complete product guides and API documentation for developers and users.",
    pageCount: 47,
    categoryCount: 8,
    status: "published",
    lastUpdated: "2 hours ago",
    views: 12400,
  },
  {
    id: "2",
    name: "Customer Support",
    subdomain: "support",
    description: "Help articles and troubleshooting guides for common issues.",
    pageCount: 23,
    categoryCount: 5,
    status: "published",
    lastUpdated: "1 day ago",
    views: 8200,
  },
  {
    id: "3",
    name: "Internal Wiki",
    subdomain: "wiki",
    description: "Internal team knowledge base for processes and onboarding.",
    pageCount: 12,
    categoryCount: 3,
    status: "draft",
    lastUpdated: "3 days ago",
    views: 340,
  },
  {
    id: "4",
    name: "API Reference",
    subdomain: "api",
    description: "REST API endpoints, webhooks, and integration guides.",
    pageCount: 31,
    categoryCount: 6,
    status: "published",
    lastUpdated: "5 hours ago",
    views: 5600,
  },
];

function StatusBadge({ status }: { status: KBSite["status"] }) {
  const variants: Record<KBSite["status"], "success" | "warning" | "secondary"> = {
    published: "success",
    draft: "warning",
    archived: "secondary",
  };
  return (
    <Badge variant={variants[status]}>
      <span
        className={cn(
          "mr-1.5 inline-block h-1.5 w-1.5 rounded-full",
          status === "published" && "bg-emerald-600",
          status === "draft" && "bg-amber-600",
          status === "archived" && "bg-slate-400"
        )}
      />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}

function SiteCard({ site }: { site: KBSite }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="group relative rounded-xl border border-border bg-card transition-all duration-200 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-200/60">
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10 text-green-600">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{site.name}</h3>
              <div className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                <Globe className="h-3 w-3" />
                <span>{site.customDomain || `${site.subdomain}.screenflow.dev`}</span>
              </div>
            </div>
          </div>
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="rounded-lg p-1.5 text-muted-foreground opacity-0 transition-all hover:bg-muted hover:text-foreground group-hover:opacity-100"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 top-8 z-50 w-48 rounded-lg border border-border bg-white py-1 shadow-xl shadow-slate-200/60">
                  <button className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-900">
                    <Settings className="h-3.5 w-3.5" /> Settings
                  </button>
                  <button className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-900">
                    <ExternalLink className="h-3.5 w-3.5" /> View Live
                  </button>
                  <button className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-900">
                    <Copy className="h-3.5 w-3.5" /> Duplicate
                  </button>
                  <div className="my-1 border-t border-border" />
                  <button className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10">
                    <Trash2 className="h-3.5 w-3.5" /> Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        <p className="mt-3 text-sm leading-relaxed text-muted-foreground line-clamp-2">
          {site.description}
        </p>

        <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <FileText className="h-3.5 w-3.5" />
            <span>{site.pageCount} pages</span>
          </div>
          <div className="flex items-center gap-1.5">
            <BookOpen className="h-3.5 w-3.5" />
            <span>{site.categoryCount} categories</span>
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            <span>{site.views.toLocaleString()} views</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-border px-6 py-3">
        <div className="flex items-center gap-2">
          <StatusBadge status={site.status} />
          <span className="text-xs text-muted-foreground">Updated {site.lastUpdated}</span>
        </div>
        <a
          href={`/kb/${site.id}`}
          className="flex items-center gap-1 text-xs font-medium text-green-600 transition-colors hover:text-green-700"
        >
          Edit <ArrowUpRight className="h-3 w-3" />
        </a>
      </div>
    </div>
  );
}

export default function KBListPage() {
  const [search, setSearch] = useState("");

  const filteredSites = mockSites.filter(
    (site) =>
      site.name.toLowerCase().includes(search.toLowerCase()) ||
      site.subdomain.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Knowledge Base</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Create and manage self-service documentation sites for your customers.
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4" />
          Create Knowledge Base
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="mt-6 flex items-center gap-3">
        <div className="w-80">
          <Input
            placeholder="Search knowledge bases..."
            icon={<Search className="h-4 w-4" />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-1 rounded-lg border border-border p-1">
          {["All", "Published", "Draft"].map((filter) => (
            <button
              key={filter}
              className={cn(
                "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                filter === "All"
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filteredSites.length > 0 ? (
        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
          {filteredSites.map((site) => (
            <SiteCard key={site.id} site={site} />
          ))}
        </div>
      ) : (
        <div className="mt-20 flex flex-col items-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-muted">
            <BookOpen className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-foreground">No knowledge bases found</h3>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            {search
              ? "Try adjusting your search query."
              : "Get started by creating your first knowledge base."}
          </p>
          {!search && (
            <Button className="mt-4">
              <Plus className="h-4 w-4" />
              Create Knowledge Base
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
