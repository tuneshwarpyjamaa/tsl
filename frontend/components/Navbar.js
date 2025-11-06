import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import MenuIcon from './ui/MenuIcon';
import UserIcon from './ui/UserIcon';
import { getUserRole } from '../services/api';

export default function Navbar() {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);

  const checkAuthStatus = () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('tmw_token');
      const role = getUserRole();
      setIsAuthenticated(!!token);
      setUserRole(role);
    }
  };

  useEffect(() => {
    checkAuthStatus();
    // Listen for route changes to re-check auth status
    const handleRouteChange = () => {
      checkAuthStatus();
    };
    router.events.on('routeChangeComplete', handleRouteChange);

    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (!event.target.closest('.user-menu-container')) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
      document.removeEventListener('mousedown', handleClickOutside);
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
    { name: 'Arts', href: '/category/arts' },
    { name: 'Travel', href: '/category/travel' },
    { name: 'Earth', href: '/category/earth' },
  ];

  const handleMenuClick = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (query) {
      // Navigate to search results page with the search query
      router.push({
        pathname: '/search',
        query: { q: encodeURIComponent(query) }
      });
      // Close mobile menu if open
      setIsMobileMenuOpen(false);
    }
  };

  const handleUserIconClick = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  return (
    <header className="border-b border-gray-300 overflow-x-hidden">
      <div className="container mx-auto px-4">
        {/* Top bar */}
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center flex-1">
            <button 
              className="md:hidden focus:outline-none p-2 -ml-2" 
              onClick={handleMenuClick}
              aria-label="Menu"
            >
              <MenuIcon />
            </button>
            <form onSubmit={handleSearchSubmit} className="hidden md:block ml-4 w-48">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="w-full px-3 py-1 pr-8 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                />
                <button type="submit" className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </form>
          </div>

          <Link href="/" className="mx-4 text-2xl md:text-3xl font-serif font-bold text-black uppercase tracking-wider hover:text-gray-800 transition-colors whitespace-nowrap">
            <span className="hidden md:inline">The Mandate Wire</span>
            <span className="md:hidden">TMW</span>
          </Link>

          <div className="flex-1 flex items-center justify-end relative user-menu-container">
            {isAuthenticated ? (
              <>
                <div className="mr-8">
                  <button className="focus:outline-none" onClick={handleUserIconClick}>
                    <UserIcon />
                  </button>
                  {isUserMenuOpen && (
                    <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                      {userRole && String(userRole).toLowerCase() === 'admin' && (
                        <Link href="/admin" className="block px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-100">
                          Admin
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-100"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link href="/register" className="bg-black text-white px-4 py-2 text-sm font-bold hidden md:block">Register</Link>
                <Link href="/login" className="px-4 py-2 text-sm font-bold border border-gray-400 hidden md:block">Sign In</Link>
                <button 
                  className="focus:outline-none p-2 -mr-1" 
                  onClick={handleUserIconClick}
                  aria-label="User menu"
                >
                  <UserIcon />
                </button>
                {isUserMenuOpen && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-10 md:hidden">
                    <Link href="/register" className="block px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-100">Register</Link>
                    <Link href="/login" className="block px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-100">Sign In</Link>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Bottom navigation bar (Desktop) */}
      <div className="border-t border-gray-300 hidden md:block">
        <div className="container mx-auto p-4 md:p-6">
          <nav className="flex items-center justify-center gap-6 text-sm font-bold py-3">
            {navLinks.map(link => (
              <Link key={link.name} href={link.href} className="hover:underline">{link.name}</Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`border-t border-gray-300 md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className="container mx-auto px-4 py-2">
          <form onSubmit={handleSearchSubmit} className="mb-4">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-full px-3 py-2 pr-8 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
              />
              <button type="submit" className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </form>
          <nav className="flex flex-col gap-4 text-sm font-bold">
            {navLinks.map(link => (
              <Link key={link.name} href={link.href} className="hover:underline py-2 border-b border-gray-200">{link.name}</Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
