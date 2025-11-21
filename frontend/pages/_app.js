import '@/styles/globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Meta from '@/components/Meta';
import MemoryMonitor from '@/components/MemoryMonitor';
import Head from 'next/head';
import Script from 'next/script';

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
              "url": "https://thesouthline.in",
              "description": "Your source for latest news and stories",
              "publisher": {
                "@type": "Organization",
                "name": "The South Line",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://thesouthline.in/logo.png"
                }
              },
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://thesouthline.in/search?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
          strategy="afterInteractive"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
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
        <main className="flex-1 container mx-auto px-4 pt-32 pb-6">
          <Component {...pageProps} />
        </main>
        <Footer />
        {/* <MemoryMonitor /> */}
      </div>
    </>
  );
}
