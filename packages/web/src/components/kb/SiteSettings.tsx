"use client";

import React, { useState } from "react";
import {
  X,
  Globe,
  Palette,
  Shield,
  Search,
  Upload,
  Check,
  ExternalLink,
  Lock,
  Users,
  Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SiteSettingsProps {
  open: boolean;
  onClose: () => void;
  initialSettings?: {
    name: string;
    subdomain: string;
    customDomain: string;
    description: string;
    primaryColor: string;
    accentColor: string;
    fontFamily: string;
    authMode: string;
    metaTitle: string;
    metaDescription: string;
    ogImage: string;
    favicon: string;
  };
  onSave?: (settings: Record<string, string>) => void;
}

type Tab = "general" | "theme" | "access" | "seo";

const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "general", label: "General", icon: Globe },
  { id: "theme", label: "Theme", icon: Palette },
  { id: "access", label: "Access", icon: Shield },
  { id: "seo", label: "SEO", icon: Search },
];

const colorPresets = [
  { name: "Indigo", value: "#6366f1" },
  { name: "Violet", value: "#8b5cf6" },
  { name: "Blue", value: "#3b82f6" },
  { name: "Cyan", value: "#06b6d4" },
  { name: "Emerald", value: "#10b981" },
  { name: "Rose", value: "#f43f5e" },
  { name: "Orange", value: "#f97316" },
  { name: "Amber", value: "#f59e0b" },
];

const fontOptions = [
  { name: "Inter", value: "inter", sample: "The quick brown fox" },
  { name: "DM Sans", value: "dm-sans", sample: "The quick brown fox" },
  { name: "Plus Jakarta Sans", value: "plus-jakarta", sample: "The quick brown fox" },
  { name: "Manrope", value: "manrope", sample: "The quick brown fox" },
  { name: "Space Grotesk", value: "space-grotesk", sample: "The quick brown fox" },
];

const authModes = [
  {
    id: "public",
    label: "Public",
    description: "Anyone can access your knowledge base",
    icon: Eye,
  },
  {
    id: "password",
    label: "Password Protected",
    description: "Require a shared password to access",
    icon: Lock,
  },
  {
    id: "authenticated",
    label: "Authenticated Users",
    description: "Only logged-in users can access",
    icon: Users,
  },
];

export default function SiteSettings({ open, onClose, onSave }: SiteSettingsProps) {
  const [activeTab, setActiveTab] = useState<Tab>("general");
  const [name, setName] = useState("Product Documentation");
  const [subdomain, setSubdomain] = useState("docs");
  const [customDomain, setCustomDomain] = useState("");
  const [description, setDescription] = useState(
    "Complete product guides and documentation for developers and users."
  );
  const [primaryColor, setPrimaryColor] = useState("#6366f1");
  const [accentColor, setAccentColor] = useState("#8b5cf6");
  const [fontFamily, setFontFamily] = useState("inter");
  const [authMode, setAuthMode] = useState("public");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Dialog */}
      <div className="relative z-10 flex h-[640px] w-[820px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-black/40">
        {/* Sidebar */}
        <div className="w-52 shrink-0 border-r border-slate-200 p-4">
          <h2 className="mb-1 text-sm font-semibold text-slate-900">Site Settings</h2>
          <p className="mb-4 text-xs text-slate-400">Configure your knowledge base</p>
          <nav className="space-y-1">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors",
                  activeTab === id
                    ? "bg-slate-100 text-slate-900"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
            <h3 className="text-base font-semibold text-slate-900">
              {tabs.find((t) => t.id === activeTab)?.label}
            </h3>
            <button
              onClick={onClose}
              className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-900"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Form Content */}
          <div className="flex-1 overflow-y-auto px-6 py-5">
            {activeTab === "general" && (
              <div className="space-y-5">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Site Name
                  </label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="My Knowledge Base"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="w-full rounded-lg border border-input bg-muted px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground transition-all focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-primary"
                    placeholder="A brief description of your knowledge base..."
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Subdomain
                  </label>
                  <div className="flex items-center gap-0">
                    <Input
                      value={subdomain}
                      onChange={(e) => setSubdomain(e.target.value)}
                      className="rounded-r-none"
                      placeholder="docs"
                    />
                    <div className="flex h-10 items-center rounded-r-lg border border-l-0 border-input bg-slate-100 px-3 text-sm text-slate-400">
                      .screenflow.dev
                    </div>
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Custom Domain
                  </label>
                  <Input
                    value={customDomain}
                    onChange={(e) => setCustomDomain(e.target.value)}
                    placeholder="docs.yourcompany.com"
                    icon={<Globe className="h-4 w-4" />}
                  />
                  <p className="mt-1.5 text-xs text-slate-400">
                    Point your CNAME record to cname.screenflow.dev
                  </p>
                </div>
              </div>
            )}

            {activeTab === "theme" && (
              <div className="space-y-6">
                <div>
                  <label className="mb-3 block text-sm font-medium text-slate-700">
                    Primary Color
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {colorPresets.map((color) => (
                      <button
                        key={color.value}
                        onClick={() => setPrimaryColor(color.value)}
                        className={cn(
                          "relative h-9 w-9 rounded-lg transition-all",
                          primaryColor === color.value &&
                            "ring-2 ring-white ring-offset-2 ring-offset-white"
                        )}
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                      >
                        {primaryColor === color.value && (
                          <Check className="absolute inset-0 m-auto h-4 w-4 text-slate-900" />
                        )}
                      </button>
                    ))}
                    <label className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-dashed border-slate-200 text-slate-400 transition-colors hover:border-slate-400">
                      <span className="text-lg">+</span>
                      <input
                        type="color"
                        className="hidden"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                      />
                    </label>
                  </div>
                </div>

                <div>
                  <label className="mb-3 block text-sm font-medium text-slate-700">
                    Accent Color
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {colorPresets.map((color) => (
                      <button
                        key={color.value}
                        onClick={() => setAccentColor(color.value)}
                        className={cn(
                          "relative h-9 w-9 rounded-lg transition-all",
                          accentColor === color.value &&
                            "ring-2 ring-white ring-offset-2 ring-offset-white"
                        )}
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                      >
                        {accentColor === color.value && (
                          <Check className="absolute inset-0 m-auto h-4 w-4 text-slate-900" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="mb-3 block text-sm font-medium text-slate-700">Logo</label>
                  <div className="flex h-28 cursor-pointer items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50 transition-colors hover:border-slate-300">
                    <div className="text-center">
                      <Upload className="mx-auto h-6 w-6 text-slate-400" />
                      <p className="mt-2 text-xs text-slate-400">Click to upload or drag and drop</p>
                      <p className="text-[10px] text-slate-400">SVG, PNG, or JPG (max 2MB)</p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="mb-3 block text-sm font-medium text-slate-700">Font</label>
                  <div className="space-y-1.5">
                    {fontOptions.map((font) => (
                      <button
                        key={font.value}
                        onClick={() => setFontFamily(font.value)}
                        className={cn(
                          "flex w-full items-center justify-between rounded-lg border px-4 py-3 text-left transition-all",
                          fontFamily === font.value
                            ? "border-green-500/50 bg-green-500/5"
                            : "border-slate-200 hover:border-slate-200"
                        )}
                      >
                        <div>
                          <span className="text-sm font-medium text-slate-800">{font.name}</span>
                          <span className="ml-3 text-xs text-slate-400">{font.sample}</span>
                        </div>
                        {fontFamily === font.value && (
                          <Check className="h-4 w-4 text-green-600" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "access" && (
              <div className="space-y-4">
                <p className="text-sm text-slate-400">
                  Control who can view your knowledge base.
                </p>
                {authModes.map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => setAuthMode(mode.id)}
                    className={cn(
                      "flex w-full items-start gap-4 rounded-xl border p-4 text-left transition-all",
                      authMode === mode.id
                        ? "border-green-500/50 bg-green-500/5"
                        : "border-slate-200 hover:border-slate-200"
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                        authMode === mode.id ? "bg-green-500/10 text-green-600" : "bg-slate-100 text-slate-400"
                      )}
                    >
                      <mode.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-800">{mode.label}</span>
                        <div
                          className={cn(
                            "h-4 w-4 rounded-full border-2 transition-colors",
                            authMode === mode.id
                              ? "border-green-500 bg-green-500"
                              : "border-slate-300"
                          )}
                        >
                          {authMode === mode.id && (
                            <Check className="h-full w-full p-0.5 text-slate-900" />
                          )}
                        </div>
                      </div>
                      <p className="mt-0.5 text-xs text-slate-400">{mode.description}</p>
                    </div>
                  </button>
                ))}

                {authMode === "password" && (
                  <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Access Password
                    </label>
                    <Input type="password" placeholder="Enter a shared password" />
                  </div>
                )}
              </div>
            )}

            {activeTab === "seo" && (
              <div className="space-y-5">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Meta Title
                  </label>
                  <Input
                    value={metaTitle}
                    onChange={(e) => setMetaTitle(e.target.value)}
                    placeholder="Product Documentation - Your Company"
                  />
                  <p className="mt-1 text-xs text-slate-400">
                    {metaTitle.length}/60 characters recommended
                  </p>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Meta Description
                  </label>
                  <textarea
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    rows={3}
                    className="w-full rounded-lg border border-input bg-muted px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground transition-all focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-primary"
                    placeholder="A brief description for search engines..."
                  />
                  <p className="mt-1 text-xs text-slate-400">
                    {metaDescription.length}/160 characters recommended
                  </p>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    OG Image
                  </label>
                  <div className="flex h-32 cursor-pointer items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50 transition-colors hover:border-slate-300">
                    <div className="text-center">
                      <Upload className="mx-auto h-6 w-6 text-slate-400" />
                      <p className="mt-2 text-xs text-slate-400">1200 x 630px recommended</p>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Favicon
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-slate-200 bg-white">
                      <Globe className="h-5 w-5 text-slate-400" />
                    </div>
                    <Button variant="outline" size="sm">
                      <Upload className="h-3.5 w-3.5" />
                      Upload Favicon
                    </Button>
                  </div>
                </div>

                {/* SEO Preview */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Search Preview
                  </label>
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                    <div className="text-sm text-green-600">
                      {metaTitle || name || "Your Knowledge Base"} - ScreenFlow
                    </div>
                    <div className="mt-0.5 text-xs text-emerald-500">
                      {subdomain}.screenflow.dev
                    </div>
                    <div className="mt-1 text-xs leading-relaxed text-slate-400">
                      {metaDescription || description || "No description provided."}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-slate-200 px-6 py-4">
            <a
              href="#"
              className="flex items-center gap-1 text-xs text-slate-400 transition-colors hover:text-slate-700"
            >
              <ExternalLink className="h-3 w-3" />
              View live site
            </a>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={onClose}>
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  onSave?.({
                    name,
                    subdomain,
                    customDomain,
                    description,
                    primaryColor,
                    accentColor,
                    fontFamily,
                    authMode,
                    metaTitle,
                    metaDescription,
                  });
                  onClose();
                }}
              >
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
