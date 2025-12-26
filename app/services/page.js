'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Clock, ArrowRight, Loader2, Sparkles, Filter, X, ChevronDown, Phone } from 'lucide-react';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
  hover: {
    y: -5,
    transition: { duration: 0.2 },
  },
  tap: {
    scale: 0.98,
  },
};
const additionalServices = [
  {
    title: 'Additional Services',
    items: [
      'Engine Cleaning',
      'Headlight Restoration',
      'Scratch Removal',
      'Ceramic Coating',
      'Paint Protection Film',
    ],
  },
  {
    title: 'Interior Services',
    items: [
      'Leather Conditioning',
      'Fabric Protection',
      'Odor Removal',
      'Steam Cleaning',
      'Dashboard Polish',
    ],
  },
];

const processSteps = [
  {
    step: '01',
    title: 'Book Online',
    description: 'Choose your service and book your preferred time slot'
  },
  {
    step: '02',
    title: 'Drop Off',
    description: 'Bring your vehicle to our facility at the scheduled time'
  },
  {
    step: '03',
    title: 'Professional Service',
    description: 'Our experts clean and detail your car with care'
  },
  {
    step: '04',
    title: 'Pick Up',
    description: 'Collect your sparkling clean vehicle'
  }
];

export default function Services() {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [showFilters, setShowFilters] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const categories = useRef(['all', 'exterior', 'interior', 'premium']);

  const fetchServices = useCallback(async (retryCount = 0) => {
    const MAX_RETRIES = 2;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/services`);
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error?.message || `Failed to fetch services: ${response.status} ${response.statusText}`);
      }
      
      // Check if the response has the expected structure
      if (!result.success) {
        throw new Error(result.error || 'Invalid response from server');
      }
      
      if (!Array.isArray(result.data)) {
        throw new Error('Invalid data format received from API');
      }
      
      setServices(result.data);
      setFilteredServices(result.data);
    } catch (error) {
      console.error('Error fetching services:', error);
      
      // Retry logic for transient errors
      if (retryCount < MAX_RETRIES && !error.message.includes('Invalid')) {
        // Wait 1 second before retrying
        await new Promise(resolve => setTimeout(resolve, 1000));
        return fetchServices(retryCount + 1);
      }
      
      setError(error.message || 'Failed to load services. Please try again later.');
      setServices([]);
      setFilteredServices([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServices();
    
    // Add scroll reveal animation
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fadeInUp');
        }
      });
    }, { threshold: 0.1 });

    // Observe all elements with these classes
    const elements = document.querySelectorAll('.service-card, .process-step, .additional-service');
    elements.forEach(el => observer.observe(el));
    
    // Cleanup function
    return () => {
      elements.forEach(el => observer.unobserve(el));
      observer.disconnect();
    };
  }, [fetchServices]);

  useEffect(() => {
    if (!Array.isArray(services) || services.length === 0) {
      setFilteredServices([]);
      return;
    }
    
    let result = [...services];
    
    // Filter by search query
    if (searchQuery) {
      result = result.filter(service => 
        service.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Filter by price range
    result = result.filter(service => 
      service.price >= priceRange[0] && service.price <= priceRange[1]
    );
    
    // Filter by category
    if (activeCategory !== 'all') {
      result = result.filter(service => 
        service.category === activeCategory
      );
    }
    
    setFilteredServices(result);
  }, [services, searchQuery, priceRange, activeCategory]);

  // Render loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8 bg-red-50 rounded-lg">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Services</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchServices}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative py-24 md:py-32 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white overflow-hidden"
      >
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/30"></div>
          <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/380768/pexels-photo-380768.jpeg')] bg-cover bg-center opacity-20"></div>
        </div>
        
        {/* Decorative blobs */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center bg-blue-500/20 px-4 py-2 rounded-full mb-6"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              <span>Premium Car Care Services</span>
            </motion.div>
            <motion.h1 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight"
            >
             Smart Car Care <span className="text-blue-300">Services</span>
            </motion.h1>
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed"
            >
              Experience premium car care with our professional detailing services designed to keep your vehicle looking its best.
            </motion.p>
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="mt-10"
            >
              <Link 
                href="/booking" 
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-700 font-semibold rounded-full hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Book Your Service Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Services Grid */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          {/* Search and Filter */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mb-12 bg-white rounded-xl shadow-md p-6 sticky top-4 z-10"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search services..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <svg
                  className="absolute left-3 top-3.5 h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              
              <div className="relative">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                >
                  <Filter size={18} />
                  <span>Filters</span>
                  <ChevronDown 
                    size={18} 
                    className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} 
                  />
                </button>
                
                <AnimatePresence>
                  {showFilters && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg p-4 z-20 border border-gray-100"
                    >
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold">Filters</h3>
                        <button 
                          onClick={() => setShowFilters(false)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <X size={18} />
                        </button>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Category
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {categories.current.map(category => (
                              <button
                                key={category}
                                onClick={() => setActiveCategory(category)}
                                className={`px-3 py-1.5 text-sm rounded-full capitalize transition ${
                                  activeCategory === category
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                              >
                                {category}
                              </button>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}
                          </label>
                          <div className="px-2">
                            <input
                              type="range"
                              min="0"
                              max="10000"
                              step="100"
                              value={priceRange[1]}
                              onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                              className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            
            {/* Active filters */}
            <div className="mt-4 flex flex-wrap gap-2">
              {searchQuery && (
                <div className="flex items-center bg-blue-50 text-blue-700 text-sm px-3 py-1.5 rounded-full">
                  Search: {searchQuery}
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="ml-2 text-blue-400 hover:text-blue-700"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
              
              {activeCategory !== 'all' && (
                <div className="flex items-center bg-blue-50 text-blue-700 text-sm px-3 py-1.5 rounded-full">
                  Category: {activeCategory}
                  <button 
                    onClick={() => setActiveCategory('all')}
                    className="ml-2 text-blue-400 hover:text-blue-700"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
              
              {(priceRange[0] > 0 || priceRange[1] < 10000) && (
                <div className="flex items-center bg-blue-50 text-blue-700 text-sm px-3 py-1.5 rounded-full">
                  Price: ₹{priceRange[0]} - ₹{priceRange[1]}
                  <button 
                    onClick={() => setPriceRange([0, 10000])}
                    className="ml-2 text-blue-400 hover:text-blue-700"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>
          </motion.div>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Loading services...</p>
            </div>
          ) : (
            <>
              {filteredServices?.length > 0 ? (
                <motion.div 
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16"
                >
                  {filteredServices?.map((service, index) => (
                    <motion.div
                      key={service.id}
                      variants={fadeIn}
                      className="service-card group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1.5 border border-gray-100"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 h-full">
                        <div className="relative h-64 md:h-full overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10" />
                          <div className="relative w-full h-full">
                            <Image
                              src={service.image }
                              alt={service.name}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = '/images/car-wash-default.jpg';
                              }}
                              sizes="(max-width: 768px) 100vw, 50vw"
                              priority={index < 3} // Only prioritize loading first 3 images
                            />
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                            <div className="inline-block bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full mb-2">
                              {service.category || 'Standard'}
                            </div>
                            <h3 className="text-2xl font-bold text-white">{service.name}</h3>
                          </div>
                        </div>
                        
                        <div className="p-6 flex flex-col justify-between">
                          <div>
                            <p className="text-gray-600 mb-6 line-clamp-3">{service.description}</p>

                            <div className="space-y-3 mb-6">
                              {service.features && Array.isArray(service.features) && service.features.slice(0, 3).map((feature, idx) => (
                                <div key={idx} className="flex items-start group-hover:translate-x-1 transition-transform duration-300" style={{ transitionDelay: `${idx * 50}ms` }}>
                                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                                  <span className="text-gray-700">{feature}</span>
                                </div>
                              ))}
                              {service.features && service.features.length > 3 && (
                                <div className="text-sm text-blue-600 font-medium">+{service.features.length - 3} more features</div>
                              )}
                            </div>

                            {service.duration && (
                              <div className="flex items-center text-gray-600 mb-6 bg-gray-50 p-3 rounded-lg">
                                <div className="p-2 bg-blue-100 rounded-lg mr-3">
                                  <Clock className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                  <div className="text-xs text-gray-500">Duration</div>
                                  <div className="font-medium">{service.duration} minutes</div>
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                            <div>
                              <div className="text-sm text-gray-500 mb-1">Starting from</div>
                              <div className="text-3xl font-bold text-blue-600">₹{service.price}</div>
                            </div>
                            <Link
                              href={`/booking?service=${encodeURIComponent(service.name.toLowerCase().replace(/\s+/g, '-'))}`}
                              className="relative inline-flex items-center justify-center px-6 py-3 overflow-hidden font-medium text-blue-600 transition duration-300 ease-out border-2 border-blue-500 rounded-full shadow-md group"
                            >
                              <span className="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full bg-blue-500 group-hover:translate-x-0 ease">
                                <ArrowRight className="w-5 h-5" />
                              </span>
                              <span className="absolute flex items-center justify-center w-full h-full text-blue-500 transition-all duration-300 transform group-hover:translate-x-full ease">
                                Book Now
                              </span>
                              <span className="relative invisible">Book Now</span>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
                  <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">No services found</h3>
                  <p className="text-gray-500 max-w-md mx-auto">We could not find any services matching your filters. Try adjusting your search or filters.</p>
                  <button 
                    onClick={() => {
                      setSearchQuery('');
                      setActiveCategory('all');
                      setPriceRange([0, 10000]);
                    }}
                    className="mt-6 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </>
          )}

          {/* Additional Services */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 md:p-12 relative overflow-hidden"
          >
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-200 rounded-full opacity-20" />
            <div className="absolute -left-10 -bottom-10 w-60 h-60 bg-indigo-200 rounded-full opacity-20" />
            
            <div className="relative z-10">
              <div className="text-center mb-12">
                <span className="inline-block bg-blue-100 text-blue-800 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
                  More Services
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                  Additional Services
                </h2>
                <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
                  Enhance your car care experience with our premium additional services
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {additionalServices[0].items.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="additional-service bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-blue-100 group"
                  >
                    <div className="flex items-start">
                      <div className="p-2 bg-blue-50 rounded-lg mr-4 group-hover:bg-blue-100 transition-colors">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{item}</h3>
                        <p className="text-gray-500 text-sm">Professional {item.toLowerCase()} service for your vehicle</p>
                      </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-gray-100">
                      <button className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center group-hover:translate-x-1 transition-transform duration-300">
                        Learn more
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <div className="mt-12 text-center">
                <p className="text-gray-600 mb-6">Can not find what you are looking for?</p>
                <button className="px-6 py-3 bg-white text-blue-600 font-medium rounded-full border-2 border-blue-100 hover:bg-blue-50 transition-all duration-300 hover:shadow-md">
                  Contact us for custom services
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Process Section */}
      <section className="relative py-20 bg-white overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] opacity-10"></div>
        </div>
        <div className="container mx-auto px-4 relative">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <span className="inline-block bg-blue-50 text-blue-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
              How It Works
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              Our Simple <span className="text-blue-600">4-Step</span> Process
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Simple steps to get your car looking brand new
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-transform hover:-translate-y-1 text-center"
              >
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-2xl font-bold mx-auto mb-6">
                  {step.step}
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </motion.div>
            ))}
          </div>
          
  
        </div>
      </section>

      {/* CTA Section */}
         <section className="relative py-20 bg-gradient-to-r from-blue-600 to-blue-700 text-white overflow-hidden">
              <div className="absolute inset-0 bg-black/30"></div>
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1483721310020-03333e577078?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2089&q=80')] bg-cover bg-center opacity-20"></div>
      
              <div className="container mx-auto px-4 relative z-10">
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-100px" }}
                  variants={fadeInUp}
                  className="text-center max-w-3xl mx-auto"
                >
                  <h2 className="text-3xl md:text-4xl font-bold mb-6">
                    Ready to give your car the care it deserves?
                  </h2>
                  <p className="text-xl text-blue-100 mb-8">
                    Book an appointment today and experience the difference of a
                    professional car wash service.
                  </p>
                  <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <a
                      href="tel:+919876543210"
                      className="inline-flex items-center justify-center px-8 py-3.5 text-base font-medium text-blue-600 bg-white hover:bg-gray-100 rounded-lg transition shadow-md hover:shadow-lg"
                    >
                      <Phone className="w-5 h-5 mr-2" />
                      Call Us Now
                    </a>
                    <a
                      href="/booking"
                      className="inline-flex items-center justify-center px-8 py-3.5 text-base font-medium text-white bg-transparent hover:bg-white/10 rounded-lg transition border-2 border-white"
                    >
                      Book Online
                    </a>
                  </div>
                </motion.div>
              </div>
            </section>
      
      {/* Custom scrollbar */}
      <style jsx global>{`
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 10px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
        }
        
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
        
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}
