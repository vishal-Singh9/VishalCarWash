"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  Sparkles,
  ZoomIn,
  Phone,
} from "lucide-react";
import Image from "next/image";


const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
  hover: {
    y: -5,
    transition: { duration: 0.2 },
  },
  tap: {
    scale: 0.98,
  },
};

const categories = [
  { id: "all", name: "All" },
  { id: "exterior", name: "Exterior" },
  { id: "interior", name: "Interior" },
  { id: "engine", name: "Engine" },
  { id: "detailing", name: "Detailing" },
  { id: "polishing", name: "Polishing" },
  { id: "ceramic", name: "Ceramic Coating" },
];

const sampleImages = [
  {
    id: 1,
    url: "/images/fullwash.webp",
    category: "exterior",
    title: "Full Car Wash",
    description: "Complete exterior cleaning and detailing",
  },
  {
    id: 2,
    url: "/images/interiorwash.webp",
    category: "interior",
    title: "Interior Detailing",
    description: "Thorough interior cleaning and conditioning",
  },
  {
    id: 3,
    url: "/images/enginewash.webp",
    category: "engine",
    title: "Engine Bay Detailing",
    description: "Engine cleaning and dressing",
  },
  {
    id: 4,
    url: "/images/paintwash.webp",
    category: "polishing",
    title: "Paint Polishing",
    description: "Professional paint correction and polishing",
  },
  {
    id: 5,
    url: "/images/cermaic.webp",
    category: "ceramic",
    title: "Ceramic Coating",
    description: "Premium ceramic coating application",
  },
  {
    id: 6,
    url: "/images/headlightwash.webp",
    category: "exterior",
    title: "Headlight Restoration",
    description: "Restoring cloudy headlights to like-new condition",
  },
  {
    id: 7,
    url: "/images/leatherwash.webp",
    category: "interior",
    title: "Leather Conditioning",
    description: "Premium leather cleaning and protection",
  },
  {
    id: 8,
    url: "/images/carwheel.webp",
    category: "exterior",
    title: "Wheel Detailing",
    description: "Deep cleaning and protection for wheels",
  },
];

const MasonryItem = ({ image, onClick, index }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="relative group overflow-hidden rounded-2xl cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500"
      onClick={() => onClick(image)}
      whileHover={{ y: -4 }}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-200">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-200 via-gray-300 to-gray-200 animate-pulse" />
        )}

        <Image
          src={image.url}
          alt={image.title || "Gallery image"}
          width={400}
          height={400}
          className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setImageLoaded(true)}
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-end p-6 translate-y-8 group-hover:translate-y-0 transition-transform duration-300">
          <span className="inline-block px-3 py-1 mb-2 text-xs font-semibold text-white bg-blue-600 rounded-full w-fit">
            {image.category.charAt(0).toUpperCase() + image.category.slice(1)}
          </span>
          <h3 className="text-xl font-bold text-white mb-1">{image.title}</h3>
          <p className="text-sm text-gray-200 line-clamp-2">
            {image.description}
          </p>
        </div>

        {/* Zoom Icon */}
        <div className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <ZoomIn className="w-5 h-5 text-white" />
        </div>
      </div>
    </motion.div>
  );
};

export default function Gallery() {
  const [images] = useState(sampleImages);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedImage, setSelectedImage] = useState(null);
  const galleryRef = useRef(null);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const filteredImages = images.filter((img) => {
    const matchesCategory =
      selectedCategory === "all" || img.category === selectedCategory;
    const matchesSearch =
      img.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      img.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const navigateImage = useCallback(
    (direction) => {
      if (!selectedImage) return;
      const currentIndex = filteredImages.findIndex(
        (img) => img.id === selectedImage.id
      );
      if (currentIndex === -1) return;

      const newIndex =
        direction === "prev"
          ? (currentIndex - 1 + filteredImages.length) % filteredImages.length
          : (currentIndex + 1) % filteredImages.length;

      setSelectedImage(filteredImages[newIndex]);
    },
    [filteredImages, selectedImage]
  );

  const handleKeyDown = useCallback(
    (e) => {
      if (!selectedImage) return;
      if (e.key === "Escape") setSelectedImage(null);
      else if (e.key === "ArrowLeft") navigateImage("prev");
      else if (e.key === "ArrowRight") navigateImage("next");
    },
    [selectedImage, navigateImage]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const getColumns = (colNumber) => {
    return filteredImages.filter((_, index) => index % 3 === colNumber);
  };

  const columns = [getColumns(0), getColumns(1), getColumns(2)];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/30"></div>
          <div className="absolute inset-0 bg-[url(/images/backsection.webp)] bg-cover bg-center opacity-20"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-2 mb-6 text-sm font-semibold text-blue-100 bg-blue-500/30 rounded-full backdrop-blur-sm">
              Welcome to our Gallery
            </span>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">
              Gallery Showcase
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Discover the transformation we bring to every vehicle with our
              premium detailing services
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="relative max-w-xl mx-auto mt-10"
            >
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
              <input
                type="text"
                placeholder="Search our gallery..."
                className="w-full pl-12 pr-16 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white transition-colors"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-5 w-5" />
              </button>

              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className="absolute left-0 right-0 mt-3 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-5 z-20"
                  >
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">
                      Filter by category
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((category) => (
                        <motion.button
                          key={category.id}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            setSelectedCategory(category.id);
                            setShowFilters(false);
                          }}
                          className={`px-4 py-2 text-sm font-medium rounded-full transition-all ${
                            selectedCategory === category.id
                              ? "bg-blue-600 text-white shadow-lg"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          {category.name}
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Category Filter Bar */}
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-lg border-b border-gray-200/50 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <div className="flex-1 overflow-x-auto scrollbar-hide">
              <div className="flex space-x-2 min-w-max">
                {categories.map((category) => (
                  <motion.button
                    key={category.id}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`relative px-6 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                      selectedCategory === category.id
                        ? "text-white shadow-lg"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {selectedCategory === category.id && (
                      <motion.div
                        layoutId="activeCategory"
                        className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-500 rounded-full"
                        transition={{
                          type: "spring",
                          bounce: 0.2,
                          duration: 0.6,
                        }}
                      />
                    )}
                    <span className="relative z-10">{category.name}</span>
                  </motion.button>
                ))}
              </div>
            </div>
            <div className="ml-4 text-sm font-medium text-gray-600 bg-gray-100 px-4 py-2 rounded-full whitespace-nowrap">
              {filteredImages.length}{" "}
              {filteredImages.length === 1 ? "result" : "results"}
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="aspect-[4/3] bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl animate-pulse"
                />
              ))}
            </div>
          ) : filteredImages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-24"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-50 to-blue-100 mb-6">
                <Search className="w-10 h-10 text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                No Results Found
              </h3>
              <p className="text-gray-500 mb-6">
                Try adjusting your filters or search term
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setSelectedCategory("all");
                  setSearchQuery("");
                }}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium rounded-full shadow-lg hover:shadow-xl transition-all"
              >
                Reset Filters
              </motion.button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {columns.map((column, colIndex) => (
                <div key={colIndex} className="flex flex-col gap-6">
                  {column.map((image, index) => (
                    <MasonryItem
                      key={image.id}
                      image={image}
                      index={
                        index + colIndex * Math.ceil(filteredImages.length / 3)
                      }
                      onClick={setSelectedImage}
                    />
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
        <section className="relative py-20 bg-gradient-to-r from-blue-600 to-blue-700 text-white overflow-hidden">
              <div className="absolute inset-0 bg-black/30"></div>
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1483721310020-03333e577078?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2089&q=80')] bg-cover bg-center opacity-20"></div>
      
              <div className="container mx-auto px-4 relative z-10">
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-100px" }}
                  variants={fadeInUp}
                  className="text-center max-w-3xl mx-auto"
                >
                  <h2 className="text-3xl md:text-4xl font-bold mb-6">
                    Ready to give your car the care it deserves?
                  </h2>
                  <p className="text-xl text-blue-100 mb-8">
                    Book an appointment today and experience the difference of a
                    professional car wash service.
                  </p>
                  <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <a
                      href="tel:+919876543210"
                      className="inline-flex items-center justify-center px-8 py-3.5 text-base font-medium text-blue-600 bg-white hover:bg-gray-100 rounded-lg transition shadow-md hover:shadow-lg"
                    >
                      <Phone className="w-5 h-5 mr-2" />
                      Call Us Now
                    </a>
                    <a
                      href="/booking"
                      className="inline-flex items-center justify-center px-8 py-3.5 text-base font-medium text-white bg-transparent hover:bg-white/10 rounded-lg transition border-2 border-white"
                    >
                      Book Online
                    </a>
                  </div>
                </motion.div>
              </div>
            </section>

      {/* Image Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm"
            onClick={() => setSelectedImage(null)}
          >
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute top-6 right-6 p-3 text-white hover:bg-white/10 rounded-full transition-colors z-10"
              onClick={() => setSelectedImage(null)}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="h-6 w-6" />
            </motion.button>

            <div
              className="relative w-full max-w-7xl flex flex-col lg:flex-row gap-6 items-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Image */}
              <motion.div
                key={selectedImage.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="relative flex-1 flex items-center justify-center"
              >
                <img
                  src={selectedImage.url}
                  alt={selectedImage.title}
                  className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl"
                />
              </motion.div>

              {/* Info Panel */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                className="w-full lg:w-96 bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
              >
                <span className="inline-block px-3 py-1 mb-4 text-xs font-semibold text-blue-100 bg-blue-600/30 rounded-full">
                  {selectedImage.category.charAt(0).toUpperCase() +
                    selectedImage.category.slice(1)}
                </span>
                <h3 className="text-3xl font-bold text-white mb-3">
                  {selectedImage.title}
                </h3>
                <p className="text-gray-300 mb-6">
                  {selectedImage.description}
                </p>

                <div className="pt-6 border-t border-white/10 text-sm text-gray-400">
                  {filteredImages.findIndex(
                    (img) => img.id === selectedImage.id
                  ) + 1}{" "}
                  of {filteredImages.length}
                </div>
              </motion.div>

              {/* Navigation */}
              {filteredImages.length > 1 && (
                <>
                  <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigateImage("prev");
                    }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-4 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </motion.button>

                  <motion.button
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigateImage("next");
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-4 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <ChevronRight className="h-6 w-6" />
                  </motion.button>
                </>
              )}
            </div>
 
          </motion.div>
          
        )}
      </AnimatePresence>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}
