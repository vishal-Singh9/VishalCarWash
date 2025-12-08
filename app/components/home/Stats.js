'use client';

import { motion } from 'framer-motion';
import { Users, Clock, Users2, Star, ChevronRight } from 'lucide-react';

const stats = [
  { 
    number: '10,000+', 
    label: 'Happy Customers',
    icon: <Users className="w-8 h-8 text-blue-100" />,
    color: 'from-blue-400 to-blue-500',
    delay: 0.1
  },
  { 
    number: '15+', 
    label: 'Years Experience',
    icon: <Clock className="w-8 h-8 text-blue-100" />,
    color: 'from-emerald-400 to-emerald-500',
    delay: 0.2
  },
  { 
    number: '50+', 
    label: 'Expert Team',
    icon: <Users2 className="w-8 h-8 text-blue-100" />,
    color: 'from-amber-400 to-amber-500',
    delay: 0.3
  },
  { 
    number: '4.9', 
    label: 'Average Rating',
    icon: <Star className="w-8 h-8 text-blue-100" />,
    color: 'from-rose-400 to-rose-500',
    delay: 0.4
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
      type: 'spring',
      stiffness: 100,
      damping: 10
    }
  }
};

export default function Stats() {
  return (
    <section className="relative py-20 bg-gradient-to-br from-blue-600 to-blue-800 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('/images/pattern.svg')] bg-center"></div>
      </div>
      
      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-white/10 to-transparent"></div>
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white/10 to-transparent"></div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block bg-white/20 text-white text-sm font-semibold px-4 py-1 rounded-full mb-4">
            Our Achievements
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Trusted by Thousands of Car Owners
          </h2>
          <p className="text-blue-100 text-lg">
            We take pride in our numbers, but we are even more proud of the relationships we have built along the way.
          </p>
        </motion.div>

        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {stats.map((stat, index) => (
            <motion.div 
              key={index}
              variants={item}
              className="group relative bg-white/5 backdrop-blur-sm rounded-2xl p-8 text-center border border-white/10 hover:bg-white/10 transition-all duration-300 hover:-translate-y-2"
            >
              <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${stat.color} flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                {stat.icon}
              </div>
              <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100 mb-2">
                {stat.number}
              </div>
              <h3 className="text-lg font-semibold text-white mb-3">{stat.label}</h3>
              <div className="h-1 w-12 bg-gradient-to-r from-blue-400 to-cyan-400 mx-auto mb-4 rounded-full"></div>
              <p className="text-blue-100 text-sm">
                {stat.label === 'Average Rating' ? 'Out of 5.0 from 2,500+ reviews' : 
                 stat.label === 'Happy Customers' ? 'Satisfied customers and counting' :
                 stat.label === 'Years Experience' ? 'Delivering excellence since 2008' :
                 'Certified professionals'}
              </p>
              
              {stat.label === 'Average Rating' && (
                <div className="mt-4 flex justify-center items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star} 
                      className={`w-5 h-5 ${star <= 4 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400'}`} 
                    />
                  ))}
                </div>
              )}
              
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </motion.div>
          ))}
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-16 text-center"
        >
          <a 
            href="#" 
            className="inline-flex items-center text-white font-medium group hover:text-blue-100 transition-colors"
          >
            Read our customer success stories
            <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
