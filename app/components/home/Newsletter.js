"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  MailCheck,
  ShieldCheck,
  Sparkles,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isValid, setIsValid] = useState(true);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setIsValid(false);
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsSubscribed(true);
      setEmail("");
      setIsLoading(false);
    }, 1200);
  };

  return (
    <section className="relative py-24 md:py-32 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/carwashnews.webp')" }}
      />
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      <div className="relative container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto rounded-3xl border border-white/10 
                     bg-white/5 backdrop-blur-xl shadow-[0_0_80px_-20px_rgba(59,130,246,0.4)]
                     p-8 md:p-12"
        >
          {/* Header */}
          <div className="text-center mb-10">
            <span
              className="inline-flex items-center gap-2 px-4 py-1.5 
                             rounded-full bg-blue-500/10 border border-blue-400/20
                             text-blue-200 text-sm mb-6"
            >
              <Sparkles className="w-4 h-4" />
              Newsletter
            </span>

            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Stay in the Loop
            </h2>
            <p className="text-white/80 max-w-xl mx-auto text-lg">
              Exclusive offers, car care tips & special discounts — straight to
              your inbox.
            </p>
          </div>

          <AnimatePresence mode="wait">
            {isSubscribed ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="text-center py-12"
              >
                <div
                  className="inline-flex items-center justify-center w-20 h-20 
                                rounded-2xl bg-green-500/10 border border-green-400/30 mb-6"
                >
                  <CheckCircle2 className="w-10 h-10 text-green-400" />
                </div>
                <h3 className="text-2xl font-semibold mb-2">
                  You’re Subscribed!
                </h3>
                <p className="text-white/80 max-w-md mx-auto mb-8">
                  Thanks for joining us. Watch your inbox for exclusive updates.
                </p>
                <Button
                  variant="outline"
                  className="border-white/20 text-black hover:bg-white/20"
                  onClick={() => setIsSubscribed(false)}
                >
                  Subscribe another email
                </Button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`h-14 rounded-xl bg-white/5 border-2 
                        ${!isValid ? "border-red-400" : "border-white/10"}
                        focus:border-blue-400 focus:ring-blue-400/30
                        text-white placeholder:text-white/60`}
                    />
                    {!isValid && (
                      <p className="text-sm text-red-400 mt-2">
                        Please enter a valid email address
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="h-14 px-8 rounded-xl font-medium 
                               bg-gradient-to-r from-blue-500 to-indigo-600
                               hover:from-blue-600 hover:to-indigo-700
                               shadow-lg hover:shadow-xl transition"
                  >
                    {isLoading ? (
                      "Subscribing..."
                    ) : (
                      <span className="flex items-center">
                        Subscribe
                        <ChevronRight className="ml-2 w-4 h-4" />
                      </span>
                    )}
                  </Button>
                </div>

                {/* Trust indicators */}
                <div className="flex items-center justify-center gap-6 text-sm text-white/60 pt-2">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" /> Privacy protected
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MailCheck className="w-4 h-4" /> No spam ever
                  </span>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
