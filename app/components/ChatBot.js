"use client";

import { useState, useRef, useEffect, Component } from "react";
import {
  Send,
  MessageSquare,
  X,
  Bot,
  User,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { cn } from "@/lib/utils";

// Typing animation component
const TypingIndicator = () => (
  <motion.div
    className="flex space-x-1.5 p-2"
    initial={{ opacity: 0, y: 5 }}
    animate={{ opacity: 1, y: 0 }}
  >
    <motion.div
      className="w-2 h-2 rounded-full bg-blue-400"
      animate={{
        y: ["0%", "-50%", "0%"],
        scale: [1, 1.2, 1],
      }}
      transition={{
        duration: 1.2,
        repeat: Infinity,
        repeatType: "reverse",
      }}
    />
    <motion.div
      className="w-2 h-2 rounded-full bg-blue-500"
      animate={{
        y: ["0%", "-50%", "0%"],
        scale: [1, 1.2, 1],
      }}
      transition={{
        duration: 1.2,
        delay: 0.2,
        repeat: Infinity,
        repeatType: "reverse",
      }}
    />
    <motion.div
      className="w-2 h-2 rounded-full bg-blue-600"
      animate={{
        y: ["0%", "-50%", "0%"],
        scale: [1, 1.2, 1],
      }}
      transition={{
        duration: 1.2,
        delay: 0.4,
        repeat: Infinity,
        repeatType: "reverse",
      }}
    />
  </motion.div>
);

const MessageBubble = ({ message, isBotTyping, messages }) => {
  const isBot = message.sender === "bot";

  return (
    <motion.div
      key={message.id}
      className={`flex ${isBot ? "justify-start" : "justify-end"} mb-3`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div
        className={`flex items-start gap-2 max-w-[85%] ${
          !isBot && "flex-row-reverse"
        }`}
      >
        <div
          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-sm ${
            isBot
              ? "bg-white text-blue-600 border border-blue-100"
              : "bg-gradient-to-br from-blue-600 to-blue-500 text-white"
          }`}
        >
          {isBot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
        </div>
        <motion.div
          className={`p-3 rounded-2xl text-sm shadow-sm ${
            isBot
              ? "bg-white text-gray-800 rounded-tl-none border border-blue-50"
              : "bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-tr-none"
          }`}
          initial={{ scale: 0.95, opacity: 0.8 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 30,
            duration: 0.2,
          }}
        >
          <div className="whitespace-pre-wrap">{message.text}</div>
          {isBotTyping && messages && messages.length > 0 && message.id === messages[messages.length - 1]?.id && (
            <TypingIndicator />
          )}
          <div
            className={`text-xs mt-1.5 text-right ${
              isBot ? "text-blue-500/70" : "text-blue-100/80"
            }`}
          >
            {new Date(message.timestamp).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

// Error Boundary Component
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ChatBot Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="fixed bottom-4 right-4 z-50">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 m-4 rounded-lg shadow-lg max-w-xs">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  Oops! Something went wrong with the chat. Please refresh the page to continue.
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  // Initialize with empty messages to avoid hydration mismatch
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your car wash assistant. How can I help you today?",
      sender: "bot",
      timestamp: new Date().toISOString(), // Use ISO string for consistent serialization
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isBotTyping, setIsBotTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const controls = useAnimation();
  const inputRef = useRef(null);

  // Floating animation for the chat button
  useEffect(() => {
    if (!isOpen) {
      controls.start({
        y: [0, -10, 0],
        transition: {
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        },
      });
    } else {
      controls.stop();
    }
  }, [isOpen, controls]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        const input = document.querySelector('input[type="text"]');
        if (input) input.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const messageText = inputValue.trim();
    if (!messageText || isBotTyping) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      text: messageText,
      sender: "user",
      timestamp: new Date().toISOString(), // Use ISO string for consistent serialization
    };

    // Update messages with user message
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsBotTyping(true);

    // Auto-focus input after sending
    if (inputRef.current) {
      inputRef.current.focus();
    }

    try {
      // Simulate API call delay with random variation
      const typingTime = 800 + Math.random() * 800;
      await new Promise((resolve) => setTimeout(resolve, typingTime));

      // Get bot response
      const botResponse = {
        id: Date.now() + 1,
        text: getBotResponse(messageText),
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botResponse]);
    } catch (error) {
      console.error("Error getting bot response:", error);
      const errorResponse = {
        id: Date.now() + 1,
        text: "I'm having trouble connecting right now. Please try again later.",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorResponse]);
    } finally {
      setIsBotTyping(false);
    }
  };

  const getBotResponse = (userInput) => {
    const input = userInput.toLowerCase();

    if (
      input.includes("hello") ||
      input.includes("hi") ||
      input.includes("hey")
    ) {
      return "Hello! How can I assist you with our car wash services today?";
    } else if (
      input.includes("price") ||
      input.includes("cost") ||
      input.includes("how much")
    ) {
      return "We offer various packages starting from ₹299 for a basic wash to ₹1,999 for a complete detailing package. Would you like to know more about our services?";
    } else if (
      input.includes("time") ||
      input.includes("open") ||
      input.includes("close")
    ) {
      return "We're open from 8:00 AM to 8:00 PM, seven days a week. You can book a slot anytime within these hours.";
    } else if (
      input.includes("book") ||
      input.includes("appointment") ||
      input.includes("schedule")
    ) {
      return "You can book a service by visiting our 'Book Now' page. Would you like me to guide you through the booking process?";
    } else if (input.includes("thank") || input.includes("thanks")) {
      return "You're welcome! Is there anything else I can help you with?";
    } else if (
      input.includes("contact") ||
      input.includes("reach") ||
      input.includes("call")
    ) {
      return "You can reach us at +91 98765 43210 or email us at support@vishalcarwash.com. Our team is available to assist you from 8 AM to 8 PM daily.";
    } else if (
      input.includes("service") ||
      input.includes("offer") ||
      input.includes("package")
    ) {
      return "We offer a range of services including Basic Wash, Premium Wash, Interior Detailing, and Complete Car Care Packages. Would you like more details about any specific service?";
    } else if (input.includes("cancel") || input.includes("refund")) {
      return "You can cancel your booking up to 2 hours before the scheduled time for a full refund. Please contact our support team for any cancellation requests.";
    } else if (
      input.includes("location") ||
      input.includes("where") ||
      input.includes("address")
    ) {
      return "We're located at 123 Car Care Street, Mumbai, 400001. You can also find us on Google Maps for directions.";
    } else {
      return "I'm here to help! Could you please provide more details about your query? You can ask about our services, pricing, or booking process.";
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Floating Action Button */}
      <AnimatePresence>
        {!showChat && (
          <motion.button
            onClick={() => setShowChat(true)}
            className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-full shadow-lg flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 transition-all duration-200"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{
              scale: 1.05,
              rotate: [0, -5, 5, 0],
            }}
            whileTap={{ scale: 0.95 }}
          >
            <MessageSquare className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Interface */}
      <AnimatePresence>
        {showChat && (
          <motion.div
            className={`
              fixed bottom-24 right-6 z-[99] w-full max-w-xs sm:max-w-sm md:max-w-md shadow-2xl rounded-2xl overflow-hidden
              border border-gray-200 dark:border-gray-700 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm
            `}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
          >
            <Card className="shadow-2xl rounded-2xl overflow-hidden h-[510px] flex flex-col border-0 bg-gradient-to-br from-blue-50 to-blue-100/80 backdrop-blur-sm border border-blue-200/50">
              <CardHeader className="bg-blue-600 text-white p-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                <div className="flex justify-between items-center relative z-10">
                  <div className="flex items-center gap-3">
                    <motion.div
                      className="bg-white/10 p-2 rounded-full"
                      animate={{
                        rotate: [0, 5, -5, 0],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        repeatType: "reverse",
                      }}
                    >
                      <Bot className="h-5 w-5" />
                    </motion.div>
                    <div>
                      <CardTitle className="text-lg font-bold tracking-tight">
                        Car Wash Assistant
                      </CardTitle>
                      <p className="text-xs text-white/90 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                        <span className="font-medium">Available now</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white/80 hover:bg-white/20 h-8 w-8 p-0 rounded-full"
                      onClick={() => setIsMinimized(!isMinimized)}
                    >
                      {isMinimized ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white/80 hover:bg-white/20 h-8 w-8 p-0 rounded-full"
                      onClick={() => setShowChat(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <motion.p
                  className="text-xs text-white/80"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  We are here to help you 24/7
                </motion.p>
              </CardHeader>
              <CardContent className="p-0">
                <motion.div
                  className="flex-1 flex flex-col bg-gradient-to-b from-blue-50/50 to-blue-100/30 overflow-hidden"
                  initial={false}
                  animate={{
                    height: isMinimized ? 0 : "400px",
                    opacity: isMinimized ? 0 : 1,
                  }}
                  transition={{ type: "spring", damping: 25, stiffness: 400 }}
                >
                  <ScrollArea className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                    <div className="flex justify-center mb-4">
                      <div className="bg-white/80 backdrop-blur-sm text-blue-700 text-xs px-4 py-1.5 rounded-full border border-blue-100 shadow-sm">
                        <span suppressHydrationWarning>
                          Today,{" "}
                          {new Date().toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <MessageBubble
                          key={message.id}
                          message={message}
                          isBotTyping={isBotTyping}
                          messages={messages}
                        />
                      </motion.div>
                    ))}
                    {isBotTyping &&
                      messages[messages.length - 1]?.sender === "user" && (
                        <motion.div
                          className="flex items-start gap-3 mb-4 px-1"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <div className="bg-primary/10 p-2 rounded-full flex-shrink-0">
                            <Bot className="h-5 w-5 text-primary" />
                          </div>
                          <TypingIndicator />
                        </motion.div>
                      )}
                    <div ref={messagesEndRef} className="h-4" />
                  </ScrollArea>

                  <div className="mt-auto">
                    <form
                      onSubmit={handleSendMessage}
                      className="p-4 border-t border-blue-100/50 bg-white/90 backdrop-blur-sm"
                    >
                      <div className="flex items-center gap-2 relative">
                        <Input
                          ref={inputRef}
                          type="text"
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          placeholder="Ask about our services..."
                          className="flex-1 rounded-full border-blue-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 h-11 pl-5 pr-12 text-sm shadow-sm bg-white/90"
                          onKeyDown={(e) =>
                            e.key === "Enter" &&
                            !e.shiftKey &&
                            handleSendMessage(e)
                          }
                        />
                        <Button
                          type="submit"
                          disabled={!inputValue.trim() || isBotTyping}
                          className={`absolute right-1 rounded-full w-9 h-9 p-0 ${
                            !inputValue.trim() || isBotTyping
                              ? "bg-blue-200"
                              : "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
                          } border-0 text-white transition-all duration-200 shadow-md`}
                        >
                          <Send
                            className={`h-4 w-4 ${
                              !inputValue.trim() || isBotTyping
                                ? "text-blue-400"
                                : "text-white"
                            }`}
                          />
                        </Button>
                      </div>
                      <p className="text-xs text-blue-500/80 mt-2 text-center font-medium">
                        {isBotTyping
                          ? "Typing..."
                          : "Ask about our services, pricing, or book an appointment"}
                      </p>
                    </form>
                  </div>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay */}
      <AnimatePresence>
        {showChat && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-40"
            onClick={() => setShowChat(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// Export the ChatBot component wrapped with ErrorBoundary
export default function ChatBotWithErrorBoundary() {
  return (
    <ErrorBoundary>
      <ChatBot />
    </ErrorBoundary>
  );
}
