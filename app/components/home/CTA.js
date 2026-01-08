"use client";

import { memo, useCallback, useMemo, useState ,useRef} from 'react';
import { useRouter } from 'next/navigation';
import { motion, useInView } from 'framer-motion';
import { Sparkles, Car, ShieldCheck, Clock, Calendar, Phone, ChevronRight, CheckCircle, Loader2, Check } from 'lucide-react';
import { toast } from 'sonner';

// Static data
const BUBBLES = [
  {
    top: '15%',
    left: '10%',
    size: 'w-20 h-20',
    color: 'from-blue-500/20 to-cyan-500/20',
    duration: 10,
    delay: 0,
  },
  {
    top: '25%',
    right: '15%',
    size: 'w-12 h-12',
    color: 'from-emerald-500/20 to-teal-500/20',
    duration: 8,
    delay: 0.5,
  },
  {
    bottom: '20%',
    right: '25%',
    size: 'w-16 h-16',
    color: 'from-purple-500/20 to-indigo-500/20',
    duration: 12,
    delay: 0.3,
  },
  {
    top: '65%',
    left: '8%',
    size: 'w-10 h-10',
    color: 'from-amber-500/20 to-yellow-500/20',
    duration: 9,
    delay: 0.7,
  },
  {
    bottom: '10%',
    left: '20%',
    size: 'w-14 h-14',
    color: 'from-rose-500/20 to-pink-500/20',
    duration: 11,
    delay: 0.4,
  },
];

const TRUST_ITEMS = [
  {
    icon: <ShieldCheck className="w-6 h-6 text-emerald-400" />,
    text: '100% Satisfaction Guarantee',
  },
  {
    icon: <Car className="w-6 h-6 text-blue-400" />,
    text: 'Certified Technicians',
  },
  {
    icon: <Clock className="w-6 h-6 text-amber-400" />,
    text: 'Quick & Efficient Service',
  },
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
      when: 'beforeChildren',
    },
  },
};

const itemVariants = {
  hidden: { x: -30, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: 'spring',
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
      type: 'spring',
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
      type: 'spring',
      stiffness: 100,
      damping: 15,
    },
  },
};

// Memoized Bubble Component
const Bubble = memo(({ bubble }) => (
  <motion.div
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
      ease: 'easeInOut',
      delay: bubble.delay,
      times: [0, 0.25, 0.5, 0.75, 1],
    }}
  />
));

Bubble.displayName = 'Bubble';

// Trust Item Component
const TrustItem = memo(({ icon, text }) => (
  <div className="flex flex-col sm:flex-row items-center text-center sm:text-left sm:justify-start gap-3">
    <div className="p-2 bg-white/5 rounded-lg border border-white/5">
      {icon}
    </div>
    <span className="text-xs sm:text-sm font-medium text-blue-100/90">
      {text}
    </span>
  </div>
));

TrustItem.displayName = 'TrustItem';

export function CTA() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const web3formsKey = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;
  
  // Refs for intersection observer
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: '-50px' });

  // Memoize handlers
  const handleBookAppointment = useCallback(() => {
    router.push('/booking');
  }, [router]);

  const handleContactUs = useCallback(() => {
    router.push('/contact');
  }, [router]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (!email) {
        toast.error('Please enter your email');
        return;
      }

      setIsLoading(true);

      try {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            access_key: web3formsKey,
            email: email,
            subject: 'New Newsletter Subscription',
            from_name: 'Vishal Car Wash',
            botcheck: false,
          }),
        });

        const data = await response.json();

        if (data.success) {
          setIsSubmitted(true);
          setEmail('');
          toast.success('Successfully subscribed to our newsletter!');
          // Reset form after 5 seconds
          const timer = setTimeout(() => {
            setIsSubmitted(false);
          }, 5000);
          return () => clearTimeout(timer);
        } else {
          throw new Error(data.message || 'Something went wrong');
        }
      } catch (error) {
        console.error('Error submitting form:', error);
        toast.error('Failed to subscribe. Please try again.');
      } finally {
        setIsLoading(false);
      }
    },
    [email, web3formsKey]
  );

  return (
    <section 
      ref={containerRef}
      className="relative py-16 sm:py-20 md:py-24 lg:py-36 overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white"
      aria-labelledby="cta-heading"
    >
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-blue-500/5 via-transparent to-transparent w-full h-full" />
        <div className="absolute inset-0 bg-grid-white/[0.03] bg-[length:40px_40px] opacity-20" />

        {/* Animated gradient overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-blue-700/15 to-blue-800/20"
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'linear',
          }}
          aria-hidden="true"
        />
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white/5 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white/5 to-transparent" />

      {/* Floating elements with staggered animations */}
      {BUBBLES.map((bubble, index) => (
        <Bubble key={index} bubble={bubble} />
      ))}

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="max-w-8xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
        >
          {/* Left Column - Main CTA Content */}
          <div className="text-center lg:text-left space-y-6 sm:space-y-8">
            <motion.div
              variants={itemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              className="inline-flex items-center justify-center mb-4 sm:mb-6 px-4 sm:px-6 py-1.5 sm:py-2.5 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 shadow-lg"
            >
              <Sparkles className="w-4 sm:w-5 h-4 sm:h-5 text-amber-400 mr-1.5 sm:mr-2" />
              <span className="text-amber-400 font-medium text-xs sm:text-sm md:text-base tracking-wide">
                Premium Car Care Experience
              </span>
            </motion.div>

            <motion.h2
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              className="space-y-2 sm:space-y-3"
              id="cta-heading"
            >
              <motion.span
                variants={itemVariants}
                className="block text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight"
              >
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-cyan-200">
                  Give Your Car
                </span>
              </motion.span>
              <motion.span
                variants={itemVariants}
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
              viewport={{ once: true, margin: '-50px' }}
              className="text-sm xs:text-base sm:text-lg md:text-xl text-blue-100/90 max-w-2xl leading-relaxed font-light px-2 sm:px-0"
            >
              We provide professional car washing and detailing to keep your
              vehicle spotless and protected. Schedule your wash today.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row items-center lg:items-start lg:justify-start gap-3 sm:gap-4 md:gap-6 px-2 sm:px-0"
            >
              <button
                onClick={handleBookAppointment}
                className="group relative w-full sm:w-auto px-6 sm:px-8 md:px-10 py-3 sm:py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-900 font-semibold rounded-xl text-sm sm:text-base md:text-lg shadow-lg hover:shadow-xl hover:shadow-amber-500/30 transition-all duration-300 overflow-hidden flex items-center justify-center gap-2"
                aria-label="Book an appointment"
              >
                <Calendar className="w-5 h-5" aria-hidden="true" />
                <span>Book Appointment</span>
                <ChevronRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-200" aria-hidden="true" />
                <span className="sr-only">Open booking page</span>
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>

              <button
                onClick={handleContactUs}
                className="group relative w-full sm:w-auto px-6 sm:px-8 md:px-10 py-3 sm:py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium rounded-xl text-sm sm:text-base md:text-lg shadow-lg hover:shadow-xl hover:shadow-white/5 transition-all duration-300 overflow-hidden flex items-center justify-center gap-2"
                aria-label="Contact us"
              >
                <Phone className="w-5 h-5" aria-hidden="true" />
                <span>Contact Us Now</span>
                <ChevronRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-200" aria-hidden="true" />
                <span className="sr-only">Open contact page</span>
              </button>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-6 bg-white/5 backdrop-blur-sm p-4 sm:p-6 rounded-2xl border border-white/10 shadow-xl mx-2 sm:mx-0"
              aria-label="Our guarantees"
            >
              {TRUST_ITEMS.map((item, index) => (
                <TrustItem key={index} icon={item.icon} text={item.text} />
              ))}
            </motion.div>
          </div>

          {/* Right Column - Newsletter */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{
              duration: 0.7,
              ease: [0.2, 2, 0.3, 2],
              delay: 0.3,
            }}
            className="relative mt-12 lg:mt-0"
            aria-labelledby="newsletter-heading"
          >
            <div className="relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_0_80px_-20px_rgba(59,130,246,0.4)] p-6 sm:p-8 md:p-10 mx-2 sm:mx-0">
              <div className="text-center mb-8">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-200 text-sm mb-6">
                  <Sparkles className="w-4 h-4" aria-hidden="true" />
                  Newsletter
                </span>
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4" id="newsletter-heading">
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
                    <label htmlFor="email" className="sr-only">
                      Email address
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full h-14 px-5 rounded-xl bg-white/5 border-2 border-white/10 focus:border-blue-400 focus:ring-blue-400/30 text-white placeholder:text-white/60 outline-none transition-colors"
                      disabled={isLoading || isSubmitted}
                      required
                      aria-required="true"
                      aria-busy={isLoading}
                      aria-live="polite"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading || isSubmitted}
                    className={`w-full h-14 px-6 rounded-xl font-medium text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 ${
                      isSubmitted
                        ? 'bg-green-500 hover:bg-green-600'
                        : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700'
                    }`}
                    aria-live="polite"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
                        <span>Subscribing...</span>
                      </>
                    ) : isSubmitted ? (
                      <>
                        <Check className="w-5 h-5" aria-hidden="true" />
                        <span>Subscribed!</span>
                      </>
                    ) : (
                      <>
                        <span>Subscribe</span>
                        <ChevronRight className="w-4 h-4" aria-hidden="true" />
                      </>
                    )}
                  </button>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-white/60 pt-2">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" aria-hidden="true" />
                    <span>Privacy protected</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4" aria-hidden="true" />
                    <span>No spam ever</span>
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
