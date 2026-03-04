import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';
import { secureHeaders } from 'hono/secure-headers';
import { ZodError } from 'zod';
import { serve } from '@hono/node-server';

// ── Route Imports ──────────────────────────────────────

import auth from './routes/auth';
import workspaces from './routes/workspaces';
import recordings from './routes/recordings';
import projects from './routes/projects';
import videoEditor from './routes/video-editor';
import guides from './routes/guides';
import walkthroughs from './routes/walkthroughs';
import knowledgeBase from './routes/knowledge-base';
import courses from './routes/courses';
import enrollments from './routes/enrollments';
import analytics from './routes/analytics';
import billing from './routes/billing';
import widget from './routes/widget';
import publicRoutes from './routes/public';

// ── App Setup ──────────────────────────────────────────

const app = new Hono();

// ── Global Middleware ──────────────────────────────────

app.use('*', logger());
app.use('*', prettyJSON());
app.use('*', secureHeaders());

app.use(
  '*',
  cors({
    origin: (origin) => {
      const allowedOrigins = (process.env.CORS_ORIGINS ?? 'http://localhost:3000')
        .split(',')
        .map((o) => o.trim());

      if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
        return origin ?? '*';
      }
      return '';
    },
    allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization', 'X-Workspace-Id'],
    exposeHeaders: ['X-Request-Id'],
    credentials: true,
    maxAge: 86400,
  }),
);

// ── Request ID ─────────────────────────────────────────

app.use('*', async (c, next) => {
  const requestId = c.req.header('X-Request-Id') ?? crypto.randomUUID();
  c.header('X-Request-Id', requestId);
  await next();
});

// ── Health Check ───────────────────────────────────────

app.get('/health', (c) => {
  return c.json({
    status: 'ok',
    service: 'screenflow-api',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// ── Mount Routes ───────────────────────────────────────

app.route('/auth', auth);
app.route('/workspaces', workspaces);
app.route('/workspaces', recordings);
app.route('/workspaces', projects);
app.route('/workspaces', videoEditor);
app.route('/workspaces', guides);
app.route('/workspaces', walkthroughs);
app.route('/workspaces', knowledgeBase);
app.route('/workspaces', courses);
app.route('/workspaces', enrollments);
app.route('/workspaces', analytics);
app.route('/billing', billing);
app.route('/widget', widget);
app.route('/public', publicRoutes);

// ── Global Error Handler ───────────────────────────────

app.onError((err, c) => {
  console.error(`[${c.req.method}] ${c.req.url}`, err);

  // Zod validation errors
  if (err instanceof ZodError) {
    return c.json(
      {
        error: 'Validation failed',
        details: err.errors.map((e) => ({
          path: e.path.join('.'),
          message: e.message,
        })),
      },
      400,
    );
  }

  // Known HTTP errors from Hono
  if ('status' in err && typeof err.status === 'number') {
    return c.json(
      { error: err.message || 'Request failed' },
      err.status as 400 | 401 | 403 | 404 | 500,
    );
  }

  // Unexpected errors
  return c.json(
    {
      error: process.env.NODE_ENV === 'production'
        ? 'Internal server error'
        : (err as Error).message ?? 'Internal server error',
    },
    500,
  );
});

// ── 404 Handler ────────────────────────────────────────

app.notFound((c) => {
  return c.json(
    {
      error: 'Not found',
      path: c.req.url,
    },
    404,
  );
});

// ── Server ─────────────────────────────────────────────

const port = Number(process.env.PORT ?? 8787);

console.log(`ScreenFlow API starting on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});

console.log(`ScreenFlow API running at http://localhost:${port}`);

export default app;
