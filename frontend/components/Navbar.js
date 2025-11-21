import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { Menu, X, Facebook, Twitter, Instagram } from 'lucide-react';
import { getCategories } from '../services/api';

export default function Navbar() {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState({ date: '', time: '' });
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const [categories, setCategories] = useState([]);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        setCategories(response.data);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        // Set empty categories array on error to avoid breaking the navbar
        setCategories([]);
      }
    };

    fetchCategories();

    // Update date and time in IST
    const updateDateTime = () => {
      const now = new Date();

      // Format date
      const dateOptions = {
        timeZone: 'Asia/Kolkata',
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      };

      // Format time
      const timeOptions = {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      };

      const formattedDate = new Intl.DateTimeFormat('en-IN', dateOptions).format(now);
      const formattedTime = new Intl.DateTimeFormat('en-IN', timeOptions).format(now);

      setCurrentDateTime({
        date: formattedDate,
        time: formattedTime
      });
    };

    // Update immediately and then every minute
    updateDateTime();
    const timer = setInterval(updateDateTime, 60000);

    // Handle scroll events for navbar hide/show
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        // Scrolling down
        setIsNavbarVisible(false);
      } else if (currentScrollY < lastScrollY.current) {
        // Scrolling up
        setIsNavbarVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      if (timer) clearInterval(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [router.events]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (isMobileMenuOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'auto';
      }
    }

    return () => {
      if (typeof window !== 'undefined') {
        document.body.style.overflow = 'auto';
      }
    };
  }, [isMobileMenuOpen]);

  const navLinks = [
    { name: 'Home', href: '/' },
    ...categories.map(cat => ({ name: cat.name, href: `/category/${cat.slug}` }))
  ];

  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <div className="relative">
      <header className="sticky top-0 z-50">
        <div
          className={`border-b border-black bg-white transition-transform duration-300 ease-in-out ${isNavbarVisible ? 'translate-y-0' : '-translate-y-full'
            }`}
          style={{
            transform: isNavbarVisible ? 'translateY(0)' : 'translateY(-100%)',
            position: 'sticky',
            top: 0,
            zIndex: 50
          }}
        >
          {/* Top Bar */}
          <div className="bg-black text-white">
            <div className="container mx-auto px-4 h-10 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="text-xs font-sans tracking-wider">
                  <span className="hidden sm:inline">{currentDateTime.date}</span>
                  <span className="sm:hidden">
                    {new Date().toLocaleDateString('en-IN', {
                      timeZone: 'Asia/Kolkata',
                      day: 'numeric',
                      month: 'short',
                      year: '2-digit'
                    })}
                  </span>
                </div>
                <span className="text-xs font-mono bg-gray-800 px-1.5 py-0.5 rounded">
                  {currentDateTime.time} IST
                </span>
              </div>
              <div className="flex items-center space-x-3 sm:space-x-4">
                <form onSubmit={handleSearchSubmit} className="hidden sm:block">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    className="bg-black border-b border-white text-white text-xs placeholder-gray-300 focus:outline-none w-24 sm:w-auto"
                  />
                </form>
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <a href="#" className="hover:text-gray-400 transition-colors" aria-label="Facebook">
                    <Facebook size={16} />
                  </a>
                  <a href="#" className="hover:text-gray-400 transition-colors" aria-label="Twitter">
                    <Twitter size={16} />
                  </a>
                  <a href="#" className="hover:text-gray-400 transition-colors" aria-label="Instagram">
                    <Instagram size={16} />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Main Navigation */}
          <div className="bg-white">
            <div className="container mx-auto px-4">
              <div className="h-20 flex items-center justify-between">
                <div className="md:hidden">
                  <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="focus:outline-none">
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                  </button>
                </div>
                <div className="flex-1 text-xl md:text-3xl font-serif font-bold text-black uppercase tracking-wider text-center">
                  <Link href="/" className="whitespace-nowrap">The South Line</Link>
                </div>
                <div className="flex items-center space-x-4 relative">
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Category Links */}
          <div className="border-t border-black hidden md:block">
            <div className="container mx-auto px-4">
              <nav className="flex items-center justify-center space-x-6 h-12">
                {navLinks.map(link => (
                  <Link key={link.name} href={link.href} className="text-sm font-bold hover:underline">
                    {link.name}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40">
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="fixed inset-0 top-[120px] bottom-0 left-0 right-0 bg-white overflow-y-auto z-50">
            <div className="container mx-auto px-4 py-6">
              <nav className="flex flex-col space-y-6">
                <form onSubmit={handleSearchSubmit} className="mb-4">
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search articles..."
                      className="w-full px-4 py-3 border-b-2 border-black focus:outline-none focus:border-gray-500 text-base"
                    />
                    <button
                      type="submit"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2"
                      aria-label="Search"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </button>
                  </div>
                </form>
                <div className="space-y-1">
                  {navLinks.map(link => (
                    <Link
                      key={link.name}
                      href={link.href}
                      className="block py-3 px-2 text-lg font-bold hover:bg-gray-100 rounded transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
