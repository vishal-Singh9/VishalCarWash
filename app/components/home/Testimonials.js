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
        className={`h-full bg-gradient-to-br ${gradient} p-[1px] rounded-3xl shadow-2xl overflow-hidden group relative`}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
          initial={{ x: "-100%" }}
          whileHover={{ x: "100%" }}
        />

        <div className="h-full bg-[#030712]/90 backdrop-blur-xl rounded-[calc(1.5rem-1px)]">
          <Card className="h-full bg-transparent rounded-[1.5rem] border-0 shadow-none overflow-hidden transition-all duration-500 relative">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <CardContent className="p-6 sm:p-8 h-full flex flex-col relative z-10 text-white">
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
                  <Quote className="h-6 w-6 sm:h-8 sm:w-8 text-gray-700 group-hover:text-cyan-400 transition-all duration-300 transform -scale-x-100 group-hover:scale-110" />
                </motion.div>
              </div>

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
                          ? "text-yellow-400 fill-yellow-400 group-hover:text-yellow-300 group-hover:fill-yellow-300 group-hover:scale-110"
                          : "text-gray-700"
                      }`}
                    />
                  </motion.div>
                ))}
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 + 0.4 }}
                className="text-gray-300 flex-grow text-sm sm:text-base leading-relaxed mb-6 sm:mb-8 relative pl-4 sm:pl-6 before:content-[''] before:absolute before:left-0 before:top-2 before:h-[calc(100%-1rem)] before:w-1 before:bg-gradient-to-b before:from-cyan-400 before:via-blue-500 before:to-cyan-400 before:rounded-full before:opacity-60 group-hover:before:opacity-100 transition-opacity duration-300"
              >
                {testimonial?.content}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 + 0.5 }}
                className="flex items-center justify-between pt-4 sm:pt-6 border-t border-white/10 group-hover:border-white/20 transition-colors duration-300"
              >
                <div>
                  <p className="font-bold text-white text-base sm:text-lg mb-1 group-hover:text-cyan-400 transition-colors duration-300">
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
                  <Sparkles className="h-5 w-5 text-cyan-400" />
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

  if (error) {
    return (
      <section className="py-20 bg-[#030712] relative overflow-hidden border-t border-white/5">
        <div className="container mx-auto px-4 text-center">
          <p className="text-red-400">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-[#030712] relative overflow-hidden border-t border-white/5">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ x: [0, 100, 0], y: [0, 50, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-1/2 -left-1/4 w-[600px] h-[600px] sm:w-[800px] sm:h-[800px] bg-blue-600/10 rounded-full blur-[100px]"
        />
        <motion.div
          animate={{ x: [0, -100, 0], y: [0, -50, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear", delay: 2 }}
          className="absolute -top-1/4 -right-1/4 w-[500px] h-[500px] sm:w-[600px] sm:h-[600px] bg-purple-600/10 rounded-full blur-[100px]"
        />
        <motion.div
          animate={{ x: [0, 50, 0], y: [0, 100, 0], scale: [1, 1.15, 1] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear", delay: 4 }}
          className="absolute -bottom-1/4 left-1/4 w-[550px] h-[550px] sm:w-[700px] sm:h-[700px] bg-cyan-600/10 rounded-full blur-[100px]"
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
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
            className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold text-cyan-400 bg-white/5 backdrop-blur-md rounded-full mb-4 sm:mb-5 shadow-lg border border-white/10 hover:border-cyan-500/50 transition-colors duration-300"
          >
            <span className="relative flex h-2 w-2 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            Customer Testimonials
          </motion.span>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight"
          >
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 block"
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
            className="text-sm sm:text-base md:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed px-4"
          >
            Do not just take our word for it. Here&apos;s what our amazing customers
            have to say about their experience with our premium car wash services.
          </motion.p>
        </motion.div>

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
                  className="h-12 w-12 sm:h-16 sm:w-16 border-4 border-cyan-500 border-t-transparent rounded-full"
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
              className="text-center py-12 sm:py-16 bg-white/5 backdrop-blur-md rounded-2xl shadow-lg border border-white/10"
            >
              <p className="text-gray-400 text-sm sm:text-base">
                No testimonials available at the moment.
              </p>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex justify-center mt-8 sm:mt-10 md:mt-12"
          >
            <Link
              href="/reviews"
              className="inline-flex items-center justify-center w-full sm:w-auto px-8 py-4 border border-white/20 text-base font-semibold rounded-full text-white bg-white/5 hover:bg-white/10 transition-all duration-300 transform hover:scale-105 shadow-lg backdrop-blur-md group"
            >
              <span className="relative z-10 flex items-center">
                View All Reviews
                <motion.div
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight className="ml-2 sm:ml-3 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform duration-300 text-cyan-400" />
                </motion.div>
              </span>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
