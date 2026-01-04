import Head from 'next/head';

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 bg-white text-black">
      <Head>
        <title>Terms of Service - The South Line</title>
        <meta name="description" content="Terms of Service for The South Line, governed by Indian laws." />
      </Head>

      <main className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-serif font-bold border-b-4 border-black pb-4 mb-8">
          Terms of Service
        </h1>

        <div className="prose text-gray-800 leading-relaxed">
          <p className="text-sm text-gray-500 mb-8">Last Updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

          <p>
            Please read these Terms of Service ("Terms") carefully before using <strong>The South Line</strong> website (the "Service") operated by The South Line Media Pvt. Ltd. ("us", "we", or "our").
          </p>

          <h2 className="text-xl font-serif font-bold mt-8 mb-4">1. Acceptance of Terms</h2>
          <p>
            By accessing or using the Service, you agree to be bound by these Terms. These Terms apply to all visitors, users, and others who access or use the Service. If you disagree with any part of the terms, you may not access the Service.
          </p>

          <h2 className="text-xl font-serif font-bold mt-8 mb-4">2. User Conduct</h2>
          <p>
            You agree to use the Service only for lawful purposes. You are strictly prohibited from posting or transmitting any material that:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Is unlawful, threatening, abusive, defamatory, or obscene under Section 499 of the Indian Penal Code (IPC).</li>
            <li>Violates the sovereignty, integrity, or security of India.</li>
            <li>Infringes on the intellectual property rights of others.</li>
            <li>Contains viruses or malicious code.</li>
          </ul>

          <h2 className="text-xl font-serif font-bold mt-8 mb-4">3. Intellectual Property</h2>
          <p>
            The Service and its original content (excluding user-generated content), features, and functionality are and will remain the exclusive property of The South Line and its licensors. The content is protected by copyright, trademark, and other laws of both India and foreign countries.
          </p>

          <h2 className="text-xl font-serif font-bold mt-8 mb-4">4. Links To Other Web Sites</h2>
          <p>
            Our Service may contain links to third-party web sites or services that are not owned or controlled by The South Line. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party web sites or services.
          </p>

          <h2 className="text-xl font-serif font-bold mt-8 mb-4">5. Limitation of Liability</h2>
          <p>
            In no event shall The South Line, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
          </p>

          <h2 className="text-xl font-serif font-bold mt-8 mb-4">6. Governing Law and Jurisdiction</h2>
          <p>
            These Terms shall be governed and construed in accordance with the laws of <strong>India</strong>, without regard to its conflict of law provisions.
          </p>
          <p className="mt-4">
            Any dispute arising out of or in connection with these Terms shall be subject to the exclusive jurisdiction of the courts located in <strong>Bengaluru, Karnataka</strong>.
          </p>

          <h2 className="text-xl font-serif font-bold mt-8 mb-4">7. Changes</h2>
          <p>
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.
          </p>

          <h2 className="text-xl font-serif font-bold mt-8 mb-4">8. Contact Us</h2>
          <p>
            If you have any questions about these Terms, please contact us at <a href="mailto:legal@thesouthline.com" className="text-blue-600 hover:underline">legal@thesouthline.com</a>.
          </p>
        </div>
      </main>
    </div>
  );
}
