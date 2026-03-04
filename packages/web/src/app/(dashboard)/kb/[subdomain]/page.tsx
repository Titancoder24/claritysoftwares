"use client";

import React, { useState } from "react";
import {
  Settings,
  ArrowLeft,
  Eye,
  Globe,
  ChevronRight,
  Save,
  MoreHorizontal,
  Link2,
  Tag,
  ToggleLeft,
  ToggleRight,
  Hash,
  Search,
  Clock,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import CategoryTree, { type CategoryItem, type PageItem } from "@/components/kb/CategoryTree";
import PageEditor from "@/components/kb/PageEditor";
import SiteSettings from "@/components/kb/SiteSettings";

const mockCategories: CategoryItem[] = [
  {
    id: "cat-1",
    name: "Getting Started",
    slug: "getting-started",
    isExpanded: true,
    pages: [
      { id: "p1", title: "Quick Start Guide", slug: "quick-start", contentType: "guide", status: "published" },
      { id: "p2", title: "Installation", slug: "installation", contentType: "article", status: "published" },
      { id: "p3", title: "First Recording", slug: "first-recording", contentType: "video", status: "draft" },
    ],
    children: [
      {
        id: "cat-1-1",
        name: "System Requirements",
        slug: "system-requirements",
        pages: [
          { id: "p4", title: "Hardware Requirements", slug: "hardware", contentType: "article", status: "published" },
          { id: "p5", title: "Browser Support", slug: "browser-support", contentType: "article", status: "published" },
        ],
        children: [],
      },
    ],
  },
  {
    id: "cat-2",
    name: "Recording",
    slug: "recording",
    isExpanded: true,
    pages: [
      { id: "p6", title: "Screen Recording Basics", slug: "screen-recording-basics", contentType: "video", status: "published" },
      { id: "p7", title: "Advanced Recording Options", slug: "advanced-recording", contentType: "mixed", status: "published" },
    ],
    children: [],
  },
  {
    id: "cat-3",
    name: "Editing & Export",
    slug: "editing-export",
    pages: [
      { id: "p8", title: "Video Editor Overview", slug: "video-editor", contentType: "video", status: "published" },
      { id: "p9", title: "Export Formats", slug: "export-formats", contentType: "article", status: "draft" },
    ],
    children: [],
  },
  {
    id: "cat-4",
    name: "Integrations",
    slug: "integrations",
    pages: [
      { id: "p10", title: "REST API Guide", slug: "rest-api", contentType: "article", status: "published" },
      { id: "p11", title: "Webhooks", slug: "webhooks", contentType: "article", status: "published" },
      { id: "p12", title: "Slack Integration", slug: "slack", contentType: "guide", status: "published" },
    ],
    children: [],
  },
  {
    id: "cat-5",
    name: "Account & Billing",
    slug: "account-billing",
    pages: [
      { id: "p13", title: "Manage Subscription", slug: "subscription", contentType: "article", status: "published" },
      { id: "p14", title: "Team Management", slug: "team-management", contentType: "guide", status: "published" },
    ],
    children: [],
  },
];

function RightSidebar({
  page,
  onUpdateSlug,
  onTogglePublish,
}: {
  page?: PageItem;
  onUpdateSlug?: (slug: string) => void;
  onTogglePublish?: () => void;
}) {
  const [slug, setSlug] = useState(page?.slug || "");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [tags, setTags] = useState<string[]>(["documentation", "getting-started"]);
  const [tagInput, setTagInput] = useState("");

  const isPublished = page?.status === "published";

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b border-zinc-800/50 px-4 py-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
          Page Settings
        </span>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="space-y-5 p-4">
          {/* Publish Toggle */}
          <div className="rounded-lg border border-zinc-800 bg-zinc-900/30 p-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-zinc-200">Status</div>
                <div className="text-xs text-zinc-500">
                  {isPublished ? "Live and visible" : "Hidden from public"}
                </div>
              </div>
              <button
                onClick={onTogglePublish}
                className="transition-colors"
              >
                {isPublished ? (
                  <ToggleRight className="h-7 w-7 text-emerald-400" />
                ) : (
                  <ToggleLeft className="h-7 w-7 text-zinc-600" />
                )}
              </button>
            </div>
            <div className="mt-2">
              <Badge variant={isPublished ? "success" : "warning"}>
                {isPublished ? "Published" : "Draft"}
              </Badge>
            </div>
          </div>

          {/* URL Slug */}
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-zinc-400">
              <Link2 className="h-3 w-3" />
              URL Slug
            </label>
            <Input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="page-slug"
              className="text-xs"
            />
            <p className="mt-1 truncate text-[10px] text-zinc-600">
              /docs/getting-started/{slug || "..."}
            </p>
          </div>

          {/* Tags */}
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-zinc-400">
              <Tag className="h-3 w-3" />
              Tags
            </label>
            <div className="flex flex-wrap gap-1.5">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1 rounded-md bg-zinc-800 px-2 py-0.5 text-[10px] text-zinc-400"
                >
                  <Hash className="h-2.5 w-2.5" />
                  {tag}
                  <button
                    onClick={() => setTags(tags.filter((t) => t !== tag))}
                    className="ml-0.5 text-zinc-600 hover:text-zinc-300"
                  >
                    x
                  </button>
                </span>
              ))}
            </div>
            <div className="mt-1.5">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && tagInput.trim()) {
                    setTags([...tags, tagInput.trim()]);
                    setTagInput("");
                  }
                }}
                placeholder="Add tag..."
                className="text-xs"
              />
            </div>
          </div>

          {/* SEO */}
          <div className="border-t border-zinc-800/50 pt-5">
            <div className="mb-3 flex items-center gap-1.5">
              <Search className="h-3 w-3 text-zinc-400" />
              <span className="text-xs font-medium text-zinc-400">SEO</span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-[10px] font-medium uppercase tracking-wider text-zinc-600">
                  Meta Title
                </label>
                <Input
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  placeholder="Page title for search engines"
                  className="text-xs"
                />
              </div>
              <div>
                <label className="mb-1 block text-[10px] font-medium uppercase tracking-wider text-zinc-600">
                  Meta Description
                </label>
                <textarea
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  rows={3}
                  className="w-full rounded-lg border border-input bg-muted px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground transition-all focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-primary resize-none"
                  placeholder="Brief description for search engines..."
                />
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="border-t border-zinc-800/50 pt-5">
            <div className="space-y-2 text-[11px] text-zinc-600">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3 w-3" />
                  Last edited
                </span>
                <span className="text-zinc-400">2 hours ago</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <FileText className="h-3 w-3" />
                  Content type
                </span>
                <span className="text-zinc-400">{page?.contentType || "article"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Eye className="h-3 w-3" />
                  Views
                </span>
                <span className="text-zinc-400">1,247</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function KBBuilderPage() {
  const [categories, setCategories] = useState(mockCategories);
  const [activePageId, setActivePageId] = useState("p1");
  const [activeCategoryId, setActiveCategoryId] = useState("cat-1");
  const [settingsOpen, setSettingsOpen] = useState(false);

  const findPage = (cats: CategoryItem[]): PageItem | undefined => {
    for (const cat of cats) {
      const found = cat.pages.find((p) => p.id === activePageId);
      if (found) return found;
      const childResult = findPage(cat.children);
      if (childResult) return childResult;
    }
    return undefined;
  };

  const activePage = findPage(categories);

  return (
    <div className="flex h-screen flex-col bg-[#09090b]">
      {/* Top Bar */}
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-zinc-800 px-4">
        <div className="flex items-center gap-3">
          <a
            href="/kb"
            className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-200"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </a>
          <div className="h-4 w-px bg-zinc-800" />
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-zinc-200">Product Documentation</span>
            <ChevronRight className="h-3.5 w-3.5 text-zinc-600" />
            <span className="text-sm text-zinc-500">
              {activePage?.title || "Select a page"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="success">
            <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Published
          </Badge>
          <a
            href="#"
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-200"
          >
            <Eye className="h-3.5 w-3.5" />
            Preview
          </a>
          <a
            href="#"
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-200"
          >
            <Globe className="h-3.5 w-3.5" />
            View Live
          </a>
          <button
            onClick={() => setSettingsOpen(true)}
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-200"
          >
            <Settings className="h-3.5 w-3.5" />
            Settings
          </button>
          <Button size="sm">
            <Save className="h-3.5 w-3.5" />
            Save
          </Button>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Category Tree */}
        <div className="w-[280px] shrink-0 border-r border-zinc-800 bg-zinc-950/50">
          <CategoryTree
            categories={categories}
            activePageId={activePageId}
            activeCategoryId={activeCategoryId}
            onSelectPage={(pageId, categoryId) => {
              setActivePageId(pageId);
              setActiveCategoryId(categoryId);
            }}
            onSelectCategory={(categoryId) => setActiveCategoryId(categoryId)}
            onAddCategory={(parentId) => {
              console.log("Add category", parentId);
            }}
            onEditCategory={(categoryId) => {
              console.log("Edit category", categoryId);
            }}
            onDeleteCategory={(categoryId) => {
              console.log("Delete category", categoryId);
            }}
            onAddPage={(categoryId) => {
              console.log("Add page to", categoryId);
            }}
            onReorder={(newCategories) => setCategories(newCategories)}
          />
        </div>

        {/* Center - Page Editor */}
        <div className="flex-1 overflow-hidden">
          {activePage ? (
            <PageEditor
              key={activePage.id}
              initialTitle={activePage.title}
              initialContentType={activePage.contentType}
              onSave={(data) => {
                console.log("Save page", data);
              }}
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <FileText className="mx-auto h-12 w-12 text-zinc-800" />
                <h3 className="mt-4 text-lg font-medium text-zinc-400">No page selected</h3>
                <p className="mt-1 text-sm text-zinc-600">
                  Select a page from the sidebar or create a new one.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar - Page Settings */}
        <div className="w-[260px] shrink-0 border-l border-zinc-800 bg-zinc-950/50">
          <RightSidebar
            page={activePage}
            onTogglePublish={() => {
              console.log("Toggle publish");
            }}
          />
        </div>
      </div>

      {/* Site Settings Dialog */}
      <SiteSettings
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        onSave={(settings) => {
          console.log("Save settings", settings);
        }}
      />
    </div>
  );
}
