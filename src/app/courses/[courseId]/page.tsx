import type { NextPage } from 'next'

// Define the shape of the props our page receives
type Props = {
  params: {
    courseId: string
  }
}

// Use the official NextPage type to define our component.
// This is the key change that should satisfy the build server.
const CoursePage: NextPage<Props> = ({ params }) => {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Course Details</h1>
      <p className="mt-4 text-lg">
        Course ID:
        <span className="ml-2 rounded-md bg-gray-200 px-2 py-1 font-mono text-black">
          {params.courseId}
        </span>
      </p>
    </div>
  )
}

export default CoursePage