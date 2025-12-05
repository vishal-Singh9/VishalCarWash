'use client';

import './globals.css';
import { Inter } from 'next/font/google';
import { SessionProvider } from 'next-auth/react';
import { Navigation } from '@/components/Navigation';
import Link from 'next/link';
import { Phone, Mail, MapPin } from 'lucide-react';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <head>
        <title>Vishal Car Wash - Professional Car Cleaning Services</title>
        <meta name="description" content="Premium car wash and detailing services" />
      </head>
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <SessionProvider>
          <Navigation />
          <main className="flex-1">
            {children}
          </main>

          {/* Footer */}
          <footer className="bg-slate-900 text-white mt-12">
            <div className="container mx-auto px-4 py-12">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* About */}
                <div>
                  <h3 className="text-xl font-bold mb-4">Vishal Car Wash</h3>
                  <p className="text-gray-400">
                    Professional car wash and detailing services with modern equipment and eco-friendly products.
                  </p>
                </div>

                {/* Quick Links */}
                <div>
                  <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
                  <ul className="space-y-2">
                    <li>
                      <Link href="/about" className="text-gray-400 hover:text-white transition">
                        About Us
                      </Link>
                    </li>
                    <li>
                      <Link href="/services" className="text-gray-400 hover:text-white transition">
                        Services
                      </Link>
                    </li>
                    <li>
                      <Link href="/gallery" className="text-gray-400 hover:text-white transition">
                        Gallery
                      </Link>
                    </li>
                    <li>
                      <Link href="/contact" className="text-gray-400 hover:text-white transition">
                        Contact
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Contact Info */}
                <div>
                  <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
                  <ul className="space-y-2 text-gray-400">
                    <li className="flex items-start">
                      <Phone className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                      <span>+91 98765 43210</span>
                    </li>
                    <li className="flex items-start">
                      <Mail className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                      <span>info@vishalcarwash.com</span>
                    </li>
                    <li className="flex items-start">
                      <MapPin className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                      <span>123 Car Wash Street, City, State 123456</span>
                    </li>
                  </ul>
                </div>

                {/* Hours */}
                <div>
                  <h4 className="text-lg font-semibold mb-4">Working Hours</h4>
                  <ul className="space-y-2 text-gray-400">
                    <li className="flex justify-between">
                      <span>Monday - Friday</span>
                      <span>8:00 AM - 8:00 PM</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Saturday</span>
                      <span>8:00 AM - 8:00 PM</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Sunday</span>
                      <span>9:00 AM - 6:00 PM</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                <p>&copy; {new Date().getFullYear()} Vishal Car Wash. All rights reserved.</p>
              </div>
            </div>
          </footer>
        </SessionProvider>
      </body>
    </html>
  );
}
