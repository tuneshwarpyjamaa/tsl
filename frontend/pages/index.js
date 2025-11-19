import api from '@/services/api';
import PostCard from '@/components/PostCard';
import Meta from '@/components/Meta';
import Link from 'next/link';

export default function HomePage({ topStory, latestNews, featuredCategories, error }) {
  if (error) {
    return <div className="text-center py-20 text-red-500">{error}</div>;
  }

  return (
    <>
      <Meta
        title="The South Line - Latest News and Stories"
        description="Stay updated with the latest news, stories, and analysis from around the world. Unbiased reporting and in-depth coverage from The South Line."
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <main className="space-y-8 sm:space-y-10">
          {/* Top Story */}
          {topStory && (
            <section className="border-b border-gray-200 pb-6 sm:pb-8">
              <h2 className="sr-only">Top Story</h2>
              <PostCard post={topStory} variant="featured" />
            </section>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Latest News - Main Content */}
            <div className="lg:col-span-8">
              <div className="mb-8">
                <h2 className="text-2xl sm:text-3xl font-serif font-bold border-b-2 border-black pb-2 mb-4">
                  Latest News
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {latestNews.map((post, index) => (
                    <div
                      key={post.slug}
                      className={`${index > 1 ? 'hidden sm:block' : ''} ${index > 3 ? 'hidden lg:block' : ''}`}
                    >
                      <PostCard post={post} variant="default" />
                    </div>
                  ))}
                </div>

                <div className="mt-8 text-center sm:hidden">
                  <button className="bg-black text-white px-6 py-2 text-sm font-bold hover:bg-gray-800 transition-colors">
                    Load More Stories
                  </button>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-4 space-y-10">
              {featuredCategories.map((category, index) => (
                <div key={category.slug} className={`${index > 0 ? 'pt-6 border-t border-gray-200' : ''}`}>
                  <h3 className="text-xl font-serif font-bold border-b-2 border-black pb-2 mb-3">
                    <Link
                      href={`/category/${category.slug}`}
                      className="hover:underline flex items-center justify-between"
                    >
                      {category.name}
                      <span className="text-sm font-sans font-normal text-gray-500">View all</span>
                    </Link>
                  </h3>
                  <div className="space-y-4">
                    {category.posts.slice(0, 3).map((post, i) => (
                      <div key={post.slug} className={i > 0 ? 'pt-4 border-t border-gray-100' : ''}>
                        <PostCard post={post} variant="side" />
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-serif font-bold mb-3">Stay Updated</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Get the latest news and updates delivered to your inbox.
                </p>
                <form className="space-y-3">
                  <input
                    type="email"
                    placeholder="Your email address"
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    required
                  />
                  <button
                    type="submit"
                    className="w-full bg-black text-white py-2 px-4 text-sm font-bold hover:bg-gray-800 transition-colors"
                  >
                    Subscribe
                  </button>
                </form>
              </div>
            </aside>
          </div>
        </main>
      </div>
    </>
  );
}

export async function getServerSideProps() {
  try {
    const createSummary = (post) => ({
      ...post,
      summary: (post.content || '').substring(0, 150) + '...',
    });

    const [postsRes, categoriesRes] = await Promise.all([
      api.get('/posts/optimized/list?limit=8&page=1'),
      api.get('/categories/featured'),
    ]);

    const rawPosts = postsRes.data.data?.posts || [];
    const posts = rawPosts.map(createSummary);

    let topStory = null;
    let latestNews = [];
    if (posts.length > 0) {
      topStory = posts[0];
      latestNews = posts.slice(1, 7);
    }

    const rawCategories = Array.isArray(categoriesRes.data) ? categoriesRes.data : (categoriesRes.data.data || []);
    const categoriesWithSummaries = rawCategories.map((category) => ({
      ...category,
      posts: category.posts.map(createSummary),
    }));

    return {
      props: {
        topStory,
        latestNews,
        featuredCategories: categoriesWithSummaries,
      },
    };
  } catch (err) {
    console.error(err);
    return {
      props: {
        error: 'Failed to load content.',
        topStory: null,
        latestNews: [],
        featuredCategories: [],
      },
    };
  }
}
