import Head from 'next/head';

const Meta = ({
  title = "The South Line - Your Source for Latest News and Stories",
  description = "Stay updated with the latest news, stories, and insights on The South Line. Discover engaging content across various categories.",
  keywords = "news, blog, stories, articles, The South Line",
  author = "The South Line",
  robots = "index, follow",
  url = "https://thesouthline.in",
  image = "https://thesouthline.in/og-image.jpg"
}) => {
  // Ensure URL is absolute
  const canonicalUrl = url.startsWith('http') ? url : `https://thesouthline.in${url}`;

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <meta name="robots" content={robots} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph Meta Tags */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={image} />

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Head>
  );
};

export default Meta;
