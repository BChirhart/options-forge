// Define a more complete and robust type for the page's props
type Props = {
  params: { courseId: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

// Use our new Props type here
export default function CoursePage({ params }: Props) {
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