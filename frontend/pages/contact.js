import { useState } from 'react';
import Meta from '@/components/Meta';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real application, you would handle form submission here,
    // e.g., by sending the data to an API endpoint.
    console.log('Form submitted:', { name, email, subject, message });
    alert('Thank you for your message. We will get back to you within 24-48 hours.');
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
  };

  return (
    <>
      <Meta
        title="Contact Us - The South Line"
        description="Get in touch with The South Line. We welcome your feedback, inquiries, and story tips."
        url="https://yourdomain.com/contact"
      />
      <div className="container mx-auto px-4 py-12 bg-white text-black">
        <main className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-serif font-bold border-b-4 border-black pb-4 mb-8">
            Contact Us
          </h1>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div>
              <div className="prose mb-8">
                <p className="text-base text-gray-700">
                  We value your feedback, story tips, and inquiries. Whether you're a reader, a potential contributor, or looking to advertise, we're here to listen.
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold mb-2">Mailing Address</h3>
                  <p className="text-sm text-gray-600">
                    The South Line Media Pvt. Ltd.<br />
                    #123, 4th Cross, Indiranagar<br />
                    Bengaluru, Karnataka - 560038<br />
                    India
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-bold mb-2">Email Us</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li><strong>General Inquiries:</strong> <a href="mailto:contact@thesouthline.com" className="hover:underline">contact@thesouthline.com</a></li>
                    <li><strong>Editorial Team:</strong> <a href="mailto:editor@thesouthline.com" className="hover:underline">editor@thesouthline.com</a></li>
                    <li><strong>Grievance Officer:</strong> <a href="mailto:grievance@thesouthline.com" className="hover:underline">grievance@thesouthline.com</a></li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-bold mb-2">Response Time</h3>
                  <p className="text-sm text-gray-600">
                    We aim to respond to all legitimate inquiries within <strong>24-48 hours</strong>.
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-gray-50 p-8 rounded-lg border border-gray-200">
              <h2 className="text-xl font-serif font-bold mb-6">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-bold mb-2">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black transition-shadow"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-bold mb-2">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black transition-shadow"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-bold mb-2">Subject</label>
                  <select
                    id="subject"
                    name="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black transition-shadow bg-white"
                  >
                    <option value="">Select a subject</option>
                    <option value="feedback">General Feedback</option>
                    <option value="editorial">Letter to the Editor</option>
                    <option value="tip">News Tip</option>
                    <option value="support">Technical Support</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-bold mb-2">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    rows="5"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black transition-shadow"
                    required
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-black text-white py-3 px-6 font-bold hover:bg-gray-800 transition-colors rounded"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
