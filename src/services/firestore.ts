import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Level, Course, Lesson } from '@/types';

export class FirestoreError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'FirestoreError';
  }
}

/**
 * Fetch all levels ordered by their `order` field.
 */
export async function fetchLevels(): Promise<Level[]> {
  try {
    const levelsQuery = query(collection(db, 'levels'), orderBy('order'));
    const querySnapshot = await getDocs(levelsQuery);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Level[];
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorCode = (error as any)?.code || 'unknown';
    throw new FirestoreError(`Failed to fetch levels: ${errorMessage}`, errorCode);
  }
}

/**
 * Fetch all courses for a given level ordered by their `order` field.
 */
export async function fetchCourses(levelId: string): Promise<Course[]> {
  try {
    const coursesQuery = query(
      collection(db, `levels/${levelId}/courses`),
      orderBy('order')
    );
    const querySnapshot = await getDocs(coursesQuery);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Course[];
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorCode = (error as any)?.code || 'unknown';
    throw new FirestoreError(`Failed to fetch courses: ${errorMessage}`, errorCode);
  }
}

/**
 * Fetch a single course document.
 */
export async function fetchCourse(levelId: string, courseId: string): Promise<Course | null> {
  try {
    const courseRef = doc(db, `levels/${levelId}/courses`, courseId);
    const courseSnap = await getDoc(courseRef);
    if (!courseSnap.exists()) return null;
    return { id: courseSnap.id, ...courseSnap.data() } as Course;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorCode = (error as any)?.code || 'unknown';
    throw new FirestoreError(`Failed to fetch course: ${errorMessage}`, errorCode);
  }
}

/**
 * Fetch lessons for a course ordered by `order`.
 */
export async function fetchLessons(levelId: string, courseId: string): Promise<Lesson[]> {
  try {
    const lessonsQuery = query(
      collection(db, `levels/${levelId}/courses/${courseId}/lessons`),
      orderBy('order')
    );
    const querySnapshot = await getDocs(lessonsQuery);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Lesson[];
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorCode = (error as any)?.code || 'unknown';
    throw new FirestoreError(`Failed to fetch lessons: ${errorMessage}`, errorCode);
  }
}

/**
 * Fetch a single lesson document.
 */
export async function fetchLesson(
  levelId: string,
  courseId: string,
  lessonId: string
): Promise<Lesson | null> {
  try {
    const lessonRef = doc(db, `levels/${levelId}/courses/${courseId}/lessons`, lessonId);
    const lessonSnap = await getDoc(lessonRef);
    if (!lessonSnap.exists()) return null;
    return { id: lessonSnap.id, ...lessonSnap.data() } as Lesson;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorCode = (error as any)?.code || 'unknown';
    throw new FirestoreError(`Failed to fetch lesson: ${errorMessage}`, errorCode);
  }
}


