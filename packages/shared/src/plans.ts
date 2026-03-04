import { ExportResolution } from './constants';

// ──────────────────────────────────────────────
// Plan definition types
// ──────────────────────────────────────────────

/** A plan ID string. */
export type PlanId = 'free' | 'pro' | 'team' | 'business' | 'enterprise';

/** Full specification of a billing plan. */
export interface PlanDefinition {
  /** Unique plan identifier. */
  id: PlanId;
  /** Display name shown in the UI. */
  name: string;
  /** Short marketing tagline. */
  tagline: string;
  /** Monthly price in USD cents (0 = free, -1 = contact sales). */
  priceMonthlyUsdCents: number;
  /** Annual price in USD cents per year (0 = free, -1 = contact sales). */
  priceAnnualUsdCents: number;

  // ── Recording limits ──────────────────────
  /** Maximum number of recordings (-1 = unlimited). */
  maxRecordings: number;
  /** Maximum single recording duration in minutes (-1 = unlimited). */
  maxRecordingDurationMin: number;
  /** Highest export resolution available. */
  maxExportResolution: ExportResolution;

  // ── Workspace / collaboration ─────────────
  /** Maximum number of workspace members (-1 = unlimited). */
  maxMembers: number;
  /** Whether shared team library is available. */
  sharedLibrary: boolean;
  /** Whether inline comments / review is available. */
  comments: boolean;

  // ── Branding ──────────────────────────────
  /** Whether the ScreenFlow watermark is removed. */
  noWatermark: boolean;
  /** Whether the brand kit (logo, colours, fonts) is available. */
  brandKit: boolean;
  /** Whether a custom domain can be configured for the KB. */
  customDomain: boolean;
  /** Whether a KB subdomain is provided. */
  kbSubdomain: boolean;

  // ── Features ──────────────────────────────
  /** Whether the embeddable widget is available. */
  widget: boolean;
  /** Whether interactive walkthroughs are available. */
  walkthroughs: boolean;
  /** Whether the academy / courses feature is available. */
  academy: boolean;
  /** Whether SSO / SAML authentication is supported. */
  ssoSaml: boolean;
  /** Whether multi-workspace support is available. */
  multiWorkspace: boolean;
  /** Whether a dedicated CSM / priority support is included. */
  prioritySupport: boolean;
}

// ──────────────────────────────────────────────
// Plan definitions
// ──────────────────────────────────────────────

export const PLAN_FREE: PlanDefinition = {
  id: 'free',
  name: 'Free',
  tagline: 'Get started with screen recording basics',
  priceMonthlyUsdCents: 0,
  priceAnnualUsdCents: 0,

  maxRecordings: 5,
  maxRecordingDurationMin: 5,
  maxExportResolution: ExportResolution.HD_720,

  maxMembers: 1,
  sharedLibrary: false,
  comments: false,

  noWatermark: false,
  brandKit: false,
  customDomain: false,
  kbSubdomain: false,

  widget: false,
  walkthroughs: false,
  academy: false,
  ssoSaml: false,
  multiWorkspace: false,
  prioritySupport: false,
};

export const PLAN_PRO: PlanDefinition = {
  id: 'pro',
  name: 'Pro',
  tagline: 'Professional screen recording & editing',
  priceMonthlyUsdCents: 2900,
  priceAnnualUsdCents: 27600, // $23/mo billed annually

  maxRecordings: -1,
  maxRecordingDurationMin: -1,
  maxExportResolution: ExportResolution.FHD_1080,

  maxMembers: 1,
  sharedLibrary: false,
  comments: false,

  noWatermark: true,
  brandKit: true,
  customDomain: false,
  kbSubdomain: false,

  widget: false,
  walkthroughs: false,
  academy: false,
  ssoSaml: false,
  multiWorkspace: false,
  prioritySupport: false,
};

export const PLAN_TEAM: PlanDefinition = {
  id: 'team',
  name: 'Team',
  tagline: 'Collaborate with your team on videos & guides',
  priceMonthlyUsdCents: 7900,
  priceAnnualUsdCents: 75600, // $63/mo billed annually

  maxRecordings: -1,
  maxRecordingDurationMin: -1,
  maxExportResolution: ExportResolution.FHD_1080,

  maxMembers: 5,
  sharedLibrary: true,
  comments: true,

  noWatermark: true,
  brandKit: true,
  customDomain: false,
  kbSubdomain: true,

  widget: false,
  walkthroughs: false,
  academy: false,
  ssoSaml: false,
  multiWorkspace: false,
  prioritySupport: false,
};

export const PLAN_BUSINESS: PlanDefinition = {
  id: 'business',
  name: 'Business',
  tagline: 'Full platform with widget, walkthroughs & academy',
  priceMonthlyUsdCents: 14900,
  priceAnnualUsdCents: 142800, // $119/mo billed annually

  maxRecordings: -1,
  maxRecordingDurationMin: -1,
  maxExportResolution: ExportResolution.UHD_4K,

  maxMembers: 15,
  sharedLibrary: true,
  comments: true,

  noWatermark: true,
  brandKit: true,
  customDomain: true,
  kbSubdomain: true,

  widget: true,
  walkthroughs: true,
  academy: true,
  ssoSaml: false,
  multiWorkspace: false,
  prioritySupport: false,
};

export const PLAN_ENTERPRISE: PlanDefinition = {
  id: 'enterprise',
  name: 'Enterprise',
  tagline: 'Unlimited scale with SSO, SAML & dedicated support',
  priceMonthlyUsdCents: -1, // contact sales
  priceAnnualUsdCents: -1,

  maxRecordings: -1,
  maxRecordingDurationMin: -1,
  maxExportResolution: ExportResolution.UHD_4K,

  maxMembers: -1,
  sharedLibrary: true,
  comments: true,

  noWatermark: true,
  brandKit: true,
  customDomain: true,
  kbSubdomain: true,

  widget: true,
  walkthroughs: true,
  academy: true,
  ssoSaml: true,
  multiWorkspace: true,
  prioritySupport: true,
};

/** All plans indexed by ID for quick lookup. */
export const PLANS: Record<PlanId, PlanDefinition> = {
  free: PLAN_FREE,
  pro: PLAN_PRO,
  team: PLAN_TEAM,
  business: PLAN_BUSINESS,
  enterprise: PLAN_ENTERPRISE,
};

/** Ordered list of plans from lowest to highest tier. */
export const PLAN_ORDER: PlanId[] = ['free', 'pro', 'team', 'business', 'enterprise'];

/**
 * Check whether a plan has access to a given feature.
 * Useful for gating UI elements and API endpoints.
 */
export function planHasFeature(
  planId: PlanId,
  feature: keyof Omit<PlanDefinition, 'id' | 'name' | 'tagline' | 'priceMonthlyUsdCents' | 'priceAnnualUsdCents'>,
): boolean {
  const plan = PLANS[planId];
  const value = plan[feature];
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value !== 0;
  return value !== null && value !== undefined;
}

/**
 * Check whether a numeric limit is within the plan's allowance.
 * Returns true if the plan allows unlimited (-1) or if current < max.
 */
export function withinPlanLimit(
  planId: PlanId,
  limitKey: 'maxRecordings' | 'maxMembers' | 'maxRecordingDurationMin',
  currentValue: number,
): boolean {
  const limit = PLANS[planId][limitKey];
  if (limit === -1) return true;
  return currentValue < limit;
}
