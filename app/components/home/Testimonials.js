import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote, ArrowRight, Sparkles } from "lucide-react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";

const generateAvatarUrl = (name, index) => {
  const colors = [
    "bg-gradient-to-br from-blue-500 to-blue-600",
    "bg-gradient-to-br from-green-500 to-green-600",
    "bg-gradient-to-br from-purple-500 to-purple-600",
    "bg-gradient-to-br from-pink-500 to-pink-600",
    "bg-gradient-to-br from-indigo-500 to-indigo-600",
    "bg-gradient-to-br from-cyan-500 to-cyan-600",
  ];
  const color = colors[index % colors.length];
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  return { bgColor: color, initials };
};

const TestimonialCard = ({ testimonial, index }) => {
  const { bgColor, initials } = generateAvatarUrl(testimonial.name, index);
  const gradients = [
    "from-blue-500 via-cyan-400 to-blue-300",
    "from-purple-500 via-pink-400 to-purple-300",
    "from-green-500 via-emerald-400 to-green-300",
    "from-amber-500 via-yellow-300 to-amber-300",
    "from-rose-500 via-pink-400 to-rose-300",
    "from-indigo-500 via-blue-400 to-indigo-300",
  ];

  const gradient = gradients[index % gradients.length];
  const cardRef = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useMotionValue(0), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useMotionValue(0), { stiffness: 300, damping: 30 });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    
    const rotateXValue = (mouseY / rect.height) * -10;
    const rotateYValue = (mouseX / rect.width) * 10;
    
    rotateX.set(rotateXValue);
    rotateY.set(rotateYValue);
    x.set(mouseX * 0.1);
    y.set(mouseY * 0.1);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.6,
        delay: index * 0.15,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="h-full w-full perspective-1000"
    >
      <motion.div
        style={{ x, y }}
        className={`h-full bg-gradient-to-br ${gradient} rounded-3xl shadow-2xl overflow-hidden group relative`}
      >
        {/* Animated background glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Shine effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
          initial={{ x: "-100%" }}
          whileHover={{ x: "100%" }}
        />

        <div className="h-full bg-white/95 backdrop-blur-md p-[2px] rounded-[calc(1.5rem-2px)]">
          <Card className="h-full bg-white/95 rounded-[1.375rem] border-0 shadow-none overflow-hidden group-hover:bg-white transition-all duration-500 relative">
            {/* Decorative corner accent */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <CardContent className="p-6 sm:p-8 h-full flex flex-col relative z-10">
              {/* Header with quote icon */}
              <div className="flex items-start justify-between mb-4 sm:mb-6">
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 + 0.2, type: "spring", stiffness: 200 }}
                  className={`${bgColor} h-12 w-12 sm:h-14 sm:w-14 rounded-2xl flex items-center justify-center text-white font-bold text-lg sm:text-xl shadow-lg transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-xl`}
                >
                  {initials}
                </motion.div>
                <motion.div
                  initial={{ rotate: -180, opacity: 0 }}
                  whileInView={{ rotate: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 + 0.3 }}
                >
                  <Quote className="h-6 w-6 sm:h-8 sm:w-8 text-gray-200 group-hover:text-blue-500 transition-all duration-300 transform -scale-x-100 group-hover:scale-110" />
                </motion.div>
              </div>

              {/* Rating stars */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 + 0.25 }}
                className="flex items-center gap-1 mb-4 sm:mb-6"
              >
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0, rotate: -180 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      delay: index * 0.15 + 0.3 + i * 0.05,
                      type: "spring",
                      stiffness: 200,
                    }}
                  >
                    <Star
                      className={`h-4 w-4 sm:h-5 sm:w-5 transition-all duration-300 ${
                        i < testimonial.rating
                          ? "text-yellow-400 fill-current group-hover:text-yellow-500 group-hover:scale-110"
                          : "text-gray-200"
                      }`}
                    />
                  </motion.div>
                ))}
              </motion.div>

              {/* Testimonial content */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 + 0.4 }}
                className="text-gray-700 flex-grow text-sm sm:text-base leading-relaxed mb-6 sm:mb-8 relative pl-4 sm:pl-6 before:content-[''] before:absolute before:left-0 before:top-2 before:h-[calc(100%-1rem)] before:w-1 before:bg-gradient-to-b before:from-blue-500 before:via-cyan-400 before:to-blue-500 before:rounded-full before:opacity-60 group-hover:before:opacity-100 transition-opacity duration-300"
              >
                {testimonial?.content}
              </motion.p>

              {/* Author name */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 + 0.5 }}
                className="flex items-center justify-between pt-4 sm:pt-6 border-t border-gray-100 group-hover:border-gray-200 transition-colors duration-300"
              >
                <div>
                  <p className="font-bold text-gray-900 text-base sm:text-lg mb-1 group-hover:text-blue-600 transition-colors duration-300">
                    {testimonial.name}
                  </p>
                  {testimonial.service && (
                    <p className="text-xs sm:text-sm text-gray-500">
                      {testimonial.service}
                    </p>
                  )}
                </div>
                <motion.div
                  whileHover={{ scale: 1.2, rotate: 15 }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                  <Sparkles className="h-5 w-5 text-blue-500" />
                </motion.div>
              </motion.div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
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
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-b from-blue-50 via-blue-100/50 to-white relative overflow-hidden">
      {/* Enhanced animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -top-1/2 -left-1/4 w-[600px] h-[600px] sm:w-[800px] sm:h-[800px] bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 sm:opacity-30"
        />
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
            delay: 2,
          }}
          className="absolute -top-1/4 -right-1/4 w-[500px] h-[500px] sm:w-[600px] sm:h-[600px] bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 sm:opacity-30"
        />
        <motion.div
          animate={{
            x: [0, 50, 0],
            y: [0, 100, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear",
            delay: 4,
          }}
          className="absolute -bottom-1/4 left-1/4 w-[550px] h-[550px] sm:w-[700px] sm:h-[700px] bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 sm:opacity-30"
        />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] opacity-40" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-10 sm:mb-12 md:mb-16 max-w-4xl mx-auto"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold text-blue-600 bg-white/90 backdrop-blur-md rounded-full mb-4 sm:mb-5 shadow-lg border border-blue-100/50 hover:shadow-xl transition-shadow duration-300"
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
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight"
          >
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-600 to-cyan-500 block"
            >
              Loved by our
            </motion.span>
            <motion.span
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="block mt-1 sm:mt-2"
            >
              Valued Customers
            </motion.span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed px-4"
          >
            Do not just take our word for it. Here&apos;s what our amazing customers
            have to say about their experience with our premium car wash services.
          </motion.p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="relative max-w-7xl mx-auto">
          {isLoading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-center items-center h-64 sm:h-80 md:h-96"
            >
              <div className="relative">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="h-12 w-12 sm:h-16 sm:w-16 border-4 border-blue-500 border-t-transparent rounded-full"
                />
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="h-6 w-6 sm:h-8 sm:w-8 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full" />
                </motion.div>
              </div>
            </motion.div>
          ) : testimonials.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10"
            >
              <AnimatePresence mode="wait">
                {testimonials.map((testimonial, index) => (
                  <TestimonialCard
                    key={testimonial._id}
                    testimonial={testimonial}
                    index={index}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12 sm:py-16 bg-white/60 backdrop-blur-md rounded-2xl shadow-lg border border-gray-100/50"
            >
              <p className="text-gray-500 text-sm sm:text-base">
                No testimonials available at the moment.
              </p>
            </motion.div>
          )}

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex justify-center mt-8 sm:mt-10 md:mt-12"
          >
            <Link
              href="/reviews"
              className="group relative inline-flex items-center px-6 py-3 sm:px-8 sm:py-3.5 border border-transparent text-sm sm:text-base font-medium rounded-full shadow-lg text-white bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:from-blue-700 hover:via-blue-600 hover:to-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl overflow-hidden"
            >
              {/* Button shine effect */}
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              
              <span className="relative z-10 flex items-center">
                View All Reviews
                <motion.div
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight className="ml-2 sm:ml-3 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform duration-300" />
                </motion.div>
              </span>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
