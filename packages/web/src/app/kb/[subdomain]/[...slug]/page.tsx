import React from "react";
import {
  BookOpen,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  FileText,
  Video,
  Layers,
  Search,
  ExternalLink,
  Clock,
  Eye,
  ThumbsUp,
  ThumbsDown,
  Hash,
  Zap,
  Settings,
  Plug,
  Shield,
  CreditCard,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types & Mock Data                                                  */
/* ------------------------------------------------------------------ */

interface TOCItem {
  id: string;
  title: string;
  level: number;
}

interface NavLink {
  title: string;
  slug: string;
}

interface SidebarCategory {
  id: string;
  name: string;
  slug: string;
  icon: string;
  pages: { title: string; slug: string; active?: boolean }[];
}

const sidebarCategories: SidebarCategory[] = [
  {
    id: "cat-1",
    name: "Getting Started",
    slug: "getting-started",
    icon: "zap",
    pages: [
      { title: "Quick Start Guide", slug: "getting-started/quick-start" },
      { title: "Installation", slug: "getting-started/installation" },
      { title: "First Recording", slug: "getting-started/first-recording" },
      { title: "System Requirements", slug: "getting-started/system-requirements" },
    ],
  },
  {
    id: "cat-2",
    name: "Recording",
    slug: "recording",
    icon: "video",
    pages: [
      { title: "Screen Recording Basics", slug: "recording/basics" },
      { title: "Advanced Options", slug: "recording/advanced" },
    ],
  },
  {
    id: "cat-3",
    name: "Editing & Export",
    slug: "editing-export",
    icon: "settings",
    pages: [
      { title: "Video Editor", slug: "editing-export/video-editor" },
      { title: "Export Formats", slug: "editing-export/export-formats" },
    ],
  },
  {
    id: "cat-4",
    name: "Integrations",
    slug: "integrations",
    icon: "plug",
    pages: [
      { title: "REST API", slug: "integrations/rest-api" },
      { title: "Webhooks", slug: "integrations/webhooks" },
      { title: "Slack", slug: "integrations/slack" },
    ],
  },
  {
    id: "cat-5",
    name: "Security",
    slug: "security",
    icon: "shield",
    pages: [
      { title: "Data Encryption", slug: "security/encryption" },
      { title: "SSO Setup", slug: "security/sso" },
    ],
  },
  {
    id: "cat-6",
    name: "Account & Billing",
    slug: "account-billing",
    icon: "creditcard",
    pages: [
      { title: "Plans & Pricing", slug: "account-billing/plans" },
      { title: "Team Management", slug: "account-billing/team" },
    ],
  },
];

const tocItems: TOCItem[] = [
  { id: "overview", title: "Overview", level: 2 },
  { id: "prerequisites", title: "Prerequisites", level: 2 },
  { id: "step-1", title: "Step 1: Install the extension", level: 2 },
  { id: "step-2", title: "Step 2: Configure settings", level: 2 },
  { id: "configuration-options", title: "Configuration Options", level: 3 },
  { id: "step-3", title: "Step 3: Start recording", level: 2 },
  { id: "keyboard-shortcuts", title: "Keyboard Shortcuts", level: 3 },
  { id: "troubleshooting", title: "Troubleshooting", level: 2 },
  { id: "next-steps", title: "Next Steps", level: 2 },
];

const iconMap: Record<string, React.ElementType> = {
  zap: Zap,
  video: Video,
  settings: Settings,
  plug: Plug,
  shield: Shield,
  creditcard: CreditCard,
};

/* ------------------------------------------------------------------ */
/*  Sidebar Navigation                                                 */
/* ------------------------------------------------------------------ */

function SidebarNav({
  categories,
  subdomain,
  currentSlug,
}: {
  categories: SidebarCategory[];
  subdomain: string;
  currentSlug: string;
}) {
  return (
    <nav className="space-y-4">
      {categories.map((cat) => {
        const Icon = iconMap[cat.icon] || BookOpen;
        const isActiveCategory = currentSlug.startsWith(cat.slug);

        return (
          <div key={cat.id}>
            <a
              href={`/kb/${subdomain}/${cat.slug}`}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
                isActiveCategory ? "text-green-600" : "text-slate-400 hover:text-slate-700"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {cat.name}
            </a>
            <div className="mt-1 space-y-0.5 pl-3">
              {cat.pages.map((page) => {
                const isActive = currentSlug === page.slug;
                return (
                  <a
                    key={page.slug}
                    href={`/kb/${subdomain}/${page.slug}`}
                    className={`block rounded-md px-3 py-1.5 text-sm transition-colors ${
                      isActive
                        ? "bg-indigo-500/10 text-green-600 font-medium"
                        : "text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                    }`}
                  >
                    {page.title}
                  </a>
                );
              })}
            </div>
          </div>
        );
      })}
    </nav>
  );
}

/* ------------------------------------------------------------------ */
/*  Table of Contents                                                  */
/* ------------------------------------------------------------------ */

function TableOfContents({ items }: { items: TOCItem[] }) {
  return (
    <div className="space-y-1">
      <div className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
        On this page
      </div>
      {items.map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          className={`block rounded-md py-1 text-xs transition-colors hover:text-slate-900 ${
            item.level === 3 ? "pl-4 text-slate-400" : "pl-0 text-slate-500"
          }`}
        >
          {item.title}
        </a>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Article Content (mock server-rendered)                             */
/* ------------------------------------------------------------------ */

function ArticleContent() {
  return (
    <div className="prose-custom">
      <h2 id="overview" className="mb-4 mt-0 text-xl font-semibold text-slate-900">
        Overview
      </h2>
      <p className="mb-6 leading-relaxed text-slate-500">
        This guide will walk you through the complete setup process for ScreenFlow.
        By the end of this guide, you will have the extension installed, configured
        to your preferences, and be ready to create your first screen recording.
      </p>

      <div className="mb-6 rounded-xl border border-green-500/20 bg-green-500/5 p-4">
        <div className="flex gap-3">
          <Zap className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
          <div>
            <div className="text-sm font-medium text-green-700">Quick Tip</div>
            <p className="mt-1 text-sm text-slate-500">
              If you have already installed the extension, you can skip directly to{" "}
              <a href="#step-2" className="text-green-600 underline underline-offset-2">
                Step 2: Configure settings
              </a>
              .
            </p>
          </div>
        </div>
      </div>

      <h2 id="prerequisites" className="mb-4 mt-10 text-xl font-semibold text-slate-900">
        Prerequisites
      </h2>
      <ul className="mb-6 space-y-2 text-slate-500">
        <li className="flex items-start gap-2.5">
          <ChevronRight className="mt-1 h-3.5 w-3.5 shrink-0 text-green-600/50" />
          <span>A modern web browser (Chrome 90+, Firefox 88+, or Edge 90+)</span>
        </li>
        <li className="flex items-start gap-2.5">
          <ChevronRight className="mt-1 h-3.5 w-3.5 shrink-0 text-green-600/50" />
          <span>A ScreenFlow account (free tier available)</span>
        </li>
        <li className="flex items-start gap-2.5">
          <ChevronRight className="mt-1 h-3.5 w-3.5 shrink-0 text-green-600/50" />
          <span>Microphone access (optional, for audio recording)</span>
        </li>
      </ul>

      <h2 id="step-1" className="mb-4 mt-10 text-xl font-semibold text-slate-900">
        Step 1: Install the Extension
      </h2>
      <p className="mb-4 leading-relaxed text-slate-500">
        Visit the Chrome Web Store and search for &quot;ScreenFlow&quot; or click the direct
        installation link below. Click the &quot;Add to Chrome&quot; button to install the
        extension.
      </p>

      {/* Mock code block */}
      <div className="mb-6 overflow-hidden rounded-lg border border-slate-200">
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-2">
          <span className="text-xs text-slate-400">Terminal</span>
          <button className="text-[10px] text-slate-400 transition-colors hover:text-slate-500">
            Copy
          </button>
        </div>
        <pre className="overflow-x-auto bg-slate-50 px-4 py-3">
          <code className="text-sm text-slate-700">
            <span className="text-slate-400">$</span>{" "}
            <span className="text-emerald-400">npm</span> install @screenflow/sdk
          </code>
        </pre>
      </div>

      <h2 id="step-2" className="mb-4 mt-10 text-xl font-semibold text-slate-900">
        Step 2: Configure Settings
      </h2>
      <p className="mb-4 leading-relaxed text-slate-500">
        After installation, click the ScreenFlow icon in your browser toolbar to open
        the settings panel. Here you can configure recording quality, audio sources,
        and keyboard shortcuts.
      </p>

      <h3
        id="configuration-options"
        className="mb-3 mt-8 text-lg font-semibold text-slate-800"
      >
        Configuration Options
      </h3>

      {/* Mock table */}
      <div className="mb-6 overflow-hidden rounded-lg border border-slate-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500">
                Option
              </th>
              <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500">
                Default
              </th>
              <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500">
                Description
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50">
            <tr>
              <td className="px-4 py-2.5 font-mono text-xs text-green-600">quality</td>
              <td className="px-4 py-2.5 text-xs text-slate-400">1080p</td>
              <td className="px-4 py-2.5 text-xs text-slate-500">
                Recording resolution (720p, 1080p, 4K)
              </td>
            </tr>
            <tr>
              <td className="px-4 py-2.5 font-mono text-xs text-green-600">fps</td>
              <td className="px-4 py-2.5 text-xs text-slate-400">30</td>
              <td className="px-4 py-2.5 text-xs text-slate-500">
                Frames per second (24, 30, 60)
              </td>
            </tr>
            <tr>
              <td className="px-4 py-2.5 font-mono text-xs text-green-600">audio</td>
              <td className="px-4 py-2.5 text-xs text-slate-400">true</td>
              <td className="px-4 py-2.5 text-xs text-slate-500">
                Enable microphone recording
              </td>
            </tr>
            <tr>
              <td className="px-4 py-2.5 font-mono text-xs text-green-600">systemAudio</td>
              <td className="px-4 py-2.5 text-xs text-slate-400">false</td>
              <td className="px-4 py-2.5 text-xs text-slate-500">
                Capture system/tab audio
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="step-3" className="mb-4 mt-10 text-xl font-semibold text-slate-900">
        Step 3: Start Recording
      </h2>
      <p className="mb-4 leading-relaxed text-slate-500">
        Click the record button or use the keyboard shortcut to begin capturing your
        screen. You can choose to record the entire screen, a specific window, or a
        custom area.
      </p>

      <h3 id="keyboard-shortcuts" className="mb-3 mt-8 text-lg font-semibold text-slate-800">
        Keyboard Shortcuts
      </h3>
      <div className="mb-6 space-y-2">
        {[
          { keys: "Ctrl + Shift + R", desc: "Start/Stop recording" },
          { keys: "Ctrl + Shift + P", desc: "Pause/Resume recording" },
          { keys: "Ctrl + Shift + S", desc: "Screenshot" },
        ].map((shortcut) => (
          <div
            key={shortcut.keys}
            className="flex items-center justify-between rounded-lg border border-slate-200 bg-white/30 px-4 py-2.5"
          >
            <span className="text-sm text-slate-500">{shortcut.desc}</span>
            <kbd className="rounded-md border border-slate-200 bg-slate-100 px-2.5 py-1 font-mono text-xs text-slate-700">
              {shortcut.keys}
            </kbd>
          </div>
        ))}
      </div>

      <h2 id="troubleshooting" className="mb-4 mt-10 text-xl font-semibold text-slate-900">
        Troubleshooting
      </h2>
      <p className="mb-4 leading-relaxed text-slate-500">
        If you encounter issues during setup, try the following solutions:
      </p>
      <div className="mb-6 space-y-3">
        {[
          {
            q: "Extension not appearing in toolbar",
            a: 'Click the puzzle icon in Chrome and pin the ScreenFlow extension.',
          },
          {
            q: "Microphone not detected",
            a: "Check your browser permissions and ensure microphone access is allowed.",
          },
          {
            q: "Recording quality is low",
            a: "Verify your quality settings and ensure hardware acceleration is enabled.",
          },
        ].map((item) => (
          <details
            key={item.q}
            className="group rounded-lg border border-slate-200 bg-white/20"
          >
            <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:text-slate-900">
              {item.q}
            </summary>
            <p className="border-t border-slate-200/30 px-4 py-3 text-sm text-slate-400">
              {item.a}
            </p>
          </details>
        ))}
      </div>

      <h2 id="next-steps" className="mb-4 mt-10 text-xl font-semibold text-slate-900">
        Next Steps
      </h2>
      <p className="mb-4 leading-relaxed text-slate-500">
        Now that you have ScreenFlow set up, explore these guides to make the most of
        your recordings:
      </p>
      <div className="grid grid-cols-2 gap-3">
        {[
          { title: "Recording Best Practices", icon: Video },
          { title: "Editing Your First Video", icon: Layers },
        ].map((card) => (
          <a
            key={card.title}
            href="#"
            className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white/20 p-4 transition-all hover:border-slate-300 hover:bg-white/40"
          >
            <card.icon className="h-5 w-5 text-green-600" />
            <div>
              <div className="text-sm font-medium text-slate-800">{card.title}</div>
              <div className="text-xs text-slate-400">Read guide</div>
            </div>
            <ArrowRight className="ml-auto h-4 w-4 text-slate-300" />
          </a>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page Component                                                     */
/* ------------------------------------------------------------------ */

export default async function PublicKBPage({
  params,
}: {
  params: Promise<{ subdomain: string; slug: string[] }>;
}) {
  const { subdomain, slug } = await params;
  const currentSlug = slug.join("/");

  const pageTitle = "Quick Start Guide";
  const categoryName = "Getting Started";
  const readTime = "5 min read";
  const lastUpdated = "Updated 3 days ago";

  const prevPage: NavLink = { title: "Installation", slug: "getting-started/installation" };
  const nextPage: NavLink = {
    title: "First Recording",
    slug: "getting-started/first-recording",
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-slate-900">
      {/* Header */}
      <header className="border-b border-slate-200">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <a href={`/kb/${subdomain}`} className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-green-500 to-emerald-500">
                <BookOpen className="h-4 w-4 text-slate-900" />
              </div>
              <span className="text-sm font-semibold text-slate-900">ScreenFlow Docs</span>
            </a>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search..."
                className="h-9 w-56 rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm text-slate-800 placeholder:text-slate-400 transition-all focus:border-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-300"
              />
              <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded border border-slate-200 bg-slate-100 px-1.5 py-0.5 text-[9px] text-slate-400">
                /
              </kbd>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl">
        {/* Left Sidebar */}
        <aside className="hidden w-64 shrink-0 border-r border-slate-200 lg:block">
          <div className="sticky top-0 h-[calc(100vh-64px)] overflow-y-auto px-4 py-6">
            <SidebarNav
              categories={sidebarCategories}
              subdomain={subdomain}
              currentSlug={currentSlug}
            />
          </div>
        </aside>

        {/* Main Content */}
        <main className="min-w-0 flex-1 px-8 py-8 lg:px-12">
          {/* Breadcrumbs */}
          <nav className="mb-6 flex items-center gap-1.5 text-xs text-slate-400">
            <a
              href={`/kb/${subdomain}`}
              className="transition-colors hover:text-slate-700"
            >
              Home
            </a>
            <ChevronRight className="h-3 w-3" />
            <a href="#" className="transition-colors hover:text-slate-700">
              {categoryName}
            </a>
            <ChevronRight className="h-3 w-3" />
            <span className="text-slate-700">{pageTitle}</span>
          </nav>

          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              {pageTitle}
            </h1>
            <div className="mt-3 flex items-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                {readTime}
              </span>
              <span>{lastUpdated}</span>
              <span className="flex items-center gap-1.5">
                <Eye className="h-3.5 w-3.5" />
                2,847 views
              </span>
            </div>
          </div>

          {/* Article Content */}
          <ArticleContent />

          {/* Feedback */}
          <div className="mt-12 rounded-xl border border-slate-200 bg-white/20 p-6 text-center">
            <p className="text-sm text-slate-500">Was this article helpful?</p>
            <div className="mt-3 flex items-center justify-center gap-3">
              <button className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-500 transition-all hover:border-emerald-500/30 hover:bg-emerald-500/5 hover:text-emerald-400">
                <ThumbsUp className="h-4 w-4" />
                Yes
              </button>
              <button className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-500 transition-all hover:border-red-500/30 hover:bg-red-500/5 hover:text-red-400">
                <ThumbsDown className="h-4 w-4" />
                No
              </button>
            </div>
          </div>

          {/* Prev / Next Navigation */}
          <div className="mt-8 grid grid-cols-2 gap-4">
            <a
              href={`/kb/${subdomain}/${prevPage.slug}`}
              className="group rounded-xl border border-slate-200 p-4 transition-all hover:border-slate-300 hover:bg-white/30"
            >
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <ChevronLeft className="h-3 w-3" />
                Previous
              </div>
              <div className="mt-1 text-sm font-medium text-slate-700 transition-colors group-hover:text-green-600">
                {prevPage.title}
              </div>
            </a>
            <a
              href={`/kb/${subdomain}/${nextPage.slug}`}
              className="group rounded-xl border border-slate-200 p-4 text-right transition-all hover:border-slate-300 hover:bg-white/30"
            >
              <div className="flex items-center justify-end gap-1.5 text-xs text-slate-400">
                Next
                <ChevronRight className="h-3 w-3" />
              </div>
              <div className="mt-1 text-sm font-medium text-slate-700 transition-colors group-hover:text-green-600">
                {nextPage.title}
              </div>
            </a>
          </div>
        </main>

        {/* Right Sidebar - Table of Contents */}
        <aside className="hidden w-52 shrink-0 xl:block">
          <div className="sticky top-0 px-4 py-8">
            <TableOfContents items={tocItems} />
          </div>
        </aside>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <div className="flex h-5 w-5 items-center justify-center rounded bg-gradient-to-br from-green-500 to-emerald-500">
              <BookOpen className="h-3 w-3 text-slate-900" />
            </div>
            Powered by ScreenFlow
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <a href="#" className="transition-colors hover:text-slate-500">Status</a>
            <a href="#" className="transition-colors hover:text-slate-500">Privacy</a>
            <a href="#" className="transition-colors hover:text-slate-500">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
