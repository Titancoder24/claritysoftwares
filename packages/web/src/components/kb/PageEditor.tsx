"use client";

import React, { useState } from "react";
import {
  Video,
  FileText,
  Layers,
  FileCode,
  Eye,
  EyeOff,
  ChevronDown,
  Play,
  Image,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Link,
  Code,
  Heading1,
  Heading2,
  Quote,
  Minus,
  Undo,
  Redo,
  AlignLeft,
  AlignCenter,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type ContentType = "video" | "guide" | "article" | "mixed";

interface Project {
  id: string;
  name: string;
  thumbnail?: string;
  duration?: string;
  steps?: number;
}

interface PageEditorProps {
  initialTitle?: string;
  initialContentType?: ContentType;
  initialContent?: string;
  initialProjectId?: string;
  projects?: Project[];
  onSave?: (data: {
    title: string;
    contentType: ContentType;
    content: string;
    projectId?: string;
  }) => void;
}

const contentTypes: { type: ContentType; label: string; icon: React.ElementType; desc: string }[] = [
  { type: "video", label: "Video", icon: Video, desc: "Embed a recorded video" },
  { type: "guide", label: "Guide", icon: Layers, desc: "Step-by-step guide" },
  { type: "article", label: "Article", icon: FileText, desc: "Rich text article" },
  { type: "mixed", label: "Mixed", icon: FileCode, desc: "Combine content types" },
];

const mockProjects: Project[] = [
  { id: "p1", name: "Getting Started Tutorial", duration: "4:32", steps: 12 },
  { id: "p2", name: "Dashboard Walkthrough", duration: "7:15", steps: 18 },
  { id: "p3", name: "API Integration Guide", duration: "12:03", steps: 24 },
  { id: "p4", name: "User Management Flow", duration: "3:48", steps: 8 },
];

function ToolbarButton({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      title={label}
      onClick={onClick}
      className={cn(
        "rounded-md p-1.5 transition-colors",
        active
          ? "bg-zinc-700 text-white"
          : "text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300"
      )}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}

function ProjectSelector({
  projects,
  selectedId,
  onSelect,
  contentType,
}: {
  projects: Project[];
  selectedId?: string;
  onSelect: (id: string) => void;
  contentType: ContentType;
}) {
  const [open, setOpen] = useState(false);
  const selected = projects.find((p) => p.id === selectedId);

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-zinc-300">
        Select {contentType === "video" ? "Recording" : "Guide"} Project
      </label>
      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="flex w-full items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-3 text-left transition-colors hover:border-zinc-700"
        >
          {selected ? (
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-14 items-center justify-center rounded-md bg-zinc-800">
                <Play className="h-4 w-4 text-zinc-400" />
              </div>
              <div>
                <div className="text-sm font-medium text-zinc-200">{selected.name}</div>
                <div className="text-xs text-zinc-500">
                  {selected.duration} {selected.steps && `/ ${selected.steps} steps`}
                </div>
              </div>
            </div>
          ) : (
            <span className="text-sm text-zinc-500">Choose a project...</span>
          )}
          <ChevronDown
            className={cn(
              "h-4 w-4 text-zinc-500 transition-transform",
              open && "rotate-180"
            )}
          />
        </button>

        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-64 overflow-y-auto rounded-lg border border-zinc-800 bg-zinc-900 py-1 shadow-xl shadow-black/30">
              {projects.map((project) => (
                <button
                  key={project.id}
                  onClick={() => {
                    onSelect(project.id);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-zinc-800",
                    selectedId === project.id && "bg-indigo-500/10"
                  )}
                >
                  <div className="flex h-8 w-12 items-center justify-center rounded bg-zinc-800">
                    <Play className="h-3 w-3 text-zinc-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm text-zinc-200">{project.name}</div>
                    <div className="text-xs text-zinc-500">
                      {project.duration} {project.steps && `/ ${project.steps} steps`}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Preview Area */}
      {selected && (
        <div className="mt-4 overflow-hidden rounded-lg border border-zinc-800">
          <div className="flex aspect-video items-center justify-center bg-zinc-900">
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-indigo-500/10 transition-colors hover:bg-indigo-500/20">
                <Play className="h-8 w-8 text-indigo-400" />
              </div>
              <p className="mt-3 text-sm font-medium text-zinc-300">{selected.name}</p>
              <p className="mt-1 text-xs text-zinc-500">{selected.duration}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function RichTextEditor({
  content,
  onChange,
}: {
  content: string;
  onChange: (content: string) => void;
}) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900/30">
      {/* Toolbar */}
      <div className="flex items-center gap-0.5 border-b border-zinc-800 px-3 py-2">
        <ToolbarButton icon={Undo} label="Undo" />
        <ToolbarButton icon={Redo} label="Redo" />
        <div className="mx-1.5 h-4 w-px bg-zinc-800" />
        <ToolbarButton icon={Heading1} label="Heading 1" />
        <ToolbarButton icon={Heading2} label="Heading 2" />
        <div className="mx-1.5 h-4 w-px bg-zinc-800" />
        <ToolbarButton icon={Bold} label="Bold" />
        <ToolbarButton icon={Italic} label="Italic" />
        <ToolbarButton icon={Underline} label="Underline" />
        <ToolbarButton icon={Code} label="Code" />
        <div className="mx-1.5 h-4 w-px bg-zinc-800" />
        <ToolbarButton icon={List} label="Bullet List" />
        <ToolbarButton icon={ListOrdered} label="Numbered List" />
        <ToolbarButton icon={Quote} label="Blockquote" />
        <ToolbarButton icon={Minus} label="Divider" />
        <div className="mx-1.5 h-4 w-px bg-zinc-800" />
        <ToolbarButton icon={Link} label="Link" />
        <ToolbarButton icon={Image} label="Image" />
        <div className="flex-1" />
        <ToolbarButton icon={AlignLeft} label="Align Left" />
        <ToolbarButton icon={AlignCenter} label="Align Center" />
      </div>

      {/* Editor Area */}
      <textarea
        className="min-h-[400px] w-full resize-none bg-transparent px-6 py-4 text-sm leading-relaxed text-zinc-200 placeholder:text-zinc-600 focus:outline-none"
        placeholder="Start writing your article content here...

You can use markdown-style formatting:
- **Bold** text for emphasis
- Create headings with # symbols
- Add links and images
- Create code blocks with backticks"
        value={content}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

export default function PageEditor({
  initialTitle = "",
  initialContentType = "article",
  initialContent = "",
  initialProjectId,
  projects = mockProjects,
  onSave,
}: PageEditorProps) {
  const [title, setTitle] = useState(initialTitle);
  const [contentType, setContentType] = useState<ContentType>(initialContentType);
  const [content, setContent] = useState(initialContent);
  const [projectId, setProjectId] = useState(initialProjectId);
  const [preview, setPreview] = useState(false);

  return (
    <div className="flex h-full flex-col">
      {/* Content Type Tabs */}
      <div className="flex items-center justify-between border-b border-zinc-800/50 px-6 py-3">
        <div className="flex items-center gap-1 rounded-lg bg-zinc-900/50 p-1">
          {contentTypes.map(({ type, label, icon: Icon }) => (
            <button
              key={type}
              onClick={() => setContentType(type)}
              className={cn(
                "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all",
                contentType === type
                  ? "bg-zinc-800 text-white shadow-sm"
                  : "text-zinc-500 hover:text-zinc-300"
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setPreview(!preview)}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
              preview
                ? "bg-indigo-500/10 text-indigo-400"
                : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            {preview ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            {preview ? "Edit" : "Preview"}
          </button>
          <Button
            size="sm"
            onClick={() =>
              onSave?.({ title, contentType, content, projectId })
            }
          >
            Save Page
          </Button>
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="mx-auto max-w-3xl">
          {/* Title */}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Untitled Page"
            className="w-full bg-transparent text-3xl font-bold tracking-tight text-white placeholder:text-zinc-700 focus:outline-none"
          />

          <div className="mt-1 text-sm text-zinc-600">
            {contentType === "video" && "Embed a recorded video from your projects"}
            {contentType === "guide" && "Select a step-by-step guide from your projects"}
            {contentType === "article" && "Write rich text content with formatting"}
            {contentType === "mixed" && "Combine video, guide, and article content"}
          </div>

          {/* Content Area */}
          <div className="mt-6">
            {(contentType === "video" || contentType === "guide") && (
              <ProjectSelector
                projects={projects}
                selectedId={projectId}
                onSelect={setProjectId}
                contentType={contentType}
              />
            )}

            {contentType === "article" && (
              <RichTextEditor content={content} onChange={setContent} />
            )}

            {contentType === "mixed" && (
              <div className="space-y-6">
                <ProjectSelector
                  projects={projects}
                  selectedId={projectId}
                  onSelect={setProjectId}
                  contentType="video"
                />
                <div className="relative">
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent" />
                  <div className="pt-6">
                    <label className="mb-3 block text-sm font-medium text-zinc-300">
                      Additional Content
                    </label>
                    <RichTextEditor content={content} onChange={setContent} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
