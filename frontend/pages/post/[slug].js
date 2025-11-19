import api from '@/services/api';
import Meta from '@/components/Meta';
import Head from 'next/head';
import { Facebook, Twitter, Linkedin } from 'lucide-react';
import PostCard from '@/components/PostCard';
import Comments from '@/components/Comments';

export default function PostPage({ post, relatedPosts, error }) {
  if (error) {
    return <div className="text-center py-20 text-red-500">{error}</div>;
  }
  if (!post) return null;

  // Construct the full URL for sharing
  // In a real production app, this domain should come from an environment variable
  const postUrl = `https://yourdomain.com/post/${post.slug}`;

  // Generate a plain text summary for the meta description
  const createSummary = (htmlContent) => {
    if (!htmlContent) return '';
    const text = htmlContent.replace(/<[^>]+>/g, '');
    return text.substring(0, 160) + '...';
  };
  const summary = createSummary(post.content);

  return (
    <>
      <Meta
        title={`${post.title} | The South Line`}
        description={summary}
        url={postUrl}
        image={post.image}
        author={post.author}
      />
      {/* JSON-LD Schema for rich results */}
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "NewsArticle",
              "headline": post.title,
              "image": [post.image],
              "datePublished": new Date(post.createdAt).toISOString(),
              "dateModified": new Date(post.updatedAt).toISOString(),
              "author": [{
                "@type": "Person",
                "name": post.author
              }]
            })
          }}
        />
      </Head>

      <div className="container mx-auto px-4 py-8">
        <article className="max-w-3xl mx-auto">
          {/* Post Header */}
          <header className="mb-8">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">{post.title}</h1>
            <div className="text-sm uppercase font-sans tracking-wider">
              By {post.author} &bull; {new Date(post.createdAt).toLocaleDateString()}
            </div>
          </header>

          {/* Social Share */}
          <div className="flex items-center space-x-4 border-y-2 border-black py-4 mb-8">
            <span className="font-bold font-sans text-sm">SHARE</span>
            <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`} target="_blank" rel="noopener noreferrer" className="hover:opacity-75">
              <Facebook size={20} />
            </a>
            <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(postUrl)}&text=${encodeURIComponent(post.title)}`} target="_blank" rel="noopener noreferrer" className="hover:opacity-75">
              <Twitter size={20} />
            </a>
            <a href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(postUrl)}&title=${encodeURIComponent(post.title)}`} target="_blank" rel="noopener noreferrer" className="hover:opacity-75">
              <Linkedin size={20} />
            </a>
          </div>

          {/* Post Image */}
          {post.image && (
            <div className="mb-8">
              <img src={post.image} alt={post.title} className="w-full h-auto" />
            </div>
          )}

          {/* Post Content */}
          <div
            className="prose prose-lg max-w-none font-serif"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>

        {/* Comments Section */}
        <section className="max-w-3xl mx-auto mt-12">
          <Comments postId={post.id} />
        </section>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <aside className="max-w-5xl mx-auto mt-16 border-t-2 border-black pt-8">
            <h2 className="text-2xl font-serif font-bold mb-8 text-center">More from The South Line</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPosts.map(p => (
                <PostCard key={p.slug} post={p} variant="default" />
              ))}
            </div>
          </aside>
        )}
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  const { slug } = context.params;

  try {
    const { data } = await api.get(`/posts/optimized/${encodeURIComponent(slug)}`);

    if (data.success) {
      return {
        props: {
          post: data.data.post,
          relatedPosts: data.data.relatedPosts || [],
        },
      };
    } else {
      // If the post is not found, return a 404
      return { notFound: true };
    }
  } catch (e) {
    console.error('Error loading post:', e);
    // Handle other errors, like API down
    return {
      props: {
        error: 'Failed to load post. The server might be temporarily down.',
        post: null,
        relatedPosts: [],
      },
    };
  }
}
