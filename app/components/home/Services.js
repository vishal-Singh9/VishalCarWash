"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { CheckCircle, ArrowRight, Clock, Shield, Award } from "lucide-react";
import { motion } from "framer-motion";
import { API_ENDPOINTS, buildApiUrl } from "@/lib/api-config";

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
        console.log("Fetching services from:", apiUrl);

        const response = await fetch(apiUrl, {
          cache: "no-store", // Disable caching to ensure fresh data
          headers: {
            "Content-Type": "application/json",
          },
        });

        const responseData = await response.json();
        console.log("API Response:", responseData);

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

        console.log("Setting services:", limitedServices);
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
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500">
            Premium Car Care Solutions
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-cyan-400 mx-auto mb-6 rounded-full"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Experience the ultimate in car care with our professional services,
            designed to keep your vehicle looking its best.
          </p>
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
                  className="group relative bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
                >
                  <div className="relative h-48 overflow-hidden bg-gray-100">
                    <img
                      src={service.image || "/images/placeholder-service.jpg"}
                      alt={service.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/images/placeholder-service.jpg";
                      }}
                      loading="lazy"
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
                      <div className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        <span>Professional Service</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        <span>Quality Materials</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        <span>Expert Technicians</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-gray-100 pt-4">
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
                        href={{
                          pathname: "/booking",
                          query: { service: service._id },
                        }}
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
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-16 bg-gradient-to-r from-blue-50 to-cyan-50 p-8 rounded-2xl border border-blue-100"
            >
              <div className="max-w-3xl mx-auto text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Why Choose Our Services?
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                  <div className="p-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Clock className="w-6 h-6 text-blue-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Quick Service
                    </h4>
                    <p className="text-sm text-gray-600">
                      Efficient and timely service to get you back on the road
                    </p>
                  </div>
                  <div className="p-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Shield className="w-6 h-6 text-blue-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Quality Guarantee
                    </h4>
                    <p className="text-sm text-gray-600">
                      Premium products and expert technicians
                    </p>
                  </div>
                  <div className="p-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Award className="w-6 h-6 text-blue-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Satisfaction
                    </h4>
                    <p className="text-sm text-gray-600">
                      100% satisfaction or your money back
                    </p>
                  </div>
                </div>
                <div className="mt-10">
                  <Link
                    href="/services"
                    className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200 shadow-md hover:shadow-lg"
                  >
                    Explore All Services
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </div>
    </section>
  );
}
