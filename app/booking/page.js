"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  Calendar,
  CheckCircle,
  Clock,
  User,
  Car as CarIcon,
  Shield,
  Sparkles,
  Droplets,
  Sun,
  ChevronRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { API_ENDPOINTS } from "@/lib/api-config";
import { toast } from "react-toastify";

// Import custom components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

export const dynamic = "force-dynamic";

// Constants
const VEHICLE_TYPES = [
  "Sedan",
  "SUV",
  "Hatchback",
  "Luxury Car",
  "Truck",
  "Van",
  "Motorcycle",
];

const TIME_SLOTS = [
  "08:00 AM",
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
  "06:00 PM",
];

const SERVICE_CATEGORIES = [
  { id: "all", name: "All Services" },
  { id: "basic", name: "Basic Wash" },
  { id: "deluxe", name: "Deluxe Wash" },
  { id: "premium", name: "Premium Wash" },
  { id: "interior", name: "Interior Detailing" },
  { id: "full", name: "Full Detailing" },
];

const INFO_CARDS = [
  {
    title: "Booking Confirmation",
    description:
      "You will receive a confirmation email and SMS within 2 hours of booking.",
  },
  {
    title: "Arrival Time",
    description: "Please arrive 5-10 minutes before your scheduled time.",
  },
  {
    title: "Cancellation Policy",
    description: "Free cancellation up to 24 hours before your appointment.",
  },
  {
    title: "Payment",
    description:
      "We accept all major credit cards and digital wallets. Payment is due at the time of service.",
  },
  {
    title: "Service Guarantee",
    description:
      "Not satisfied? Let us know within 24 hours and we'll make it right.",
  },
  {
    title: "Payment",
    description:
      "Payment is due at the time of service. We accept all payment methods.",
  },
];

// Utility function to get minimum booking date
const getMinBookingDate = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split("T")[0];
};

export default function BookingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // State management
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [selectedService, setSelectedService] = useState(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const [showSuccess, setShowSuccess] = useState(false);
  const [servicesError, setServicesError] = useState(null);

  const [formData, setFormData] = useState({
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    vehicle_type: "",
    vehicle_number: "",
    booking_date: getMinBookingDate(),
    booking_time: "",
    notes: "",
  });

  // Redirect to signin if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin?callbackUrl=/booking");
    }
  }, [status, router]);

  // Fetch services
  const fetchServices = useCallback(async () => {
    try {
      const response = await fetch(API_ENDPOINTS.services);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to fetch services: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();

      // Handle different response formats
      let servicesData = [];
      if (Array.isArray(data)) {
        servicesData = data;
      } else if (data && Array.isArray(data.services)) {
        servicesData = data.services;
      } else if (data && data.data && Array.isArray(data.data)) {
        servicesData = data.data;
      }

      setServices(servicesData);
      setServicesError(null);
    } catch (error) {
      setServicesError(error.message);
      toast.error("Failed to load services. Please try again later.");
      setServices([]); // Ensure services is always an array
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === "authenticated") {
      fetchServices().then(() => {
      });
    }
  }, [status, fetchServices]);

  useEffect(() => {
    const handleRouteChange = () => {
      if (typeof window === 'undefined') return;
      
      const searchParams = new URLSearchParams(window.location.search);
      const serviceParam = searchParams.get("service");

      if (serviceParam && services.length > 0) {
        let matchedService = services.find(
          (service) =>
            service.name.toLowerCase().replace(/\s+/g, "-") === serviceParam
        );

        if (!matchedService) {
          const searchTerm = serviceParam.replace(/[-_]/g, ' ').toLowerCase();
          matchedService = services.find(service => 
            service.name.toLowerCase().includes(searchTerm) ||
            (service._id && service._id === serviceParam)
          );
        }

        if (matchedService) {
          setSelectedService(matchedService);
          setActiveStep(2);
          
          setFormData(prev => ({
            ...prev,
            service_id: matchedService._id,
            service_name: matchedService.name,
            
            ...(matchedService.price && { service_price: matchedService.price }),
          }));
          
          const cleanServiceName = matchedService.name.toLowerCase().replace(/\s+/g, '-');
          if (serviceParam !== cleanServiceName) {
            const newUrl = new URL(window.location);
            newUrl.searchParams.set('service', cleanServiceName);
            window.history.replaceState({}, '', newUrl.toString());
          }
          
          setTimeout(() => {
            const formSection = document.getElementById("booking-form");
            if (formSection) {
              formSection.scrollIntoView({ behavior: "smooth" });
            }
          }, 100);
        } else {
          toast.warning('The selected service could not be found. Please select a different service.');
        }
      }
    };

    handleRouteChange();

    window.addEventListener("popstate", handleRouteChange);

    return () => {
      window.removeEventListener("popstate", handleRouteChange);
    };
  }, [services]);

  useEffect(() => {
    if (session?.user) {
      setFormData((prev) => ({
        ...prev,
        customer_name: session.user.name || "",
        customer_email: session.user.email || "",
        customer_phone: session.user.phone || "",
      }));
    }
  }, [session]);

  const handleServiceSelect = useCallback((service) => {
    setSelectedService(service);
    setActiveStep(2);
  }, []);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (!selectedService) {
        toast.error("Please select a service");
        setSubmitting(false);
        return;
      }

      if (
        !formData.customer_name ||
        !formData.customer_email ||
        !formData.customer_phone ||
        !formData.vehicle_type ||
        !formData.vehicle_number ||
        !formData.booking_date ||
        !formData.booking_time
      ) {
        toast.error("Please fill in all required fields");
        setSubmitting(false);
        return;
      }

      const bookingData = {
        service: selectedService.name,
        service_id: selectedService._id,
        date: formData.booking_date,
        time: formData.booking_time,
        vehicleType: formData.vehicle_type,
        vehicleNumber: formData.vehicle_number,
        customer_name: formData.customer_name,
        customer_email: formData.customer_email,
        customer_phone: formData.customer_phone,
        notes: formData.notes || "",
        status: "pending",
        price: selectedService.price,
        ...(session?.user?.id && { userId: session.user.id }),
      };

      let response;
      try {
        response = await fetch("/api/bookings", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bookingData),
        });
      } catch (networkError) {
        console.error("Network error:", networkError);
        toast.error(networkError.message);
        throw new Error(
          "Unable to connect to the server. Please check your internet connection and try again."
        );
      }

      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        console.error("JSON parse error:", jsonError);
        toast.error(jsonError.message);
        throw new Error(
          "Server returned an invalid response. Please try again later."
        );
      }

      if (!response.ok) {
        console.error("Booking API error:", data);
        toast.error(data.message);
        throw new Error(
          data.message || "Failed to create booking. Please try again."
        );
      }

      toast.success("Booking confirmed! Check your email for details.");
      setShowSuccess(true);

      setFormData((prev) => ({
        ...prev,
        vehicle_type: "",
        vehicle_number: "",
        booking_date: getMinBookingDate(),
        booking_time: "",
        notes: "",
      }));
    } catch (error) {
      console.error("Booking error:", error);

      // Show specific error messages based on error type
      if (
        error.message.includes("Failed to fetch") ||
        error.message.includes("NetworkError")
      ) {
        toast.error(
          "Unable to connect to the server. Please check your internet connection and try again."
        );
      } else if (error.message.includes("invalid response")) {
        toast.error("Server is not responding. Please try again later.");
      } else {
        toast.error(
          error.message || "Failed to create booking. Please try again."
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = useCallback(() => {
    setShowSuccess(false);
    setActiveStep(1);
    setSelectedService(null);
  }, []);

  const handleNewBooking = useCallback(() => {
    setShowSuccess(false);
    setActiveStep(1);
    setSelectedService(null);
    // Scroll to top of the page
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Filter services by category
  const filteredServices = Array.isArray(services)
    ? services.filter((service) => {
        if (!service || !service.name) return false;
        if (activeCategory === "all") return true;
        if (activeCategory === "basic" && service.name.includes("Basic"))
          return true;
        if (activeCategory === "deluxe" && service.name.includes("Deluxe"))
          return true;
        if (activeCategory === "premium" && service.name.includes("Premium"))
          return true;
        if (activeCategory === "interior" && service.name.includes("Interior"))
          return true;
        if (activeCategory === "full" && service.name.includes("Full"))
          return true;
        return false;
      })
    : [];

  // Loading state
  if (status === "loading" || (status === "authenticated" && loading)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    );
  }

  // Unauthenticated state
  if (status !== "authenticated") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      {/* Success Modal */}
      {showSuccess && (
        <motion.div
          initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
          animate={{ opacity: 1, backdropFilter: "blur(4px)" }}
          exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
          className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && resetForm()}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{
              type: "spring",
              duration: 0.5,
              bounce: 0.3,
            }}
            className="bg-white p-8 rounded-2xl max-w-md w-full shadow-2xl border border-gray-100"
          >
            <div className="text-center">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{
                  scale: 1,
                  rotate: 0,
                  transition: {
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                  },
                }}
                className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg"
              >
                <CheckCircle
                  className="w-10 h-10 text-white"
                  strokeWidth={2.5}
                />
              </motion.div>
              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.3 }}
                className="text-3xl font-bold text-gray-900 mb-3"
              >
                Booking Confirmed! 🎉
              </motion.h3>
              <motion.p
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                className="text-gray-600 mb-8 leading-relaxed"
              >
                We have sent a confirmation to{" "}
                <span className="font-semibold text-blue-600">
                  {formData.customer_email}
                </span>
                . Please check your inbox and spam folder.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.35 }}
                className="flex flex-col gap-4 pt-6"
              >
                {/* Primary Action */}
                <Button
                  onClick={handleNewBooking}
                  className="relative h-12 w-full sm:w-auto px-12 rounded-xl
               font-semibold text-white
               bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700
               shadow-[0_12px_30px_rgba(79,70,229,0.45)]
               hover:shadow-[0_16px_40px_rgba(79,70,229,0.6)]
               hover:from-blue-700 hover:to-indigo-800
               transition-all duration-300
               transform hover:-translate-y-0.5"
                >
                  Make Another Booking
                </Button>

                {/* Secondary Action */}
                <Button
                  asChild
                  variant="ghost"
                  className="h-11 w-full sm:w-auto rounded-lg
               text-gray-600 hover:text-gray-900
               hover:bg-gray-100 transition-all duration-300"
                >
                  <Link href="/my-bookings">View My Bookings →</Link>
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Hero Section */}
    <section className="relative py-16 sm:py-20 md:py-28 lg:py-32 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white overflow-hidden">
  {/* Background Layers */}
  <div className="absolute inset-0 z-0">
    <div className="absolute inset-0 bg-black/30" />
    <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/380768/pexels-photo-380768.jpeg')] bg-cover bg-center opacity-20" />
  </div>

  <div className="container mx-auto px-4 sm:px-6 relative z-10">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="max-w-4xl mx-auto text-center"
    >
      {/* Badge */}
      <span className="inline-flex items-center justify-center px-4 py-2 mb-6 text-xs sm:text-sm font-semibold text-blue-100 bg-blue-500/30 rounded-full backdrop-blur-sm">
        Our Journey Since 2008
      </span>

      {/* Heading */}
      <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-5 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">
        Book Your Service
      </h1>

      {/* Subtitle */}
      <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed px-2 sm:px-0">
        Shine Bright with Our Premium Car Wash Services
      </p>

      {/* Feature Chips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="mt-8 sm:mt-10 flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4"
      >
        {[
          { icon: <Droplets className="w-4 h-4 sm:w-5 sm:h-5 text-blue-300" />, text: 'Eco-Friendly' },
          { icon: <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-green-300" />, text: '100% Satisfaction' },
          { icon: <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300" />, text: 'Quick Service' },
          { icon: <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-300" />, text: 'Streak-Free Finish' },
        ].map((item, index) => (
          <motion.div
            key={index}
            whileHover={{ y: -3 }}
            className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl border border-white/10 hover:border-white/20 transition-all"
          >
            {item.icon}
            <span className="text-xs sm:text-sm font-medium text-white whitespace-nowrap">
              {item.text}
            </span>
          </motion.div>
        ))}
      </motion.div>

      {/* CTA */}
      <motion.div
        className="mt-10 sm:mt-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
      >
        <a
          href="/booking"
          className="inline-flex w-full sm:w-auto items-center justify-center px-6 sm:px-8 py-3.5 sm:py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
        >
          <Calendar className="w-5 h-5 mr-2" />
          Book Your Wash Now
        </a>

        <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-blue-200/80">
          Easy online booking • Instant confirmation • Flexible scheduling
        </p>
      </motion.div>
    </motion.div>
  </div>
</section>


      {/* Booking Form Section */}
      <section
        id="booking-form"
        className="py-12 md:py-20 bg-gradient-to-b from-white to-gray-50"
      >
        <div className="container mx-auto px-4">
          <motion.div
            className="max-w-5xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-shadow duration-300"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Decorative header */}
            <div className="h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>

            <div className="p-6 sm:p-8 md:p-10">
              <motion.div
                className="mb-8 text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                  Book Your Service
                </h2>
                <p className="text-gray-500 max-w-2xl mx-auto">
                  {activeStep === 1
                    ? "Select from our range of premium car care services"
                    : "Fill in your details to complete the booking"}
                </p>
              </motion.div>

              {/* Progress Steps */}
              <motion.div
                className="relative mb-12 mx-auto max-w-md"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center justify-between">
                  {[
                    {
                      step: 1,
                      label: "Choose Service",
                      icon: <Sparkles className="w-4 h-4" />,
                    },
                    {
                      step: 2,
                      label: "Your Details",
                      icon: <User className="w-4 h-4" />,
                    },
                  ].map(({ step, label, icon }, index) => (
                    <div
                      key={step}
                      className="flex flex-col items-center relative z-10 flex-1"
                    >
                      <motion.div
                        className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 ${
                          activeStep >= step
                            ? "bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 transform scale-110"
                            : "bg-gray-100 text-gray-400"
                        }`}
                        whileHover={activeStep >= step ? { scale: 1.1 } : {}}
                        whileTap={activeStep >= step ? { scale: 0.95 } : {}}
                      >
                        {activeStep > step ? (
                          <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6" />
                        ) : (
                          <span className="flex items-center justify-center">
                            {activeStep === step ? step : icon}
                          </span>
                        )}
                      </motion.div>
                      <span
                        className={`text-xs sm:text-sm font-medium mt-3 text-center ${
                          activeStep >= step
                            ? "text-gray-800 font-semibold"
                            : "text-gray-400"
                        }`}
                      >
                        {label}
                      </span>
                      {index < 1 && (
                        <div
                          className={`hidden sm:block absolute left-3/4 w-full h-1.5 top-5 rounded-full ${
                            activeStep > step
                              ? "bg-gradient-to-r from-blue-400 to-indigo-400"
                              : "bg-gray-200"
                          }`}
                        ></div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Progress bar */}
                <div className="mt-8 w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                    initial={{ width: activeStep === 1 ? "50%" : "100%" }}
                    animate={{ width: activeStep === 1 ? "50%" : "100%" }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                  />
                </div>
              </motion.div>

              {/* Step 1: Service Selection */}
              {activeStep === 1 && (
                <motion.div
                  className="space-y-8"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  {/* Category Tabs */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Tabs
                      value={activeCategory}
                      onValueChange={setActiveCategory}
                      className="w-full"
                    >
                      <TabsList className="flex w-full overflow-x-auto pb-2 sm:pb-0 sm:justify-center gap-2 p-1 bg-gray-50 rounded-xl border border-gray-100">
                        {SERVICE_CATEGORIES.map((category) => (
                          <TabsTrigger
                            key={category.id}
                            value={category.id}
                            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                              activeCategory === category.id
                                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                            }`}
                          >
                            {category.name}
                          </TabsTrigger>
                        ))}
                      </TabsList>
                    </Tabs>
                  </motion.div>

                  {/* Services Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5">
                    {loading ? (
                      // Loading Skeleton
                      [...Array(6)].map((_, i) => (
                        <div
                          key={i}
                          className="bg-gray-50 rounded-2xl p-6 animate-pulse h-64 border border-gray-100"
                        >
                          <div className="h-5 bg-gray-200 rounded-full w-3/4 mb-4"></div>
                          <div className="h-3 bg-gray-200 rounded-full w-1/4 mb-6"></div>
                          <div className="space-y-2">
                            <div className="h-3 bg-gray-200 rounded-full"></div>
                            <div className="h-3 bg-gray-200 rounded-full w-5/6"></div>
                            <div className="h-3 bg-gray-200 rounded-full w-4/6"></div>
                          </div>
                        </div>
                      ))
                    ) : Array.isArray(filteredServices) &&
                      filteredServices.length > 0 ? (
                      // Services List
                      filteredServices.map((service, index) => (
                        <motion.div
                          key={service._id || service.id || index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            delay: Math.min(index * 0.05, 0.4),
                            duration: 0.4,
                          }}
                          onClick={() => handleServiceSelect(service)}
                          whileHover={{
                            y: -5,
                            boxShadow:
                              "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
                          }}
                          whileTap={{ scale: 0.98 }}
                          className="group relative bg-white rounded-2xl p-6 cursor-pointer overflow-hidden border border-gray-100 hover:border-blue-100 transition-all duration-300 h-full flex flex-col"
                        >
                          {/* Hover effect background */}
                          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                          {/* Animated gradient blob */}
                          <motion.div
                            className="absolute -top-4 -right-4 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all duration-700"
                            animate={{
                              scale: [1, 1.2, 1],
                              rotate: [0, 10, 0],
                            }}
                            transition={{
                              duration: 8,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                          />

                          <div className="relative z-10 flex-1 flex flex-col">
                            {/* Service header with price */}
                            <div className="flex items-start justify-between mb-4">
                              <h4 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                                {service.name}
                              </h4>
                              <motion.span
                                whileHover={{
                                  scale: 1.05,
                                  rotate: [0, -5, 5, 0],
                                  transition: { duration: 0.5 },
                                }}
                                className="px-3 py-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full text-sm font-semibold shadow-md group-hover:shadow-lg whitespace-nowrap"
                              >
                                ₹
                                {service.price
                                  ? service.price.toFixed(2)
                                  : "0.00"}
                              </motion.span>
                            </div>

                            {/* Service description */}
                            <p className="text-gray-600 text-sm mb-6 line-clamp-3 flex-1">
                              {service.description ||
                                "Professional cleaning service for your vehicle"}
                            </p>

                            {/* Service footer */}
                            <div className="mt-auto pt-4 border-t border-gray-100 group-hover:border-gray-200 transition-colors">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center text-sm text-gray-500 group-hover:text-gray-600 transition-colors">
                                  <Clock className="w-4 h-4 mr-1.5 text-blue-500" />
                                  <span>{service.duration || 30} min</span>
                                </div>
                                <motion.span
                                  className="inline-flex items-center text-sm font-medium text-blue-600 group-hover:text-blue-700 transition-colors"
                                  whileHover={{ x: 3 }}
                                >
                                  Select Service
                                  <motion.svg
                                    className="w-4 h-4 ml-1.5"
                                    animate={{ x: [0, 3, 0] }}
                                    transition={{
                                      duration: 1.5,
                                      repeat: Infinity,
                                    }}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                                    />
                                  </motion.svg>
                                </motion.span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      // No services found
                      <motion.div
                        className="col-span-full text-center py-12 px-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        <div className="flex justify-center mb-4">
                          <CarIcon className="w-14 h-14 text-gray-300" />
                        </div>
                        <h4 className="text-lg font-medium text-gray-700 mb-2">
                          No services found
                        </h4>
                        <p className="text-gray-500 max-w-md mx-auto">
                          We could not find any services matching your
                          selection. Try choosing a different category or check
                          back later.
                        </p>
                        <Button
                          variant="outline"
                          className="mt-4 border-gray-300"
                          onClick={() => setActiveCategory("all")}
                        >
                          Show All Services
                        </Button>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Step 2: Booking Details */}
              {activeStep === 2 && (
                <motion.div
                  id="booking-form"
                  className="relative"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  {/* Card */}
                  <div className="max-w-5xl mx-auto rounded-2xl border border-gray-200 bg-white/90 backdrop-blur-xl shadow-xl p-6 md:p-10">
                    {/* Header */}
                    <motion.div
                      className="text-center mb-10"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <h3 className="text-3xl font-bold text-gray-900">
                        Your Booking Details
                      </h3>
                      <p className="mt-2 text-gray-500 max-w-xl mx-auto">
                        Fill in your contact and vehicle information to confirm
                        your service appointment.
                      </p>
                    </motion.div>

                    <form onSubmit={handleSubmit} className="space-y-10">
                      {/* Form Grid */}
                      <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 gap-6"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        {/* Reusable input wrapper style */}
                        {[
                          {
                            label: "Full Name",
                            id: "customer_name",
                            icon: <User className="h-4 w-4" />,
                            placeholder: "John Doe",
                            required: true,
                          },
                        ].map(() => null)}

                        {/* Full Name */}
                        <div className="space-y-1.5">
                          <Label className="text-sm font-medium text-gray-700">
                            Full Name <span className="text-red-500">*</span>
                          </Label>
                          <div className="relative group">
                            <span className="absolute inset-y-0 left-3 flex items-center text-gray-400 group-focus-within:text-blue-600 transition">
                              <User className="h-4 w-4" />
                            </span>
                            <Input
                              name="customer_name"
                              value={formData.customer_name}
                              onChange={handleInputChange}
                              placeholder="John Doe"
                              required
                              className="pl-10 h-11 rounded-lg bg-gray-50 border border-gray-300 text-gray-800 placeholder-gray-400
                           focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
                           transition"
                            />
                          </div>
                        </div>

                        {/* Email */}
                        <div className="space-y-1.5">
                          <Label className="text-sm font-medium text-gray-700">
                            Email Address{" "}
                            <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            type="email"
                            name="customer_email"
                            value={formData.customer_email}
                            onChange={handleInputChange}
                            placeholder="your@email.com"
                            disabled={!!session?.user?.email}
                            required
                            className="h-11 rounded-lg bg-gray-50 border border-gray-300 text-gray-800 placeholder-gray-400
                         focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                          />
                        </div>

                        {/* Phone */}
                        <div className="space-y-1.5">
                          <Label className="text-sm font-medium text-gray-700">
                            Phone Number <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            type="tel"
                            name="customer_phone"
                            value={formData.customer_phone}
                            onChange={handleInputChange}
                            placeholder="+91 98765 43210"
                            required
                            className="h-11 rounded-lg bg-gray-50 border border-gray-300 text-gray-800 placeholder-gray-400
                         focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                          />
                        </div>

                        {/* Vehicle Type */}
                        <div className="space-y-1.5">
                          <Label className="text-sm font-medium text-gray-700">
                            Vehicle Type <span className="text-red-500">*</span>
                          </Label>
                          <select
                            name="vehicle_type"
                            value={formData.vehicle_type}
                            onChange={handleInputChange}
                            required
                            className="h-11 w-full rounded-lg bg-gray-50 border border-gray-300 px-3 text-gray-800 placeholder-gray-400
                         focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                          >
                            <option value="">Select vehicle type</option>
                            {VEHICLE_TYPES.map((type) => (
                              <option key={type} value={type}>
                                {type}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Vehicle Number */}
                        <div className="space-y-1.5">
                          <Label className="text-sm font-medium text-gray-700">
                            Vehicle Number{" "}
                            <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            name="vehicle_number"
                            value={formData.vehicle_number}
                            onChange={handleInputChange}
                            placeholder="MH 12 AB 1234"
                            required
                            className="h-11 rounded-lg bg-gray-50 border border-gray-300 font-mono uppercase
                         focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                          />
                        </div>

                        {/* Date */}
                        <div className="space-y-1.5">
                          <Label className="text-sm font-medium text-gray-700">
                            Booking Date <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            type="date"
                            name="booking_date"
                            value={formData.booking_date}
                            onChange={handleInputChange}
                            min={getMinBookingDate()}
                            required
                            className="h-11 rounded-lg bg-gray-50 border border-gray-300 text-gray-800 placeholder-gray-400
                         focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                          />
                        </div>

                        {/* Time */}
                        <div className="space-y-1.5">
                          <Label className="text-sm font-medium text-gray-700">
                            Preferred Time{" "}
                            <span className="text-red-500">*</span>
                          </Label>
                          <select
                            name="booking_time"
                            value={formData.booking_time}
                            onChange={handleInputChange}
                            required
                            className="h-11 w-full rounded-lg bg-gray-50 border border-gray-300 px-3 text-gray-800 placeholder-gray-400
                         focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                          >
                            <option value="">Select time slot</option>
                            {TIME_SLOTS.map((time) => (
                              <option key={time} value={time}>
                                {time}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Notes */}
                        <div className="md:col-span-2 space-y-1.5">
                          <Label className="text-sm font-medium text-gray-700">
                            Special Instructions
                          </Label>
                          <Textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleInputChange}
                            rows={3}
                            placeholder="Any special requests or notes for our team..."
                            className="w-full h-11 rounded-lg bg-gray-50 border border-gray-300 text-gray-800 placeholder-gray-400
                         focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                          />
                        </div>
                      </motion.div>

                      {/* Footer Buttons */}
                      {/* Footer Buttons */}
                      <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-4 pt-8 border-t border-gray-200">
                        {/* Back */}
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => setActiveStep(1)}
                          className="h-11 px-6 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition"
                        >
                          <span className="mr-2 text-lg">←</span>
                          Back to Services
                        </Button>

                        {/* Submit */}
                        <Button
                          type="submit"
                          disabled={submitting}
                          className="relative h-12 px-10 rounded-xl font-semibold text-white
               bg-gradient-to-r from-blue-600 to-indigo-600
               hover:from-blue-700 hover:to-indigo-700
               shadow-lg hover:shadow-xl
               transition-all duration-300 transform hover:-translate-y-0.5"
                        >
                          {submitting ? (
                            <span className="flex items-center gap-2">
                              <svg
                                className="h-4 w-4 animate-spin"
                                viewBox="0 0 24 24"
                              />
                              Processing...
                            </span>
                          ) : (
                            <span className="flex items-center gap-2">
                              Confirm Booking
                              <span className="text-lg">✓</span>
                            </span>
                          )}
                        </Button>
                      </div>
                    </form>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
          {/* Booking Summary Card */}
          {selectedService && (
            <motion.div
              className="max-w-5xl mx-auto mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-xl overflow-hidden border border-blue-500/20">
                <div className="p-6 md:p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-white">
                      Booking Summary
                    </h3>
                    <div className="p-2 bg-white/10 rounded-lg">
                      <CarIcon className="w-5 h-5 text-white" />
                    </div>
                  </div>

                  <div className="space-y-5">
                    {/* Service */}
                    <div className="flex items-start justify-between pb-4 border-b border-blue-500/20">
                      <div>
                        <div className="text-blue-100 text-sm font-medium mb-1">
                          Service
                        </div>
                        <div className="font-semibold text-white">
                          {selectedService.name}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-blue-100 text-sm font-medium mb-1">
                          Price
                        </div>
                        <div className="text-2xl font-bold text-white">
                          ₹{selectedService.price?.toFixed(2) || "0.00"}
                        </div>
                      </div>
                    </div>

                    {/* Duration */}
                    {selectedService.duration && (
                      <div className="flex items-center justify-between py-3 border-b border-blue-500/10">
                        <div className="flex items-center text-blue-100">
                          <Clock className="w-4 h-4 mr-2" />
                          <span>Duration</span>
                        </div>
                        <span className="font-medium text-white">
                          {selectedService.duration} minutes
                        </span>
                      </div>
                    )}

                    {/* Date */}
                    {formData.booking_date && (
                      <div className="flex items-center justify-between py-3 border-b border-blue-500/10">
                        <div className="flex items-center text-blue-100">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span>Date</span>
                        </div>
                        <span className="font-medium text-white text-right">
                          {new Date(
                            formData.booking_date + "T00:00:00"
                          ).toLocaleDateString("en-IN", {
                            weekday: "short",
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                    )}

                    {/* Time */}
                    {formData.booking_time && (
                      <div className="flex items-center justify-between py-3 border-b border-blue-500/10">
                        <div className="flex items-center text-blue-100">
                          <Clock className="w-4 h-4 mr-2" />
                          <span>Time</span>
                        </div>
                        <span className="font-medium text-white">
                          {formData.booking_time}
                        </span>
                      </div>
                    )}

                    {/* Vehicle Info */}
                    {formData.vehicle_type && (
                      <div className="flex items-center justify-between py-3">
                        <div className="flex items-center text-blue-100">
                          <CarIcon className="w-4 h-4 mr-2" />
                          <span>Vehicle</span>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-white">
                            {formData.vehicle_type}
                          </div>
                          {formData.vehicle_number && (
                            <div className="text-sm text-blue-100 font-mono">
                              {formData.vehicle_number}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 pt-6 border-t border-blue-500/20">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-blue-100">Total Amount</span>
                      <span className="text-2xl font-bold text-white">
                        ₹{selectedService.price?.toFixed(2) || "0.00"}
                      </span>
                    </div>
                    <div className="text-xs text-blue-200/80 text-center mt-4">
                      * Payment will be collected at the time of service
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Info Section with animations */}
      <section className="py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block px-3 py-1 text-sm font-medium bg-blue-100 text-blue-700 rounded-full mb-4">
                What to Expect
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Your Car Deserves the Best Care
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto rounded-full"></div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {INFO_CARDS.map((info, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{
                    delay: index * 0.1,
                    duration: 0.5,
                    type: "spring",
                    stiffness: 100,
                    damping: 10,
                  }}
                  whileHover={{
                    y: -5,
                    boxShadow:
                      "0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)",
                  }}
                  className="group bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-blue-100"
                >
                  <div className="flex items-start gap-5">
                    <motion.div
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300"
                      style={{
                        background:
                          "linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)",
                        boxShadow: "0 4px 15px -3px rgba(99, 102, 241, 0.3)",
                      }}
                      whileHover={{
                        scale: 1.1,
                        rotate: [0, -5, 5, 0],
                        transition: { duration: 0.5 },
                      }}
                    >
                      {index === 0 ? (
                        <CheckCircle
                          className="w-6 h-6 text-white"
                          strokeWidth={2}
                        />
                      ) : index === 1 ? (
                        <Clock className="w-6 h-6 text-white" strokeWidth={2} />
                      ) : index === 2 ? (
                        <svg
                          className="w-6 h-6 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      ) : index === 3 ? (
                        <svg
                          className="w-6 h-6 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                          />
                        </svg>
                      ) : index === 4 ? (
                        <Shield
                          className="w-6 h-6 text-white"
                          strokeWidth={2}
                        />
                      ) : (
                        <svg
                          className="w-6 h-6 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13 10V3L4 14h7v7l9-11h-7z"
                          />
                        </svg>
                      )}
                    </motion.div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {info.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {info.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CTA at the bottom */}
            <motion.div
              className="mt-16 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Ready to Get Started?
              </h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Book your car wash service today and experience the difference
                of professional car care.
              </p>
              <Button
                asChild
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 px-8 py-6 text-base"
              >
                <Link href="#booking-form">
                  Book Your Wash Now
                  <svg
                    className="w-4 h-4 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
