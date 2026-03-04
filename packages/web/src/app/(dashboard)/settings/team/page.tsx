"use client";

import {
  Plus,
  MoreVertical,
  Mail,
  Shield,
  UserMinus,
  Crown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "owner" | "admin" | "editor" | "viewer";
  avatar?: string;
  joinedAt: string;
}

const members: TeamMember[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@company.com",
    role: "owner",
    joinedAt: "Jan 2025",
  },
  {
    id: "2",
    name: "Sarah Chen",
    email: "sarah@company.com",
    role: "admin",
    joinedAt: "Feb 2025",
  },
  {
    id: "3",
    name: "Mike Johnson",
    email: "mike@company.com",
    role: "editor",
    joinedAt: "Mar 2025",
  },
  {
    id: "4",
    name: "Emily Park",
    email: "emily@company.com",
    role: "editor",
    joinedAt: "Mar 2025",
  },
  {
    id: "5",
    name: "Alex Rivera",
    email: "alex@company.com",
    role: "viewer",
    joinedAt: "Apr 2025",
  },
];

const roleConfig: Record<string, { variant: "default" | "success" | "secondary" | "warning"; label: string }> = {
  owner: { variant: "warning", label: "Owner" },
  admin: { variant: "default", label: "Admin" },
  editor: { variant: "success", label: "Editor" },
  viewer: { variant: "secondary", label: "Viewer" },
};

export default function TeamPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Team Management
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Invite members and manage team roles.
        </p>
      </div>

      {/* Invite */}
      <Card>
        <CardHeader>
          <CardTitle>Invite Members</CardTitle>
          <CardDescription>
            Invite people to your workspace by email.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <div className="flex-1">
              <Input
                type="email"
                placeholder="Enter email address..."
                icon={<Mail className="h-4 w-4" />}
              />
            </div>
            <Button size="md">
              <Plus className="h-4 w-4" />
              Send Invite
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Members List */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Team Members</CardTitle>
            <CardDescription>{members.length} members</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {members.map((member) => {
              const role = roleConfig[member.role];
              return (
                <div
                  key={member.id}
                  className="flex items-center gap-4 rounded-lg p-3 transition-colors hover:bg-muted/30"
                >
                  <Avatar fallback={member.name} size="md" />
                  <div className="flex-1 overflow-hidden">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-medium text-foreground">
                        {member.name}
                      </p>
                      {member.role === "owner" && (
                        <Crown className="h-3.5 w-3.5 text-amber-400" />
                      )}
                    </div>
                    <p className="truncate text-xs text-muted-foreground">
                      {member.email}
                    </p>
                  </div>
                  <span className="text-xs text-zinc-500">
                    Joined {member.joinedAt}
                  </span>
                  <Badge variant={role.variant}>{role.label}</Badge>

                  {member.role !== "owner" && (
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <button className="rounded-md p-1 text-zinc-500 transition-colors hover:bg-muted hover:text-foreground">
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>
                          <Shield className="h-3.5 w-3.5" />
                          Change Role
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem destructive>
                          <UserMinus className="h-3.5 w-3.5" />
                          Remove Member
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
