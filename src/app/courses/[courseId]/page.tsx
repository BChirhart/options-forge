// src/app/courses/[courseId]/page.tsx

import type { Metadata } from 'next';

// This Props type can be used by both the page and generateMetadata
type Props = {
  params: { courseId: string };
};

// 1. Add a correctly typed generateMetadata function
// It uses the same Props type but MUST return a Promise<Metadata>
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // You can fetch data here to create a dynamic title, etc.
  const id = params.courseId;
  return {
    title: `Details for Course ${id}`,
  };
}

// 2. Your page component using the same Props type
// This part is the same as the previous fix
export default async function CoursePage({ params }: Props) {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Course Details</h1>
      <p className="mt-4 text-lg">
        You are viewing the page for course ID:
        <span className="ml-2 rounded-md bg-gray-200 px-2 py-1 font-mono text-black">
          {params.courseId}
        </span>
      </p>
    </div>
  );
}