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
    <section className="relative py-20 md:py-28 bg-gradient-to-br from-gray-50 via-white to-gray-50 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/3 -right-1/3 w-full h-full bg-gradient-to-br from-blue-50/70 to-cyan-50/70 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-1/3 -left-1/3 w-full h-2/3 bg-gradient-to-tr from-amber-50/70 to-yellow-100/70 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
      </div>

      <div className="container mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative text-center mb-20 max-w-4xl mx-auto px-4"
        >
          <motion.span
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-full mb-5 border border-blue-100 backdrop-blur-sm"
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <span className="relative flex h-2 w-2 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Our Work Showcase
          </motion.span>
          <motion.h2
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
           Vishal Car Wash Gallery
          </motion.h2>
          <motion.p
            className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto"
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

        {/* Category Filters */}
        <motion.div
          className="flex flex-wrap justify-center gap-3 mb-12 px-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2.5 rounded-full shadow-sm border border-gray-100">
            <Filter className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-medium text-gray-600">
              Filter by:
            </span>
          </div>
          {categories.map((category, idx) => (
            <button
              key={idx}
              onClick={() => setActiveFilter(category)}
              className={`px-5 py-2.5 text-sm font-medium rounded-full transition-all duration-300 ${
                activeFilter === category
                  ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-100"
                  : "bg-white/80 text-gray-600 hover:bg-gray-50 border border-gray-100 hover:border-gray-200"
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        <div className="relative px-2 sm:px-4 lg:px-6">
          <Swiper
            spaceBetween={30}
            slidesPerView={1}
            loop={true}
            loopedSlides={Math.min(3, filteredImages.length)}
            autoplay={{
              delay: 1000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
              waitForTransition: true,
            }}
            speed={600}
            modules={[Autoplay, Navigation, Pagination]}
            navigation={{
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
            }}
            pagination={{
              clickable: true,
              el: ".swiper-pagination",
              bulletClass:
                "swiper-pagination-bullet !bg-gray-200 !opacity-100 !w-2.5 !h-2.5 !mx-1.5",
              bulletActiveClass:
                "!bg-gradient-to-r from-blue-500 to-cyan-400 !w-8 !rounded-full transition-all duration-300",
            }}
            breakpoints={{
              640: {
                slidesPerView: 1.2,
                spaceBetween: 24,
              },
              768: {
                slidesPerView: 2.2,
                spaceBetween: 28,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 32,
              },
              1280: {
                slidesPerView: 3.5,
                spaceBetween: 32,
              },
            }}
            className="w-full !overflow-visible py-2"
          >
            {filteredImages.map((item, index) => (
              <SwiperSlide key={index} className="pb-16 group">
                <motion.div
                  className="flex justify-center items-center h-full px-1"
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{
                    duration: 0.6,
                    ease: [0.16, 1, 0.3, 1],
                    delay: index * 0.05,
                  }}
                  whileHover={{
                    y: -6,
                    transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
                  }}
                >
                  <div className="relative w-full h-[24rem] sm:h-[28rem] md:h-[32rem] rounded-2xl overflow-hidden shadow-lg group-hover:shadow-xl transition-all duration-500 ease-out bg-white">
                    {/* Image container with hover effect */}
                    <div className="relative w-full h-3/4 overflow-hidden">
                      <motion.div
                        className="absolute inset-0 w-full h-full"
                        whileHover={{ scale: 1.05 }}
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

                      {/* Category badge */}
                      <motion.div
                        className="absolute top-4 right-4 z-10"
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + index * 0.05 }}
                      >
                        <span className="inline-flex items-center px-3 py-1.5 text-xs font-semibold tracking-wide text-white bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full shadow-lg backdrop-blur-sm">
                          {item.category}
                        </span>
                      </motion.div>

                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-[1]">
                        <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                          <button className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/90 text-blue-600 hover:bg-white transition-all duration-300 transform hover:scale-110 shadow-lg">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
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
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Card content */}
                    <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-white p-5 flex flex-col justify-center">
                      <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1">
                        {item?.title || "Untitled"}
                      </h3>
                      <p className="text-gray-500 text-sm mb-3 line-clamp-2">
                        {item?.description || "No description available"}
                      </p>
                    </div>

                    {/* Hover effect border */}
                    <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-400/30 rounded-2xl transition-all duration-500 pointer-events-none"></div>
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

       {/* Enhanced Pagination */}
          {/* View All Button */}
          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <button
              onClick={navigateToGallery}
              className="group inline-flex items-center justify-center px-8 py-3.5 text-base font-medium text-white bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full shadow-lg hover:shadow-xl hover:shadow-blue-100 hover:scale-105 transition-all duration-300 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <span>View Full Gallery</span>
              <ArrowRight className="w-5 h-5 ml-2 -mr-1 transition-transform group-hover:translate-x-1" />
            </button>
          </motion.div>
        </div>

 
      </div>
    </section>
  );
}
