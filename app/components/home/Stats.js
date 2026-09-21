'use client';

import { motion, useInView } from 'framer-motion';
import { Users, Clock, ShieldCheck, Star } from 'lucide-react';
import { useRef } from 'react';

const stats = [
  { 
    number: '2000+', 
    label: 'Happy Customers',
    icon: <Users className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-400" />,
    description: 'Satisfied drivers across the region',
    glow: 'rgba(34, 211, 238, 0.4)' // cyan-400
  },
  { 
    number: '5+', 
    label: 'Years Experience',
    icon: <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400" />,
    description: 'Perfecting the art of detailing',
    glow: 'rgba(96, 165, 250, 0.4)' // blue-400
  },
  { 
    number: '15+', 
    label: 'Expert Staff',
    icon: <ShieldCheck className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-400" />,
    description: 'Certified car care professionals',
    glow: 'rgba(129, 140, 248, 0.4)' // indigo-400
  },
  { 
    number: '4.9', 
    label: 'Average Rating',
    icon: <Star className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-400" />,
    description: 'From 2,500+ verified reviews',
    glow: 'rgba(250, 204, 21, 0.4)' // yellow-400
  }
];

export default function Stats() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="relative py-16 sm:py-24 bg-[#030712] overflow-hidden border-t border-white/5" ref={ref}>
      {/* Background Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              Driven by <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Excellence</span>
            </h2>
            <p className="text-gray-400 text-sm sm:text-base md:text-lg">
              Our numbers speak for themselves. We deliver unparalleled quality and care to every vehicle.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {stats.map((stat, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="group relative bg-white/5 backdrop-blur-md rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-white/10 hover:border-cyan-500/50 transition-all duration-300 flex flex-col items-center text-center"
            >
              {/* Dynamic Glow behind icon */}
              <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/0 to-cyan-500/5 rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>

              {/* Icon Container */}
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white/10 flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-500 border border-white/5 shadow-inner">
                {stat.icon}
              </div>

              {/* Number */}
              <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-1 sm:mb-2 tracking-tight group-hover:text-cyan-300 transition-colors">
                {stat.number}
              </div>

              {/* Label */}
              <h3 className="text-sm sm:text-base font-semibold text-gray-200 mb-2">
                {stat.label}
              </h3>

              {/* Separator */}
              <div className="h-0.5 w-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full mb-3 sm:mb-4 opacity-50 group-hover:w-12 group-hover:opacity-100 transition-all duration-300" />

              {/* Description */}
              <p className="text-xs sm:text-sm text-gray-400 leading-snug hidden sm:block">
                {stat.description}
              </p>

              {/* Mobile Description (Slightly shorter or just hidden if too cluttered, but block works) */}
              <p className="text-[10px] text-gray-400 leading-tight block sm:hidden mt-1">
                 {stat.description}
              </p>

              {stat.label === 'Average Rating' && (
                <div className="mt-3 flex justify-center items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star} 
                      className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]" 
                    />
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
