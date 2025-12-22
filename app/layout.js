"use client";

import "./globals.css";
import { Inter } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { Navigation } from "@/components/Navigation";
import ChatBot from "./components/ChatBot";
import BackToTop from "@/components/BackToTop";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useState } from 'react';

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  const [mounted, setMounted] = useState(false);

  // This effect ensures we don't get hydration mismatches
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <html lang="en" className="h-full dark" suppressHydrationWarning>
      <head>
        <title>Vishal Car Wash - Professional Car Cleaning Services</title>
        <meta
          name="description"
          content="Premium car wash and detailing services"
        />
        <meta name="theme-color" content="#000000" media="(prefers-color-scheme: dark)" />
      </head>
      <body 
        className={`${inter.className} min-h-screen flex flex-col bg-white dark:bg-black text-gray-900 dark:text-white transition-colors duration-200`}
        suppressHydrationWarning
      >
        {mounted ? (
          <SessionProvider>
            <Navigation />
            <main className="flex-1 pt-16 md:pt-20">{children}</main>
            <ChatBot />
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
            {/* <BackToTop /> */}
          </SessionProvider>
        ) : null}
      </body>
    </html>
  );
}
