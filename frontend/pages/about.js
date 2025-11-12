import Head from 'next/head';

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Head>
        <title>About Us - The South Line</title>
        <meta name="description" content="About The South Line" />
      </Head>

      <main>
        <h1 className="text-3xl font-serif font-bold border-b-2 border-black pb-2 mb-4">
          About Us
        </h1>
        <div className="prose lg:prose-xl">
          <p>
            Welcome to The South Line, your trusted source for unbiased news and analysis.
          </p>
          <p>
            Our mission is to provide in-depth, factual reporting on the issues that matter most. We believe in the power of information to create a better-informed public.
          </p>
          <p>
            Our team of experienced journalists and researchers is dedicated to upholding the highest standards of journalistic integrity. We strive to present a clear and accurate picture of the world, free from commercial and political influence.
          </p>
        </div>
      </main>
    </div>
  );
}
