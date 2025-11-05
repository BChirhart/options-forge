import CoursePageClient from '@/components/CoursePageClient';

export async function generateStaticParams() {
  // Return empty array - pages will be generated on-demand via client-side routing
  return [];
}

type CoursePageProps = {
  params: {
    levelId: string;
    courseId: string;
  };
};

export default function CoursePage({ params }: CoursePageProps) {
  const { levelId, courseId } = params;
  return <CoursePageClient levelId={levelId} courseId={courseId} />;
}
