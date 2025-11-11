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
  const [currentDate, setCurrentDate] = useState('');

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

    // Set date
    const date = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    setCurrentDate(date.toLocaleDateString('en-US', options));


    return () => {
      router.events.off('routeChangeComplete', checkAuthStatus);
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
    <header className="border-b border-black">
      {/* Top Bar */}
      <div className="bg-black text-white">
        <div className="container mx-auto px-4 h-10 flex items-center justify-between">
          <div className="text-xs font-sans tracking-wider">
            {currentDate}
          </div>
          <div className="flex items-center space-x-4">
            <form onSubmit={handleSearchSubmit} className="hidden md:block">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="bg-black border-b border-white text-white text-xs placeholder-white focus:outline-none"
              />
            </form>
            <a href="#" className="hover:text-gray-400"><Facebook size={16} /></a>
            <a href="#" className="hover:text-gray-400"><Twitter size={16} /></a>
            <a href="#" className="hover:text-gray-400"><Instagram size={16} /></a>
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
        <div className="md:hidden border-t border-black bg-white">
          <nav className="flex flex-col space-y-4 p-4">
            <form onSubmit={handleSearchSubmit} className="mb-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-full px-3 py-2 border-b border-black focus:outline-none"
              />
            </form>
            {navLinks.map(link => (
              <Link key={link.name} href={link.href} className="text-sm font-bold hover:underline" onClick={() => setIsMobileMenuOpen(false)}>
                {link.name}
              </Link>
            ))}
            <div className="border-t border-black pt-4 mt-4 space-y-4">
              {isAuthenticated ? (
                <>
                  {userRole === 'admin' && (
                    <Link href="/admin" className="block text-sm font-bold hover:underline">Admin</Link>
                  )}
                  <button onClick={handleLogout} className="text-sm font-bold hover:underline">Sign Out</button>
                </>
              ) : (
                <>
                  <Link href="/register" className="block bg-black text-white px-4 py-2 text-sm font-bold hover:bg-gray-800">Register</Link>
                  <Link href="/login" className="block text-sm font-bold hover:underline">Sign In</Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}