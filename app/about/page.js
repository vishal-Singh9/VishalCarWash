"use client";

import {
  Award,
  Users,
  Target,
  Heart,
  CheckCircle,
  ChevronRight,
  Star,
  Shield,
  Leaf,
  Clock,
  Sparkles,
  MessageSquare,
  Truck,
  Headset,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function About() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const values = [
    {
      icon: Award,
      title: "Excellence",
      description: "We strive for perfection in every service we provide",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: Users,
      title: "Customer First",
      description: "Your satisfaction is our top priority",
      color: "from-emerald-500 to-emerald-600",
    },
    {
      icon: Target,
      title: "Precision",
      description: "Attention to detail in every wash and detail",
      color: "from-amber-500 to-amber-600",
    },
    {
      icon: Heart,
      title: "Passion",
      description: "We love what we do and it shows in our work",
      color: "from-rose-500 to-rose-600",
    },
  ];

  const milestones = [
    {
      year: "2021",
      event: "Founded Vishal Car Wash",
      icon: "🚗",
      description:
        "Started our journey with a single location and a vision for exceptional car care",
    },
    {
      year: "2022",
      event: "Expanded to 3 locations",
      icon: "📍",
      description: "Grew our presence to serve more customers across the city",
    },
    {
      year: "2023",
      event: "Introduced eco-friendly products",
      icon: "🌱",
      description:
        "Committed to sustainability with environmentally friendly cleaning solutions",
    },
    {
      year: "2024",
      event: "Served 2000+ customers",
      icon: "👥",
      description:
        "Reached a significant milestone in our journey of customer satisfaction",
    },
    {
      year: "2025",
      event: "Award for Best Car Wash Service",
      icon: "🏆",
      description:
        "Recognized for excellence in service quality and customer experience",
    },
  ];

  const teamMembers = [
    {
      name: "Pradeep Singh",
      role: "Founder & CEO",
      image:
        "",
      bio: "With over 5+ years in the automotive industry, Pradeep founded Vishal Car Wash with a vision to revolutionize car care services.",
      linkedin:""
    },
    {
      name: "Vishal Singh",
      role: "Operation Head",
      image: "/images/Vishal.jpg",
      bio: "Vishal ensures our operations run smoothly and efficiently, maintaining our high standards of service.",
      linkedin:"https://www.linkedin.com/in/vishal-singh-1b6914223"
    },
    {
      name: "Vineet Singh",
      role: "Customer Service Head",
      image:
        "",
      bio: "Vineet leads our customer service team, ensuring every client receives exceptional support and care.",
      linkedin:""
    },
   
  ];

  const testimonials = [
    {
      quote:
        "Best car wash service I've ever used! My car looks brand new every time.",
      author: "Rahul Verma",
      role: "Loyal Customer",
      rating: 5,
    },
    {
      quote:
        "The eco-friendly approach is what brought me in, but the outstanding service is what keeps me coming back.",
      author: "Neha Kapoor",
      role: "Environmental Enthusiast",
      rating: 5,
    },
    {
      quote:
        "Professional staff and excellent attention to detail. Highly recommend their premium detailing service.",
      author: "Arjun Mehta",
      role: "Car Enthusiast",
      rating: 5,
    },
  ];

  const faqs = [
    {
      question: "How often should I get my car washed?",
      answer:
        "We recommend a basic wash every 2 weeks to maintain your car's appearance and protect its paint. However, this can vary based on weather conditions and where you typically park.",
    },
    {
      question: "Are your cleaning products safe for my car's paint?",
      answer:
        "Absolutely! We use only pH-balanced, eco-friendly products that are specifically designed to be gentle on your car's finish while effectively removing dirt and grime.",
    },
    {
      question: "Do you offer mobile car washing services?",
      answer:
        "Yes, we provide convenient mobile washing services for our customers. Our team comes to your location with all the necessary equipment to give your car a professional clean.",
    },
    {
      question: "What's included in your premium detailing package?",
      answer:
        "Our premium detailing includes a thorough interior and exterior cleaning, paint decontamination, polish, wax, interior vacuuming, leather treatment, and glass cleaning.",
    },
  ];

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      variants={staggerContainer}
    >
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/30"></div>
          <div className="absolute inset-0 bg-[url('/images/backsection.webp')] bg-cover bg-center opacity-20"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-2 mb-6 text-sm font-semibold text-blue-100 bg-blue-500/30 rounded-full backdrop-blur-sm">
              Our Journey Since 2021
            </span>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">
              About Us
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Your trusted partner in vishal car wash, delivering excellence in every detail since 2021
            </p>
            <motion.div
              className="mt-10"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <a
                href="/contact"
                className="inline-flex items-center px-8 py-4 bg-white text-blue-700 font-semibold rounded-full hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Get in Touch
                <ChevronRight className="ml-2 w-5 h-5" />
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
            variants={fadeInUp}
          >
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="mb-2 text-blue-600 font-semibold">
                Our Journey
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 leading-tight">
                More Than Just a <span className="text-blue-600">Car Wash</span>
              </h2>
              <div className="space-y-6 text-gray-600">
                <p className="text-lg">
                  Founded in 2021, Vishal Car Wash began with a simple mission:
                  to provide the best car wash and detailing services in the
                  region. What started as a small operation with just three team
                  members has grown into a trusted name in automotive care.
                </p>
                <p className="text-lg">
                  Over the years, we have served thousands of satisfied
                  customers, always maintaining our commitment to quality,
                  professionalism, and environmental responsibility. Our team of
                  experienced professionals uses the latest equipment and
                  eco-friendly products to ensure your vehicle gets the care it
                  deserves.
                </p>
                <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                  <p className="text-blue-800 font-medium">
                    We believe in building relationships, not just cleaning
                    cars. Every vehicle that comes through our doors is treated
                    with the utmost care and attention to detail.
                  </p>
                  <div className="mt-4 flex items-center">
                    <div className="h-10 w-10 rounded-full bg-blue-200 flex items-center justify-center text-blue-800 font-bold">
                      PS
                    </div>
                    <div className="ml-3">
                      <div className="font-semibold">Pradeep Singh</div>
                      <div className="text-sm text-blue-600">Founder & CEO</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
            <motion.div
              className="relative group"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl transform transition-transform duration-500 group-hover:shadow-2xl">
                <Image
                  src="https://images.pexels.com/photos/6872163/pexels-photo-6872163.jpeg"
                  alt="Our Facility"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
                  <div className="text-white">
                    <h3 className="text-2xl font-bold mb-2">
                      State-of-the-Art Facility
                    </h3>
                    <p className="text-blue-100">
                      Eco-friendly equipment and premium products
                    </p>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-blue-600 rounded-full z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 text-sm font-semibold text-blue-600 bg-blue-50 rounded-full mb-4">
              Our Foundation
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Core <span className="text-blue-600">Values</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The principles that guide every service we provide and every
              interaction we have
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {values.map((value, index) => (
              <motion.div
                key={index}
                className="group relative bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 overflow-hidden"
                variants={fadeInUp}
                whileHover={{ y: -10 }}
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-blue-300"></div>
                <div className="w-16 h-16 flex items-center justify-center bg-blue-50 text-blue-600 rounded-xl mb-6 group-hover:bg-blue-100 transition-colors duration-300">
                  <value.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {value.description}
                </p>
                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center text-blue-600 font-medium group-hover:text-blue-700 transition-colors">
                  <span>Learn more</span>
                  <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              Our Journey
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Key milestones in our growth story
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex items-start mb-8 last:mb-0">
                <div className="flex-shrink-0 w-32 text-right mr-8">
                  <div className="text-2xl font-bold text-blue-600">
                    {milestone.year}
                  </div>
                </div>
                <div className="flex-shrink-0 relative">
                  <div className="w-4 h-4 bg-blue-600 rounded-full border-4 border-blue-100"></div>
                  {index < milestones.length - 1 && (
                    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-blue-200"></div>
                  )}
                </div>
                <div className="flex-1 ml-8 pb-8">
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <p className="text-lg text-gray-700">{milestone.event}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 text-sm font-semibold text-blue-600 bg-blue-50 rounded-full mb-4">
              Our Experts
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Meet Our <span className="text-blue-600">Team</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The passionate professionals dedicated to keeping your vehicle in
              pristine condition
            </p>
          </motion.div>

          <div className="relative py-12 sm:py-16 lg:py-20 w-full bg-gray-50">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-transparent to-blue-500/5 -skew-y-3 -rotate-1 rounded-3xl transform-gpu"></div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
                <div className="w-20 h-1 bg-blue-600 mx-auto rounded-full"></div>
              </div>
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full"
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
              >
                {teamMembers.map((member, index) => (
                  <motion.div
                    key={index}
                    className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 flex flex-col h-full"
                    variants={fadeInUp}
                    whileHover={{ 
                      y: -8,
                      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                    }}
                  >
                    <div className="relative w-full aspect-square overflow-hidden">
                      <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        className="object-cover w-full h-full transition-all duration-700 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        priority={index < 2}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                        <div className="space-y-2 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                          <h3 className="text-2xl font-bold">{member.name}</h3>
                          <p className="text-blue-300 font-medium">{member.role}</p>
                          <div className="flex space-x-3 mt-4">
                            <a
                              href={member.twitter || "#"}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-10 h-10 rounded-full bg-white/20 hover:bg-blue-600 flex items-center justify-center transition-all duration-300 transform hover:scale-110"
                              aria-label={`${member.name}'s Twitter`}
                            >
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                              </svg>
                            </a>
                            <a
                              href={member.linkedin || ""}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-10 h-10 rounded-full bg-white/20 hover:bg-blue-600 flex items-center justify-center transition-all duration-300 transform hover:scale-110"
                              aria-label={`${member.name}'s LinkedIn`}
                            >
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path>
                              </svg>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="p-6 text-center bg-gradient-to-b from-white to-gray-50">
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                        {member.name}
                      </h3>
                      <p className="text-blue-600 font-medium mt-1">{member.role}</p>
                      {member.department && (
                        <span className="inline-block mt-2 px-3 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-full">
                          {member.department}
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>

          <motion.div
            className="mt-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <p className="text-lg text-gray-600 mb-6">
              Join our team of passionate professionals
            </p>
            <motion.a
              href="#"
              className="inline-flex items-center px-8 py-3 bg-blue-600 text-white font-medium rounded-full hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              View Open Positions
              <ChevronRight className="ml-2 w-5 h-5" />
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 text-sm font-semibold text-blue-600 bg-blue-50 rounded-full mb-4">
              Our Advantages
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Why Choose <span className="text-blue-600">Vishal Car Wash</span>?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We go beyond just cleaning cars - we deliver exceptional
              experiences
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative group">
              <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="https://images.pexels.com/photos/5717568/pexels-photo-5717568.jpeg"
                  alt="Quality Service"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
                  <div className="text-white">
                    <h3 className="text-2xl font-bold mb-2">Premium Service</h3>
                    <p className="text-blue-100">
                      Experience the difference of professional car care
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              {[
                {
                  icon: <Sparkles className="w-6 h-6 text-blue-600" />,
                  title: "Expert Team",
                  description:
                    "Our certified professionals are trained in the latest car care techniques and use only premium products.",
                },
                {
                  icon: <Leaf className="w-6 h-6 text-emerald-600" />,
                  title: "Eco-Friendly",
                  description:
                    "We use biodegradable, water-based products that are tough on dirt but gentle on your car and the environment.",
                },
                {
                  icon: <Clock className="w-6 h-6 text-amber-600" />,
                  title: "Time-Saving",
                  description:
                    "Our efficient processes mean you spend less time waiting and more time enjoying your clean car.",
                },
                {
                  icon: <Shield className="w-6 h-6 text-indigo-600" />,
                  title: "Satisfaction Guaranteed",
                  description:
                    "Not happy with the results? We ll make it right. Your satisfaction is our priority.",
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  className="flex items-start p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow group"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-50 group-hover:bg-blue-100 flex items-center justify-center mt-1 mr-4 transition-colors">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </motion.div>
              ))}

              <motion.div
                className="pt-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <a
                  href="/services"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:shadow-lg transition-all"
                >
                  Explore Our Services
                  <ChevronRight className="ml-2 w-5 h-5" />
                </a>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

   


      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Experience the Difference?
            </h2>
            <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
              Book your car wash today and see why thousands of customers trust
              us with their vehicles
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <motion.a
                href="/booking"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-700 font-semibold rounded-lg hover:bg-blue-50 transition-colors shadow-lg hover:shadow-xl"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                Book Now
                <ChevronRight className="ml-2 w-5 h-5" />
              </motion.a>
              <motion.a
                href="tel:+1234567890"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white/20 text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                Call Us Now
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
}
