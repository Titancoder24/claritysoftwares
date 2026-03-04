import { createMiddleware } from 'hono/factory';
import type { MemberRole } from '@screenflow/shared/constants';

// ── Types ──────────────────────────────────────────────

export interface WorkspaceMembership {
  workspaceId: string;
  userId: string;
  role: MemberRole;
}

declare module 'hono' {
  interface ContextVariableMap {
    workspace: WorkspaceMembership;
  }
}

// ── Middleware ──────────────────────────────────────────

/**
 * Workspace membership middleware.
 *
 * Expects a `:workspaceId` route param and a previously-authenticated user
 * from the auth middleware. Verifies the user is a member of the workspace
 * and stores the membership info on the context.
 *
 * Optionally accepts a list of allowed roles. If provided, only members
 * with one of those roles will be permitted.
 */
export function workspaceMiddleware(allowedRoles?: MemberRole[]) {
  return createMiddleware(async (c, next) => {
    const user = c.get('user');
    if (!user) {
      return c.json({ error: 'Authentication required' }, 401);
    }

    const workspaceId = c.req.param('workspaceId');
    if (!workspaceId) {
      return c.json({ error: 'Workspace ID is required' }, 400);
    }

    // TODO: Replace with actual DB query via drizzle
    // const membership = await db.query.workspaceMembers.findFirst({
    //   where: and(
    //     eq(workspaceMembers.workspaceId, workspaceId),
    //     eq(workspaceMembers.userId, user.sub),
    //   ),
    // });

    // Stub: In production this queries the workspace_members table
    const membership: WorkspaceMembership | null = await lookupMembership(
      workspaceId,
      user.sub,
    );

    if (!membership) {
      return c.json({ error: 'Not a member of this workspace' }, 403);
    }

    if (allowedRoles && !allowedRoles.includes(membership.role)) {
      return c.json(
        { error: `Requires one of: ${allowedRoles.join(', ')}` },
        403,
      );
    }

    c.set('workspace', membership);
    await next();
  });
}

// ── Stub ───────────────────────────────────────────────

/**
 * Placeholder membership lookup.
 * Replace with a real Drizzle query once the DB package is wired up.
 */
async function lookupMembership(
  workspaceId: string,
  userId: string,
): Promise<WorkspaceMembership | null> {
  // TODO: Wire to @screenflow/db
  // For now, return null so all requests are rejected until the DB is connected
  void workspaceId;
  void userId;
  return null;
}
