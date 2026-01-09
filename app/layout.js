"use client";

import "./globals.css";
import { Inter } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { Navigation } from "@/components/Navigation";
import ChatBot from "./components/ChatBot";
import FeedbackModal from "./components/FeedbackModal";
import FloatingActionMenu from "@/components/FloatingActionMenu";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";
import { NotificationProvider } from "@/context/NotificationContext";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  const [mounted, setMounted] = useState(false);
  const [chatbotOpen, setChatbotOpen] = useState(false);
  const [feedbackTrigger, setFeedbackTrigger] = useState(0);

  // This effect ensures we don't get hydration mismatches
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleChatbotClick = () => {
    setChatbotOpen(true);
  };

  const handleFeedbackClick = () => {
    setFeedbackTrigger(prev => prev + 1);
  };

  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <head>
        <title>Vishal Car Wash - Varanasi</title>
        <link rel="icon" href="/favicon.ico" />
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link
          rel="icon"
          href="/favicon-16x16.png"
          type="image/png"
          sizes="16x16"
        />
        <link
          rel="icon"
          href="/favicon-32x32.png"
          type="image/png"
          sizes="32x32"
        />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />

        {/* Primary Meta Tags */}
        <meta name="title" content="Vishal Car Wash in Varanasi" />
        <meta
          name="description"
          content="Vishal Car Wash in Babatpur Varanasi offers professional car cleaning, detailing, and maintenance services. Experience premium care for your vehicle with our expert team."
        />
        <meta
          name="keywords"
          content="car wash varanasi, best car wash in varanasi, car wash near babatpur airport, car cleaning varanasi, car wash babatpur,car wash airport,varanasi car wash, car detailing varanasi, professional car wash, car wash service, mobile car wash, car wash near me, luxury car wash, car wash and detailing, express car wash, car interior cleaning, car wash center, car wash shop near me"
        />
        <meta name="author" content="Vishal Car Wash" />
        <meta name="robots" content="index, follow" />
        <meta name="language" content="English" />
        <meta name="revisit-after" content="7 days" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://vishal-car-wash.vercel.app/" />
        <meta property="og:title" content="Vishal Car Wash in Varanasi" />
        <meta
          property="og:description"
          content="Professional Car Wash & Detailing Services in Varanasi. Expert cleaning for your vehicle. Book now for the best car wash experience near Babatpur Airport."
        />
        <meta
          property="og:image"
          content="https://vishal-car-wash.vercel.app/images/og-image.jpg"
        />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta
          property="twitter:url"
          content="https://vishal-car-wash.vercel.app/"
        />
        <meta property="twitter:title" content="Vishal Car Wash in Varanasi" />
        <meta
          property="twitter:description"
          content="Experience the best car wash services in Varanasi. Professional cleaning, detailing & maintenance near Babatpur Airport."
        />
        <meta
          property="twitter:image"
          content="https://vishal-car-wash.vercel.app/images/og-image.jpg"
        />

        {/* Canonical URL */}
        <link rel="canonical" href="https://vishal-car-wash.vercel.app/" />

        {/* Local Business Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "AutoWash",
              name: "Vishal Car Wash",
              image: "https://vishal-car-wash.vercel.app/images/logo.jpg",
              "@id": "https://vishal-car-wash.vercel.app/",
              url: "https://vishal-car-wash.vercel.app/",
              telephone: "+91-XXXXXXXXXX",
              priceRange: "$$",
              address: {
                "@type": "PostalAddress",
                streetAddress: "Near Babatpur Airport",
                addressLocality: "Varanasi",
                postalCode: "221006",
                addressCountry: "IN",
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: 25.4484,
                longitude: 82.8605,
              },
              openingHoursSpecification: {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: [
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                  "Sunday",
                ],
                opens: "08:00",
                closes: "20:00",
              },
              sameAs: [
                "https://www.facebook.com/YourPage/",
                "https://www.instagram.com/YourProfile/",
              ],
            }),
          }}
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#2563eb" />
        <meta
          name="google-site-verification"
          content="An2nDYwmOh-UXZ_47rB8oN2opHvOPmImCY4d75v_Uvw"
        />
        <meta property="og:title" content="Vishal Car Wash - Varanasi" />
        <meta
          property="og:description"
          content="Car Wash in Babatpur Varanasi offers professional car cleaning, detailing, and maintenance services. Experience premium care for your vehicle with our expert team."
        />
        <meta property="og:image" content="/images/vcw.webp" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta
          property="twitter:url"
          content="https://vishal-car-wash.vercel.app/"
        />
        <meta property="twitter:title" content="Vishal Car Wash - Varanasi" />
        <meta
          property="twitter:description"
          content="Car Wash in Babatpur Varanasi offers professional car cleaning, detailing, and maintenance services. Experience premium care for your vehicle with our expert team."
        />
        <meta property="twitter:image" content="/images/vcw.webp" />

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
        className={`${inter.className} min-h-full flex flex-col`}
        suppressHydrationWarning
      >
        {mounted ? (
          <SessionProvider>
            <NotificationProvider>
              <Navigation />
              <main className="flex-grow">{children}</main>
              <ChatBot externalOpen={chatbotOpen} onExternalOpenChange={setChatbotOpen} />
              <FeedbackModal externalOpenTrigger={feedbackTrigger} />
              <FloatingActionMenu 
                onChatbotClick={handleChatbotClick} 
                onFeedbackClick={handleFeedbackClick}
                isChatOpen={chatbotOpen}
              />
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
            </NotificationProvider>
          </SessionProvider>
        ) : null}
      </body>
    </html>
  );
}
