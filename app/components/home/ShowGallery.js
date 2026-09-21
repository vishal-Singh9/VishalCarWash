"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { ArrowRight, Filter } from "lucide-react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

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

  const categories = ["All", ...new Set(images.map((item) => item.category))];

  const filteredImages =
    activeFilter === "All"
      ? images
      : images.filter((image) => image.category === activeFilter);

  return (
    <section className="relative py-12 sm:py-16 md:py-20 lg:py-28 bg-[#030712] border-t border-white/5 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/3 -right-1/3 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px]"></div>
        <div className="absolute -bottom-1/3 -left-1/3 w-96 h-96 bg-cyan-600/10 rounded-full blur-[100px]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px]"></div>
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
            className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-cyan-400 bg-white/5 rounded-full mb-5 sm:mb-6 border border-white/10 backdrop-blur-sm shadow-sm"
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
            whileHover={{ scale: 1.05 }}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            <span>Our Work Showcase</span>
          </motion.span>
          <motion.h2
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 sm:mb-5 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500"
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
            className="h-1 sm:h-1.5 bg-gradient-to-r from-blue-500 to-cyan-400 mx-auto mb-5 sm:mb-6 rounded-full"
          />
          <motion.p
            className="text-sm sm:text-base md:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed"
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

        <motion.div
          className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-10 sm:mb-12 md:mb-16 px-2 sm:px-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="flex items-center gap-2 bg-white/5 backdrop-blur-md px-3 sm:px-4 py-2 sm:py-2.5 rounded-full shadow-md border border-white/10"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
            <span className="text-xs sm:text-sm font-semibold text-gray-300">
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
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-blue-500/30 border border-transparent"
                  : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10 hover:border-white/20"
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
                "swiper-pagination-bullet !bg-white/30 !opacity-100 !w-2.5 !h-2.5 !mx-1.5 !transition-all !duration-300",
              bulletActiveClass:
                "!bg-gradient-to-r from-cyan-400 to-blue-500 !w-8 !rounded-full !shadow-lg",
            }}
            breakpoints={{
              480: { slidesPerView: 1.2, spaceBetween: 20 },
              640: { slidesPerView: 1.5, spaceBetween: 24 },
              768: { slidesPerView: 2, spaceBetween: 28 },
              1024: { slidesPerView: 2.5, spaceBetween: 32 },
              1280: { slidesPerView: 3, spaceBetween: 36 },
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
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: index * 0.05 }}
                  whileHover={{ y: -8, transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] } }}
                >
                  <div className="relative w-full h-[22rem] sm:h-[26rem] md:h-[30rem] lg:h-[34rem] rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl group-hover:shadow-2xl transition-all duration-500 ease-out bg-white/5 border border-white/10 group-hover:border-cyan-500/50 flex flex-col backdrop-blur-sm">
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

                      <div className="absolute inset-0 bg-gradient-to-t from-[#030712]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                      <motion.div
                        className="absolute top-3 sm:top-4 right-3 sm:right-4 z-10"
                        initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                        whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 + index * 0.05, type: "spring" }}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        <span className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-bold tracking-wide text-cyan-300 bg-cyan-500/20 rounded-full shadow-xl backdrop-blur-md border border-cyan-500/50">
                          {item.category}
                        </span>
                      </motion.div>

                      <motion.div
                        className="absolute inset-0 bg-gradient-to-t from-[#030712]/90 via-[#030712]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-[1] flex items-end justify-center pb-6"
                        initial={false}
                      >
                        <motion.button
                          className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-cyan-500/20 backdrop-blur-md text-white hover:bg-cyan-500/40 transition-all duration-300 shadow-xl border border-cyan-500/50"
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
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                          </svg>
                        </motion.button>
                      </motion.div>

                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>

                    <div className="relative w-full flex-1 min-h-[8rem] sm:min-h-[8rem] md:min-h-[10rem] lg:min-h-[12rem] bg-transparent p-3 sm:p-4 md:p-5 lg:p-6 flex flex-col justify-between border-t border-white/10">
                      <div className="flex-1 flex flex-col justify-center">
                        <motion.h3
                          className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-white mb-1.5 sm:mb-2 md:mb-2.5 line-clamp-1 group-hover:text-cyan-400 transition-colors"
                          initial={false}
                        >
                          {item?.title || "Untitled"}
                        </motion.h3>
                        <p className="text-xs sm:text-sm md:text-base text-gray-400 mb-2 sm:mb-3 md:mb-4 line-clamp-2 leading-relaxed">
                          {item?.description || "No description available"}
                        </p>
                      </div>
                      {/* <motion.div
                        className="flex items-center gap-1.5 sm:gap-2 text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        initial={false}
                      >
                        <span className="text-xs sm:text-sm font-semibold">View Details</span>
                        <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 transition-transform group-hover:translate-x-1" />
                      </motion.div> */}
                    </div>

                    <div className="absolute inset-0 border-2 border-transparent group-hover:border-cyan-500/30 rounded-2xl sm:rounded-3xl transition-all duration-500 pointer-events-none shadow-[0_0_0_4px_rgba(34,211,238,0.1)]"></div>
                  </div>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="swiper-pagination !relative !mt-8 sm:!mt-10 flex justify-center items-center gap-2"></div>

          <motion.div
            className="text-center mt-8 sm:mt-10 md:mt-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <motion.button
              onClick={navigateToGallery}
              className="group relative inline-flex items-center justify-center px-6 sm:px-8 md:px-10 py-3 sm:py-3.5 md:py-4 text-sm sm:text-base md:text-lg font-bold text-white bg-white/5 border border-white/20 rounded-full shadow-xl hover:shadow-2xl hover:bg-white/10 transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-white/10 overflow-hidden backdrop-blur-md"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10 flex items-center gap-2 sm:gap-3">
                <span>View Full Gallery</span>
                <motion.div
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-cyan-400" />
                </motion.div>
              </span>
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
