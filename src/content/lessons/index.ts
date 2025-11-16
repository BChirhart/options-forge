// Import all lesson content files
// This file acts as a registry for all lesson content
// Structure: lessons/[number-levelId]/[number-courseId]/[number-lessonId].json

// Beginner - Options Fundamentals
import lesson1 from './1-beginner/1-options-fundamentals/1-what-is-an-option-the-right-not-the-obligation.json';
import lesson2 from './1-beginner/1-options-fundamentals/2-stocks-vs-options-ownership-vs-rights.json';

// Map lesson IDs to their content
// Format: 'levelId/courseId/lessonId' -> content (using prefixed paths)
const lessonContentMap: Record<string, typeof lesson1> = {
  'beginner/options-fundamentals/what-is-an-option-the-right-not-the-obligation': lesson1,
  'beginner/options-fundamentals/stocks-vs-options-ownership-vs-rights': lesson2,
};

export default lessonContentMap;

