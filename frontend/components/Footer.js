import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getCategories } from '../services/api';
import { Facebook, Twitter, Instagram, Linkedin, Mail } from 'lucide-react';

export default function Footer() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        setCategories(response.data);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        setCategories([]);
      }
    };

    fetchCategories();
  }, []);

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8 mt-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="space-y-6">
            <Link href="/" className="block">
              <h2 className="text-2xl font-serif font-bold uppercase tracking-wider text-white">
                The South Line
              </h2>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Delivering unbiased news, in-depth analysis, and compelling stories from around the globe. Your trusted source for what matters.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><Facebook size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><Twitter size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><Instagram size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><Linkedin size={20} /></a>
            </div>
          </div>

          {/* Categories Column */}
          <div>
            <h3 className="text-lg font-bold mb-6 border-b border-gray-700 pb-2 inline-block">Categories</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              {categories.slice(0, 6).map(category => (
                <li key={category.slug}>
                  <Link href={`/category/${category.slug}`} className="hover:text-white hover:translate-x-1 transition-all inline-block">
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links Column */}
          <div>
            <h3 className="text-lg font-bold mb-6 border-b border-gray-700 pb-2 inline-block">Company</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link href="/about" className="hover:text-white hover:translate-x-1 transition-all inline-block">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-white hover:translate-x-1 transition-all inline-block">Contact</Link></li>
              <li><Link href="/privacy" className="hover:text-white hover:translate-x-1 transition-all inline-block">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white hover:translate-x-1 transition-all inline-block">Terms of Service</Link></li>
              <li><Link href="/careers" className="hover:text-white hover:translate-x-1 transition-all inline-block">Careers</Link></li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div>
            <h3 className="text-lg font-bold mb-6 border-b border-gray-700 pb-2 inline-block">Newsletter</h3>
            <p className="text-gray-400 text-sm mb-4">
              Subscribe to our newsletter for the latest updates and exclusive content.
            </p>
            <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                <input
                  type="email"
                  placeholder="Your email address"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-gray-500 transition-all"
                />
              </div>
              <button className="w-full bg-white text-black font-bold py-2.5 px-4 rounded-lg text-sm hover:bg-gray-200 transition-colors">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} The South Line. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link href="/sitemap" className="hover:text-white transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
