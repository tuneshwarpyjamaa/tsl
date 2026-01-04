import Link from 'next/link';

const PostImage = ({ src, alt, isFeatured = false }) => {
  const placeholderSvg = `data:image/svg+xml,%3Csvg width='400' height='300' viewBox='0 0 400 300' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='400' height='300' fill='%23F3F4F6'/%3E%3Cpath d='M100 125C100 111.193 111.193 100 125 100H275C288.807 100 300 111.193 300 125V175C300 188.807 288.807 200 275 200H125C111.193 200 100 188.807 100 175V125Z' fill='%E2%80%A6'/%3E%3Ccircle cx='125' cy='125' r='25' fill='%E2%80%A6'/%3E%3Cpath d='M100 175L150 125L200 175L250 125L300 175' stroke='%E2%80%A6' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E`;

  // Using a consistent aspect ratio for side/list views prevents squashing
  const aspectRatioClass = isFeatured ? 'aspect-video' : 'aspect-[4/3]';

  return (
    <div className={`bg-gray-100 mb-4 overflow-hidden ${aspectRatioClass} w-full flex items-center justify-center rounded-xl shadow-sm`}>
      {src ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          loading={isFeatured ? 'eager' : 'lazy'}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = placeholderSvg;
          }}
        />
      ) : (
        <img
          src={placeholderSvg}
          alt="No image available"
          className="w-full h-full object-cover opacity-30"
        />
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
                  {post.image ? (
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <span className="text-gray-400">No Image</span>
                    </div>
                  )}
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