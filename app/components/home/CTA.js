"use client";

import { motion, useAnimation } from "framer-motion";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Car,
  ShieldCheck,
  Clock,
  Calendar,
  Phone,
  ChevronRight,
  CheckCircle,
  Loader2,
  Check,
  X,
} from "lucide-react";
import { toast } from "sonner";

export function CTA() {
  const router = useRouter();

  const handleBookAppointment = () => {
    router.push("/booking");
  };

  const handleContactUs = () => {
    router.push("/contact");
  };
  const controls = useAnimation();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const web3formsKey = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          access_key: web3formsKey,
          email: email,
          subject: "New Newsletter Subscription",
          from_name: "Vishal Car Wash",
          botcheck: false,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setIsSubmitted(true);
        setEmail("");
        toast.success("Successfully subscribed to our newsletter!");
        // Reset form after 5 seconds
        setTimeout(() => {
          setIsSubmitted(false);
        }, 5000);
      } else {
        throw new Error(data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to subscribe. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const sequence = async () => {
      await controls.start("visible");
    };
    sequence();
  }, [controls]);

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
        when: "beforeChildren",
      },
    },
  };

  const item = {
    hidden: { x: -30, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 12,
        mass: 0.5,
      },
    },
  };

  const fadeInUp = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  const fadeInRight = {
    hidden: { x: 30, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <section className="relative py-16 sm:py-20 md:py-24 lg:py-36 overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/5 via-transparent to-transparent w-full h-full"></div>
        <div className="absolute inset-0 bg-grid-white/[0.03] bg-[length:40px_40px] opacity-20"></div>

        {/* Animated gradient overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-blue-700/15 to-blue-800/20"
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "linear",
          }}
        />
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white/5 to-transparent"></div>
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white/5 to-transparent"></div>

      {/* Floating elements with staggered animations */}
      {[
        {
          top: "15%",
          left: "10%",
          size: "w-20 h-20",
          color: "from-blue-500/20 to-cyan-500/20",
          duration: 10,
          delay: 0,
        },
        {
          top: "25%",
          right: "15%",
          size: "w-12 h-12",
          color: "from-emerald-500/20 to-teal-500/20",
          duration: 8,
          delay: 0.5,
        },
        {
          bottom: "20%",
          right: "25%",
          size: "w-16 h-16",
          color: "from-purple-500/20 to-indigo-500/20",
          duration: 12,
          delay: 0.3,
        },
        {
          top: "65%",
          left: "8%",
          size: "w-10 h-10",
          color: "from-amber-500/20 to-yellow-500/20",
          duration: 9,
          delay: 0.7,
        },
        {
          bottom: "10%",
          left: "20%",
          size: "w-14 h-14",
          color: "from-rose-500/20 to-pink-500/20",
          duration: 11,
          delay: 0.4,
        },
      ].map((bubble, index) => (
        <motion.div
          key={index}
          className={`absolute ${bubble.size} rounded-full bg-gradient-to-br ${bubble.color} backdrop-blur-sm`}
          style={{
            top: bubble.top,
            left: bubble.left,
            right: bubble.right,
            bottom: bubble.bottom,
          }}
          animate={{
            y: [0, -20, 0, 20, 0],
            x: [0, 15, 0, -15, 0],
            scale: [1, 1.15, 1],
            rotate: [0, 15, 0, -15, 0],
          }}
          transition={{
            duration: bubble.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: bubble.delay,
            times: [0, 0.25, 0.5, 0.75, 1],
          }}
        />
      ))}

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          variants={container}
          initial="hidden"
          animate={controls}
          className="max-w-8xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
        >
          {/* Left Column - Main CTA Content */}
          <div className="text-center lg:text-left space-y-6 sm:space-y-8">
            <motion.div
              variants={item}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              className="inline-flex items-center justify-center mb-4 sm:mb-6 px-4 sm:px-6 py-1.5 sm:py-2.5 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 shadow-lg"
            >
              <Sparkles className="w-4 sm:w-5 h-4 sm:h-5 text-amber-400 mr-1.5 sm:mr-2" />
              <span className="text-amber-400 font-medium text-xs sm:text-sm md:text-base tracking-wide">
                Premium Car Care Experience
              </span>
            </motion.div>

            <motion.h2
              variants={container}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              className="space-y-2 sm:space-y-3"
            >
              <motion.span
                variants={item}
                className="block text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight"
              >
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-cyan-200">
                  Give Your Car
                </span>
              </motion.span>
              <motion.span
                variants={item}
                className="block text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight"
              >
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-200">
                  a Fresh New Look
                </span>
              </motion.span>
            </motion.h2>

            <motion.p
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              className="text-sm xs:text-base sm:text-lg md:text-xl text-blue-100/90 max-w-2xl leading-relaxed font-light px-2 sm:px-0"
            >
              We provide professional car washing and detailing to keep your
              vehicle spotless and protected. Schedule your wash today.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row items-center lg:items-start lg:justify-start gap-3 sm:gap-4 md:gap-6 px-2 sm:px-0"
            >
              <button
                onClick={handleBookAppointment}
                className="group relative w-full sm:w-auto px-6 sm:px-8 md:px-10 py-3 sm:py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-900 font-semibold rounded-xl text-sm sm:text-base md:text-lg shadow-lg hover:shadow-xl hover:shadow-amber-500/30 transition-all duration-300 overflow-hidden flex items-center justify-center gap-2"
              >
                <Calendar className="w-5 h-5" />
                <span>Book Appointment</span>
                <ChevronRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-200" />
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>

              <button
                onClick={handleContactUs}
                className="group relative w-full sm:w-auto px-6 sm:px-8 md:px-10 py-3 sm:py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium rounded-xl text-sm sm:text-base md:text-lg shadow-lg hover:shadow-xl hover:shadow-white/5 transition-all duration-300 overflow-hidden flex items-center justify-center gap-2 cursor-pointer"
              >
                <Phone className="w-5 h-5" />
                <span>Contact Us Now</span>
                <ChevronRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-200" />
              </button>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-6 bg-white/5 backdrop-blur-sm p-4 sm:p-6 rounded-2xl border border-white/10 shadow-xl mx-2 sm:mx-0"
            >
              {[
                {
                  icon: <ShieldCheck className="w-6 h-6 text-emerald-400" />,
                  text: "100% Satisfaction Guarantee",
                },
                {
                  icon: <Car className="w-6 h-6 text-blue-400" />,
                  text: "Certified Technicians",
                },
                {
                  icon: <Clock className="w-6 h-6 text-amber-400" />,
                  text: "Quick & Efficient Service",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row items-center text-center sm:text-left sm:justify-start gap-3"
                >
                  <div className="p-2 bg-white/5 rounded-lg border border-white/5">
                    {feature.icon}
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-blue-100/90">
                    {feature.text}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right Column - Newsletter */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{
              duration: 3,
              ease: [0.2, 2, 0.3, 2],
              delay: 0.7,
            }}
            className="relative mt-12 lg:mt-0"
          >
            <div className="relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_0_80px_-20px_rgba(59,130,246,0.4)] p-6 sm:p-8 md:p-10 mx-2 sm:mx-0">
              <div className="text-center mb-8">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-200 text-sm mb-6">
                  <Sparkles className="w-4 h-4" />
                  Newsletter
                </span>
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
                  Stay in the Loop
                </h3>
                <p className="text-white/80 max-w-md mx-auto text-sm sm:text-base md:text-lg">
                  Exclusive offers, car care tips & special discounts — straight
                  to your inbox.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full h-14 px-5 rounded-xl bg-white/5 border-2 border-white/10 focus:border-blue-400 focus:ring-blue-400/30 text-white placeholder:text-white/60 outline-none transition-colors"
                      disabled={isLoading || isSubmitted}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading || isSubmitted}
                    className={`w-full h-14 px-6 rounded-xl font-medium text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 ${
                      isSubmitted
                        ? "bg-green-500 hover:bg-green-600"
                        : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Subscribing...
                      </>
                    ) : isSubmitted ? (
                      <>
                        <Check className="w-5 h-5" />
                        Subscribed!
                      </>
                    ) : (
                      <>
                        Subscribe
                        <ChevronRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-white/60 pt-2">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" /> Privacy protected
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4" /> No spam ever
                  </span>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
