import { createMiddleware } from 'hono/factory';
import * as jose from 'jose';

// ── Types ──────────────────────────────────────────────

export interface AuthUser {
  sub: string;
  email: string;
  role?: string;
  aud?: string;
}

declare module 'hono' {
  interface ContextVariableMap {
    user: AuthUser;
    jwtPayload: jose.JWTPayload;
  }
}

// ── Helpers ────────────────────────────────────────────

const SUPABASE_JWT_SECRET = () => {
  const secret = process.env.SUPABASE_JWT_SECRET;
  if (!secret) throw new Error('SUPABASE_JWT_SECRET is not configured');
  return secret;
};

/**
 * Build a JWKS remote key set when using Supabase-hosted JWKS endpoint,
 * or fall back to the shared HS256 secret.
 */
function getVerificationKey() {
  const jwksUrl = process.env.SUPABASE_JWKS_URL;
  if (jwksUrl) {
    return jose.createRemoteJWKSet(new URL(jwksUrl));
  }
  // Supabase default: HS256 with the JWT secret
  return new TextEncoder().encode(SUPABASE_JWT_SECRET());
}

// ── Middleware ──────────────────────────────────────────

/**
 * JWT authentication middleware.
 *
 * Extracts the Bearer token from the Authorization header, verifies it
 * against the Supabase JWT secret / JWKS, and stores the decoded user
 * on the Hono context as `c.get('user')`.
 */
export const authMiddleware = createMiddleware(async (c, next) => {
  const authHeader = c.req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Missing or malformed Authorization header' }, 401);
  }

  const token = authHeader.slice(7);

  try {
    const key = getVerificationKey();

    const { payload } = typeof key === 'function'
      ? await jose.jwtVerify(token, key, {
          audience: process.env.SUPABASE_JWT_AUDIENCE ?? 'authenticated',
        })
      : await jose.jwtVerify(token, key as Uint8Array, {
          algorithms: ['HS256'],
          audience: process.env.SUPABASE_JWT_AUDIENCE ?? 'authenticated',
        });

    if (!payload.sub || !payload.email) {
      return c.json({ error: 'Invalid token payload' }, 401);
    }

    c.set('user', {
      sub: payload.sub,
      email: payload.email as string,
      role: (payload.role as string) ?? undefined,
      aud: (payload.aud as string) ?? undefined,
    });
    c.set('jwtPayload', payload);

    await next();
  } catch (err) {
    const message =
      err instanceof jose.errors.JWTExpired
        ? 'Token has expired'
        : err instanceof jose.errors.JWTClaimValidationFailed
          ? 'Token claim validation failed'
          : 'Invalid token';

    return c.json({ error: message }, 401);
  }
});

/**
 * Optional auth middleware - does not reject unauthenticated requests
 * but populates the user if a valid token is present.
 */
export const optionalAuth = createMiddleware(async (c, next) => {
  const authHeader = c.req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    await next();
    return;
  }

  const token = authHeader.slice(7);

  try {
    const key = getVerificationKey();
    const { payload } = typeof key === 'function'
      ? await jose.jwtVerify(token, key, {
          audience: process.env.SUPABASE_JWT_AUDIENCE ?? 'authenticated',
        })
      : await jose.jwtVerify(token, key as Uint8Array, {
          algorithms: ['HS256'],
          audience: process.env.SUPABASE_JWT_AUDIENCE ?? 'authenticated',
        });

    if (payload.sub && payload.email) {
      c.set('user', {
        sub: payload.sub,
        email: payload.email as string,
        role: (payload.role as string) ?? undefined,
        aud: (payload.aud as string) ?? undefined,
      });
      c.set('jwtPayload', payload);
    }
  } catch {
    // Silently ignore invalid tokens for optional auth
  }

  await next();
});
