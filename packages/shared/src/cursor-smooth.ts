import { DEFAULT_CATMULL_ROM_ALPHA, DEFAULT_EMA_SMOOTHING_FACTOR } from './constants';
import type { CursorPosition } from './types';

// ──────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────

/** A 2-D point used internally by the smoothing algorithms. */
export interface Point2D {
  x: number;
  y: number;
}

/** Options for the cursor smoothing pipeline. */
export interface CursorSmoothOptions {
  /**
   * Alpha parameter for the Catmull-Rom spline.
   * 0   = uniform (fastest, least smooth)
   * 0.5 = centripetal (recommended default -- avoids cusps)
   * 1   = chordal (slowest, smoothest)
   */
  catmullRomAlpha?: number;

  /**
   * Smoothing factor (alpha) for the Exponential Moving Average pass.
   * Range 0-1. Lower values = heavier smoothing, more latency.
   * Default: 0.3
   */
  emaSmoothingFactor?: number;

  /**
   * Number of interpolated points to insert between each pair of
   * original sample points during the spline pass.
   * Default: 3
   */
  interpolationResolution?: number;

  /**
   * Whether to apply the EMA post-smoothing pass.
   * Default: true
   */
  applyEma?: boolean;
}

// ──────────────────────────────────────────────
// Catmull-Rom Spline
// ──────────────────────────────────────────────

/**
 * Compute a single point on a Catmull-Rom spline segment.
 *
 * Uses the Barry-Goldman parametric formulation which supports
 * uniform, centripetal, and chordal variants via the `alpha` parameter.
 *
 * @param p0    - Control point before the segment start.
 * @param p1    - Segment start.
 * @param p2    - Segment end.
 * @param p3    - Control point after the segment end.
 * @param t     - Parameter in [0, 1] along the segment.
 * @param alpha - Catmull-Rom type (0 = uniform, 0.5 = centripetal, 1 = chordal).
 * @returns Interpolated point.
 */
export function catmullRomPoint(
  p0: Point2D,
  p1: Point2D,
  p2: Point2D,
  p3: Point2D,
  t: number,
  alpha: number = DEFAULT_CATMULL_ROM_ALPHA,
): Point2D {
  // Knot parameterisation
  function knotInterval(ti: number, pi: Point2D, pj: Point2D): number {
    const dx = pj.x - pi.x;
    const dy = pj.y - pi.y;
    const d = Math.sqrt(dx * dx + dy * dy);
    return ti + Math.pow(d, alpha);
  }

  const t0 = 0;
  const t1 = knotInterval(t0, p0, p1);
  const t2 = knotInterval(t1, p1, p2);
  const t3 = knotInterval(t2, p2, p3);

  // Remap t from [0,1] to [t1, t2]
  const tMapped = t1 + t * (t2 - t1);

  // Barry-Goldman pyramid
  function lerp2D(a: Point2D, b: Point2D, ta: number, tb: number, tc: number): Point2D {
    const denom = tb - ta;
    if (Math.abs(denom) < 1e-10) return a;
    const f1 = (tb - tc) / denom;
    const f2 = (tc - ta) / denom;
    return { x: a.x * f1 + b.x * f2, y: a.y * f1 + b.y * f2 };
  }

  const a1 = lerp2D(p0, p1, t0, t1, tMapped);
  const a2 = lerp2D(p1, p2, t1, t2, tMapped);
  const a3 = lerp2D(p2, p3, t2, t3, tMapped);

  const b1 = lerp2D(a1, a2, t0, t2, tMapped);
  const b2 = lerp2D(a2, a3, t1, t3, tMapped);

  return lerp2D(b1, b2, t1, t2, tMapped);
}

/**
 * Interpolate a polyline through a set of points using a Catmull-Rom spline.
 *
 * Endpoints are duplicated so the spline passes through all original points.
 *
 * @param points     - Ordered control points.
 * @param resolution - Number of interpolated points per segment.
 * @param alpha      - Catmull-Rom alpha (0 = uniform, 0.5 = centripetal, 1 = chordal).
 * @returns Densified array of points including the originals.
 */
export function catmullRomSpline(
  points: Point2D[],
  resolution: number = 3,
  alpha: number = DEFAULT_CATMULL_ROM_ALPHA,
): Point2D[] {
  if (points.length < 2) return [...points];

  // Pad the endpoints
  const padded = [
    points[0]!, // duplicate first
    ...points,
    points[points.length - 1]!, // duplicate last
  ];

  const result: Point2D[] = [];

  for (let i = 1; i < padded.length - 2; i++) {
    const p0 = padded[i - 1]!;
    const p1 = padded[i]!;
    const p2 = padded[i + 1]!;
    const p3 = padded[i + 2]!;

    // Always include the segment start
    result.push({ x: p1.x, y: p1.y });

    // Add interpolated points
    for (let j = 1; j <= resolution; j++) {
      const t = j / (resolution + 1);
      result.push(catmullRomPoint(p0, p1, p2, p3, t, alpha));
    }
  }

  // Include the very last point
  result.push({ x: points[points.length - 1]!.x, y: points[points.length - 1]!.y });

  return result;
}

// ──────────────────────────────────────────────
// Exponential Moving Average (EMA)
// ──────────────────────────────────────────────

/**
 * Apply an Exponential Moving Average to a series of 2-D points.
 *
 * The EMA acts as a low-pass filter, removing high-frequency jitter
 * from cursor movement while introducing minimal latency.
 *
 * @param points          - Ordered input points.
 * @param smoothingFactor - Alpha value (0-1). Lower = smoother.
 * @returns Smoothed points array (same length as input).
 */
export function emaSmoothPoints(
  points: Point2D[],
  smoothingFactor: number = DEFAULT_EMA_SMOOTHING_FACTOR,
): Point2D[] {
  if (points.length === 0) return [];

  const alpha = Math.max(0, Math.min(1, smoothingFactor));
  const result: Point2D[] = [{ ...points[0]! }];

  for (let i = 1; i < points.length; i++) {
    const prev = result[i - 1]!;
    const curr = points[i]!;
    result.push({
      x: prev.x + alpha * (curr.x - prev.x),
      y: prev.y + alpha * (curr.y - prev.y),
    });
  }

  return result;
}

// ──────────────────────────────────────────────
// Full smoothing pipeline
// ──────────────────────────────────────────────

/**
 * Smooth an array of raw cursor positions using a two-pass pipeline:
 *
 * 1. **Catmull-Rom spline** interpolation to create a smooth curve
 *    through the sampled points, increasing temporal resolution.
 * 2. **EMA post-filter** to further reduce any remaining jitter.
 *
 * The output retains the original timestamps, linearly interpolated
 * across the densified point set.
 *
 * @param positions - Raw cursor positions sampled during recording.
 * @param options   - Tuning parameters.
 * @returns Smoothed cursor positions with interpolated timestamps.
 */
export function smoothCursorPositions(
  positions: CursorPosition[],
  options: CursorSmoothOptions = {},
): CursorPosition[] {
  const {
    catmullRomAlpha = DEFAULT_CATMULL_ROM_ALPHA,
    emaSmoothingFactor = DEFAULT_EMA_SMOOTHING_FACTOR,
    interpolationResolution = 3,
    applyEma = true,
  } = options;

  if (positions.length < 2) return [...positions];

  // Extract spatial points
  const rawPoints: Point2D[] = positions.map((p) => ({ x: p.x, y: p.y }));

  // Pass 1: Catmull-Rom spline interpolation
  let smoothed = catmullRomSpline(rawPoints, interpolationResolution, catmullRomAlpha);

  // Pass 2: EMA post-filter
  if (applyEma) {
    smoothed = emaSmoothPoints(smoothed, emaSmoothingFactor);
  }

  // Re-assign timestamps via linear interpolation
  const firstT = positions[0]!.t;
  const lastT = positions[positions.length - 1]!.t;
  const totalDuration = lastT - firstT;

  return smoothed.map((pt, i) => ({
    t: Math.round(firstT + (i / (smoothed.length - 1)) * totalDuration),
    x: Math.round(pt.x * 100) / 100,
    y: Math.round(pt.y * 100) / 100,
  }));
}

// ──────────────────────────────────────────────
// Real-time EMA smoother (stateful)
// ──────────────────────────────────────────────

/**
 * A stateful cursor smoother for real-time use (e.g. during playback).
 *
 * Feed each raw position via `push()` and receive the smoothed position
 * in return. Uses a simple EMA internally.
 */
export class RealtimeCursorSmoother {
  private smoothingFactor: number;
  private lastX: number | null = null;
  private lastY: number | null = null;

  constructor(smoothingFactor: number = DEFAULT_EMA_SMOOTHING_FACTOR) {
    this.smoothingFactor = Math.max(0, Math.min(1, smoothingFactor));
  }

  /** Feed a new raw position and receive the smoothed result. */
  push(x: number, y: number): Point2D {
    if (this.lastX === null || this.lastY === null) {
      this.lastX = x;
      this.lastY = y;
      return { x, y };
    }

    this.lastX = this.lastX + this.smoothingFactor * (x - this.lastX);
    this.lastY = this.lastY + this.smoothingFactor * (y - this.lastY);

    return { x: this.lastX, y: this.lastY };
  }

  /** Reset the smoother state. */
  reset(): void {
    this.lastX = null;
    this.lastY = null;
  }
}
