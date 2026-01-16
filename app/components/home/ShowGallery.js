"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { ChevronLeft, ChevronRight, ArrowRight, Filter } from "lucide-react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// Update the images array to include categories and titles
const images = [
  {
    src: "/images/Fullcarwash.webp",
    category: "Exterior",
    title: "Complete Exterior Wash",
    description: "Professional exterior cleaning and detailing",
  },
  {
    src: "/images/interiror.webp",
    category: "Interior",
    title: "Interior Detailing",
    description: "Thorough interior cleaning and protection",
  },
  {
    src: "/images/premiumwaxing.webp",
    category: "Waxing",
    title: "Premium Waxing",
    description: "High-quality wax for long-lasting shine",
  },
  {
    src: "/images/leather.webp",
    category: "Interior",
    title: "Leather Treatment",
    description: "Specialized care for leather interiors",
  },
  {
    src: "/images/tyrewash.webp",
    category: "Exterior",
    title: "Tire & Rim Care",
    description: "Complete wheel and tire detailing",
  },
  {
    src: "/images/detailing.webp",
    category: "Detailing",
    title: "Full Car Detailing",
    description: "Complete interior and exterior detailing service",
  },
];

export function ShowGallery() {
  const router = useRouter();

  const navigateToGallery = () => {
    router.push("/gallery");
  };
  const [activeFilter, setActiveFilter] = useState("All");

  // Get unique categories
  const categories = ["All", ...new Set(images.map((item) => item.category))];

  // Filter images based on active filter
  const filteredImages =
    activeFilter === "All"
      ? images
      : images.filter((image) => image.category === activeFilter);

  return (
    <section className="relative py-12 sm:py-16 md:py-20 lg:py-28 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 overflow-hidden">
      {/* Enhanced animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/3 -right-1/3 w-96 h-96 bg-gradient-to-br from-blue-200/30 to-indigo-200/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-1/3 -left-1/3 w-96 h-96 bg-gradient-to-tr from-purple-200/30 to-pink-200/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-cyan-200/20 to-blue-200/20 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative text-center mb-12 sm:mb-16 md:mb-20 max-w-4xl mx-auto px-4"
        >
          <motion.span
            className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-blue-700 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-full mb-5 sm:mb-6 border-2 border-blue-100 backdrop-blur-sm shadow-sm"
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
            whileHover={{ scale: 1.05 }}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <span>Our Work Showcase</span>
          </motion.span>
          <motion.h2
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 sm:mb-5 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Gallery
          </motion.h2>
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: "80px" }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="h-1 sm:h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 mx-auto mb-5 sm:mb-6 rounded-full"
          />
          <motion.p
            className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Discover the art of automotive perfection through our gallery of
            transformations. Each vehicle tells a story of meticulous care and
            attention to detail.
          </motion.p>
        </motion.div>

        {/* Modern Category Filters */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-10 sm:mb-12 md:mb-16 px-2 sm:px-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="flex items-center gap-2 bg-white/90 backdrop-blur-md px-3 sm:px-4 py-2 sm:py-2.5 rounded-full shadow-md border-2 border-blue-100"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
            <span className="text-xs sm:text-sm font-semibold text-gray-700">
              Filter:
            </span>
          </motion.div>
          {categories.map((category, idx) => (
            <motion.button
              key={idx}
              onClick={() => setActiveFilter(category)}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05, duration: 0.3 }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold rounded-full transition-all duration-300 shadow-sm ${
                activeFilter === category
                  ? "bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-lg shadow-blue-500/30 ring-2 ring-blue-500/20"
                  : "bg-white/90 text-gray-700 hover:bg-white hover:text-gray-900 border-2 border-gray-200 hover:border-blue-300 hover:shadow-md"
              }`}
            >
              <motion.span
                className="relative inline-block"
                animate={activeFilter === category ? { x: [0, 2, 0] } : {}}
                transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
              >
                {category}
              </motion.span>
            </motion.button>
          ))}
        </motion.div>

        <div className="relative px-2 sm:px-4 lg:px-6">
          <Swiper
            spaceBetween={20}
            slidesPerView={1}
            loop={true}
            loopedSlides={Math.min(3, filteredImages.length)}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
              waitForTransition: true,
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
              bulletClass:
                "swiper-pagination-bullet !bg-gray-300 !opacity-100 !w-2.5 !h-2.5 !mx-1.5 !transition-all !duration-300",
              bulletActiveClass:
                "!bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 !w-8 !rounded-full !shadow-lg",
            }}
            breakpoints={{
              480: {
                slidesPerView: 1.2,
                spaceBetween: 20,
              },
              640: {
                slidesPerView: 1.5,
                spaceBetween: 24,
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 28,
              },
              1024: {
                slidesPerView: 2.5,
                spaceBetween: 32,
              },
              1280: {
                slidesPerView: 3,
                spaceBetween: 36,
              },
            }}
            className="w-full !overflow-visible py-4"
          >
            {filteredImages.map((item, index) => (
              <SwiperSlide key={index} className="pb-16 sm:pb-20 group">
                <motion.div
                  className="flex justify-center items-center h-full px-1 sm:px-2"
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{
                    duration: 0.6,
                    ease: [0.16, 1, 0.3, 1],
                    delay: index * 0.05,
                  }}
                  whileHover={{
                    y: -8,
                    transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
                  }}
                >
                  <div className="relative w-full h-[22rem] sm:h-[26rem] md:h-[30rem] lg:h-[34rem] rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl group-hover:shadow-2xl transition-all duration-500 ease-out bg-white border-2 border-gray-100 group-hover:border-blue-200 flex flex-col">
                    {/* Image container with enhanced hover effect */}
                    <div className="relative w-full h-[14rem] sm:h-[18rem] md:h-[20rem] lg:h-[22rem] flex-shrink-0 overflow-hidden rounded-t-2xl sm:rounded-t-3xl">
                      <motion.div
                        className="absolute inset-0 w-full h-full"
                        whileHover={{ scale: 1.08 }}
                        transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                      >
                        <Image
                          src={item.src}
                          alt={item.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover transition-transform duration-700 ease-out"
                          priority={index < 3}
                        />
                      </motion.div>

                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                      {/* Category badge */}
                      <motion.div
                        className="absolute top-3 sm:top-4 right-3 sm:right-4 z-10"
                        initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                        whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 + index * 0.05, type: "spring" }}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        <span className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-bold tracking-wide text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-full shadow-xl backdrop-blur-md border border-white/20">
                          {item.category}
                        </span>
                      </motion.div>

                      {/* Hover overlay with action button */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-[1] flex items-end justify-center pb-6"
                        initial={false}
                      >
                        <motion.button
                          className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/95 backdrop-blur-sm text-blue-600 hover:bg-white transition-all duration-300 shadow-xl border-2 border-white/50"
                          whileHover={{ scale: 1.15, rotate: 90 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <circle cx="11" cy="11" r="8"></circle>
                            <line
                              x1="21"
                              y1="21"
                              x2="16.65"
                              y2="16.65"
                            ></line>
                          </svg>
                        </motion.button>
                      </motion.div>

                      {/* Top accent bar */}
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>

                    {/* Enhanced card content - Always visible */}
                    <div className="relative w-full flex-1 min-h-[8rem] sm:min-h-[8rem] md:min-h-[10rem] lg:min-h-[12rem] bg-gradient-to-b from-white to-gray-50 p-3 sm:p-4 md:p-5 lg:p-6 flex flex-col justify-between border-t border-gray-100">
                      <div className="flex-1 flex flex-col justify-center">
                        <motion.h3
                          className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-gray-900 mb-1.5 sm:mb-2 md:mb-2.5 line-clamp-1 group-hover:text-blue-600 transition-colors"
                          initial={false}
                        >
                          {item?.title || "Untitled"}
                        </motion.h3>
                        <p className="text-xs sm:text-sm md:text-base text-gray-600 mb-2 sm:mb-3 md:mb-4 line-clamp-2 leading-relaxed">
                          {item?.description || "No description available"}
                        </p>
                      </div>
                      <motion.div
                        className="flex items-center gap-1.5 sm:gap-2 text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        initial={false}
                      >
                        <span className="text-xs sm:text-sm font-semibold">View Details</span>
                        <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 transition-transform group-hover:translate-x-1" />
                      </motion.div>
                    </div>

                    {/* Enhanced hover effect border */}
                    <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-400/50 rounded-2xl sm:rounded-3xl transition-all duration-500 pointer-events-none shadow-[0_0_0_4px_rgba(59,130,246,0.1)] group-hover:shadow-[0_0_0_8px_rgba(59,130,246,0.15)]"></div>
                  </div>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Enhanced Navigation Buttons */}
          {/* <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 z-20 pointer-events-none px-2 sm:px-4">
            <div className="relative h-0 container mx-auto">
              <button
                className="swiper-button-prev absolute -left-4 md:-left-6 lg:-left-8 w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center text-gray-700 hover:text-white hover:bg-gradient-to-r from-blue-600 to-cyan-500 transition-all duration-300 transform hover:scale-110 hover:shadow-xl group border border-gray-100 pointer-events-auto"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-6 h-6 md:w-7 md:h-7 transition-transform group-hover:-translate-x-0.5" />
                <span className="sr-only">Previous</span>
              </button>

              <button
                className="swiper-button-next absolute -right-4 md:-right-6 lg:-right-8 w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center text-gray-700 hover:text-white hover:bg-gradient-to-r from-blue-600 to-cyan-500 transition-all duration-300 transform hover:scale-110 hover:shadow-xl group border border-gray-100 pointer-events-auto"
                aria-label="Next slide"
              >
                <ChevronRight className="w-6 h-6 md:w-7 md:h-7 transition-transform group-hover:translate-x-0.5" />
                <span className="sr-only">Next</span>
              </button>
            </div>
          </div> */}

          {/* Custom Pagination */}
          <div className="swiper-pagination !relative !mt-8 sm:!mt-10 flex justify-center items-center gap-2"></div>

          {/* Enhanced View All Button */}
          <motion.div
            className="text-center mt-8 sm:mt-10 md:mt-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <motion.button
              onClick={navigateToGallery}
              className="group relative inline-flex items-center justify-center px-6 sm:px-8 md:px-10 py-3 sm:py-3.5 md:py-4 text-sm sm:text-base md:text-lg font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-full shadow-xl hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-blue-500/30 overflow-hidden"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Animated background gradient */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                initial={false}
              />
              
              <span className="relative z-10 flex items-center gap-2 sm:gap-3">
                <span>View Full Gallery</span>
                <motion.div
                  animate={{ x: [0, 4, 0] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                </motion.div>
              </span>
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
