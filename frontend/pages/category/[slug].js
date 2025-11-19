import api from '@/services/api';
import Meta from '@/components/Meta';
import PostCard from '@/components/PostCard';
import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function CategoryPage() {
  const router = useRouter();
  const { slug } = router.query;

  const [data, setData] = useState({
    category: null,
    posts: [],
    loading: true,
    error: null
  });

  useEffect(() => {
    if (!slug) return;

    async function fetchData() {
      try {
        const { data: response } = await api.get(`/api/categories/${slug}/posts`);

        if (response && response.category) {
          setData({
            category: response.category,
            posts: response.posts || [],
            loading: false,
            error: null
          });
        } else {
          setData({
            category: null,
            posts: [],
            loading: false,
            error: 'Category not found'
          });
        }
      } catch (e) {
        console.error(`Error fetching category '${slug}':`, e);
        if (e.response?.status === 404) {
          setData({
            category: null,
            posts: [],
            loading: false,
            error: 'Category not found'
          });
        } else {
          setData({
            category: null,
            posts: [],
            loading: false,
            error: 'Failed to load category. The server might be temporarily down.'
          });
        }
      }
    }

    fetchData();
  }, [slug]);

  if (data.loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading category...</p>
        </div>
      </div>
    );
  }

  if (data.error) {
    return <div className="text-center py-20 text-red-500">{data.error}</div>;
  }

  if (!data.category) return null;

  const { category, posts } = data;

  const featuredPost = posts[0];
  const otherPosts = posts.slice(1);
  const categoryUrl = `https://yourdomain.com/category/${category.slug}`;
  const categoryDescription = `Read all articles in the ${category.name} category on The South Line. Discover the latest news and stories.`;

  return (
    <>
      <Meta
        title={`${category.name} | The South Line`}
        description={categoryDescription}
        keywords={`${category.name}, news, blog, articles, The South Line`}
        url={categoryUrl}
      />
      {/* JSON-LD Schema for rich results */}
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "CollectionPage",
              "name": `${category.name} Category`,
              "description": categoryDescription,
              "url": categoryUrl,
              "publisher": {
                "@type": "Organization",
                "name": "The South Line"
              }
            })
          }}
        />
      </Head>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-bold border-b pb-4 mb-8">{category.name}</h1>
        {posts.length === 0 ? (
          <div>No posts in this category yet.</div>
        ) : (
          <div className="space-y-8">
            {featuredPost && <PostCard post={featuredPost} variant="featured" />}
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {otherPosts.map((p) => (
                <PostCard key={p._id} post={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

