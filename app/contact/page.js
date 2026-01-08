"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle,
  XCircle,
  ArrowRight,
} from "lucide-react";

// Animation variants
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
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
      damping: 15,
    },
  },
};

const formItem = {
  hidden: { opacity: 0, x: -20 },
  show: (i) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.1,
      type: "spring",
      stiffness: 100,
    },
  }),
};

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

const ContactInfo = ({
  icon: Icon,
  title,
  details,
  action,
  color = "blue",
  className = "",
}) => {
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
      variants={item}
      whileHover="hover"
      whileTap="tap"
      viewport={{ once: true, margin: "-50px" }}
      className={`flex flex-col xs:flex-row items-start space-x-0 xs:space-x-3 sm:space-x-4 p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl shadow-sm sm:shadow-md transition-all duration-300 border-2 ${colors[color].bg} ${colors[color].border} ${colors[color].hover} group hover:shadow-lg h-full ${className}`}
    >
      <div className="mb-3 xs:mb-0">
        <div
          className={`p-2.5 sm:p-3 rounded-lg sm:rounded-xl ${colors[color].bg} group-hover:scale-110 transition-transform duration-300`}
        >
          <Icon className={`h-5 w-5 sm:h-6 sm:w-6 ${colors[color].text}`} />
        </div>
      </div>
      <div className="flex-1">
        <h3 className="text-base sm:text-lg font-semibold sm:font-bold text-gray-900 mb-1.5 sm:mb-2 flex items-center">
          {title}
          <ArrowRight className="ml-1.5 sm:ml-2 h-3.5 w-3.5 sm:h-4 sm:w-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex-shrink-0" />
        </h3>
        <div className="text-sm sm:text-base text-gray-600 space-y-1 sm:space-y-1.5">
          {details.map((detail, idx) => (
            <div key={idx} className="flex items-center">
              {action ? (
                <a
                  href={action}
                  className="hover:text-blue-600 transition-colors flex items-center"
                >
                  {detail}
                </a>
              ) : (
                <span>{detail}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const ContactForm = () => {
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
  const [apiError, setApiError] = useState(null);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.subject.trim()) newErrors.subject = "Subject is required";
    if (!formData.message.trim()) newErrors.message = "Message is required";

    // Set errors for all fields to show required indicators
    setErrors((prev) => ({
      ...prev,
      ...newErrors,
      // Keep existing errors for fields not being validated now
      ...Object.fromEntries(
        Object.entries(prev)
          .filter(([key]) => !(key in newErrors))
          .map(([key, value]) => [key, value])
      ),
    }));

    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing, but only if the field is not empty or has valid content
    if (errors[name]) {
      // For email, only clear if it's a valid email when not empty
      if (name === "email" && value.trim()) {
        if (/\S+@\S+\.\S+/.test(value)) {
          setErrors((prev) => ({
            ...prev,
            [name]: "",
          }));
        }
      } else if (value.trim()) {
        // For other fields, clear error if not empty
        setErrors((prev) => ({
          ...prev,
          [name]: "",
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setApiError(null);

    try {
      const response = await fetch("api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      // Check if the response has content before parsing JSON
      const contentType = response.headers.get("content-type");
      let result = {};

      if (contentType && contentType.includes("application/json")) {
        try {
          result = await response.json();
        } catch (jsonError) {
          console.error("Error parsing JSON response:", jsonError);
          throw new Error("Invalid response from server");
        }
      }

      if (!response.ok) {
        throw new Error(
          result.error ||
            `Server responded with status: ${response.status} ${response.statusText}`
        );
      }

      // If we get here, the request was successful
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
    } catch (error) {
      console.error("Error sending message:", error);
      setApiError(
        error.message || "An unexpected error occurred. Please try again later."
      );

      // Clear error after 5 seconds
      const timer = setTimeout(() => {
        setApiError(null);
      }, 5000);

      return () => clearTimeout(timer);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFocus = (field) => setActiveField(field);
  const handleBlur = () => setActiveField(null);

  const contactInfo = [
    {
      icon: Phone,
      title: "Phone",
      details: ["+91 9956414364", "+91 8765790994"],
      action: "tel:+919956414364",
      color: "blue",
    },
    {
      icon: Mail,
      title: "Email",
      details: ["mr.vishalsingh1309@gmail.com", "support@vishalcarwash.com"],
      action: "mailto:mr.vishalsingh1309@gmail.com",
      color: "green",
    },
    {
      icon: MapPin,
      title: "Address",
      details: [
        "Vishal Car Wash, Airport Road, Varanasi, Uttar Pradesh, 221006, India",
      ],
      action:
        "https://www.google.com/maps/place/Vishal+Washing+Centre/@25.4387361,82.8549873,186m/data=!3m1!1e3!4m14!1m7!3m6!1s0x398fd5ae98d33961:0xe0a6882ef87ef5a7!2sLal+Bahadur+Shastri+International+Airport,+Varanasi!8m2!3d25.4506565!4d82.8559854!16s%2Fm%2F0262hfw!3m5!1s0x398fd5caa6faea49:0xd91afc197461fbff!8m2!3d25.4386737!4d82.8546465!16s%2Fg%2F11vhyyzdp2?entry=ttu&g_ep=EgoyMDI1MTIwOS4wIKXMDSoKLDEwMDc5MjA2N0gBUAM%3D",
      color: "purple",
    },
    {
      icon: Clock,
      title: "Working Hours",
      details: ["Mon-Sat: 7:00 AM - 7:00 PM", "Sunday: 7:00 AM - 8:00 PM"],
      action: null,
      color: "amber",
    },
  ];

  return (
    <div className="relative">
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
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/30"></div>
          <div className="absolute inset-0 bg-[url('/images/backsection.webp')] bg-cover bg-center opacity-20"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
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
              Get In Touch
            </motion.span>
            <motion.h1
              className="text-4xl md:text-6xl font-bold mb-5 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Contact Us
            </motion.h1>
            <motion.p
              className="text-xl text-blue-100 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Have questions or need to book an appointment? Our team is here to
              help you with all your car care needs.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Cards */}
      {/* ================= CONTACT SECTION ================= */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* ================= CONTACT INFO CARDS ================= */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              visible: { transition: { staggerChildren: 0.1 } },
            }}
            className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 xs:gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-10 lg:mb-14 px-3 sm:px-4"
          >
            {contactInfo.map((info, index) => (
              <motion.div key={index} variants={fadeInUp} className="h-full">
                <ContactInfo
                  icon={info.icon}
                  title={info.title}
                  details={info.details}
                  action={info.action}
                  color={info.color}
                  className="h-full"
                />
              </motion.div>
            ))}
          </motion.div>

          {/* ================= FORM + MAP ================= */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="
        grid
        grid-cols-1
        lg:grid-cols-2
        gap-6 sm:gap-8 md:gap-10 lg:gap-12
      "
          >
            {/* ================= CONTACT FORM ================= */}
            <motion.div
              className="relative bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              {/* Toast Messages */}
              <AnimatePresence>
                {isSubmitted && (
                  <motion.div
                    initial={{ opacity: 0, y: -20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="fixed top-6 right-6 z-50 max-w-sm w-full"
                  >
                    <div className="bg-white p-4 rounded-xl shadow-lg border border-green-100 flex items-start">
                      <div className="bg-green-100 p-2 rounded-lg mr-3">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">
                          Message Sent!
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          Thank you for contacting us. We will get back to you
                          soon!
                        </p>
                      </div>
                      <button
                        onClick={() => setIsSubmitted(false)}
                        className="ml-2 text-gray-400 hover:text-gray-600 transition-colors"
                        aria-label="Close"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  </motion.div>
                )}
                {apiError && (
                  <motion.div
                    initial={{ opacity: 0, y: -20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="fixed top-6 right-6 z-50 max-w-sm w-full"
                  >
                    <div className="bg-white p-4 rounded-xl shadow-lg border border-red-100 flex items-start">
                      <div className="bg-red-100 p-2 rounded-lg mr-3">
                        <XCircle className="w-5 h-5 text-red-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">
                          Error Sending Message
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">{apiError}</p>
                      </div>
                      <button
                        onClick={() => setApiError(null)}
                        className="ml-2 text-gray-400 hover:text-gray-600 transition-colors"
                        aria-label="Close"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Gradient Bar */}
              <div className="p-1 bg-gradient-to-r from-blue-500 to-indigo-600" />

              {/* Form Body */}
              <div className="p-5 sm:p-7 md:p-9">
                <div className="flex items-start sm:items-center mb-5 sm:mb-7">
                  <div className="p-3 bg-blue-50 rounded-xl mr-4">
                    <Send className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                      Send us a Message
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      We will respond within 24 hours
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="space-y-5"
                  >
                    {/* Name */}
                    <motion.div variants={formItem}>
                      <div className="w-full">
                        <div className="flex justify-between items-center mb-1">
                          <label
                            htmlFor="name"
                            className="text-sm font-medium text-gray-700"
                          >
                            Name <span className="text-red-500">*</span>
                          </label>
                          {errors.name && (
                            <span className="text-red-500 text-xs">
                              {errors.name}
                            </span>
                          )}
                        </div>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          onFocus={() => handleFocus("name")}
                          onBlur={handleBlur}
                          className={`w-full px-4 py-3 rounded-lg border-2 ${
                            errors.name
                              ? "border-red-500 focus:border-red-500"
                              : "border-gray-200 focus:border-blue-500"
                          } focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors`}
                          placeholder="Enter your name"
                          aria-invalid={!!errors.name}
                          aria-describedby={
                            errors.name ? "name-error" : undefined
                          }
                        />
                      </div>
                    </motion.div>

                    {/* Email */}
                    <motion.div variants={formItem}>
                      <div className="w-full">
                        <div className="flex justify-between items-center mb-1">
                          <label
                            htmlFor="email"
                            className="text-sm font-medium text-gray-700"
                          >
                            Email <span className="text-red-500">*</span>
                          </label>
                          {errors.email && (
                            <span className="text-red-500 text-xs">
                              {errors.email}
                            </span>
                          )}
                        </div>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          onFocus={() => handleFocus("email")}
                          onBlur={handleBlur}
                          className={`w-full px-4 py-3 rounded-lg border-2 ${
                            errors.email
                              ? "border-red-500 focus:border-red-500"
                              : "border-gray-200 focus:border-blue-500"
                          } focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors`}
                          placeholder="Enter your email"
                          aria-invalid={!!errors.email}
                          aria-describedby={
                            errors.email ? "email-error" : undefined
                          }
                        />
                      </div>
                    </motion.div>

                    {/* Subject */}
                    <motion.div variants={formItem}>
                      <div className="w-full">
                        <div className="flex justify-between items-center mb-1">
                          <label
                            htmlFor="subject"
                            className="text-sm font-medium text-gray-700"
                          >
                            Subject <span className="text-red-500">*</span>
                          </label>
                          {errors.subject && (
                            <span className="text-red-500 text-xs">
                              {errors.subject}
                            </span>
                          )}
                        </div>
                        <input
                          type="text"
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          onFocus={() => handleFocus("subject")}
                          onBlur={handleBlur}
                          className={`w-full px-4 py-3 rounded-lg border-2 ${
                            errors.subject
                              ? "border-red-500 focus:border-red-500"
                              : "border-gray-200 focus:border-blue-500"
                          } focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors`}
                          placeholder="Enter subject"
                          aria-invalid={!!errors.subject}
                          aria-describedby={
                            errors.subject ? "subject-error" : undefined
                          }
                        />
                      </div>
                    </motion.div>

                    {/* Message */}
                    <motion.div variants={formItem}>
                      <div className="w-full">
                        <div className="flex justify-between items-center mb-1">
                          <label
                            htmlFor="message"
                            className="text-sm font-medium text-gray-700"
                          >
                            Message <span className="text-red-500">*</span>
                          </label>
                          {errors.message && (
                            <span className="text-red-500 text-xs">
                              {errors.message}
                            </span>
                          )}
                        </div>
                        <textarea
                          id="message"
                          name="message"
                          rows="4"
                          value={formData.message}
                          onChange={handleChange}
                          onFocus={() => handleFocus("message")}
                          onBlur={handleBlur}
                          className={`w-full px-4 py-3 rounded-lg border-2 ${
                            errors.message
                              ? "border-red-500 focus:border-red-500"
                              : "border-gray-200 focus:border-blue-500"
                          } focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors resize-none`}
                          placeholder="Enter your message"
                          aria-invalid={!!errors.message}
                          aria-describedby={
                            errors.message ? "message-error" : undefined
                          }
                        ></textarea>
                      </div>
                    </motion.div>
                  </motion.div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="
                w-full
                bg-gradient-to-r from-blue-600 to-indigo-600
                text-white text-sm sm:text-base
                py-2.5 sm:py-3 md:py-3.5
                rounded-lg
                flex items-center justify-center gap-2
                hover:opacity-90
                transition
                focus:ring-2 focus:ring-blue-300 focus:outline-none
              "
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </form>
              </div>

              <div className="px-6 sm:px-8 py-4 bg-gray-50 border-t text-center">
                <p className="text-xs sm:text-sm text-gray-500">
                  Your information is safe with us.
                </p>
              </div>
            </motion.div>

            {/* ================= MAP ================= */}
            <div className="bg-white p-4 sm:p-5 md:p-6 rounded-2xl shadow-lg h-full flex flex-col">
              <h4 className="text-lg font-semibold text-gray-800 mb-3 sm:mb-4">
                Visit Our Location
              </h4>
              <div className="flex-1 rounded-xl overflow-hidden border border-gray-200 bg-gray-100">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d900.7464658799081!2d82.85498726243807!3d25.438736146794263!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x398fd5caa6faea49%3A0xd91afc197461fbff!2sVishal%20Washing%20Centre!5e0!3m2!1sen!2sin!4v1766149530273!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  className="min-h-[300px] sm:min-h-[400px] md:min-h-[500px]"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>{" "}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 bg-gradient-to-r from-blue-600 to-blue-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="absolute inset-0 bg-[url(/images/carspa.webp)] bg-cover bg-center opacity-20"></div>

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
};

// Add default export for the page component
export default ContactForm;
