'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, User, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { signOut, useSession } from 'next-auth/react';

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/services' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <header 
      className={cn(
        'fixed w-full z-50 transition-all duration-300',
        isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4',
        pathname === '/' && !isScrolled ? 'text-white' : 'text-gray-800'
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className={`text-2xl font-bold ${isScrolled || pathname !== '/' ? 'text-blue-600' : 'text-white'}`}>
              Vishal Car Wash
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'px-3 py-2 text-sm font-medium rounded-md transition-colors',
                  pathname === item.href 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900',
                  isScrolled || pathname !== '/' ? 'text-gray-800' : 'text-white hover:text-white/80'
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {status === 'authenticated' ? (
              <div className="relative">
                <button 
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-2 focus:outline-none"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <User className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="font-medium">{session.user.name}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${userDropdownOpen ? 'transform rotate-180' : ''}`} />
                </button>
                
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <Link 
                      href="/profile" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link 
                      href="/my-bookings" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      My Bookings
                    </Link>
                    <button
                      onClick={async () => {
                        await signOut({ redirect: false });
                        router.push('/auth/signin');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link 
                  href="/auth/signin" 
                  className={`px-4 py-2 rounded-md hover:bg-gray-100 transition-colors ${isScrolled || pathname !== '/' ? 'text-gray-800' : 'text-white hover:text-gray-100'}`}
                >
                  Sign In
                </Link>
                <Link 
                  href="/auth/signup" 
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center space-x-4 md:hidden">
            {status === 'authenticated' && (
              <Link 
                href="/profile" 
                className={`p-2 ${isScrolled || pathname !== '/' ? 'text-gray-800' : 'text-white'}`}
              >
                <User className="h-5 w-5" />
              </Link>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`inline-flex items-center justify-center p-2 rounded-md focus:outline-none ${isScrolled || pathname !== '/' ? 'text-gray-800' : 'text-white'}`}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-2">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white rounded-lg shadow-lg">
              {status === 'authenticated' && (
                <div className="px-4 py-3 border-b border-gray-200">
                  <p className="text-sm font-medium text-gray-700">Signed in as</p>
                  <p className="text-sm font-medium text-gray-900 truncate">{session.user.email}</p>
                </div>
              )}
              
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'block px-3 py-2 rounded-md text-base font-medium',
                    pathname === item.href
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-50',
                    'text-left w-full'
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}

              {/* Book Now Button */}
              <Link
                href="/booking"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full px-4 py-2 my-2 text-base font-medium text-center text-white bg-blue-600 hover:bg-blue-700 rounded-md"
              >
                Book Now
              </Link>
              
              {status === 'authenticated' ? (
                <button
                  onClick={async () => {
                    await signOut({ redirect: false });
                    router.push('/auth/signin');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md mt-2"
                >
                  Sign out
                </button>
              ) : (
                <div className="pt-2 border-t border-gray-200 mt-2">
                  <Link
                    href="/auth/signin"
                    className="block w-full px-4 py-2 text-base font-medium text-center text-blue-600 hover:bg-blue-50 rounded-md mb-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="block w-full px-4 py-2 text-base font-medium text-center text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
