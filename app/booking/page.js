'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Calendar, CheckCircle, Clock, User, Car as CarIcon, Shield, Sparkles, Droplets, Sun } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

// Import custom components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';

export const dynamic = 'force-dynamic';

// Constants
const VEHICLE_TYPES = ['Sedan', 'SUV', 'Hatchback', 'Luxury Car', 'Truck', 'Van', 'Motorcycle'];

const TIME_SLOTS = [
  '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM'
];

const SERVICE_CATEGORIES = [
  { id: 'basic', name: 'Basic Wash' },
  { id: 'premium', name: 'Premium Detailing' },
  { id: 'interior', name: 'Interior Cleaning' },
  { id: 'exterior', name: 'Exterior Protection' },
];

const INFO_CARDS = [
  {
    title: 'Booking Confirmation',
    description: 'You will receive a confirmation email and SMS within 2 hours of booking.'
  },
  {
    title: 'Arrival Time',
    description: 'Please arrive 5-10 minutes before your scheduled time.'
  },
  {
    title: 'Cancellation Policy',
    description: 'Free cancellation up to 24 hours before your appointment.'
  },
  {
    title: 'Payment',
    description: 'Payment is due at the time of service. We accept all payment methods.'
  }
];

// Utility function to get minimum booking date
const getMinBookingDate = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split('T')[0];
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
  const [activeCategory, setActiveCategory] = useState('all');
  const [showSuccess, setShowSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    vehicle_type: '',
    vehicle_number: '',
    booking_date: getMinBookingDate(),
    booking_time: '',
    notes: ''
  });

  // Redirect to signin if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/booking');
    }
  }, [status, router]);

  // Fetch services
  const fetchServices = useCallback(async () => {
    try {
      const response = await fetch('/api/services');
      if (!response.ok) throw new Error('Failed to fetch services');
      const data = await response.json();
      setServices(data);
    } catch (error) {
      console.error('Error fetching services:', error);
      toast.error('Failed to load services. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchServices();
    }
  }, [status, fetchServices]);

  // Pre-fill user data
  useEffect(() => {
    if (session?.user) {
      setFormData(prev => ({
        ...prev,
        customer_name: session.user.name || '',
        customer_email: session.user.email || '',
        customer_phone: session.user.phone || '',
      }));
    }
  }, [session]);

  // Handlers
  const handleServiceSelect = useCallback((service) => {
    setSelectedService(service);
    setActiveStep(2);
  }, []);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (!selectedService) {
        throw new Error('Please select a service');
      }

      // Get the session
      const sessionResponse = await fetch('/api/auth/session');
      const session = await sessionResponse.json();

      if (!session || !session.user) {
        throw new Error('Session expired. Please log in again.');
      }

      // Prepare the booking data
      const bookingData = {
        service: selectedService.name || '',
        service_id: selectedService._id || selectedService.id, // Support both _id and id
        date: formData.booking_date,
        time: formData.booking_time,
        vehicleType: formData.vehicle_type,
        vehicleNumber: formData.vehicle_number,
        notes: formData.notes,
        customer_name: formData.customer_name,
        customer_email: formData.customer_email,
        customer_phone: formData.customer_phone,
        // Include the user ID from the session
        userId: session.user.id
      };

      console.log('Submitting booking with data:', bookingData);
      console.log('Session user ID:', session.user.id);

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.accessToken || ''}`
        },
        body: JSON.stringify(bookingData),
        credentials: 'include' // Important for sending cookies
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Something went wrong');

      setShowSuccess(true);
      toast.success('Booking confirmed!');
    } catch (error) {
      console.error('Error submitting booking:', error);
      toast.error(error.message || 'Failed to create booking. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = useCallback(() => {
    setShowSuccess(false);
    setActiveStep(1);
    setSelectedService(null);
    setFormData(prev => ({
      ...prev,
      vehicle_type: '',
      vehicle_number: '',
      booking_date: getMinBookingDate(),
      booking_time: '',
      notes: ''
    }));
  }, []);

  // Filter services by category
  const filteredServices = activeCategory === 'all' 
    ? services 
    : services.filter(service => service.category === activeCategory);

  // Loading state
  if (status === 'loading' || (status === 'authenticated' && loading)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    );
  }

  // Unauthenticated state
  if (status !== 'authenticated') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Success Modal with animations */}
      {showSuccess && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
        >
          <motion.div 
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="bg-white p-8 rounded-2xl max-w-md w-full shadow-2xl"
          >
            <div className="text-center">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
              >
                <CheckCircle className="w-10 h-10 text-white" />
              </motion.div>
              <motion.h3 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-3xl font-bold text-gray-800 mb-2"
              >
                Booking Confirmed!
              </motion.h3>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-gray-600 mb-8"
              >
                We have sent a confirmation to <span className="font-semibold text-blue-600">{formData.customer_email}</span>
              </motion.p>
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="space-y-3"
              >
                <Button onClick={resetForm} className="w-full hover-lift">
                  Make Another Booking
                </Button>
                <Button asChild variant="outline" className="w-full hover-lift">
                  <Link href="/my-bookings">View My Bookings</Link>
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Hero Section with enhanced animations */}
      <section className="relative py-24 md:py-32 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white overflow-hidden">
        <motion.div 
          className="absolute inset-0 z-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <div className="absolute inset-0 bg-black/30"></div>
          <motion.div 
            className="absolute inset-0 bg-[url('https://images.pexels.com/photos/380768/pexels-photo-380768.jpeg')] bg-cover bg-center opacity-20"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 20, repeat: Infinity }}
          ></motion.div>
        </motion.div>
        
        {/* Decorative blobs with enhanced animations */}
        <motion.div 
          className="absolute -top-20 -right-20 w-64 h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
          animate={{ 
            scale: [1, 1.2, 1],
            x: [0, 30, 0],
            y: [0, -30, 0]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute -bottom-20 -left-20 w-72 h-72 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
          animate={{ 
            scale: [1.2, 1, 1.2],
            x: [0, -30, 0],
            y: [0, 30, 0]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-block px-4 py-2 mb-6 text-sm font-medium text-blue-100 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 hover:bg-white/20 transition-all cursor-default"
            >
              <Sparkles className="inline-block w-4 h-4 mr-2 animate-pulse-slow" />
              Professional Car Care
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-6xl font-bold mb-6"
            >
              Book Your Car Wash
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-blue-100 max-w-2xl mx-auto"
            >
              Experience premium car care with our professional services. Book now and give your car the shine it deserves.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto"
            >
              {[
                { icon: <Droplets className="w-5 h-5" />, text: 'Eco-Friendly' },
                { icon: <Shield className="w-5 h-5" />, text: '100% Satisfaction' },
                { icon: <Clock className="w-5 h-5" />, text: 'Quick Service' },
                { icon: <Sun className="w-5 h-5" />, text: 'Streak-Free' }
              ].map((item, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="flex flex-col items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-3 rounded-lg border border-white/10 hover:bg-white/20 hover:border-white/30 transition-all cursor-default"
                >
                  <motion.span 
                    className="text-blue-300"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                  >
                    {item.icon}
                  </motion.span>
                  <span className="text-sm font-medium">{item.text}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Booking Form */}
      <section className="py-12 md:py-16 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="p-6 md:p-8">
              <div className="mb-8 text-center">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Booking Details</h2>
                <div className="w-20 h-1 bg-blue-500 mx-auto rounded-full"></div>
              </div>
              
              {/* Progress Steps */}
              <div className="relative mb-12">
                <div className="flex items-center justify-between">
                  {[
                    { step: 1, label: 'Choose Service' },
                    { step: 2, label: 'Your Details' },
                    { step: 3, label: 'Confirmation' }
                  ].map(({ step, label }) => (
                    <div key={step} className="flex flex-col items-center relative z-10 flex-1">
                      <div 
                        className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg transition-all duration-300 ${
                          activeStep >= step 
                            ? 'bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/30 transform scale-110' 
                            : 'bg-gray-200 text-gray-400'
                        }`}
                      >
                        {step}
                      </div>
                      <span className={`text-sm font-medium mt-3 text-center ${
                        activeStep >= step ? 'text-gray-800' : 'text-gray-400'
                      }`}>
                        {label}
                      </span>
                      {step < 3 && (
                        <div className={`hidden md:block absolute left-3/4 w-full h-1 ${
                          activeStep > step ? 'bg-gradient-to-r from-blue-500 to-blue-400' : 'bg-gray-200'
                        }`}></div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="absolute top-6 left-0 right-0 h-1 bg-gray-100 -z-0 hidden md:block">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-500 ease-in-out"
                    style={{ width: activeStep === 1 ? '0%' : activeStep === 2 ? '50%' : '100%' }}
                  ></div>
                </div>
              </div>
              
              {/* Step 1: Service Selection */}
              {activeStep === 1 && (
                <div className="space-y-8">
                  <div className="text-center max-w-2xl mx-auto">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Choose Your Service</h3>
                    <p className="text-gray-600">Select from our range of premium car care services</p>
                  </div>
                  
                  <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 p-1 bg-gray-100 rounded-xl">
                      <TabsTrigger 
                        value="all" 
                        className="data-[state=active]:shadow-sm data-[state=active]:bg-white data-[state=active]:text-blue-600 rounded-lg py-2 px-3 text-sm font-medium transition-all"
                      >
                        All Services
                      </TabsTrigger>
                      {SERVICE_CATEGORIES.map(category => (
                        <TabsTrigger 
                          key={category.id} 
                          value={category.id}
                          className="data-[state=active]:shadow-sm data-[state=active]:bg-white data-[state=active]:text-blue-600 rounded-lg py-2 px-3 text-sm font-medium transition-all"
                        >
                          {category.name}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </Tabs>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredServices.map((service, index) => (
                      <motion.div 
                        key={service.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.4 }}
                        onClick={() => handleServiceSelect(service)}
                        whileHover={{ y: -8, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="group relative bg-white border-2 border-gray-100 rounded-2xl p-6 cursor-pointer overflow-hidden shadow-md hover:shadow-2xl hover:border-blue-300 transition-all duration-300"
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <motion.div 
                          className="absolute -top-4 -right-4 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all duration-500"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 3, repeat: Infinity }}
                        />
                        <div className="relative z-10">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                              {service.name}
                            </h4>
                            <motion.span 
                              whileHover={{ rotate: [0, -10, 10, 0] }}
                              transition={{ duration: 0.5 }}
                              className="px-3 py-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full text-sm font-semibold shadow-md group-hover:shadow-lg"
                            >
                              ₹{service.price}
                            </motion.span>
                          </div>
                          <p className="text-gray-600 text-sm mb-4 line-clamp-3">{service.description}</p>
                          <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
                            <div className="flex items-center text-sm text-gray-500">
                              <Clock className="w-4 h-4 mr-1.5 text-blue-500" />
                              <span>{service.duration} min</span>
                            </div>
                            <span className="inline-flex items-center text-sm font-medium text-blue-600 group-hover:text-blue-700 transition-colors">
                              Select Service
                              <motion.svg 
                                className="w-4 h-4 ml-1.5"
                                animate={{ x: [0, 5, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24" 
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                              </motion.svg>
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  
                  {filteredServices.length === 0 && (
                    <div className="text-center py-12">
                      <div className="mx-auto w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                        <CarIcon className="w-8 h-8 text-blue-500" />
                      </div>
                      <h4 className="text-lg font-medium text-gray-800">No services found</h4>
                      <p className="text-gray-500 mt-1">Try selecting a different category</p>
                    </div>
                  )}
                </div>
              )}
              
              {/* Step 2: Booking Details */}
              {activeStep === 2 && (
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-xl font-semibold text-gray-800">Your Details</h3>
                    <p className="text-gray-600 mt-1">Please provide your contact and vehicle information</p>
                  </div>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="customer_name">Full Name</Label>
                        <Input
                          id="customer_name"
                          name="customer_name"
                          value={formData.customer_name}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="customer_email">Email Address</Label>
                        <Input
                          id="customer_email"
                          name="customer_email"
                          type="email"
                          value={formData.customer_email}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="customer_phone">Phone Number</Label>
                        <Input
                          id="customer_phone"
                          name="customer_phone"
                          type="tel"
                          value={formData.customer_phone}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="vehicle_type">Vehicle Type</Label>
                        <select
                          id="vehicle_type"
                          name="vehicle_type"
                          value={formData.vehicle_type}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Select vehicle type</option>
                          {VEHICLE_TYPES.map((type) => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="vehicle_number">Vehicle Number</Label>
                        <Input
                          id="vehicle_number"
                          name="vehicle_number"
                          value={formData.vehicle_number}
                          onChange={handleInputChange}
                          placeholder="e.g. ABC 1234"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="booking_date">Booking Date</Label>
                        <Input
                          id="booking_date"
                          name="booking_date"
                          type="date"
                          value={formData.booking_date}
                          onChange={handleInputChange}
                          min={getMinBookingDate()}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="booking_time">Preferred Time</Label>
                        <select
                          id="booking_time"
                          name="booking_time"
                          value={formData.booking_time}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Select a time slot</option>
                          {TIME_SLOTS.map((time) => (
                            <option key={time} value={time}>{time}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="md:col-span-2 space-y-2">
                        <Label htmlFor="notes">Special Instructions (Optional)</Label>
                        <Textarea
                          id="notes"
                          name="notes"
                          value={formData.notes}
                          onChange={handleInputChange}
                          placeholder="Any specific requirements or notes for our team..."
                          rows={3}
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-between pt-4">
                      <Button
                        type="button"
                        onClick={() => setActiveStep(1)}
                        variant="outline"
                      >
                        Back
                      </Button>
                      <Button type="submit" disabled={submitting}>
                        {submitting ? 'Processing...' : 'Confirm Booking'}
                      </Button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>

          {/* Booking Summary Sidebar */}
          {selectedService && (
            <div className="max-w-5xl mx-auto mt-8">
              <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl shadow-lg p-6 text-white">
                <h3 className="text-xl font-bold mb-4">Booking Summary</h3>
                <div className="space-y-3">
                  <div>
                    <div className="text-blue-200 text-sm">Service</div>
                    <div className="font-semibold">{selectedService.name}</div>
                  </div>
                  <div>
                    <div className="text-blue-200 text-sm">Price</div>
                    <div className="text-2xl font-bold">₹{selectedService.price}</div>
                  </div>
                  {selectedService.duration && (
                    <div>
                      <div className="text-blue-200 text-sm">Duration</div>
                      <div className="font-semibold">{selectedService.duration} minutes</div>
                    </div>
                  )}
                  {formData.booking_date && (
                    <div>
                      <div className="text-blue-200 text-sm">Date</div>
                      <div className="font-semibold">
                        {new Date(formData.booking_date + 'T00:00:00').toLocaleDateString('en-IN', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                  )}
                  {formData.booking_time && (
                    <div>
                      <div className="text-blue-200 text-sm">Time</div>
                      <div className="font-semibold">{formData.booking_time}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Info Section with animations */}
      <section className="py-12 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-3xl font-bold mb-8 text-center text-gray-900"
            >
              Important Information
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {INFO_CARDS.map((info, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all border border-gray-100 hover:border-blue-200 group"
                >
                  <div className="flex items-start gap-4">
                    <motion.div 
                      className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform"
                      whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                      transition={{ duration: 0.5 }}
                    >
                      <span className="text-white text-xl font-bold">{index + 1}</span>
                    </motion.div>
                    <div>
                      <h3 className="font-bold text-lg mb-2 text-gray-900 group-hover:text-blue-600 transition-colors">{info.title}</h3>
                      <p className="text-gray-600">{info.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}