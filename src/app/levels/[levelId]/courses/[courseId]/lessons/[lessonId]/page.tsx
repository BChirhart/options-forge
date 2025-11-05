import LessonPageClient from '@/components/LessonPageClient';

export async function generateStaticParams() {
  // Return empty array - pages will be generated on-demand via client-side routing
  return [];
}

type LessonPageProps = {
  params: {
    levelId: string;
    courseId: string;
    lessonId: string;
  };
};

export default function LessonPage({ params }: LessonPageProps) {
  const { levelId, courseId, lessonId } = params;
  return <LessonPageClient levelId={levelId} courseId={courseId} lessonId={lessonId} />;
}
