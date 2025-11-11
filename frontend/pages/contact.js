import Head from 'next/head';
import { useState } from 'react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', { name, email, message });
    alert('Thank you for your message. We will get back to you shortly.');
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Head>
        <title>Contact Us - The Mandate Wire</title>
        <meta name="description" content="Contact The Mandate Wire" />
      </Head>

      <main>
        <h1 className="text-3xl font-serif font-bold border-b-2 border-black pb-2 mb-4">
          Contact Us
        </h1>
        <div className="prose lg:prose-xl">
          <p>
            We welcome your feedback and inquiries. Please feel free to reach out to us using the form below.
          </p>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-lg font-bold mb-2">Name</label>
              <input type="text" id="name" name="name" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 border border-gray-300" />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-lg font-bold mb-2">Email</label>
              <input type="email" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 border border-gray-300" />
            </div>
            <div className="mb-4">
              <label htmlFor="message" className="block text-lg font-bold mb-2">Message</label>
              <textarea id="message" name="message" rows="5" value={message} onChange={(e) => setMessage(e.target.value)} className="w-full p-2 border border-gray-300"></textarea>
            </div>
            <button type="submit" className="bg-black text-white py-2 px-4">Submit</button>
          </form>
        </div>
      </main>
    </div>
  );
}
