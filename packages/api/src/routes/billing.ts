import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { authMiddleware } from '../middleware/auth';
import { workspaceMiddleware } from '../middleware/workspace';
import { MemberRole } from '@screenflow/shared/constants';

const billing = new Hono();

// ── Schemas ────────────────────────────────────────────

const createCheckoutSchema = z.object({
  planId: z.enum(['starter', 'pro', 'enterprise']),
  billingPeriod: z.enum(['monthly', 'annual']),
  successUrl: z.string().url(),
  cancelUrl: z.string().url(),
});

const portalSchema = z.object({
  returnUrl: z.string().url(),
});

// ── Authenticated Routes ───────────────────────────────

billing.use('/workspaces/*', authMiddleware);

/**
 * GET /workspaces/:workspaceId/billing
 * Get current billing/subscription status.
 */
billing.get(
  '/workspaces/:workspaceId/billing',
  workspaceMiddleware([MemberRole.Owner, MemberRole.Admin]),
  async (c) => {
    const workspaceId = c.req.param('workspaceId');

    try {
      // TODO: Fetch subscription from Stripe
      void workspaceId;

      return c.json({
        subscription: {
          plan: 'free',
          status: 'active',
          currentPeriodStart: null,
          currentPeriodEnd: null,
          cancelAtPeriodEnd: false,
        },
        usage: {
          recordings: 0,
          storageBytes: 0,
          members: 1,
        },
      });
    } catch (err) {
      console.error('[billing] Get error:', err);
      return c.json({ error: 'Failed to fetch billing info' }, 500);
    }
  },
);

/**
 * POST /workspaces/:workspaceId/billing/checkout
 * Create a Stripe checkout session for plan upgrade.
 */
billing.post(
  '/workspaces/:workspaceId/billing/checkout',
  workspaceMiddleware([MemberRole.Owner]),
  zValidator('json', createCheckoutSchema),
  async (c) => {
    const workspaceId = c.req.param('workspaceId');
    const body = c.req.valid('json');

    try {
      // TODO: Create Stripe checkout session
      // const session = await stripe.checkout.sessions.create({ ... });

      void workspaceId;

      return c.json({
        checkoutUrl: `https://checkout.stripe.com/stub/${body.planId}`,
        sessionId: `cs_stub_${crypto.randomUUID()}`,
      });
    } catch (err) {
      console.error('[billing] Checkout error:', err);
      return c.json({ error: 'Failed to create checkout session' }, 500);
    }
  },
);

/**
 * POST /workspaces/:workspaceId/billing/portal
 * Create a Stripe customer portal session.
 */
billing.post(
  '/workspaces/:workspaceId/billing/portal',
  workspaceMiddleware([MemberRole.Owner, MemberRole.Admin]),
  zValidator('json', portalSchema),
  async (c) => {
    const workspaceId = c.req.param('workspaceId');
    const body = c.req.valid('json');

    try {
      // TODO: Create Stripe billing portal session
      // const session = await stripe.billingPortal.sessions.create({ ... });

      void workspaceId;

      return c.json({
        portalUrl: `https://billing.stripe.com/stub/portal`,
        returnUrl: body.returnUrl,
      });
    } catch (err) {
      console.error('[billing] Portal error:', err);
      return c.json({ error: 'Failed to create billing portal session' }, 500);
    }
  },
);

// ── Webhook (no auth - verified by Stripe signature) ───

/**
 * POST /billing/webhook
 * Stripe webhook endpoint.
 * NOTE: This is a stub. Wire up Stripe webhook signature verification
 * and event handling when ready.
 */
billing.post('/webhook', async (c) => {
  const signature = c.req.header('stripe-signature');

  if (!signature) {
    return c.json({ error: 'Missing Stripe signature' }, 400);
  }

  try {
    const rawBody = await c.req.text();

    // TODO: Verify webhook signature
    // const event = stripe.webhooks.constructEvent(
    //   rawBody,
    //   signature,
    //   process.env.STRIPE_WEBHOOK_SECRET!,
    // );

    // TODO: Handle events:
    // - checkout.session.completed -> activate subscription
    // - customer.subscription.updated -> update plan
    // - customer.subscription.deleted -> downgrade to free
    // - invoice.payment_failed -> handle payment failure
    // - invoice.paid -> update billing record

    void rawBody;

    console.log('[billing/webhook] Received webhook (stub)');

    return c.json({ received: true });
  } catch (err) {
    console.error('[billing/webhook] Error:', err);
    return c.json({ error: 'Webhook processing failed' }, 400);
  }
});

export default billing;
