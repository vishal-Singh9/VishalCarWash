'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CheckCircle, Clock, ArrowRight, Loader2 } from 'lucide-react';

const additionalServices = [
  {
    title: 'Additional Services',
    items: [
      'Engine Cleaning',
      'Headlight Restoration',
      'Scratch Removal',
      'Ceramic Coating',
      'Paint Protection Film',
    ],
  },
  {
    title: 'Interior Services',
    items: [
      'Leather Conditioning',
      'Fabric Protection',
      'Odor Removal',
      'Steam Cleaning',
      'Dashboard Polish',
    ],
  },
];

const processSteps = [
  {
    step: '01',
    title: 'Book Online',
    description: 'Choose your service and book your preferred time slot'
  },
  {
    step: '02',
    title: 'Drop Off',
    description: 'Bring your vehicle to our facility at the scheduled time'
  },
  {
    step: '03',
    title: 'Professional Service',
    description: 'Our experts clean and detail your car with care'
  },
  {
    step: '04',
    title: 'Pick Up',
    description: 'Collect your sparkling clean vehicle'
  }
];

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/services');
      if (!response.ok) {
        throw new Error('Failed to fetch services');
      }
      const data = await response.json();
      setServices(data);
    } catch (error) {
      console.error('Error fetching services:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8 bg-red-50 rounded-lg">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Services</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchServices}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Our Services</h1>
            <p className="text-xl text-blue-100">
              Professional car care packages designed to meet all your vehicle needs
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Loading services...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2">
                    <div className="relative h-64 md:h-auto overflow-hidden">
                      <img
                        src={service.image_url}
                        alt={service.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-8 flex flex-col justify-between">
                      <div>
                        <h3 className="text-3xl font-bold mb-3 text-gray-900">{service.name}</h3>
                        <p className="text-gray-600 mb-6">{service.description}</p>

                        <div className="space-y-3 mb-6">
                          {service.features && Array.isArray(service.features) && service.features.map((feature, idx) => (
                            <div key={idx} className="flex items-start">
                              <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                              <span className="text-gray-700">{feature}</span>
                            </div>
                          ))}
                        </div>

                        {service.duration && (
                          <div className="flex items-center text-gray-600 mb-6">
                            <Clock className="w-5 h-5 mr-2" />
                            <span>Estimated time: {service.duration} minutes</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm text-gray-500 mb-1">Starting from</div>
                          <div className="text-4xl font-bold text-blue-600">₹{service.price}</div>
                        </div>
                        <Link
                          href="/booking"
                          className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition font-medium flex items-center"
                        >
                          Book Now
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Additional Services */}
          <div className="bg-gray-50 rounded-2xl p-8 md:p-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-gray-900 text-center">
              Additional Services
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {additionalServices[0].items.map((item, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition flex items-center"
                >
                  <CheckCircle className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0" />
                  <span className="text-lg font-medium text-gray-800">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              Our Process
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Simple steps to get your car looking brand new
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: '01',
                title: 'Book Online',
                description: 'Choose your service and book your preferred time slot'
              },
              {
                step: '02',
                title: 'Drop Off',
                description: 'Bring your vehicle to our facility at the scheduled time'
              },
              {
                step: '03',
                title: 'Professional Service',
                description: 'Our experts clean and detail your car with care'
              },
              {
                step: '04',
                title: 'Pick Up',
                description: 'Collect your sparkling clean vehicle'
              }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Book Your Service?
          </h2>
          <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
            Choose the perfect package for your vehicle and schedule your appointment today
          </p>
          <Link
            href="/booking"
            className="inline-block bg-white text-blue-600 px-10 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition transform hover:scale-105"
          >
            Book Your Appointment Now
          </Link>
        </div>
      </section>
    </div>
  );
}
