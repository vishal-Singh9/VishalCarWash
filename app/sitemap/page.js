'use client';

import { motion } from 'framer-motion';
import { FaHome, FaInfoCircle, FaCalendarAlt, FaQuestionCircle, FaShieldAlt, FaUserCog, FaMapMarkerAlt } from 'react-icons/fa';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.6, -0.05, 0.01, 0.99]
    }
  }
};

const stagger = {
  visible: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function SitemapPage() {
  const sections = [
    {
      title: 'Main Pages',
      icon: <FaHome className="text-blue-500 text-xl" />,
      links: [
        { name: 'Home', href: '/', icon: <FaHome className="mr-2" /> },
        { name: 'About Us', href: '/about', icon: <FaInfoCircle className="mr-2" /> },
        { name: 'Book Now', href: '/booking', icon: <FaCalendarAlt className="mr-2" /> }
      ]
    },
    {
      title: 'Help & Support',
      icon: <FaQuestionCircle className="text-blue-500 text-xl" />,
      links: [
        { name: 'Help Center', href: '/help', icon: <FaQuestionCircle className="mr-2" /> },
        { name: 'Privacy Policy', href: '/privacy', icon: <FaShieldAlt className="mr-2" /> },
        { name: 'Terms of Service', href: '/terms', icon: <FaShieldAlt className="mr-2" /> }
      ]
    },
    {
      title: 'Account',
      icon: <FaUserCog className="text-blue-500 text-xl" />,
      links: [
        { name: 'My Profile', href: '/profile', icon: <FaUserCog className="mr-2" /> },
        { name: 'Settings', href: '/settings', icon: <FaUserCog className="mr-2" /> }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h1 
            className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Sitemap
          </motion.h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our website and find what you are looking for with ease.
          </p>
        </div>

        {/* Map Section */}
        <motion.div 
          className="mb-16 bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:shadow-2xl"
          whileHover={{ y: -5 }}
        >
          <div className="p-6 bg-gradient-to-r from-blue-600 to-cyan-500">
            <div className="flex items-center">
              <FaMapMarkerAlt className="text-white text-2xl mr-3" />
              <h2 className="text-2xl font-bold text-white">Our Location</h2>
            </div>
          </div>
          <div className="w-full rounded-b-2xl overflow-hidden">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d250.9892810983692!2d82.85474069935292!3d25.438721033576176!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x398fd5caa6faea49%3A0xd91afc197461fbff!2sVishal%20Washing%20Centre!5e1!3m2!1sen!2sin!4v1765886594667!5m2!1sen!2sin" 
              width="100%" 
              height="450" 
              style={{ border: 0 }} 
              allowFullScreen 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Vishal Washing Centre Location"
              className="w-full h-[400px] md:h-[500px]"
            ></iframe>
          </div>
        </motion.div>

        {/* Sitemap Sections */}
        <motion.div 
          variants={stagger}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
        >
          {sections.map((section, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
              whileHover={{ y: -5 }}
            >
              <div className="flex items-center mb-4">
                {section.icon}
                <h3 className="text-xl font-semibold text-gray-800 ml-2">{section.title}</h3>
              </div>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <motion.li 
                    key={linkIndex}
                    whileHover={{ x: 5 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <a 
                      href={link.href} 
                      className="flex items-center text-gray-700 hover:text-blue-600 transition-colors duration-200 py-2 px-3 rounded-lg hover:bg-blue-50"
                    >
                      {link.icon}
                      {link.name}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
