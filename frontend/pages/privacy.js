import Head from 'next/head';

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-12 bg-white text-black">
      <Head>
        <title>Privacy Policy - The South Line</title>
        <meta name="description" content="Privacy Policy for The South Line, compliant with Indian IT Act and DPDP Act." />
      </Head>

      <main className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-serif font-bold border-b-4 border-black pb-4 mb-8">
          Privacy Policy
        </h1>

        <div className="prose text-gray-800 leading-relaxed">
          <p className="text-sm text-gray-500 mb-8">Last Updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

          <p>
            This Privacy Policy describes how <strong>The South Line</strong> ("we", "us", or "our"), a digital news media platform operating in India, collects, uses, and discloses your information. We are committed to protecting your privacy and ensuring compliance with the <strong>Information Technology Act, 2000</strong>, the <strong>Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011</strong>, and the principles of the <strong>Digital Personal Data Protection (DPDP) Act, 2023</strong>.
          </p>

          <h2 className="text-xl font-serif font-bold mt-8 mb-4">1. Consent</h2>
          <p>
            By using our website, you hereby consent to our Privacy Policy and agree to its terms. If you do not agree with this policy, please do not access or use our services.
          </p>

          <h2 className="text-xl font-serif font-bold mt-8 mb-4">2. Information We Collect</h2>
          <p>We may collect the following types of information:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Personal Information:</strong> Name, email address, and phone number when you voluntarily subscribe to our newsletter, fill out a contact form, or register for an account.</li>
            <li><strong>Technical Data:</strong> IP address, browser type, operating system, and device information collected automatically via cookies and analytics tools.</li>
            <li><strong>Usage Data:</strong> Pages visited, time spent on pages, and clickstream data to understand user behavior and improve our content.</li>
          </ul>

          <h2 className="text-xl font-serif font-bold mt-8 mb-4">3. Purpose of Collection</h2>
          <p>We use your data for the following purposes:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>To provide, operate, and maintain our website.</li>
            <li>To improve, personalize, and expand our website's content.</li>
            <li>To communicate with you, including for customer service, updates, and marketing (with your opt-in).</li>
            <li>To prevent fraud and ensure the security of our platform.</li>
            <li>To comply with legal obligations under Indian law.</li>
          </ul>

          <h2 className="text-xl font-serif font-bold mt-8 mb-4">4. Sharing and Disclosure</h2>
          <p>
            We do not sell your personal data. We may share information with:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Service Providers:</strong> Third-party vendors who assist us with hosting, analytics (e.g., Google Analytics), and email delivery.</li>
            <li><strong>Legal Requirements:</strong> If required by law, court order, or government agency under the IT Act, 2000.</li>
          </ul>

          <h2 className="text-xl font-serif font-bold mt-8 mb-4">5. Cookies and Tracking</h2>
          <p>
            We use cookies to enhance your experience. You can choose to disable cookies through your browser options, but this may affect the functionality of the website.
          </p>

          <h2 className="text-xl font-serif font-bold mt-8 mb-4">6. Data Security</h2>
          <p>
            We implement reasonable security practices and procedures as required by the IT Act, 2000 to protect your data. However, no method of transmission over the Internet is 100% secure.
          </p>

          <h2 className="text-xl font-serif font-bold mt-8 mb-4">7. Your Rights</h2>
          <p>
            As a user in India, you have the right to:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Access and review your personal data.</li>
            <li>Request correction of inaccurate data.</li>
            <li>Withdraw consent for data processing.</li>
            <li>Request deletion of your data ("Right to be Forgotten"), subject to legal retention requirements.</li>
          </ul>

          <h2 className="text-xl font-serif font-bold mt-8 mb-4">8. Grievance Redressal</h2>
          <p>
            In accordance with the Information Technology Act, 2000 and the Rules made thereunder, the contact details of the Grievance Officer are provided below:
          </p>
          <div className="bg-gray-100 p-6 rounded-lg mt-4 border border-gray-300">
            <p className="font-bold">Grievance Officer</p>
            <p>The South Line Media Pvt. Ltd.</p>
            <p>#123, 4th Cross, Indiranagar</p>
            <p>Bengaluru, Karnataka - 560038</p>
            <p>Email: <a href="mailto:grievance@thesouthline.com" className="text-blue-600 hover:underline">grievance@thesouthline.com</a></p>
            <p>Phone: +91 80 1234 5678 (Mon-Fri, 10 AM - 6 PM IST)</p>
          </div>
        </div>
      </main>
    </div>
  );
}
