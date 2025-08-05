import type { Metadata, ResolvingMetadata } from 'next'

type Props = {
  params: { courseId: string }
}

// This function generates dynamic metadata (like the page title)
// It's the modern, recommended way to handle this.
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // For now, we'll just use the ID. Later, we can fetch the course title.
  const id = params.courseId
 
  return {
    title: `Course: ${id}`,
  }
}
 
// The page component itself remains simple.
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
  )
}