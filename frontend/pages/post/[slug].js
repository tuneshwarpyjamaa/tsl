import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import api from '@/services/api';
import Head from 'next/head';
import Link from 'next/link';
import { Facebook, Twitter, Linkedin } from 'lucide-react';
import PostCard from '@/components/PostCard';

export default function PostPage() {
  const router = useRouter();
  const { slug } = router.query;
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!slug) return;

    const fetchPost = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/posts/${encodeURIComponent(slug)}`);
        setPost(data);
      } catch (e) {
        setError('Post not found');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  useEffect(() => {
    if (!post?.categoryId?.slug) return;

    const fetchRelated = async () => {
      try {
        const { data } = await api.get(`/categories/${post.categoryId.slug}/posts`);
        setRelatedPosts(data.posts.filter(p => p.slug !== post.slug).slice(0, 3));
      } catch (e) {
        console.error('Failed to load related posts:', e);
      }
    };

    fetchRelated();
  }, [post]);

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (error) return <div className="text-center py-20 text-red-500">{error}</div>;
  if (!post) return null;

  const postUrl = typeof window !== 'undefined' ? window.location.href : '';

  return (
    <div className="container mx-auto px-4 py-8">
      <Head>
        <title>{post.title} | The Mandate Wire</title>
        <meta name="description" content={post.content.substring(0, 160)} />
      </Head>

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

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <aside className="max-w-5xl mx-auto mt-16 border-t-2 border-black pt-8">
          <h2 className="text-2xl font-serif font-bold mb-8 text-center">More from The Mandate Wire</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedPosts.map(p => (
              <PostCard key={p.slug} post={p} variant="default" />
            ))}
          </div>
        </aside>
      )}
    </div>
  );
}