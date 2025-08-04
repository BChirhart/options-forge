// Define a clear type for the props our page will receive
type CoursePageProps = {
  params: {
    courseId: string;
  };
};

// Use our new type to define the component's props
export default function CoursePage({ params }: CoursePageProps) {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Course Details</h1>
      <p className="mt-4 text-lg">
        You are viewing the page for course ID:
        <span className="ml-2 rounded-md bg-gray-200 px-2 py-1 font-mono text-black">
          {params.courseId}
        </span>
      </p>
      {/* Later, we will fetch and display the lessons for this course here */}
    </div>
  );
}