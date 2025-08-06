export default async function TestPage({ params }: { params: { testId: string } }) {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Test Page</h1>
      <p className="mt-4">
        The Test ID is: {params.testId}
      </p>
    </div>
  );
}