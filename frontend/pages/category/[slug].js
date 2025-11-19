import api from '@/services/api';
import Meta from '@/components/Meta';
import PostCard from '@/components/PostCard';
import Head from 'next/head';

export default function CategoryPage({ category, posts, error }) {
  if (error) {
    return <div className="text-center py-20 text-red-500">{error}</div>;
  }
  if (!category) return null;

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

export async function getServerSideProps(context) {
  const { slug } = context.params;

  try {
    const { data } = await api.get(`/categories/${slug}/posts`);

    // Check if the API call was successful and data exists
    if (data && data.category) {
      return {
        props: {
          category: data.category,
          posts: data.posts || [],
        },
      };
    } else {
      // If the category is not found by the API
      return { notFound: true };
    }
  } catch (e) {
    console.error(`Error fetching category '${slug}':`, e);
    // If the API returns a 404 status
    if (e.response?.status === 404) {
      return { notFound: true };
    }
    // Handle other server errors
    return {
      props: {
        error: 'Failed to load category. The server might be temporarily down.',
        category: null,
        posts: [],
      },
    };
  }
}
