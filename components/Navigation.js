"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import {
  Menu,
  X,
  ChevronDown,
  User,
  LogOut,
  Home,
  Car,
  Image as ImageIcon,
  Info,
  Phone,
  Calendar,
  Settings,
  Shield,
  BookOpen,
  HelpCircle,
  Users,
  Bell,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut, useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { NotificationDropdown } from "./NotificationDropdown";

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const router = useRouter();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setAboutDropdownOpen(false);
  }, [pathname]);

  const navItems = [
    {
      name: "Home",
      href: "/",
      icon: Home,
      gradient: "from-blue-500 to-cyan-400",
    },
    {
      name: "Services",
      href: "/services",
      icon: Car,
      gradient: "from-emerald-500 to-teal-400",
    },
    {
      name: "Gallery",
      href: "/gallery",
      icon: ImageIcon,
      gradient: "from-violet-500 to-purple-400",
    },
    {
      name: "About",
      href: "/about",
      icon: Info,
      gradient: "from-amber-500 to-orange-400",
      dropdown: [
        { name: "About Us", href: "/about", icon: Users },
        { name: "Blog", href: "/blog", icon: BookOpen },
        { name: "FAQ", href: "/faq", icon: HelpCircle },
      ],
    },
    {
      name: "Contact",
      href: "/contact",
      icon: Phone,
      gradient: "from-rose-500 to-pink-400",
    },
  ];

  return (
    <>
      {/* Backdrop blur overlay for mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
        }}
        className={cn(
          "fixed w-full z-50 transition-all duration-500 ease-in-out",
          isScrolled
            ? "bg-gray-100 backdrop-blur-xl shadow-lg border-b border-gray-200"
            : "bg-gray-100 backdrop-blur-md shadow-md border-b border-gray-100"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo Section */}
            <Link href="/" className="group relative z-10 inline-flex">
              <div className="flex items-center gap-3 px-4 py-2 rounded-full border border-blue-500/40 bg-white/80 backdrop-blur-md shadow-sm transition-all duration-300 group-hover:shadow-md">
                <motion.div
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  className="relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full blur-md opacity-50 group-hover:opacity-75 transition-opacity duration-300" />
                  <div className="relative w-10 h-10 lg:w-12 lg:h-12 rounded-full overflow-hidden border-2 border-white shadow-lg">
                    <Image
                      src="/images/vcw.webp"
                      alt="Car Wash Logo"
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                      priority
                    />
                  </div>
                </motion.div>

                <div className="flex flex-col leading-tight">
                  <motion.span
                    className="text-base sm:text-lg lg:text-2xl font-bold bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 bg-clip-text text-transparent"
                    style={{
                      backgroundSize: "200% auto",
                      animation: "gradient 3s linear infinite",
                    }}
                  >
                    Vishal Car Wash
                  </motion.span>

                  <span className="text-[9px] sm:text-[10px] lg:text-sm font-medium text-gray-600 tracking-wide">
                    Premium Car Care
                  </span>
                </div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href || (item.dropdown && item.dropdown.some(dropItem => dropItem.href === pathname));
                const Icon = item.icon;

                if (item.dropdown) {
                  return (
                    <div key={item.name} className="relative group" ref={dropdownRef}>
                      <button
                        onClick={() => setAboutDropdownOpen(!aboutDropdownOpen)}
                        className={cn(
                          "flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-300",
                          isActive
                            ? "text-blue-600"
                            : "text-gray-600 hover:text-gray-900"
                        )}
                      >
                        <span>{item.name}</span>
                        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${aboutDropdownOpen ? 'rotate-180' : ''}`} />
                      </button>
                      
                      <AnimatePresence>
                        {aboutDropdownOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute left-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50"
                          >
                            {item.dropdown.map((dropItem) => {
                              const isActive = pathname === dropItem.href;
                              return (
                                <Link
                                  key={dropItem.name}
                                  href={dropItem.href}
                                  onClick={() => setAboutDropdownOpen(false)}
                                  className={cn(
                                    "flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-50 transition-colors group",
                                    isActive ? "text-blue-600 bg-blue-50" : "text-gray-700"
                                  )}
                                >
                                  <dropItem.icon 
                                    className={cn(
                                      "w-4 h-4 flex-shrink-0",
                                      isActive ? "text-blue-500" : "text-gray-500 group-hover:text-gray-700"
                                    )} 
                                  />
                                  <span>{dropItem.name}</span>
                                </Link>
                              );
                            })}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="relative group"
                  >
                    <motion.div
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-300",
                        isActive
                          ? "text-blue-600"
                          : "text-gray-600 hover:text-gray-900"
                      )}
                    >
                      <Icon
                        className={cn(
                          "w-4 h-4 transition-all duration-300",
                          isActive ? "scale-110" : "group-hover:scale-110"
                        )}
                      />
                      <span>{item.name}</span>

                      {/* Active indicator */}
                      {isActive && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute inset-0 bg-blue-50 rounded-xl -z-10"
                          transition={{
                            type: "spring",
                            stiffness: 380,
                            damping: 30,
                          }}
                        />
                      )}

                      {/* Hover gradient underline */}
                      <motion.div
                        className={cn(
                          "absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 rounded-full bg-gradient-to-r",
                          item.gradient,
                          isActive ? "w-3/4" : "w-0 group-hover:w-3/4"
                        )}
                        transition={{ duration: 0.3 }}
                      />
                    </motion.div>
                  </Link>
                );
              })}

              {/* Book Now Button */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="ml-2"
              >
                <Link
                  href="/booking"
                  className="relative group px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-medium text-sm shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 flex items-center gap-2 overflow-hidden"
                >
                  <motion.div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <Calendar className="w-4 h-4 relative z-10 group-hover:rotate-12 transition-transform duration-300" />
                  <span className="relative z-10">Book Now</span>
                </Link>
              </motion.div>
            </nav>

            {/* Auth Section */}
            <div className="hidden lg:flex items-center gap-4">
              {status === "authenticated" ? (
                <div className="flex items-center gap-2">
                  {/* Notification Dropdown - Desktop */}
                  <NotificationDropdown />
                  <div className="relative" ref={dropdownRef}>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 transition-all duration-300 shadow-sm hover:shadow-md"
                    >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-sm">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-medium text-sm text-gray-700 max-w-[80px] truncate hidden sm:block">
                      {session.user.name.split(" ")[0]}
                    </span>
                    <motion.div
                      animate={{ rotate: userDropdownOpen ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    </motion.div>
                  </motion.button>
             

                  <AnimatePresence>
                    {userDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
                      >
                        {/* User Info Header */}
                        <div className="px-5 py-4 bg-gradient-to-br from-blue-50 to-cyan-50 border-b border-gray-100">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg">
                              <User className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-gray-900 truncate">
                                {session.user.name}
                              </p>
                              <p className="text-xs text-gray-500 truncate">
                                {session.user.email}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Menu Items */}
                        <div className="p-2">
                          <Link
                            href="/profile"
                            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-all duration-200 group"
                            onClick={() => setUserDropdownOpen(false)}
                          >
                            <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                              <User className="w-4 h-4 text-blue-600" />
                            </div>
                            <span className="text-sm font-medium text-gray-700">
                              Profile
                            </span>
                          </Link>

                          <Link
                            href="/my-bookings"
                            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-all duration-200 group"
                            onClick={() => setUserDropdownOpen(false)}
                          >
                            <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
                              <Calendar className="w-4 h-4 text-emerald-600" />
                            </div>
                            <span className="text-sm font-medium text-gray-700">
                              My Bookings
                            </span>
                          </Link>

                          <Link
                            href="/settings"
                            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-all duration-200 group"
                            onClick={() => setUserDropdownOpen(false)}
                          >
                            <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center group-hover:bg-amber-200 transition-colors">
                              <Settings className="w-4 h-4 text-amber-600" />
                            </div>
                            <span className="text-sm font-medium text-gray-700">
                              Settings
                            </span>
                          </Link>

                          {session.user.role === "admin" && (
                            <>
                              <div className="my-2 border-t border-gray-100" />
                              <Link
                                href="/admin"
                                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-all duration-200 group"
                                onClick={() => setUserDropdownOpen(false)}
                              >
                                <div className="w-9 h-9 rounded-lg bg-violet-100 flex items-center justify-center group-hover:bg-violet-200 transition-colors">
                                  <Shield className="w-4 h-4 text-violet-600" />
                                </div>
                                <span className="text-sm font-medium text-gray-700">
                                  Admin Dashboard
                                </span>
                              </Link>
                            </>
                          )}

                          <div className="my-2 border-t border-gray-100" />

                          <button
                            onClick={async () => {
                              await signOut({ redirect: false });
                              router.push("/auth/signin");
                              setUserDropdownOpen(false);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 transition-all duration-200 group"
                          >
                            <div className="w-9 h-9 rounded-lg bg-red-100 flex items-center justify-center group-hover:bg-red-200 transition-colors">
                              <LogOut className="w-4 h-4 text-red-600" />
                            </div>
                            <span className="text-sm font-medium text-red-600">
                              Sign Out
                            </span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      href="/auth/signin"
                      className="px-5 py-2.5 rounded-xl font-medium text-sm text-gray-700 hover:bg-gray-100 transition-all duration-300"
                    >
                      Sign In
                    </Link>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      href="/auth/signup"
                      className="relative group px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-medium text-sm shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 overflow-hidden"
                    >
                      <motion.div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <span className="relative z-10">Sign Up</span>
                    </Link>
                  </motion.div>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-2 lg:hidden">
              {status === "authenticated" && (
                <>
                  {/* Notification Dropdown - Mobile */}
                  <NotificationDropdown isMobile={true} />
                </>
              )}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <AnimatePresence mode="wait">
                  {mobileMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="w-6 h-6 text-gray-700" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="w-6 h-6 text-gray-700" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="lg:hidden border-t border-gray-100 max-h-[calc(100vh-4rem)] overflow-y-auto"
            >
              <div className="max-w-7xl mx-auto px-4 py-4 bg-white/98 backdrop-blur-xl">
                {/* User Info (if authenticated) */}
                {status === "authenticated" && (
                  <>
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="mb-4 p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg">
                          <User className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 truncate">
                            {session.user.name}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {session.user.email}
                          </p>
                        </div>
                      </div>
                    </motion.div>

                  </>
                )}

                {/* Navigation Links */}
                <div className="space-y-1 mb-4">
                  {navItems.map((item, index) => {
                    const isActive = pathname === item.href || (item.dropdown && item.dropdown.some(dropItem => dropItem.href === pathname));
                    const Icon = item.icon;

                    if (item.dropdown) {
                      return (
                        <motion.div
                          key={item.name}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 + index * 0.05 }}
                          className="space-y-1"
                        >
                          <button
                            onClick={() => setAboutDropdownOpen(!aboutDropdownOpen)}
                            className={cn(
                              "w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 text-left",
                              isActive
                                ? "bg-blue-50 text-blue-600"
                                : "text-gray-700 hover:bg-gray-50"
                            )}
                          >
                            <div className="flex items-center gap-3">
                              <Icon className="w-5 h-5" />
                              <span>{item.name}</span>
                            </div>
                            <ChevronDown 
                              className={`w-4 h-4 transition-transform duration-200 ${aboutDropdownOpen ? 'rotate-180' : ''}`} 
                            />
                          </button>
                          
                          <AnimatePresence>
                            {aboutDropdownOpen && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden pl-12 space-y-1"
                              >
                                {item.dropdown.map((dropItem) => {
                                  const isDropActive = pathname === dropItem.href;
                                  return (
                                    <Link
                                      key={dropItem.name}
                                      href={dropItem.href}
                                      onClick={() => {
                                        setMobileMenuOpen(false);
                                        setAboutDropdownOpen(false);
                                      }}
                                      className={cn(
                                        "flex items-center gap-3 px-4 py-2.5 text-sm rounded-lg transition-colors group",
                                        isDropActive 
                                          ? "bg-blue-50 text-blue-600" 
                                          : "text-gray-700 hover:bg-gray-50"
                                      )}
                                    >
                                      <dropItem.icon 
                                        className={cn(
                                          "w-4 h-4 flex-shrink-0",
                                          isDropActive ? "text-blue-500" : "text-gray-500 group-hover:text-gray-700"
                                        )} 
                                      />
                                      <span>{dropItem.name}</span>
                                      {isDropActive && (
                                        <div className="ml-auto w-1.5 h-1.5 bg-blue-500 rounded-full" />
                                      )}
                                    </Link>
                                  );
                                })}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      );
                    }

                    return (
                      <motion.div
                        key={item.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + index * 0.05 }}
                      >
                        <Link
                          href={item.href}
                          className={cn(
                            "flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300",
                            isActive
                              ? "bg-blue-50 text-blue-600"
                              : "text-gray-700 hover:bg-gray-50"
                          )}
                        >
                          <Icon className="w-5 h-5" />
                          <span>{item.name}</span>
                          {isActive && (
                            <div className="ml-auto w-2 h-2 bg-blue-500 rounded-full" />
                          )}
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Book Now Button */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Link
                    href="/booking"
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-medium shadow-lg shadow-blue-500/25 mb-4"
                  >
                    <Calendar className="w-5 h-5" />
                    Book Now
                  </Link>
                </motion.div>

                {/* Auth or User Actions */}
                {status === "authenticated" ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="pt-4 border-t border-gray-100 space-y-1"
                  >
                    <Link
                      href="/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors group"
                    >
                      <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                      <span className="font-medium">Profile</span>
                    </Link>
                    <Link
                      href="/my-bookings"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors group"
                    >
                      <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
                        <Calendar className="w-5 h-5 text-emerald-600" />
                      </div>
                      <span className="font-medium">My Bookings</span>
                    </Link>
                    <Link
                      href="/settings"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors group"
                    >
                      <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center group-hover:bg-amber-200 transition-colors">
                        <Settings className="w-5 h-5 text-amber-600" />
                      </div>
                      <span className="font-medium">Settings</span>
                    </Link>
                    {session.user.role === "admin" && (
                      <Link
                        href="/admin"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors group"
                      >
                        <div className="w-9 h-9 rounded-lg bg-violet-100 flex items-center justify-center group-hover:bg-violet-200 transition-colors">
                          <Shield className="w-5 h-5 text-violet-600" />
                        </div>
                        <span className="font-medium">Admin Dashboard</span>
                      </Link>
                    )}
                    <button
                      onClick={async () => {
                        await signOut({ redirect: false });
                        router.push("/auth/signin");
                        setMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors group"
                    >
                      <div className="w-9 h-9 rounded-lg bg-red-100 flex items-center justify-center group-hover:bg-red-200 transition-colors">
                        <LogOut className="w-5 h-5 text-red-600" />
                      </div>
                      <span className="font-medium">Sign Out</span>
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="pt-4 border-t border-gray-100 space-y-2"
                  >
                    <Link
                      href="/auth/signin"
                      className="block w-full px-4 py-3 text-center rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/auth/signup"
                      className="block w-full px-4 py-3 text-center rounded-xl font-medium bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/25"
                    >
                      Create Account
                    </Link>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      <style jsx global>{`
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
    </>
  );
}
