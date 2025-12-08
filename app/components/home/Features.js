'use client';

import { Sparkles, Clock, Shield, Star } from 'lucide-react';

export default function Features() {
  const features = [
    {
      icon: Sparkles,
      title: 'Professional Quality',
      description: 'Expert team with years of experience in car detailing'
    },
    {
      icon: Clock,
      title: 'Fast Service',
      description: 'Quick turnaround time without compromising quality'
    },
    {
      icon: Shield,
      title: 'Eco-Friendly',
      description: 'Using environmentally safe products and water-saving techniques'
    },
    {
      icon: Star,
      title: 'Customer Satisfaction',
      description: '5-star rated service with thousands of happy customers'
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">Why Choose Us?</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We provide the best car wash experience with attention to detail and customer satisfaction
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-2"
            >
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <feature.icon className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
