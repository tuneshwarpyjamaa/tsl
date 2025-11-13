import Link from 'next/link';

const PostImage = ({ src, alt, isFeatured = false }) => {
  const placeholderSvg = `data:image/svg+xml,%3Csvg width='400' height='300' viewBox='0 0 400 300' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='400' height='300' fill='%23F3F4F6'/%3E%3Cpath d='M100 125C100 111.193 111.193 100 125 100H275C288.807 100 300 111.193 300 125V175C300 188.807 288.807 200 275 200H125C111.193 200 100 188.807 100 175V125Z' fill='%E2%80%A6'/%3E%3Ccircle cx='125' cy='125' r='25' fill='%E2%80%A6'/%3E%3Cpath d='M100 175L150 125L200 175L250 125L300 175' stroke='%E2%80%A6' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E`;
  
  return (
    <div className={`bg-gray-100 mb-4 overflow-hidden ${isFeatured ? 'aspect-video' : 'aspect-[4/3]'} flex items-center justify-center`}>
      {src ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
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
      className={`font-serif font-bold ${sizeClass} mb-2 hover:underline transition-colors duration-200`}
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
    <div className="text-xs uppercase font-sans tracking-wider text-gray-600 flex flex-wrap items-center gap-x-2 gap-y-1">
      {category && (
        <>
          <span className="font-bold text-black">{category}</span>
          <span className="text-gray-400">•</span>
        </>
      )}
      <span>By {author}</span>
      <span className="text-gray-400">•</span>
      <time dateTime={date} className="whitespace-nowrap">{formattedDate}</time>
    </div>
  );
};

const PostSummary = ({ summary }) => (
  <p className="text-sm sm:text-base font-sans text-gray-700 my-3 leading-relaxed line-clamp-3">
    {summary}
  </p>
);

export default function PostCard({ post, variant = 'default' }) {
  const summary = post.summary;

  switch (variant) {
    case 'featured':
      return (
        <article className="group">
          <Link href={`/post/${post.slug}`} className="block">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-center">
              <div className="order-2 lg:order-1">
                <div className="mb-1">
                  <PostMeta author={post.author} date={post.createdAt} category={post.categoryId?.name} />
                </div>
                <PostTitle title={post.title} isFeatured={true} />
                <PostSummary summary={summary} />
                <span className="inline-block mt-3 text-sm font-medium text-black hover:text-gray-600 transition-colors">
                  Read more →
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
          <Link href={`/post/${post.slug}`} className="block hover:bg-gray-50 -mx-2 p-2 rounded-lg transition-colors">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="w-full sm:w-1/3 flex-shrink-0">
                <PostImage src={post.image} alt={post.title} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-serif font-bold text-lg leading-snug mb-1 group-hover:underline">
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
        <article className="group">
          <Link href={`/post/${post.slug}`} className="block h-full">
            <div className="h-full flex flex-col">
              <div className="mb-3">
                <PostImage src={post.image} alt={post.title} />
              </div>
              <div className="flex-1 flex flex-col">
                <PostTitle title={post.title} />
                <PostSummary summary={summary} />
                <div className="mt-auto pt-2">
                  <PostMeta author={post.author} date={post.createdAt} category={post.categoryId?.name} />
                </div>
              </div>
            </div>
          </Link>
        </article>
      );
  }
}