import { eq, asc } from "drizzle-orm";
import { db } from "../client";
import { guideSteps, walkthroughSteps } from "../schema";

// ---------------------------------------------------------------------------
// Guide Steps
// ---------------------------------------------------------------------------

export async function getGuideStepsByProject(projectId: string) {
  return db.query.guideSteps.findMany({
    where: eq(guideSteps.projectId, projectId),
    orderBy: [asc(guideSteps.stepNumber)],
  });
}

export async function getGuideStepById(id: string) {
  return db.query.guideSteps.findFirst({
    where: eq(guideSteps.id, id),
  });
}

export async function createGuideStep(
  data: typeof guideSteps.$inferInsert,
) {
  const [step] = await db.insert(guideSteps).values(data).returning();
  return step;
}

export async function createGuideStepsBatch(
  data: (typeof guideSteps.$inferInsert)[],
) {
  return db.insert(guideSteps).values(data).returning();
}

export async function updateGuideStep(
  id: string,
  data: Partial<typeof guideSteps.$inferInsert>,
) {
  const [step] = await db
    .update(guideSteps)
    .set(data)
    .where(eq(guideSteps.id, id))
    .returning();
  return step;
}

export async function deleteGuideStep(id: string) {
  const [step] = await db
    .delete(guideSteps)
    .where(eq(guideSteps.id, id))
    .returning();
  return step;
}

// ---------------------------------------------------------------------------
// Walkthrough Steps
// ---------------------------------------------------------------------------

export async function getWalkthroughStepsByProject(projectId: string) {
  return db.query.walkthroughSteps.findMany({
    where: eq(walkthroughSteps.projectId, projectId),
    orderBy: [asc(walkthroughSteps.stepNumber)],
  });
}

export async function getWalkthroughStepById(id: string) {
  return db.query.walkthroughSteps.findFirst({
    where: eq(walkthroughSteps.id, id),
  });
}

export async function createWalkthroughStep(
  data: typeof walkthroughSteps.$inferInsert,
) {
  const [step] = await db.insert(walkthroughSteps).values(data).returning();
  return step;
}

export async function createWalkthroughStepsBatch(
  data: (typeof walkthroughSteps.$inferInsert)[],
) {
  return db.insert(walkthroughSteps).values(data).returning();
}

export async function updateWalkthroughStep(
  id: string,
  data: Partial<typeof walkthroughSteps.$inferInsert>,
) {
  const [step] = await db
    .update(walkthroughSteps)
    .set(data)
    .where(eq(walkthroughSteps.id, id))
    .returning();
  return step;
}

export async function deleteWalkthroughStep(id: string) {
  const [step] = await db
    .delete(walkthroughSteps)
    .where(eq(walkthroughSteps.id, id))
    .returning();
  return step;
}
