import { createMiddleware } from 'hono/factory';

// ── Types ──────────────────────────────────────────────

export type PlanTier = 'free' | 'starter' | 'pro' | 'enterprise';

export interface PlanLimits {
  maxRecordings: number;
  maxRecordingDurationMs: number;
  maxStorageBytes: number;
  maxMembers: number;
  customBranding: boolean;
  advancedAnalytics: boolean;
  ssoEnabled: boolean;
  apiAccess: boolean;
  whiteLabel: boolean;
  prioritySupport: boolean;
}

const PLAN_LIMITS: Record<PlanTier, PlanLimits> = {
  free: {
    maxRecordings: 25,
    maxRecordingDurationMs: 5 * 60 * 1000, // 5 min
    maxStorageBytes: 1 * 1024 * 1024 * 1024, // 1 GB
    maxMembers: 1,
    customBranding: false,
    advancedAnalytics: false,
    ssoEnabled: false,
    apiAccess: false,
    whiteLabel: false,
    prioritySupport: false,
  },
  starter: {
    maxRecordings: 100,
    maxRecordingDurationMs: 30 * 60 * 1000, // 30 min
    maxStorageBytes: 10 * 1024 * 1024 * 1024, // 10 GB
    maxMembers: 5,
    customBranding: false,
    advancedAnalytics: false,
    ssoEnabled: false,
    apiAccess: true,
    whiteLabel: false,
    prioritySupport: false,
  },
  pro: {
    maxRecordings: -1, // unlimited
    maxRecordingDurationMs: 2 * 60 * 60 * 1000, // 2 hours
    maxStorageBytes: 100 * 1024 * 1024 * 1024, // 100 GB
    maxMembers: 25,
    customBranding: true,
    advancedAnalytics: true,
    ssoEnabled: false,
    apiAccess: true,
    whiteLabel: false,
    prioritySupport: true,
  },
  enterprise: {
    maxRecordings: -1,
    maxRecordingDurationMs: 2 * 60 * 60 * 1000,
    maxStorageBytes: -1, // unlimited
    maxMembers: -1,
    customBranding: true,
    advancedAnalytics: true,
    ssoEnabled: true,
    apiAccess: true,
    whiteLabel: true,
    prioritySupport: true,
  },
};

declare module 'hono' {
  interface ContextVariableMap {
    plan: PlanTier;
    planLimits: PlanLimits;
  }
}

// ── Helpers ────────────────────────────────────────────

export function getLimitsForPlan(tier: PlanTier): PlanLimits {
  return PLAN_LIMITS[tier];
}

// ── Middleware ──────────────────────────────────────────

/**
 * Plan-based feature gating middleware.
 *
 * Looks up the workspace's current plan and attaches the tier + limits
 * to the context. Optionally accepts a feature key to gate; if the
 * workspace plan does not include that feature the request is rejected.
 */
export function planGuard(requiredFeature?: keyof PlanLimits) {
  return createMiddleware(async (c, next) => {
    const workspace = c.get('workspace');
    if (!workspace) {
      return c.json({ error: 'Workspace context required' }, 400);
    }

    // TODO: Replace with actual DB lookup of workspace subscription
    const plan = await lookupWorkspacePlan(workspace.workspaceId);

    const limits = getLimitsForPlan(plan);

    c.set('plan', plan);
    c.set('planLimits', limits);

    if (requiredFeature) {
      const value = limits[requiredFeature];

      // Boolean features: must be true
      if (typeof value === 'boolean' && !value) {
        return c.json(
          {
            error: `Feature "${requiredFeature}" requires a higher plan`,
            currentPlan: plan,
            requiredFeature,
          },
          403,
        );
      }

      // Numeric limits: -1 means unlimited, 0 means disabled
      if (typeof value === 'number' && value === 0) {
        return c.json(
          {
            error: `Feature "${requiredFeature}" is not available on your plan`,
            currentPlan: plan,
            requiredFeature,
          },
          403,
        );
      }
    }

    await next();
  });
}

/**
 * Simple middleware that just attaches the plan without gating.
 */
export const attachPlan = createMiddleware(async (c, next) => {
  const workspace = c.get('workspace');
  if (workspace) {
    const plan = await lookupWorkspacePlan(workspace.workspaceId);
    c.set('plan', plan);
    c.set('planLimits', getLimitsForPlan(plan));
  }
  await next();
});

// ── Stub ───────────────────────────────────────────────

/**
 * Placeholder plan lookup.
 * Replace with a real DB / Stripe query once billing is wired up.
 */
async function lookupWorkspacePlan(
  _workspaceId: string,
): Promise<PlanTier> {
  // TODO: Wire to billing/subscription table
  return 'free';
}
