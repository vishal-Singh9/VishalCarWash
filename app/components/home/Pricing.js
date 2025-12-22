"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  CheckCircle2,
  Shield,
  Clock,
  Zap,
  Car,
  Sun,
  Droplet,
  SprayCan,
  Shine,
} from "lucide-react";

export function Pricing() {
  const [billingCycle, setBillingCycle] = useState("single");
  const [hoveredPlan, setHoveredPlan] = useState(null);
  const router = useRouter();

  const handleBookNow = (plan) => {
    // Create a service ID by converting the plan name to lowercase and replacing spaces with hyphens
    const serviceId = plan.name.toLowerCase().replace(/\s+/g, "-");
    // Redirect to booking page with service ID as a query parameter
    router.push(`/booking?service=${encodeURIComponent(serviceId)}`);
  };

  const scrollToContact = () => {
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const plans = [
    {
      name: "Basic Wash",
      price: { single: "150", monthly: "₹500" },
      description: "Perfect for regular maintenance",
      features: [
        "Exterior hand wash",
        "Tire and rim cleaning",
        "Window cleaning",
        "Vacuum interior",
        "Dashboard wipe down",
        "Interior dusting",
        "Door jamb cleaning",
      ],
      buttonText: "Get Started",
      popular: false,
      icon: Droplet,
    },
    {
      name: "Premium Wash",
      price: { single: "300", monthly: "₹1100" },
      description: "Complete interior & exterior care",
      features: [
        "Everything in Basic",
        "Wax application",
        "Interior shampoo",
        "Leather conditioning",
        "Air freshener",
        "Tire shine",
        "Fabric protection",
      ],
      buttonText: "Popular Choice",
      popular: true,
      icon: SprayCan,
    },
    {
      name: "Deluxe Detailing",
      price: { single: "₹200", monthly: "₹750" },
      description: "Showroom quality detailing",
      features: [
        "Everything in Premium",
        "Clay bar treatment",
        "Paint correction",
        "Engine bay cleaning",
        "Headlight restoration",
        "Underbody wash",
        "Ceramic coating prep",
      ],
      buttonText: "Premium Choice",
      popular: false,
      icon: Sun,
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  const cardHover = {
    scale: 1.03,
    boxShadow:
      "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 15,
    },
  };

  const buttonHover = {
    scale: 1.05,
    boxShadow:
      "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10,
    },
  };

  const buttonTap = {
    scale: 0.98,
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 15,
    },
  };

  const getFeatureIcon = (feature, index) => {
    const icons = [
      <CheckCircle2
        key="check"
        className="flex-shrink-0 h-5 w-5 text-green-500"
      />,
      <Shield key="shield" className="flex-shrink-0 h-5 w-5 text-blue-500" />,
      <Clock key="clock" className="flex-shrink-0 h-5 w-5 text-amber-500" />,
      <Zap key="zap" className="flex-shrink-0 h-5 w-5 text-yellow-500" />,
      <Car key="car" className="flex-shrink-0 h-5 w-5 text-indigo-500" />,
    ];
    return icons[index % icons.length];
  };

  return (
    <section
      id="pricing"
      className="py-20 bg-gradient-to-b from-gray-50 to-gray-100 relative overflow-hidden"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-1/3 -right-20 w-80 h-80 bg-amber-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-20 left-1/3 w-96 h-96 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 max-w-3xl mx-auto"
        >
          <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-white text-blue-600 shadow-sm mb-6">
            <Sparkles className="w-4 h-4 mr-2" />
            Pricing Plans
          </span>
          <motion.h2
            className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Pricing
          </motion.h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-cyan-400 mx-auto mb-6 rounded-full"></div>
          <motion.p
            className="text-lg text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Choose the perfect package for your vehicle. No hidden fees, just
            premium service.
          </motion.p>
          
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid gap-8 md:grid-cols-3 lg:gap-8"
        >
          {plans.map((plan, index) => {
            const PlanIcon = plan.icon;
            return (
              <motion.div
                key={plan.name}
                variants={item}
                onHoverStart={() => setHoveredPlan(plan.name)}
                onHoverEnd={() => setHoveredPlan(null)}
                className={`relative bg-white rounded-2xl overflow-hidden transition-all duration-300 border ${
                  hoveredPlan === plan.name
                    ? "border-blue-400 shadow-xl transform -translate-y-2"
                    : plan.popular
                    ? "border-blue-200 ring-1 ring-blue-500/30 shadow-lg"
                    : "border-gray-100 shadow-md"
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 w-full">
                    <div className="bg-blue-600 text-white text-xs font-semibold py-1 px-4 rounded-tr-lg rounded-bl-lg ml-auto w-fit">
                      Most Popular
                    </div>
                  </div>
                )}

                <div className="p-8 flex-1 flex flex-col">
                  <div className="mb-6 text-center">
                    <motion.div
                      animate={{
                        y: [0, -5, 0],
                        transition: {
                          duration: 4,
                          repeat: Infinity,
                          ease: "easeInOut",
                        },
                      }}
                      className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-br from-blue-50 to-indigo-50 mb-6 shadow-inner"
                    >
                      <PlanIcon
                        className={`h-8 w-8 ${
                          plan.popular ? "text-blue-600" : "text-indigo-600"
                        }`}
                      />
                    </motion.div>
                    <motion.h3
                      className={`text-2xl font-bold bg-gradient-to-r ${
                        plan.popular
                          ? "from-blue-600 to-indigo-600"
                          : "from-gray-800 to-gray-600"
                      } bg-clip-text text-transparent`}
                      whileHover={{ scale: 1.02 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 10,
                      }}
                    >
                      {plan.name}
                    </motion.h3>
                    <p className="mt-2 text-gray-500">{plan.description}</p>

                    <div className="mt-6">
                      <motion.div
                        className="flex items-baseline justify-center"
                        whileHover={{ scale: 1.03 }}
                        transition={{ type: "spring", stiffness: 500 }}
                      >
                        <span className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                          {plan.price[billingCycle]}
                        </span>
                        <span className="ml-1.5 text-lg font-medium text-gray-500">
                          {billingCycle === "monthly" ? "/month" : "/wash"}
                        </span>
                      </motion.div>
                      {billingCycle === "monthly" && (
                        <p className="mt-1 text-sm text-gray-500">
                          4 washes per month
                        </p>
                      )}
                    </div>
                  </div>

                  <ul className="space-y-3.5 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        {getFeatureIcon(feature, i)}
                        <span className="ml-3 text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto pt-6">
                    <motion.button
                      whileHover={buttonHover}
                      whileTap={buttonTap}
                      onClick={() => handleBookNow(plan)}
                      className={`relative overflow-hidden mt-8 block w-full rounded-xl px-6 py-3.5 text-center text-sm font-semibold leading-6 focus-visible:outline-none transition-colors duration-200 ${
                        plan.popular
                          ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md hover:shadow-lg hover:from-blue-500 hover:to-indigo-500"
                          : "bg-white text-blue-600 shadow-sm ring-1 ring-gray-200 hover:bg-blue-50 hover:ring-2 hover:ring-blue-500"
                      }`}
                    >
                      <span className="relative z-10">{plan.buttonText}</span>
                      {plan.popular && (
                        <motion.span
                          className="absolute inset-0 bg-white/10"
                          initial={{ x: "-100%", opacity: 0 }}
                          whileHover={{ x: "100%", opacity: 0.2 }}
                          transition={{ duration: 0.8, ease: "easeInOut" }}
                        />
                      )}
                    </motion.button>

                    {billingCycle === "monthly" && plan.popular && (
                      <p className="mt-3 text-center text-sm text-gray-500">
                        <Clock className="inline-block w-4 h-4 mr-1 -mt-0.5" />
                        First month free trial
                      </p>
                    )}
                  </div>
                </div>

                <div className="relative h-1.5 bg-gray-100 overflow-hidden">
                  <motion.div
                    className={`h-full w-full ${
                      plan.popular
                        ? "bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-500"
                        : "bg-gray-200"
                    }`}
                    initial={plan.popular ? { x: "-100%" } : false}
                    animate={plan.popular ? { x: "100%" } : false}
                    transition={
                      plan.popular
                        ? {
                            repeat: Infinity,
                            duration: 2,
                            ease: "linear",
                          }
                        : {}
                    }
                  />
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-16 text-center"
        >
          <p className="text-gray-600 mb-6">
            Get a personalized detailing package tailored to your vehicles
            needs.
          </p>
          <motion.button
            whileHover={{
              scale: 1.03,
              boxShadow:
                "0 10px 25px -5px rgba(37, 99, 235, 0.4), 0 8px 10px -6px rgba(37, 99, 235, 0.2)",
            }}
            whileTap={buttonTap}
            onClick={scrollToContact}
            className="relative overflow-hidden px-8 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-500 hover:to-indigo-500 transition-all duration-300 shadow-md"
          >
            <span className="relative z-10 flex items-center justify-center">
              <Sparkles className="w-4 h-4 mr-2" />
              Get a Custom Quote
            </span>
            <motion.span
              className="absolute inset-0 bg-white/10"
              initial={{ x: "-100%", opacity: 0 }}
              whileHover={{ x: "100%", opacity: 0.2 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
