import { useRouter } from 'next/router';
import { useEffect, useState, Suspense } from 'react';
import dynamic from 'next/dynamic';
import api from '@/services/api';
import Head from 'next/head';

// Lazy load PostCard component
const PostCard = dynamic(() => import('@/components/PostCard'), {
  loading: () => <div className="animate-pulse h-48 bg-gray-200 rounded"></div>
});

export default function CategoryPage() {
  const router = useRouter();
  const { slug } = router.query;
  const [data, setData] = useState({ category: null, posts: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!slug) return;
    (async () => {
      try {
        const res = await api.get(`/categories/${slug}/posts`);
        setData(res.data);
      } catch (e) {
        console.error('Error fetching category:', e);
        setError('Failed to load category. Please try again later.');
        if (e.response?.status === 404) {
          setError('Category not found');
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  const featuredPost = data.posts[0];
  const otherPosts = data.posts.slice(1);
  const categoryUrl = `https://yourdomain.com/category/${data.category?.slug}`;
  const categoryDescription = `Read all articles in the ${data.category?.name} category on TMW Blog. Discover the latest news and stories.`;

  return (
    <>
      <Head>
        <title>{data.category?.name} | TMW Blog</title>
        <meta name="description" content={categoryDescription} />
        <meta name="keywords" content={`${data.category?.name}, news, blog, articles, TMW`} />
        <link rel="canonical" href={categoryUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={`${data.category?.name} | TMW Blog`} />
        <meta property="og:description" content={categoryDescription} />
        <meta property="og:url" content={categoryUrl} />
        <meta property="og:image" content="https://yourdomain.com/category-og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${data.category?.name} | TMW Blog`} />
        <meta name="twitter:description" content={categoryDescription} />
        <meta name="twitter:image" content="https://yourdomain.com/category-twitter-image.jpg" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "CollectionPage",
              "name": `${data.category?.name} Category`,
              "description": categoryDescription,
              "url": categoryUrl,
              "publisher": {
                "@type": "Organization",
                "name": "TMW Blog"
              }
            })
          }}
        />
      </Head>
      <div>
        <h1 className="text-3xl font-bold border-b pb-4 mb-8">{data.category?.name}</h1>
        {data.posts.length === 0 ? (
          <div>No posts yet.</div>
        ) : (
          <Suspense fallback={<div className="animate-pulse"><div className="h-48 bg-gray-200 rounded mb-4"></div><div className="grid grid-cols-3 gap-4">{[...Array(6)].map((_, i) => (<div key={i} className="h-32 bg-gray-200 rounded"></div>))}</div></div>}>
            <div className="space-y-8">
              {featuredPost && <PostCard post={featuredPost} variant="featured" />}
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {otherPosts.map((p) => (
                  <PostCard key={p._id} post={p} />
                ))}
              </div>
            </div>
          </Suspense>
        )}
      </div>
    </>
  );
}
