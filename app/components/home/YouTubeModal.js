'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function YouTubeModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
        animate={{ opacity: 1, backdropFilter: 'blur(8px)' }}
        exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-md"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.95, y: 20, opacity: 0 }}
          transition={{
            type: 'spring',
            damping: 25,
            stiffness: 500,
            delay: 0.1,
          }}
          className="relative w-full max-w-5xl bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="absolute -top-12 right-0 md:-right-12 z-10 p-2 text-white hover:text-gray-300 transition-colors"
            aria-label="Close video"
          >
            <X className="w-8 h-8" />
          </motion.button>

          <div className="relative aspect-video w-full">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
              <div className="animate-pulse">
                <div className="w-16 h-16 rounded-full bg-gray-700"></div>
              </div>
            </div>

            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/F9BLIcccTKA?autoplay=1&mute=0&controls=1&showinfo=0&rel=0&modestbranding=1"
              title="Premium Car Wash Service"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full absolute inset-0"
              loading="eager"
            />
          </div>

          <div className="p-4 sm:p-5 md:p-6 bg-gradient-to-r from-gray-900 to-black">
            <h3 className="text-lg sm:text-xl font-bold text-white mb-1">
              Vishal Car Wash Center
            </h3>
            <p className="text-gray-300 text-xs sm:text-sm">
              Professional car wash and detailing services for a spotless shine
              and lasting protection
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
