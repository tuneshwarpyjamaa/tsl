import '@/styles/globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Head from 'next/head';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>The South Line - Your Source for Latest News and Stories</title>
        <meta name="description" content="Stay updated with the latest news, stories, and insights on The South Line. Discover engaging content across various categories." />
        <meta name="keywords" content="news, blog, stories, articles, The South Line" />
        <meta name="author" content="The South Line" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://yourdomain.com" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="The South Line - Your Source for Latest News and Stories" />
        <meta property="og:description" content="Stay updated with the latest news, stories, and insights on The South Line." />
        <meta property="og:url" content="https://yourdomain.com" />
        <meta property="og:image" content="https://yourdomain.com/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="The South Line - Your Source for Latest News and Stories" />
        <meta name="twitter:description" content="Stay updated with the latest news, stories, and insights on The South Line." />
        <meta name="twitter:image" content="https://yourdomain.com/twitter-image.jpg" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "The South Line",
              "url": "https://yourdomain.com",
              "description": "Your source for latest news and stories",
              "publisher": {
                "@type": "Organization",
                "name": "The South Line"
              }
            })
          }}
        />
        <script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'GA_MEASUREMENT_ID');
            `,
          }}
        />
      </Head>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-6">
          <Component {...pageProps} />
        </main>
        <Footer />
      </div>
    </>
  );
}
