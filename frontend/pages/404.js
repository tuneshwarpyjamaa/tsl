import Link from 'next/link';
import Meta from '@/components/Meta';

export default function Custom404() {
  return (
    <>
      <Meta title="Page Not Found | The South Line" />
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
        <h1 className="text-6xl md:text-8xl font-serif font-bold mb-4">404</h1>
        <h2 className="text-2xl md:text-3xl font-serif mb-6">Page Not Found</h2>
        <p className="font-sans text-gray-600 mb-8 max-w-md">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/"
            className="px-6 py-3 bg-black text-white font-bold hover:bg-gray-800 transition-colors"
          >
            Go Home
          </Link>
          <Link
            href="/category/core-analysis"
            className="px-6 py-3 border-2 border-black font-bold hover:bg-gray-50 transition-colors"
          >
            Read Core Analysis
          </Link>
        </div>
      </div>
    </>
  );
}
