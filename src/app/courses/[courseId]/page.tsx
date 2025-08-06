// Add the 'async' keyword to make this an async component
export default async function CoursePage({ params }: { params: { courseId: string } }) {
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