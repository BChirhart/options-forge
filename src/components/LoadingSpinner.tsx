export default function LoadingSpinner({ 
  message = 'Loading...' 
}: { 
  message?: string 
}) {
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
      <p className="text-gray-400">{message}</p>
    </div>
  );
}


