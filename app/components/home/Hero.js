"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Play, X } from "lucide-react";

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

/* ------------------ Video Modal ------------------ */
const YouTubeModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
        animate={{
          opacity: 1,
          backdropFilter: "blur(8px)",
          transition: { duration: 0.3 },
        }}
        exit={{
          opacity: 0,
          backdropFilter: "blur(0px)",
          transition: { duration: 0.2 },
        }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-md"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, y: 20, opacity: 0 }}
          animate={{
            scale: 1,
            y: 0,
            opacity: 1,
            transition: {
              type: "spring",
              damping: 25,
              stiffness: 500,
              delay: 0.1,
            },
          }}
          exit={{
            scale: 0.95,
            y: 20,
            opacity: 0,
            transition: { duration: 0.2 },
          }}
          className="relative w-full max-w-5xl bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="absolute -top-12 right-0 md:-right-12 z-10 p-2 text-white hover:text-gray-300 transition-colors"
            aria-label="Close video"
          >
            <X className="w-8 h-8" />
          </motion.button>

          {/* Video Container */}
          <div className="relative aspect-video w-full">
            {/* Loading Skeleton */}
            <motion.div
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              transition={{ delay: 0.5, duration: 0.3 }}
              className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center"
            >
              <div className="animate-pulse flex space-x-4 items-center">
                <div className="w-16 h-16 rounded-full bg-gray-700"></div>
              </div>
            </motion.div>

            {/* Video Iframe */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="w-full h-full"
            >
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/F9BLIcccTKA?autoplay=1&mute=0&controls=1&showinfo=0&rel=0&modestbranding=1"
                title="Premium Car Wash Service"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
                loading="eager"
              ></iframe>
            </motion.div>
          </div>

          {/* Video Info */}
          <div className="p-4 md:p-6 bg-gradient-to-r from-gray-900 to-black">
            <h3 className="text-xl font-bold text-white mb-1">
              {" "}
              Vishal Car Wash Center
            </h3>
            <p className="text-gray-300 text-sm">
              {" "}
              Professional car wash and detailing services for a spotless shine
              and lasting protection
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

/* ------------------ Hero ------------------ */
export default function Hero() {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  return (
    <section className="relative min-h-screen overflow-hidden flex items-center">
      {/* Background */}
      <motion.div
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2 }}
        className="absolute inset-0"
      >
        <Image
          src="/images/premium.webp"
          alt="Car Wash"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-950/90 via-blue-900/70 to-black/90" />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
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
            className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-6"
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
            className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto mb-10"
          >
            Experience the ultimate care for your vehicle with our professional
            cleaning and detailing services. We bring back that showroom shine
            to your car.
          </motion.p>

          {/* CTA */}
          <motion.div
            variants={fadeUp}
            className="flex flex-col sm:flex-row gap-5 justify-center mb-16"
          >
            <Link href="/booking" className="w-full sm:w-auto">
              {" "}
              <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg font-semibold rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg">
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
              className="w-full sm:w-auto bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-6 text-lg font-semibold rounded-full transition-all duration-300 transform hover:scale-105 cursor-pointer"
            >
              {" "}
              <Play className="w-5 h-5 mr-2" /> Watch Video{" "}
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={stagger}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {stats.map((s, i) => (
              <motion.div
                key={i}
                variants={statItem}
                whileHover={{ y: -8, scale: 1.03 }}
                className="rounded-2xl p-6 bg-white/10 backdrop-blur-xl border border-white/20 hover:border-blue-400/40 transition"
              >
                <div className="text-4xl mb-2">{s.icon}</div>
                <div className="text-3xl font-bold text-white">{s.value}</div>
                <div className="text-blue-200 text-sm mt-1">{s.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      <YouTubeModal
        isOpen={isVideoOpen}
        onClose={() => setIsVideoOpen(false)}
      />
    </section>
  );
}
