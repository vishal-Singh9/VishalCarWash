"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { CheckCircle, ArrowRight, Clock, Shield, Award } from "lucide-react";
import { motion } from "framer-motion";
import { API_ENDPOINTS, buildApiUrl } from "@/lib/api-config";
import Image from "next/image";

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        setError(null);

        const apiUrl = buildApiUrl(API_ENDPOINTS.services);

        const response = await fetch(apiUrl, {
          cache: "no-store", // Disable caching to ensure fresh data
          headers: {
            "Content-Type": "application/json",
          },
        });

        const responseData = await response.json();

        if (!response.ok) {
          throw new Error(
            responseData.message ||
              `Failed to fetch services: ${response.status} ${response.statusText}`
          );
        }

        if (!responseData.success) {
          throw new Error(responseData.message || "Failed to load services");
        }

        // Ensure we have an array of services and limit to 4 for the homepage
        const servicesData = responseData.data || [];
        const limitedServices = Array.isArray(servicesData)
          ? servicesData.slice(0, 4)
          : [];

        setServices(limitedServices);
      } catch (error) {
        console.error("Error fetching services:", error);
        setError(
          error.message || "Failed to load services. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchServices();

    // Set up auto-refresh every 5 minutes
    const refreshInterval = setInterval(fetchServices, 5 * 60 * 1000);

    return () => clearInterval(refreshInterval);
  }, []);

  if (error) {
    return (
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  Error loading services. Please try again later.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-block bg-blue-100 text-blue-800 text-sm font-semibold px-4 py-1 rounded-full mb-4">
            Our Services
          </span>
          <motion.h2
            className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Premium Car Care Solutions
          </motion.h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-cyan-400 mx-auto mb-6 rounded-full"></div>
          <motion.p
            className="text-lg text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Experience the ultimate in car care with our professional services,
            designed to keep your vehicle looking its best.
          </motion.p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="bg-white rounded-xl shadow-md overflow-hidden"
              >
                <div className="animate-pulse">
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-6 space-y-4">
                    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    <div className="h-10 bg-gray-200 rounded w-full mt-4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {services?.map((service, index) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group relative bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 cursor-pointer"
                  whileHover={{
                    scale: 1.02,
                    transition: { duration: 0.2 },
                  }}
                >
                  <div className="relative h-48 overflow-hidden bg-gray-100">
                    <Image
                      src={service.image || "/images/placeholder-service.jpg"}
                      alt={service.name}
                      width={400} // Set appropriate width
                      height={300} // Set appropriate height
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/images/placeholder-service.jpg";
                      }}
                      loading="lazy"
                      style={{
                        objectFit: "cover",
                        transform: "scale(1)",
                        transition: "transform 500ms",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.transform = "scale(1.1)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.transform = "scale(1)")
                      }
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <span className="inline-block bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                        {service.duration || "30 min"}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {service.name}
                      </h3>
                      <div className="flex items-center bg-blue-50 text-blue-700 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        <Clock className="w-3 h-3 mr-1" />
                        {service.duration} min
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-3 h-[60px]">
                      {service.description}
                    </p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        <span>Professional Service</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        <span>Quality Materials</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        <span>Expert Technicians</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-gray-100 pt-4 group-hover:border-gray-200 transition-colors duration-300">
                      <div className="text-left">
                        <span className="text-xs text-gray-500">
                          Starting from
                        </span>
                        <div className="flex items-baseline">
                          <span className="text-2xl font-bold text-blue-600">
                            ₹{service.price.toLocaleString()}
                          </span>
                          <span className="ml-1 text-sm text-gray-500">
                            +GST
                          </span>
                        </div>
                      </div>

                      <Link
                        href={`/booking?service=${encodeURIComponent(service.name.toLowerCase().replace(/\s+/g, '-'))}`}
                        className="relative inline-flex items-center justify-center px-6 py-3 overflow-hidden font-medium text-blue-600 transition duration-300 ease-out border-2 border-blue-500 rounded-full shadow-md group hover:border-blue-600 hover:text-blue-700"
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
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="mt-16 text-center"
            >
              <Link
                href="/services"
                className=" inline-flex items-center justify-center w-96 px-8 py-4 border border-transparent text-base font-semibold rounded-full text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Explore All Services
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

            <div className="relative overflow-hidden py-20 bg-gradient-to-b from-cyan-100/90 to-blue-50/90 mt-16">
              {/* Decorative elements */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-64 h-64 bg-blue-800 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-800 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-1/2 w-64 h-64 bg-indigo-800 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
              >
                <div className="text-center mb-16">
                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
                  >
                    Experience the{" "}
                    <span className="bg-gradient-to-r from-blue-800 to-cyan-500 bg-clip-text text-transparent">
                      Spotless Difference
                    </span>
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="text-xl text-gray-600 max-w-3xl mx-auto"
                  >
                    More than a car wash, we deliver exceptional care for your
                    vehicle. Discover what makes us different:{" "}
                  </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {[
                    {
                      icon: <Clock className="w-7 h-7 text-blue-600" />,
                      title: "Express Service",
                      description:
                        "In and out in under 30 minutes with our express detailing options",
                    },
                    {
                      icon: <Shield className="w-7 h-7 text-blue-600" />,
                      title: "Eco-Friendly",
                      description:
                        "Biodegradable products that protect your car and the environment",
                    },
                    {
                      icon: <Award className="w-7 h-7 text-blue-600" />,
                      title: "Certified Experts",
                      description:
                        "Trained professionals using the latest techniques and equipment",
                    },
                    {
                      icon: <CheckCircle className="w-7 h-7 text-blue-600" />,
                      title: "Flexible Plans",
                      description:
                        "Customizable memberships and one-time services to fit your needs",
                    },
                  ].map((item, index) => (
                    <motion.div
                      key={item.title}
                      initial={{ opacity: 0, y: 30, scale: 0.95 }}
                      whileInView={{
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        transition: {
                          duration: 0.6,
                          ease: [0.16, 1, 0.3, 1],
                          delay: 0.1 * index,
                        },
                      }}
                      whileHover={{
                        y: -5,
                        boxShadow:
                          "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                        transition: {
                          y: { duration: 0.2, ease: "easeOut" },
                          boxShadow: { duration: 0.3, ease: "easeOut" },
                        },
                      }}
                      viewport={{ once: true, margin: "-50px" }}
                      className="group relative bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                      <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6 mx-auto group-hover:bg-blue-50 transition-colors duration-300">
                        {item.icon}
                      </div>
                      <h4 className="font-bold text-xl text-gray-900 mb-3 text-center">
                        {item.title}
                      </h4>
                      <p className="text-gray-600 text-center">
                        {item.description}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Animated wave divider */}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
