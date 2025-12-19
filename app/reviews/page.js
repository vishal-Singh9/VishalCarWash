"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Star,
  ChevronRight,
  ArrowRight,
  Quote,
  MessageSquare,
  Briefcase,
  MessageCircle,
  User,
  Sparkles,
  Heart,
  ThumbsUp,
  Award,
  CheckCircle,
  Clock,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

// Custom CSS for animations
const styles = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .fade-in-up {
    animation: fadeInUp 0.6s ease-out forwards;
  }
  
  .review-card {
    position: relative;
    overflow: hidden;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border-radius: 1rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  }
  
  .review-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  }
  
  .review-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #3b82f6, #8b5cf6);
  }
  
  .review-content {
    position: relative;
    z-index: 1;
  }
  
  .review-avatar {
    transition: all 0.3s ease;
    border: 3px solid white;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  }
  
  .review-card:hover .review-avatar {
    transform: scale(1.1);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }
  
  .quote-icon {
    opacity: 0.1;
    transition: all 0.3s ease;
  }
  
  .review-card:hover .quote-icon {
    opacity: 0.2;
    transform: scale(1.1);
  }
  @keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0px); }
  }
  
  .animate-float {
    animation: float 6s ease-in-out infinite;
  }
  
  .card-hover-effect {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    z-index: 1;
  }
  
  .card-hover-effect:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
  }
  
  .card-hover-effect::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%);
    z-index: -1;
    border-radius: 1rem;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  .card-hover-effect:hover::before {
    opacity: 1;
  }
  
  .gradient-text {
    background: linear-gradient(90deg, #3b82f6, #8b5cf6);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .shine-effect {
    position: relative;
    overflow: hidden;
  }
  
  .shine-effect:after {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(
      to bottom right,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.1) 50%,
      rgba(255, 255, 255, 0) 100%
    );
    transform: rotate(30deg);
    transition: all 0.6s ease;
    opacity: 0;
  }
  
  .shine-effect:hover:after {
    opacity: 1;
    left: 100%;
  }
  
  .pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.8; }
  }
`;

// Reviews are now fetched from the database

const StarRating = ({ rating, size = "md" }) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${sizeClasses[size]} ${
            star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200"
          }`}
        />
      ))}
    </div>
  );
};

// Add custom animation variants for staggered children
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
    },
  },
};

// Array of gradient colors for the cards
const cardGradients = [
  'bg-gradient-to-br from-blue-500 to-purple-600',
  'bg-gradient-to-br from-emerald-500 to-teal-600',
  'bg-gradient-to-br from-rose-500 to-pink-600',
  'bg-gradient-to-br from-amber-500 to-orange-600',
  'bg-gradient-to-br from-indigo-500 to-blue-600',
  'bg-gradient-to-br from-green-500 to-emerald-600',
];

export default function StoriesPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [submitStatus, setSubmitStatus] = useState({
    message: "",
    success: false,
  });
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    rating: 5,
    review: "",
  });

  useEffect(() => {
    setIsMounted(true);
    fetchReviews();
  }, []);

  const fetchReviews = async (showAll = false) => {
    try {
      const limit = showAll ? 100 : 6; // Show more reviews if showAll is true
      const response = await fetch(`/api/reviews?limit=${limit}`);
      const data = await response.json();
      if (data.success) {
        setReviews(data.data);
        setShowAllReviews(showAll);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    await handleSubmit(e);
    if (submitStatus.success) {
      // Refresh reviews after successful submission
      await fetchReviews();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "rating" ? parseInt(value, 10) : value,
    }));
  };

  const handleRatingChange = (rating) => {
    setFormData((prev) => ({
      ...prev,
      rating,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`${window.location.origin}/api/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to submit review");
      }

      // Reset form
      setFormData({
        name: "",
        email: "",
        rating: 5,
        review: "",
      });

      // Show success message using the status state
      setSubmitStatus({
        success: true,
        message:
          result.message ||
          "Thank you for your review! It has been submitted successfully.",
      });
    } catch (error) {
      console.error("Error submitting review:", error);
      setSubmitStatus({
        success: false,
        message:
          error.message ||
          "There was an error submitting your review. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add scroll reveal animation
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-gray-100 relative overflow-hidden">
      <style jsx global>
        {styles}
      </style>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-blue-100 opacity-10"
            style={{
              width: Math.random() * 300 + 100,
              height: Math.random() * 300 + 100,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, Math.random() * 100 - 50],
              x: [0, Math.random() * 100 - 50],
              opacity: [0.05, 0.15, 0.05],
            }}
            transition={{
              duration: Math.random() * 20 + 20,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>
      {/* Hero Section */}
      <motion.section
        className="relative bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700 text-white overflow-hidden"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/40"></div>
          <div
            className="absolute inset-0 bg-cover bg-center opacity-10"
            style={{
              backgroundImage:
                "url(https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=2070&auto=format&fit=crop)",
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
              Discover how we&apos;ve transformed vehicles and exceeded
              expectations through the experiences of our valued customers.
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
      </motion.section>

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
              Do not just take our word for it. Here&apos;s what our customers
              have to say about their experience with us.
            </p>
          </motion.div>

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : reviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {reviews.map((review, index) => {
                // Generate a consistent color class for each card
                const colorClasses = [
                  "from-blue-400 to-blue-600",
                  "from-purple-400 to-purple-600",
                  "from-pink-400 to-pink-600",
                  "from-cyan-400 to-cyan-600",
                  "from-green-400 to-green-600",
                  "from-amber-400 to-amber-600",
                ];
                const color = colorClasses[index % colorClasses.length];
                const baseColor = color.split(" ")[0].replace("from-", "");

                return (
                  <motion.div
                    key={review._id || index}
                    className="review-card bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 h-full flex flex-col"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                  >
                    <div className="relative h-full flex flex-col">
                      {/* Decorative elements */}
                      <div className="absolute top-0 right-0 w-24 h-24 -mr-12 -mt-12 rounded-full bg-gradient-to-r opacity-10"></div>
                      <div className="absolute bottom-0 left-0 w-32 h-32 -ml-16 -mb-16 rounded-full bg-gradient-to-r opacity-10"></div>

                      <div className="p-6 relative z-10 flex-1 flex flex-col">
                        <div className="flex items-start mb-4">
                          <div
                            className={`review-avatar w-14 h-14 rounded-full bg-gradient-to-r ${color} flex items-center justify-center text-white text-xl font-bold mr-4 flex-shrink-0`}
                          >
                            {review.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">
                              {review.name}
                            </h4>
                            <div className="flex items-center mt-1">
                              <StarRating rating={review.rating} size="sm" />
                              <span className="text-xs text-gray-500 ml-2">
                                {new Date(review.createdAt).toLocaleDateString(
                                  "en-US",
                                  {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  }
                                )}
                              </span>
                            </div>
                          </div>
                          <Quote
                            className={`quote-icon w-10 h-10 text-${baseColor}-200 opacity-20`}
                          />
                        </div>
                        
                        <div className="mt-4 relative pl-4 flex-1 flex flex-col">
                          <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-400 to-purple-500 rounded-full"></div>
                          <p className="text-gray-700 mb-4 relative z-10">
                            {review?.content}
                          </p>
                          
                          {/* Service details if available */}
                          {review?.service && (
                            <div className="mt-auto pt-3 border-t border-gray-100">
                              <div className="flex items-center text-sm text-gray-500">
                                <Briefcase className="w-4 h-4 mr-2 text-blue-500" />
                                <span>{review?.service}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Footer with pagination */}
                      <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                        <div className="text-xs text-gray-400">
                          {index + 1} of {reviews.length}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="bg-gray-50 rounded-xl p-8 max-w-2xl mx-auto">
                <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  No reviews yet
                </h3>
                <p className="text-gray-500">
                  Be the first to share your experience with us!
                </p>
              </div>
            </div>
          )}
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
              <Star
                className="w-4 h-4 text-yellow-400 mr-2"
                fill="currentColor"
              />
              <span className="text-sm font-medium text-blue-700">
                Customer Reviews
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Share Your Experience
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We value your feedback! Share your thoughts and help us improve
              our service.
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
                <h3 className="text-xl font-semibold text-gray-900">
                  Write a Review
                </h3>
              </div>

              <form onSubmit={handleReviewSubmit} className="space-y-6">
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
                        className="w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        placeholder="John Doe"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
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
                          className={`w-8 h-8 transition-all duration-200 ${
                            formData.rating >= star
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300 hover:text-yellow-300"
                          }`}
                        />
                      </button>
                    ))}
                    <span className="ml-2 text-sm font-medium text-gray-500">
                      {formData.rating
                        ? `${formData.rating} out of 5`
                        : "Rate us"}
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="review"
                    className="block text-sm font-medium text-gray-700"
                  >
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
                    disabled={
                      isSubmitting ||
                      !formData.rating ||
                      !formData.name ||
                      !formData.review
                    }
                    className={`w-full group relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium py-3.5 px-6 rounded-lg hover:shadow-lg hover:shadow-blue-100 transition-all duration-300 flex items-center justify-center space-x-2 ${
                      isSubmitting ||
                      !formData.rating ||
                      !formData.name ||
                      !formData.review
                        ? "opacity-70 cursor-not-allowed"
                        : "hover:opacity-90"
                    }`}
                  >
                    <span className="relative z-10">
                      {isSubmitting ? "Submitting..." : "Submit Review"}
                    </span>
                    {!isSubmitting && (
                      <>
                        <ArrowRight className="w-5 h-5 relative z-10 transition-transform group-hover:translate-x-1" />
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </>
                    )}
                  </button>
                  {submitStatus.message && (
                    <div
                      className={`mt-4 p-3 rounded-lg text-sm ${
                        submitStatus.success
                          ? "bg-green-50 text-green-700 border border-green-200"
                          : "bg-red-50 text-red-700 border border-red-200"
                      }`}
                    >
                      {submitStatus.message}
                    </div>
                  )}
                </div>
              </form>
            </div>

            <div className="px-8 py-4 bg-gray-50 border-t border-gray-100 text-center">
              <p className="text-sm text-gray-500">
                Your feedback helps us improve our services. Thank you for your
                time!
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
