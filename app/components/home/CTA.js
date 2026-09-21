"use client";

import { memo, useCallback, useState ,useRef} from 'react';
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
    color: 'from-blue-500/10 to-cyan-500/10',
    duration: 10,
    delay: 0,
  },
  {
    top: '25%',
    right: '15%',
    size: 'w-12 h-12',
    color: 'from-cyan-500/10 to-blue-500/10',
    duration: 8,
    delay: 0.5,
  },
  {
    bottom: '20%',
    right: '25%',
    size: 'w-16 h-16',
    color: 'from-blue-500/10 to-indigo-500/10',
    duration: 12,
    delay: 0.3,
  },
  {
    top: '65%',
    left: '8%',
    size: 'w-10 h-10',
    color: 'from-cyan-500/10 to-blue-500/10',
    duration: 9,
    delay: 0.7,
  },
  {
    bottom: '10%',
    left: '20%',
    size: 'w-14 h-14',
    color: 'from-blue-500/10 to-cyan-500/10',
    duration: 11,
    delay: 0.4,
  },
];

const TRUST_ITEMS = [
  {
    icon: <ShieldCheck className="w-6 h-6 text-green-400" />,
    text: '100% Satisfaction Guarantee',
  },
  {
    icon: <Car className="w-6 h-6 text-cyan-400" />,
    text: 'Certified Technicians',
  },
  {
    icon: <Clock className="w-6 h-6 text-blue-400" />,
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

// Memoized Bubble Component
const Bubble = memo(({ bubble }) => (
  <motion.div
    className={`absolute ${bubble.size} rounded-full bg-gradient-to-br ${bubble.color} backdrop-blur-sm mix-blend-screen`}
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
    <span className="text-xs sm:text-sm font-medium text-gray-300">
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
      className="relative py-16 sm:py-20 md:py-24 lg:py-36 overflow-hidden bg-[#030712] border-t border-white/5 text-white"
      aria-labelledby="cta-heading"
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

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
          <div className="text-center lg:text-left space-y-6 sm:space-y-8">
            <motion.div
              variants={itemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              className="inline-flex items-center justify-center mb-4 sm:mb-6 px-4 sm:px-6 py-1.5 sm:py-2.5 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 shadow-lg"
            >
              <Sparkles className="w-4 sm:w-5 h-4 sm:h-5 text-cyan-400 mr-1.5 sm:mr-2" />
              <span className="text-cyan-400 font-medium text-xs sm:text-sm md:text-base tracking-wide">
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
                <span className="text-white">
                  Give Your Car
                </span>
              </motion.span>
              <motion.span
                variants={itemVariants}
                className="block text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight"
              >
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
                  a Fresh New Look
                </span>
              </motion.span>
            </motion.h2>

            <motion.p
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              className="text-sm xs:text-base sm:text-lg md:text-xl text-gray-400 max-w-2xl leading-relaxed font-light px-2 sm:px-0"
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
                className="group relative w-full sm:w-auto px-6 sm:px-8 md:px-10 py-3 sm:py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold rounded-xl text-sm sm:text-base md:text-lg shadow-lg hover:shadow-xl hover:shadow-cyan-500/30 transition-all duration-300 overflow-hidden flex items-center justify-center gap-2"
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

            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-6 bg-white/5 backdrop-blur-md p-4 sm:p-6 rounded-2xl border border-white/10 shadow-xl mx-2 sm:mx-0"
              aria-label="Our guarantees"
            >
              {TRUST_ITEMS.map((item, index) => (
                <TrustItem key={index} icon={item.icon} text={item.text} />
              ))}
            </motion.div>
          </div>

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
            <div className="relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_0_80px_-20px_rgba(6,182,212,0.15)] p-6 sm:p-8 md:p-10 mx-2 sm:mx-0">
              <div className="text-center mb-8">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-cyan-400 text-sm mb-6">
                  <Sparkles className="w-4 h-4" aria-hidden="true" />
                  Newsletter
                </span>
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-white" id="newsletter-heading">
                  Stay in the Loop
                </h3>
                <p className="text-gray-400 max-w-md mx-auto text-sm sm:text-base md:text-lg">
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
                      className="w-full h-14 px-5 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 text-white placeholder:text-gray-500 outline-none transition-colors"
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
                        : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500'
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

                <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-500 pt-2">
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
