'use client';

import { Award, Users, Target, Heart, CheckCircle } from 'lucide-react';

export default function About() {
  const values = [
    {
      icon: Award,
      title: 'Excellence',
      description: 'We strive for perfection in every service we provide'
    },
    {
      icon: Users,
      title: 'Customer First',
      description: 'Your satisfaction is our top priority'
    },
    {
      icon: Target,
      title: 'Precision',
      description: 'Attention to detail in every wash and detail'
    },
    {
      icon: Heart,
      title: 'Passion',
      description: 'We love what we do and it shows in our work'
    }
  ];

  const milestones = [
    { year: '2008', event: 'Founded Vishal Car Wash' },
    { year: '2012', event: 'Expanded to 3 locations' },
    { year: '2016', event: 'Introduced eco-friendly products' },
    { year: '2020', event: 'Served 10,000+ customers' },
    { year: '2024', event: 'Award for Best Car Wash Service' }
  ];

  const teamMembers = [
    {
      name: 'Vishal Kumar',
      role: 'Founder & CEO',
      image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg'
    },
    {
      name: 'Rajesh Singh',
      role: 'Operations Manager',
      image: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg'
    },
    {
      name: 'Priya Sharma',
      role: 'Customer Service Head',
      image: 'https://images.pexels.com/photos/3756681/pexels-photo-3756681.jpeg'
    },
    {
      name: 'Amit Patel',
      role: 'Lead Detailer',
      image: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg'
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">About Us</h1>
            <p className="text-xl text-blue-100">
              Your trusted partner in premium car care since 2008
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6 text-gray-900">Our Story</h2>
              <p className="text-lg text-gray-600 mb-4">
                Vishal Car Wash was founded in 2008 with a simple mission: to provide the best car wash and detailing services in the region. What started as a small operation with just three team members has grown into a trusted name in automotive care.
              </p>
              <p className="text-lg text-gray-600 mb-4">
                Over the years, we've served thousands of satisfied customers, always maintaining our commitment to quality, professionalism, and environmental responsibility. Our team of experienced professionals uses the latest equipment and eco-friendly products to ensure your vehicle gets the care it deserves.
              </p>
              <p className="text-lg text-gray-600">
                Today, we're proud to be the go-to choice for car owners who demand excellence. Whether it's a quick wash or comprehensive detailing, we treat every vehicle with the same level of care and attention to detail.
              </p>
            </div>
            <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://images.pexels.com/photos/6872163/pexels-photo-6872163.jpeg"
                alt="Our Facility"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">Our Values</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-lg text-center hover:shadow-xl transition transform hover:-translate-y-2"
              >
                <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <value.icon className="w-10 h-10 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">Our Journey</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Key milestones in our growth story
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex items-start mb-8 last:mb-0">
                <div className="flex-shrink-0 w-32 text-right mr-8">
                  <div className="text-2xl font-bold text-blue-600">{milestone.year}</div>
                </div>
                <div className="flex-shrink-0 relative">
                  <div className="w-4 h-4 bg-blue-600 rounded-full border-4 border-blue-100"></div>
                  {index < milestones.length - 1 && (
                    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-blue-200"></div>
                  )}
                </div>
                <div className="flex-1 ml-8 pb-8">
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <p className="text-lg text-gray-700">{milestone.event}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">Meet Our Team</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The dedicated professionals behind our success
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition transform hover:-translate-y-2"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold mb-1 text-gray-900">{member.name}</h3>
                  <p className="text-blue-600 font-medium">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://images.pexels.com/photos/5717568/pexels-photo-5717568.jpeg"
                alt="Quality Service"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-4xl font-bold mb-6 text-gray-900">Why Choose Vishal Car Wash?</h2>
              <div className="space-y-4">
                {[
                  'Experienced and trained professionals',
                  'State-of-the-art equipment and facilities',
                  'Eco-friendly products and water-saving techniques',
                  'Flexible scheduling and quick service',
                  'Competitive pricing with no hidden costs',
                  'Customer satisfaction guarantee',
                  'Convenient location with easy access',
                  'Loyalty programs and special offers'
                ].map((item, index) => (
                  <div key={index} className="flex items-start">
                    <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0 mt-1" />
                    <span className="text-lg text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
