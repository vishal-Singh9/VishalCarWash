'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  Clock,
  ArrowRight,
  Search,
  MessageCircle,
  Eye,
  Phone,
} from 'lucide-react';
import Image from 'next/image';

/* =======================
   Animations
======================= */
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
  hover: { y: -5, transition: { duration: 0.2 } },
  tap: { scale: 0.98 },
};

/* =======================
   Static Data
======================= */
const categories = [
  { id: 'all', name: 'All Posts' },
  { id: 'tips', name: 'Car Care Tips' },
  { id: 'guides', name: 'Guides' },
  { id: 'news', name: 'News & Updates' },
  { id: 'maintenance', name: 'Maintenance' },
];

const blogPosts = [
  {
    id: 1,
    title: 'Top 10 Car Washing Tips for a Spotless Shine',
    excerpt:
      'Discover professional car washing techniques that will keep your vehicle looking brand new. From proper soap selection to drying methods, we cover it all.',
    image: '/images/carwashnews.webp',
    category: 'tips',
    author: 'Vishal Singh',
    date: '2024-01-15',
    readTime: '5 min read',
    views: '2.3k',
    comments: 24,
    tags: ['Car Wash', 'Tips', 'Maintenance'],
  },
  {
    id: 2,
    title: 'The Ultimate Guide to Interior Car Detailing',
    excerpt:
      "Learn how to maintain your car's interior like a pro. From dashboard care to upholstery cleaning, this comprehensive guide has everything you need.",
    image: '/images/InteriorDetailing.webp',
    category: 'guides',
    author: 'Vishal Singh',
    date: '2024-01-10',
    readTime: '8 min read',
    views: '1.8k',
    comments: 18,
    tags: ['Interior', 'Detailing', 'Guide'],
  },
  {
    id: 3,
    title: 'Why Ceramic Coating is Worth the Investment',
    excerpt:
      'Understand the benefits of ceramic coating for your vehicle. Learn about protection, durability, and how it can save you money in the long run.',
    image: '/images/premium.webp',
    category: 'guides',
    author: 'Vishal Singh',
    date: '2024-01-05',
    readTime: '6 min read',
    views: '3.1k',
    comments: 32,
    tags: ['Ceramic Coating', 'Protection', 'Investment'],
  },
  {
    id: 4,
    title: 'Monsoon Car Care: Essential Tips for the Rainy Season',
    excerpt:
      'Prepare your car for the monsoon season with these essential maintenance tips. Protect your vehicle from rust, mold, and water damage.',
    image: '/images/Fullcarwash.webp',
    category: 'maintenance',
    author: 'Vishal Singh',
    date: '2023-12-28',
    readTime: '7 min read',
    views: '2.7k',
    comments: 21,
    tags: ['Monsoon', 'Maintenance', 'Weather'],
  },
  {
    id: 5,
    title: 'How Often Should You Wash Your Car?',
    excerpt:
      'Find out the ideal car washing frequency based on your driving habits, climate, and vehicle type. Keep your car protected without overwashing.',
    image: '/images/Basic.webp',
    category: 'tips',
    author: 'Vishal Singh',
    date: '2023-12-20',
    readTime: '4 min read',
    views: '1.5k',
    comments: 15,
    tags: ['Frequency', 'Tips', 'Care'],
  },
  {
    id: 6,
    title: 'New Premium Packages Now Available!',
    excerpt:
      "We're excited to announce our new premium car care packages with enhanced services and competitive pricing. Check out what's new!",
    image: '/images/premiumwaxing.webp',
    category: 'news',
    author: 'Vishal Singh',
    date: '2023-12-15',
    readTime: '3 min read',
    views: '4.2k',
    comments: 45,
    tags: ['News', 'Packages', 'Updates'],
  },
];

/* =======================
   Component
======================= */
export default function Blog() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const featuredPost = useMemo(() => blogPosts[0], []);

  const filteredPosts = useMemo(() => {
    const query = searchQuery.toLowerCase();

    return blogPosts.filter((post) => {
      const matchesCategory =
        activeCategory === 'all' || post.category === activeCategory;

      const matchesSearch =
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        post.tags.some((tag) => tag.toLowerCase().includes(query));

      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, activeCategory]);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
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
              Car Care Insights
            </motion.span>
            <motion.h1
              className="text-4xl md:text-6xl font-bold mb-5 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Our Blog
            </motion.h1>
            <motion.p
              className="text-xl text-blue-100 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Tips, guides, and news about car care, maintenance, and detailing
              from our experts.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-12 relative z-10">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mb-8"
            >
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-all duration-200"
                />
              </div>
            </motion.div>

            {/* Category Filter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap gap-3 mb-12"
            >
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-5 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                    activeCategory === category.id
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </motion.div>

            {/* Featured Post */}
            {activeCategory === 'all' && !searchQuery && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="mb-16"
              >
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden group hover:shadow-2xl transition-all duration-300">
                  <div className="grid md:grid-cols-2 gap-0">
                    <div className="relative h-64 md:h-full overflow-hidden">
                      <Image
                        src={featuredPost?.image}
                        alt={featuredPost?.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full">
                          Featured
                        </span>
                      </div>
                    </div>
                    <div className="p-8 md:p-10 flex flex-col justify-center">
                      <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1.5" />
                          {new Date(featuredPost.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                        <span className="flex items-center">
                          <Clock className="w-4 h-4 mr-1.5" />
                          {featuredPost.readTime}
                        </span>
                      </div>
                      <h2 className="text-3xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                        {featuredPost?.title}
                      </h2>
                      <p className="text-gray-600 mb-6 leading-relaxed">
                        {featuredPost?.excerpt}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center">
                            <Eye className="w-4 h-4 mr-1" />
                            {featuredPost.views}
                          </span>
                          <span className="flex items-center">
                            <MessageCircle className="w-4 h-4 mr-1" />
                            {featuredPost.comments}
                          </span>
                        </div>
                        <button className="flex items-center gap-2 text-blue-600 font-semibold hover:gap-3 transition-all">
                          Read More
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Blog Posts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.slice(activeCategory === 'all' && !searchQuery ? 1 : 0).map(
                (post, index) => (
                  <motion.article
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-xl shadow-md overflow-hidden group hover:shadow-xl transition-all duration-300 flex flex-col"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={post?.image}
                        alt={post?.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-blue-600 text-xs font-semibold rounded-full">
                          {categories.find((cat) => cat.id === post.category)?.name}
                        </span>
                      </div>
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <div className="flex items-center gap-3 mb-3 text-xs text-gray-600">
                        <span className="flex items-center">
                          <Calendar className="w-3.5 h-3.5 mr-1" />
                          {new Date(post.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                        <span className="flex items-center">
                          <Clock className="w-3.5 h-3.5 mr-1" />
                          {post.readTime}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {post?.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-3 flex-grow">
                        {post?.excerpt}
                      </p>
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span className="flex items-center">
                            <Eye className="w-3.5 h-3.5 mr-1" />
                            {post.views}
                          </span>
                          <span className="flex items-center">
                            <MessageCircle className="w-3.5 h-3.5 mr-1" />
                            {post.comments}
                          </span>
                        </div>
                        <button className="text-blue-600 font-semibold text-sm flex items-center gap-1 hover:gap-2 transition-all">
                          Read
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.article>
                )
              )}
            </div>

            {filteredPosts.length === 0 && (
              <div className="text-center py-12">
                <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No posts found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your search or filter to find what you&apos;re
                  looking for.
                </p>
              </div>
            )}
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
                      href="tel:+919956414364"
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

