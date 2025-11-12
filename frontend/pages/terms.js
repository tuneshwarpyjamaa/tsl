import Head from 'next/head';

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Head>
        <title>Terms of Service - The South Line</title>
        <meta name="description" content="Terms of Service for The South Line" />
      </Head>

      <main>
        <h1 className="text-3xl font-serif font-bold border-b-2 border-black pb-2 mb-4">
          Terms of Service
        </h1>
        <div className="prose lg:prose-xl">
          <p>
            Please read these Terms of Service ("Terms", "Terms of Service") carefully before using The South Line website (the "Service") operated by The South Line ("us", "we", or "our").
          </p>

          <h2 className="text-2xl font-serif font-bold mt-8">1. Acceptance of Terms</h2>
          <p>
            By accessing or using the Service you agree to be bound by these Terms. If you disagree with any part of the terms then you may not access the Service.
          </p>

          <h2 className="text-2xl font-serif font-bold mt-8">2. Intellectual Property</h2>
          <p>
            The Service and its original content, features and functionality are and will remain the exclusive property of The South Line and its licensors.
          </p>

          <h2 className="text-2xl font-serif font-bold mt-8">3. Links To Other Web Sites</h2>
          <p>
            Our Service may contain links to third-party web sites or services that are not owned or controlled by The South Line.
          </p>

          <h2 className="text-2xl font-serif font-bold mt-8">4. Limitation Of Liability</h2>
          <p>
            In no event shall The South Line, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
          </p>

          <h2 className="text-2xl font-serif font-bold mt-8">5. Governing Law</h2>
          <p>
            These Terms shall be governed and construed in accordance with the laws of India, without regard to its conflict of law provisions.
          </p>

          <h2 className="text-2xl font-serif font-bold mt-8">6. Changes</h2>
          <p>
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time.
          </p>
        </div>
      </main>
    </div>
  );
}
