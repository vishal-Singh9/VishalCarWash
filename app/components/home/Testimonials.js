import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const testimonials = [
  {
    id: 1,
    name: 'Rahul Sharma',
    role: 'Regular Customer',
    content: 'Best car wash service in town! My car looks brand new every time.',
    rating: 5,
    avatar: '/images/avatars/avatar1.jpg'
  },
  {
    id: 2,
    name: 'Priya Patel',
    role: 'Monthly Member',
    content: 'Professional service and friendly staff. Highly recommended!',
    rating: 5,
    avatar: '/images/avatars/avatar2.jpg'
  },
  {
    id: 3,
    name: 'Amit Singh',
    role: 'First-time Customer',
    content: 'Impressed with the attention to detail. Will definitely come back!',
    rating: 4,
    avatar: '/images/avatars/avatar3.jpg'
  }
];

const TestimonialCard = ({ testimonial }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="h-full"
    >
      <Card className="h-full bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 overflow-hidden group">
        <CardContent className="p-8 h-full flex flex-col">
          <Quote className="h-8 w-8 text-gray-200 mb-4 group-hover:text-blue-500 transition-colors" />
          
          <p className="text-gray-600 mb-6 flex-grow text-lg leading-relaxed relative">
            <span className="absolute -top-1 -left-2 text-7xl text-gray-100 -z-10"></span>
            {testimonial.content}
          </p>
          
          <div className="flex items-center mt-6 pt-6 border-t border-gray-100">
            <div className="relative h-12 w-12 rounded-full overflow-hidden border-2 border-white shadow-md">
              <Image 
                src={testimonial.avatar} 
                alt={testimonial.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            <div className="ml-4">
              <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
              <p className="text-sm text-gray-500">{testimonial.role}</p>
            </div>
            <div className="ml-auto flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`h-4 w-4 ${i < testimonial.rating ? 'text-yellow-400 fill-current' : 'text-gray-200'}`} 
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export function Testimonials() {
  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5">
        <div className="absolute top-20 -left-20 w-64 h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 -right-20 w-64 h-64 bg-yellow-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-20 left-1/3 w-64 h-64 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>
      
      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <span className="inline-block px-3 py-1 text-sm font-medium text-blue-600 bg-blue-50 rounded-full mb-4">
            Testimonials
          </span>
          <h2 className="text-4xl font-bold text-gray-900 sm:text-5xl mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-400">
            What Our Customers Say
          </h2>
          <p className="text-lg text-gray-600">
            Don not just take our word for it. Here is what our valued customers have to say about their experience with our services.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
}
