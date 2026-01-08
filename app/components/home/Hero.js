"use client";

import { useState, lazy, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Head from 'next/head';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';

// Lazy load the YouTubeModal component
const YouTubeModal = lazy(() => import('./YouTubeModal'));

/* ------------------ Stats ------------------ */
const stats = [
  { value: "2K+", label: "Happy Customers", icon: "😊" },
  { value: "5+", label: "Years Experience", icon: "⏳" },
  { value: "15+", label: "Expert Staff", icon: "👨‍🔧" },
  { value: "100%", label: "Satisfaction", icon: "⭐" },
];

/* ------------------ Animations ------------------ */
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};

const statItem = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 120 },
  },
};

// Loading component for Suspense fallback
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

/* ------------------ Hero ------------------ */
export default function Hero() {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  
  // SEO Metadata
  const seoTitle = "Premium Car Wash & Detailing Services in Varanasi | Vishal Car Wash";
  const seoDescription = "Professional car wash, detailing, and maintenance services in Varanasi. Book online for premium car care with expert technicians. 2K+ happy customers served!";
  const canonicalUrl = "https://vishal-car-wash.vercel.app/";

  return (
    <>
      <Head>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta name="twitter:title" content={seoTitle} />
        <meta name="twitter:description" content={seoDescription} />
      </Head>
    <section className="relative min-h-screen overflow-hidden flex items-center" aria-label="Hero section">
      {/* Background */}
      <motion.div
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2 }}
        className="absolute inset-0"
        aria-hidden="true"
      >
        <Image
          src="/images/premium.webp"
          alt="Professional car wash service in Varanasi"
          fill
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
          className="object-cover"
          quality={75}
          placeholder="blur"
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z/C/HgAGgwJ/lK3Q6wAAAABJRU5ErkJggg=="
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-950/90 via-blue-900/70 to-black/90" />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="max-w-4xl mx-auto"
        >
          {/* Badge */}
          <motion.div
            variants={fadeUp}
            className="inline-flex items-center px-5 py-2 rounded-full bg-white/10 backdrop-blur border border-white/20 mb-6"
          >
            <span className="h-2 w-2 bg-blue-400 rounded-full mr-2" />
            <span className="text-blue-100 text-sm font-semibold">
              Professional Car Care Since 2021
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            variants={fadeUp}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-tight mb-4 sm:mb-6"
          >
            <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent animate-gradient">
              Premium <span className="text-blue-400">Car Care</span>
            </span>
            <br />
            <span className="text-white"> For Your Vehicle </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={fadeUp}
            className="text-base sm:text-lg md:text-xl text-blue-100 max-w-2xl mx-auto mb-8 sm:mb-10 px-2"
          >
            Experience the ultimate care for your vehicle with our professional
            cleaning and detailing services. We bring back that showroom shine
            to your car.
          </motion.p>

          {/* CTA */}
          <motion.div
            variants={fadeUp}
            className="flex flex-col sm:flex-row gap-3 sm:gap-5 justify-center mb-8 sm:mb-12 md:mb-16 px-2"
            role="group"
            aria-label="Call to action buttons"
          >
            <Link href="/booking" className="w-full sm:w-auto">
              {" "}
              <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg font-semibold rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg">
                {" "}
                Book Appointment Now{" "}
                <svg
                  className="h-5 w-5 ml-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  {" "}
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                  />{" "}
                </svg>{" "}
              </Button>{" "}
            </Link>

            <Button
              onClick={() => setIsVideoOpen(true)}
              variant="outline"
              className="w-full sm:w-auto bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg font-semibold rounded-full transition-all duration-300 transform hover:scale-105 cursor-pointer"
            >
              {" "}
              <Play className="w-5 h-5 mr-2" /> Watch Video{" "}
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={stagger}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 md:gap-6 px-2 sm:px-0"
            role="region"
            aria-label="Our Statistics"
          >
            {stats.map((s, i) => (
              <motion.div
                key={i}
                variants={statItem}
                whileHover={{ y: -8, scale: 1.03 }}
                className="rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 bg-white/10 backdrop-blur-xl border border-white/20 hover:border-blue-400/40 transition"
                role="article"
                aria-label={`${s.value} ${s.label}`}
              >
                <div className="text-2xl sm:text-3xl md:text-4xl mb-1 sm:mb-2" aria-hidden="true">{s.icon}</div>
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
                  <span aria-hidden="true">{s.value}</span>
                  <span className="sr-only">{s.value === "2K+" ? "Over 2000" : s.value} {s.label}</span>
                </div>
                <div className="text-blue-200 text-xs sm:text-sm mt-0.5 sm:mt-1">{s.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      <Suspense fallback={null}>
        <YouTubeModal isOpen={isVideoOpen} onClose={() => setIsVideoOpen(false)} />
      </Suspense>
    </section>
    </>
  );
}
