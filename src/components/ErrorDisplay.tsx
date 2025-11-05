import Link from 'next/link';

interface ErrorDisplayProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  showBackButton?: boolean;
  backHref?: string;
  backLabel?: string;
}

export default function ErrorDisplay({
  title = 'Something went wrong',
  message,
  onRetry,
  showBackButton = true,
  backHref = '/dashboard',
  backLabel = 'Back to Dashboard',
}: ErrorDisplayProps) {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen p-8">
      <div className="max-w-md w-full bg-gray-800 rounded-lg p-8 text-center">
        <div className="text-red-500 text-5xl mb-4">⚠️</div>
        <h1 className="text-2xl font-bold text-white mb-4">{title}</h1>
        <p className="text-gray-400 mb-6">{message}</p>
        
        <div className="flex flex-col gap-3">
          {onRetry && (
            <button
              onClick={onRetry}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              Try Again
            </button>
          )}
          
          {showBackButton && (
            <Link
              href={backHref}
              className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors inline-block"
            >
              {backLabel}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}


