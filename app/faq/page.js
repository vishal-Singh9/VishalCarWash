'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  Search,
  MessageCircle,
  HelpCircle,
  Phone,
  Mail,
  ArrowRight,
  Clock,
  DollarSign,
  Car,
  Shield,
  Calendar,
  Users,
} from 'lucide-react';
import Link from 'next/link';

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

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All', icon: HelpCircle },
    { id: 'services', name: 'Services', icon: Car },
    { id: 'pricing', name: 'Pricing', icon: DollarSign },
    { id: 'booking', name: 'Booking', icon: Calendar },
    { id: 'general', name: 'General', icon: MessageCircle },
  ];

  const faqs = [
    {
      category: 'services',
      question: 'What services do you offer?',
      answer:
        'We offer a comprehensive range of car wash and detailing services including Basic Wash (₹299), Premium Wash (₹599), Interior Detailing (₹899), and Complete Care Package (₹1,999). Each package includes different levels of cleaning, from basic exterior washing to full interior and exterior detailing with ceramic coating.',
    },
    {
      category: 'services',
      question: 'How long does each service take?',
      answer:
        'Service duration varies by package: Basic Wash takes approximately 30 minutes, Premium Wash takes about 60 minutes, Interior Detailing requires 90 minutes, and our Complete Care Package takes 3-4 hours. We recommend booking in advance for longer services.',
    },
    {
      category: 'services',
      question: 'Do you offer interior cleaning services?',
      answer:
        'Yes! We offer comprehensive interior cleaning services including vacuuming, upholstery cleaning, dashboard polishing, leather conditioning, carpet shampooing, AC vent cleaning, and odor elimination. These are included in our Premium Wash, Interior Detailing, and Complete Care packages.',
    },
    {
      category: 'services',
      question: 'What is ceramic coating and do you offer it?',
      answer:
        'Ceramic coating is a liquid polymer that bonds with your vehicle\'s paint to provide long-lasting protection. It offers 9H hardness (scratch resistance), hydrophobic properties (water beads off), UV protection, and enhanced gloss. We offer ceramic coating in 3-month (₹999), 6-month (₹1,799), and 1-year (₹2,999) options. It\'s included free with our Complete Care Package.',
    },
    {
      category: 'pricing',
      question: 'What are your pricing packages?',
      answer:
        'We offer four main packages: Basic Wash (₹299), Premium Wash (₹599), Interior Detailing (₹899), and Complete Care Package (₹1,999). We also have monthly packages starting at ₹2,499 (4 washes + 1 detailing) and quarterly packages at ₹6,999 (12 washes + extras), which offer significant savings.',
    },
    {
      category: 'pricing',
      question: 'Do you offer any discounts or packages?',
      answer:
        'Yes! We offer several ways to save: 10% off on your first visit, 5% off for online payments, monthly packages that save you ₹1,295, quarterly packages saving ₹4,685, referral bonuses of ₹200, and free upgrades during your birthday month. We also have family car combo deals.',
    },
    {
      category: 'pricing',
      question: 'What payment methods do you accept?',
      answer:
        'We accept all major payment methods including cash, credit/debit cards (Visa, Mastercard, AmEx), UPI payments (Google Pay, PhonePe, Paytm), and net banking. Online payments receive an automatic 5% discount.',
    },
    {
      category: 'pricing',
      question: 'Is there a refund policy?',
      answer:
        'Yes, we have a customer satisfaction guarantee. If you\'re not satisfied with our service, please let us know within 24 hours and we\'ll either re-do the service or provide a full refund. For package purchases, unused services can be refunded within 30 days of purchase.',
    },
    {
      category: 'booking',
      question: 'How do I book an appointment?',
      answer:
        'You can book an appointment in three ways: (1) Online through our website\'s booking page, (2) Call us at +91 9956414364, or (3) Walk-in directly (though bookings get priority service). We recommend booking 24 hours in advance, especially for weekends.',
    },
    {
      category: 'booking',
      question: 'Do I need to book in advance or can I walk in?',
      answer:
        'Both options are available! While we welcome walk-ins, we recommend booking in advance to guarantee your preferred time slot and reduce waiting time. This is especially important on weekends and during peak hours (11 AM - 3 PM).',
    },
    {
      category: 'booking',
      question: 'What is your cancellation policy?',
      answer:
        'We offer free cancellation up to 2 hours before your scheduled appointment with a full refund. Cancellations within 2 hours of your appointment incur a 50% charge. No-shows are non-refundable. However, you can reschedule anytime without any charges.',
    },
    {
      category: 'booking',
      question: 'What are your operating hours?',
      answer:
        'We\'re open 7 days a week to serve you better! Our hours are: Monday-Saturday: 7:00 AM - 7:00 PM, and Sunday: 7:00 AM - 8:00 PM. The best times to visit for less waiting are weekday mornings (9-11 AM) or early afternoons (2-4 PM).',
    },
    {
      category: 'general',
      question: 'Where are you located?',
      answer:
        'We\'re located at Vill-Sagunaha, Babatpur, Airport Road, Varanasi, Uttar Pradesh - 221106. We\'re conveniently situated just 2 minutes from Babatpur Airport, near the Airport Main Gate and opposite the Petrol Pump. Search "Vishal Car Wash Babatpur" on Google Maps for directions.',
    },
    {
      category: 'general',
      question: 'Do you have parking available?',
      answer:
        'Yes! We have a large parking area that can accommodate 20+ cars. We also offer a covered waiting lounge with AC, free WiFi, refreshments, CCTV surveillance for your peace of mind, and washroom facilities.',
    },
    {
      category: 'general',
      question: 'How often should I get my car washed?',
      answer:
        'We recommend getting your car washed every 2 weeks to maintain its appearance and protect the paint. For premium wash with wax protection, every 15 days is ideal. If you drive frequently or park outdoors, weekly basic washes help prevent dirt buildup and paint damage.',
    },
    {
      category: 'general',
      question: 'Are your cleaning products safe for my car?',
      answer:
        'Absolutely! We use only premium, pH-balanced car care products that are safe for all vehicle types and paint finishes. Our products are eco-friendly, biodegradable, and specifically formulated for automotive use. We never use harsh chemicals that could damage your vehicle\'s paint or interior.',
    },
    {
      category: 'general',
      question: 'Do you offer mobile car wash services?',
      answer:
        'Yes! We offer free pickup and drop service within 5 km for our Complete Care Package. For other locations or services, please contact us at +91 9956414364 to discuss availability and any additional charges.',
    },
    {
      category: 'general',
      question: 'What makes Vishal Car Wash different from others?',
      answer:
        'We stand out through our commitment to quality, professional trained staff, premium eco-friendly products, comprehensive service packages, transparent pricing, state-of-the-art equipment, customer-first approach, and excellent ratings (4.8/5 stars from 500+ customers). We offer complimentary services like air fresheners and offer loyalty rewards.',
    },
  ];

  const filteredFaqs = faqs.filter((faq) => {
    const matchesCategory =
      activeCategory === 'all' || faq.category === activeCategory;
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Animated background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          className="absolute -right-20 -top-20 w-64 h-64 md:w-96 md:h-96 bg-blue-500/10 rounded-full mix-blend-overlay filter blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            x: [0, 20, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute -left-20 -bottom-20 w-64 h-64 md:w-96 md:h-96 bg-purple-500/10 rounded-full mix-blend-overlay filter blur-3xl"
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
      <section className="relative py-16 md:py-24 lg:py-32 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white overflow-hidden">
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
              Need Help?
            </motion.span>
            <motion.h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-5 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200 px-4 sm:px-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Frequently Asked Questions
            </motion.h1>
            <motion.p
              className="text-base sm:text-lg md:text-xl text-blue-100 max-w-2xl mx-auto px-4 sm:px-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Find answers to common questions about our car wash services,
              pricing, and booking process.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 md:py-12 relative z-10">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mb-6 md:mb-8 px-2 sm:px-0"
            >
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                <input
                  type="text"
                  placeholder="Search for answers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 text-sm sm:text-base rounded-lg sm:rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-all duration-200"
                />
              </div>
            </motion.div>

            {/* Category Filter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap gap-2 sm:gap-3 mb-6 md:mb-8 px-2 sm:px-0 overflow-x-auto pb-2 -mx-2 sm:mx-0"
            >
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`flex-shrink-0 flex items-center gap-2 px-3 sm:px-4 py-2 text-sm sm:text-base rounded-md sm:rounded-lg font-medium transition-all duration-200 whitespace-nowrap ${
                      activeCategory === category.id
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    {category.name}
                  </button>
                );
              })}
            </motion.div>

            {/* FAQ Accordion */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="space-y-3 sm:space-y-4 px-2 sm:px-0"
            >
              {filteredFaqs.length > 0 ? (
                <AnimatePresence>
                  {filteredFaqs.map((faq, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="bg-white rounded-lg sm:rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200"
                    >
                      <button
                        className="w-full px-4 sm:px-6 py-4 sm:py-5 text-left flex items-start sm:items-center justify-between focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg sm:rounded-xl"
                        onClick={() => toggleAccordion(index)}
                        aria-expanded={activeIndex === index}
                        aria-controls={`faq-${index}`}
                      >
                        <h3 className="text-base sm:text-lg font-medium text-gray-900 pr-3 sm:pr-4 text-left">
                          {faq.question}
                        </h3>
                        <ChevronDown
                          className={`flex-shrink-0 w-5 h-5 text-gray-400 transition-transform duration-200 mt-1 sm:mt-0 ${
                            activeIndex === index ? 'transform rotate-180' : ''
                          }`}
                        />
                      </button>
                      <AnimatePresence>
                        {activeIndex === index && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                            id={`faq-${index}`}
                          >
                            <div className="px-4 sm:px-6 pb-5 pt-0 text-sm sm:text-base text-gray-600">
                              {faq.answer}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </AnimatePresence>
              ) : (
                <div className="text-center py-8 sm:py-12 px-4">
                  <HelpCircle className="w-10 h-10 sm:w-12 sm:h-12 mx-auto text-gray-300 mb-3 sm:mb-4" />
                  <h3 className="text-lg font-medium text-gray-900">
                    No results found
                  </h3>
                  <p className="mt-1 text-sm sm:text-base text-gray-500">
                    We could not find any questions matching your search. Try a
                    different search term or category.
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
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
    </div>
  );
}

