'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star,
  Send,
  CheckCircle,
  XCircle,
  MessageSquare,
  User,
  Mail as MailIcon,
  ArrowRight,
  ThumbsUp,
  Heart,
  Sparkles,
} from 'lucide-react';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export default function Feedback() {
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
    { value: 'service', label: 'Service Quality', icon: ThumbsUp },
    { value: 'quality', label: 'Wash Quality', icon: Sparkles },
    { value: 'staff', label: 'Staff Behavior', icon: User },
    { value: 'pricing', label: 'Pricing', icon: Star },
    { value: 'overall', label: 'Overall Experience', icon: Heart },
    { value: 'other', label: 'Other', icon: MessageSquare },
  ];

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.rating) newErrors.rating = 'Please select a rating';
    if (!formData.review.trim()) newErrors.review = 'Review is required';

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
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit review');
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
        // category: 'overall',
        review: '',
      });

      // Clear success message after 5 seconds
      setTimeout(() => {
        setSubmitStatus({ success: false, message: '' });
      }, 5000);
    } catch (error) {
      console.error('Error submitting review:', error);
      setSubmitStatus({
        success: false,
        message: error.message || 'Failed to submit review. Please try again.',
      });

      // Clear error message after 5 seconds
      setTimeout(() => {
        setSubmitStatus({ success: false, message: '' });
      }, 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <motion.div
          className="absolute -right-20 -top-20 w-96 h-96 bg-blue-500/10 rounded-full mix-blend-overlay filter blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            x: [0, 20, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute -left-20 -bottom-20 w-96 h-96 bg-purple-500/10 rounded-full mix-blend-overlay filter blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            x: [0, -20, 0],
            y: [0, 20, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 5,
          }}
        />
      </div>

      {/* Hero Section */}
      <section className="relative py-24 md:py-32 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/30"></div>
          <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/380768/pexels-photo-380768.jpeg')] bg-cover bg-center opacity-20"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeInUp}
            className="text-center"
          >
            <motion.span
              className="inline-block px-5 py-2.5 text-sm font-semibold text-blue-400 bg-blue-900/30 backdrop-blur-sm rounded-full border border-blue-800/30 mb-5"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              We Value Your Opinion
            </motion.span>
            <motion.h1
              className="text-4xl md:text-6xl font-bold mb-5 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Share Your Review
            </motion.h1>
            <motion.p
              className="text-xl text-blue-100 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Help us serve you better! Your review helps us improve our
              services and create a better experience for everyone.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Feedback Form Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-4">
          <motion.div
            className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {/* Decorative top gradient */}
            <div className="p-1 bg-gradient-to-r from-blue-500 to-indigo-600"></div>

            <div className="p-8 md:p-10">
              <div className="flex items-center mb-8">
                <div className="p-3 bg-blue-50 rounded-xl mr-4">
                  <MessageSquare className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Tell Us What You Think
                </h3>
              </div>

              {/* Success/Error Messages */}
              <AnimatePresence>
                {submitStatus.message && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`mb-6 p-4 rounded-lg flex items-center ${
                      submitStatus.success
                        ? 'bg-green-50 text-green-700 border border-green-200'
                        : 'bg-red-50 text-red-700 border border-red-200'
                    }`}
                  >
                    {submitStatus.success ? (
                      <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                    )}
                    <span className="text-sm">{submitStatus.message}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name and Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Your Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border ${
                          errors.name
                            ? 'border-red-300 focus:ring-red-500'
                            : 'border-gray-200 focus:ring-2 focus:ring-blue-500'
                        } focus:border-blue-500 transition-all duration-200`}
                        placeholder="John Doe"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                    {errors.name && (
                      <p className="text-xs text-red-600 mt-1">{errors.name}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Your Email <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <MailIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border ${
                          errors.email
                            ? 'border-red-300 focus:ring-red-500'
                            : 'border-gray-200 focus:ring-2 focus:ring-blue-500'
                        } focus:border-blue-500 transition-all duration-200`}
                        placeholder="your.email@example.com"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-xs text-red-600 mt-1">{errors.email}</p>
                    )}
                  </div>
                </div>

                {/* Rating */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Your Rating <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center space-x-2" id="rating">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className="group p-1"
                        onClick={() => handleRatingChange(star)}
                        onMouseEnter={() => setHoveredStar(star)}
                        onMouseLeave={() => setHoveredStar(0)}
                        disabled={isSubmitting}
                      >
                        <Star
                          className={`w-8 h-8 transition-all duration-200 ${
                            (hoveredStar || formData.rating) >= star
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300 hover:text-yellow-300'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="ml-2 text-sm font-medium text-gray-500">
                      {formData.rating
                        ? `${formData.rating} out of 5`
                        : 'Rate us'}
                    </span>
                  </div>
                  {errors.rating && (
                    <p className="text-xs text-red-600">{errors.rating}</p>
                  )}
                </div>

                {/* Category */}
                {/* <div className="space-y-2">
                  <label
                    htmlFor="category"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Feedback Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  >
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div> */}

                {/* Feedback */}
                <div className="space-y-1">
                  <label
                    htmlFor="review"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Your Review <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <textarea
                      id="review"
                      name="review"
                      rows="4"
                      value={formData.review}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                        errors.review
                          ? 'border-red-300 focus:ring-red-500'
                          : 'border-gray-200 focus:ring-2 focus:ring-blue-500'
                      } focus:border-blue-500 transition-all duration-200 resize-none`}
                      placeholder="Share your detailed review with us..."
                      required
                      disabled={isSubmitting}
                    ></textarea>
                  </div>
                  {errors.review && (
                    <p className="text-xs text-red-600">{errors.review}</p>
                  )}
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting || !formData.rating}
                    className={`w-full group relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium py-3.5 px-6 rounded-lg hover:shadow-lg hover:shadow-blue-100 transition-all duration-300 flex items-center justify-center space-x-2 ${
                      isSubmitting || !formData.rating
                        ? 'opacity-70 cursor-not-allowed'
                        : 'hover:opacity-90'
                    }`}
                  >
                    <span className="relative z-10">
                      {isSubmitting ? 'Submitting...' : 'Submit Review'}
                    </span>
                    {!isSubmitting && (
                      <>
                        <ArrowRight className="w-5 h-5 relative z-10 transition-transform group-hover:translate-x-1" />
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            <div className="px-8 py-4 bg-gray-50 border-t border-gray-100 text-center">
              <p className="text-sm text-gray-500">
                Your review helps us improve our services. Thank you for your
                time!
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why Feedback Matters Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Your Review Matters
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Every piece of review helps us understand what we&apos;re doing
              right and where we can improve.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: ThumbsUp,
                title: 'Improve Service Quality',
                description:
                  'Your review helps us identify areas of improvement and deliver better service.',
              },
              {
                icon: Heart,
                title: 'Build Trust',
                description:
                  'Honest review helps other customers make informed decisions about our services.',
              },
              {
                icon: Sparkles,
                title: 'Shape Our Future',
                description:
                  'Your suggestions guide our development and help us create services you love.',
              },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl border border-gray-100 hover:shadow-lg transition-shadow duration-200"
                >
                  <div className="p-3 bg-blue-50 rounded-xl w-fit mb-4">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

