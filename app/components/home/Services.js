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
          cache: "no-store",
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
    const refreshInterval = setInterval(fetchServices, 5 * 60 * 1000);
    return () => clearInterval(refreshInterval);
  }, []);

  if (error) {
    return (
      <section className="py-20 bg-[#030712]">
        <div className="container mx-auto px-4">
          <div className="bg-red-500/10 border-l-4 border-red-500 p-4 rounded-r">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-400">Error loading services. Please try again later.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-[#030712] relative">
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-block bg-white/5 border border-white/10 text-cyan-400 text-sm font-semibold px-4 py-1 rounded-full mb-4">
            Our Services
          </span>
          <motion.h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-white"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Premium Car Care Solutions
          </motion.h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-cyan-400 mx-auto mb-6 rounded-full"></div>
          <motion.p
            className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto px-4 sm:px-0"
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
              <div key={item} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                <div className="animate-pulse">
                  <div className="h-48 bg-white/10"></div>
                  <div className="p-6 space-y-4">
                    <div className="h-6 bg-white/10 rounded w-3/4"></div>
                    <div className="h-4 bg-white/10 rounded w-5/6"></div>
                    <div className="h-4 bg-white/10 rounded w-2/3"></div>
                    <div className="h-10 bg-white/10 rounded w-full mt-4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4 sm:px-0">
              {services?.map((service, index) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group relative bg-white/5 backdrop-blur-md rounded-xl overflow-hidden border border-white/10 hover:border-cyan-500/50 transition-all duration-300 cursor-pointer"
                  whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                >
                  {/* Inner glow on hover */}
                  <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/0 to-cyan-500/0 group-hover:to-cyan-500/10 transition-all duration-500 z-0"></div>
                  
                  <div className="relative h-40 sm:h-48 overflow-hidden bg-gray-900 z-10">
                    <Image
                      src={service.image || "/images/placeholder-service.jpg"}
                      alt={service.name}
                      width={400}
                      height={300}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/images/placeholder-service.jpg";
                      }}
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#030712] to-transparent opacity-80"></div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <span className="inline-block bg-cyan-500/20 border border-cyan-500/50 text-cyan-300 text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-md">
                        {service.duration || "30 min"}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-4 sm:p-5 md:p-6 relative z-10">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                        {service.name}
                      </h3>
                    </div>

                    <p className="text-gray-400 text-sm mb-4 line-clamp-3 h-[60px]">
                      {service.description}
                    </p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-400 hover:text-cyan-300 transition-colors duration-200">
                        <CheckCircle className="w-4 h-4 text-cyan-500 mr-2 flex-shrink-0" />
                        <span>Professional Service</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-400 hover:text-cyan-300 transition-colors duration-200">
                        <CheckCircle className="w-4 h-4 text-cyan-500 mr-2 flex-shrink-0" />
                        <span>Quality Materials</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-400 hover:text-cyan-300 transition-colors duration-200">
                        <CheckCircle className="w-4 h-4 text-cyan-500 mr-2 flex-shrink-0" />
                        <span>Expert Technicians</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-white/10 pt-4 group-hover:border-cyan-500/30 transition-colors duration-300">
                      <div className="text-left">
                        <span className="text-xs text-gray-500">Starting from</span>
                        <div className="flex items-baseline">
                          <span className="text-2xl font-bold text-white">
                            ₹{service.price.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      <Link
                        href={`/booking?service=${encodeURIComponent(service.name.toLowerCase().replace(/\s+/g, '-'))}`}
                        className="relative inline-flex items-center justify-center px-4 py-2 overflow-hidden font-medium text-white transition duration-300 ease-out border border-white/20 rounded-full shadow-md group-hover:border-cyan-400"
                      >
                        <span className="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full bg-cyan-500 group-hover:translate-x-0 ease">
                          <ArrowRight className="w-4 h-4" />
                        </span>
                        <span className="absolute flex items-center justify-center w-full h-full text-white transition-all duration-300 transform group-hover:translate-x-full ease">
                          Book
                        </span>
                        <span className="relative invisible">Book</span>
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
                className="inline-flex items-center justify-center w-full sm:w-auto px-8 py-4 border border-white/20 text-base font-semibold rounded-full text-white bg-white/5 hover:bg-white/10 transition-all duration-300 transform hover:scale-105 shadow-lg backdrop-blur-md group"
              >
                Explore All Services
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform text-cyan-400" />
              </Link>
            </motion.div>
          </>
        )}
      </div>

      {/* Spotless Difference Section */}
      <div className="relative overflow-hidden py-16 sm:py-20 md:py-24 lg:py-28 mt-12 sm:mt-16 bg-[#030712] border-t border-white/5">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ x: [0, 100, 0], y: [0, 50, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-0 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px]"
          />
          <motion.div
            animate={{ x: [0, -80, 0], y: [0, 60, 0], scale: [1, 1.2, 1] }}
            transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[100px]"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10"
        >
          <div className="text-center mb-20">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-6 leading-tight"
            >
              Experience the{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                Spotless Difference
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed"
            >
              More than a car wash, we deliver <span className="text-white">exceptional care</span> for your vehicle. Discover what makes us different:
            </motion.p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {[
              { icon: Clock, title: "Express Service", description: "In and out in under 30 minutes with our express detailing options" },
              { icon: Shield, title: "Eco-Friendly", description: "Biodegradable products that protect your car and the environment" },
              { icon: Award, title: "Certified Experts", description: "Trained professionals using the latest techniques and equipment" },
              { icon: CheckCircle, title: "Flexible Plans", description: "Customizable memberships and one-time services to fit your needs" },
            ].map((item, index) => {
              const IconComponent = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.1 * index } }}
                  whileHover={{ y: -5 }}
                  viewport={{ once: true }}
                  className="group relative bg-white/5 backdrop-blur-md p-8 rounded-3xl border border-white/10 hover:border-cyan-500/50 transition-all duration-300"
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/0 to-cyan-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                  
                  <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-white/10 flex items-center justify-center border border-white/5 group-hover:scale-110 transition-transform duration-300">
                    <IconComponent className="w-8 h-8 text-cyan-400" />
                  </div>

                  <h4 className="font-bold text-xl text-white mb-4 text-center group-hover:text-cyan-300 transition-colors">
                    {item.title}
                  </h4>
                  
                  <p className="text-gray-400 text-sm text-center leading-relaxed">
                    {item.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
