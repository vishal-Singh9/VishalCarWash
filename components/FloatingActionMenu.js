'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Car, X, Plus } from 'lucide-react';

export default function FloatingActionMenu({ onChatbotClick, onFeedbackClick, isChatOpen = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    function handleEscape(event) {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const handleChatbotClick = () => {
    setIsOpen(false);
    if (onChatbotClick) {
      onChatbotClick();
    }
  };

  const handleFeedbackClick = () => {
    setIsOpen(false);
    if (onFeedbackClick) {
      onFeedbackClick();
    }
  };

  return (
    <>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 2s ease-in-out infinite;
        }
      `}</style>
      
      <div ref={menuRef} className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 md:bottom-8 md:right-8 z-[100] transition-all duration-300 ${isChatOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <AnimatePresence>
          {/* Backdrop - Only show when menu is open */}
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[98]"
              style={{ pointerEvents: 'auto' }}
            />
          )}

          {/* Menu Items */}
          {isOpen && (
            <>
              {/* Chatbot Option */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: 0.1, type: 'spring', stiffness: 300, damping: 25 }}
                className="absolute bottom-full right-0 mb-3 flex items-center gap-2 z-[101]"
                style={{ pointerEvents: 'auto' }}
              >
                {/* Label Text */}
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 }}
                  className="bg-gray-900 text-white text-xs sm:text-sm font-semibold px-3 py-1.5 rounded-lg whitespace-nowrap shadow-lg"
                >
                  Chatbot
                </motion.span>
                {/* Button */}
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleChatbotClick();
                  }}
                  className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 active:scale-95 text-white rounded-full shadow-2xl flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-blue-500/50 transition-all duration-300 group animate-float"
                  aria-label="Open Chatbot"
                  style={{ transformOrigin: 'center bottom' }}
                >
                  <Car className="w-6 h-6 sm:w-7 sm:h-7 transition-transform group-hover:scale-110 group-active:scale-95" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full border-2 border-white animate-pulse shadow-lg" />
                </motion.button>
              </motion.div>

              {/* Feedback Option */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: 0.05, type: 'spring', stiffness: 300, damping: 25 }}
                className="absolute bottom-full right-0 mb-20 sm:mb-24 md:mb-28 flex items-center gap-2 z-[101]"
                style={{ pointerEvents: 'auto' }}
              >
                {/* Label Text */}
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-gray-900 text-white text-xs sm:text-sm font-semibold px-3 py-1.5 rounded-lg whitespace-nowrap shadow-lg"
                >
                  Add Feedback
                </motion.span>
                {/* Button */}
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFeedbackClick();
                  }}
                  className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-600 via-purple-500 to-pink-500 hover:from-purple-700 hover:to-pink-600 active:scale-95 text-white rounded-full shadow-2xl flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-purple-500/50 transition-all duration-300 group"
                  aria-label="Add Feedback"
                  style={{ transformOrigin: 'center bottom' }}
                >
                  <MessageSquare className="w-6 h-6 sm:w-7 sm:h-7 transition-transform group-hover:scale-110 group-active:scale-95" />
                </motion.button>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Main Plus Button */}
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
          className={`w-14 h-14 sm:w-16 sm:h-16 ${
            isOpen
              ? 'bg-gradient-to-br from-gray-600 via-gray-500 to-gray-700 hover:from-gray-700 hover:to-gray-800'
              : 'bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
          } text-white rounded-full shadow-2xl flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-blue-500/50 transition-all duration-300 relative z-[101]`}
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
          style={{ pointerEvents: 'auto' }}
        >
          <motion.div
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="flex items-center justify-center"
          >
            {isOpen ? (
              <X className="w-6 h-6 sm:w-7 sm:h-7" strokeWidth={2.5} />
            ) : (
              <Plus className="w-6 h-6 sm:w-7 sm:h-7" strokeWidth={2.5} />
            )}
          </motion.div>
        </motion.button>
      </div>
    </>
  );
}

