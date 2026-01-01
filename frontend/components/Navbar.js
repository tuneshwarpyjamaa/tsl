import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { Menu, X, Search } from 'lucide-react';
import { getCategories } from '../services/api';

export default function Navbar() {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const [categories, setCategories] = useState([]);
  const lastScrollY = useRef(0);
  const [searchQuery, setSearchQuery] = useState('');

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

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setIsNavbarVisible(false);
      } else if (currentScrollY < lastScrollY.current) {
        setIsNavbarVisible(true);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const navLinks = [
    ...categories.map(cat => ({ name: cat.name, href: `/category/${cat.slug}` }))
  ];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <div className="relative z-50">
      <header
        className={`fixed top-0 left-0 right-0 bg-white border-b border-gray-100 transition-transform duration-300 ease-in-out ${isNavbarVisible ? 'translate-y-0' : '-translate-y-full'}`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 md:h-20 flex items-center justify-between">
            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 -ml-2 text-gray-900 focus:outline-none"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>

            {/* Logo */}
            <div className="flex-1 md:flex-none text-center md:text-left">
              <Link href="/" className="text-xl md:text-2xl font-serif font-bold text-gray-900 tracking-tight">
                The South Line
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8 mx-auto">
              {navLinks.slice(0, 5).map(link => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="hidden md:flex items-center space-x-4">
              <form onSubmit={handleSearchSubmit} className="relative group">
                <div className="flex items-center bg-gray-50 rounded-full px-3 py-1.5 focus-within:ring-1 focus-within:ring-gray-200 transition-all">
                  <Search size={16} className="text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search"
                    className="bg-transparent border-none text-sm text-gray-900 placeholder-gray-400 focus:ring-0 w-24 focus:w-48 transition-all duration-300"
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-900/20 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu Drawer */}
      <div
        className={`fixed top-0 left-0 bottom-0 w-[80%] max-w-sm bg-white z-50 shadow-xl transform transition-transform duration-300 ease-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="p-6 flex flex-col h-full">
          <div className="flex justify-between items-center mb-8">
            <span className="font-serif font-bold text-xl text-gray-900">Menu</span>
            <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 -mr-2 text-gray-500 hover:text-gray-900">
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSearchSubmit} className="mb-8 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="w-full bg-gray-50 border-none rounded-lg py-3 pl-4 pr-10 text-base focus:ring-1 focus:ring-gray-200"
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Search size={20} />
            </button>
          </form>

          <nav className="flex-1 overflow-y-auto space-y-1">
            {navLinks.map(link => (
              <Link
                key={link.name}
                href={link.href}
                className="block py-3 px-4 text-lg font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
