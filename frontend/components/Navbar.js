import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { Menu, X, Facebook, Twitter, Instagram, Moon, Sun, Search } from 'lucide-react';
import { getCategories } from '../services/api';

export default function Navbar() {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState({ date: '', time: '' });
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const [categories, setCategories] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    // Check for saved theme
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove('dark');
    }

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

    const updateDateTime = () => {
      const now = new Date();
      const dateOptions = {
        timeZone: 'Asia/Kolkata',
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      };
      const timeOptions = {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      };

      setCurrentDateTime({
        date: new Intl.DateTimeFormat('en-IN', dateOptions).format(now),
        time: new Intl.DateTimeFormat('en-IN', timeOptions).format(now)
      });
    };

    updateDateTime();
    const timer = setInterval(updateDateTime, 60000);

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
      if (timer) clearInterval(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [router.events]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [isMobileMenuOpen]);

  const toggleDarkMode = () => {
    if (darkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
      setDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
      setDarkMode(true);
    }
  };

  const navLinks = [
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
    <div className="relative z-50">
      <header
        className={`fixed top-0 left-0 right-0 transition-all duration-300 ease-in-out ${isNavbarVisible ? 'translate-y-0' : '-translate-y-full'}`}
      >
        {/* Top Bar
        <div className="bg-black dark:bg-gray-900 text-white text-xs py-2 px-4">
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <span className="hidden sm:inline font-sans tracking-wide">{currentDateTime.date}</span>
              <span className="sm:hidden">
                {new Date().toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', day: 'numeric', month: 'short' })}
              </span>
              <span className="bg-gray-800 dark:bg-gray-700 px-2 py-0.5 rounded font-mono">
                {currentDateTime.time} IST
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-3 border-l border-gray-700 pl-4">
                <a href="#" className="hover:text-gray-300 transition-colors"><Facebook size={14} /></a>
                <a href="#" className="hover:text-gray-300 transition-colors"><Twitter size={14} /></a>
                <a href="#" className="hover:text-gray-300 transition-colors"><Instagram size={14} /></a>
              </div>
            </div>
          </div>
        </div> */}

        {/* Main Navbar */}
        <div className="bg-gray-900 text-white border-b border-gray-800">
          <div className="container mx-auto px-4">
            <div className="h-16 md:h-20 flex items-center justify-between">
              {/* Mobile Menu Button */}
              <div className="md:hidden">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="p-2 text-white focus:outline-none"
                >
                  {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>

              {/* Logo */}
              <div className="flex-1 md:flex-none text-center md:text-left">
                <Link href="/" className="text-xl md:text-2xl lg:text-3xl font-serif font-bold text-white uppercase tracking-wider hover:opacity-80 transition-opacity">
                  The South Line
                </Link>
              </div>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center space-x-8">
                {navLinks.slice(0, 5).map(link => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="text-sm font-bold text-gray-200 hover:text-white hover:underline decoration-2 underline-offset-4 transition-all"
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>

              {/* Search Icon (Desktop) */}
              <div className="hidden md:block w-48">
                <form onSubmit={handleSearchSubmit} className="relative group">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    className="w-full bg-gray-800 border-none rounded-full py-1.5 pl-4 pr-10 text-sm text-white placeholder-gray-400 focus:ring-2 focus:ring-white transition-all"
                  />
                  <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-white">
                    <Search size={16} />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* Mobile Menu Drawer */}
      <div
        className={`fixed top-0 left-0 bottom-0 w-[80%] max-w-sm bg-white dark:bg-gray-900 z-50 shadow-2xl transform transition-transform duration-300 ease-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="p-6 flex flex-col h-full">
          <div className="flex justify-between items-center mb-8">
            <span className="font-serif font-bold text-xl dark:text-white">Menu</span>
            <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-gray-600 dark:text-gray-300">
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSearchSubmit} className="mb-8 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles..."
              className="w-full bg-gray-100 dark:bg-gray-800 border-none rounded-lg py-3 pl-4 pr-10 text-base focus:ring-2 focus:ring-black dark:focus:ring-white"
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
              <Search size={20} />
            </button>
          </form>

          <nav className="flex-1 overflow-y-auto space-y-2">
            {navLinks.map(link => (
              <Link
                key={link.name}
                href={link.href}
                className="block py-3 px-4 text-lg font-medium text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="pt-6 border-t border-gray-200 dark:border-gray-800 mt-auto">
            <div className="flex justify-center space-x-8">
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"><Facebook size={24} /></a>
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"><Twitter size={24} /></a>
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"><Instagram size={24} /></a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
