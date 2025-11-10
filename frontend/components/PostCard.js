import Link from 'next/link';

const PostImage = ({ src, alt }) => (
  <div className="bg-black mb-4">
    {src ? (
      <img src={src} alt={alt} className="w-full h-full object-cover" />
    ) : (
      <div className="w-full h-48 bg-black" />
    )}
  </div>
);

const PostTitle = ({ title, isFeatured }) => {
  const TitleComponent = isFeatured ? 'h1' : 'h2';
  const sizeClass = isFeatured ? 'text-4xl' : 'text-2xl';
  return (
    <TitleComponent className={`font-serif font-bold ${sizeClass} mb-2 hover:underline`}>
      {title}
    </TitleComponent>
  );
};

const PostMeta = ({ author, date, category }) => (
  <div className="text-xs uppercase font-sans tracking-wider">
    {category && <span className="font-bold">{category} &bull; </span>}
    By {author} &bull; {new Date(date).toLocaleDateString()}
  </div>
);

const PostSummary = ({ summary }) => (
  <p className="text-sm font-sans my-4">{summary}</p>
);

const stripHtml = (html) => {
  if (typeof window === 'undefined') return html || '';
  const doc = new DOMParser().parseFromString(html || '', 'text/html');
  return doc.body.textContent || '';
};

export default function PostCard({ post, variant = 'default' }) {
  const summary = stripHtml(post.content).substring(0, 150) + '...';

  switch (variant) {
    case 'featured':
      return (
        <Link href={`/post/${post.slug}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <PostTitle title={post.title} isFeatured={true} />
                <PostSummary summary={summary} />
                <PostMeta author={post.author} date={post.createdAt} category={post.categoryId?.name} />
              </div>
              <PostImage src={post.image} alt={post.title} />
            </div>
        </Link>
      );

    case 'side':
      return (
        <Link href={`/post/${post.slug}`}>
            <div className="flex items-center space-x-4">
              <div className="w-1/3">
                <PostImage src={post.image} alt={post.title} />
              </div>
              <div className="w-2/3">
                <h3 className="font-serif font-bold text-md hover:underline">{post.title}</h3>
                <PostMeta author={post.author} date={post.createdAt} category={post.categoryId?.name} />
              </div>
            </div>
        </Link>
      );

    default:
      return (
        <Link href={`/post/${post.slug}`}>
            <div>
              <PostImage src={post.image} alt={post.title} />
              <PostTitle title={post.title} />
              <PostSummary summary={summary} />
              <PostMeta author={post.author} date={post.createdAt} category={post.categoryId?.name} />
            </div>
        </Link>
      );
  }
}