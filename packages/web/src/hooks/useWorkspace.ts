"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api-client";

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  plan: "free" | "pro" | "team" | "enterprise";
  memberCount: number;
  createdAt: string;
}

export function useWorkspace() {
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchWorkspace() {
      try {
        const data = await api.get<Workspace>("/api/workspace/current");
        if (!cancelled) setWorkspace(data);
      } catch {
        if (!cancelled) setWorkspace(null);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchWorkspace();
    return () => {
      cancelled = true;
    };
  }, []);

  return { workspace, isLoading };
}
