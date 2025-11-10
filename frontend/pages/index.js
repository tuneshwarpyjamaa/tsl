import { useEffect, useState, Suspense } from 'react';
import api from '@/services/api';
import PostCard from '@/components/PostCard';
import Head from 'next/head';
import Link from 'next/link';

const HomePageLayout = ({ topStory, latestNews, featuredCategories }) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Head>
        <title>The Mandate Wire</title>
        <meta name="description" content="Unbiased news and analysis." />
      </Head>

      <main>
        {/* Top Story */}
        {topStory && (
          <section className="mb-8 border-b-2 border-black pb-8">
            <PostCard post={topStory} variant="featured" />
          </section>
        )}

        {/* Main Grid */}
        <div className="grid grid-cols-12 gap-8">
          {/* Latest News */}
          <div className="col-span-12 lg:col-span-8">
            <h2 className="text-2xl font-serif font-bold border-b-2 border-black pb-2 mb-4">
              Latest News
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {latestNews.map(post => (
                <PostCard key={post.slug} post={post} variant="default" />
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="col-span-12 lg:col-span-4">
            {featuredCategories.map(category => (
              <div key={category.slug} className="mb-8">
                <h3 className="text-xl font-serif font-bold border-b-2 border-black pb-2 mb-4">
                  <Link href={`/category/${category.slug}`} className="hover:underline">
                    {category.name}
                  </Link>
                </h3>
                <div className="space-y-4">
                  {category.posts.slice(0, 3).map(post => (
                    <PostCard key={post.slug} post={post} variant="side" />
                  ))}
                </div>
              </div>
            ))}
          </aside>
        </div>
      </main>
    </div>
  );
};

export default function HomePage() {
  const [topStory, setTopStory] = useState(null);
  const [latestNews, setLatestNews] = useState([]);
  const [featuredCategories, setFeaturedCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postsRes, categoriesRes] = await Promise.all([
          api.get('/posts'),
          api.get('/categories/featured'),
        ]);

        const posts = postsRes.data;
        if (posts.length > 0) {
          setTopStory(posts[0]);
          setLatestNews(posts.slice(1, 7));
        }

        setFeaturedCategories(categoriesRes.data);
      } catch (err) {
        setError('Failed to load content.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (error) return <div className="text-center py-20 text-red-500">{error}</div>;

  return (
    <HomePageLayout
      topStory={topStory}
      latestNews={latestNews}
      featuredCategories={featuredCategories}
    />
  );
}