'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { Menu, X, ChevronDown, User, LogOut, Home, Car, Image as ImageIcon, Info, Phone, Calendar, Sparkles, Settings, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { signOut, useSession } from 'next-auth/react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';

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
    { 
      name: 'Home', 
      href: '/', 
      icon: <Home className="w-4 h-4 mr-2" />,
      highlight: 'from-blue-600 to-cyan-500'
    },
    { 
      name: 'Services', 
      href: '/services', 
      icon: <Car className="w-4 h-4 mr-2" />,
      highlight: 'from-emerald-500 to-teal-400'
    },
    { 
      name: 'Gallery', 
      href: '/gallery', 
      icon: <ImageIcon className="w-4 h-4 mr-2" />,
      highlight: 'from-violet-500 to-purple-400'
    },
    { 
      name: 'About', 
      href: '/about', 
      icon: <Info className="w-4 h-4 mr-2" />,
      highlight: 'from-amber-500 to-orange-400'
    },
    { 
      name: 'Contact', 
      href: '/contact', 
      icon: <Phone className="w-4 h-4 mr-2" />,
      highlight: 'from-rose-500 to-pink-400'
    },
    
  ];

  return (
    <>
      <motion.header 
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 280, damping: 16, bounce: 0.2 }}
        className={cn(
          'fixed w-full z-50 transition-all duration-300',
          'bg-black shadow-sm py-1 sm:py-2 text-white border-b border-gray-800/50',
          'backdrop-blur-md',
          {
            'py-2 sm:py-3': !isScrolled
          }
        )}
      >
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-between h-14 sm:h-16 md:h-20">
          {/* Left side - Logo and Brand Name */}
          <div className="flex items-center">
            <Link 
              href="/" 
              className="flex items-center group"
              onClick={() => setMobileMenuOpen(false)}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="relative flex items-center"
              >
                {/* Logo */}
                <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full overflow-hidden border-2 border-white shadow-md mr-2 sm:mr-3">
                  <img 
                    src="/images/nissan.jpeg" 
                    alt="Vishal Car Wash Logo" 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Brand Name */}
                <motion.div className="flex flex-col">
                  <motion.span 
                    className={cn(
                      'text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r bg-clip-text',
                      'text-white',
                      'transition-all duration-300 tracking-tight leading-none whitespace-nowrap'
                    )}
                  >
                    Vishal Car Wash
                  </motion.span>
                  <span className={cn(
                    'text-[10px] xs:text-xs sm:text-xs md:text-sm font-medium mt-0.5',
                    'text-white/80',
                    'transition-colors duration-300 whitespace-nowrap'
                  )}>
                    Professional Car Care
                  </span>
                </motion.div>
                
                <motion.span 
                  className="absolute -inset-2 bg-gradient-to-r from-blue-500/10 to-cyan-400/10 rounded-full -z-10"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                />
              </motion.div>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 flex-1 justify-center px-4">
            <LayoutGroup>
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'relative px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 flex items-center group',
                      isActive 
                        ? 'text-white' 
                        : 'text-gray-300 hover:text-white',
                    )}
                  >
                    <span className="flex items-center z-10">
                      {React.cloneElement(item.icon, {
                        className: cn('w-4 h-4 mr-2 transition-colors', 
                          isActive ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'
                        )
                      })}
                      {item.name}
                    </span>
                    {isActive && (
                      <motion.span 
                        className="absolute inset-0 bg-gradient-to-r rounded-lg opacity-10"
                        layoutId="activeNavItem"
                        initial={false}
                        transition={{
                          type: 'spring',
                          stiffness: 500,
                          damping: 30
                        }}
                      />
                    )}
                    <motion.span 
                      className={cn(
                        'absolute bottom-0 left-1/2 w-1/2 h-0.5 rounded-full -translate-x-1/2',
                        `bg-gradient-to-r ${item.highlight}`,
                        isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100',
                        'transition-opacity duration-200'
                      )}
                    />
                  </Link>
                );
              })}
            </LayoutGroup>
            
            <motion.div 
              className="relative ml-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link 
                href="/booking"
                className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg font-medium flex items-center shadow-lg hover:shadow-blue-500/30 transition-all duration-300 group"
              >
                <Calendar className="w-4 h-4 mr-2 transition-transform group-hover:scale-110" />
                <span>Book Now</span>
                <motion.span 
                  className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 opacity-0 group-hover:opacity-20 -z-10"
                  initial={{ opacity: 0 }}
                  whileHover={{ 
                    scale: 1.2,
                    opacity: 0.2,
                    transition: { duration: 0.3 }
                  }}
                />
              </Link>
            </motion.div>
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
            {status === 'authenticated' ? (
              <div className="relative">
                <motion.button 
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className={cn(
                    'flex items-center space-x-2 focus:outline-none transition-all duration-300',
                    'px-3 py-1.5 rounded-full',
                    isScrolled || pathname !== '/' 
                      ? 'bg-white/90 backdrop-blur-sm shadow-sm border border-gray-100 hover:shadow-md hover:bg-white' 
                      : 'bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20',
                    'group'
                  )}
                >
                  <div className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center text-white transition-all',
                    isScrolled || pathname !== '/'
                      ? 'bg-gradient-to-br from-blue-600 to-cyan-500 group-hover:from-blue-700 group-hover:to-cyan-600'
                      : 'bg-white/20 group-hover:bg-white/30'
                  )}>
                    <User className={cn(
                      'w-4 h-4 transition-colors',
                      isScrolled || pathname !== '/' ? 'text-white' : 'text-white/90 group-hover:text-white'
                    )} />
                  </div>
                  <span className={cn(
                    'font-medium text-sm transition-colors',
                    isScrolled || pathname !== '/' ? 'text-gray-800' : 'text-white/90 group-hover:text-white'
                  )}>
                    {session.user.name.split(' ')[0]}
                  </span>
                  <motion.div 
                    animate={{ rotate: userDropdownOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className={cn(
                      'w-4 h-4 transition-colors',
                      isScrolled || pathname !== '/' ? 'text-gray-500' : 'text-white/70 group-hover:text-white'
                    )} />
                  </motion.div>
                </motion.button>
                
                <AnimatePresence>
                  {userDropdownOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.98 }}
                      transition={{ type: 'spring', damping: 25, stiffness: 400, bounce: 0.2 }}
                      className="absolute right-0 mt-2 w-64 bg-white/95 backdrop-blur-lg rounded-xl shadow-2xl overflow-hidden z-50 border border-gray-100/50"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="p-2">
                        <div className="px-4 py-3 border-b border-gray-100/50 mb-1">
                          <p className="text-sm font-medium text-gray-900">{session.user.name}</p>
                          <p className="text-xs text-gray-500 truncate">{session.user.email}</p>
                        </div>
                        
                        <Link 
                          href="/profile" 
                          className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50/50 rounded-lg transition-all duration-200 m-1 group"
                          onClick={() => setUserDropdownOpen(false)}
                        >
                          <div className="p-1.5 mr-3 rounded-lg bg-blue-50 group-hover:bg-blue-100 transition-colors">
                            <User className="w-4 h-4 text-blue-600" />
                          </div>
                          <span>Profile</span>
                        </Link>
                        
                        <Link 
                          href="/my-bookings" 
                          className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50/50 rounded-lg transition-all duration-200 m-1 group"
                          onClick={() => setUserDropdownOpen(false)}
                        >
                          <div className="p-1.5 mr-3 rounded-lg bg-emerald-50 group-hover:bg-emerald-100 transition-colors">
                            <Calendar className="w-4 h-4 text-emerald-600" />
                          </div>
                          <span>My Bookings</span>
                        </Link>
                        
                        <Link 
                          href="/settings" 
                          className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50/50 rounded-lg transition-all duration-200 m-1 group"
                          onClick={() => setUserDropdownOpen(false)}
                        >
                          <div className="p-1.5 mr-3 rounded-lg bg-amber-50 group-hover:bg-amber-100 transition-colors">
                            <Settings className="w-4 h-4 text-amber-600" />
                          </div>
                          <span>Settings</span>
                        </Link>
                        
                        <div className="border-t border-gray-100/50 my-1"></div>
                        
                        {session.user.role === 'admin' && (
                          <Link 
                            href="/admin" 
                            className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50/50 rounded-lg transition-all duration-200 m-1 group"
                            onClick={() => setUserDropdownOpen(false)}
                          >
                            <div className="p-1.5 mr-3 rounded-lg bg-violet-50 group-hover:bg-violet-100 transition-colors">
                              <Shield className="w-4 h-4 text-violet-600" />
                            </div>
                            <span>Admin Dashboard</span>
                          </Link>
                        )}
                        
                        <motion.button
                          whileTap={{ scale: 0.98 }}
                          onClick={async () => {
                            await signOut({ redirect: false });
                            router.push('/auth/signin');
                            setUserDropdownOpen(false);
                          }}
                          className="w-full flex items-center px-4 py-3 text-sm text-red-600 hover:bg-red-50/50 rounded-lg transition-all duration-200 m-1 group"
                        >
                          <div className="p-1.5 mr-3 rounded-lg bg-red-50 group-hover:bg-red-100 transition-colors">
                            <LogOut className="w-4 h-4 text-red-600" />
                          </div>
                          <span>Sign out</span>
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                  <Link 
                    href="/auth/signin" 
                    className={cn(
                      'px-5 py-2.5 rounded-lg font-medium transition-all text-sm flex items-center',
                      'bg-gradient-to-r from-blue-600 to-cyan-500 text-white',
                      'hover:from-blue-700 hover:to-cyan-600',
                      'shadow-lg hover:shadow-blue-500/30',
                      'relative overflow-hidden group'
                    )}
                  >
                    <span className="relative z-10">Sign In</span>
                    <motion.span 
                      className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"
                      initial={{ opacity: 0 }}
                      whileHover={{ 
                        opacity: 1,
                        transition: { duration: 0.3 }
                      }}
                    />
                  </Link>
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.03 }} 
                  whileTap={{ scale: 0.98 }}
                  className="relative"
                >
                  <Link 
                    href="/auth/signup" 
                    className={cn(
                      'px-5 py-2.5 rounded-lg font-medium transition-all text-sm flex items-center',
                      'bg-gradient-to-r from-blue-600 to-cyan-500 text-white',
                      'hover:from-blue-700 hover:to-cyan-600',
                      'shadow-lg hover:shadow-blue-500/30',
                      'relative overflow-hidden group'
                    )}
                  >
                    <span className="relative z-10">Sign Up</span>
                    <motion.span 
                      className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"
                      initial={{ opacity: 0 }}
                      whileHover={{ 
                        opacity: 1,
                        transition: { duration: 0.3 }
                      }}
                    />
                  </Link>
                </motion.div>
              </div>
            )}
          </div>

          {/* Right side - Contact Info */}
      

          {/* Mobile menu button */}
          <div className="flex items-center space-x-3 md:hidden">
            {status === 'authenticated' && (
              <Link 
                href="/profile" 
                className={`p-1.5 sm:p-2 rounded-full ${isScrolled || pathname !== '/' ? 'bg-gray-100 text-gray-800' : 'bg-white/10 text-white'}`}
              >
                <User className="h-4 w-4 sm:h-5 sm:w-5" />
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
              <div className="px-3 sm:px-4 pt-2 pb-4 space-y-2 bg-white/95 backdrop-blur-lg rounded-xl shadow-xl mx-1 sm:mx-2 my-1 sm:my-2 border border-gray-100">
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
                          'flex items-center px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-medium',
                          isActive
                            ? 'bg-blue-50 text-blue-700'
                            : 'text-gray-700 hover:bg-gray-50',
                          'transition-colors duration-200 w-full'
                        )}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {React.cloneElement(item.icon, {
                          className: `w-5 h-5 mr-3 ${isActive ? 'text-blue-600' : 'text-gray-400'}`
                        })}
                        {item.name}
                        {isActive && (
                          <span className="ml-auto w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full"></span>
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
                    className="flex items-center justify-center w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base font-medium text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 rounded-lg shadow-md transition-all duration-300"
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
                      <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2 sm:mr-3 text-gray-500" />
                      My Profile
                    </Link>
                    <Link
                      href="/my-bookings"
                      className="flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2 sm:mr-3 text-gray-500" />
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
                      <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2 sm:mr-3" />
                      Sign out
                    </button>
                  </div>
                ) : (
                  <div className="pt-2 border-t border-gray-200 mt-2">
                    <Link
                      href="/auth/signin"
                      className="block w-full px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base font-medium text-center text-blue-600 hover:bg-blue-50 rounded-md mb-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign in
                    </Link>
                    <Link
                      href="/auth/signup"
                      className="block w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base font-medium text-center text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 rounded-lg shadow-md transition-all duration-300"
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
