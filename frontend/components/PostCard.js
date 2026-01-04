import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

const calculateReadTime = (text) => {
  const wordsPerMinute = 200;
  const wordCount = text ? text.split(/\s+/).length : 0;
  const readTime = Math.ceil(wordCount / wordsPerMinute);
  return `${readTime} min read`;
};

const PostImage = ({ src, alt, isFeatured = false, isList = false, isSide = false }) => {
  const [error, setError] = useState(false);

  let containerClass = "bg-gray-100 overflow-hidden relative";

  if (isFeatured) {
    containerClass += " aspect-video w-full rounded-xl mb-6";
  } else if (isList) {
    // List view: fixed square or rectangular thumbnail on the right
    containerClass += " w-24 h-24 sm:w-40 sm:h-28 flex-shrink-0 rounded-lg";
  } else if (isSide) {
     containerClass += " w-16 h-16 flex-shrink-0 rounded-md"; // Smaller for sidebar
  } else {
    // Default fallback
    containerClass += " aspect-[4/3] w-full rounded-lg";
  }

  return (
    <div className={containerClass}>
      {src && !error ? (
        <Image
          src={src}
          alt={alt || "Post image"}
          fill
          className="object-cover transition-transform duration-500 hover:scale-105"
          sizes={isFeatured ? "(max-width: 768px) 100vw, 800px" : "200px"}
          priority={isFeatured}
          onError={() => setError(true)}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-50">
           {/* Simple placeholder icon */}
           <div className="w-6 h-6 border-2 border-gray-300 rounded-sm"></div>
        </div>
      )}
    </div>
  );
};

const PostMeta = ({ author, date, category, readTime }) => {
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });

  return (
    <div className="flex items-center text-xs sm:text-sm text-gray-500 space-x-2 font-sans mb-2">
      <div className="flex items-center space-x-2">
        {/* Author Avatar (Mock) */}
        <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-500">
           {author ? author[0].toUpperCase() : 'A'}
        </div>
        <span className="font-medium text-gray-900">{author}</span>
      </div>
      <span>·</span>
      <span>{formattedDate}</span>
      {readTime && (
        <>
          <span>·</span>
          <span>{readTime}</span>
        </>
      )}
      {category && (
         <>
           <span>·</span>
           <span className="px-2 py-0.5 bg-gray-100 rounded-full text-xs font-medium text-gray-600">
             {category}
           </span>
         </>
      )}
    </div>
  );
};

const stripHtml = (html) => (typeof html === 'string' ? html.replace(/<[^>]*>/g, '') : '');

export default function PostCard({ post, variant = 'default' }) {
  const summary = post.summary;
  const readTime = calculateReadTime(post.content || summary);
  const plainSummary = stripHtml(summary);

  switch (variant) {
    case 'hero':
      // Large featured article for left side of hero section
      return (
        <article className="group h-full">
          <Link href={`/post/${post.slug}`} className="block h-full">
            <div className="h-full flex flex-col">
              <div className="relative overflow-hidden rounded-lg mb-4">
                <div className="aspect-[16/10] overflow-hidden">
                  {post.image ? (
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="eager"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400">No Image</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex-1">
                <h2 className="font-serif font-bold text-2xl sm:text-3xl lg:text-4xl leading-tight mb-3 text-gray-900 group-hover:text-gray-700 transition-colors">
                  {post.title}
                </h2>
                <p className="text-sm sm:text-base text-gray-600 mb-3 leading-relaxed line-clamp-3">
                  {stripHtml(summary)}
                </p>
              </div>
            </div>
          </Link>
        </article>
      );

    case 'secondary':
      // Stacked articles for right side of hero section
      return (
        <article className="group">
          <Link href={`/post/${post.slug}`} className="block">
            <div className="flex gap-4">
              <div className="relative w-32 sm:w-40 flex-shrink-0">
                <div className="aspect-square overflow-hidden rounded-lg">
                  {post.image ? (
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400 text-xs">No Image</span>
                    </div>
                  )}
                </div>
                {/* Badge overlay */}
                <div className="absolute bottom-2 left-2 bg-red-600 text-white p-1.5 rounded">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-serif font-bold text-lg sm:text-xl leading-tight mb-2 text-gray-900 group-hover:text-gray-700 transition-colors line-clamp-3">
                  {post.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">
                  {stripHtml(summary)}
                </p>
              </div>
            </div>
          </Link>
        </article>
      );

    case 'grid':
      // 3-column grid cards
      return (
        <article className="group h-full">
          <Link href={`/post/${post.slug}`} className="block h-full">
            <div className="h-full flex flex-col">
              <div className="relative overflow-hidden rounded-lg mb-3">
                <div className="aspect-[4/3] overflow-hidden">
                  {post.image ? (
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400">No Image</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-serif font-bold text-lg sm:text-xl leading-tight mb-2 text-gray-900 group-hover:text-gray-700 transition-colors line-clamp-3">
                  {post.title}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                  {stripHtml(summary)}
                </p>
              </div>
            </div>
          </Link>
        </article>
      );

    case 'featured':
      return (
        <article className="group">
          <Link href={`/post/${post.slug}`} className="block">
            <div className="flex flex-col">
              <PostImage src={post.image} alt={post.title} isFeatured={true} />

              <div className="max-w-3xl">
                <PostMeta
                  author={post.author}
                  date={post.createdAt}
                  category={post.categoryId?.name}
                  readTime={readTime}
                />
                <h2 className="font-serif font-bold text-3xl sm:text-4xl leading-tight mb-3 text-gray-900 group-hover:text-gray-700 transition-colors">
                  {post.title}
                </h2>
                <p className="font-serif text-lg text-gray-600 leading-relaxed mb-4 line-clamp-3">
                  {plainSummary}
                </p>
                <div className="flex items-center text-sm font-medium text-gray-900 underline decoration-gray-300 underline-offset-4 group-hover:decoration-gray-900 transition-all">
                  Read full story
                </div>
              </div>
            </div>
          </Link>
        </article>
      );

    case 'side':
      return (
        <article className="group">
          <Link href={`/post/${post.slug}`} className="block">
            <div className="flex items-start gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1.5">
                   <div className="w-4 h-4 rounded-full bg-gray-100 flex items-center justify-center text-[8px] font-bold text-gray-500">
                     {post.author ? post.author[0] : 'T'}
                   </div>
                   <span className="text-xs font-medium text-gray-900 truncate">{post.author}</span>
                </div>
                <h3 className="font-serif font-bold text-base leading-snug text-gray-900 group-hover:text-gray-700 transition-colors mb-1">
                  {post.title}
                </h3>
                <time className="text-xs text-gray-500">
                   {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </time>
              </div>
              {/* Optional: Show image in sidebar or not. Medium usually doesn't for side lists, but let's keep it small */}
              {post.image && (
                 <PostImage src={post.image} alt={post.title} isSide={true} />
              )}
            </div>
          </Link>
        </article>
      );

    // Default is now the "List View" (Medium style row)
    default:
      return (
        <article className="group">
          <Link href={`/post/${post.slug}`} className="block">
            <div className="flex items-start justify-between gap-6 sm:gap-8">
              <div className="flex-1 min-w-0 py-1">
                <PostMeta
                  author={post.author}
                  date={post.createdAt}
                  category={post.categoryId?.name}
                  readTime={readTime}
                />

                <h2 className="font-serif font-bold text-xl sm:text-2xl leading-snug mb-2 text-gray-900 group-hover:text-gray-700 transition-colors">
                  {post.title}
                </h2>

                <p className="font-serif text-base text-gray-500 leading-relaxed line-clamp-2 sm:line-clamp-3 hidden sm:block">
                  {plainSummary}
                </p>

                <div className="mt-3 sm:hidden text-xs text-gray-500 font-medium">
                  Read more
                </div>
              </div>

              {post.image && (
                <PostImage src={post.image} alt={post.title} isList={true} />
              )}
            </div>
          </Link>
        </article>
      );
  }
}
