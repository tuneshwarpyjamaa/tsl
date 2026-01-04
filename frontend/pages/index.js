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

<<<<<<< HEAD
        const postsRes = await api.get('/api/posts/optimized/list?limit=10&page=1');
        const rawPosts = postsRes.data.data?.posts || [];
        const posts = rawPosts.map(createSummary);

=======
        // Fetch posts and categories
        const [postsRes, categoriesRes] = await Promise.all([
          api.get('/api/posts/optimized/list?limit=10&page=1'),
          api.get('/api/categories/featured'),
        ]);

        const rawPosts = postsRes.data.data?.posts || [];
        const posts = rawPosts.map(createSummary);

        let topStory = null;
        let latestNews = [];
        if (posts.length > 0) {
          topStory = posts[0];
          latestNews = posts.slice(1);
        }

        const rawCategories = Array.isArray(categoriesRes.data) ? categoriesRes.data : (categoriesRes.data.data || []);
        const categoriesWithSummaries = rawCategories.map((category) => ({
          ...category,
          posts: category.posts.map(createSummary),
        }));

>>>>>>> e65eaf1719096ce87fbcabe4c2e714aa612d3010
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
<<<<<<< HEAD
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
=======
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <main className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Main Content Area (Left 8 cols) */}
          <div className="lg:col-span-8 space-y-12">

            {/* Hero Section */}
            {topStory && (
              <section className="border-b border-gray-100 pb-12">
                <PostCard post={topStory} variant="featured" />
              </section>
            )}

            {/* Latest Stories Stream */}
            <section>
              <div className="space-y-12">
                {latestNews.map((post) => (
                  <div key={post.slug} className="border-b border-gray-100 pb-12 last:border-0 last:pb-0">
                    <PostCard post={post} variant="default" />
                  </div>
                ))}
              </div>

              <div className="mt-12 text-center">
                <button className="px-6 py-3 border border-gray-200 rounded-full text-sm font-medium text-gray-600 hover:border-gray-900 hover:text-gray-900 transition-colors">
                  Load more stories
                </button>
              </div>
            </section>
          </div>

          {/* Sidebar (Right 4 cols) */}
          <aside className="lg:col-span-4 space-y-12 lg:pl-8 lg:border-l lg:border-gray-100">
            {/* Featured Categories */}
            {featuredCategories.map((category) => (
              <div key={category.slug}>
                <h3 className="font-sans font-bold text-xs tracking-wider uppercase text-gray-500 mb-6">
                  <Link
                    href={`/category/${category.slug}`}
                    className="hover:text-black transition-colors"
                  >
                    {category.name}
                  </Link>
                </h3>
                <div className="space-y-6">
                  {category.posts.slice(0, 4).map((post) => (
                    <PostCard key={post.slug} post={post} variant="side" />
                  ))}
                </div>
              </div>
            ))}

            {/* Newsletter */}
            <div className="bg-gray-50 p-8 rounded-2xl">
              <h3 className="font-serif font-bold text-xl mb-3">The Daily Digest</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Get the most important stories delivered to your inbox every morning.
              </p>
              <form className="space-y-3">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-900"
                  required
                />
                <button
                  type="submit"
                  className="w-full bg-black text-white py-3 px-4 font-medium rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Subscribe
                </button>
              </form>
            </div>

             {/* Footer Links (Mini) */}
             <div className="pt-8 border-t border-gray-100">
               <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                 <Link href="/about" className="hover:text-gray-900">About</Link>
                 <Link href="/privacy" className="hover:text-gray-900">Privacy</Link>
                 <Link href="/terms" className="hover:text-gray-900">Terms</Link>
                 <Link href="/contact" className="hover:text-gray-900">Contact</Link>
               </div>
               <p className="mt-4 text-xs text-gray-400">© 2024 The South Line.</p>
             </div>
          </aside>

>>>>>>> e65eaf1719096ce87fbcabe4c2e714aa612d3010
        </main>
      </div>
    </>
  );
}
