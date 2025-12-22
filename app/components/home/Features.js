'use client';

import { motion } from 'framer-motion';

export default function Features() {
  const features = [
    {
      emoji: '✨',
      title: 'Professional Quality',
      description: 'Expert team with years of experience in car detailing',
      color: 'from-purple-500 to-pink-500'
    },
    {
      emoji: '⚡',
      title: 'Lightning Fast',
      description: 'Express service that saves your valuable time',
      color: 'from-yellow-400 to-orange-500'
    },
    {
      emoji: '🌱',
      title: 'Eco-Conscious',
      description: 'Eco-friendly products that protect your car & planet',
      color: 'from-green-400 to-teal-500'
    },
    {
      emoji: '💎',
      title: 'Premium Shine',
      description: 'Showroom-worthy results every single time',
      color: 'from-blue-400 to-cyan-500'
    },
    {
      emoji: '🛡️',
      title: 'Paint Protection',
      description: 'Advanced ceramic coatings for lasting shine',
      color: 'from-indigo-500 to-purple-600'
    },
    {
      emoji: '🧼',
      title: 'Deep Clean',
      description: 'Thorough cleaning in every nook and cranny',
      color: 'from-cyan-400 to-blue-500'
    },
    {
      emoji: '🧽',
      title: 'Stain Removal',
      description: 'Tough stains don\'t stand a chance',
      color: 'from-red-400 to-pink-500'
    },
    {
      emoji: '🌟',
      title: '5-Star Service',
      description: 'Thousands of satisfied customers and counting',
      color: 'from-amber-400 to-yellow-500'
    }
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block mb-3 px-4 py-1.5 text-sm font-semibold text-blue-600 bg-blue-100 rounded-full">
            Our Advantages 🎯
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500">
            Why Choose Us?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Experience the perfect blend of innovation, care, and expertise for your beloved vehicle
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={item}
              className="group relative bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-transparent"
              whileHover={{ 
                y: -5,
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
              }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`}></div>
              <div className="relative z-10">
                <div className={`w-16 h-16 rounded-xl mb-5 flex items-center justify-center text-3xl bg-gradient-to-br ${feature.color} text-white`}>
                  {feature.emoji}
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-gray-800 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
