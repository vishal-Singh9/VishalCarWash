'use client';

import Link from 'next/link';
import { Phone, Mail, MapPin, Clock, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-slate-900 to-slate-950 text-white mt-24 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      </div>
      
      <div className="container mx-auto px-4 py-16 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* About */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
                Vishal Car Wash
              </span>
            </Link>
            <p className="text-gray-400 leading-relaxed">
              Professional car care services using modern equipment and eco-friendly products to keep your vehicle looking its best.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-pink-500 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-5 relative inline-block">
              Quick Links
              <span className="absolute -bottom-1 left-0 w-10 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-500"></span>
            </h4>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors flex items-center group">
                  <span className="w-1 h-1 bg-gray-500 rounded-full mr-2 group-hover:bg-blue-400 transition-colors"></span>
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-gray-400 hover:text-white transition-colors flex items-center group">
                  <span className="w-1 h-1 bg-gray-500 rounded-full mr-2 group-hover:bg-blue-400 transition-colors"></span>
                  Services
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="text-gray-400 hover:text-white transition-colors flex items-center group">
                  <span className="w-1 h-1 bg-gray-500 rounded-full mr-2 group-hover:bg-blue-400 transition-colors"></span>
                  Gallery
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-gray-400 hover:text-white transition-colors flex items-center group">
                  <span className="w-1 h-1 bg-gray-500 rounded-full mr-2 group-hover:bg-blue-400 transition-colors"></span>
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors flex items-center group">
                  <span className="w-1 h-1 bg-gray-500 rounded-full mr-2 group-hover:bg-blue-400 transition-colors"></span>
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-5 relative inline-block">
              Contact Us
              <span className="absolute -bottom-1 left-0 w-10 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-500"></span>
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="bg-blue-500/10 p-2 rounded-lg mr-3">
                  <Phone className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <span className="block text-gray-400 text-sm">Phone</span>
                  <a href="tel:+919876543210" className="text-white hover:text-blue-400 transition-colors">+91 98765 43210</a>
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-blue-500/10 p-2 rounded-lg mr-3">
                  <Mail className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <span className="block text-gray-400 text-sm">Email</span>
                  <a href="mailto:info@vishalcarwash.com" className="text-white hover:text-blue-400 transition-colors">info@vishalcarwash.com</a>
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-blue-500/10 p-2 rounded-lg mr-3">
                  <MapPin className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <span className="block text-gray-400 text-sm">Location</span>
                  <span className="text-white">123 Car Wash Street, City, State 123456</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-5 relative inline-block">
              Working Hours
              <span className="absolute -bottom-1 left-0 w-10 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-500"></span>
            </h4>
            <ul className="space-y-3">
              <li className="flex items-center justify-between pb-2 border-b border-gray-800">
                <span className="text-gray-400">Monday - Friday</span>
                <div className="flex items-center text-white">
                  <Clock className="h-4 w-4 mr-1 text-blue-400" />
                  <span>8:00 AM - 8:00 PM</span>
                </div>
              </li>
              <li className="flex items-center justify-between py-2 border-b border-gray-800">
                <span className="text-gray-400">Saturday</span>
                <div className="flex items-center text-white">
                  <Clock className="h-4 w-4 mr-1 text-blue-400" />
                  <span>8:00 AM - 8:00 PM</span>
                </div>
              </li>
              <li className="flex items-center justify-between pt-2">
                <span className="text-gray-400">Sunday</span>
                <div className="flex items-center text-white">
                  <Clock className="h-4 w-4 mr-1 text-blue-400" />
                  <span>9:00 AM - 6:00 PM</span>
                </div>
              </li>
            </ul>
            
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-lg border border-blue-500/20">
              <p className="text-sm text-blue-100">We are open 7 days a week to serve you better!</p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-16 pt-8 text-center">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Vishal Car Wash. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
                Terms of Service
              </Link>
              <Link href="/sitemap" className="text-gray-400 hover:text-white text-sm transition-colors">
                Sitemap
              </Link>
               <Link href="/help" className="text-gray-400 hover:text-white text-sm transition-colors">
               Help
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
