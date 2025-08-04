// This is a Server Component, so we don't need 'use client'

// The 'params' object is automatically passed to dynamic pages
// The shape of 'params' matches our folder structure: { courseId: '...' }
export default function CoursePage({ params }: { params: { courseId: string } }) {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Course Details</h1>
      <p className="mt-4 text-lg">
        You are viewing the page for course ID: 
        <span className="font-mono bg-gray-200 text-black px-2 py-1 rounded-md ml-2">
          {params.courseId}
        </span>
      </p>
      {/* Later, we will fetch and display the lessons for this course here */}
    </div>
  );
}