'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { Menu, X, ChevronDown, User, LogOut, Home, Car, Image as ImageIcon, Info, Phone, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { signOut, useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';

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
    { name: 'Home', href: '/', icon: <Home className="w-4 h-4 mr-2" /> },
    { name: 'Services', href: '/services', icon: <Car className="w-4 h-4 mr-2" /> },
    { name: 'Gallery', href: '/gallery', icon: <ImageIcon className="w-4 h-4 mr-2" /> },
    { name: 'About', href: '/about', icon: <Info className="w-4 h-4 mr-2" /> },
    { name: 'Contact', href: '/contact', icon: <Phone className="w-4 h-4 mr-2" /> },
  ];

  return (
    <>
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className={cn(
          'fixed w-full z-50 transition-all duration-300 backdrop-blur-sm',
          isScrolled ? 'bg-white/90 shadow-lg py-2' : 'bg-transparent py-4',
          pathname === '/' && !isScrolled ? 'text-white' : 'text-gray-800'
        )}
      >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center group"
            onClick={() => setMobileMenuOpen(false)}
          >
            <motion.span 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                'text-2xl font-bold bg-gradient-to-r bg-clip-text text-transparent',
                isScrolled || pathname !== '/' 
                  ? 'from-blue-600 to-cyan-500' 
                  : 'from-white to-gray-200',
                'transition-all duration-300'
              )}
            >
              Vishal Car Wash
            </motion.span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'group relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 flex items-center',
                    isActive 
                      ? 'text-blue-600' 
                      : isScrolled || pathname !== '/' 
                        ? 'text-gray-700 hover:text-blue-600' 
                        : 'text-white/90 hover:text-white',
                  )}
                >
                  <span className="flex items-center">
                    {item.icon}
                    {item.name}
                  </span>
                  <span 
                    className={cn(
                      'absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300',
                      isActive ? 'scale-x-100' : 'scale-x-0'
                    )}
                  />
                </Link>
              );
            })}
            <Link 
              href="/booking"
              className="ml-4 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg font-medium hover:from-blue-700 hover:to-cyan-600 transition-all duration-300 flex items-center shadow-lg hover:shadow-blue-500/20"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Book Now
            </Link>
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {status === 'authenticated' ? (
              <div className="relative">
                <motion.button 
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-2 focus:outline-none bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white">
                    <User className="w-4 h-4" />
                  </div>
                  <span className="font-medium text-sm">{session.user.name.split(' ')[0]}</span>
                  <motion.div animate={{ rotate: userDropdownOpen ? 180 : 0 }}>
                    <ChevronDown className="w-4 h-4" />
                  </motion.div>
                </motion.button>
                
                <AnimatePresence>
                  {userDropdownOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl overflow-hidden z-50 border border-gray-100"
                    >
                      <div className="p-1">
                        <Link 
                          href="/profile" 
                          className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors m-1"
                          onClick={() => setUserDropdownOpen(false)}
                        >
                          <User className="w-4 h-4 mr-3 text-gray-500" />
                          <span>Profile</span>
                        </Link>
                        <Link 
                          href="/my-bookings" 
                          className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors m-1"
                          onClick={() => setUserDropdownOpen(false)}
                        >
                          <Calendar className="w-4 h-4 mr-3 text-gray-500" />
                          <span>My Bookings</span>
                        </Link>
                        <div className="border-t border-gray-100 my-1"></div>
                        <button
                          onClick={async () => {
                            await signOut({ redirect: false });
                            router.push('/auth/signin');
                            setUserDropdownOpen(false);
                          }}
                          className="w-full flex items-center px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors m-1"
                        >
                          <LogOut className="w-4 h-4 mr-3" />
                          <span>Sign out</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link 
                  href="/auth/signin" 
                  className={cn(
                    'px-4 py-2 rounded-lg font-medium transition-all',
                    isScrolled || pathname !== '/' 
                      ? 'text-gray-700 hover:text-blue-600' 
                      : 'text-white/90 hover:text-white',
                    'text-sm'
                  )}
                >
                  Sign In
                </Link>
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                  <Link 
                    href="/auth/signup" 
                    className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg font-medium hover:from-blue-700 hover:to-cyan-600 transition-all duration-300 text-sm shadow-lg hover:shadow-blue-500/20"
                  >
                    Sign Up
                  </Link>
                </motion.div>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center space-x-3 md:hidden">
            {status === 'authenticated' && (
              <Link 
                href="/profile" 
                className={`p-2 rounded-full ${isScrolled || pathname !== '/' ? 'bg-gray-100 text-gray-800' : 'bg-white/10 text-white'}`}
              >
                <User className="h-5 w-5" />
              </Link>
            )}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={cn(
                'inline-flex items-center justify-center p-2 rounded-full focus:outline-none',
                isScrolled || pathname !== '/' ? 'bg-gray-100 text-gray-800' : 'bg-white/10 text-white',
                'transition-colors'
              )}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="md:hidden overflow-hidden"
            >
              <div className="px-4 pt-2 pb-4 space-y-2 bg-white/95 backdrop-blur-lg rounded-xl shadow-xl mx-2 my-2 border border-gray-100">
                {status === 'authenticated' && (
                  <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg mb-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 truncate">{session.user.name}</p>
                        <p className="text-xs text-gray-500 truncate">{session.user.email}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="space-y-1">
                  {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={cn(
                          'flex items-center px-4 py-3 rounded-lg text-base font-medium',
                          isActive
                            ? 'bg-blue-50 text-blue-700'
                            : 'text-gray-700 hover:bg-gray-50',
                          'transition-colors duration-200'
                        )}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {React.cloneElement(item.icon, {
                          className: `w-5 h-5 mr-3 ${isActive ? 'text-blue-600' : 'text-gray-400'}`
                        })}
                        {item.name}
                        {isActive && (
                          <span className="ml-auto w-2 h-2 bg-blue-500 rounded-full"></span>
                        )}
                      </Link>
                    );
                  })}
                </div>

                {/* Book Now Button */}
                <motion.div 
                  whileTap={{ scale: 0.98 }}
                  className="mt-3"
                >
                  <Link
                    href="/booking"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center w-full px-4 py-3 text-base font-medium text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 rounded-lg shadow-md transition-all duration-300"
                  >
                    <Calendar className="w-5 h-5 mr-2" />
                    Book Now
                  </Link>
                </motion.div>
                
                {status === 'authenticated' ? (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <Link
                      href="/profile"
                      className="flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <User className="w-4 h-4 mr-3 text-gray-500" />
                      My Profile
                    </Link>
                    <Link
                      href="/my-bookings"
                      className="flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Calendar className="w-4 h-4 mr-3 text-gray-500" />
                      My Bookings
                    </Link>
                    <button
                      onClick={async () => {
                        await signOut({ redirect: false });
                        router.push('/auth/signin');
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center w-full px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors mt-1"
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      Sign out
                    </button>
                  </div>
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
                      className="block w-full px-4 py-2.5 text-base font-medium text-center text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 rounded-lg shadow-md transition-all duration-300"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Create Account
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  </>
  );
}
