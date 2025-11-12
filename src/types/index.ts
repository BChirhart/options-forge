// Firestore document types
export interface Level {
  id: string;
  title: string;
  order: number;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  order: number;
}

export interface Lesson {
  id: string;
  title: string;
  videoId: string;
  textContent: string;
  questions?: Array<{
    question: string;
    options: Array<{
      text: string;
      isCorrect: boolean;
      feedback: string;
    }>;
  }>;
  order: number;
}

// Auth types
export interface User {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}


