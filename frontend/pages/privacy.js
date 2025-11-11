import Head from 'next/head';

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Head>
        <title>Privacy Policy - The Mandate Wire</title>
        <meta name="description" content="Privacy Policy for The Mandate Wire" />
      </Head>

      <main>
        <h1 className="text-3xl font-serif font-bold border-b-2 border-black pb-2 mb-4">
          Privacy Policy
        </h1>
        <div className="prose lg:prose-xl">
          <p>
            This Privacy Policy describes how The Mandate Wire ("we", "us", or "our") collects, uses, and discloses your information.
          </p>

          <h2 className="text-2xl font-serif font-bold mt-8">1. Consent</h2>
          <p>
            By using our website, you hereby consent to our Privacy Policy and agree to its terms.
          </p>

          <h2 className="text-2xl font-serif font-bold mt-8">2. Information We Collect</h2>
          <p>
            We may collect personal information such as your name, email address, and any other information you provide to us when you register for an account, subscribe to our newsletter, or contact us.
          </p>

          <h2 className="text-2xl font-serif font-bold mt-8">3. How We Use Your Information</h2>
          <p>
            We use the information we collect to operate and maintain our website, to send you marketing communications, and to respond to your inquiries.
          </p>

          <h2 className="text-2xl font-serif font-bold mt-8">4. Sharing and Storage of User Data</h2>
          <p>
            We will not share your personal information with third parties without your consent, except as required by law. We will retain your information for as long as your account is active or as needed to provide you services.
          </p>

          <h2 className="text-2xl font-serif font-bold mt-8">5. Data Security</h2>
          <p>
            We use a variety of security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure.
          </p>

          <h2 className="text-2xl font-serif font-bold mt-8">6. Grievance Officer</h2>
          <p>
            In accordance with the Information Technology Act 2000, the name and contact details of the Grievance Officer are provided below:
          </p>
          <p>
            Mr. John Doe
            <br />
            grievance.officer@themandatewire.com
            <br />
            +91 1234567890
          </p>
        </div>
      </main>
    </div>
  );
}
