"use client";

import { useState, useEffect, lazy, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Head from "next/head";
import { Button } from "@/components/ui/button";
import { Play, Sparkles, ArrowRight, Star, Shield, Clock, MapPin } from "lucide-react";

const YouTubeModal = lazy(() => import("./YouTubeModal"));

/* ------------------ Variants ------------------ */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
};

const fadeLeft = {
  hidden: { opacity: 0, x: 30 },
  show: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};

const floatAnimation = {
  y: [-10, 10, -10],
  transition: {
    duration: 6,
    repeat: Infinity,
    ease: "easeInOut",
  },
};

const HERO_IMAGES = [
  "/images/premium.webp",
  "/images/carspa.webp",
  "/images/detailing.webp",
  "/images/cermaic.webp"
];

export default function Hero() {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 4000); // Change image every 4 seconds
    return () => clearInterval(timer);
  }, []);

  const seoTitle = "Premium Car Wash & Detailing Services | Vishal Car Wash";
  const seoDescription = "Professional car wash, detailing, and maintenance services. Book online for premium car care with expert technicians. 2K+ happy customers served!";
  const canonicalUrl = "https://vishal-car-wash.vercel.app/";

  return (
    <>
      <Head>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
        <link rel="canonical" href={canonicalUrl} />
      </Head>

      <section className="relative min-h-[100svh] overflow-hidden bg-[#030712] pt-28 pb-16 lg:pt-32 lg:pb-24 flex items-center">
        {/* Modern Background Effects */}
        <div className="absolute inset-0 w-full h-full">
          {/* Animated Gradient Meshes */}
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[-20%] left-[-10%] w-[50%] h-[60%] rounded-full bg-blue-600/30 blur-[120px]"
          />
          <motion.div
            animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[70%] rounded-full bg-cyan-500/20 blur-[120px]"
          />
          <motion.div
            animate={{ x: [-50, 50, -50], y: [-50, 50, -50] }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute top-[20%] left-[40%] w-[40%] h-[40%] rounded-full bg-indigo-500/20 blur-[100px]"
          />
          
          {/* Grid overlay for texture */}
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-10"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            
            {/* Left Content Area */}
            <motion.div
              variants={stagger}
              initial="hidden"
              animate="show"
              className="max-w-2xl mx-auto lg:mx-0 text-center lg:text-left pt-10 lg:pt-0"
            >
              {/* Premium Badge */}
              <motion.div
                variants={fadeUp}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8 hover:bg-white/10 transition-colors"
              >
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
                </span>
                <span className="text-sm font-medium text-blue-200">
                  Varanasi&apos;s #1 Premium Car Care
                </span>
              </motion.div>

              {/* Main Headline */}
              <motion.h1
                variants={fadeUp}
                className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.1]"
              >
                Revive Your Car&apos;s{" "}
                <span className="relative whitespace-nowrap">
                  <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                    Showroom Shine
                  </span>
                  <motion.span
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 1, duration: 0.8, ease: "easeOut" }}
                    className="absolute -bottom-2 left-0 w-full h-3 bg-blue-600/30 -z-10 rounded-full"
                    style={{ originX: 0 }}
                  ></motion.span>
                </span>
              </motion.h1>

              {/* Subheadline */}
              <motion.p
                variants={fadeUp}
                className="text-lg sm:text-xl text-gray-300 mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed"
              >
                Experience the ultimate detailing and protection services. We combine expert craftsmanship with cutting-edge technology to make your vehicle immaculate.
              </motion.p>

              {/* CTAs */}
              <motion.div
                variants={fadeUp}
                className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start mb-12"
              >
                <Link href="/booking" className="w-full sm:w-auto">
                  <Button className="w-full sm:w-auto h-14 px-8 bg-white text-gray-900 hover:bg-gray-100 rounded-full text-base font-bold transition-transform hover:scale-105 group shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]">
                    Book Appointment
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                
                <Button
                  onClick={() => setIsVideoOpen(true)}
                  variant="outline"
                  className="w-full sm:w-auto h-14 px-8 bg-white/5 border-white/20 text-white hover:bg-white/10 rounded-full text-base font-bold backdrop-blur-sm transition-transform hover:scale-105 group"
                >
                  <Play className="mr-2 w-5 h-5 group-hover:text-cyan-400 transition-colors" />
                  See How We Work
                </Button>
              </motion.div>

              {/* Trust Indicators */}
              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 pt-4 border-t border-white/10">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-[#030712] bg-gray-600 overflow-hidden flex items-center justify-center relative">
                       <Image src={`/images/premium.webp`} alt="Customer" fill className="object-cover opacity-80" />
                    </div>
                  ))}
                  <div className="w-10 h-10 rounded-full border-2 border-[#030712] bg-blue-600 flex items-center justify-center text-xs font-bold text-white z-10">
                    2K+
                  </div>
                </div>
                <div className="text-sm">
                  <div className="flex items-center gap-1 mb-1 justify-center lg:justify-start">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                    ))}
                  </div>
                  <span className="text-gray-400">Loved by 2,000+ drivers</span>
                </div>
              </motion.div>

            </motion.div>

            {/* Right Image/Graphic Area - Image Slider */}
            <motion.div
              initial="hidden"
              animate="show"
              variants={fadeLeft}
              className="relative w-full h-[350px] sm:h-[450px] lg:h-[600px] mt-10 lg:mt-0 block"
            >
              {/* Floating feature cards */}
              <motion.div 
                animate={floatAnimation}
                className="absolute top-4 sm:top-10 -left-2 sm:-left-10 z-20 bg-white/10 backdrop-blur-xl border border-white/20 p-3 sm:p-4 rounded-2xl shadow-2xl flex items-center gap-3 sm:gap-4"
              >
                <div className="bg-cyan-500/20 p-2 sm:p-3 rounded-xl text-cyan-400">
                  <Shield className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <p className="text-white font-bold text-xs sm:text-sm">Ceramic Coating</p>
                  <p className="text-white text-[10px] sm:text-xs">5 Years Protection</p>
                </div>
              </motion.div>

              <motion.div 
                animate={{...floatAnimation, transition: { ...floatAnimation.transition, delay: 1.5 }}}
                className="absolute bottom-16 sm:bottom-20 -right-2 sm:-right-4 z-20 bg-white/10 backdrop-blur-xl border border-white/20 p-3 sm:p-4 rounded-2xl shadow-2xl flex items-center gap-3 sm:gap-4"
              >
                <div className="bg-blue-500/20 p-2 sm:p-3 rounded-xl text-blue-400">
                  <Clock className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <p className="text-white font-bold text-xs sm:text-sm">Express Wash</p>
                  <p className="text-white text-[10px] sm:text-xs">Under 30 Minutes</p>
                </div>
              </motion.div>

              {/* Main Image Container */}
              <div className="relative w-full h-full rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden border border-white/10 shadow-[0_0_80px_-20px_rgba(59,130,246,0.3)]">
                
                <AnimatePresence mode="popLayout">
                  <motion.div
                    key={currentImageIndex}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={HERO_IMAGES[currentImageIndex]}
                      alt="Premium Car Detailing"
                      fill
                      className="object-cover"
                      priority={currentImageIndex === 0}
                    />
                  </motion.div>
                </AnimatePresence>

                <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-transparent to-transparent opacity-80" />
                <div className="absolute inset-0 bg-blue-500/10 mix-blend-overlay" />
                
                {/* Image Slider Indicators */}
                <div className="absolute bottom-20 left-0 right-0 flex justify-center gap-2 z-20">
                  {HERO_IMAGES.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        idx === currentImageIndex ? "w-8 bg-cyan-400" : "w-3 bg-white/30"
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>

                {/* Location overlay */}
                <div className="absolute bottom-4 sm:bottom-6 left-4 right-4 sm:left-6 sm:right-6 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-0 z-20">
                   <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-white/10 w-full sm:w-auto justify-center sm:justify-start">
                     <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400" />
                     <span className="text-white text-xs sm:text-sm font-medium">Varanasi, UP</span>
                   </div>
                   <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-white/10 w-full sm:w-auto justify-center sm:justify-start">
                     <span className="text-white text-xs sm:text-sm font-medium">Open Today until 8 PM</span>
                   </div>
                </div>
              </div>
            </motion.div>

          </div>
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
