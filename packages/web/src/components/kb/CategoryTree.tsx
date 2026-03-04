"use client";

import React, { useState } from "react";
import {
  ChevronRight,
  ChevronDown,
  Plus,
  MoreHorizontal,
  GripVertical,
  FolderOpen,
  Folder,
  FileText,
  Pencil,
  Trash2,
  FolderPlus,
  BookOpen,
  Video,
  FileCode,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface CategoryItem {
  id: string;
  name: string;
  icon?: string;
  slug: string;
  pages: PageItem[];
  children: CategoryItem[];
  isExpanded?: boolean;
}

export interface PageItem {
  id: string;
  title: string;
  slug: string;
  contentType: "video" | "guide" | "article" | "mixed";
  status: "published" | "draft";
}

const contentTypeIcons: Record<PageItem["contentType"], React.ElementType> = {
  video: Video,
  guide: Layers,
  article: FileText,
  mixed: FileCode,
};

interface CategoryTreeProps {
  categories: CategoryItem[];
  activePageId?: string;
  activeCategoryId?: string;
  onSelectPage: (pageId: string, categoryId: string) => void;
  onSelectCategory: (categoryId: string) => void;
  onAddCategory: (parentId?: string) => void;
  onEditCategory: (categoryId: string) => void;
  onDeleteCategory: (categoryId: string) => void;
  onAddPage: (categoryId: string) => void;
  onReorder: (categories: CategoryItem[]) => void;
}

function CategoryNode({
  category,
  depth,
  activePageId,
  activeCategoryId,
  onSelectPage,
  onSelectCategory,
  onAddCategory,
  onEditCategory,
  onDeleteCategory,
  onAddPage,
}: {
  category: CategoryItem;
  depth: number;
  activePageId?: string;
  activeCategoryId?: string;
  onSelectPage: (pageId: string, categoryId: string) => void;
  onSelectCategory: (categoryId: string) => void;
  onAddCategory: (parentId?: string) => void;
  onEditCategory: (categoryId: string) => void;
  onDeleteCategory: (categoryId: string) => void;
  onAddPage: (categoryId: string) => void;
}) {
  const [expanded, setExpanded] = useState(category.isExpanded ?? true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const hasChildren = category.children.length > 0 || category.pages.length > 0;
  const isActive = activeCategoryId === category.id;

  return (
    <div>
      {/* Category Row */}
      <div
        className={cn(
          "group relative flex items-center gap-1 rounded-lg px-2 py-1.5 transition-all duration-150 cursor-pointer",
          isActive
            ? "bg-indigo-500/10 text-indigo-400"
            : "text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200",
          isDragOver && "ring-1 ring-indigo-500/50 bg-indigo-500/5"
        )}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
        onClick={() => onSelectCategory(category.id)}
        draggable
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={() => setIsDragOver(false)}
      >
        {/* Drag Handle */}
        <div className="shrink-0 cursor-grab text-zinc-600 opacity-0 transition-opacity group-hover:opacity-100 active:cursor-grabbing">
          <GripVertical className="h-3.5 w-3.5" />
        </div>

        {/* Expand/Collapse */}
        <button
          className="shrink-0 rounded p-0.5 transition-colors hover:bg-zinc-700/50"
          onClick={(e) => {
            e.stopPropagation();
            setExpanded(!expanded);
          }}
        >
          {hasChildren ? (
            expanded ? (
              <ChevronDown className="h-3.5 w-3.5" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5" />
            )
          ) : (
            <span className="inline-block w-3.5" />
          )}
        </button>

        {/* Folder Icon */}
        {expanded && hasChildren ? (
          <FolderOpen className="h-4 w-4 shrink-0 text-indigo-400/70" />
        ) : (
          <Folder className="h-4 w-4 shrink-0 text-zinc-500" />
        )}

        {/* Name */}
        <span className="min-w-0 flex-1 truncate text-sm font-medium">{category.name}</span>

        {/* Page Count */}
        <span className="shrink-0 text-[10px] tabular-nums text-zinc-600 group-hover:hidden">
          {category.pages.length}
        </span>

        {/* Hover Actions */}
        <div className="hidden shrink-0 items-center gap-0.5 group-hover:flex">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddPage(category.id);
            }}
            className="rounded p-1 text-zinc-500 transition-colors hover:bg-zinc-700 hover:text-zinc-200"
            title="Add page"
          >
            <Plus className="h-3 w-3" />
          </button>
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen(!menuOpen);
              }}
              className="rounded p-1 text-zinc-500 transition-colors hover:bg-zinc-700 hover:text-zinc-200"
            >
              <MoreHorizontal className="h-3 w-3" />
            </button>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 top-6 z-50 w-44 rounded-lg border border-zinc-800 bg-zinc-900 py-1 shadow-xl shadow-black/30">
                  <button
                    onClick={() => {
                      onAddPage(category.id);
                      setMenuOpen(false);
                    }}
                    className="flex w-full items-center gap-2.5 px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-800 hover:text-white"
                  >
                    <FileText className="h-3 w-3" /> Add Page
                  </button>
                  <button
                    onClick={() => {
                      onAddCategory(category.id);
                      setMenuOpen(false);
                    }}
                    className="flex w-full items-center gap-2.5 px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-800 hover:text-white"
                  >
                    <FolderPlus className="h-3 w-3" /> Add Subcategory
                  </button>
                  <button
                    onClick={() => {
                      onEditCategory(category.id);
                      setMenuOpen(false);
                    }}
                    className="flex w-full items-center gap-2.5 px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-800 hover:text-white"
                  >
                    <Pencil className="h-3 w-3" /> Rename
                  </button>
                  <div className="my-1 border-t border-zinc-800" />
                  <button
                    onClick={() => {
                      onDeleteCategory(category.id);
                      setMenuOpen(false);
                    }}
                    className="flex w-full items-center gap-2.5 px-3 py-1.5 text-xs text-red-400 hover:bg-red-500/10"
                  >
                    <Trash2 className="h-3 w-3" /> Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Children */}
      {expanded && (
        <div>
          {/* Pages */}
          {category.pages.map((page) => {
            const Icon = contentTypeIcons[page.contentType];
            const isPageActive = activePageId === page.id;
            return (
              <div
                key={page.id}
                className={cn(
                  "group flex items-center gap-2 rounded-lg px-2 py-1.5 transition-all duration-150 cursor-pointer",
                  isPageActive
                    ? "bg-indigo-500/10 text-indigo-300"
                    : "text-zinc-500 hover:bg-zinc-800/40 hover:text-zinc-300"
                )}
                style={{ paddingLeft: `${(depth + 1) * 16 + 24}px` }}
                onClick={() => onSelectPage(page.id, category.id)}
                draggable
              >
                <Icon className="h-3.5 w-3.5 shrink-0" />
                <span className="min-w-0 flex-1 truncate text-xs">{page.title}</span>
                {page.status === "draft" && (
                  <span className="shrink-0 rounded bg-amber-500/10 px-1.5 py-0.5 text-[9px] font-medium text-amber-400">
                    Draft
                  </span>
                )}
              </div>
            );
          })}

          {/* Subcategories */}
          {category.children.map((child) => (
            <CategoryNode
              key={child.id}
              category={child}
              depth={depth + 1}
              activePageId={activePageId}
              activeCategoryId={activeCategoryId}
              onSelectPage={onSelectPage}
              onSelectCategory={onSelectCategory}
              onAddCategory={onAddCategory}
              onEditCategory={onEditCategory}
              onDeleteCategory={onDeleteCategory}
              onAddPage={onAddPage}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function CategoryTree({
  categories,
  activePageId,
  activeCategoryId,
  onSelectPage,
  onSelectCategory,
  onAddCategory,
  onEditCategory,
  onDeleteCategory,
  onAddPage,
}: CategoryTreeProps) {
  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-indigo-400" />
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Categories
          </span>
        </div>
        <button
          onClick={() => onAddCategory()}
          className="rounded-md p-1 text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-zinc-200"
          title="New Category"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Tree */}
      <div className="flex-1 space-y-0.5 overflow-y-auto px-2 pb-4">
        {categories.length > 0 ? (
          categories.map((category) => (
            <CategoryNode
              key={category.id}
              category={category}
              depth={0}
              activePageId={activePageId}
              activeCategoryId={activeCategoryId}
              onSelectPage={onSelectPage}
              onSelectCategory={onSelectCategory}
              onAddCategory={onAddCategory}
              onEditCategory={onEditCategory}
              onDeleteCategory={onDeleteCategory}
              onAddPage={onAddPage}
            />
          ))
        ) : (
          <div className="px-4 py-8 text-center">
            <Folder className="mx-auto h-8 w-8 text-zinc-700" />
            <p className="mt-2 text-xs text-zinc-600">No categories yet</p>
            <button
              onClick={() => onAddCategory()}
              className="mt-2 text-xs font-medium text-indigo-400 transition-colors hover:text-indigo-300"
            >
              Create your first category
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-zinc-800/50 px-4 py-3">
        <button
          onClick={() => onAddCategory()}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-zinc-800 px-3 py-2 text-xs font-medium text-zinc-500 transition-all hover:border-zinc-600 hover:bg-zinc-800/30 hover:text-zinc-300"
        >
          <FolderPlus className="h-3.5 w-3.5" />
          New Category
        </button>
      </div>
    </div>
  );
}
