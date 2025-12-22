"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle,
  ArrowRight,
  Map,
} from "lucide-react";

const ContactInfo = ({ icon: Icon, title, children, color = "blue" }) => {
  const colors = {
    blue: {
      bg: "bg-blue-50",
      text: "text-blue-600",
      hover: "hover:bg-blue-100",
      border: "border-blue-100",
    },
    green: {
      bg: "bg-green-50",
      text: "text-green-600",
      hover: "hover:bg-green-100",
      border: "border-green-100",
    },
    purple: {
      bg: "bg-purple-50",
      text: "text-purple-600",
      hover: "hover:bg-purple-100",
      border: "border-purple-100",
    },
    amber: {
      bg: "bg-amber-50",
      text: "text-amber-600",
      hover: "hover:bg-amber-100",
      border: "border-amber-100",
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`flex items-start space-x-4 p-6 rounded-xl shadow-sm transition-all duration-300 border ${colors[color].bg} ${colors[color].border} ${colors[color].hover} group`}
    >
      <div
        className={`p-3 rounded-xl ${colors[color].bg} group-hover:scale-110 transition-transform duration-300`}
      >
        <Icon className={`h-6 w-6 ${colors[color].text}`} />
      </div>
      <div className="flex-1">
        <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center">
          {title}
          <ArrowRight className="ml-2 h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </h3>
        <div className="text-gray-600 space-y-1.5">{children}</div>
      </div>
    </motion.div>
  );
};

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

export function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [activeField, setActiveField] = useState(null);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.subject.trim()) newErrors.subject = "Subject is required";
    if (!formData.message.trim()) newErrors.message = "Message is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
      // Reset success message after 5 seconds
      const timer = setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);

      return () => clearTimeout(timer);
    }, 1500);
  };

  const handleFocus = (field) => setActiveField(field);
  const handleBlur = () => setActiveField(null);

  return (
    <section
      id="contact"
      className="relative py-32 bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 overflow-hidden"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
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
            ease: "easeInOut",
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
            ease: "easeInOut",
            delay: 5,
          }}
        />
      </div>

      <div className="relative container mx-auto px-4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="text-center mb-20"
        >
          <motion.span
            className="inline-block px-5 py-2.5 text-sm font-semibold text-blue-400 bg-blue-900/30 backdrop-blur-sm rounded-full border border-blue-800/30 mb-5"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Contact Us
          </motion.span>
          <motion.h2
            className="text-4xl font-bold text-white sm:text-5xl lg:text-6xl mb-5 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Get In Touch
          </motion.h2>
          <motion.p
            className="text-xl text-blue-100/80 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Have questions or want to book an appointment? Our team is here to
            help you with all your car care needs.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* <div className="space-y-6"> */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 shadow-2xl"
          >
            <h3 className="text-2xl font-bold text-white mb-8 relative inline-block">
              <span className="relative z-10">Our Information</span>
              <span className="absolute bottom-0 left-0 w-full h-1.5 bg-blue-500/30 -z-0 rounded-full"></span>
            </h3>

            {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> */}
            <div className="space-y-6">
              <ContactInfo icon={MapPin} title="Our Location" color="blue">
                <p className="flex items-center">
                  <Map className="h-4 w-4 mr-2" />
                  <span>Vishal Car Wash, Airport Road, </span>
                </p>
                <p className="ml-6">Varanasi, Uttar Pradesh, 221006</p>
                <p className="ml-6">India</p>
                <a
                  href="https://www.google.com/maps/place/Vishal+Washing+Centre/@25.4387361,82.8549873,186m/data=!3m1!1e3!4m14!1m7!3m6!1s0x398fd5ae98d33961:0xe0a6882ef87ef5a7!2sLal+Bahadur+Shastri+International+Airport,+Varanasi!8m2!3d25.4506565!4d82.8559854!16s%2Fm%2F0262hfw!3m5!1s0x398fd5caa6faea49:0xd91afc197461fbff!8m2!3d25.4386737!4d82.8546465!16s%2Fg%2F11vhyyzdp2?entry=ttu&g_ep=EgoyMDI1MTIwOS4wIKXMDSoKLDEwMDc5MjA2N0gBUAM%3D"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors"
                >
                  View on map <ArrowRight className="ml-1 h-3 w-3" />
                </a>
              </ContactInfo>

              <ContactInfo icon={Phone} title="Phone Number" color="green">
                <a
                  href="tel:9956414364"
                  className="flex items-center hover:text-blue-400 transition-colors"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  <span>+91 99564 14364</span>
                </a>
                <a
                  href="tel:8765790994"
                  className="flex items-center hover:text-blue-400 transition-colors mt-2"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  <span>+91 87657 90994</span>
                </a>
                <p className="text-sm text-gray-400 mt-2">
                  Call us for any inquiries
                </p>
              </ContactInfo>
              <ContactInfo icon={Mail} title="Email Address" color="purple">
                <a
                  href="mailto:info@vishalcarwash.com"
                  className="flex items-center hover:text-blue-400 transition-colors"
                >
                  <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="truncate">mr.vishalsingh1309@gmail.com</span>
                </a>
                <a
                  href="mailto:support@vishalcarwash.com"
                  className="flex items-center hover:text-blue-400 transition-colors mt-2"
                >
                  <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="truncate">support@vishalcarwash.com</span>
                </a>
              </ContactInfo>
              <ContactInfo icon={Clock} title="Working Hours" color="amber">
                <div className="space-y-1">
                  <p className="flex items-center">
                    <span className="inline-block w-28 font-medium">
                      Mon - Fri:
                    </span>
                    <span>7:00 AM - 8:00 PM</span>
                  </p>
                  <p className="flex items-center">
                    <span className="inline-block w-28 font-medium">
                      Saturday:
                    </span>
                    <span>7:00 AM - 9:00 PM</span>
                  </p>
                  <p className="flex items-center">
                    <span className="inline-block w-28 font-medium">
                      Sunday:
                    </span>
                    <span>7:00 AM - 9:00 PM</span>
                  </p>
                </div>
              </ContactInfo>

              <ContactInfo icon={Phone} title="Emergency Service" color="green">
                <div className="space-y-2">
                  <p className="flex items-center text-lg font-semibold">
                    24/7 Available
                  </p>
                  <p className="flex items-center">
                    <Phone className="h-4 w-4 mr-2" />
                    <a href="tel:9956414364" className="hover:underline">
                      9956414364
                    </a>
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    Call us anytime for emergency car wash services
                  </p>
                </div>
              </ContactInfo>
            </div>

            <div className="space-y-6"></div>
            {/* </div> */}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative"
          >
            <div className=" bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] opacity-5"></div>

              <div className="relative z-10 p-6 sm:p-8">
                <div className="flex items-center mb-6 sm:mb-8">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
                    <Send className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="ml-3 text-2xl font-bold text-white">
                    Send us a Message
                  </h3>
                </div>

                <AnimatePresence mode="wait">
                  {isSubmitted ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="text-center py-12"
                    >
                      <motion.div
                        className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/10 border border-green-500/30 mb-6"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        <CheckCircle className="h-10 w-10 text-green-400" />
                      </motion.div>
                      <h4 className="text-2xl font-bold text-white mb-3">
                        Message Sent Successfully!
                      </h4>
                      <p className="text-blue-100/80 max-w-md mx-auto">
                        Thank you for contacting us. Our team will get back to
                        you within 24 hours.
                      </p>
                      <motion.button
                        type="button"
                        onClick={() => setIsSubmitted(false)}
                        className="mt-6 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-300"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Send Another Message
                      </motion.button>
                    </motion.div>
                  ) : (
                    <motion.form
                      onSubmit={handleSubmit}
                      className="space-y-6 w-full"
                      key="form"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                        <div className="space-y-1.5">
                          <label
                            htmlFor="name"
                            className={`block text-sm font-medium ${
                              errors.name ? "text-red-400" : "text-blue-100"
                            }`}
                          >
                            Full Name{" "}
                            {!errors.name && (
                              <span className="text-red-500">*</span>
                            )}
                          </label>
                          <div className="relative">
                            <Input
                              id="name"
                              name="name"
                              type="text"
                              value={formData.name}
                              onChange={handleChange}
                              onFocus={() => handleFocus("name")}
                              onBlur={handleBlur}
                              className={`w-full bg-white/5 border ${
                                errors.name
                                  ? "border-red-500/50"
                                  : "border-white/10"
                              } ${
                                activeField === "name"
                                  ? "ring-2 ring-blue-500/50"
                                  : ""
                              } text-white placeholder-gray-400 focus:ring-0 focus:border-blue-500 transition-all duration-200`}
                              placeholder="Enter your full name"
                            />
                            {activeField === "name" && (
                              <motion.div
                                className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500"
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{ duration: 0.3 }}
                              />
                            )}
                          </div>
                          {errors.name && (
                            <p className="text-red-400 text-xs mt-1">
                              {errors.name}
                            </p>
                          )}
                        </div>

                        <div className="space-y-1.5">
                          <label
                            htmlFor="email"
                            className={`block text-sm font-medium ${
                              errors.email ? "text-red-400" : "text-blue-100"
                            }`}
                          >
                            Email Address{" "}
                            {!errors.email && (
                              <span className="text-red-500">*</span>
                            )}
                          </label>
                          <div className="relative">
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              value={formData.email}
                              onChange={handleChange}
                              onFocus={() => handleFocus("email")}
                              onBlur={handleBlur}
                              className={`w-full bg-white/5 border ${
                                errors.email
                                  ? "border-red-500/50"
                                  : "border-white/10"
                              } ${
                                activeField === "email"
                                  ? "ring-2 ring-blue-500/50"
                                  : ""
                              } text-white placeholder-gray-400 focus:ring-0 focus:border-blue-500 transition-all duration-200`}
                              placeholder="Enter your email"
                            />
                            {activeField === "email" && (
                              <motion.div
                                className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500"
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{ duration: 0.3 }}
                              />
                            )}
                          </div>
                          {errors.email && (
                            <p className="text-red-400 text-xs mt-1">
                              {errors.email}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label
                          htmlFor="subject"
                          className={`block text-sm font-medium ${
                            errors.subject ? "text-red-400" : "text-blue-100"
                          }`}
                        >
                          Subject{" "}
                          {!errors.subject && (
                            <span className="text-red-500">*</span>
                          )}
                        </label>
                        <div className="relative">
                          <Input
                            id="subject"
                            name="subject"
                            type="text"
                            value={formData.subject}
                            onChange={handleChange}
                            onFocus={() => handleFocus("subject")}
                            onBlur={handleBlur}
                            className={`w-full bg-white/5 border ${
                              errors.subject
                                ? "border-red-500/50"
                                : "border-white/10"
                            } ${
                              activeField === "subject"
                                ? "ring-2 ring-blue-500/50"
                                : ""
                            } text-white placeholder-gray-400 focus:ring-0 focus:border-blue-500 transition-all duration-200`}
                            placeholder="How can we help you?"
                          />
                          {activeField === "subject" && (
                            <motion.div
                              className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500"
                              initial={{ scaleX: 0 }}
                              animate={{ scaleX: 1 }}
                              transition={{ duration: 0.3 }}
                            />
                          )}
                        </div>
                        {errors.subject && (
                          <p className="text-red-400 text-xs mt-1">
                            {errors.subject}
                          </p>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        <label
                          htmlFor="message"
                          className={`block text-sm font-medium ${
                            errors.message ? "text-red-400" : "text-blue-100"
                          }`}
                        >
                          Your Message{" "}
                          {!errors.message && (
                            <span className="text-red-500">*</span>
                          )}
                        </label>
                        <div className="relative">
                          <Textarea
                            id="message"
                            name="message"
                            rows={5}
                            value={formData.message}
                            onChange={handleChange}
                            onFocus={() => handleFocus("message")}
                            onBlur={handleBlur}
                            className={`w-full bg-white/5 border ${
                              errors.message
                                ? "border-red-500/50"
                                : "border-white/10"
                            } ${
                              activeField === "message"
                                ? "ring-2 ring-blue-500/50"
                                : ""
                            } text-white placeholder-gray-400 focus:ring-0 focus:border-blue-500 transition-all duration-200`}
                            placeholder="Tell us more about your car care needs..."
                          />
                          {activeField === "message" && (
                            <motion.div
                              className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500"
                              initial={{ scaleX: 0 }}
                              animate={{ scaleX: 1 }}
                              transition={{ duration: 0.3 }}
                            />
                          )}
                        </div>
                        {errors.message && (
                          <p className="text-red-400 text-xs mt-1">
                            {errors.message}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-4 border-t border-white/5">
                        <div className="text-xs text-blue-200/60 mb-3 sm:mb-0">
                          <span className="text-red-500">*</span> Required
                          fields
                        </div>
                        <motion.button
                          type="submit"
                          disabled={isSubmitting}
                          className="relative overflow-hidden group w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-xl transition-all duration-300 flex items-center justify-center"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                          {isSubmitting ? (
                            <>
                              <svg
                                className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
                              <span>Sending...</span>
                            </>
                          ) : (
                            <>
                              <Send className="h-5 w-5 mr-2 -ml-1" />
                              <span>Send Message</span>
                              <span className="absolute -right-8 group-hover:right-4 transition-all duration-300">
                                <ArrowRight className="h-5 w-5" />
                              </span>
                            </>
                          )}
                        </motion.button>
                      </div>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="mt-10 p-6 rounded-2xl  bg-gray-800/50 border border-blue-800/30 backdrop-blur-sm">
              <h4 className="text-lg font-semibold text-white mb-3">
                Visit Our Location
              </h4>
              <div className="aspect-w-16 aspect-h-9 rounded-xl overflow-hidden border border-white/10 bg-gray-800/50">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d900.7464658799081!2d82.85498726243807!3d25.438736146794263!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x398fd5caa6faea49%3A0xd91afc197461fbff!2sVishal%20Washing%20Centre!5e0!3m2!1sen!2sin!4v1766149530273!5m2!1sen!2sin"
                  width="100%"
                  height="450"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>{" "}
              </div>
            </div>
            <p className="text-xs text-white/70 text-center mt-4">
              By submitting this form, you agree to our{" "}
              <a href="/privacy" className="text-blue-400 hover:underline">
                Privacy Policy
              </a>{" "}
              and{" "}
              <a href="/terms" className="text-blue-600 hover:underline">
                Terms of Service
              </a>
              .
            </p>
          </motion.div>
        </div>

        {/* Decorative elements at bottom */}
        <motion.div
          className="absolute left-1/2 -bottom-10 w-72 h-72 bg-purple-500/10 rounded-full mix-blend-overlay filter blur-3xl -translate-x-1/2"
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Animated gradient border at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50">
        <motion.div
          className="h-full w-1/3 bg-white"
          animate={{
            x: ["-100%", "400%"],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>
    </section>
  );
}
