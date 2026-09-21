"use client";

import Link from "next/link";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  ChevronUp,
} from "lucide-react";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function Footer() {
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    const checkScroll = () => {
      if (window.scrollY > 300) {
        setShowScroll(true);
      } else {
        setShowScroll(false);
      }
    };

    window.addEventListener("scroll", checkScroll);
    return () => window.removeEventListener("scroll", checkScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="bg-[#030712] border-t border-white/5 text-white relative overflow-hidden w-full">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px]"></div>
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-cyan-600/10 rounded-full blur-[100px]"></div>
      </div>

      <button
        onClick={scrollToTop}
        className={`fixed z-50 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg transform transition-all duration-300 hover:scale-110 hover:shadow-cyan-500/30 active:scale-95
          w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16
          bottom-24 right-4 sm:bottom-28 sm:right-6 md:bottom-28 md:right-7
          flex items-center justify-center
          ${
          showScroll
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10 pointer-events-none"
        }`}
        aria-label="Back to top"
      >
        <ChevronUp className="w-6 h-6 " />
      </button>

      <div className="container mx-auto px-4 text-center sm:text-left sm:px-6 py-12 md:py-16 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-6 lg:gap-8">
          <div className="space-y-5 transition-all duration-300 hover:scale-[1.02]">
            <div className="flex items-center space-x-3">
              <div className="w-16 h-16 rounded-full overflow-hidden border border-white/20">
                <Image
                  src="/images/vcw.webp"
                  alt="Vishal Car Wash Logo"
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                  priority
                />
              </div>
              <Link
                href="/"
                className="inline-block transform hover:scale-105 transition-transform duration-300"
              >
                <span className="text-xl sm:text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
                  Vishal Car Wash
                </span>
              </Link>
            </div>
            <p className="text-gray-400 leading-relaxed text-sm sm:text-base">
              Vishal Car Wash Center offers professional car wash and detailing
              services with a focus on quality, care, and customer satisfaction.
              🚗✨
            </p>
            <div className="flex space-x-4 pt-2 flex-wrap gap-2 sm:gap-4">
              {[
                {
                  icon: <Facebook className="w-5 h-5" />,
                  color: "hover:text-blue-500",
                },
                {
                  icon: <Twitter className="w-5 h-5" />,
                  color: "hover:text-cyan-400",
                },
                {
                  icon: <Instagram className="w-5 h-5" />,
                  color: "hover:text-pink-500",
                },
                {
                  icon: <Linkedin className="w-5 h-5" />,
                  color: "hover:text-blue-600",
                },
              ].map((social, index) => (
                <a
                  key={index}
                  href="#"
                  className={`text-gray-400 ${social.color} transition-all duration-300 transform hover:-translate-y-1 hover:scale-110 p-1.5 sm:p-0`}
                  aria-label={`Social media link ${index + 1}`}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          <div className="transition-all duration-300 hover:scale-[1.02]">
            <h4 className="text-lg md:text-xl font-semibold text-white mb-6 relative inline-block group">
              Quick Links
              <span className="absolute -bottom-1 left-0 w-12 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-500 group-hover:w-16"></span>
            </h4>
            <ul className="space-y-3.5">
              {[
                { text: "About Us", href: "/about" },
                { text: "Services", href: "/services" },
                { text: "Gallery", href: "/gallery" },
                { text: "Blog", href: "/blog" },
                { text: "FAQ", href: "/faq" },
                { text: "Feedback", href: "/feedback" },
                { text: "Contact Us", href: "/contact" },
              ].map((item, index) => (
                <li key={index} className="group">
                  <Link
                    href={item.href}
                    className="text-gray-400 hover:text-cyan-400 transition-all duration-300 flex items-center group-hover:translate-x-1"
                  >
                    <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-x-1 group-hover:translate-x-0"></span>
                    <span className="relative before:absolute before:bottom-0 before:left-0 before:w-0 before:h-px before:bg-gradient-to-r before:from-cyan-400 before:to-blue-500 before:transition-all before:duration-300 hover:before:w-full">
                      {item.text}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="transition-all duration-300 hover:scale-[1.02]">
            <h4 className="text-lg md:text-xl font-semibold text-white mb-6 relative inline-block group">
              Contact Us
              <span className="absolute -bottom-1 left-0 w-12 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-500 group-hover:w-16"></span>
            </h4>
            <ul className="space-y-5">
              {[
                {
                  icon: <Phone className="h-5 w-5 text-cyan-400" />,
                  title: "Phone",
                  content: "+91 9956414364",
                  href: "tel:+919956414364",
                  isLink: true,
                },
                {
                  icon: <Mail className="h-5 w-5 text-cyan-400" />,
                  title: "Email",
                  content: "mr.vishalsingh1309@gmail.com",
                  href: "mailto:mr.vishalsingh1309@gmail.com",
                  isLink: true,
                },
                {
                  icon: <MapPin className="h-5 w-5 text-cyan-400" />,
                  title: "Location",
                  content:
                    "Vill-Sagunaha ,Babatpur,Airport Road, Near Primary School",
                  href: "https://www.google.com/maps/place/Vishal+Washing+Centre/@25.4386737,82.8520716,17z/data=!3m1!4b1!4m6!3m5!1s0x398fd5caa6faea49:0xd91afc197461fbff!8m2!3d25.4386737!4d82.8546465!16s%2Fg%2F11vhyyzdp2?entry=ttu&g_ep=EgoyMDI1MTIwOS4wIKXMDSoKLDEwMDc5MjA2N0gBUAM%3D",
                  isLink: true,
                },
              ].map((item, index) => (
                <li key={index} className="flex items-start group">
                  <div className="bg-white/5 border border-white/10 p-2.5 rounded-lg mr-3.5 transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 backdrop-blur-sm">
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <span className="block text-gray-500 text-sm mb-0.5">
                      {item.title}
                    </span>
                    {item.isLink ? (
                      <a
                        href={item.href}
                        className="text-gray-300 hover:text-cyan-400 transition-colors duration-300 inline-block hover:translate-x-0.5"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {item.content}
                      </a>
                    ) : (
                      <span className="text-gray-300">{item.content}</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="transition-all duration-300 hover:scale-[1.02]">
            <h4 className="text-lg md:text-xl font-semibold text-white mb-6 relative inline-block group">
              Working Hours
              <span className="absolute -bottom-1 left-0 w-12 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-500 group-hover:w-16"></span>
            </h4>
            <div className="bg-white/5 backdrop-blur-md rounded-xl p-5 border border-white/10 shadow-lg">
              <ul className="space-y-3">
                {[
                  { day: "Mon-Fri", time: "7:00 AM - 7:00 PM" },
                  { day: "Sat", time: "7:00 AM - 7:00 PM" },
                  { day: "Sun", time: "7:00 AM - 8:00 PM" },
                ].map((item, index) => (
                  <li
                    key={index}
                    className={`flex items-center justify-between ${
                      index < 2 ? "pb-3 border-b border-white/10" : "pt-1"
                    } group`}
                  >
                    <span className="text-gray-400 text-sm font-medium group-hover:text-cyan-400 transition-colors duration-300">
                      {item.day}
                    </span>
                    <div className="flex items-center">
                      <div
                        className="relative
                        before:absolute before:-inset-1 before:bg-gradient-to-r before:from-cyan-500 before:to-blue-500 before:rounded-full before:opacity-0 before:transition-opacity before:duration-300
                        group-hover:before:opacity-100
                      "
                      >
                        <div className="relative flex items-center bg-[#030712]/80 group-hover:bg-[#030712] px-3 py-1.5 rounded-full text-xs sm:text-sm transition-all duration-300 border border-white/5">
                          <Clock className="h-3.5 w-3.5 mr-1.5 text-cyan-400 group-hover:text-white transition-colors" />
                          <span className="text-gray-300">{item.time}</span>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-5 p-3.5 bg-cyan-500/10 rounded-lg border border-cyan-500/20 transform transition-all duration-300 hover:scale-[1.02] group">
                <div className="flex items-center">
                  <div className="bg-cyan-500/20 p-1.5 rounded-md mr-3 group-hover:rotate-12 transition-transform duration-300">
                    <Clock className="h-4 w-4 text-cyan-400" />
                  </div>
                  <p className="text-sm text-cyan-100 group-hover:text-white transition-colors">
                    We are open 7 days a week to serve you better!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 sm:mt-12 pt-6 sm:pt-8 text-center">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm mb-4 md:mb-0">
              {new Date().getFullYear()}{" "}
              <span className="font-medium text-gray-300">Vishal Car Wash</span>
              . All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-4 md:gap-6">
              {[
                { text: "Privacy Policy", href: "/privacy" },
                { text: "Terms of Service", href: "/terms" },
                { text: "Sitemap", href: "/sitemap" },
                { text: "Help", href: "/help" },
              ].map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className="text-gray-500 hover:text-cyan-400 text-xs sm:text-sm transition-all duration-300 hover:translate-y-[-1px] relative group"
                >
                  {item.text}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-300 group-hover:w-full"></span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
