import { useState } from 'react';
import Meta from '@/components/Meta';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real application, you would handle form submission here,
    // e.g., by sending the data to an API endpoint.
    console.log('Form submitted:', { name, email, message });
    alert('Thank you for your message. We will get back to you shortly.');
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <>
      <Meta
        title="Contact Us - The South Line"
        description="Get in touch with The South Line. We welcome your feedback, inquiries, and story tips."
        url="https://yourdomain.com/contact"
      />
      <div className="container mx-auto px-4 py-8">
        <main>
          <h1 className="text-3xl font-serif font-bold border-b-2 border-black pb-2 mb-4">
            Contact Us
          </h1>
          <div className="prose lg:prose-xl max-w-2xl mx-auto">
            <p className="mb-8">
              We welcome your feedback and inquiries. Please feel free to reach out to us using the form below.
            </p>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-bold mb-2">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
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
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                  required
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-bold mb-2">Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows="6"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="bg-black text-white py-3 px-6 font-bold hover:bg-gray-800 transition-colors"
              >
                Send Message
              </button>
            </form>
          </div>
        </main>
      </div>
    </>
  );
}
