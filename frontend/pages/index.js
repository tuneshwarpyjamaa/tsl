import api from '@/services/api';
import PostCard from '@/components/PostCard';
import Meta from '@/components/Meta';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function HomePage() {
  const [data, setData] = useState({
    topStory: null,
    latestNews: [],
    featuredCategories: [],
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

        setData({
          topStory,
          latestNews,
          featuredCategories: categoriesWithSummaries,
          loading: false,
          error: null
        });
      } catch (err) {
        console.error(err);
        setData({
          topStory: null,
          latestNews: [],
          featuredCategories: [],
          loading: false,
          error: 'Failed to load content.'
        });
      }
    }

    fetchData();
  }, []);

  if (data.loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
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

  const { topStory, latestNews, featuredCategories } = data;

  return (
    <>
      <Meta
        title="The South Line - Latest News and Stories"
        description="Stay updated with the latest news, stories, and analysis from around the world. Unbiased reporting and in-depth coverage from The South Line."
      />
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

        </main>
      </div>
    </>
  );
}
