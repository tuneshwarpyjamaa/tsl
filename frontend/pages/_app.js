import '@/styles/globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Meta from '@/components/Meta';
import Head from 'next/head';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Meta />
      <Head>
        {/* The <Meta /> component now handles the main SEO tags. */}
        {/* We keep global scripts and other head elements here. */}
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
