'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function Pricing() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState(null);

  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handlePlanSelect = (planName) => {
    setSelectedPlan(planName === selectedPlan ? null : planName);
  };
  const plans = [
    {
      name: 'Basic Wash',
      price: '₹499',
      description: 'Perfect for regular maintenance',
      features: [
        'Exterior hand wash',
        'Tire and rim cleaning',
        'Window cleaning',
        'Vacuum interior',
        'Dashboard wipe down',
        'Interior dusting',
        'Door jamb cleaning'
      ],
      buttonText: 'Get Started',
      popular: false
    },
    {
      name: 'Premium Wash',
      price: '₹999',
      description: 'Complete interior & exterior care',
      features: [
        'Everything in Basic',
        'Wax application',
        'Interior shampoo',
        'Leather conditioning',
        'Air freshener',
        'Tire shine',
        'Fabric protection'
      ],
      buttonText: 'Popular Choice',
      popular: true
    },
    {
      name: 'Deluxe Detailing',
      price: '₹2499',
      description: 'Showroom quality detailing',
      features: [
        'Everything in Premium',
        'Clay bar treatment',
        'Paint correction',
        'Engine bay cleaning',
        'Headlight restoration',
        'Underbody wash',
        'Ceramic coating prep'
      ],
      buttonText: 'Premium Choice',
      popular: false
    }
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <section id="pricing" className="py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5">
        <div className="absolute top-20 -left-20 w-64 h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 -right-20 w-64 h-64 bg-yellow-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-20 left-1/3 w-64 h-64 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>
      
      <div className="container mx-auto px-4 relative">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16 max-w-3xl mx-auto"
        >
          <span className="inline-block px-3 py-1 text-sm font-medium text-blue-600 bg-blue-50 rounded-full mb-4">
            Pricing Plans
          </span>
          <h2 className="text-4xl font-bold text-gray-900 sm:text-5xl mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-400">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-gray-600">
            Choose the perfect package for your vehicle. No hidden fees, just premium service.
          </p>
        </motion.div>

        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid gap-8 md:grid-cols-3 lg:gap-12"
        >
          {plans.map((plan, index) => (
            <motion.div 
              key={index} 
              variants={item}
              className={`relative flex flex-col rounded-xl shadow-sm overflow-hidden transition-all duration-300 cursor-pointer bg-white hover:shadow-md ${
                selectedPlan === plan.name 
                  ? 'ring-2 ring-blue-500 transform -translate-y-2' 
                  : 'border border-gray-100 hover:border-gray-200'
              } ${plan.popular ? 'border-2 border-blue-500' : ''}`}
              onClick={() => handlePlanSelect(plan.name)}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-semibold px-4 py-1.5 rounded-full whitespace-nowrap shadow-lg">
                  Most Popular
                </div>
              )}
              
              <div className="p-8 flex-1 flex flex-col">
                <div className="mb-8">
                  <h3 className={`text-2xl font-bold ${selectedPlan === plan.name ? 'text-blue-600' : 'text-gray-900'}`}>
                    {plan.name}
                  </h3>
                  <p className="mt-2 text-gray-600">{plan.description}</p>
                  <div className="mt-6 flex items-baseline">
                    <span className="text-5xl font-extrabold text-gray-900">{plan.price}</span>
                    <span className="ml-1 text-xl font-medium text-gray-500">/wash</span>
                  </div>
                </div>

                <ul className="space-y-4 flex-1">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <svg 
                        className={`flex-shrink-0 h-6 w-6 ${plan.popular ? 'text-blue-500' : 'text-green-500'}`} 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M5 13l4 4L19 7" 
                        />
                      </svg>
                      <span className="ml-3 text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className={`mt-8 w-full px-6 py-3.5 rounded-lg font-semibold text-white transition-colors ${
                    selectedPlan === plan.name
                      ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
                      : plan.popular 
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700' 
                        : 'bg-gray-900 hover:bg-gray-800'
                  }`}
                >
                  {selectedPlan === plan.name ? 'Selected' : plan.buttonText}
                </motion.button>
              </div>
              
              <div className={`h-1.5 ${selectedPlan === plan.name ? 'bg-gradient-to-r from-blue-500 to-blue-600' : 'bg-gray-200'}`}></div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-16 text-center"
        >
          <p className="text-gray-600 mb-6">Need a custom solution? We offer personalized detailing packages.</p>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={scrollToContact}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-medium rounded-lg hover:from-blue-700 hover:to-cyan-600 transition-colors shadow-sm"
          >
            Contact Us for Custom Quote
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
