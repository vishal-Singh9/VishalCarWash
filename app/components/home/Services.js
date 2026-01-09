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
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Premium Car Care Solutions
          </motion.h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-cyan-400 mx-auto mb-6 rounded-full"></div>
          <motion.p
            className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4 sm:px-0"
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4 sm:px-0">
              {services?.map((service, index) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group relative bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 sm:hover:-translate-y-2 border border-gray-100 cursor-pointer"
                  whileHover={{
                    scale: 1.02,
                    transition: { duration: 0.2 },
                  }}
                >
                  <div className="relative h-40 sm:h-48 overflow-hidden bg-gray-100">
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
                  <div className="p-4 sm:p-5 md:p-6">
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
                className="inline-flex items-center justify-center w-full sm:w-96 px-6 sm:px-8 py-3 sm:py-4 border border-transparent text-sm sm:text-base font-semibold rounded-full text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Explore All Services
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

            <div className="relative overflow-hidden py-16 sm:py-20 md:py-24 lg:py-28 mt-12 sm:mt-16 bg-gradient-to-br from-slate-50 via-blue-50/50 to-cyan-50/30">
              {/* Enhanced animated background blobs */}
              <div className="absolute inset-0 overflow-hidden">
                <motion.div
                  animate={{
                    x: [0, 100, 0],
                    y: [0, 50, 0],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-400/30 to-blue-600/20 rounded-full mix-blend-multiply filter blur-3xl opacity-40"
                />
                <motion.div
                  animate={{
                    x: [0, -80, 0],
                    y: [0, 60, 0],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5,
                  }}
                  className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-cyan-400/30 to-cyan-600/20 rounded-full mix-blend-multiply filter blur-3xl opacity-40"
                />
                <motion.div
                  animate={{
                    x: [0, 50, 0],
                    y: [0, -40, 0],
                    scale: [1, 1.15, 1],
                  }}
                  transition={{
                    duration: 18,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1,
                  }}
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[450px] h-[450px] bg-gradient-to-tr from-indigo-400/30 to-purple-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-40"
                />
                {/* Additional floating particles effect */}
                <div className="absolute inset-0">
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 bg-blue-400/20 rounded-full"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                      }}
                      animate={{
                        y: [0, -30, 0],
                        opacity: [0.2, 0.5, 0.2],
                        scale: [1, 1.5, 1],
                      }}
                      transition={{
                        duration: 3 + Math.random() * 2,
                        repeat: Infinity,
                        delay: Math.random() * 2,
                        ease: "easeInOut",
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Grid pattern overlay */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] opacity-40"></div>

              <motion.div
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10"
              >
                {/* Header Section */}
                <div className="text-center mb-20">
             

                  <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                    className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 mb-6 px-4 sm:px-0 leading-tight"
                  >
                    Experience the{" "}
                    <span className="relative inline-block">
                      <motion.span
                        className="bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-700 bg-clip-text text-transparent bg-[length:200%_auto]"
                        animate={{
                          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                        }}
                        transition={{
                          duration: 5,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      >
                        Spotless Difference
                      </motion.span>
                      <motion.span
                        className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-600 rounded-full"
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
                      />
                    </span>
                  </motion.h2>

                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                    className="text-lg sm:text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
                  >
                    More than a car wash, we deliver{" "}
                    <span className="font-semibold text-gray-700">exceptional care</span> for your
                    vehicle. Discover what makes us different:
                  </motion.p>
                </div>

                {/* Feature Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 px-4 sm:px-0">
                  {[
                    {
                      icon: Clock,
                      title: "Express Service",
                      description:
                        "In and out in under 30 minutes with our express detailing options",
                      gradient: "from-blue-500 to-cyan-400",
                      bgGradient: "from-blue-50 to-cyan-50",
                    },
                    {
                      icon: Shield,
                      title: "Eco-Friendly",
                      description:
                        "Biodegradable products that protect your car and the environment",
                      gradient: "from-green-500 to-emerald-400",
                      bgGradient: "from-green-50 to-emerald-50",
                    },
                    {
                      icon: Award,
                      title: "Certified Experts",
                      description:
                        "Trained professionals using the latest techniques and equipment",
                      gradient: "from-purple-500 to-pink-400",
                      bgGradient: "from-purple-50 to-pink-50",
                    },
                    {
                      icon: CheckCircle,
                      title: "Flexible Plans",
                      description:
                        "Customizable memberships and one-time services to fit your needs",
                      gradient: "from-orange-500 to-amber-400",
                      bgGradient: "from-orange-50 to-amber-50",
                    },
                  ].map((item, index) => {
                    const IconComponent = item.icon;
                    return (
                      <motion.div
                        key={item.title}
                        initial={{ opacity: 0, y: 50, rotateX: -15 }}
                        whileInView={{
                          opacity: 1,
                          y: 0,
                          rotateX: 0,
                          transition: {
                            duration: 0.7,
                            ease: [0.16, 1, 0.3, 1],
                            delay: 0.15 * index,
                          },
                        }}
                        whileHover={{
                          y: -12,
                          rotateY: 2,
                          scale: 1.03,
                          transition: {
                            duration: 0.3,
                            ease: "easeOut",
                          },
                        }}
                        viewport={{ once: true, margin: "-50px" }}
                        className="group relative"
                      >
                        {/* Card Glow Effect */}
                        <div className={`absolute -inset-0.5 bg-gradient-to-r ${item.gradient} rounded-3xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500`}></div>
                        
                        {/* Main Card */}
                        <div className="relative h-full bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-lg border border-gray-100/50 group-hover:border-gray-200/50 transition-all duration-500 transform-gpu">
                          {/* Animated background gradient */}
                          <div className={`absolute inset-0 bg-gradient-to-br ${item.bgGradient} rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10`}></div>
                          
                          {/* Icon Container with enhanced animation */}
                          <motion.div
                            className={`relative w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${item.gradient} p-0.5 shadow-lg group-hover:shadow-2xl transition-all duration-500 overflow-visible`}
                            whileHover={{
                              rotate: [0, -10, 10, -10, 0],
                              scale: 1.15,
                            }}
                            transition={{
                              rotate: { duration: 0.6, ease: "easeInOut" },
                              scale: { duration: 0.3, ease: "easeOut" },
                            }}
                          >
                            {/* Glow effect on hover */}
                            <motion.div
                              className={`absolute -inset-2 bg-gradient-to-br ${item.gradient} rounded-2xl opacity-0 blur-xl group-hover:opacity-60 transition-opacity duration-500`}
                              animate={{
                                scale: [1, 1.2, 1],
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut",
                              }}
                            />
                            
                            <div className="relative w-full h-full bg-white rounded-2xl flex items-center justify-center group-hover:bg-transparent transition-all duration-300 z-10">
                              {/* Icon with visible gradient - always visible */}
                              <motion.div
                                whileHover={{
                                  scale: 1.2,
                                  rotate: [0, -5, 5, 0],
                                }}
                                transition={{
                                  scale: { duration: 0.2 },
                                  rotate: { duration: 0.5 },
                                }}
                              >
                                <IconComponent 
                                  className={`w-10 h-10 transition-all duration-300 ${
                                    item.gradient.includes('blue') ? 'text-blue-600' :
                                    item.gradient.includes('green') ? 'text-green-600' :
                                    item.gradient.includes('purple') ? 'text-purple-600' :
                                    'text-orange-600'
                                  } group-hover:text-white`}
                                  style={{
                                    filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.15))',
                                  }}
                                />
                              </motion.div>
                              
                              {/* Glow effect behind icon on hover */}
                              <motion.div
                                className={`absolute inset-0 bg-gradient-to-br ${item.gradient} rounded-2xl opacity-0 group-hover:opacity-30 blur-md`}
                                animate={{
                                  scale: [1, 1.1, 1],
                                }}
                                transition={{
                                  duration: 2,
                                  repeat: Infinity,
                                  ease: "easeInOut",
                                }}
                              />
                            </div>
                            
                            {/* Sparkle effects on hover */}
                            {[...Array(8)].map((_, i) => {
                              const angle = (i * 360) / 8;
                              const radius = 50;
                              const x = Math.cos((angle * Math.PI) / 180) * radius;
                              const y = Math.sin((angle * Math.PI) / 180) * radius;
                              return (
                                <motion.div
                                  key={i}
                                  className={`absolute w-2 h-2 bg-gradient-to-br ${item.gradient} rounded-full opacity-0 group-hover:opacity-100 shadow-lg`}
                                  style={{
                                    left: '50%',
                                    top: '50%',
                                    transform: 'translate(-50%, -50%)',
                                  }}
                                  animate={{
                                    scale: [0, 1.5, 0],
                                    opacity: [0, 1, 0],
                                    x: [0, x, x * 1.2],
                                    y: [0, y, y * 1.2],
                                  }}
                                  transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    delay: i * 0.15,
                                    ease: "easeOut",
                                  }}
                                />
                              );
                            })}
                            
                            {/* Pulsing ring effect */}
                            <motion.div
                              className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-40`}
                              animate={{
                                scale: [1, 1.3, 1],
                                opacity: [0, 0.4, 0],
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut",
                              }}
                            />
                            
                            {/* Rotating gradient border effect */}
                            <motion.div
                              className={`absolute -inset-1 rounded-2xl bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-100 blur-sm`}
                              animate={{
                                rotate: 360,
                              }}
                              transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "linear",
                              }}
                              style={{
                                zIndex: -1,
                              }}
                            />
                          </motion.div>

                          {/* Content */}
                          <motion.h4
                            className="font-bold text-xl sm:text-2xl text-gray-900 mb-4 text-center group-hover:text-gray-800 transition-colors duration-300"
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.2 }}
                          >
                            {item.title}
                          </motion.h4>
                          
                          <motion.p
                            className="text-gray-600 text-center leading-relaxed group-hover:text-gray-700 transition-colors duration-300"
                            initial={{ opacity: 0.8 }}
                            whileHover={{ opacity: 1 }}
                          >
                            {item.description}
                          </motion.p>

                          {/* Decorative bottom accent */}
                          <motion.div
                            className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-gradient-to-r ${item.gradient} rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                            initial={{ scaleX: 0 }}
                            whileHover={{ scaleX: 1 }}
                            transition={{ duration: 0.3 }}
                          />
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>

              {/* Bottom wave divider */}
              <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent"></div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
