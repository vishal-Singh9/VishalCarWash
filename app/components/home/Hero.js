"use client";

import { useState, lazy, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import Head from "next/head";
import { Button } from "@/components/ui/button";
import { Play, Sparkles, ArrowRight, CheckCircle } from "lucide-react";

// Lazy load the YouTubeModal component
const YouTubeModal = lazy(() => import("./YouTubeModal"));

/* ------------------ Stats ------------------ */
const stats = [
  {
    value: "2K+",
    label: "Happy Customers",
    icon: "😊",
    color: "from-blue-500 to-cyan-500",
  },
  {
    value: "5+",
    label: "Years Experience",
    icon: "⏳",
    color: "from-indigo-500 to-purple-500",
  },
  {
    value: "15+",
    label: "Expert Staff",
    icon: "👨‍🔧",
    color: "from-purple-500 to-pink-500",
  },
  {
    value: "100%",
    label: "Satisfaction",
    icon: "⭐",
    color: "from-cyan-500 to-blue-500",
  },
];

/* ------------------ Enhanced Animations ------------------ */
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const statItem = {
  hidden: { opacity: 0, y: 30, scale: 0.9 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 100, damping: 10 },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
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
  const seoTitle =
    "Premium Car Wash & Detailing Services in Varanasi | Vishal Car Wash";
  const seoDescription =
    "Professional car wash, detailing, and maintenance services in Varanasi. Book online for premium car care with expert technicians. 2K+ happy customers served!";
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
      <section
        className="relative min-h-screen overflow-hidden flex items-center"
        aria-label="Hero section"
      >
        {/* Enhanced Background with Parallax Effect */}
        <motion.div
          initial={{ scale: 1.15 }}
          animate={{ scale: 1 }}
          transition={{ duration: 3, ease: "easeOut" }}
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
            quality={90}
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z/C/HgAGgwJ/lK3Q6wAAAABJRU5ErkJggg=="
          />
          {/* Enhanced Blue Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-950/90 via-blue-900/70 to-blue-950/90" />
          {/* Additional gradient layers for depth */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-900/20 to-blue-950/40" />
          {/* Animated gradient overlay */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-cyan-500/10 to-blue-600/10"
            animate={{
              backgroundPosition: ["0%", "100%", "0%"],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              backgroundSize: "200% 100%",
            }}
          />
        </motion.div>

        {/* Floating decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"
            animate={{
              y: [0, 30, 0],
              x: [0, 20, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"
            animate={{
              y: [0, -30, 0],
              x: [0, -20, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

        {/* Enhanced Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="max-w-5xl mx-auto"
          >
            {/* Enhanced Badge */}
            <motion.div
              variants={fadeUp}
              className="inline-flex items-center gap-2 px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 rounded-full bg-white/10 backdrop-blur-md border-2 border-white/30 mb-6 sm:mb-8 shadow-lg hover:bg-white/15 transition-all duration-300"
              whileHover={{ scale: 1.05, y: -2 }}
            >
              <motion.span
                className="relative flex h-2 w-2"
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <span className="absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75 animate-ping"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-400"></span>
              </motion.span>
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-blue-300" />
              <span className="text-blue-100 text-xs sm:text-sm md:text-base font-semibold">
                Professional Car Care Since 2021
              </span>
            </motion.div>

            {/* Enhanced Heading */}
            <motion.h1
              variants={fadeUp}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold leading-[1.1] mb-5 sm:mb-6 md:mb-8 px-2"
            >
              <motion.span
                className="block bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent mb-2 sm:mb-3"
                animate={{
                  backgroundPosition: ["0%", "100%", "0%"],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "linear",
                }}
                style={{
                  backgroundSize: "200% 100%",
                }}
              >
                Best <span className="text-blue-300">Car Care</span>
              </motion.span>
              <motion.span
                className="block text-white drop-shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                For Your Vehicle
              </motion.span>
            </motion.h1>

            {/* Enhanced Subtitle */}
            <motion.p
              variants={fadeUp}
              className="text-base sm:text-lg md:text-xl lg:text-2xl text-blue-100/90 max-w-3xl mx-auto mb-8 sm:mb-10 md:mb-12 px-4 leading-relaxed drop-shadow-md"
            >
              Experience the ultimate care for your vehicle with our
              professional cleaning and detailing services. We bring back that
              showroom shine to your car.
            </motion.p>

            {/* Enhanced CTA Buttons */}
            <motion.div
              variants={fadeUp}
              className="flex flex-col sm:flex-row gap-4 sm:gap-5 md:gap-6 justify-center mb-10 sm:mb-12 md:mb-16 px-2"
              role="group"
              aria-label="Call to action buttons"
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto"
              >
                <Link href="/booking" className="block">
                  <Button className="group relative w-full sm:w-auto bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:from-blue-700 hover:via-blue-600 hover:to-cyan-600 text-white px-6 sm:px-8 md:px-10 py-4 sm:py-5 md:py-6 text-sm sm:text-base md:text-lg font-bold rounded-full transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-blue-500/50 overflow-hidden">
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      Book Appointment Now
                      <motion.div
                        animate={{ x: [0, 4, 0] }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      >
                        <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                      </motion.div>
                    </span>
                    {/* Animated background gradient */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-blue-700 via-cyan-600 to-blue-700"
                      animate={{
                        backgroundPosition: ["0%", "100%", "0%"],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      style={{
                        backgroundSize: "200% 100%",
                      }}
                    />
                  </Button>
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto"
              >
                <Button
                  onClick={() => setIsVideoOpen(true)}
                  variant="outline"
                  className="group w-full sm:w-auto bg-white/10 backdrop-blur-md border-2 border-white/40 text-white hover:bg-white hover:text-blue-600 px-6 sm:px-8 md:px-10 py-4 sm:py-5 md:py-6 text-sm sm:text-base md:text-lg font-bold rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-white/20"
                >
                  <span className="flex items-center justify-center gap-2">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-white group-hover:fill-blue-600 transition-colors" />
                    </motion.div>
                    Watch Video
                  </span>
                </Button>
              </motion.div>
            </motion.div>

            {/* Enhanced Stats */}
            <motion.div
              variants={stagger}
              className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8 px-2 sm:px-0"
              role="region"
              aria-label="Our Statistics"
            >
              {stats.map((s, i) => (
                <motion.div
                  key={i}
                  variants={statItem}
                  whileHover={{ y: -10, scale: 1.05 }}
                  className="group relative rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 lg:p-7 bg-white/10 backdrop-blur-xl border-2 border-white/20 hover:border-white/40 transition-all duration-300 overflow-hidden"
                  role="article"
                  aria-label={`${s.value} ${s.label}`}
                >
                  {/* Gradient overlay on hover */}
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${s.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300`}
                  />

                  {/* Content */}
                  <div className="relative z-10">
                    <motion.div
                      className="text-3xl sm:text-4xl md:text-5xl mb-2 sm:mb-3"
                      aria-hidden="true"
                      animate={{
                        rotate: [0, 5, -5, 0],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        delay: i * 0.2,
                        ease: "easeInOut",
                      }}
                    >
                      {s.icon}
                    </motion.div>
                    <motion.div
                      className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-1 sm:mb-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 + i * 0.1 }}
                    >
                      <span aria-hidden="true">{s.value}</span>
                      <span className="sr-only">
                        {s.value === "2K+" ? "Over 2000" : s.value} {s.label}
                      </span>
                    </motion.div>
                    <div className="text-blue-200/90 text-xs sm:text-sm md:text-base font-semibold mt-1">
                      {s.label}
                    </div>
                  </div>

                  {/* Shine effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.6 }}
                  />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        <Suspense fallback={null}>
          <YouTubeModal
            isOpen={isVideoOpen}
            onClose={() => setIsVideoOpen(false)}
          />
        </Suspense>
      </section>
    </>
  );
}
