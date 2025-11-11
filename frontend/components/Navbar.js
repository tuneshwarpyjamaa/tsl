import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Menu, X, Facebook, Twitter, Instagram } from 'lucide-react';
import { getUserRole } from '../services/api';

export default function Navbar() {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [currentDateTime, setCurrentDateTime] = useState({ date: '', time: '' });

  useEffect(() => {
    const checkAuthStatus = () => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('tmw_token');
        const role = getUserRole();
        setIsAuthenticated(!!token);
        setUserRole(role);
      }
    };

    checkAuthStatus();
    router.events.on('routeChangeComplete', checkAuthStatus);

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

    return () => {
      router.events.off('routeChangeComplete', checkAuthStatus);
      clearInterval(timer);
    };
  }, [router.events]);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('tmw_token');
      localStorage.removeItem('user_role');
      setIsAuthenticated(false);
      setUserRole(null);
      window.location.href = '/';
    }
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'News', href: '/category/news' },
    { name: 'Sports', href: '/category/sports' },
    { name: 'Business', href: '/category/business' },
    { name: 'Innovation', href: '/category/innovation' },
    { name: 'Culture', href: '/category/culture' },
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
    <header className="border-b border-black sticky top-0 z-50 bg-white">
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
            <div className="text-xl md:text-3xl font-serif font-bold text-black uppercase tracking-wider">
              <Link href="/">The Mandate Wire</Link>
            </div>
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  {userRole === 'admin' && (
                    <Link href="/admin" className="hidden md:block text-sm font-bold hover:underline">Admin</Link>
                  )}
                  <button onClick={handleLogout} className="text-sm font-bold hover:underline">Sign Out</button>
                </>
              ) : (
                <>
                  <Link href="/register" className="hidden md:block bg-black text-white px-4 py-2 text-sm font-bold hover:bg-gray-800">Register</Link>
                  <Link href="/login" className="hidden md:block text-sm font-bold hover:underline">Sign In</Link>
                </>
              )}
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

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-black bg-white fixed inset-0 mt-24 overflow-y-auto z-40">
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
              
              <div className="border-t border-gray-200 pt-4 mt-4 space-y-4">
                <h3 className="text-sm uppercase tracking-wider text-gray-500 px-2 mb-2">Account</h3>
                {isAuthenticated ? (
                  <div className="space-y-2">
                    {userRole === 'admin' && (
                      <Link 
                        href="/admin" 
                        className="block py-3 px-2 text-lg font-bold hover:bg-gray-100 rounded transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <button 
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }} 
                      className="w-full text-left py-3 px-2 text-lg font-bold text-red-600 hover:bg-red-50 rounded transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Link 
                      href="/register" 
                      className="block w-full text-center bg-black text-white px-6 py-3 text-base font-bold hover:bg-gray-800 rounded transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Create Account
                    </Link>
                    <div className="text-center">
                      <span className="text-sm text-gray-500">Already have an account? </span>
                      <Link 
                        href="/login" 
                        className="text-sm font-bold hover:underline"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Sign In
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}