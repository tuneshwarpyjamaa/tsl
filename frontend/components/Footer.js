import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t-4 border-black mt-12 py-8 bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="pb-6 border-b border-gray-300">
          <Link href="/" className="text-2xl md:text-3xl font-serif font-bold text-black uppercase tracking-wider hover:text-gray-800 transition-colors">
            The South Line
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-6">
          <div>
            <h3 className="font-bold text-gray-900 mb-2">Categories</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li><Link href="/category/news" className="hover:underline">News</Link></li>
              <li><Link href="/category/sport" className="hover:underline">Sport</Link></li>
              <li><Link href="/category/business" className="hover:underline">Business</Link></li>
              <li><Link href="/category/innovation" className="hover:underline">Innovation</Link></li>
              <li><Link href="/category/culture" className="hover:underline">Culture</Link></li>
              <li><Link href="/category/arts" className="hover:underline">Arts</Link></li>
              <li><Link href="/category/travel" className="hover:underline">Travel</Link></li>
              <li><Link href="/category/earth" className="hover:underline">Earth</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 mb-2">About</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li><Link href="/about" className="hover:underline">About Us</Link></li>
              <li><Link href="/contact" className="hover:underline">Contact</Link></li>
              <li><Link href="/privacy" className="hover:underline">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:underline">Terms of Service</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 mb-2">Follow Us</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li><Link href="#" className="hover:underline">Facebook</Link></li>
              <li><Link href="#" className="hover:underline">Twitter</Link></li>
              <li><Link href="#" className="hover:underline">Instagram</Link></li>
              <li><Link href="#" className="hover:underline">LinkedIn</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 mb-2">Newsletter</h3>
            <p className="text-sm text-gray-700 mb-2">Subscribe to our newsletter for the latest updates.</p>
            <input type="email" placeholder="Enter your email" className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black" />
            <button className="mt-2 w-full bg-black text-white px-4 py-2 text-sm font-bold hover:bg-gray-800">Subscribe</button>
          </div>
        </div>

        <div className="text-sm text-gray-700 pt-6 border-t border-gray-300 mt-6 text-center">
          <p className="text-sm text-gray-600"> {new Date().getFullYear()} The South Line. All rights reserved.</p>
          <p>Delivering the latest news and analysis with depth.</p>
        </div>
      </div>
    </footer>
  );
}
