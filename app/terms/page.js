'use client';

import { motion } from 'framer-motion';
import { FaCar, FaShieldAlt, FaCreditCard, FaInfoCircle, FaExclamationTriangle, FaExchangeAlt, FaEnvelope, FaPhone } from 'react-icons/fa';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6 }
  }
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

const sectionIcons = {
  1: <FaCar className="text-blue-500 text-xl" />,
  2: <FaInfoCircle className="text-blue-500 text-xl" />,
  3: <FaCreditCard className="text-blue-500 text-xl" />,
  4: <FaExclamationTriangle className="text-blue-500 text-xl" />,
  5: <FaShieldAlt className="text-blue-500 text-xl" />,
  6: <FaExchangeAlt className="text-blue-500 text-xl" />,
  7: <div className="flex space-x-2">
       <FaEnvelope className="text-blue-500 text-xl" />
       <FaPhone className="text-blue-500 text-xl" />
     </div>
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 md:py-24"
      >
        <div className="container mx-auto px-4 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Terms and Conditions
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-xl text-blue-100 max-w-3xl mx-auto"
          >
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </motion.p>
        </div>
      </motion.div>

      {/* Terms Content */}
      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="container mx-auto px-4 py-12 md:py-16 max-w-4xl"
      >
        <motion.div 
          variants={fadeInUp}
          className="bg-white rounded-xl shadow-lg overflow-hidden mb-8 transform transition-all duration-300 hover:shadow-xl"
        >
          <div className="p-6 md:p-8">
            <motion.div 
              whileHover={{ x: 5 }}
              className="flex items-center mb-6"
            >
              {sectionIcons[1]}
              <h2 className="text-2xl font-bold text-gray-800 ml-3">1. Acceptance of Terms</h2>
            </motion.div>
            <p className="text-gray-600 leading-relaxed">
              By accessing and using the Vishal Car Wash services, you accept and agree to be bound by these Terms and Conditions. 
              If you do not agree with any part of these terms, you must not use our services.
            </p>
          </div>
        </motion.div>

        <motion.div 
          variants={fadeInUp}
          className="bg-white rounded-xl shadow-lg overflow-hidden mb-8 transform transition-all duration-300 hover:shadow-xl"
        >
          <div className="p-6 md:p-8">
            <motion.div 
              whileHover={{ x: 5 }}
              className="flex items-center mb-6"
            >
              {sectionIcons[2]}
              <h2 className="text-2xl font-bold text-gray-800 ml-3">2. Service Description</h2>
            </motion.div>
            <p className="text-gray-600 leading-relaxed">
              Vishal Car Wash provides professional car washing and detailing services. We reserve the right to modify or 
              discontinue any service at any time without prior notice.
            </p>
          </div>
        </motion.div>

        <motion.div 
          variants={fadeInUp}
          className="bg-white rounded-xl shadow-lg overflow-hidden mb-8 transform transition-all duration-300 hover:shadow-xl"
        >
          <div className="p-6 md:p-8">
            <motion.div 
              whileHover={{ x: 5 }}
              className="flex items-center mb-6"
            >
              {sectionIcons[3]}
              <h2 className="text-2xl font-bold text-gray-800 ml-3">3. Booking and Payments</h2>
            </motion.div>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>All services must be paid for at the time of booking or upon completion of service.</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>We accept various payment methods including credit/debit cards and digital wallets.</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>Prices are subject to change without notice.</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>Cancellations must be made at least 2 hours before the scheduled appointment.</span>
              </li>
            </ul>
          </div>
        </motion.div>

        <motion.div 
          variants={fadeInUp}
          className="bg-white rounded-xl shadow-lg overflow-hidden mb-8 transform transition-all duration-300 hover:shadow-xl"
        >
          <div className="p-6 md:p-8">
            <motion.div 
              whileHover={{ x: 5 }}
              className="flex items-center mb-6"
            >
              {sectionIcons[4]}
              <h2 className="text-2xl font-bold text-gray-800 ml-3">4. Vehicle Condition</h2>
            </motion.div>
            <p className="text-gray-600 leading-relaxed">
              Customers are responsible for removing all personal belongings from their vehicle before service. 
              Vishal Car Wash is not responsible for any lost, stolen, or damaged personal items left in the vehicle.
            </p>
          </div>
        </motion.div>

        <motion.div 
          variants={fadeInUp}
          className="bg-white rounded-xl shadow-lg overflow-hidden mb-8 transform transition-all duration-300 hover:shadow-xl"
        >
          <div className="p-6 md:p-8">
            <motion.div 
              whileHover={{ x: 5 }}
              className="flex items-center mb-6"
            >
              {sectionIcons[5]}
              <h2 className="text-2xl font-bold text-gray-800 ml-3">5. Liability</h2>
            </motion.div>
            <p className="text-gray-600 leading-relaxed">
              While we take utmost care in providing our services, Vishal Car Wash shall not be liable for any damage to vehicles 
              that results from pre-existing conditions, normal wear and tear, or acts of nature.
            </p>
          </div>
        </motion.div>

        <motion.div 
          variants={fadeInUp}
          className="bg-white rounded-xl shadow-lg overflow-hidden mb-8 transform transition-all duration-300 hover:shadow-xl"
        >
          <div className="p-6 md:p-8">
            <motion.div 
              whileHover={{ x: 5 }}
              className="flex items-center mb-6"
            >
              {sectionIcons[6]}
              <h2 className="text-2xl font-bold text-gray-800 ml-3">6. Changes to Terms</h2>
            </motion.div>
            <p className="text-gray-600 leading-relaxed">
              We reserve the right to modify these terms at any time. Any changes will be effective immediately upon posting 
              on our website. Your continued use of our services after such changes constitutes your acceptance of the new terms.
            </p>
          </div>
        </motion.div>

        <motion.div 
          variants={fadeInUp}
          className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl"
        >
          <div className="p-6 md:p-8">
            <motion.div 
              whileHover={{ x: 5 }}
              className="flex items-center mb-6"
            >
              {sectionIcons[7]}
              <h2 className="text-2xl font-bold text-white ml-3">7. Contact Us</h2>
            </motion.div>
            <p className="text-blue-100 leading-relaxed mb-4">
              If you have any questions about these Terms and Conditions, please contact us at:
            </p>
            <div className="flex flex-col space-y-3 text-blue-100">
              <div className="flex items-center">
                <FaEnvelope className="mr-3" />
                <a href="mailto:info@vishalcarwash.com" className="hover:underline">info@vishalcarwash.com</a>
              </div>
              <div className="flex items-center">
                <FaPhone className="mr-3" />
                <a href="tel:1234567890" className="hover:underline">(123) 456-7890</a>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Footer */}
      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="bg-gray-900 text-white py-8"
      >
        <div className="container mx-auto px-4 text-center">
          <p>© {new Date().getFullYear()} Vishal Car Wash. All rights reserved.</p>
          <p className="text-gray-400 text-sm mt-2">Last updated on {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      </motion.footer>
    </div>
  );
}
