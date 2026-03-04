import { eq, and, desc } from "drizzle-orm";
import { db } from "../client";
import { recordings } from "../schema";

export async function getRecordingById(id: string) {
  return db.query.recordings.findFirst({
    where: eq(recordings.id, id),
    with: {
      createdBy: true,
      projects: true,
    },
  });
}

export async function getRecordingsByWorkspace(workspaceId: string) {
  return db.query.recordings.findMany({
    where: eq(recordings.workspaceId, workspaceId),
    orderBy: [desc(recordings.createdAt)],
    with: {
      createdBy: true,
    },
  });
}

export async function createRecording(
  data: typeof recordings.$inferInsert,
) {
  const [recording] = await db.insert(recordings).values(data).returning();
  return recording;
}

export async function updateRecording(
  id: string,
  data: Partial<typeof recordings.$inferInsert>,
) {
  const [recording] = await db
    .update(recordings)
    .set(data)
    .where(eq(recordings.id, id))
    .returning();
  return recording;
}

export async function deleteRecording(id: string) {
  const [recording] = await db
    .delete(recordings)
    .where(eq(recordings.id, id))
    .returning();
  return recording;
}

export async function getRecordingsByStatus(
  workspaceId: string,
  status: (typeof recordings.$inferInsert)["status"],
) {
  return db.query.recordings.findMany({
    where: and(
      eq(recordings.workspaceId, workspaceId),
      status ? eq(recordings.status, status) : undefined,
    ),
    orderBy: [desc(recordings.createdAt)],
  });
}
