import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const generateAvatarUrl = (name) => {
  const colors = [
    "bg-blue-500",
    "bg-green-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-cyan-500",
  ];
  const color = colors[Math.floor(Math.random() * colors.length)];
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
  return { bgColor: color, initials };
};

const TestimonialCard = ({ testimonial, currentIndex, index }) => {
  const { bgColor, initials } = generateAvatarUrl(testimonial.name);
  const gradients = [
    "from-blue-500 to-cyan-400",
    "from-purple-500 to-pink-500",
    "from-green-500 to-emerald-400",
    "from-amber-500 to-yellow-300",
    "from-rose-500 to-pink-400",
    "from-indigo-500 to-blue-400",
  ];

  const randomGradient =
    gradients[Math.floor(Math.random() * gradients.length)];

  return (
    <motion.div
      key={testimonial._id}
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -20 }}
      transition={{
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1],
        scale: { type: "spring", stiffness: 300, damping: 20 },
      }}
      className="h-full w-full flex-shrink-0 px-4"
    >
      <div
        className={`h-full bg-gradient-to-br ${randomGradient} rounded-3xl shadow-2xl overflow-hidden group transform transition-all duration-500 hover:shadow-xl hover:-translate-y-2`}
      >
        <div className="h-full bg-white/90 backdrop-blur-sm p-0.5 rounded-[calc(1.5rem-1px)]">
          <Card className="h-full bg-white/90 rounded-[1.375rem] border-0 shadow-none overflow-hidden group-hover:bg-white/95 transition-colors duration-300">
            <CardContent className="p-8 h-full flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div>
                     <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
                <div className="flex items-center">
                  <div
                    className={`relative h-10 w-10 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md ${bgColor} transform transition-all duration-300 group-hover:scale-110`}
                  >
                    {initials}
                  </div>
                  <p className="font-bold text-gray-900 text-xl mb-2 ml-4">
                    {testimonial.name}
                  </p>
                </div>
              </div>
                  <div className="flex items-center gap-1 mt-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < testimonial.rating
                            ? "text-yellow-400 fill-current"
                            : "text-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <Quote className="h-8 w-8 text-gray-200 group-hover:text-blue-500 transition-colors duration-300 transform -scale-x-100" />
              </div>

              <p className="text-gray-700 flex-grow text-base leading-relaxed relative pl-6 before:content-[''] before:absolute before:left-0 before:top-2 before:h-4/5 before:w-0.5 before:bg-gradient-to-b before:from-blue-500 before:to-cyan-400 before:rounded-full">
                {testimonial?.content}
              </p>

           
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/reviews?limit=3&status=approved");
        if (!response.ok) {
          throw new Error("Failed to fetch testimonials");
        }
        const data = await response.json();
        setTestimonials(data.data || []);
      } catch (err) {
        console.error("Error fetching testimonials:", err);
        setError("Failed to load testimonials. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  const nextTestimonial = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex + 1) % Math.max(1, testimonials.length)
    );
  };

  const prevTestimonial = () => {
    setCurrentIndex(
      (prevIndex) =>
        (prevIndex - 1 + testimonials.length) % Math.max(1, testimonials.length)
    );
  };

  if (error) {
    return (
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
        <div className="container mx-auto px-4 text-center">
          <p className="text-red-500">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-gradient-to-b from-blue-300 to-blue-100 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/4 w-[800px] h-[800px] bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute -top-1/4 -right-1/4 w-[600px] h-[600px] bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-1/4 left-1/4 w-[700px] h-[700px] bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 max-w-4xl mx-auto">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center px-4 py-2 text-sm font-semibold text-blue-600 bg-white/80 backdrop-blur-sm rounded-full mb-5 shadow-sm border border-blue-100/50"
          >
            <span className="relative flex h-2 w-2 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Customer Testimonials
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl mb-6"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-600 to-cyan-500">
              Loved by our
            </span>
            <span className="block mt-2">Valued Customers</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed"
          >
            Do not just take our word for it. Here&apos;s what our amazing customers
            have to say about their experience with our premium car wash
            services.
          </motion.p>
        </div>

        <div className="relative max-w-7xl mx-auto">
          {isLoading ? (
            <div className="flex justify-center items-center h-96">
              <div className="relative">
                <div className="h-16 w-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          ) : testimonials.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <TestimonialCard
                    testimonial={testimonial}
                    currentIndex={index}
                    index={index}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white/50 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100">
              <p className="text-gray-500">
                No testimonials available at the moment.
              </p>
            </div>
          )}

          <div className="flex justify-center mt-12">
            <Link
              href="/reviews"
              className="group inline-flex items-center px-8 py-3.5 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg"
            >
              View All Reviews
              <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          </div>
        </div>
      </div>
 
    </section>
  );
}
