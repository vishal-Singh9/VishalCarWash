"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// Update the images array to include categories and titles
const images = [
  {
    src: "/images/nissan.jpeg",
    category: "Exterior",
    title: "Complete Exterior Wash",
    description: "Professional exterior cleaning and detailing"
  },
  {
    src: "/images/nissan.jpeg",
    category: "Interior",
    title: "Interior Detailing",
    description: "Thorough interior cleaning and protection"
  },
  {
    src: "/images/nissan.jpeg",
    category: "Exterior",
    title: "Premium Waxing",
    description: "High-quality wax for long-lasting shine"
  },
  {
    src: "/images/nissan.jpeg",
    category: "Interior",
    title: "Leather Treatment",
    description: "Specialized care for leather interiors"
  },
  {
    src: "/images/nissan.jpeg",
    category: "Exterior",
    title: "Tire & Rim Care",
    description: "Complete wheel and tire detailing"
  }
];

export function Gallery() {
  const router = useRouter();

  const navigateToGallery = () => {
    router.push('/gallery');
  };
  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5">
        <div className="absolute top-20 -left-20 w-64 h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-20 right-0 w-64 h-64 bg-yellow-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
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
            Our Work
          </span>
          <h2 className="text-4xl font-bold text-gray-900 sm:text-5xl mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-400">
            Gallery Showcase
          </h2>
          <p className="text-lg text-gray-600">
            Explore our latest work and see how we transform vehicles with our
            premium car care services.
          </p>
        </motion.div>

        <div className="relative">
          <Swiper
            spaceBetween={24}
            slidesPerView={1}
            loop={true}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            speed={800}
            modules={[Autoplay, Navigation, Pagination]}
            navigation={{
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
            }}
            pagination={{
              clickable: true,
              el: ".swiper-pagination",
              bulletClass: "swiper-pagination-bullet",
              bulletActiveClass: "swiper-pagination-bullet-active bg-blue-600",
            }}
            breakpoints={{
              640: {
                slidesPerView: 1.5,
                spaceBetween: 24,
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 24,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 32,
              },
            }}
            className="w-full overflow-visible"
          >
            {images.map((item, index) => (
              <SwiperSlide key={index} className="pb-16">
                <motion.div
                  className="flex justify-center items-center p-2 group"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="relative w-full h-80 md:h-96 rounded-2xl overflow-hidden shadow-lg group-hover:shadow-xl transition-all duration-500">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10">
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <span className="inline-block px-3 py-1 mb-2 text-xs font-semibold text-white bg-blue-600 rounded-full">
                          {item.category}
                        </span>
                        <h3 className="text-white text-xl font-bold mb-1">{item.title}</h3>
                        <p className="text-gray-200 text-sm">{item.description}</p>
                      </div>
                    </div>
                    <Image
                      src={item.src}
                      alt={item.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      priority={index < 3}
                    />
                  </div>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Navigation Buttons */}
          <button className="swiper-button-prev absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-700 hover:bg-gray-100 transition-colors -ml-6">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button className="swiper-button-next absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-700 hover:bg-gray-100 transition-colors -mr-6">
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Custom Pagination */}
          <div className="swiper-pagination mt-8 flex justify-center gap-2"></div>
        </div>

        <div className="mt-12 text-center">
          <motion.button
            onClick={navigateToGallery}
            whileHover={{ 
              scale: 1.03,
              boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.3), 0 8px 10px -6px rgba(59, 130, 246, 0.2)"
            }}
            whileTap={{ scale: 0.98 }}
            className="px-8 py-3.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-cyan-600 transition-all duration-300 shadow-md"
          >
            View Full Gallery
            <svg 
              className="w-4 h-4 ml-2 inline-block" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M14 5l7 7m0 0l-7 7m7-7H3" 
              />
            </svg>
          </motion.button>
        </div>
      </div>
    </section>
  );
}
