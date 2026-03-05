"use client";

import * as React from "react";
import {
  User,
  Building2,
  Bell,
  Link2,
  Save,
  Camera,
  LogOut,
  Globe,
  Clock,
  Monitor,
  Slack,
  Github,
  Mail,
  ExternalLink,
  Check,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/lib/store/auth";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getInitials(name?: string | null, email?: string | null): string {
  if (name) return name;
  if (email) return email.charAt(0).toUpperCase();
  return "U";
}

function splitName(fullName?: string | null): [string, string] {
  if (!fullName) return ["", ""];
  const parts = fullName.trim().split(/\s+/);
  const first = parts[0] ?? "";
  const last = parts.slice(1).join(" ");
  return [first, last];
}

// ---------------------------------------------------------------------------
// Profile Tab
// ---------------------------------------------------------------------------

function ProfileTab() {
  const { user, signOut } = useAuthStore();

  const fullName = (user?.user_metadata?.full_name as string) ?? "";
  const avatarUrl = (user?.user_metadata?.avatar_url as string) ?? "";
  const email = user?.email ?? "";
  const [firstName, lastName] = splitName(fullName);

  const [form, setForm] = React.useState({
    firstName,
    lastName,
    email,
    jobTitle: "",
  });
  const [saving, setSaving] = React.useState(false);
  const [saved, setSaved] = React.useState(false);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    // Simulate save -- replace with real Supabase update
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Avatar + Identity */}
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>
            Your personal information and public profile.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-5">
            <div className="relative">
              <Avatar
                src={avatarUrl || null}
                fallback={getInitials(fullName, email)}
                size="lg"
                className="h-16 w-16 text-lg"
              />
              <button
                className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-card bg-muted text-muted-foreground transition-colors hover:bg-slate-100 hover:text-foreground"
                aria-label="Change avatar"
              >
                <Camera className="h-3.5 w-3.5" />
              </button>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                {fullName || "Your Name"}
              </p>
              <p className="text-xs text-muted-foreground">{email}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                JPG, PNG or GIF. Max 2 MB.
              </p>
            </div>
          </div>

          <Separator />

          {/* Form fields */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                First name
              </label>
              <Input
                value={form.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
                placeholder="First name"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Last name
              </label>
              <Input
                value={form.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
                placeholder="Last name"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Email</label>
            <Input
              type="email"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="you@company.com"
            />
            <p className="text-xs text-muted-foreground">
              Changing your email will require re-verification.
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Job title
            </label>
            <Input
              value={form.jobTitle}
              onChange={(e) => handleChange("jobTitle", e.target.value)}
              placeholder="e.g. Product Manager"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
              onClick={signOut}
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </Button>
            <Button size="sm" onClick={handleSave} loading={saving}>
              {saved ? (
                <>
                  <Check className="h-4 w-4" />
                  Saved
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Workspace Tab
// ---------------------------------------------------------------------------

function WorkspaceTab() {
  const [workspaceName, setWorkspaceName] = React.useState("My Workspace");
  const [saving, setSaving] = React.useState(false);
  const [saved, setSaved] = React.useState(false);

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Workspace</CardTitle>
          <CardDescription>
            General settings for your ScreenFlow workspace.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Workspace name
            </label>
            <Input
              value={workspaceName}
              onChange={(e) => {
                setWorkspaceName(e.target.value);
                setSaved(false);
              }}
              placeholder="Your workspace name"
            />
          </div>

          <Separator />

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Default language
            </label>
            <Select
              defaultValue="en"
              options={[
                { value: "en", label: "English" },
                { value: "es", label: "Spanish" },
                { value: "fr", label: "French" },
                { value: "de", label: "German" },
                { value: "pt", label: "Portuguese" },
                { value: "ja", label: "Japanese" },
              ]}
            />
            <p className="text-xs text-muted-foreground">
              Language used for auto-generated guides and captions.
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Timezone
            </label>
            <Select
              defaultValue="utc"
              options={[
                { value: "utc", label: "UTC (Coordinated Universal Time)" },
                { value: "est", label: "EST (Eastern Standard Time)" },
                { value: "cst", label: "CST (Central Standard Time)" },
                { value: "pst", label: "PST (Pacific Standard Time)" },
                { value: "gmt", label: "GMT (Greenwich Mean Time)" },
                { value: "cet", label: "CET (Central European Time)" },
              ]}
            />
          </div>

          <Separator />

          <div className="space-y-4">
            <h4 className="text-sm font-medium text-foreground">
              Recording defaults
            </h4>
            <div className="flex items-center justify-between rounded-lg border border-border p-4">
              <div className="space-y-0.5">
                <p className="text-sm font-medium text-foreground">
                  Auto-generate guide on capture
                </p>
                <p className="text-xs text-muted-foreground">
                  Automatically create a step-by-step guide when a recording
                  finishes.
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border p-4">
              <div className="space-y-0.5">
                <p className="text-sm font-medium text-foreground">
                  Include mouse click highlights
                </p>
                <p className="text-xs text-muted-foreground">
                  Show click animations in exported recordings and guides.
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border p-4">
              <div className="space-y-0.5">
                <p className="text-sm font-medium text-foreground">
                  Blur sensitive fields
                </p>
                <p className="text-xs text-muted-foreground">
                  Automatically detect and blur passwords and personal data.
                </p>
              </div>
              <Switch defaultChecked={false} />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button size="sm" onClick={handleSave} loading={saving}>
              {saved ? (
                <>
                  <Check className="h-4 w-4" />
                  Saved
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Notifications Tab
// ---------------------------------------------------------------------------

const notificationGroups = [
  {
    heading: "Activity",
    items: [
      {
        id: "recording-complete",
        title: "Recording completed",
        description:
          "Get notified when a recording finishes processing.",
        defaultChecked: true,
      },
      {
        id: "guide-published",
        title: "Guide published",
        description:
          "Get notified when a guide is published to the knowledge base.",
        defaultChecked: true,
      },
      {
        id: "comment-added",
        title: "New comment",
        description:
          "Get notified when someone comments on your recording or guide.",
        defaultChecked: true,
      },
    ],
  },
  {
    heading: "Team",
    items: [
      {
        id: "team-member",
        title: "New team member",
        description: "Get notified when someone joins your workspace.",
        defaultChecked: false,
      },
      {
        id: "mention",
        title: "Mentions",
        description: "Get notified when someone mentions you.",
        defaultChecked: true,
      },
    ],
  },
  {
    heading: "Digest",
    items: [
      {
        id: "weekly-digest",
        title: "Weekly digest",
        description:
          "Receive a weekly summary of your workspace activity.",
        defaultChecked: true,
      },
      {
        id: "product-updates",
        title: "Product updates",
        description:
          "Receive occasional emails about new features and improvements.",
        defaultChecked: false,
      },
    ],
  },
];

function NotificationsTab() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>
            Choose what you want to be notified about and how.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Delivery channel */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Notification delivery
            </label>
            <Select
              defaultValue="both"
              options={[
                { value: "email", label: "Email only" },
                { value: "in-app", label: "In-app only" },
                { value: "both", label: "Email and in-app" },
              ]}
            />
          </div>

          <Separator />

          {notificationGroups.map((group) => (
            <div key={group.heading} className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {group.heading}
              </h4>
              <div className="space-y-1">
                {group.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-lg px-3 py-3 transition-colors hover:bg-muted/30"
                  >
                    <div className="pr-4">
                      <p className="text-sm font-medium text-foreground">
                        {item.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                    <Switch defaultChecked={item.defaultChecked} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Connected Accounts Tab
// ---------------------------------------------------------------------------

interface ConnectedAccount {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  connected: boolean;
  detail?: string;
}

const connectedAccounts: ConnectedAccount[] = [
  {
    id: "slack",
    name: "Slack",
    description:
      "Post recordings and guides to Slack channels automatically.",
    icon: <Slack className="h-5 w-5" />,
    connected: true,
    detail: "Connected to #product-team",
  },
  {
    id: "github",
    name: "GitHub",
    description:
      "Attach recordings to issues and pull requests.",
    icon: <Github className="h-5 w-5" />,
    connected: false,
  },
  {
    id: "google",
    name: "Google Workspace",
    description:
      "Embed guides in Google Docs and sync with Google Drive.",
    icon: <Mail className="h-5 w-5" />,
    connected: true,
    detail: "john@company.com",
  },
  {
    id: "notion",
    name: "Notion",
    description:
      "Export guides directly to your Notion workspace.",
    icon: <Globe className="h-5 w-5" />,
    connected: false,
  },
];

function ConnectedAccountsTab() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Connected Accounts</CardTitle>
          <CardDescription>
            Manage third-party integrations and connected services.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {connectedAccounts.map((account) => (
            <div
              key={account.id}
              className="flex items-center gap-4 rounded-lg border border-border p-4 transition-colors hover:bg-muted/20"
            >
              <div
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                  account.connected
                    ? "bg-green-500/15 text-green-600"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {account.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-foreground">
                    {account.name}
                  </p>
                  {account.connected && (
                    <Badge variant="success" className="text-[10px] px-1.5 py-0">
                      Connected
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground truncate">
                  {account.connected && account.detail
                    ? account.detail
                    : account.description}
                </p>
              </div>
              <Button
                variant={account.connected ? "outline" : "secondary"}
                size="sm"
              >
                {account.connected ? (
                  "Disconnect"
                ) : (
                  <>
                    <Link2 className="h-3.5 w-3.5" />
                    Connect
                  </>
                )}
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------

const tabs = [
  { value: "profile", label: "Profile", icon: User },
  { value: "workspace", label: "Workspace", icon: Building2 },
  { value: "notifications", label: "Notifications", icon: Bell },
  { value: "connections", label: "Connections", icon: Link2 },
] as const;

export default function SettingsPage() {
  const { user, loading } = useAuthStore();

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Settings
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your account, workspace, and application preferences.
        </p>
      </div>

      {/* Tabs layout */}
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="w-full sm:w-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <TabsTrigger key={tab.value} value={tab.value}>
                <Icon className="mr-1.5 h-3.5 w-3.5" />
                {tab.label}
              </TabsTrigger>
            );
          })}
        </TabsList>

        <TabsContent value="profile">
          <ProfileTab />
        </TabsContent>

        <TabsContent value="workspace">
          <WorkspaceTab />
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationsTab />
        </TabsContent>

        <TabsContent value="connections">
          <ConnectedAccountsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
