import api from '@/services/api';
import PostCard from '@/components/PostCard';
import Meta from '@/components/Meta';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function HomePage() {
  const [data, setData] = useState({
    posts: [],
    loading: true,
    error: null
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const createSummary = (post) => ({
          ...post,
          summary: (post.content || '').substring(0, 150) + '...',
        });

        const postsRes = await api.get('/api/posts/optimized/list?limit=10&page=1');
        const rawPosts = postsRes.data.data?.posts || [];
        const posts = rawPosts.map(createSummary);
        setData({
          posts,
          loading: false,
          error: null
        });
      } catch (err) {
        console.error(err);
        setData({
          posts: [],
          loading: false,
          error: 'Failed to load content.'
        });
      }
    }

    fetchData();
  }, []);

  if (data.loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading stories...</p>
        </div>
      </div>
    );
  }

  if (data.error) {
    return <div className="text-center py-20 text-red-500">{data.error}</div>;
  }

  const { posts } = data;

  // Split posts for different sections
  const heroPost = posts[0];
  const secondaryPosts = posts.slice(1, 3); // 2 stacked articles
  const gridPosts = posts.slice(3, 9); // 6 articles in grid (3 columns x 2 rows)

  // Featured quote (you can make this dynamic later)
  const featuredQuote = {
    text: "Recent developments in Venezuela are matter of deep concern... closely monitoring situation",
    context: "Latest Analysis"
  };

  return (
    <>
      <Meta
        title="The South Line - Latest News and Stories"
        description="Stay updated with the latest news, stories, and analysis from around the world. Unbiased reporting and in-depth coverage from The South Line."
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <main className="space-y-8">
          {/* Hero Section: Large Featured + Two Stacked Articles */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 border-b border-gray-200 pb-8">
            {/* Left: Large Featured Article */}
            <div className="lg:pr-4">
              {heroPost && <PostCard post={heroPost} variant="hero" />}
            </div>

            {/* Right: Two Stacked Secondary Articles */}
            <div className="space-y-6 lg:pl-4 lg:border-l border-gray-200">
              {secondaryPosts.map((post) => (
                <div key={post.slug}>
                  <PostCard post={post} variant="secondary" />
                </div>
              ))}
            </div>
          </section>

          {/* Quote Section */}
          <section className="py-8 border-b border-gray-200">
            <div className="max-w-4xl mx-auto text-center px-4">
              <div className="relative">
                <svg className="absolute -top-4 -left-4 w-12 h-12 text-red-600 opacity-50" fill="currentColor" viewBox="0 0 32 32">
                  <path d="M10 8c-3.3 0-6 2.7-6 6v10h10V14h-6c0-2.2 1.8-4 4-4V8zm16 0c-3.3 0-6 2.7-6 6v10h10V14h-6c0-2.2 1.8-4 4-4V8z" />
                </svg>
                <svg className="absolute -bottom-4 -right-4 w-12 h-12 text-red-600 opacity-50 rotate-180" fill="currentColor" viewBox="0 0 32 32">
                  <path d="M10 8c-3.3 0-6 2.7-6 6v10h10V14h-6c0-2.2 1.8-4 4-4V8zm16 0c-3.3 0-6 2.7-6 6v10h10V14h-6c0-2.2 1.8-4 4-4V8z" />
                </svg>
                <blockquote className="relative z-10">
                  <p className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-gray-900 leading-tight mb-4">
                    {featuredQuote.text}
                  </p>
                  <footer className="text-sm uppercase tracking-wider text-gray-500 font-sans">
                    {featuredQuote.context}
                  </footer>
                </blockquote>
              </div>
            </div>
          </section>

          {/* 3-Column Grid Section */}
          <section className="pb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {gridPosts.map((post) => (
                <div key={post.slug}>
                  <PostCard post={post} variant="grid" />
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
