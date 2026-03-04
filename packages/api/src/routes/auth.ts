import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { authMiddleware } from '../middleware/auth';

const auth = new Hono();

// ── Schemas ────────────────────────────────────────────

const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  fullName: z.string().min(1, 'Full name is required').max(128),
  workspaceName: z.string().min(1).max(64).optional(),
});

const callbackSchema = z.object({
  code: z.string().min(1, 'Authorization code is required'),
  provider: z.enum(['google', 'github']).optional(),
});

// ── Routes ─────────────────────────────────────────────

/**
 * POST /auth/signup
 * Register a new user via email/password.
 * Creates the Supabase user and a default workspace.
 */
auth.post('/signup', zValidator('json', signupSchema), async (c) => {
  const body = c.req.valid('json');

  try {
    // TODO: Wire to Supabase Admin API
    // const { data, error } = await supabase.auth.admin.createUser({
    //   email: body.email,
    //   password: body.password,
    //   user_metadata: { full_name: body.fullName },
    // });

    const userId = crypto.randomUUID();

    // TODO: Create default workspace
    // TODO: Create workspace membership (owner)
    // TODO: Send welcome email

    return c.json(
      {
        user: {
          id: userId,
          email: body.email,
          fullName: body.fullName,
        },
        message: 'Account created successfully',
      },
      201,
    );
  } catch (err) {
    console.error('[auth/signup] Error:', err);
    return c.json({ error: 'Failed to create account' }, 500);
  }
});

/**
 * POST /auth/callback
 * Exchange an OAuth authorization code for a session.
 * Used after Google/GitHub OAuth redirect.
 */
auth.post('/callback', zValidator('json', callbackSchema), async (c) => {
  const { code, provider } = c.req.valid('json');

  try {
    // TODO: Wire to Supabase
    // const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    void code;
    void provider;

    return c.json({
      session: {
        accessToken: 'stub-access-token',
        refreshToken: 'stub-refresh-token',
        expiresAt: Date.now() + 3600 * 1000,
      },
    });
  } catch (err) {
    console.error('[auth/callback] Error:', err);
    return c.json({ error: 'Failed to exchange authorization code' }, 500);
  }
});

/**
 * GET /auth/me
 * Return the authenticated user's profile.
 */
auth.get('/me', authMiddleware, async (c) => {
  const user = c.get('user');

  try {
    // TODO: Fetch full profile from DB
    // const profile = await db.query.users.findFirst({
    //   where: eq(users.id, user.sub),
    // });

    return c.json({
      user: {
        id: user.sub,
        email: user.email,
        // TODO: Add these from DB
        fullName: null,
        avatarUrl: null,
        createdAt: null,
      },
    });
  } catch (err) {
    console.error('[auth/me] Error:', err);
    return c.json({ error: 'Failed to fetch profile' }, 500);
  }
});

export default auth;
