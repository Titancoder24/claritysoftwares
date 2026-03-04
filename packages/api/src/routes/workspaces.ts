import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { authMiddleware } from '../middleware/auth';
import { workspaceMiddleware } from '../middleware/workspace';
import { MemberRole } from '@screenflow/shared/constants';

const workspaces = new Hono();

// Apply auth to all routes
workspaces.use('*', authMiddleware);

// ── Schemas ────────────────────────────────────────────

const createWorkspaceSchema = z.object({
  name: z.string().min(1).max(64),
  slug: z
    .string()
    .min(2)
    .max(48)
    .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
});

const updateWorkspaceSchema = z.object({
  name: z.string().min(1).max(64).optional(),
  slug: z
    .string()
    .min(2)
    .max(48)
    .regex(/^[a-z0-9-]+$/)
    .optional(),
  logoUrl: z.string().url().nullable().optional(),
  settings: z
    .object({
      defaultProjectType: z.enum(['video', 'guide', 'walkthrough']).optional(),
      brandColor: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
    })
    .optional(),
});

const inviteMemberSchema = z.object({
  email: z.string().email(),
  role: z.nativeEnum(MemberRole).refine((r) => r !== MemberRole.Owner, {
    message: 'Cannot invite as owner',
  }),
});

const updateMemberSchema = z.object({
  role: z.nativeEnum(MemberRole).refine((r) => r !== MemberRole.Owner, {
    message: 'Cannot assign owner role',
  }),
});

// ── Workspace CRUD ─────────────────────────────────────

/**
 * GET /workspaces
 * List workspaces the authenticated user belongs to.
 */
workspaces.get('/', async (c) => {
  const user = c.get('user');

  try {
    // TODO: Query workspaces via membership table
    void user;
    return c.json({ workspaces: [] });
  } catch (err) {
    console.error('[workspaces] List error:', err);
    return c.json({ error: 'Failed to list workspaces' }, 500);
  }
});

/**
 * POST /workspaces
 * Create a new workspace. The creator becomes the owner.
 */
workspaces.post('/', zValidator('json', createWorkspaceSchema), async (c) => {
  const user = c.get('user');
  const body = c.req.valid('json');

  try {
    // TODO: Check slug uniqueness
    // TODO: Insert workspace
    // TODO: Insert workspace_member (owner)

    const workspaceId = crypto.randomUUID();

    return c.json(
      {
        workspace: {
          id: workspaceId,
          name: body.name,
          slug: body.slug,
          ownerId: user.sub,
          createdAt: new Date().toISOString(),
        },
      },
      201,
    );
  } catch (err) {
    console.error('[workspaces] Create error:', err);
    return c.json({ error: 'Failed to create workspace' }, 500);
  }
});

/**
 * GET /workspaces/:workspaceId
 * Get workspace details.
 */
workspaces.get('/:workspaceId', workspaceMiddleware(), async (c) => {
  const workspaceId = c.req.param('workspaceId');

  try {
    // TODO: Fetch workspace from DB
    void workspaceId;
    return c.json({ workspace: null });
  } catch (err) {
    console.error('[workspaces] Get error:', err);
    return c.json({ error: 'Failed to get workspace' }, 500);
  }
});

/**
 * PATCH /workspaces/:workspaceId
 * Update workspace settings. Requires admin or owner role.
 */
workspaces.patch(
  '/:workspaceId',
  workspaceMiddleware([MemberRole.Owner, MemberRole.Admin]),
  zValidator('json', updateWorkspaceSchema),
  async (c) => {
    const workspaceId = c.req.param('workspaceId');
    const body = c.req.valid('json');

    try {
      // TODO: Update workspace in DB
      void workspaceId;
      void body;
      return c.json({ workspace: null, message: 'Workspace updated' });
    } catch (err) {
      console.error('[workspaces] Update error:', err);
      return c.json({ error: 'Failed to update workspace' }, 500);
    }
  },
);

/**
 * DELETE /workspaces/:workspaceId
 * Delete a workspace. Owner only.
 */
workspaces.delete(
  '/:workspaceId',
  workspaceMiddleware([MemberRole.Owner]),
  async (c) => {
    const workspaceId = c.req.param('workspaceId');

    try {
      // TODO: Soft delete workspace + cascade
      void workspaceId;
      return c.json({ message: 'Workspace deleted' });
    } catch (err) {
      console.error('[workspaces] Delete error:', err);
      return c.json({ error: 'Failed to delete workspace' }, 500);
    }
  },
);

// ── Members ────────────────────────────────────────────

/**
 * GET /workspaces/:workspaceId/members
 * List members of a workspace.
 */
workspaces.get('/:workspaceId/members', workspaceMiddleware(), async (c) => {
  const workspaceId = c.req.param('workspaceId');

  try {
    // TODO: Query members with user profiles
    void workspaceId;
    return c.json({ members: [] });
  } catch (err) {
    console.error('[workspaces] List members error:', err);
    return c.json({ error: 'Failed to list members' }, 500);
  }
});

/**
 * POST /workspaces/:workspaceId/members
 * Invite a new member to the workspace.
 */
workspaces.post(
  '/:workspaceId/members',
  workspaceMiddleware([MemberRole.Owner, MemberRole.Admin]),
  zValidator('json', inviteMemberSchema),
  async (c) => {
    const workspaceId = c.req.param('workspaceId');
    const body = c.req.valid('json');

    try {
      // TODO: Check plan limits for member count
      // TODO: Create invitation record
      // TODO: Send invitation email

      void workspaceId;

      return c.json(
        {
          invitation: {
            email: body.email,
            role: body.role,
            status: 'pending',
          },
          message: 'Invitation sent',
        },
        201,
      );
    } catch (err) {
      console.error('[workspaces] Invite member error:', err);
      return c.json({ error: 'Failed to invite member' }, 500);
    }
  },
);

/**
 * PATCH /workspaces/:workspaceId/members/:memberId
 * Update a member's role.
 */
workspaces.patch(
  '/:workspaceId/members/:memberId',
  workspaceMiddleware([MemberRole.Owner, MemberRole.Admin]),
  zValidator('json', updateMemberSchema),
  async (c) => {
    const workspaceId = c.req.param('workspaceId');
    const memberId = c.req.param('memberId');
    const body = c.req.valid('json');

    try {
      // TODO: Verify can't demote owner
      // TODO: Update member role in DB
      void workspaceId;
      void memberId;
      void body;
      return c.json({ message: 'Member role updated' });
    } catch (err) {
      console.error('[workspaces] Update member error:', err);
      return c.json({ error: 'Failed to update member role' }, 500);
    }
  },
);

/**
 * DELETE /workspaces/:workspaceId/members/:memberId
 * Remove a member from the workspace.
 */
workspaces.delete(
  '/:workspaceId/members/:memberId',
  workspaceMiddleware([MemberRole.Owner, MemberRole.Admin]),
  async (c) => {
    const workspaceId = c.req.param('workspaceId');
    const memberId = c.req.param('memberId');

    try {
      // TODO: Verify can't remove owner
      // TODO: Remove member from DB
      void workspaceId;
      void memberId;
      return c.json({ message: 'Member removed' });
    } catch (err) {
      console.error('[workspaces] Remove member error:', err);
      return c.json({ error: 'Failed to remove member' }, 500);
    }
  },
);

export default workspaces;
