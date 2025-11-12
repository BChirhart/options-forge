import curriculumData from '@/content/curriculum.json';
import type { Level, Course, Lesson } from '@/types';

// Type for the curriculum structure
interface CurriculumData {
  levels: Array<{
    id: string;
    title: string;
    order: number;
    courses: Array<{
      id: string;
      title: string;
      description: string;
      order: number;
      lessons: Array<{
        id: string;
        title: string;
        videoId: string;
        textContent: string;
        order: number;
      }>;
    }>;
  }>;
}

const curriculum = curriculumData as CurriculumData;

/**
 * Fetch all levels ordered by their `order` field.
 */
export function fetchLevels(): Level[] {
  return curriculum.levels
    .map((level) => ({
      id: level.id,
      title: level.title,
      order: level.order,
    }))
    .sort((a, b) => a.order - b.order);
}

/**
 * Fetch all courses for a given level ordered by their `order` field.
 */
export function fetchCourses(levelId: string): Course[] {
  return getCourses(levelId);
}

/**
 * Alias for fetchCourses (used by pages)
 */
export function getCourses(levelId: string): Course[] {
  const level = curriculum.levels.find((l) => l.id === levelId);
  if (!level) {
    return [];
  }

  return level.courses
    .map((course) => ({
      id: course.id,
      title: course.title,
      description: course.description,
      order: course.order,
    }))
    .sort((a, b) => a.order - b.order);
}

/**
 * Fetch a single course document.
 */
export function fetchCourse(levelId: string, courseId: string): Course | null {
  return getCourse(levelId, courseId);
}

/**
 * Alias for fetchCourse (used by pages)
 */
export function getCourse(levelId: string, courseId: string): Course | null {
  const level = curriculum.levels.find((l) => l.id === levelId);
  if (!level) {
    return null;
  }

  const course = level.courses.find((c) => c.id === courseId);
  if (!course) {
    return null;
  }

  return {
    id: course.id,
    title: course.title,
    description: course.description,
    order: course.order,
  };
}

/**
 * Fetch all lessons for a given course ordered by their `order` field.
 */
export function fetchLessons(levelId: string, courseId: string): Lesson[] {
  return getLessons(levelId, courseId);
}

/**
 * Alias for fetchLessons (used by pages)
 */
export function getLessons(levelId: string, courseId: string): Lesson[] {
  const level = curriculum.levels.find((l) => l.id === levelId);
  if (!level) {
    return [];
  }

  const course = level.courses.find((c) => c.id === courseId);
  if (!course) {
    return [];
  }

  return course.lessons
    .map((lesson) => ({
      id: lesson.id,
      title: lesson.title,
      videoId: lesson.videoId,
      textContent: lesson.textContent,
      order: lesson.order,
    }))
    .sort((a, b) => a.order - b.order);
}

/**
 * Fetch a single lesson document.
 */
export function fetchLesson(
  levelId: string,
  courseId: string,
  lessonId: string
): Lesson | null {
  return getLesson(levelId, courseId, lessonId);
}

/**
 * Alias for fetchLesson (used by pages)
 */
export function getLesson(
  levelId: string,
  courseId: string,
  lessonId: string
): Lesson | null {
  const level = curriculum.levels.find((l) => l.id === levelId);
  if (!level) {
    return null;
  }

  const course = level.courses.find((c) => c.id === courseId);
  if (!course) {
    return null;
  }

  const lesson = course.lessons.find((l) => l.id === lessonId);
  if (!lesson) {
    return null;
  }

  return {
    id: lesson.id,
    title: lesson.title,
    videoId: lesson.videoId,
    textContent: lesson.textContent,
    order: lesson.order,
  };
}

/**
 * Get level by ID
 */
export function getLevel(levelId: string): Level | null {
  const level = curriculum.levels.find((l) => l.id === levelId);
  if (!level) {
    return null;
  }

  return {
    id: level.id,
    title: level.title,
    order: level.order,
  };
}

/**
 * Get level summaries with course and lesson counts
 */
export interface LevelSummary extends Level {
  courseCount: number;
  lessonCount: number;
}

export function getLevelSummaries(): LevelSummary[] {
  return curriculum.levels
    .map((level) => {
      const courseCount = level.courses.length;
      const lessonCount = level.courses.reduce(
        (sum, course) => sum + course.lessons.length,
        0
      );

      return {
        id: level.id,
        title: level.title,
        order: level.order,
        courseCount,
        lessonCount,
      };
    })
    .sort((a, b) => a.order - b.order);
}
