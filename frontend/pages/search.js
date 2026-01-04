import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import PostCard from '@/components/PostCard';
import { searchPosts } from '@/services/api';

export default function SearchResults() {
  const router = useRouter();
  const { q } = router.query;
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!q) return;

      setLoading(true);
      try {
        const response = await searchPosts(q);
        setResults(response.data || []);
        setError(null);
      } catch (err) {
        console.error('Error searching posts:', err);
        setError('Failed to load search results. Please try again later.');
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [q]);

  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>Search Results for "{q}" | The South Line</title>
        <meta name="description" content={`Search results for "${q}"`} />
      </Head>

      <main className="flex-1 container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold mb-6">
            Search Results for "{q}"
          </h1>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
              <p className="text-red-700">{error}</p>
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No results found for "{q}"</p>
              <p className="text-gray-500 mt-2">Try different keywords or check back later.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {results.map((post) => (
                <PostCard key={post.slug || post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
