import LevelPageClient from '@/components/LevelPageClient';

export async function generateStaticParams() {
  // Return empty array - pages will be generated on-demand via client-side routing
  return [];
}

type LevelPageProps = {
  params: {
    levelId: string;
  };
};

export default function LevelPage({ params }: LevelPageProps) {
  const { levelId } = params;
  return <LevelPageClient levelId={levelId} />;
}
