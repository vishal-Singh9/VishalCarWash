'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Star, ChevronRight, ArrowRight, Quote, MessageSquare, Briefcase, MessageCircle, User } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const stories = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Car Enthusiast',
    image: '/images/avatar1.jpg',
    rating: 5,
    content: 'The best car wash service I\'ve ever experienced! My car looks brand new after every visit. The attention to detail is incredible.',
    date: '2 weeks ago',
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-50'
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Daily Commuter',
    image: '/images/avatar2.jpg',
    rating: 5,
    content: 'As someone who drives a lot for work, keeping my car clean is important. This service saves me so much time and the results are consistently excellent.',
    date: '1 month ago',
    color: 'from-emerald-500 to-teal-600',
    bgColor: 'bg-emerald-50'
  },
  {
    id: 3,
    name: 'Emma Williams',
    role: 'Luxury Car Owner',
    image: '/images/avatar3.jpg',
    rating: 5,
    content: 'I was skeptical at first, but they treated my car with the utmost care. The team is professional and the results speak for themselves.',
    date: '3 weeks ago',
    color: 'from-purple-500 to-indigo-600',
    bgColor: 'bg-purple-50'
  },
  {
    id: 4,
    name: 'David Kim',
    role: 'Fleet Manager',
    image: '/images/avatar4.jpg',
    rating: 5,
    content: 'We use their service for our entire company fleet. Reliable, professional, and always on time. Highly recommended!',
    date: '2 months ago',
    color: 'from-amber-500 to-orange-600',
    bgColor: 'bg-amber-50'
  },
  {
    id: 5,
    name: 'Jessica Lee',
    role: 'Car Collector',
    image: '/images/avatar5.jpg',
    rating: 5,
    content: 'I have several classic cars and I trust no one else with them. Their attention to detail is unmatched in the industry.',
    date: '1 week ago',
    color: 'from-rose-500 to-pink-600',
    bgColor: 'bg-pink-50'
  },
  {
    id: 6,
    name: 'Robert Taylor',
    role: 'Business Owner',
    image: '/images/avatar6.jpg',
    rating: 5,
    content: 'The mobile service is a game changer for our business. They come to our office and service all our company vehicles on-site.',
    date: '3 days ago',
    color: 'from-cyan-500 to-blue-600',
    bgColor: 'bg-cyan-50'
  }
];

const StarRating = ({ rating, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star 
          key={star} 
          className={`${sizeClasses[size]} ${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} 
        />
      ))}
    </div>
  );
};

const TestimonialCard = ({ story, index }) => (
  <motion.div
    key={story.id}
    className={`relative rounded-2xl overflow-hidden group ${story.bgColor} shadow-lg hover:shadow-xl transition-all duration-300`}
    initial={{ opacity: 0, y: 20 }}
    animate={{ 
      opacity: 1, 
      y: 0,
      transition: {
        delay: index * 0.1,
        type: 'spring',
        stiffness: 100
      }
    }}
    whileHover={{ 
      y: -8,
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
    }}
  >
    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-blue-600"></div>
    <div className="p-6">
      <div className="flex items-start mb-4">
        <div className="flex-shrink-0">
          <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${story.color} flex items-center justify-center text-white text-xl font-bold`}>
            {story.name.charAt(0)}
          </div>
        </div>
        <div className="ml-4">
          <h3 className="font-semibold text-gray-900">{story.name}</h3>
          <p className="text-sm text-gray-600">{story.role}</p>
          <div className="mt-1">
            <StarRating rating={story.rating} size="sm" />
          </div>
        </div>
      </div>
      <div className="relative">
        <Quote className="absolute -top-2 -left-2 text-gray-200 w-6 h-6" />
        <p className="text-gray-700 pl-6 relative z-10">{story.content}</p>
      </div>
      <div className="mt-6 flex items-center justify-between text-sm">
        <span className="text-gray-500">{story.date}</span>
        <Link 
          href={`/stories/${story.id}`} 
          className="flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors group"
        >
          Read full story
          <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  </motion.div>
);

export default function StoriesPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ message: '', success: false });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rating: 5,
    review: ''
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'rating' ? parseInt(value, 10) : value
    }));
  };

  const handleRatingChange = (rating) => {
    setFormData(prev => ({
      ...prev,
      rating
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch(`${window.location.origin}/api/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to submit review');
      }

      // Reset form
      setFormData({
        name: '',
        email: '',
        rating: 5,
        review: ''
      });

      // Show success message using the status state
      setSubmitStatus({
        success: true,
        message: result.message || 'Thank you for your review! It has been submitted successfully.'
      });
    } catch (error) {
      console.error('Error submitting review:', error);
      setSubmitStatus({
        success: false,
        message: error.message || 'There was an error submitting your review. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-blue-700 text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/40"></div>
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-10"
            style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=2070&auto=format&fit=crop)'
            }}
          ></div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 -right-20 w-80 h-80 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
        
        <div className="container mx-auto px-4 py-20 md:py-28 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.div 
              className="inline-flex items-center px-6 py-2.5 mb-6 text-sm font-medium text-blue-100 bg-white/10 backdrop-blur-sm rounded-full border border-white/20"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Star className="w-4 h-4 mr-2 fill-yellow-400 text-yellow-400" />
              Trusted by 2000+ Happy Customers
            </motion.div>
            <motion.h1 
              className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100 leading-tight"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.7 }}
            >
              Customer Success Stories
            </motion.h1>
            <motion.p 
              className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto mb-8 leading-relaxed"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.7 }}
            >
              Discover how we&apos;ve transformed vehicles and exceeded expectations through the experiences of our valued customers.
            </motion.p>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.7 }}
              className="flex flex-wrap justify-center gap-4 mt-8"
            >
              <Link 
                href="#stories" 
                className="px-8 py-3.5 bg-white text-blue-700 font-medium rounded-lg hover:bg-blue-50 transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl flex items-center group"
              >
                Read Success Stories
                <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="/booking" 
                className="px-8 py-3.5 border-2 border-white/30 text-white font-medium rounded-lg hover:bg-white/10 transition-all duration-300 backdrop-blur-sm flex items-center group"
              >
                Book Your Service
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </motion.div>
          
        
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="stories" className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Customers Say
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Do not just take our word for it. Here&apos;s what our customers have to say about their experience with us.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {stories.map((story, index) => (
              <TestimonialCard key={story.id} story={story} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Write a Review Section */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-gray-50 to-gray-100">
    <div className="container mx-auto px-4">
      <motion.div 
        className="text-center mb-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 mb-4">
          <Star className="w-4 h-4 text-yellow-400 mr-2" fill="currentColor" />
          <span className="text-sm font-medium text-blue-700">Customer Reviews</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
          Share Your Experience
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          We value your feedback! Share your thoughts and help us improve our service.
        </p>
      </motion.div>

      <motion.div 
        className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="p-1 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
        
        <div className="p-8 md:p-10">
          <div className="flex items-center mb-8">
            <div className="p-3 bg-blue-50 rounded-xl mr-4">
              <MessageSquare className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Write a Review</h3>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
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
                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    placeholder="John Doe"
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              
              <div className="space-y-1">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Your Email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <MessageCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    placeholder="your.email@example.com"
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </div>

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
                    disabled={isSubmitting}
                  >
                    <Star 
                      className={`w-8 h-8 transition-all duration-200 ${formData.rating >= star ? 'text-yellow-400 fill-current' : 'text-gray-300 hover:text-yellow-300'}`}
                    />
                  </button>
                ))}
                <span className="ml-2 text-sm font-medium text-gray-500">
                  {formData.rating ? `${formData.rating} out of 5` : 'Rate us'}
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="review" className="block text-sm font-medium text-gray-700">
                Your Review <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <MessageCircle className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <textarea
                  id="review"
                  name="review"
                  rows="4"
                  value={formData.review}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
                  placeholder="Share your detailed experience with us..."
                  required
                  disabled={isSubmitting}
                ></textarea>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting || !formData.rating || !formData.name || !formData.review}
                className={`w-full group relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium py-3.5 px-6 rounded-lg hover:shadow-lg hover:shadow-blue-100 transition-all duration-300 flex items-center justify-center space-x-2 ${
                  isSubmitting || !formData.rating || !formData.name || !formData.review 
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
              {submitStatus.message && (
                <div className={`mt-4 p-3 rounded-lg text-sm ${
                  submitStatus.success 
                    ? 'bg-green-50 text-green-700 border border-green-200' 
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                  {submitStatus.message}
                </div>
              )}
            </div>
          </form>
        </div>
        
        <div className="px-8 py-4 bg-gray-50 border-t border-gray-100 text-center">
          <p className="text-sm text-gray-500">
            Your feedback helps us improve our services. Thank you for your time!
          </p>
        </div>
      </motion.div>
    </div>
  </section>
    </div>
  );
}
