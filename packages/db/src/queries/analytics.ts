import { eq, and, desc, gte, lte, sql, count } from "drizzle-orm";
import { db } from "../client";
import { analyticsEvents } from "../schema";

export async function trackEvent(
  data: typeof analyticsEvents.$inferInsert,
) {
  const [event] = await db.insert(analyticsEvents).values(data).returning();
  return event;
}

export async function trackEventsBatch(
  data: (typeof analyticsEvents.$inferInsert)[],
) {
  return db.insert(analyticsEvents).values(data).returning();
}

export async function getEventsByProject(
  projectId: string,
  options?: {
    eventType?: (typeof analyticsEvents.$inferInsert)["eventType"];
    startDate?: Date;
    endDate?: Date;
    limit?: number;
  },
) {
  const conditions = [eq(analyticsEvents.projectId, projectId)];

  if (options?.eventType) {
    conditions.push(eq(analyticsEvents.eventType, options.eventType));
  }
  if (options?.startDate) {
    conditions.push(gte(analyticsEvents.createdAt, options.startDate));
  }
  if (options?.endDate) {
    conditions.push(lte(analyticsEvents.createdAt, options.endDate));
  }

  return db.query.analyticsEvents.findMany({
    where: and(...conditions),
    orderBy: [desc(analyticsEvents.createdAt)],
    limit: options?.limit ?? 1000,
  });
}

export async function getEventsByWorkspace(
  workspaceId: string,
  options?: {
    eventType?: (typeof analyticsEvents.$inferInsert)["eventType"];
    startDate?: Date;
    endDate?: Date;
    limit?: number;
  },
) {
  const conditions = [eq(analyticsEvents.workspaceId, workspaceId)];

  if (options?.eventType) {
    conditions.push(eq(analyticsEvents.eventType, options.eventType));
  }
  if (options?.startDate) {
    conditions.push(gte(analyticsEvents.createdAt, options.startDate));
  }
  if (options?.endDate) {
    conditions.push(lte(analyticsEvents.createdAt, options.endDate));
  }

  return db.query.analyticsEvents.findMany({
    where: and(...conditions),
    orderBy: [desc(analyticsEvents.createdAt)],
    limit: options?.limit ?? 1000,
  });
}

export async function getEventCountsByType(
  workspaceId: string,
  startDate?: Date,
  endDate?: Date,
) {
  const conditions = [eq(analyticsEvents.workspaceId, workspaceId)];

  if (startDate) {
    conditions.push(gte(analyticsEvents.createdAt, startDate));
  }
  if (endDate) {
    conditions.push(lte(analyticsEvents.createdAt, endDate));
  }

  return db
    .select({
      eventType: analyticsEvents.eventType,
      count: count(),
    })
    .from(analyticsEvents)
    .where(and(...conditions))
    .groupBy(analyticsEvents.eventType);
}

export async function getUniqueVisitorCount(
  workspaceId: string,
  startDate?: Date,
  endDate?: Date,
) {
  const conditions = [eq(analyticsEvents.workspaceId, workspaceId)];

  if (startDate) {
    conditions.push(gte(analyticsEvents.createdAt, startDate));
  }
  if (endDate) {
    conditions.push(lte(analyticsEvents.createdAt, endDate));
  }

  const result = await db
    .select({
      uniqueVisitors: sql<number>`count(distinct ${analyticsEvents.visitorId})`,
    })
    .from(analyticsEvents)
    .where(and(...conditions));

  return result[0]?.uniqueVisitors ?? 0;
}
