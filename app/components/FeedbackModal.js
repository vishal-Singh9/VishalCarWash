'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Star,
  Send,
  MessageSquare,
  User,
  Mail as MailIcon,
  CheckCircle,
  XCircle,
  Heart,
  Sparkles,
} from 'lucide-react';

export default function FeedbackModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rating: 0,
    // category: 'overall',
    review: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ success: false, message: '' });
  const [hoveredStar, setHoveredStar] = useState(0);

  const categories = [
    { value: 'service', label: 'Service Quality' },
    { value: 'quality', label: 'Wash Quality' },
    { value: 'staff', label: 'Staff Behavior' },
    { value: 'pricing', label: 'Pricing' },
    { value: 'overall', label: 'Overall Experience' },
    { value: 'other', label: 'Other' },
  ];

  // Handle auth state changes (login/logout)
  useEffect(() => {
    const handleAuthChange = (e) => {
      if (e.detail && e.detail.isAuthenticated === false) {
        // User logged out, clear the session storage
        sessionStorage.removeItem('feedbackModalShown');
      } else if (e.detail && e.detail.isAuthenticated === true) {
        // User logged in, show the modal if not shown before
        const modalShown = sessionStorage.getItem('feedbackModalShown');
        if (!modalShown) {
          setIsOpen(true);
          setHasShown(true);
          sessionStorage.setItem('feedbackModalShown', 'true');
        }
      }
    };

    // Listen for auth state changes
    window.addEventListener('auth', handleAuthChange);

    // Clean up event listener
    return () => {
      window.removeEventListener('auth', handleAuthChange);
    };
  }, []);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.rating) newErrors.rating = 'Please select a rating';
    if (!formData.review.trim()) newErrors.review = 'Feedback is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleRatingChange = (rating) => {
    setFormData((prev) => ({ ...prev, rating }));
    if (errors.rating) {
      setErrors((prev) => ({ ...prev, rating: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitStatus({ success: false, message: '' });

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit review.');
      }

      setSubmitStatus({
        success: true,
        message: 'Thank you for your review! We truly appreciate your time.',
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        rating: 0,
        category: 'overall',
        review: '',
      });

      // Set session storage when review is successfully submitted
      sessionStorage.setItem('feedbackModalShown', 'true');

      // Close modal after 3 seconds
      setTimeout(() => {
        setIsOpen(false);
      }, 3000);
    } catch (error) {
      console.error('Error submitting review:', error);
      setSubmitStatus({
        success: false,
        message: error.message || 'Failed to submit review. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    // Set the session storage when modal is closed
    sessionStorage.setItem('feedbackModalShown', 'true');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 z-10 p-2 bg-white/90 hover:bg-white rounded-full shadow-md transition-all duration-200 hover:rotate-90"
                aria-label="Close review modal"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>

              {/* Decorative top gradient */}
              <div className="p-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>

              <div className="p-6 overflow-y-auto max-h-[calc(90vh-8px)]">
                {/* Header */}
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full mb-4">
                    <Heart className="w-8 h-8 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    We&apos;d Love Your Review!
                  </h2>
                  <p className="text-gray-600 text-sm">
                    Help us improve by sharing your experience with our service.
                  </p>
                </div>

                {/* Success/Error Messages */}
                <AnimatePresence>
                  {submitStatus.message && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={`mb-4 p-3 rounded-lg flex items-center text-sm ${
                        submitStatus.success
                          ? 'bg-green-50 text-green-700 border border-green-200'
                          : 'bg-red-50 text-red-700 border border-red-200'
                      }`}
                    >
                      {submitStatus.success ? (
                        <CheckCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                      )}
                      <span className="text-xs">{submitStatus.message}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Form */}
                {!submitStatus.success && (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name */}
                    <div>
                      <label
                        htmlFor="modal-name"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Your Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          id="modal-name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-4 py-2 text-sm rounded-lg border ${
                            errors.name
                              ? 'border-red-300 focus:ring-red-500'
                              : 'border-gray-200 focus:ring-2 focus:ring-blue-500'
                          } focus:border-blue-500 transition-all duration-200`}
                          placeholder="John Doe"
                          disabled={isSubmitting}
                        />
                      </div>
                      {errors.name && (
                        <p className="text-xs text-red-600 mt-1">{errors.name}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label
                        htmlFor="modal-email"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Your Email <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <MailIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="email"
                          id="modal-email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-4 py-2 text-sm rounded-lg border ${
                            errors.email
                              ? 'border-red-300 focus:ring-red-500'
                              : 'border-gray-200 focus:ring-2 focus:ring-blue-500'
                          } focus:border-blue-500 transition-all duration-200`}
                          placeholder="your.email@example.com"
                          disabled={isSubmitting}
                        />
                      </div>
                      {errors.email && (
                        <p className="text-xs text-red-600 mt-1">{errors.email}</p>
                      )}
                    </div>

                    {/* Rating */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Your Rating <span className="text-red-500">*</span>
                      </label>
                      <div className="flex items-center space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => handleRatingChange(star)}
                            onMouseEnter={() => setHoveredStar(star)}
                            onMouseLeave={() => setHoveredStar(0)}
                            disabled={isSubmitting}
                            className="p-1"
                          >
                            <Star
                              className={`w-7 h-7 transition-all duration-200 ${
                                (hoveredStar || formData.rating) >= star
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300 hover:text-yellow-300'
                              }`}
                            />
                          </button>
                        ))}
                        <span className="ml-2 text-xs font-medium text-gray-500">
                          {formData.rating
                            ? `${formData.rating} out of 5`
                            : 'Rate us'}
                        </span>
                      </div>
                      {errors.rating && (
                        <p className="text-xs text-red-600 mt-1">{errors.rating}</p>
                      )}
                    </div>

                    {/* Category */}
                    {/* <div>
                      <label
                        htmlFor="modal-category"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Category
                      </label>
                      <select
                        id="modal-category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        disabled={isSubmitting}
                        className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      >
                        {categories.map((cat) => (
                          <option key={cat.value} value={cat.value}>
                            {cat.label}
                          </option>
                        ))}
                      </select>
                    </div> */}

                    {/* Feedback */}
                    <div>
                      <label
                        htmlFor="modal-feedback"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Your Review <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <textarea
                          id="modal-feedback"
                          name="review"
                          rows="3"
                          value={formData.review}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                            errors.review
                              ? 'border-red-300 focus:ring-red-500'
                              : 'border-gray-200 focus:ring-2 focus:ring-blue-500'
                          } focus:border-blue-500 transition-all duration-200 resize-none text-sm`}
                          placeholder="Tell us what you think..."
                          disabled={isSubmitting}
                        ></textarea>
                      </div>
                      {errors.review && (
                        <p className="text-xs text-red-600 mt-1">{errors.review}</p>
                      )}
                    </div>

                    {/* Submit Button */}
                    <div className="flex gap-3 pt-2">
                      <button
                        type="button"
                        onClick={handleClose}
                        className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                        disabled={isSubmitting}
                      >
                        Maybe Later
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting || !formData.rating}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg transition-all duration-200 ${
                          isSubmitting || !formData.rating
                            ? 'opacity-70 cursor-not-allowed'
                            : 'hover:shadow-md'
                        }`}
                      >
                        {isSubmitting ? (
                          'Submitting...'
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            Submit
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

