'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { 
  Calendar, 
  CheckCircle, 
  Clock,
  User,
  Car as CarIcon
} from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

// Import custom components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

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
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service: selectedService.name,
          service_id: selectedService.id,
          date: formData.booking_date,
          time: formData.booking_time,
          vehicleType: formData.vehicle_type,
          vehicleNumber: formData.vehicle_number,
          notes: formData.notes,
          customer_name: formData.customer_name,
          customer_email: formData.customer_email,
          customer_phone: formData.customer_phone
        }),
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
      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-lg max-w-md w-full">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Booking Confirmed!</h3>
              <p className="text-gray-600 mb-6">
                We have sent a confirmation to {formData.customer_email}
              </p>
              <div className="space-y-3">
                <Button onClick={resetForm} className="w-full">
                  Make Another Booking
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/my-bookings">View My Bookings</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Book Your Car Wash</h1>
            <p className="text-lg md:text-xl text-blue-100">
              Professional car care services at your convenience
            </p>
          </div>
        </div>
      </section>

      {/* Booking Form */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Booking Details</h2>
              
              {/* Progress Steps */}
              <div className="relative mb-8">
                <div className="flex items-center justify-between">
                  {[
                    { step: 1, label: 'Service' },
                    { step: 2, label: 'Details' },
                    { step: 3, label: 'Confirm' }
                  ].map(({ step, label }) => (
                    <div key={step} className="flex flex-col items-center relative z-10">
                      <div 
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                          activeStep >= step ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                      >
                        {step}
                      </div>
                      <span className="text-sm mt-2 text-gray-600">{label}</span>
                    </div>
                  ))}
                </div>
                <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 -z-0">
                  <div 
                    className="h-full bg-blue-600 transition-all duration-300"
                    style={{ width: `${(activeStep - 1) * 50}%` }}
                  ></div>
                </div>
              </div>
              
              {/* Step 1: Service Selection */}
              {activeStep === 1 && (
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-xl font-semibold text-gray-800">Select a Service</h3>
                    <p className="text-gray-600 mt-1">Choose the service that fits your needs</p>
                  </div>
                  
                  <Tabs value={activeCategory} onValueChange={setActiveCategory}>
                    <TabsList className="grid w-full grid-cols-5 mb-6">
                      <TabsTrigger value="all">All</TabsTrigger>
                      {SERVICE_CATEGORIES.map(category => (
                        <TabsTrigger key={category.id} value={category.id}>
                          {category.name}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {filteredServices.map((service) => (
                        <Card 
                          key={service.id}
                          className={`cursor-pointer transition-all hover:shadow-md ${
                            selectedService?.id === service.id ? 'ring-2 ring-primary' : ''
                          }`}
                          onClick={() => handleServiceSelect(service)}
                        >
                          <CardHeader>
                            <div className="flex justify-between items-start">
                              <CardTitle>{service.name}</CardTitle>
                              <Badge variant="secondary">₹{service.price}</Badge>
                            </div>
                            <CardDescription>{service.description}</CardDescription>
                          </CardHeader>
                          {service.duration && (
                            <CardContent>
                              <div className="flex items-center text-sm text-muted-foreground">
                                <Clock className="w-4 h-4 mr-1" />
                                {service.duration} min
                              </div>
                            </CardContent>
                          )}
                        </Card>
                      ))}
                    </div>
                  </Tabs>
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

      {/* Info Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center text-gray-900">
              Important Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {INFO_CARDS.map((info, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="font-bold text-lg mb-2 text-gray-900">{info.title}</h3>
                  <p className="text-gray-600">{info.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}