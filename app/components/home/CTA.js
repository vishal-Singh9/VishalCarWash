'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Sparkles, Car, ShieldCheck, Clock, ArrowRight } from 'lucide-react';

export function CTA() {
  return (
    <section className="relative py-28 overflow-hidden bg-gradient-to-br from-blue-700 via-blue-800 to-blue-900 text-white">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[url('/images/pattern-dots.svg')] bg-center"></div>
      </div>
      
      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-white/10 to-transparent"></div>
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white/10 to-transparent"></div>
      
      {/* Floating elements */}
      <motion.div 
        className="absolute top-1/4 left-1/4 w-16 h-16 rounded-full bg-blue-500/20 backdrop-blur-sm"
        animate={{
          y: [0, -20, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div 
        className="absolute top-1/3 right-1/4 w-10 h-10 rounded-full bg-cyan-400/20 backdrop-blur-sm"
        animate={{
          y: [0, 20, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />
      <motion.div 
        className="absolute bottom-1/4 right-1/3 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm"
        animate={{
          y: [0, -15, 0],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center justify-center mb-6"
          >
            <Sparkles className="w-6 h-6 text-yellow-400 mr-2" />
            <span className="text-yellow-400 font-medium">Premium Car Care</span>
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">
              Ready to Make Your Car Shine
            </span>
            <span className="inline-block">Like Never Before?</span>
          </h2>
          
          <p className="text-xl md:text-2xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed">
            Experience the difference of professional car care with our expert team and premium services.
            Book your appointment today and get ready to turn heads on the road!
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto"
            >
              <Link
                href="/booking"
                className="group relative w-full flex items-center justify-center px-8 py-5 bg-gradient-to-r from-yellow-400 to-amber-500 text-gray-900 font-bold rounded-xl text-lg shadow-lg hover:shadow-xl hover:shadow-yellow-500/20 transition-all duration-300 overflow-hidden"
              >
                <span className="relative z-10 flex items-center">
                  Book Your Appointment
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto"
            >
              <Link
                href="/services"
                className="group w-full flex items-center justify-center px-8 py-5 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-medium rounded-xl text-lg hover:bg-white/20 transition-colors duration-300"
              >
                <span className="relative z-10 flex items-center">
                  Explore Our Services
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            </motion.div>
          </div>
          
          <div className="mt-12 grid grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto pt-8 border-t border-white/10">
            {[
              { icon: <Car className="w-6 h-6 text-blue-300" />, text: 'Same Day Service' },
              { icon: <ShieldCheck className="w-6 h-6 text-blue-300" />, text: '100% Satisfaction' },
              { icon: <Clock className="w-6 h-6 text-blue-300" />, text: 'Quick & Efficient' },
            ].map((item, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + (index * 0.1), duration: 0.5 }}
                className="flex items-center justify-center space-x-2 text-blue-100"
              >
                {item.icon}
                <span className="font-medium">{item.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
