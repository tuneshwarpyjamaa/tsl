import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

const PostImage = ({ src, alt, isFeatured = false }) => {
  // Using a consistent aspect ratio for side/list views prevents squashing
  const aspectRatioClass = isFeatured ? 'aspect-video' : 'aspect-[4/3]';
  const [error, setError] = useState(false);

  return (
    <div className={`bg-gray-100 mb-4 overflow-hidden ${aspectRatioClass} w-full flex items-center justify-center rounded-xl shadow-sm relative`}>
      {src && !error ? (
        <Image
          src={src}
          alt={alt || "Post image"}
          fill
          className="object-cover transition-transform duration-500 hover:scale-105"
          sizes={isFeatured ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
          priority={isFeatured}
          onError={() => setError(true)}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-gray-400">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
        </div>
      )}
    </div>
  );
};

const PostTitle = ({ title, isFeatured }) => {
  const TitleComponent = isFeatured ? 'h1' : 'h2';
  const sizeClass = isFeatured ? 'text-2xl sm:text-3xl md:text-4xl leading-tight' : 'text-xl sm:text-2xl leading-snug';
  return (
    <TitleComponent
      className={`font-serif font-bold ${sizeClass} mb-2 text-gray-900 hover:text-gray-700 transition-colors duration-200`}
      style={{ wordBreak: 'break-word' }}
    >
      {title}
    </TitleComponent>
  );
};

const PostMeta = ({ author, date, category }) => {
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <div className="text-xs uppercase font-sans tracking-wider text-gray-500 flex flex-wrap items-center gap-x-2 gap-y-1">
      {category && (
        <>
          <span className="font-bold text-black">{category}</span>
          <span className="text-gray-300">•</span>
        </>
      )}
      <span>By {author}</span>
      <span className="text-gray-300">•</span>
      <time dateTime={date} className="whitespace-nowrap">{formattedDate}</time>
    </div>
  );
};

// Ensure HTML tags are not displayed in summaries
const stripHtml = (html) => (typeof html === 'string' ? html.replace(/<[^>]*>/g, '') : '');

const PostSummary = ({ summary }) => {
  const text = stripHtml(summary);
  return (
    <p className="text-sm sm:text-base font-sans text-gray-600 my-3 leading-relaxed line-clamp-3">
      {text}
    </p>
  );
};

export default function PostCard({ post, variant = 'default' }) {
  const summary = post.summary;

  // We need to handle the image fallback logic at the usage site as well if we want to pass a state down,
  // but simpler to just use the new self-contained PostImage component everywhere.

  switch (variant) {
    case 'featured':
      return (
        <article className="group">
          <Link href={`/post/${post.slug}`} className="block">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-center">
              <div className="order-2 lg:order-1">
                <div className="mb-2">
                  <PostMeta author={post.author} date={post.createdAt} category={post.categoryId?.name} />
                </div>
                <PostTitle title={post.title} isFeatured={true} />
                <PostSummary summary={summary} />
                <span className="inline-block mt-4 text-sm font-bold text-black border-b-2 border-black pb-0.5 hover:text-gray-600 hover:border-gray-600 transition-all">
                  Read Story
                </span>
              </div>
              <div className="order-1 lg:order-2">
                <PostImage src={post.image} alt={post.title} isFeatured={true} />
              </div>
            </div>
          </Link>
        </article>
      );

    case 'side':
      return (
        <article className="group">
          <Link href={`/post/${post.slug}`} className="block hover:bg-gray-50 -mx-2 p-2 rounded-xl transition-colors duration-200">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="w-full sm:w-1/3 flex-shrink-0">
                <PostImage src={post.image} alt={post.title} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-serif font-bold text-lg leading-snug mb-2 text-gray-900 group-hover:text-gray-700 transition-colors">
                  {post.title}
                </h3>
                <PostMeta author={post.author} date={post.createdAt} category={post.categoryId?.name} />
              </div>
            </div>
          </Link>
        </article>
      );

    default:
      return (
        <article className="group h-full bg-white rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg border border-transparent hover:border-gray-100">
          <Link href={`/post/${post.slug}`} className="block h-full">
            <div className="h-full flex flex-col p-4">
              <div className="mb-4 -mx-4 -mt-4">
                <div className="aspect-[4/3] overflow-hidden relative">
                   <PostImage src={post.image} alt={post.title} />
                </div>
              </div>
              <div className="flex-1 flex flex-col">
                <div className="mb-2">
                  <PostMeta author={post.author} date={post.createdAt} category={post.categoryId?.name} />
                </div>
                <PostTitle title={post.title} />
                <PostSummary summary={summary} />
              </div>
            </div>
          </Link>
        </article>
      );
  }
}
