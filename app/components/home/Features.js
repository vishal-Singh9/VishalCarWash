'use client';

import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useState } from 'react';

export default function Features() {
  const features = [
    {
      emoji: '✨',
      title: 'Professional Quality',
      description: 'Expert team with years of experience in car detailing',
      color: 'from-purple-500 to-pink-500',
      iconBg: 'bg-gradient-to-br from-purple-500 to-pink-500'
    },
    {
      emoji: '⚡',
      title: 'Lightning Fast',
      description: 'Express service that saves your valuable time',
      color: 'from-yellow-400 to-orange-500',
      iconBg: 'bg-gradient-to-br from-yellow-400 to-orange-500'
    },
    {
      emoji: '🌱',
      title: 'Eco-Conscious',
      description: 'Eco-friendly products that protect your car & planet',
      color: 'from-green-400 to-teal-500',
      iconBg: 'bg-gradient-to-br from-green-400 to-teal-500'
    },
    {
      emoji: '💎',
      title: 'Premium Shine',
      description: 'Showroom-worthy results every single time',
      color: 'from-blue-400 to-cyan-500',
      iconBg: 'bg-gradient-to-br from-blue-400 to-cyan-500'
    },
    {
      emoji: '🛡️',
      title: 'Paint Protection',
      description: 'Advanced ceramic coatings for lasting shine',
      color: 'from-indigo-500 to-purple-600',
      iconBg: 'bg-gradient-to-br from-indigo-500 to-purple-600'
    },
    {
      emoji: '🧼',
      title: 'Deep Clean',
      description: 'Thorough cleaning in every nook and cranny',
      color: 'from-cyan-400 to-blue-500',
      iconBg: 'bg-gradient-to-br from-cyan-400 to-blue-500'
    },
    {
      emoji: '🧽',
      title: 'Stain Removal',
      description: 'Tough stains don\'t stand a chance',
      color: 'from-red-400 to-pink-500',
      iconBg: 'bg-gradient-to-br from-red-400 to-pink-500'
    },
    {
      emoji: '🌟',
      title: '5-Star Service',
      description: 'Thousands of satisfied customers and counting',
      color: 'from-amber-400 to-yellow-500',
      iconBg: 'bg-gradient-to-br from-amber-400 to-yellow-500'
    }
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.9
    },
    show: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: { 
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.6
      } 
    }
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.8
      }
    }
  };

  return (
    <section className="relative py-16 sm:py-20 md:py-24 lg:py-28 overflow-hidden bg-gradient-to-b from-gray-50 via-white to-gray-50">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          className="text-center mb-12 sm:mb-16 md:mb-20"
          variants={headerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
        >
          <motion.span 
            className="inline-block mb-4 sm:mb-5 px-4 sm:px-5 py-2 text-xs sm:text-sm font-semibold text-blue-600 bg-blue-50 border border-blue-100 rounded-full shadow-sm"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            Our Advantages 🎯
          </motion.span>
          <motion.h2 
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-5 md:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Why Choose Us?
          </motion.h2>
          <motion.p 
            className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed px-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Experience the perfect blend of innovation, care, and expertise for your beloved vehicle
          </motion.p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6 lg:gap-8"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
        >
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function FeatureCard({ feature, index }) {
  const [isHovered, setIsHovered] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 500, damping: 100 });
  const mouseYSpring = useSpring(y, { stiffness: 500, damping: 100 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct * 20);
    y.set(yPct * 20);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  return (
    <motion.div
      variants={{
        hidden: { 
          opacity: 0, 
          y: 30,
          scale: 0.9
        },
        show: { 
          opacity: 1, 
          y: 0,
          scale: 1,
          transition: { 
            type: "spring",
            stiffness: 100,
            damping: 15,
            duration: 0.6,
            delay: index * 0.08
          } 
        }
      }}
      className="group relative h-full"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* Glow effect */}
      <div className={`absolute -inset-0.5 bg-gradient-to-br ${feature.color} rounded-3xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500`}></div>
      
      {/* Main card */}
      <div className="relative h-full bg-white/80 backdrop-blur-sm p-5 sm:p-6 md:p-7 rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100/50 group-hover:border-transparent transition-all duration-500 overflow-hidden">
        {/* Animated gradient background */}
        <motion.div 
          className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 rounded-2xl sm:rounded-3xl transition-opacity duration-500`}
          animate={isHovered ? { scale: 1.1 } : { scale: 1 }}
          transition={{ duration: 0.5 }}
        ></motion.div>

        {/* Shine effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
          style={{ transform: `translateX(${mouseXSpring}px) translateY(${mouseYSpring}px)` }}
        ></motion.div>

        <div className="relative z-10">
          {/* Icon container with enhanced animation */}
          <motion.div 
            className={`w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 mb-4 sm:mb-5 md:mb-6 rounded-xl sm:rounded-2xl flex items-center justify-center text-2xl sm:text-3xl md:text-4xl ${feature.iconBg} text-white shadow-lg group-hover:shadow-xl relative overflow-hidden`}
            whileHover={{ 
              scale: 1.1,
              rotate: [0, -5, 5, -5, 0],
            }}
            transition={{ 
              scale: { type: "spring", stiffness: 400, damping: 17 },
              rotate: { duration: 0.5 }
            }}
          >
            {/* Icon glow */}
            <motion.div
              className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-50 blur-md`}
              animate={isHovered ? { scale: 1.5 } : { scale: 1 }}
              transition={{ duration: 0.3 }}
            ></motion.div>
            <span className="relative z-10">{feature.emoji}</span>
          </motion.div>

          {/* Title */}
          <motion.h3 
            className="text-lg sm:text-xl md:text-2xl font-bold mb-2 sm:mb-3 text-gray-900 group-hover:text-gray-800 transition-colors duration-300"
            whileHover={{ x: 2 }}
          >
            {feature.title}
          </motion.h3>

          {/* Description */}
          <motion.p 
            className="text-sm sm:text-base text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300"
            initial={{ opacity: 0.8 }}
            whileHover={{ opacity: 1 }}
          >
            {feature.description}
          </motion.p>

          {/* Decorative element */}
          <motion.div
            className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
            initial={{ scaleX: 0 }}
            whileHover={{ scaleX: 1 }}
            transition={{ duration: 0.5 }}
            style={{ transformOrigin: "left" }}
          ></motion.div>
        </div>
      </div>
    </motion.div>
  );
}
