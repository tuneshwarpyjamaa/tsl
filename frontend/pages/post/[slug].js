import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import api from '@/services/api';
import Link from 'next/link';
import Head from 'next/head';
import SocialShare from '@/components/SocialShare';
import Sidebar from '@/components/Sidebar';

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
        // Filter out the current post and limit to 4
        setRelatedPosts(
          data.filter(p => p.slug !== post.slug).slice(0, 4)
        );
      } catch (e) {
        // It's okay if this fails, the page can still render
        console.error('Failed to load related posts:', e);
      }
    };

    fetchRelated();
  }, [post]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!post) return null;

  const postUrl = `https://yourdomain.com/post/${post.slug}`;
  const postImage = post.image || 'https://yourdomain.com/default-post-image.jpg';
  const postDescription = (post.content || '').slice(0, 160).replace(/<[^>]*>/g, '');
  const publishedDate = new Date(post.createdAt).toISOString();

  return (
    <>
      <Head>
        <title>{post.title} | TMW Blog</title>
        <meta name="description" content={postDescription} />
        <meta name="keywords" content={`news, blog, ${post.categoryId?.name || 'article'}, TMW`} />
        <link rel="canonical" href={postUrl} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={postDescription} />
        <meta property="og:url" content={postUrl} />
        <meta property="og:image" content={postImage} />
        <meta property="article:published_time" content={publishedDate} />
        <meta property="article:author" content={post.author || 'TMW Blog'} />
        {post.categoryId && <meta property="article:section" content={post.categoryId.name} />}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={postDescription} />
        <meta name="twitter:image" content={postImage} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BlogPosting",
              "headline": post.title,
              "description": postDescription,
              "image": postImage,
              "datePublished": publishedDate,
              "author": {
                "@type": "Person",
                "name": post.author || "Staff Writer"
              },
              "publisher": {
                "@type": "Organization",
                "name": "TMW Blog"
              },
              "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": postUrl
              }
            })
          }}
        />
      </Head>
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-12 gap-8">
        <article className="col-span-12 md:col-span-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{post.title}</h1>
          <div className="flex justify-between items-center text-sm text-gray-600 mb-8 border-b pb-4">
        <div>
          <span>{new Date(post.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</span>
          {post.categoryId?.name && (
          <>
            <span className="mx-2">•</span>
            <Link href={`/category/${post.categoryId.slug}`} className="hover:underline">
              {post.categoryId.name}
            </Link>
          </>
        )}
        </div>
        <SocialShare url={postUrl} title={post.title} />
      </div>
      {post.image && (
        <img src={post.image} alt={post.title} className="rounded mb-8 w-full" />
      )}
      <div className="prose max-w-none text-lg leading-8 text-justify">{post.content}</div>
      {relatedPosts.length > 0 && (
          <aside className="mt-12 border-t pt-8">
            <h2 className="text-2xl font-bold mb-4">Related Stories</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedPosts.map(p => (
                <PostCard key={p.slug} post={p} variant="featured" />
              ))}
            </div>
          </aside>
        )}
        </article>
        <Sidebar />
      </div>
    </>
  );
}
