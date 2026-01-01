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
