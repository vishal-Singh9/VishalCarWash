"use client";

import "./globals.css";
import { Inter } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { Navigation } from "@/components/Navigation";
import ChatBot from "./components/ChatBot";
import BackToTop from "@/components/BackToTop";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <head>
        <title>Vishal Car Wash - Professional Car Cleaning Services</title>
        <meta
          name="description"
          content="Premium car wash and detailing services"
        />
      </head>
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <SessionProvider>
          <Navigation />
          <main className="flex-1 pt-16 md:pt-20">{children}</main>
          <ChatBot />
          {/* <BackToTop /> */}
        </SessionProvider>
      </body>
    </html>
  );
}
