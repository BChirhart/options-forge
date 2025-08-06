// src/app/courses/[courseId]/page.tsx

// 1. Define a type for your component's props
type Props = {
  params: {
    courseId: string;
  };
  // You can also add searchParams here if you need them
  // searchParams: { [key: string]: string | string[] | undefined };
};

// 2. Use the 'Props' type for your component
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