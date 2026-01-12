"use client";

import { useState, useEffect, useCallback,useRef } from "react";
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
  Loader2,
  XCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
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

// Utility function to get minimum booking date (allow today)
const getMinBookingDate = () => {
  const today = new Date();
  return today.toISOString().split("T")[0];
};

// Utility function to get today's date
const getTodayDate = () => {
  const today = new Date();
  return today.toISOString().split("T")[0];
};

export default function BookingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // State management
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [isVehicleTypeOpen, setIsVehicleTypeOpen] = useState(false);
  const [isTimeSlotOpen, setIsTimeSlotOpen] = useState(false);
  const vehicleTypeRef = useRef(null);
  const timeSlotRef = useRef(null);
  const dropdownRef = useRef(null);
  const timeSlotDropdownRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Handle vehicle type dropdown
      if (vehicleTypeRef.current && !vehicleTypeRef.current.contains(event.target) &&
          dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsVehicleTypeOpen(false);
      }
      // Handle time slot dropdown
      if (timeSlotRef.current && !timeSlotRef.current.contains(event.target) &&
          timeSlotDropdownRef.current && !timeSlotDropdownRef.current.contains(event.target)) {
        setIsTimeSlotOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  const [selectedService, setSelectedService] = useState(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const [showSuccess, setShowSuccess] = useState(false);
  const [servicesError, setServicesError] = useState(null);
  const [availability, setAvailability] = useState([]);
  const [loadingAvailability, setLoadingAvailability] = useState(false);
  const [showBookingSummary, setShowBookingSummary] = useState(false);
  const [autoConfirmTimer, setAutoConfirmTimer] = useState(30);
  const [isAutoConfirming, setIsAutoConfirming] = useState(false);

  const [formData, setFormData] = useState({
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    vehicle_type: "",
    vehicle_number: "",
    booking_date: getTodayDate(),
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

  // Helper function to check if a time slot is in the past
  const isTimeSlotPast = useCallback((timeStr, selectedDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDateOnly = new Date(selectedDate);
    selectedDateOnly.setHours(0, 0, 0, 0);
    const isToday = selectedDateOnly.getTime() === today.getTime();
    
    if (!isToday) return false;
    
    const timeToMinutes = (timeStr) => {
      const [time, period] = timeStr.split(' ');
      const [hours, minutes] = time.split(':').map(Number);
      let totalMinutes = hours * 60 + minutes;
      if (period === 'PM' && hours !== 12) {
        totalMinutes += 12 * 60;
      } else if (period === 'AM' && hours === 12) {
        totalMinutes = minutes;
      }
      return totalMinutes;
    };
    
    const now = new Date();
    const currentHour = now.getHours();
    
    // Calculate next available hour slot
    // If current time is 5:00 PM, next slot is 6:00 PM
    // If current time is 5:30 PM, next slot is still 6:00 PM
    // Round up to next hour boundary
    const nextHour = currentHour + 1;
    const minimumBookingTime = nextHour * 60; // Next hour in minutes (e.g., 6 PM = 18 * 60 = 1080)
    
    // Slot is past if it's before the minimum booking time
    return timeToMinutes(timeStr) < minimumBookingTime;
  }, []);

  // Fetch availability for a given date
  const fetchAvailability = useCallback(async (date) => {
    if (!date) return;
    
    setLoadingAvailability(true);
    try {
      const response = await fetch(`/api/bookings/availability?date=${date}`);
      if (response.ok) {
        const data = await response.json();
        // API already filters past slots, but double-check for safety
        const filteredSlots = (data.availability || []).filter(slot => !isTimeSlotPast(slot.time, date));
        setAvailability(filteredSlots);
      } else {
        // If API fails, filter past slots manually
        const filteredSlots = TIME_SLOTS
          .filter(time => !isTimeSlotPast(time, date))
          .map(time => ({ time, available: true, booked: false }));
        setAvailability(filteredSlots);
      }
    } catch (error) {
      console.error('Error fetching availability:', error);
      // On error, filter past slots manually
      const filteredSlots = TIME_SLOTS
        .filter(time => !isTimeSlotPast(time, date))
        .map(time => ({ time, available: true, booked: false }));
      setAvailability(filteredSlots);
    } finally {
      setLoadingAvailability(false);
    }
  }, [isTimeSlotPast]);

  // Handle URL parameters for date, time, and service
  useEffect(() => {
    const handleRouteChange = () => {
      if (typeof window === 'undefined') return;
      
      const searchParams = new URLSearchParams(window.location.search);
      const serviceParam = searchParams.get("service");
      const dateParam = searchParams.get("date");
      const timeParam = searchParams.get("time");

      // Handle date parameter
      if (dateParam) {
        const date = new Date(dateParam);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (date >= today) {
          setFormData(prev => ({
            ...prev,
            booking_date: dateParam,
          }));
          // Fetch availability for the selected date
          if (dateParam) {
            fetchAvailability(dateParam);
          }
        }
      }

      // Handle time parameter
      if (timeParam) {
        const decodedTime = decodeURIComponent(timeParam);
        setFormData(prev => ({
          ...prev,
          booking_time: decodedTime,
        }));
      }

      // Handle service parameter
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
      } else if (dateParam || timeParam) {
        // If date or time is provided but no service, scroll to form
        setTimeout(() => {
          const formSection = document.getElementById("booking-form");
          if (formSection) {
            formSection.scrollIntoView({ behavior: "smooth" });
          }
        }, 100);
      }
    };

    handleRouteChange();

    window.addEventListener("popstate", handleRouteChange);

    return () => {
      window.removeEventListener("popstate", handleRouteChange);
    };
  }, [services, fetchAvailability]);

  useEffect(() => {
    if (session?.user) {
      setFormData((prev) => ({
        ...prev,
        customer_name: session.user.name || prev.customer_name || "",
        customer_email: session.user.email || prev.customer_email || "",
        customer_phone: session.user.phone || prev.customer_phone || "",
      }));
    }
  }, [session]);

  // Handle actual booking confirmation (API call)
  const handleConfirmBooking = useCallback(async () => {
    setSubmitting(true);

    try {
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
      setShowBookingSummary(false);
      setShowSuccess(true);

      // Refresh notifications after successful booking
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('bookingCreated', { 
          detail: { 
            bookingId: data.booking?.id || data.data?.id,
            booking: data.booking || data.data
          } 
        }));
        
        setTimeout(() => {
          window.dispatchEvent(new Event('refreshNotifications'));
        }, 1500);
      }

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
      setShowBookingSummary(false);

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
      setIsAutoConfirming(false);
    }
  }, [selectedService, formData, session]);

  // Timer effect - closes modal when timer reaches 0
  useEffect(() => {
    let interval = null;
    if (showBookingSummary && autoConfirmTimer > 0 && !isAutoConfirming) {
      interval = setInterval(() => {
        setAutoConfirmTimer((prev) => {
          if (prev <= 1) {
            // Close modal and return to form when timer reaches 0
            setShowBookingSummary(false);
            setAutoConfirmTimer(60);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [showBookingSummary, autoConfirmTimer, isAutoConfirming]);

  const handleServiceSelect = useCallback((service) => {
    setSelectedService(service);
    setActiveStep(2);
  }, []);

  // Vehicle number format validation and formatting
  const formatVehicleNumber = (value) => {
    // Remove all spaces and convert to uppercase
    let cleaned = value.replace(/\s+/g, '').toUpperCase();
    
    // Only allow alphanumeric characters
    cleaned = cleaned.replace(/[^A-Z0-9]/g, '');
    
    // Format: XX XX XX XXXX (e.g., GJ 01 BL 5607)
    if (cleaned.length <= 2) {
      return cleaned;
    } else if (cleaned.length <= 4) {
      return cleaned.slice(0, 2) + ' ' + cleaned.slice(2);
    } else if (cleaned.length <= 6) {
      return cleaned.slice(0, 2) + ' ' + cleaned.slice(2, 4) + ' ' + cleaned.slice(4);
    } else {
      return cleaned.slice(0, 2) + ' ' + cleaned.slice(2, 4) + ' ' + cleaned.slice(4, 6) + ' ' + cleaned.slice(6, 10);
    }
  };

  const validateVehicleNumber = (value) => {
    // Pattern: 2 letters, space, 2 digits, space, 2 letters, space, 4 digits
    const pattern = /^[A-Z]{2}\s\d{2}\s[A-Z]{2}\s\d{4}$/;
    return pattern.test(value);
  };

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      
      // Format vehicle number as user types
      if (name === 'vehicle_number') {
        updated.vehicle_number = formatVehicleNumber(value);
      }
      
      // If date changes, clear selected time and fetch availability
      if (name === 'booking_date') {
        updated.booking_time = '';
        fetchAvailability(value);
      }
      return updated;
    });
  }, [fetchAvailability]);

  // Fetch availability when component mounts or date changes
  useEffect(() => {
    if (formData.booking_date) {
      fetchAvailability(formData.booking_date);
    }
  }, [formData.booking_date, fetchAvailability]);

  // Handle form validation and show summary
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedService) {
      toast.error("Please select a service");
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
      return;
    }

    // Validate vehicle number format
    if (!validateVehicleNumber(formData.vehicle_number)) {
      toast.error("Please enter a valid vehicle number format (e.g., GJ 01 BL 5607)");
      return;
    }

    // Show booking summary modal
    setShowBookingSummary(true);
    setAutoConfirmTimer(60);
    setIsAutoConfirming(false);
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
      {/* Booking Summary Modal */}
      {showBookingSummary && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 sm:p-4 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowBookingSummary(false);
              setAutoConfirmTimer(60);
            }
          }}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl sm:rounded-3xl max-w-lg sm:max-w-2xl w-full shadow-2xl border border-gray-100 max-h-[95vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-4 sm:p-5 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-2xl -mr-24 -mt-24"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl sm:text-2xl font-bold">Booking Summary</h3>
                  <button
                    onClick={() => {
                      setShowBookingSummary(false);
                      setAutoConfirmTimer(30);
                    }}
                    className="p-1.5 sm:p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="flex items-center gap-2 text-blue-100 text-xs sm:text-sm">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Review your booking details</span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-5 space-y-4">
              {/* Session Timer */}
              {autoConfirmTimer > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-amber-50 border-2 border-amber-200 rounded-lg sm:rounded-xl p-3"
                >
                  <div className="flex items-start gap-2 sm:gap-3">
                    <div className="p-1.5 sm:p-2 bg-amber-100 rounded-lg flex-shrink-0">
                      <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-amber-900 text-sm sm:text-base mb-1">
                        Session Timer
                      </h4>
                      <p className="text-xs sm:text-sm text-amber-700 mb-2">
                        Closes in <span className="font-bold text-base sm:text-lg text-amber-900">{autoConfirmTimer}</span>s. Click &quot;Confirm Booking&quot; to proceed.
                      </p>
                      <div className="w-full bg-amber-200 rounded-full h-1.5 sm:h-2">
                        <motion.div
                          className="bg-amber-500 h-full rounded-full"
                          initial={{ width: "100%" }}
                          animate={{ width: `${(autoConfirmTimer / 60) * 100}%` }}
                          transition={{ duration: 1, ease: "linear" }}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Service & Price */}
              <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 mb-0.5">Service</p>
                  <p className="text-base sm:text-lg font-bold text-gray-900 truncate">{selectedService?.name}</p>
                </div>
                <div className="text-right ml-4 flex-shrink-0">
                  <p className="text-xs text-gray-500 mb-0.5">Price</p>
                  <p className="text-xl sm:text-2xl font-bold text-blue-600">
                    ₹{selectedService?.price?.toFixed(2) || "0.00"}
                  </p>
                </div>
              </div>

              {/* Compact Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {/* Personal Info */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-900 text-sm sm:text-base flex items-center gap-1.5">
                    <User className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                    Personal Info
                  </h4>
                  <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                    <div>
                      <p className="text-xs text-gray-500">Name</p>
                      <p className="font-medium text-gray-900 text-sm truncate">{formData.customer_name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="font-medium text-gray-900 text-sm truncate">{formData.customer_email}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Phone</p>
                      <p className="font-medium text-gray-900 text-sm">{formData.customer_phone}</p>
                    </div>
                  </div>
                </div>

                {/* Vehicle Info */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-900 text-sm sm:text-base flex items-center gap-1.5">
                    <CarIcon className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
                    Vehicle Info
                  </h4>
                  <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                    <div>
                      <p className="text-xs text-gray-500">Type</p>
                      <p className="font-medium text-gray-900 text-sm">{formData.vehicle_type}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Number</p>
                      <p className="font-medium text-gray-900 text-sm font-mono">{formData.vehicle_number}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Booking Schedule */}
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900 text-sm sm:text-base flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                  Schedule
                </h4>
                <div className="bg-gray-50 rounded-lg p-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Date</p>
                    <p className="font-medium text-gray-900 text-sm">
                      {new Date(formData.booking_date + "T00:00:00").toLocaleDateString("en-IN", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Time</p>
                    <p className="font-medium text-gray-900 text-sm">{formData.booking_time}</p>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {formData.notes && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-900 text-sm sm:text-base flex items-center gap-1.5">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Notes
                  </h4>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs sm:text-sm text-gray-700 line-clamp-3">{formData.notes}</p>
                  </div>
                </div>
              )}

              {/* Total */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border-2 border-blue-200">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-base sm:text-lg font-semibold text-gray-700">Total</span>
                  <span className="text-2xl sm:text-3xl font-bold text-blue-600">
                    ₹{selectedService?.price?.toFixed(2) || "0.00"}
                  </span>
                </div>
                <p className="text-xs text-gray-500 text-center">
                  * Payment at service time
                </p>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-4 sm:p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setShowBookingSummary(false);
                    setAutoConfirmTimer(30);
                  }}
                  className="h-11 sm:h-12 px-4 sm:px-6 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-200 transition-all duration-200 font-medium text-sm sm:text-base"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleConfirmBooking}
                  disabled={submitting}
                  className="flex-1 h-11 sm:h-12 px-4 sm:px-6 rounded-xl font-bold text-white text-sm sm:text-base
                    bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600
                    hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700
                    shadow-lg hover:shadow-xl
                    transition-all duration-300 transform hover:-translate-y-0.5 hover:scale-105
                    disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none"
                >
                  {submitting ? (
                    <span className="flex items-center justify-center gap-2 sm:gap-3">
                      <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                      <span className="text-xs sm:text-base">Confirming...</span>
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2 sm:gap-3">
                      <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span>Confirm Booking</span>
                    </span>
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

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
    <div className="absolute inset-0 bg-[url(/images/backsection.webp)] bg-cover bg-center opacity-20" />
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
        className="py-8 sm:py-12 md:py-16 lg:py-20 bg-gradient-to-b from-gray-50 via-white to-gray-50 relative overflow-hidden"
      >
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl -mr-48 -mt-48"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-100/30 rounded-full blur-3xl -ml-48 -mb-48"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <motion.div
            className="max-w-6xl mx-auto bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-white/50 hover:shadow-3xl transition-all duration-500"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Modern decorative header with gradient */}
            <div className="relative h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 animate-pulse"></div>
            </div>

            <div className="p-4 sm:p-6 md:p-8 lg:p-10">
              <motion.div
                className="mb-6 sm:mb-8 text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-4 shadow-lg">
                  <Calendar className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
                  Book Your Service
                </h2>
                <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto font-medium">
                  {activeStep === 1
                    ? "Choose from our premium car care services and get your vehicle sparkling clean"
                    : "Complete your booking details to secure your appointment"}
                </p>
              </motion.div>

              {/* Modern Progress Steps */}
              <motion.div
                className="relative mb-8 sm:mb-10 mx-auto max-w-lg"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center justify-between relative">
                  {/* Progress line */}
                  <div className="absolute top-6 left-0 right-0 h-1 bg-gray-200 rounded-full -z-10">
                    <motion.div
                      className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full shadow-lg"
                      initial={{ width: activeStep === 1 ? "0%" : "100%" }}
                      animate={{ width: activeStep === 1 ? "0%" : "100%" }}
                      transition={{ duration: 0.6, ease: "easeInOut" }}
                    />
                  </div>

                  {[
                    {
                      step: 1,
                      label: "Choose Service",
                      icon: <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />,
                    },
                    {
                      step: 2,
                      label: "Your Details",
                      icon: <User className="w-4 h-4 sm:w-5 sm:h-5" />,
                    },
                  ].map(({ step, label, icon }, index) => (
                    <div
                      key={step}
                      className="flex flex-col items-center relative z-10 flex-1"
                    >
                      <motion.div
                        className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center font-bold text-base sm:text-lg transition-all duration-300 shadow-lg ${
                          activeStep >= step
                            ? "bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white shadow-blue-500/50 transform scale-110 ring-4 ring-blue-500/20"
                            : "bg-white text-gray-400 border-2 border-gray-200"
                        }`}
                        whileHover={activeStep >= step ? { scale: 1.15, rotate: 5 } : { scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {activeStep > step ? (
                          <CheckCircle className="w-6 h-6 sm:w-7 sm:h-7" />
                        ) : (
                          <span className="flex items-center justify-center">
                            {activeStep === step ? (
                              <span className="text-lg sm:text-xl font-bold">{step}</span>
                            ) : (
                              icon
                            )}
                          </span>
                        )}
                      </motion.div>
                      <span
                        className={`text-xs sm:text-sm font-semibold mt-3 text-center px-2 py-1 rounded-lg transition-all ${
                          activeStep >= step
                            ? "text-gray-900 bg-blue-50"
                            : "text-gray-500"
                        }`}
                      >
                        {label}
                      </span>
                    </div>
                  ))}
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
                  {/* Modern Category Tabs */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mb-6"
                  >
                    <Tabs
                      value={activeCategory}
                      onValueChange={setActiveCategory}
                      className="w-full"
                    >
                      <TabsList className="flex w-full overflow-x-auto pb-2 sm:pb-0 sm:justify-center gap-2 sm:gap-3 p-1.5 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl border border-gray-200/50 shadow-inner">
                        {SERVICE_CATEGORIES.map((category) => (
                          <TabsTrigger
                            key={category.id}
                            value={category.id}
                            className={`px-4 sm:px-5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-300 ${
                              activeCategory === category.id
                                ? "bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-lg shadow-blue-500/30 transform scale-105"
                                : "text-gray-600 hover:bg-white hover:text-gray-900 hover:shadow-md"
                            }`}
                          >
                            {category.name}
                          </TabsTrigger>
                        ))}
                      </TabsList>
                    </Tabs>
                  </motion.div>

                  {/* Modern Services Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
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
                          whileTap={{ scale: 0.97 }}
                          className="group relative bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 cursor-pointer overflow-hidden border-2 border-gray-100 hover:border-blue-300 transition-all duration-300 h-full flex flex-col shadow-md hover:shadow-xl"
                        >
                          {/* Gradient overlay on hover */}
                          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-indigo-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                          {/* Animated gradient blob */}
                          <motion.div
                            className="absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl group-hover:from-blue-500/30 group-hover:to-purple-500/30 transition-all duration-700"
                            animate={{
                              scale: [1, 1.3, 1],
                              rotate: [0, 15, 0],
                            }}
                            transition={{
                              duration: 8,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                          />

                          {/* Top accent bar */}
                          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                          <div className="relative z-10 flex-1 flex flex-col">
                            {/* Service header with price */}
                            <div className="flex items-start justify-between mb-4 gap-3">
                              <h4 className="text-lg sm:text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors flex-1">
                                {service.name}
                              </h4>
                              <motion.span
                                whileHover={{
                                  scale: 1.1,
                                  rotate: [0, -5, 5, 0],
                                  transition: { duration: 0.5 },
                                }}
                                className="px-3 sm:px-4 py-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white rounded-xl text-sm font-bold shadow-lg group-hover:shadow-xl whitespace-nowrap flex-shrink-0"
                              >
                                ₹{service.price ? service.price.toFixed(2) : "0.00"}
                              </motion.span>
                            </div>

                            {/* Service description */}
                            <p className="text-gray-600 text-sm sm:text-base mb-5 line-clamp-3 flex-1 leading-relaxed">
                              {service.description ||
                                "Professional cleaning service for your vehicle"}
                            </p>

                            {/* Service footer */}
                            <div className="mt-auto pt-4 border-t-2 border-gray-100 group-hover:border-blue-200 transition-colors">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg group-hover:bg-blue-50 transition-colors">
                                  <Clock className="w-4 h-4 text-blue-500" />
                                  <span className="text-sm font-medium text-gray-700">{service.duration || 30} min</span>
                                </div>
                                <motion.span
                                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl text-sm font-semibold shadow-md group-hover:shadow-lg group-hover:from-blue-600 group-hover:to-indigo-600 transition-all"
                                  whileHover={{ x: 3, scale: 1.05 }}
                                >
                                  Select
                                  <motion.svg
                                    className="w-4 h-4"
                                    animate={{ x: [0, 4, 0] }}
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
                  {/* Modern Form Card */}
                  <div className="max-w-5xl mx-auto">
                    {/* Modern Gradient Header */}
                    <motion.div
                      className="relative overflow-hidden rounded-t-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-6 sm:p-8 md:p-10 lg:p-12 text-white"
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      {/* Animated decorative elements */}
                      <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full blur-3xl -mr-36 -mt-36 animate-pulse"></div>
                      <div className="absolute bottom-0 left-0 w-56 h-56 bg-white/10 rounded-full blur-2xl -ml-28 -mb-28"></div>
                      <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-white/5 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2"></div>
                      
                      <div className="relative z-10">
                        <div className="flex items-center justify-center mb-5">
                          <motion.div 
                            className="p-4 bg-white/20 rounded-2xl backdrop-blur-md shadow-xl border border-white/30"
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            transition={{ type: "spring", stiffness: 300 }}
                          >
                            <Calendar className="w-7 h-7 sm:w-8 sm:h-8" />
                          </motion.div>
                        </div>
                        <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-center mb-3 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">
                          Complete Your Booking
                        </h3>
                        <p className="text-blue-100/90 text-center max-w-2xl mx-auto text-sm sm:text-base md:text-lg font-medium">
                          Fill in your details below to secure your car wash appointment. We&apos;ll confirm everything via email.
                        </p>
                      </div>
                    </motion.div>

                    {/* Form Card */}
                    <div className="bg-white rounded-b-3xl shadow-2xl border-t-0 p-4 sm:p-6 md:p-8 lg:p-10">

                    <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
                      {/* Personal Information Section */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mb-6 sm:mb-8"
                      >
                        <div className="flex items-center gap-3 mb-5 sm:mb-6 pb-3 border-b-2 border-blue-200 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 -mx-4 sm:-mx-6 md:-mx-8 lg:-mx-10 px-4 sm:px-6 md:px-8 lg:px-10 rounded-t-xl">
                          <div className="p-2.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                            <User className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                          </div>
                          <h4 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">Personal Information</h4>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                          <div className="space-y-2">
                            <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                              <User className="h-4 w-4 text-blue-600" />
                              Full Name <span className="text-red-500">*</span>
                            </Label>
                            <div className="relative group">
                              <span className="absolute inset-y-0 left-4 flex items-center text-gray-400 group-focus-within:text-blue-600 transition">
                                <User className="h-5 w-5" />
                              </span>
                              <Input
                                name="customer_name"
                                value={formData.customer_name}
                                onChange={handleInputChange}
                                placeholder="John Doe"
                                required
                                className="pl-12 h-12 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-200 text-gray-800 placeholder-gray-400 text-base
                             focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 hover:border-blue-300 hover:shadow-md"
                              />
                            </div>
                          </div>

                          {/* Email */}
                          <div className="space-y-2">
                            <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                              <svg className="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                              Email Address{" "}
                              <span className="text-red-500">*</span>
                            </Label>
                            <div className="relative group">
                              <span className="absolute inset-y-0 left-4 flex items-center text-gray-400 group-focus-within:text-blue-600 transition">
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                              </span>
                              <Input
                                type="email"
                                name="customer_email"
                                value={formData.customer_email}
                                onChange={handleInputChange}
                                placeholder="your@email.com"
                                disabled={!!session?.user?.email}
                                required
                                className="pl-12 h-12 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-200 text-gray-800 placeholder-gray-400 text-base
                             focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 hover:border-blue-300 hover:shadow-md disabled:opacity-60"
                              />
                            </div>
                          </div>

                          {/* Phone */}
                          <div className="space-y-2">
                            <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                              <svg className="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                              </svg>
                              Phone Number <span className="text-red-500">*</span>
                            </Label>
                            <div className="relative group">
                              <span className="absolute inset-y-0 left-4 flex items-center text-gray-400 group-focus-within:text-blue-600 transition">
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                              </span>
                              <Input
                                type="tel"
                                name="customer_phone"
                                value={formData.customer_phone}
                                onChange={handleInputChange}
                                placeholder="+91 98765 43210"
                                required
                                className="pl-12 h-12 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-200 text-gray-800 placeholder-gray-400 text-base
                             focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 hover:border-blue-300 hover:shadow-md"
                              />
                            </div>
                          </div>
                        </div>
                      </motion.div>

                      {/* Vehicle Information Section */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mb-6 sm:mb-8"
                      >
                        <div className="flex items-center gap-3 mb-5 sm:mb-6 pb-3 border-b-2 border-indigo-200 bg-gradient-to-r from-indigo-50/50 to-purple-50/50 -mx-4 sm:-mx-6 md:-mx-8 lg:-mx-10 px-4 sm:px-6 md:px-8 lg:px-10 rounded-t-xl">
                          <div className="p-2.5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
                            <CarIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                          </div>
                          <h4 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">Vehicle Information</h4>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
                          {/* Vehicle Type - Custom Dropdown */}
                          <div className="space-y-2">
                            <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                              <CarIcon className="h-4 w-4 text-indigo-600" />
                              Vehicle Type <span className="text-red-500">*</span>
                              {formData.vehicle_type && (
                                <span className="ml-auto text-xs text-green-600 font-semibold flex items-center gap-1 bg-green-50 px-2 py-1 rounded-full">
                                  <CheckCircle className="h-3 w-3" />
                                  Selected
                                </span>
                              )}
                            </Label>
                            <div className="relative" ref={vehicleTypeRef}>
                              <button
                                type="button"
                                onClick={() => setIsVehicleTypeOpen(!isVehicleTypeOpen)}
                                className={`w-full h-12 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 border-2 ${
                                  formData.vehicle_type ? 'text-gray-800 border-indigo-300 bg-gradient-to-r from-indigo-50 to-purple-50 shadow-md' : 'text-gray-400 border-gray-200'
                                } pl-12 pr-12 text-left flex items-center justify-between ${
                                  isVehicleTypeOpen 
                                    ? 'border-indigo-500 ring-4 ring-indigo-500/20 bg-white shadow-lg' 
                                    : 'hover:border-indigo-300 hover:shadow-md'
                                } transition-all duration-200 group`}
                              >
                                <span className="absolute inset-y-0 left-4 flex items-center text-gray-400 group-hover:text-indigo-600 transition">
                                  <CarIcon className="h-5 w-5" />
                                </span>
                                <span className="font-medium">{formData.vehicle_type || 'Select vehicle type'}</span>
                                <svg 
                                  className={`fill-current h-5 w-5 text-gray-500 transition-transform duration-200 ${
                                    isVehicleTypeOpen ? 'transform rotate-180' : ''
                                  }`} 
                                  xmlns="http://www.w3.org/2000/svg" 
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                </svg>
                              </button>
                            
                            <AnimatePresence>
                              {isVehicleTypeOpen && (
                                <motion.div
                                  ref={dropdownRef}
                                  initial={{ opacity: 0, y: -10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -10 }}
                                  transition={{ duration: 0.2 }}
                                  className="absolute z-10 mt-1 w-full rounded-xl bg-white shadow-xl border border-gray-200 max-h-60 overflow-auto"
                                >
                                  {VEHICLE_TYPES.map((type) => (
                                    <div
                                      key={type}
                                      onClick={() => {
                                        handleInputChange({ target: { name: 'vehicle_type', value: type } });
                                        setIsVehicleTypeOpen(false);
                                      }}
                                      className={`px-4 py-3 text-sm cursor-pointer transition-colors flex items-center gap-2 ${
                                        formData.vehicle_type === type 
                                          ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 font-semibold border-l-4 border-blue-500' 
                                          : 'text-gray-700 hover:bg-gray-50'
                                      }`}
                                    >
                                      {formData.vehicle_type === type && (
                                        <CheckCircle className="w-4 h-4 text-blue-600" />
                                      )}
                                      <span>{type}</span>
                                    </div>
                                  ))}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>

                          {/* Vehicle Number */}
                          <div className="space-y-2">
                            <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                              <svg className="h-4 w-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                              </svg>
                              Vehicle Number{" "}
                              <span className="text-red-500">*</span>
                              {formData.vehicle_number && validateVehicleNumber(formData.vehicle_number) && (
                                <span className="ml-auto text-xs text-green-600 font-semibold flex items-center gap-1 bg-green-50 px-2 py-1 rounded-full">
                                  <CheckCircle className="h-3 w-3" />
                                  Valid
                                </span>
                              )}
                            </Label>
                            <div className="relative group">
                              <span className="absolute inset-y-0 left-4 flex items-center text-gray-400 group-focus-within:text-indigo-600 transition">
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                                </svg>
                              </span>
                              <Input
                                name="vehicle_number"
                                value={formData.vehicle_number}
                                onChange={handleInputChange}
                                placeholder="UP 65 AB 5678"
                                maxLength={13}
                                required
                                className={`pl-12 h-12 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 border-2 font-mono uppercase text-base
                             focus:bg-white focus:ring-4 focus:ring-indigo-500/20 transition-all duration-200 hover:shadow-md
                             ${formData.vehicle_number && validateVehicleNumber(formData.vehicle_number) 
                               ? 'border-green-400 focus:border-green-500' 
                               : formData.vehicle_number && formData.vehicle_number.length > 0
                               ? 'border-yellow-400 focus:border-yellow-500'
                               : 'border-gray-200 focus:border-indigo-500 hover:border-indigo-300'
                             }`}
                              />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              Format: <span className="font-mono font-semibold">UP 65 AB 5678</span>
                            </p>
                            {formData.vehicle_number && !validateVehicleNumber(formData.vehicle_number) && formData.vehicle_number.length > 0 && (
                              <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                                <XCircle className="h-3 w-3" />
                                Please enter a valid vehicle number format
                              </p>
                            )}
                          </div>
                        </div>
                      </motion.div>

                      {/* Booking Schedule Section */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="mb-6 sm:mb-8"
                      >
                        <div className="flex items-center gap-3 mb-5 sm:mb-6 pb-3 border-b-2 border-purple-200 bg-gradient-to-r from-purple-50/50 to-pink-50/50 -mx-4 sm:-mx-6 md:-mx-8 lg:-mx-10 px-4 sm:px-6 md:px-8 lg:px-10 rounded-t-xl">
                          <div className="p-2.5 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg">
                            <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                          </div>
                          <h4 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">Booking Schedule</h4>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6">

                          {/* Date */}
                          <div className="space-y-2">
                            <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-purple-600" />
                              Booking Date <span className="text-red-500">*</span>
                              {formData.booking_date && (
                                <span className="ml-auto text-xs text-green-600 font-semibold flex items-center gap-1 bg-green-50 px-2 py-1 rounded-full">
                                  <CheckCircle className="h-3 w-3" />
                                  Selected
                                </span>
                              )}
                            </Label>
                            <div className="relative group">
                              <span className="absolute inset-y-0 left-4 flex items-center text-gray-400 group-focus-within:text-purple-600 transition pointer-events-none">
                                <Calendar className="h-5 w-5" />
                              </span>
                              <Input
                                type="date"
                                name="booking_date"
                                value={formData.booking_date}
                                onChange={handleInputChange}
                                min={getMinBookingDate()}
                                required
                                className={`pl-12 h-12 rounded-xl border-2 text-gray-800 placeholder-gray-400 text-base
                             focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all duration-200
                             ${formData.booking_date ? 'bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-300 shadow-md' : 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200 hover:border-purple-300 hover:shadow-md'}`}
                              />
                            </div>
                          </div>

                          {/* Preferred Time - Custom Dropdown */}
                          <div className="space-y-2">
                            <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                              <Clock className="h-4 w-4 text-purple-600" />
                              Preferred Time <span className="text-red-500">*</span>
                              {loadingAvailability && (
                                <span className="ml-auto text-xs text-gray-500 flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full">
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                  Checking...
                                </span>
                              )}
                              {formData.booking_time && !loadingAvailability && (
                                <span className="ml-auto text-xs text-green-600 font-semibold flex items-center gap-1 bg-green-50 px-2 py-1 rounded-full">
                                  <CheckCircle className="h-3 w-3" />
                                  Selected
                                </span>
                              )}
                            </Label>
                            <div className="relative" ref={timeSlotRef}>
                              <button
                                type="button"
                                onClick={() => setIsTimeSlotOpen(!isTimeSlotOpen)}
                                disabled={loadingAvailability}
                                className={`w-full h-12 rounded-xl border-2 ${
                                  formData.booking_time ? 'text-gray-800 bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-300 shadow-md' : 'text-gray-400 bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200'
                                } pl-12 pr-12 text-left flex items-center justify-between ${
                                  isTimeSlotOpen 
                                    ? 'border-purple-500 ring-4 ring-purple-500/20 bg-white shadow-lg' 
                                    : 'hover:border-purple-300 hover:shadow-md'
                                } transition-all duration-200 ${loadingAvailability ? 'opacity-50 cursor-not-allowed' : ''} group`}
                              >
                                <span className="absolute inset-y-0 left-4 flex items-center text-gray-400 group-hover:text-purple-600 transition">
                                  <Clock className="h-5 w-5" />
                                </span>
                                <span className="font-medium">{formData.booking_time || 'Select time slot'}</span>
                                <svg 
                                  className={`fill-current h-5 w-5 text-gray-500 transition-transform duration-200 ${
                                    isTimeSlotOpen ? 'transform rotate-180' : ''
                                  }`} 
                                  xmlns="http://www.w3.org/2000/svg" 
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                </svg>
                              </button>
                            
                            <AnimatePresence>
                              {isTimeSlotOpen && (
                                <motion.div
                                  ref={timeSlotDropdownRef}
                                  initial={{ opacity: 0, y: -10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -10 }}
                                  transition={{ duration: 0.2 }}
                                  className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg max-h-60 overflow-auto"
                                >
                                  {availability.length > 0 ? (
                                    availability.map((slot) => {
                                      const isSelected = formData.booking_time === slot.time;
                                      const isAvailable = slot.available;
                                      
                                      return (
                                        <div
                                          key={slot.time}
                                          onClick={() => {
                                            if (isAvailable) {
                                              handleInputChange({ target: { name: 'booking_time', value: slot.time } });
                                              setIsTimeSlotOpen(false);
                                            }
                                          }}
                                          className={`px-4 py-2 text-sm flex items-center justify-between ${
                                            isSelected 
                                              ? 'bg-blue-50 text-blue-700' 
                                              : isAvailable
                                              ? 'text-gray-700 hover:bg-gray-100 cursor-pointer'
                                              : 'text-gray-400 bg-gray-50 cursor-not-allowed opacity-60'
                                          }`}
                                        >
                                          <span className="flex items-center gap-2">
                                            {slot.time}
                                            {!isAvailable && (
                                              <span className="text-xs text-red-500">(Booked)</span>
                                            )}
                                          </span>
                                          {isAvailable && (
                                            <span className="text-xs text-green-600 font-medium">Available</span>
                                          )}
                                        </div>
                                      );
                                    })
                                  ) : (
                                    <div className="px-4 py-3 text-sm text-gray-500 text-center">
                                      No time slots available. Please select a different date.
                                    </div>
                                  )}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                          {availability.length > 0 && (
                            <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                              <span className="font-semibold text-purple-600">{availability.filter(s => s.available).length}</span>
                              <span>of</span>
                              <span className="font-semibold">{availability.filter(s => !s.past).length}</span>
                              <span>slots available</span>
                            </p>
                          )}
                        </div>
                        </div>
                      </motion.div>

                      {/* Additional Notes Section */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="mb-6 sm:mb-8"
                      >
                        <div className="flex items-center gap-3 mb-4 pb-3 border-b-2 border-amber-200 bg-gradient-to-r from-amber-50/50 to-orange-50/50 -mx-4 sm:-mx-6 md:-mx-8 lg:-mx-10 px-4 sm:px-6 md:px-8 lg:px-10 rounded-t-xl">
                          <div className="p-2.5 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl shadow-lg">
                            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </div>
                          <h4 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">Additional Notes</h4>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-semibold text-gray-700">
                            Special Instructions <span className="text-gray-400 font-normal">(Optional)</span>
                          </Label>
                          <Textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleInputChange}
                            rows={4}
                            placeholder="Any special requests, notes, or instructions for our team..."
                            className="w-full rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-200 text-gray-800 placeholder-gray-400 text-base
                         focus:bg-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/20 transition-all duration-200 hover:border-amber-300 hover:shadow-md resize-none"
                          />
                        </div>
                      </motion.div>

                      {/* Modern Footer Buttons */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 pt-6 sm:pt-8 mt-6 sm:mt-8 border-t-2 border-gray-200 bg-gradient-to-r from-gray-50/50 to-blue-50/50 -mx-4 sm:-mx-6 md:-mx-8 lg:-mx-10 px-4 sm:px-6 md:px-8 lg:px-10 py-4 sm:py-6 rounded-b-xl"
                      >
                        {/* Back Button */}
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => setActiveStep(1)}
                          className="h-12 sm:h-14 px-6 sm:px-8 rounded-xl text-gray-700 hover:text-gray-900 hover:bg-white hover:shadow-md transition-all duration-200 font-semibold border-2 border-gray-200 hover:border-gray-300"
                        >
                          <span className="mr-2 text-xl">←</span>
                          <span className="text-sm sm:text-base">Back to Services</span>
                        </Button>

                        {/* Booking Button */}
                        <Button
                          type="submit"
                          disabled={submitting}
                          className="relative h-12 sm:h-14 px-8 sm:px-12 rounded-xl font-bold text-white text-base sm:text-lg
               bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600
               hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700
               shadow-xl hover:shadow-2xl
               transition-all duration-300 transform hover:-translate-y-1 hover:scale-105
               disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none
               ring-4 ring-blue-500/20 hover:ring-blue-500/30"
                        >
                          <span className="flex items-center gap-2 sm:gap-3">
                            <span>Booking</span>
                            <Calendar className="h-5 w-5" />
                          </span>
                        </Button>
                      </motion.div>
                    </form>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
          {/* Booking Summary Card */}
       
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
