import api from '@/services/api';
import Meta from '@/components/Meta';
import Head from 'next/head';
import Image from 'next/image';
import { Facebook, Twitter, Linkedin } from 'lucide-react';
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
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading article...</p>
        </div>
      </div>
    );
  }

  if (data.error) {
    return <div className="text-center py-20 text-red-500">{data.error}</div>;
  }

  if (!data.post) return null;

  const { post, relatedPosts, linkablePosts } = data;

  // Construct the full URL for sharing
  // In a real production app, this domain should come from an environment variable
  const postUrl = `https://thesouthline.in/post/${post.slug}`;

  // Generate a plain text summary for the meta description
  const createSummary = (htmlContent) => {
    if (!htmlContent) return '';
    const text = htmlContent.replace(/<[^>]+>/g, '');
    return text.substring(0, 160) + '...';
  };

  // Helper function to insert internal links in text
  const insertInternalLinks = (text, linkablePosts) => {
    if (!text || !linkablePosts.length) return text;

    let result = text;
    const linkedSlugs = new Set(); // To avoid linking the same post multiple times

    for (const post of linkablePosts) {
      if (linkedSlugs.has(post.slug)) continue;

      // Escape special regex chars in title
      const escapedTitle = post.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      // Match whole words, case insensitive
      const regex = new RegExp(`\\b${escapedTitle}\\b`, 'gi');

      if (regex.test(result)) {
        // Replace first occurrence
        result = result.replace(regex, `<a href="/post/${post.slug}" class="internal-link">${post.title}</a>`);
        linkedSlugs.add(post.slug);
        // Limit to 3 links per post
        if (linkedSlugs.size >= 3) break;
      }
    }

    return result;
  };

  // Format post content for better display
  const formatContent = (content, title, linkablePosts = []) => {
    if (!content) return '';

    // If content already has HTML structure, clean it up
    if (content.includes('<h1>') || content.includes('<p>')) {
      let formatted = content;

      // Remove duplicate H1 if it matches the title
      const titleRegex = new RegExp(`<h1[^>]*>${title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}</h1>`, 'i');
      formatted = formatted.replace(titleRegex, '');

      // Remove artificial section headers
      formatted = formatted.replace(/<h2[^>]*>\s*Section \d+\s*<\/h2>/gi, '');

      // Insert internal links in the HTML content (simple text replace, assuming no nested tags in text)
      formatted = insertInternalLinks(formatted, linkablePosts);

      return formatted;
    }

    // If content is plain text, format it
    const lines = content.split('\n').filter(line => line.trim());
    let formatted = '';
    let inList = false;
    let skipLines = 0; // Skip duplicate title lines at the beginning

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();

      // Skip the first few lines if they duplicate the title or author
      if (skipLines > 0) {
        skipLines--;
        continue;
      }

      if (trimmed === title || trimmed.startsWith('By ') || trimmed.includes('•')) {
        // Skip duplicate title, author, date lines
        continue;
      }

      if (trimmed === 'Related Articles:') {
        if (inList) formatted += '</ul>';
        formatted += '<h3>Related Articles:</h3><ul>';
        inList = true;
      } else if (inList && trimmed && !trimmed.startsWith('Section ')) {
        // Assume any non-empty line after "Related Articles:" is a list item
        const linkedText = insertInternalLinks(trimmed, linkablePosts);
        formatted += `<li>${linkedText}</li>`;
      } else if (trimmed.startsWith('Section ') && /^\s*Section \d+\s*$/.test(trimmed)) {
        // Skip artificial section headers added by SEO fix
        continue;
      } else if (trimmed) {
        if (inList) {
          formatted += '</ul>';
          inList = false;
        }
        const linkedText = insertInternalLinks(trimmed, linkablePosts);
        formatted += `<p>${linkedText}</p>`;
      }
    }

    if (inList) formatted += '</ul>';

    return formatted;
  };

  const summary = createSummary(post.content);
  const formattedContent = formatContent(post.content, post.title, linkablePosts);

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
              "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": postUrl
              },
              "headline": post.title,
              "image": [post.image],
              "datePublished": new Date(post.createdAt).toISOString(),
              "dateModified": new Date(post.updatedAt).toISOString(),
              "author": {
                "@type": "Person",
                "name": post.author
              },
              "publisher": {
                "@type": "Organization",
                "name": "The South Line",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://thesouthline.in/logo.png"
                }
              }
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
            <div className="mb-8 relative w-full aspect-video">
              <Image
                src={post.image}
                alt={post.title}
                fill
                priority
                className="object-cover rounded-lg"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 800px"
              />
            </div>
          )}

          {/* Post Content */}
          <div
            className="prose prose-lg max-w-none font-serif"
            dangerouslySetInnerHTML={{ __html: formattedContent }}
          />
        </article>

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

