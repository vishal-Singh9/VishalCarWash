'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from 'framer-motion';
import { useState } from 'react';
import { MailCheck, ShieldCheck } from 'lucide-react';

export function Newsletter() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Subscribed with:', email);
      setIsSubscribed(true);
      setEmail('');
      setIsLoading(false);
    }, 1500);
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <section className="relative py-20 bg-gradient-to-br from-blue-600 to-blue-800 text-white overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-blue-400/20 rounded-full mix-blend-multiply filter blur-3xl"></div>
      </div>

      <div className="relative container mx-auto px-4">
        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="max-w-3xl mx-auto bg-white/5 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white/10"
        >
          <motion.div 
            variants={item}
            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 mb-6"
          >
            <MailCheck className="w-8 h-8 text-white" />
          </motion.div>
          
          <motion.h2 
            variants={item}
            className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100"
          >
            Stay in the Loop
          </motion.h2>
          
          <motion.p 
            variants={item}
            className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto"
          >
            Subscribe to our newsletter for exclusive offers, car care tips, and special discounts.
          </motion.p>
          
          {isSubscribed ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-green-500/20 border border-green-400/30 rounded-xl p-6 text-center"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-500/20 mb-4">
                <ShieldCheck className="w-6 h-6 text-green-300" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">You are Subscribed!</h3>
              <p className="text-green-100">Thank you for joining our community. Check your inbox for our welcome email.</p>
            </motion.div>
          ) : (
            <motion.form 
              variants={item}
              onSubmit={handleSubmit}
              className="space-y-4 max-w-2xl mx-auto"
            >
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-grow">
                  <Input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address" 
                    className="w-full h-14 px-6 pr-12 text-gray-900 bg-white/90 backdrop-blur-sm border-0 shadow-lg focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 focus:ring-offset-blue-600 rounded-xl"
                    required
                  />
                  <MailCheck className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="h-14 px-8 text-lg font-semibold whitespace-nowrap bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 rounded-xl"
                >
                  {isLoading ? 'Subscribing...' : 'Subscribe Now'}
                </Button>
              </div>
              
              <motion.p 
                variants={item}
                className="flex items-center justify-center text-sm text-blue-100 mt-4"
              >
                <ShieldCheck className="w-4 h-4 mr-2 text-blue-300" />
                We respect your privacy. Unsubscribe at any time.
              </motion.p>
            </motion.form>
          )}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-12 text-center text-blue-100/80 text-sm"
        >
          Join over 10,000+ car enthusiasts who receive our weekly tips and offers
        </motion.div>
      </div>
    </section>
  );
}
