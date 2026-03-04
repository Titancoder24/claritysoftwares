import { eq, and, desc, asc } from "drizzle-orm";
import { db } from "../client";
import {
  courses,
  courseModules,
  courseLessons,
  enrollments,
  enrollmentProgress,
} from "../schema";

// ---------------------------------------------------------------------------
// Courses
// ---------------------------------------------------------------------------

export async function getCourseById(id: string) {
  return db.query.courses.findFirst({
    where: eq(courses.id, id),
    with: {
      createdBy: true,
      modules: {
        orderBy: [asc(courseModules.sortOrder)],
        with: {
          lessons: {
            orderBy: [asc(courseLessons.sortOrder)],
          },
        },
      },
    },
  });
}

export async function getCoursesByWorkspace(workspaceId: string) {
  return db.query.courses.findMany({
    where: eq(courses.workspaceId, workspaceId),
    orderBy: [desc(courses.createdAt)],
    with: {
      createdBy: true,
      modules: true,
      enrollments: true,
    },
  });
}

export async function createCourse(data: typeof courses.$inferInsert) {
  const [course] = await db.insert(courses).values(data).returning();
  return course;
}

export async function updateCourse(
  id: string,
  data: Partial<typeof courses.$inferInsert>,
) {
  const [course] = await db
    .update(courses)
    .set(data)
    .where(eq(courses.id, id))
    .returning();
  return course;
}

export async function deleteCourse(id: string) {
  const [course] = await db
    .delete(courses)
    .where(eq(courses.id, id))
    .returning();
  return course;
}

// ---------------------------------------------------------------------------
// Course Modules
// ---------------------------------------------------------------------------

export async function createCourseModule(
  data: typeof courseModules.$inferInsert,
) {
  const [mod] = await db.insert(courseModules).values(data).returning();
  return mod;
}

export async function updateCourseModule(
  id: string,
  data: Partial<typeof courseModules.$inferInsert>,
) {
  const [mod] = await db
    .update(courseModules)
    .set(data)
    .where(eq(courseModules.id, id))
    .returning();
  return mod;
}

export async function deleteCourseModule(id: string) {
  const [mod] = await db
    .delete(courseModules)
    .where(eq(courseModules.id, id))
    .returning();
  return mod;
}

// ---------------------------------------------------------------------------
// Course Lessons
// ---------------------------------------------------------------------------

export async function createCourseLesson(
  data: typeof courseLessons.$inferInsert,
) {
  const [lesson] = await db.insert(courseLessons).values(data).returning();
  return lesson;
}

export async function updateCourseLesson(
  id: string,
  data: Partial<typeof courseLessons.$inferInsert>,
) {
  const [lesson] = await db
    .update(courseLessons)
    .set(data)
    .where(eq(courseLessons.id, id))
    .returning();
  return lesson;
}

export async function deleteCourseLesson(id: string) {
  const [lesson] = await db
    .delete(courseLessons)
    .where(eq(courseLessons.id, id))
    .returning();
  return lesson;
}

// ---------------------------------------------------------------------------
// Enrollments
// ---------------------------------------------------------------------------

export async function getEnrollmentsByUser(userId: string) {
  return db.query.enrollments.findMany({
    where: eq(enrollments.userId, userId),
    with: {
      course: true,
      progress: true,
    },
    orderBy: [desc(enrollments.createdAt)],
  });
}

export async function getEnrollmentsByCourse(courseId: string) {
  return db.query.enrollments.findMany({
    where: eq(enrollments.courseId, courseId),
    with: {
      user: true,
      progress: true,
    },
    orderBy: [desc(enrollments.createdAt)],
  });
}

export async function createEnrollment(
  data: typeof enrollments.$inferInsert,
) {
  const [enrollment] = await db.insert(enrollments).values(data).returning();
  return enrollment;
}

export async function updateEnrollment(
  id: string,
  data: Partial<typeof enrollments.$inferInsert>,
) {
  const [enrollment] = await db
    .update(enrollments)
    .set(data)
    .where(eq(enrollments.id, id))
    .returning();
  return enrollment;
}

// ---------------------------------------------------------------------------
// Enrollment Progress
// ---------------------------------------------------------------------------

export async function upsertLessonProgress(
  data: typeof enrollmentProgress.$inferInsert,
) {
  const existing = await db.query.enrollmentProgress.findFirst({
    where: and(
      eq(enrollmentProgress.enrollmentId, data.enrollmentId),
      eq(enrollmentProgress.lessonId, data.lessonId),
    ),
  });

  if (existing) {
    const [progress] = await db
      .update(enrollmentProgress)
      .set(data)
      .where(eq(enrollmentProgress.id, existing.id))
      .returning();
    return progress;
  }

  const [progress] = await db
    .insert(enrollmentProgress)
    .values(data)
    .returning();
  return progress;
}
