import { useEffect, useState, Suspense } from 'react';
import dynamic from 'next/dynamic';
import api from '@/services/api';
import Link from 'next/link';
import Head from 'next/head';

// Lazy load PostCard component
const PostCard = dynamic(() => import('@/components/PostCard'), {
  loading: () => <div className="animate-pulse h-48 bg-gray-200 rounded"></div>
});

const FullLayout = ({ posts, trendingPosts, featuredCategories }) => {
  const [visibleStories, setVisibleStories] = useState(3);
  const [loadingMore, setLoadingMore] = useState(false);

  // Post distribution for news layout
  const heroPost = posts[0] || null;
  const latestNewsPosts = posts.slice(1, 6);
  const featuredPosts = posts.slice(6, 12);
  const moreStoriesPosts = posts.slice(12);

  const handleLoadMore = () => {
    setLoadingMore(true);
    setTimeout(() => {
      setVisibleStories(prev => prev + 3);
      setLoadingMore(false);
    }, 500); // Simulate network delay
  };

  return (
    <div className="max-w-7xl mx-auto px-4">

      {/* Main Hero Section - More compact */}
      <section className="mb-8 border-b border-gray-200 pb-6">
        <div className="grid grid-cols-12 gap-4 md:gap-6">
          {/* Main Hero Content */}
          <div className="col-span-12 lg:col-span-8">
            <div className="grid grid-cols-12 gap-4 md:gap-6">
              {/* Hero Text */}
              <div className="col-span-12 md:col-span-6">
                {heroPost ? (
                  <Link href={`/post/${encodeURIComponent(heroPost.slug)}`} className="group">
                    <h1 className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold leading-tight text-gray-900 mb-3 group-hover:text-blue-700 transition-colors">
                      {heroPost.title}
                    </h1>
                    <p className="text-gray-700 text-base leading-relaxed mb-3 line-clamp-3">
                      {(heroPost?.content || '').slice(0, 200)}...
                    </p>
                    <div className="flex items-center text-sm text-gray-500">
                      <span>By {heroPost?.author || 'Staff Writer'}</span>
                      <span className="mx-2">•</span>
                      <span>{new Date().toLocaleDateString()}</span>
                    </div>
                  </Link>
                ) : (
                  <div className="h-48 bg-gray-100 rounded flex items-center justify-center">
                    <span className="text-gray-400">No featured post</span>
                  </div>
                )}
              </div>

              {/* Hero Image */}
              <div className="col-span-12 md:col-span-6">
                {heroPost ? (
                  <Link href={`/post/${encodeURIComponent(heroPost.slug)}`}>
                    <div className="w-full h-48 md:h-56 bg-gray-200 rounded-lg flex items-center justify-center cursor-pointer hover:opacity-95 transition-opacity overflow-hidden">
                      {heroPost.image ? (
                        <img
                          src={heroPost.image}
                          alt={heroPost.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="text-gray-500 bg-gray-300 w-full h-full flex items-center justify-center">
                          <span>No Image</span>
                        </div>
                      )}
                    </div>
                  </Link>
                ) : (
                  <div className="w-full h-48 md:h-56 bg-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-gray-500">No Image</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Latest News Sidebar - More compact */}
          <aside className="col-span-12 lg:col-span-4 border-l border-gray-200 pl-4 lg:pl-6">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wide text-sm">Latest News</h3>
              <span className="text-gray-400 text-lg">›</span>
            </div>
            <ul className="space-y-3">
              {latestNewsPosts.length > 0 ? (
                latestNewsPosts.map((p, index) => (
                  <li key={p.slug || index} className={`pb-3 ${index < latestNewsPosts.length - 1 ? 'border-b border-gray-100' : ''}`}>
                    <PostCard post={p} variant="compact" />
                  </li>
                ))
              ) : (
                <li key="no-latest-news" className="text-gray-500 text-sm py-2">No latest news</li>
              )}
            </ul>
          </aside>
        </div>
      </section>

      {/* Featured Posts Grid - More dense */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">Featured Stories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {featuredPosts.length > 0 ? (
            featuredPosts.slice(0, 6).map((p) => (
              <PostCard key={p.slug} post={p} variant="featured" />
            ))
          ) : (
            <div className="col-span-3 text-gray-500 text-center py-4">
              No featured stories available
            </div>
          )}
        </div>
      </section>

      {/* Category Sections */}
      {featuredCategories && featuredCategories.length > 0 && (
        featuredCategories.map(category => (
          <section key={category.slug} className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
              <Link href={`/category/${category.slug}`} className="hover:text-blue-700">
                {category.name}
              </Link>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {category.posts.map((p) => (
                <PostCard key={p.slug} post={p} variant="featured" />
              ))}
            </div>
          </section>
        ))
      )}

      {/* More Stories Section - If we have additional posts */}
      {moreStoriesPosts.length > 0 && (
        <section className="border-t border-gray-200 pt-6">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 md:col-span-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">More Stories</h2>
              <div className="grid gap-4">
                {moreStoriesPosts.slice(0, visibleStories).map((p) => (
                  <PostCard key={p.slug} post={p} variant="list" />
                ))}
              </div>
              {visibleStories < moreStoriesPosts.length && (
                <div className="text-center mt-6">
                  <button
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                    className="bg-black text-white px-6 py-2 font-semibold rounded hover:bg-gray-800 transition-colors disabled:bg-gray-400"
                  >
                    {loadingMore ? (
                      <div className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Loading...
                      </div>
                    ) : 'Load More'}
                  </button>
                </div>
              )}
            </div>
            <div className="col-span-12 md:col-span-4">
              {trendingPosts && trendingPosts.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">Trending</h3>
                  <ul className="space-y-4">
                    {trendingPosts.map((p, index) => (
                      <li key={p.slug || index} className="border-b border-gray-100 pb-2">
                        <PostCard post={p} variant="compact" />
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

const SimpleLayout = ({ posts }) => {
  return (
    <div className="max-w-7xl mx-auto px-4">
      
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((p) => (
          <PostCard key={p.slug} post={p} />
        ))}
      </div>
    </div>
  );
};

export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const [trendingPosts, setTrendingPosts] = useState([]);
  const [featuredCategories, setFeaturedCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFeaturedCategories = async () => {
      try {
        const { data } = await api.get('/categories/featured');
        setFeaturedCategories(data);
      } catch (e) {
        console.error('Failed to load featured categories:', e);
      }
    };

    const fetchTrending = async () => {
      try {
        const { data } = await api.get('/posts/trending');
        setTrendingPosts(data);
      } catch (e) {
        console.error('Failed to load trending posts:', e);
      }
    };

    const fetchPosts = async () => {
      try {
        const { data } = await api.get('/posts');
        setPosts(data);
      } catch (e) {
        setError('Failed to load posts');
      }
    };

    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchPosts(), fetchTrending(), fetchFeaturedCategories()]);
      setLoading(false);
    };

    loadData();
  }, []);

  if (loading) return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
        <div className="grid grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="max-w-7xl mx-auto px-4 py-8 text-red-600 bg-red-50 p-4 rounded border border-red-200">
      {error}
    </div>
  );
  
  if (posts.length === 0) return (
    <div className="max-w-7xl mx-auto px-4 py-8 text-gray-500 text-center">
      No posts found.
    </div>
  );

  // Use FullLayout when we have enough posts, otherwise SimpleLayout
  return (
    <Suspense fallback={<div className="animate-pulse"><div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div><div className="grid grid-cols-3 gap-6">{[...Array(6)].map((_, i) => (<div key={i} className="h-64 bg-gray-200 rounded"></div>))}</div></div>}>
      {posts.length >= 7 ? <FullLayout posts={posts} trendingPosts={trendingPosts} featuredCategories={featuredCategories} /> : <SimpleLayout posts={posts} />}
    </Suspense>
  );
}
