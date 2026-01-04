import api from '@/services/api';
import Meta from '@/components/Meta';
import Head from 'next/head';
import Image from 'next/image';
import { Facebook, Twitter, Linkedin, Share2, Bookmark } from 'lucide-react';
import PostCard from '@/components/PostCard';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function PostPage() {
  const router = useRouter();
  const { slug } = router.query;

  const [data, setData] = useState({
    post: null,
    relatedPosts: [],
    linkablePosts: [],
    loading: true,
    error: null
  });

  useEffect(() => {
    if (!slug) return;

    async function fetchData() {
      try {
        const { data: response } = await api.get(`/api/posts/optimized/${encodeURIComponent(slug)}`);

        if (response.success) {
          setData({
            post: response.data.post,
            relatedPosts: response.data.relatedPosts || [],
            linkablePosts: response.data.linkablePosts || [],
            loading: false,
            error: null
          });
        } else {
          setData({
            post: null,
            relatedPosts: [],
            linkablePosts: [],
            loading: false,
            error: 'Post not found'
          });
        }
      } catch (e) {
        console.error('Error loading post:', e);
        setData({
          post: null,
          relatedPosts: [],
          linkablePosts: [],
          loading: false,
          error: 'Failed to load post. The server might be temporarily down.'
        });
      }
    }

    fetchData();
  }, [slug]);

  if (data.loading) {
    return (
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center py-20">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-6"></div>
            <div className="h-64 bg-gray-200 rounded w-full mb-6"></div>
            <div className="space-y-3 w-full">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (data.error) {
    return <div className="text-center py-20 text-red-500">{data.error}</div>;
  }

  if (!data.post) return null;

  const { post, relatedPosts, linkablePosts } = data;

  const postUrl = `https://thesouthline.in/post/${post.slug}`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: `Read this article on The South Line: ${post.title}`,
          url: postUrl,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      // Fallback could be copying to clipboard or just doing nothing (since we have social icons)
      navigator.clipboard.writeText(postUrl);
      alert('Link copied to clipboard!');
    }
  };

  const createSummary = (htmlContent) => {
    if (!htmlContent) return '';
    const text = htmlContent.replace(/<[^>]+>/g, '');
    return text.substring(0, 160) + '...';
  };

  const insertInternalLinks = (text, linkablePosts) => {
    if (!text || !linkablePosts.length) return text;
    let result = text;
    const linkedSlugs = new Set();
    for (const post of linkablePosts) {
      if (linkedSlugs.has(post.slug)) continue;
      const escapedTitle = post.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`\\b${escapedTitle}\\b`, 'gi');
      if (regex.test(result)) {
        result = result.replace(regex, `<a href="/post/${post.slug}" class="text-gray-900 underline decoration-gray-400 hover:decoration-black transition-colors">${post.title}</a>`);
        linkedSlugs.add(post.slug);
        if (linkedSlugs.size >= 3) break;
      }
    }
    return result;
  };

  const formatContent = (content, title, linkablePosts = []) => {
    if (!content) return '';
    if (content.includes('<h1>') || content.includes('<p>')) {
      let formatted = content;
      const titleRegex = new RegExp(`<h1[^>]*>${title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}</h1>`, 'i');
      formatted = formatted.replace(titleRegex, '');
      formatted = formatted.replace(/<h2[^>]*>\s*Section \d+\s*<\/h2>/gi, '');
      formatted = insertInternalLinks(formatted, linkablePosts);
      return formatted;
    }
    const lines = content.split('\n').filter(line => line.trim());
    let formatted = '';
    let inList = false;
    let skipLines = 0;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();
      if (skipLines > 0) { skipLines--; continue; }
      if (trimmed === title || trimmed.startsWith('By ') || trimmed.includes('•')) { continue; }
      if (trimmed === 'Related Articles:') {
        if (inList) formatted += '</ul>';
        formatted += '<h3>Related Articles:</h3><ul>';
        inList = true;
      } else if (inList && trimmed && !trimmed.startsWith('Section ')) {
        const linkedText = insertInternalLinks(trimmed, linkablePosts);
        formatted += `<li>${linkedText}</li>`;
      } else if (trimmed.startsWith('Section ') && /^\s*Section \d+\s*$/.test(trimmed)) {
        continue;
      } else if (trimmed) {
        if (inList) { formatted += '</ul>'; inList = false; }
        const linkedText = insertInternalLinks(trimmed, linkablePosts);
        formatted += `<p>${linkedText}</p>`;
      }
    }
    if (inList) formatted += '</ul>';
    return formatted;
  };

  const summary = createSummary(post.content);
  const formattedContent = formatContent(post.content, post.title, linkablePosts);

  const readTime = Math.ceil((post.content?.split(/\s+/).length || 0) / 200) + ' min read';

  return (
    <>
      <Meta
        title={`${post.title} | The South Line`}
        description={summary}
        url={postUrl}
        image={post.image}
        author={post.author}
      />

      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "NewsArticle",
              "mainEntityOfPage": { "@type": "WebPage", "@id": postUrl },
              "headline": post.title,
              "image": [post.image],
              "datePublished": new Date(post.createdAt).toISOString(),
              "dateModified": new Date(post.updatedAt).toISOString(),
              "author": { "@type": "Person", "name": post.author },
              "publisher": {
                "@type": "Organization",
                "name": "The South Line",
                "logo": { "@type": "ImageObject", "url": "https://thesouthline.in/logo.png" }
              }
            })
          }}
        />
      </Head>

      <div className="bg-white min-h-screen">
        <article>
          {/* Article Header */}
          <div className="container mx-auto px-4 max-w-screen-md pt-8 md:pt-16 pb-8">
            <h1 className="text-3xl md:text-5xl font-serif font-bold text-gray-900 mb-6 leading-tight">
              {post.title}
            </h1>

            <div className="flex items-center justify-between py-6 border-b border-gray-100 mb-8">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold">
                  {post.author ? post.author[0] : 'T'}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-900">{post.author}</span>
                  <div className="text-xs text-gray-500 flex items-center space-x-2">
                    <span>{readTime}</span>
                    <span>·</span>
                    <span>{new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4 text-gray-500">
                <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(postUrl)}&text=${encodeURIComponent(post.title)}`} target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 transition-colors">
                  <Twitter size={20} />
                </a>
                <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`} target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 transition-colors">
                  <Facebook size={20} />
                </a>
                <a href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(postUrl)}&title=${encodeURIComponent(post.title)}`} target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 transition-colors">
                  <Linkedin size={20} />
                </a>
                <div className="border-l border-gray-300 h-4 mx-2"></div>
                <button onClick={handleShare} className="hover:text-gray-900 transition-colors"><Share2 size={20} /></button>
                <button className="hover:text-gray-900 transition-colors"><Bookmark size={20} /></button>
              </div>
            </div>
          </div>

          {/* Featured Image - Wide but not full width */}
          {post.image && (
            <div className="container mx-auto px-4 max-w-screen-lg mb-12">
              <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 1024px"
                />
              </div>
              <p className="text-center text-sm text-gray-500 mt-2 font-sans italic">
                {post.title}
              </p>
            </div>
          )}

          {/* Article Content */}
          <div className="container mx-auto px-4 max-w-screen-md">
            <div
              className="prose prose-lg md:prose-xl prose-p:font-serif prose-headings:font-serif prose-a:text-gray-900 prose-a:no-underline prose-a:border-b prose-a:border-gray-300 hover:prose-a:border-gray-900 prose-img:rounded-lg max-w-none text-gray-800"
              dangerouslySetInnerHTML={{ __html: formattedContent }}
            />

            {/* Tags/Categories */}
            {post.categoryId && (
              <div className="mt-12 pt-8 border-t border-gray-100">
                <div className="flex flex-wrap gap-2">
                  <span className="px-4 py-2 bg-gray-100 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-200 cursor-pointer transition-colors">
                    {post.categoryId.name}
                  </span>
                </div>
              </div>
            )}
          </div>
        </article>

        {/* Related Stories */}
        {relatedPosts.length > 0 && (
          <div className="bg-gray-50 mt-20 py-16">
            <div className="container mx-auto px-4 max-w-screen-lg">
              <h3 className="text-xl font-bold font-serif mb-8 border-b pb-4">More from The South Line</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {relatedPosts.map(p => (
                  <PostCard key={p.slug} post={p} variant="default" /> // Reuse our new list/card style or create a grid variant
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
