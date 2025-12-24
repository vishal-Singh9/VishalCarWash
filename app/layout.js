"use client";

import "./globals.css";
import { Inter } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { Navigation } from "@/components/Navigation";
import ChatBot from "./components/ChatBot";
import FeedbackModal from "./components/FeedbackModal";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  const [mounted, setMounted] = useState(false);

  // This effect ensures we don't get hydration mismatches
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <head>
        <title>Vishal Car Wash - Professional Car Cleaning Services</title>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content="Experience premium car wash, detailing, and maintenance services. Professional care for your vehicle with eco-friendly products and expert technicians."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#2563eb" />
        <meta
          name="keywords"
          content="car wash, car detailing, auto detailing, car cleaning, professional car wash, mobile car wash, car care, auto spa, car waxing, car polishing, paint protection"
        />
        <meta name="author" content="Vishal Car Wash" />
        <meta name="robots" content="index, follow" />
        <meta
          name="google-site-verification"
          content="puA3HxKKYhYcTzj_8kghztugog_JE21YC3OV4RfXt2o"
        />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://vishal-car-wash.vercel.app/" />
        <meta
          property="og:title"
          content="Vishal Car Wash - Professional Car Cleaning Services"
        />
        <meta
          property="og:description"
          content="Premium car wash, detailing, and maintenance services for your vehicle. Book online today!"
        />
        <meta property="og:image" content="/images/og-image.jpg" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://vishal-car-wash.vercel.app/" />
        <meta
          property="twitter:title"
          content="Vishal Car Wash - Professional Car Cleaning Services"
        />
        <meta
          property="twitter:description"
          content="Premium car wash, detailing, and maintenance services for your vehicle. Book online today!"
        />
        <meta property="twitter:image" content="/images/og-image.jpg" />

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />

        {/* Preconnect to important origins */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body
        className={`${inter.className} min-h-screen flex flex-col bg-white text-gray-900 transition-colors duration-200`}
        suppressHydrationWarning
      >
        {mounted ? (
          <SessionProvider>
            <Navigation />
            <main className="flex-1 pt-16 md:pt-20">{children}</main>
            <ChatBot />
            <FeedbackModal />
            <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            />
          </SessionProvider>
        ) : null}
      </body>
    </html>
  );
}
