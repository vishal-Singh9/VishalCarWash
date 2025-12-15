"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

/* ------------------ Constants ------------------ */

const stats = [
  { value: "2K+", label: "Happy Customers" },
  { value: "5+", label: "Years Experience" },
  { value: "15+", label: "Expert Staff" },
  { value: "100%", label: "Satisfaction" },
];

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <motion.div
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5 }}
          className="w-full h-full"
        >
          <Image
            src="https://images.pexels.com/photos/3354647/pexels-photo-3354647.jpeg"
            alt="Professional car wash service"
            fill
            priority
            className="object-cover"
          />
        </motion.div>

        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 via-blue-900/70 to-slate-900/90" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <motion.div
            {...fadeUp}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100/20 backdrop-blur-sm mb-6"
          >
            <span className="h-2 w-2 bg-blue-400 rounded-full mr-2" />
            <span className="text-blue-100 text-sm font-medium">
              Professional Car Care Since 2010
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
          >
            Premium <span className="text-blue-400">Car Care</span>
            <br className="hidden sm:block" />
            For Your Vehicle
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto mb-10"
          >
            Experience the ultimate care for your vehicle with our professional
            cleaning and detailing services. We bring back that showroom shine
            to your car.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link href="/booking" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg font-semibold rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg">
                Book Appointment Now
                <svg
                  className="h-5 w-5 ml-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                  />
                </svg>
              </Button>
            </Link>

            <Link href="/services" className="w-full sm:w-auto">
              <Button
                variant="outline"
                className="w-full sm:w-auto bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-6 text-lg font-semibold rounded-full transition-all duration-300 transform hover:scale-105"
              >
                <Play className="w-5 h-5 mr-2" />
                Watch Video
              </Button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 pt-8 border-t border-blue-200/20"
          >
            {stats.map(({ value, label }) => (
              <div key={label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white">
                  {value}
                </div>
                <div className="text-sm text-blue-100 font-medium">
                  {label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
