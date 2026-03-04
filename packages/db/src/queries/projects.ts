import { eq, and, desc } from "drizzle-orm";
import { db } from "../client";
import { projects } from "../schema";

export async function getProjectById(id: string) {
  return db.query.projects.findFirst({
    where: eq(projects.id, id),
    with: {
      createdBy: true,
      recording: true,
      videoProjectData: true,
      guideSteps: true,
      walkthroughSteps: true,
      sharedLinks: true,
    },
  });
}

export async function getProjectsByWorkspace(
  workspaceId: string,
  type?: (typeof projects.$inferInsert)["type"],
) {
  return db.query.projects.findMany({
    where: and(
      eq(projects.workspaceId, workspaceId),
      type ? eq(projects.type, type) : undefined,
    ),
    orderBy: [desc(projects.createdAt)],
    with: {
      createdBy: true,
      recording: true,
    },
  });
}

export async function createProject(data: typeof projects.$inferInsert) {
  const [project] = await db.insert(projects).values(data).returning();
  return project;
}

export async function updateProject(
  id: string,
  data: Partial<typeof projects.$inferInsert>,
) {
  const [project] = await db
    .update(projects)
    .set(data)
    .where(eq(projects.id, id))
    .returning();
  return project;
}

export async function deleteProject(id: string) {
  const [project] = await db
    .delete(projects)
    .where(eq(projects.id, id))
    .returning();
  return project;
}

export async function getProjectsByStatus(
  workspaceId: string,
  status: (typeof projects.$inferInsert)["status"],
) {
  return db.query.projects.findMany({
    where: and(
      eq(projects.workspaceId, workspaceId),
      status ? eq(projects.status, status) : undefined,
    ),
    orderBy: [desc(projects.createdAt)],
    with: {
      createdBy: true,
    },
  });
}
