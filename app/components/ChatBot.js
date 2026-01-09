"use client";

import { useState, useRef, useEffect, Component } from "react";
import {
  Send,
  MessageSquare,
  X,
  Bot,
  User,
  ChevronDown,
  ChevronUp,
  DollarSign,
  Clock,
  Calendar,
  MapPin,
  Phone,
  Package,
  Sparkles,
  Car,
  Wrench,
  CreditCard,
  Shield,
  Star,
  Info,
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

// Predefined questions with follow-up options
const quickQuestions = [
  {
    id: 1,
    icon: DollarSign,
    question: "What are your prices?",
    answer:
      "💰 OUR PRICING (Best Value in Town!):\n\n💧 BASIC WASH - ₹299\n• Exterior body wash with premium shampoo\n• Wheel & tire cleaning\n• Window cleaning (inside & outside)\n• Dashboard wipe & polish\n• Vacuum cleaning (seats & floor)\n• Complimentary air freshener\n⏱️ Duration: 30 minutes\n\n✨ PREMIUM WASH - ₹599 (Most Popular!)\n• Everything in Basic Wash PLUS:\n• High-pressure foam wash\n• Tire dressing & shine\n• Interior deep cleaning\n• Leather/fabric conditioning\n• Underbody wash\n• Door jambs cleaning\n⏱️ Duration: 60 minutes\n\n🚗 INTERIOR DETAILING - ₹899\n• Deep vacuum cleaning\n• Steam cleaning of upholstery\n• Leather treatment\n• Dashboard restoration\n• AC vent cleaning\n• Stain & odor removal\n⏱️ Duration: 90 minutes\n\n⭐ COMPLETE CARE - ₹1,999 (Ultimate Package!)\n• Premium Wash + Full Detailing\n• Engine bay cleaning\n• Headlight restoration\n• Paint protection (3-month coating)\n• Ceramic coating application\n• Minor scratch removal\n⏱️ Duration: 3-4 hours\n\n🎁 SPECIAL: First-time customers get 10% OFF!",
    color: "from-green-500 to-emerald-600",
    followUp: [
      {
        id: 11,
        icon: Info,
        text: "Basic Wash details",
        answer:
          "💧 BASIC WASH PACKAGE (₹299)\n\n📋 WHAT'S INCLUDED:\n• Premium shampoo exterior wash\n• High-pressure rinse\n• Wheel & tire cleaning with brush\n• All windows cleaned (inside & out)\n• Dashboard & console wipe & polish\n• Floor mat removal & cleaning\n• Vacuum cleaning (seats, carpet, trunk)\n• Air freshener (choose your scent!)\n• Tire shine application\n\n⏱️ DURATION: 30 minutes\n\n✅ PERFECT FOR:\n• Regular weekly maintenance\n• Quick refresh before meetings\n• Light dust & dirt removal\n• Budget-friendly option\n\n💡 PRO TIP: Combine with monthly package for 20% savings!\n\n🎯 BEST FOR: Sedans, Hatchbacks\n\n⭐ Customer Rating: 4.8/5",
        followUp: [
          {
            id: 111,
            icon: DollarSign,
            text: "Any monthly packages?",
            answer:
              "💎 MONTHLY PACKAGE - ₹2,499 (Save ₹1,295!)\n\n📦 INCLUDES:\n• 4 Premium Washes (₹2,396 value)\n• 1 Interior Detailing (₹899 value)\n• Priority booking slots\n• Free car fragrance\n• Loyalty points\n\n✨ TOTAL VALUE: ₹3,295\n💰 YOU PAY: ₹2,499\n🎉 YOU SAVE: ₹796\n\n📅 VALIDITY: 30 days from purchase\n🚗 TRANSFERABLE: Can be used for any vehicle\n\n🎁 BONUS:\n• Skip the queue with priority service\n• 5% off on additional services\n• Birthday month free upgrade",
          },
        ],
      },
      {
        id: 12,
        icon: Star,
        text: "Premium Wash details",
        answer:
          "✨ PREMIUM WASH PACKAGE (₹599) - Most Popular!\n\n📋 COMPREHENSIVE SERVICE:\n✅ Everything in Basic Wash PLUS:\n\n🧼 EXTERIOR:\n• High-pressure foam wash\n• Pre-wash bug & tar removal\n• Clay bar treatment for smooth finish\n• Wax application for shine\n• Underbody wash (removes salt & grime)\n• Door jambs & hinges cleaning\n• Tire dressing & wheel polish\n• Chrome & glass polish\n\n🏠 INTERIOR:\n• Deep vacuum (including trunk)\n• Leather seats conditioning\n• Fabric seats steam cleaning\n• Dashboard UV protection\n• All surfaces wiped & polished\n• Door panels & console detailed\n• Cup holders & vents cleaned\n\n⏱️ DURATION: 60 minutes\n\n✅ PERFECT FOR:\n• Bi-weekly maintenance\n• Special occasions & events\n• After long trips\n• Monsoon & winter care\n\n🌟 PREMIUM BENEFITS:\n• Enhanced paint protection\n• Long-lasting shine (2-3 weeks)\n• Better resale value\n• Professional finish\n\n💡 RECOMMENDED: Every 15 days for best results\n\n⭐ Customer Rating: 4.9/5\n🏆 #1 Choice among our customers!",
        followUp: [
          {
            id: 121,
            icon: Shield,
            text: "Add ceramic coating?",
            answer:
              "🛡️ CERAMIC COATING ADD-ON\n\n💎 NANO CERAMIC PROTECTION:\n• 9H hardness (scratch resistant)\n• Hydrophobic (water beads off)\n• UV protection (prevents fading)\n• Enhanced gloss & shine\n• Easy to clean\n• Long-lasting protection\n\n💰 PRICING:\n• 3-Month Coating: +₹999\n• 6-Month Coating: +₹1,799\n• 1-Year Coating: +₹2,999\n\n✨ BENEFITS:\n✅ Paint protection from:\n  - Bird droppings\n  - Tree sap\n  - Road salt\n  - UV damage\n  - Minor scratches\n\n⏱️ APPLICATION TIME: +2 hours\n\n🎁 FREE with Complete Care Package!\n\n📞 Want to add? Just mention during booking!",
          },
        ],
      },
      {
        id: 13,
        icon: Sparkles,
        text: "Complete Care details",
        answer:
          "⭐ COMPLETE CARE PACKAGE (₹1,999)\n🏆 Our Premium Ultimate Package!\n\n📋 EVERYTHING INCLUDED:\n\n🧼 EXTERIOR EXCELLENCE:\n• Premium foam wash with pH-balanced shampoo\n• Clay bar treatment\n• Paint decontamination\n• Machine polishing (removes swirls)\n• 6-month ceramic coating\n• Headlight restoration & polishing\n• Chrome trim detailing\n• Wax & sealant application\n• Underbody cleaning & protection\n\n🏠 INTERIOR PERFECTION:\n• Complete deep vacuum\n• Steam cleaning (entire interior)\n• Leather deep conditioning\n• Fabric stain removal treatment\n• Dashboard restoration & protection\n• All plastics cleaned & protected\n• Odor elimination treatment\n• AC vent deep cleaning\n• Carpet shampooing\n• Door panels detailed\n\n🔧 ENGINE & EXTRAS:\n• Engine bay degreasing\n• Engine compartment cleaning\n• Hose & belt inspection\n• Battery terminal cleaning\n• Minor scratch removal\n\n⏱️ DURATION: 3-4 hours\n💡 We recommend dropping your car for best results\n\n✅ PERFECT FOR:\n• Monthly deep cleaning\n• Pre-sale preparation\n• After monsoon care\n• Special events & weddings\n• Complete vehicle restoration\n\n🎁 FREE INCLUSIONS:\n• Premium car fragrance\n• 6-month ceramic coating (₹1,799 value)\n• Engine bay cleaning\n• Free pickup & drop (within 5km)\n• 30-day touch-up warranty\n\n💰 TOTAL VALUE: ₹4,500+\n🎉 YOU PAY: Only ₹1,999\n💵 YOU SAVE: ₹2,500+\n\n⭐ Rating: 5.0/5\n🏆 Award-winning service!\n\n📞 Advance booking recommended!",
      },
    ],
  },
  {
    id: 2,
    icon: Clock,
    question: "What are your timings?",
    answer:
      "⏰ OPERATING HOURS:\n\n📅 OPEN 7 DAYS A WEEK!\nMonday - Sunday: 8:00 AM - 8:00 PM\n(Including Public Holidays)\n\n🕐 SLOT AVAILABILITY:\n• Morning Slots: 8 AM - 12 PM\n• Afternoon Slots: 12 PM - 4 PM\n• Evening Slots: 4 PM - 8 PM\n\n💡 BOOKING TIPS:\n✅ Book 24 hours ahead for guaranteed slot\n✅ Weekday mornings (9-11 AM) - Less crowded\n✅ Early afternoons (2-4 PM) - Good availability\n⚠️ Avoid weekends 11 AM - 3 PM (peak hours)\n\n🎯 WALK-INS WELCOME!\nBut bookings get priority service\n\n📞 CUSTOMER SUPPORT:\n8:00 AM - 8:00 PM Daily\nCall: +91 98765 43210\nWhatsApp: Available 24/7 for bookings\n\n🌧️ MONSOON SEASON:\nExtended hours on demand\nRain-covered service area",
    color: "from-blue-500 to-cyan-600",
    followUp: [
      {
        id: 21,
        icon: Calendar,
        text: "Book an appointment",
        answer:
          "📅 To book an appointment:\n\n1️⃣ Visit our 'Book Now' page\n2️⃣ Select your service\n3️⃣ Choose date & time\n4️⃣ Confirm booking\n\nOr call us at +91 98765 43210 for instant booking!",
      },
      {
        id: 22,
        icon: Clock,
        text: "What's the wait time?",
        answer:
          "⏱️ Service Duration:\n\n• Basic Wash: 30 minutes\n• Premium Wash: 60 minutes\n• Interior Detailing: 90 minutes\n• Complete Care: 3-4 hours\n\nWalk-ins welcome, but bookings get priority!",
      },
      {
        id: 23,
        icon: Star,
        text: "Best time to visit?",
        answer:
          "🕐 Best Times:\n\n✅ Weekday mornings (9-11 AM) - Less crowded\n✅ Early afternoons (2-4 PM) - Good availability\n\n⚠️ Avoid weekends 11 AM - 3 PM (peak hours)\n\nBook online to skip the wait!",
      },
    ],
  },
  {
    id: 3,
    icon: Calendar,
    question: "How to book an appointment?",
    answer:
      "Booking is easy! 📱\n\n1️⃣ Visit our 'Book Now' page\n2️⃣ Select your preferred service\n3️⃣ Choose date and time\n4️⃣ Confirm your booking\n\n💡 You can also call us directly at +91 98765 43210 for instant booking!",
    color: "from-purple-500 to-pink-600",
    followUp: [
      {
        id: 31,
        icon: CreditCard,
        text: "Payment options?",
        answer:
          "💳 We accept:\n\n• Cash\n• Credit/Debit Cards\n• UPI (Google Pay, PhonePe, Paytm)\n• Net Banking\n\n💡 Pay online while booking for 5% discount!",
      },
      {
        id: 32,
        icon: X,
        text: "Cancellation policy?",
        answer:
          "🔄 Cancellation Policy:\n\n✅ Free cancellation up to 2 hours before\n✅ Full refund within 24 hours\n⚠️ 50% charge if cancelled within 2 hours\n❌ No refund for no-shows\n\nReschedule anytime!",
      },
      {
        id: 33,
        icon: Phone,
        text: "Call to book now",
        answer:
          "📞 Call us now!\n\n☎️ Phone: +91 9956414364\n💬 WhatsApp: +91 9956414364\n\nOur team is ready to assist you from 7 AM to 7 PM daily!",
      },
    ],
  },
  {
    id: 4,
    icon: MapPin,
    question: "Where are you located?",
    answer:
      "📍 Visit us at:\n\nVishal Car Wash Center\nVill-Sagunaha, Babatpur\nAirport Road, Varanasi\n\n🗺️ Find us on Google Maps for easy directions. We're just 2 minutes from the airport!",
    color: "from-red-500 to-orange-600",
    followUp: [
      {
        id: 41,
        icon: MapPin,
        text: "Get directions",
        answer:
          "🗺️ Directions:\n\nFrom Airport: 2 minutes\nFrom Railway Station: 2 minutes\n\nLandmark: Near Babatpur Airport Gate\n\nSearch 'Vishal Car Wash Babatpur' on Google Maps!",
      },
      {
        id: 42,
        icon: Car,
        text: "Parking available?",
        answer:
          "🅿️ Yes! We have:\n\n✅ Spacious parking area\n✅ Covered waiting zone\n✅ Free parking for customers\n✅ CCTV surveillance\n\nYour vehicle is safe with us!",
      },
      {
        id: 43,
        icon: Clock,
        text: "How to reach?",
        answer:
          "🚗 Easy to reach:\n\n• Located on Airport Road\n• Well-connected by main road\n• Visible signboard\n• Ample parking space\n\nJust 2 mins from Babatpur Airport!",
      },
    ],
  },
  {
    id: 5,
    icon: Package,
    question: "What services do you offer?",
    answer:
      "🚗 OUR COMPLETE SERVICE MENU:\n\n💧 WASHING SERVICES:\n• Basic Exterior Wash\n• Premium Foam Wash\n• Underbody Cleaning\n• Pressure Washing\n• Hand Wash (Luxury Cars)\n\n🏠 INTERIOR SERVICES:\n• Vacuum Cleaning\n• Steam Cleaning\n• Leather Conditioning\n• Fabric Protection\n• Odor Removal\n• Stain Treatment\n• Dashboard Restoration\n• AC Vent Cleaning\n\n✨ DETAILING SERVICES:\n• Paint Correction\n• Swirl Mark Removal\n• Scratch Removal\n• Headlight Restoration\n• Chrome Polishing\n• Glass Coating\n\n🛡️ PROTECTION SERVICES:\n• Ceramic Coating (3M, 6M, 1Y)\n• Paint Protection Film (PPF)\n• Nano Coating\n• Wax & Sealant\n• Underbody Anti-Rust\n\n🔧 SPECIALIZED SERVICES:\n• Engine Bay Cleaning\n• Engine Degreasing\n• Battery Maintenance\n• Tire Dressing\n• Alloy Wheel Polishing\n\n🎨 AESTHETIC SERVICES:\n• Windshield Treatment\n• Rain Repellent Coating\n• Interior Fragrance\n• Premium Waxing\n\n👨‍🔧 ALL SERVICES:\n✅ Performed by certified technicians\n✅ Premium quality products used\n✅ Eco-friendly solutions\n✅ Insurance & warranty included\n✅ Before-after photos provided\n\n💡 We serve all vehicle types:\n🚗 Sedans | 🚙 SUVs | 🏎️ Luxury Cars\n🏍️ Bikes | 🚐 Vans | 🚚 Trucks",
    color: "from-indigo-500 to-blue-600",
    followUp: [
      {
        id: 51,
        icon: Shield,
        text: "Ceramic coating details",
        answer:
          "🛡️ Ceramic Coating:\n\n• 9H hardness protection\n• Lasts 3-6 months\n• Water repellent\n• UV protection\n• Enhanced shine\n\nPrice: ₹2,999\nDuration: 4-5 hours",
      },
      {
        id: 52,
        icon: Wrench,
        text: "Engine cleaning",
        answer:
          "🔧 Engine Bay Cleaning:\n\n• Removes oil & grease\n• Improves cooling\n• Professional degreasing\n• Safe for electronics\n• Better resale value\n\nPrice: ₹499\nDuration: 45 minutes",
      },
      {
        id: 53,
        icon: Sparkles,
        text: "Interior detailing",
        answer:
          "✨ Interior Detailing:\n\n• Deep vacuum cleaning\n• Leather/fabric conditioning\n• Dashboard restoration\n• Odor removal\n• Stain removal\n\nPrice: ₹899\nDuration: 90 minutes",
      },
    ],
  },
  {
    id: 6,
    icon: Phone,
    question: "How to contact support?",
    answer:
      "📞 We're here to help!\n\n☎️ Call: +91 98765 43210\n📧 Email: support@vishalcarwash.com\n💬 WhatsApp: +91 98765 43210\n\n⏰ Available: 8 AM - 8 PM Daily\n\nFeel free to reach out anytime!",
    color: "from-teal-500 to-green-600",
    followUp: [
      {
        id: 61,
        icon: MessageSquare,
        text: "Chat with us",
        answer:
          "💬 Let's chat! I'm here to help you with any questions about our services, booking, or pricing. What would you like to know?",
      },
      {
        id: 62,
        icon: Star,
        text: "Customer reviews",
        answer:
          "⭐ Our Customers Love Us!\n\n• 4.8/5 Rating on Google\n• 500+ Happy Customers\n• Trusted by locals\n• Professional service\n\nCheck our reviews on Google Maps!",
      },
      {
        id: 63,
        icon: Info,
        text: "Special offers",
        answer:
          "🎉 Current Offers:\n\n• 10% off on first visit\n• 5% off on online payment\n• Free air freshener\n• Loyalty rewards program\n\nBook now to avail offers!",
      },
    ],
  },
];

// Typing animation component
const TypingIndicator = () => (
  <div className="flex space-x-1.5 p-2 animate-pulse">
    {[0, 1, 2].map((i) => (
      <div
        key={i}
        className="w-2 h-2 rounded-full bg-blue-500"
        style={{
          animation: `bounce 1.2s infinite ${i * 0.2}s`,
        }}
      />
    ))}
  </div>
);

const MessageBubble = ({ message }) => {
  const isBot = message.sender === "bot";

  return (
    <div
      className={`flex ${
        isBot ? "justify-start" : "justify-end"
      } mb-2 sm:mb-3 animate-fadeIn`}
    >
      <div
        className={`flex items-start gap-1.5 sm:gap-2 max-w-[85%] sm:max-w-[50%] ${
          !isBot && "flex-row-reverse"
        }`}
      >
        <div
          className={`flex-shrink-0 w-6 h-6 sm:w-5 sm:h-5 md:w-8 md:h-8 rounded-full flex items-center justify-center shadow-sm ${
            isBot
              ? "bg-white text-blue-600 border border-blue-100"
              : "bg-gradient-to-br from-blue-600 to-blue-500 text-white"
          }`}
        >
          {isBot ? (
            <Bot className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
          ) : (
            <User className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
          )}
        </div>
        <div
          className={`p-2 sm:p-2.5 md:p-3 rounded-xl sm:rounded-2xl text-xs sm:text-sm shadow-sm transition-all hover:shadow-md ${
            isBot
              ? "bg-white text-gray-800 rounded-tl-none border border-blue-50"
              : "bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-tr-none"
          }`}
        >
          <div className="whitespace-pre-wrap leading-relaxed break-words">
            {message.text}
          </div>
          <div
            className={`text-[10px] sm:text-xs mt-1 sm:mt-1.5 text-right ${
              isBot ? "text-blue-500/70" : "text-blue-100/80"
            }`}
          >
            {new Date(message.timestamp).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

// Question Card Component
const QuestionCard = ({ question, onClick, size = "normal" }) => {
  const Icon = question.icon;

  return (
    <button
      onClick={onClick}
      className={`w-full ${
        size === "small" ? "p-2 sm:p-2.5 md:p-3" : "p-3 sm:p-3.5 md:p-4"
      } rounded-lg sm:rounded-xl bg-white hover:bg-gradient-to-br hover:from-white hover:to-blue-50 border border-blue-100 shadow-sm hover:shadow-md transition-all duration-200 text-left group transform hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98]`}
    >
      <div className="flex items-center gap-2 sm:gap-2.5 md:gap-3">
        <div
          className={`${
            size === "small" ? "p-1.5 sm:p-2" : "p-2 sm:p-2.5"
          } rounded-lg bg-gradient-to-br ${
            question.color
          } text-white shadow-sm group-hover:shadow-md transition-shadow flex-shrink-0`}
        >
          <Icon
            className={
              size === "small"
                ? "w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4"
                : "w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5"
            }
          />
        </div>
        <span
          className={`${
            size === "small" ? "text-[10px] sm:text-xs" : "text-xs sm:text-sm"
          } font-medium text-gray-700 group-hover:text-blue-700 transition-colors leading-tight`}
        >
          {question.text || question.question}
        </span>
      </div>
    </button>
  );
};

// Follow-up options component
const FollowUpOptions = ({ options, onSelect }) => {
  return (
    <div className="mt-2 sm:mt-3 space-y-1.5 sm:space-y-2">
      <p className="text-[10px] sm:text-xs text-gray-600 font-medium mb-1.5 sm:mb-2">
        💡 You might also want to know:
      </p>
      {options.map((option) => (
        <QuestionCard
          key={option.id}
          question={option}
          onClick={() => onSelect(option)}
          size="small"
        />
      ))}
    </div>
  );
};

// Error Boundary Component
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="fixed bottom-24 right-6 z-50">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg shadow-lg max-w-xs">
            <p className="text-sm text-red-700">
              Something went wrong. Please refresh the page.
            </p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function ChatBot({ externalOpen, onExternalOpenChange }) {
  const [showChat, setShowChat] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showQuestions, setShowQuestions] = useState(true);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [currentFollowUps, setCurrentFollowUps] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const scrollAreaRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Sync with external control
  useEffect(() => {
    if (externalOpen !== undefined) {
      setShowChat(externalOpen);
    }
  }, [externalOpen]);

  // Notify parent when chat state changes
  useEffect(() => {
    if (onExternalOpenChange) {
      onExternalOpenChange(showChat);
    }
  }, [showChat, onExternalOpenChange]);

  // Prevent body scroll when chatbot is open
  useEffect(() => {
    if (showChat) {
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;
      const scrollY = window.scrollY;
      document.body.classList.add("chat-open");
      document.body.style.paddingRight = `${scrollbarWidth}px`;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
    } else {
      const scrollY = document.body.style.top;
      document.body.classList.remove("chat-open");
      document.body.style.paddingRight = "0px";
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }

    return () => {
      document.body.classList.remove("chat-open");
      document.body.style.paddingRight = "0px";
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
    };
  }, [showChat]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleQuestionClick = async (question) => {
    const userMessage = {
      id: Date.now(),
      text: question.question || question.text,
      sender: "user",
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setShowQuestions(false);
    setIsBotTyping(true);
    setCurrentFollowUps(null);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const botResponse = {
      id: Date.now() + 1,
      text: question.answer,
      sender: "bot",
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, botResponse]);
    setIsBotTyping(false);

    // Set follow-up options - always show some relevant options
    const smartFollowUps = getSmartFollowUps(question);
    setCurrentFollowUps(smartFollowUps);
  };

  const handleFollowUpClick = async (followUpOption) => {
    const userMessage = {
      id: Date.now(),
      text: followUpOption.text,
      sender: "user",
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsBotTyping(true);
    setCurrentFollowUps(null);

    await new Promise((resolve) => setTimeout(resolve, 800));

    const botResponse = {
      id: Date.now() + 1,
      text: followUpOption.answer,
      sender: "bot",
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, botResponse]);
    setIsBotTyping(false);

    // Show smart follow-up options based on the context
    const smartFollowUps = getSmartFollowUps(followUpOption);
    setCurrentFollowUps(smartFollowUps);
  };

  const getSmartFollowUps = (currentOption) => {
    // Return contextual follow-ups based on what was just asked
    const baseFollowUps = [
      {
        id: 991,
        icon: MessageSquare,
        text: "View all services",
        answer:
          "🚗 Our Complete Service Menu:\n\n💧 BASIC WASH (₹299) - 30 mins\n• Exterior body wash\n• Wheel & tire cleaning\n• Window cleaning inside & out\n• Dashboard wipe\n• Vacuum cleaning\n• Complimentary air freshener\n\n✨ PREMIUM WASH (₹599) - 60 mins\n• Everything in Basic +\n• Foam wash with premium shampoo\n• Tire dressing & shine\n• Interior deep cleaning\n• Leather conditioning\n• Underbody wash\n• Door jambs cleaning\n\n🚗 INTERIOR DETAILING (₹899) - 90 mins\n• Deep vacuum (seats, carpet, trunk)\n• Steam cleaning of upholstery\n• Leather treatment & conditioning\n• Dashboard & console restoration\n• AC vent cleaning\n• Stain & odor removal\n• Glass cleaning (inside)\n\n⭐ COMPLETE CARE PACKAGE (₹1,999) - 3-4 hrs\n• Premium wash + Full detailing\n• Engine bay cleaning & degreasing\n• Headlight restoration\n• Paint protection coating (3-month)\n• Full interior detailing\n• Ceramic coating application\n• Minor scratch removal\n• Underbody anti-rust treatment",
        color: "from-blue-500 to-cyan-600",
        followUp: [
          {
            id: 9911,
            icon: DollarSign,
            text: "Any packages/combos?",
            answer:
              "🎁 SPECIAL PACKAGES & COMBOS:\n\n💎 MONTHLY PACKAGE (₹2,499)\n• 4 Premium Washes\n• 1 Interior Detailing\n• Priority booking\n• Save ₹1,295!\n\n🏆 QUARTERLY PACKAGE (₹6,999)\n• 12 Premium Washes\n• 3 Interior Detailing\n• 1 Engine Cleaning\n• 1 Ceramic Coating\n• VIP treatment\n• Save ₹4,685!\n\n👨‍👩‍👧‍👦 FAMILY CAR COMBO (₹899)\n• 2 Cars Basic Wash\n• Save ₹100\n• Valid same day\n\n🎉 SPECIAL OFFERS:\n• First Visit: 10% OFF\n• Online Payment: 5% OFF\n• Referral Bonus: ₹200 credit\n• Birthday Month: Free upgrade!",
          },
        ],
      },
      {
        id: 992,
        icon: Calendar,
        text: "Book an appointment",
        answer:
          "📅 BOOKING PROCESS:\n\n🌐 ONLINE BOOKING:\n1️⃣ Visit www.vishalcarwash.com/booking\n2️⃣ Select your service package\n3️⃣ Choose date & time slot\n4️⃣ Enter vehicle details\n5️⃣ Confirm booking & pay online (5% off!)\n\n📞 PHONE BOOKING:\n☎️ Call: +91 98765 43210\n💬 WhatsApp: +91 98765 43210\n⏰ Available: 8 AM - 8 PM\n\n🚶 WALK-IN:\nDirect visit welcome!\n(Bookings get priority service)\n\n💡 TIP: Book 24 hours in advance for guaranteed slot, especially on weekends!",
        color: "from-purple-500 to-pink-600",
      },
      {
        id: 993,
        icon: MapPin,
        text: "Location & directions",
        answer:
          "📍 LOCATION DETAILS:\n\n🏢 Vishal Car Wash Center\nVill-Sagunaha, Babatpur\nAirport Road, Varanasi\nUttar Pradesh - 221106\n\n🗺️ DIRECTIONS:\n✈️ From Airport: 5 mins (2.5 km)\n🚂 From Railway Station: 15 mins (8 km)\n🏛️ From Godowlia: 20 mins (12 km)\n\n🎯 LANDMARK:\nNear Babatpur Airport Main Gate\nOpposite Petrol Pump\n\n🚗 FACILITIES:\n• Large parking area (20+ cars)\n• Covered waiting lounge with AC\n• Free WiFi & refreshments\n• CCTV surveillance\n• Washroom facilities\n\n📱 Google Maps: Search 'Vishal Car Wash Babatpur'",
        color: "from-red-500 to-orange-600",
      },
    ];

    // If the option has its own follow-ups, include them
    if (currentOption.followUp && currentOption.followUp.length > 0) {
      return [...currentOption.followUp, ...baseFollowUps];
    }

    return baseFollowUps;
  };

  const handleSendMessage = async () => {
    const messageText = inputValue.trim();
    if (!messageText || isBotTyping) return;

    const userMessage = {
      id: Date.now(),
      text: messageText,
      sender: "user",
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsBotTyping(true);
    setCurrentFollowUps(null);

    await new Promise((resolve) =>
      setTimeout(resolve, 800 + Math.random() * 800)
    );

    const botResponse = {
      id: Date.now() + 1,
      text: getBotResponse(messageText),
      sender: "bot",
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, botResponse]);
    setIsBotTyping(false);
  };

  const getBotResponse = (userInput) => {
    const input = userInput.toLowerCase();

    if (
      input.includes("hello") ||
      input.includes("hi") ||
      input.includes("hey")
    ) {
      return "Hello! 👋 Welcome to Vishal Car Wash! How can I assist you today?";
    } else if (input.includes("price") || input.includes("cost")) {
      return quickQuestions[0].answer;
    } else if (input.includes("time") || input.includes("open")) {
      return quickQuestions[1].answer;
    } else if (input.includes("book") || input.includes("appointment")) {
      return quickQuestions[2].answer;
    } else if (
      input.includes("location") ||
      input.includes("where") ||
      input.includes("address")
    ) {
      return quickQuestions[3].answer;
    } else if (input.includes("service") || input.includes("offer")) {
      return quickQuestions[4].answer;
    } else if (
      input.includes("contact") ||
      input.includes("phone") ||
      input.includes("call")
    ) {
      return quickQuestions[5].answer;
    } else if (input.includes("thank")) {
      return "You're welcome! 😊 Feel free to ask if you need anything else!";
    } else {
      return "I'm here to help! You can ask me about:\n\n• Pricing & Packages 💰\n• Operating Hours ⏰\n• Booking Process 📅\n• Location & Directions 📍\n• Services Offered 🚗\n• Contact Information 📞\n\nWhat would you like to know?";
    }
  };

  const handleContinueChat = () => {
    const continueMessage = {
      id: Date.now(),
      text: "I'd like to continue chatting",
      sender: "user",
      timestamp: new Date().toISOString(),
    };

    setMessages([continueMessage]);
    setShowQuestions(false);

    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        text: "Great! I'm here to help. Feel free to ask me anything about our services, pricing, location, or booking process. How can I assist you? 😊",
        sender: "bot",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, botResponse]);
    }, 800);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[99]">
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-50%); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-float {
          animation: float 2s ease-in-out infinite;
        }
        
        /* Custom scrollbar styles - More visible */
        .chat-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .chat-scrollbar::-webkit-scrollbar-track {
          background: rgba(226, 232, 240, 0.5);
          border-radius: 10px;
          margin: 4px;
        }
        .chat-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #3b82f6, #2563eb);
          border-radius: 10px;
          border: 2px solid rgba(255, 255, 255, 0.3);
        }
        .chat-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #2563eb, #1d4ed8);
          border-color: rgba(255, 255, 255, 0.5);
        }
        .chat-scrollbar::-webkit-scrollbar-thumb:active {
          background: linear-gradient(180deg, #1d4ed8, #1e40af);
        }
        
        /* Firefox scrollbar */
        .chat-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #3b82f6 rgba(226, 232, 240, 0.5);
        }
        
        /* Smooth scrolling */
        .chat-scrollbar {
          -webkit-overflow-scrolling: touch;
          overscroll-behavior: contain;
          scroll-behavior: smooth;
        }
        
        /* Prevent body scroll when chat is open */
        body.chat-open {
          overflow: hidden;
          position: fixed;
          width: 100%;
        }
      `}</style>

      {/* Floating Action Button - Only show if not externally controlled */}
      {/* {!showChat && externalOpen === undefined && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowChat(true)}
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white rounded-full shadow-2xl flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-blue-500/50 transition-all duration-300 animate-float"
        >
          <Car className="w-6 h-6 sm:w-7 sm:h-7" />
          <span className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full border-2 border-white animate-pulse" />
        </motion.button>
      )} */}

      {/* Chat Interface */}
      {showChat && (
        <motion.div
          ref={chatContainerRef}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 md:bottom-8 md:right-8 z-[99] w-[calc(100vw-32px)] sm:w-[400px] md:w-[440px] shadow-2xl rounded-2xl sm:rounded-3xl overflow-hidden"
          style={{
            maxHeight: "calc(100vh - 120px)",
            height: "calc(100vh - 120px)",
            maxWidth: "440px",
          }}
        >
          <Card className="h-full flex flex-col border-0 bg-gradient-to-br from-blue-50 via-white to-cyan-50 overflow-hidden shadow-xl">
            {/* Header */}
            <CardHeader className="bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 text-white p-3 sm:p-4 md:p-5 relative overflow-hidden flex-shrink-0">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
              <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-white/5 rounded-full -mr-12 sm:-mr-16 -mt-12 sm:-mt-16 animate-pulse" />

              <div className="flex justify-between items-center relative z-10">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                  <div className="bg-white/20 p-1.5 sm:p-2 md:p-2.5 rounded-full backdrop-blur-sm flex-shrink-0">
                    <Car className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
                  </div>
                  <div className="min-w-0">
                    <CardTitle className="text-sm sm:text-base md:text-lg font-bold truncate">
                      Vishal Car Wash
                    </CardTitle>
                    <p className="text-[10px] sm:text-xs text-white/90 flex items-center gap-1 sm:gap-1.5">
                      <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-400 animate-pulse flex-shrink-0" />
                      <span className="truncate">Online Now</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-0.5 sm:gap-1 flex-shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white/80 hover:bg-white/20 h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9 p-0 rounded-full transition-all"
                    onClick={() => {
                      setShowChat(false);
                      setShowQuestions(true);
                      setMessages([]);
                      setCurrentFollowUps(null);
                    }}
                  >
                    <X className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            {/* Content */}
            <CardContent
              className="p-0 flex-1 overflow-hidden min-h-0"
              onTouchMove={(e) => e.stopPropagation()}
            >
              <div
                className="h-full flex flex-col transition-all duration-300"
                style={{
                  display: "flex",
                }}
              >
                {showQuestions ? (
                  /* Questions View */
                  <div className="flex-1 overflow-hidden flex flex-col min-h-0">
                    <div className="p-3 sm:p-4 md:p-6 text-center bg-gradient-to-b from-blue-50 to-transparent flex-shrink-0">
                      <div className="inline-flex p-2 sm:p-3 md:p-4 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full mb-2 sm:mb-3 shadow-lg">
                        <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-white" />
                      </div>
                      <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 mb-1 sm:mb-2">
                        Welcome to Vishal Car Wash! 🚗
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600">
                        How can we help you today?
                      </p>
                    </div>

                    <div
                      className="flex-1 overflow-y-auto px-3 sm:px-4 pb-3 sm:pb-4 chat-scrollbar min-h-0"
                      onWheel={(e) => e.stopPropagation()}
                      onTouchMove={(e) => e.stopPropagation()}
                    >
                      <div className="space-y-2 sm:space-y-3">
                        {quickQuestions.map((q) => (
                          <QuestionCard
                            key={q.id}
                            question={q}
                            onClick={() => handleQuestionClick(q)}
                          />
                        ))}
                      </div>

                      <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-xl border border-blue-200 flex-shrink-0">
                        <p className="text-xs sm:text-sm text-gray-700 mb-2 sm:mb-3 text-center font-medium">
                          Or start a conversation
                        </p>
                        <Button
                          onClick={handleContinueChat}
                          className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-full shadow-md text-xs sm:text-sm h-9 sm:h-10"
                        >
                          <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                          Continue to Chat
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Chat View */
                  <div className="flex-1 flex flex-col overflow-hidden min-h-0">
                    <div
                      className="flex-1 overflow-y-auto p-3 sm:p-4 chat-scrollbar min-h-0"
                      onWheel={(e) => e.stopPropagation()}
                      onTouchMove={(e) => e.stopPropagation()}
                    >
                      <div className="flex justify-center mb-3 sm:mb-4">
                        <div className="bg-white/80 backdrop-blur-sm text-blue-700 text-[10px] sm:text-xs px-3 sm:px-4 py-1 sm:py-1.5 rounded-full border border-blue-100 shadow-sm">
                          Today
                        </div>
                      </div>
                      {messages.map((message) => (
                        <MessageBubble key={message.id} message={message} />
                      ))}
                      {isBotTyping &&
                        messages.length > 0 &&
                        messages[messages.length - 1]?.sender === "user" && (
                          <div className="flex items-start gap-2 sm:gap-3 mb-3 sm:mb-4 animate-fadeIn">
                            <div className="bg-white p-1.5 sm:p-2 rounded-full border border-blue-100">
                              <Bot className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                            </div>
                            <TypingIndicator />
                          </div>
                        )}

                      {/* Follow-up options */}
                      {currentFollowUps && !isBotTyping && (
                        <div className="mt-3 sm:mt-4 animate-fadeIn">
                          <FollowUpOptions
                            options={currentFollowUps}
                            onSelect={handleFollowUpClick}
                          />
                        </div>
                      )}

                      <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-2 sm:p-3 md:p-4 border-t border-blue-100 bg-white/90 flex-shrink-0">
                      <div className="flex items-center gap-1.5 sm:gap-2 relative">
                        <Input
                          ref={inputRef}
                          type="text"
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          onKeyDown={handleKeyPress}
                          placeholder="Type your message..."
                          className="flex-1 rounded-full border-blue-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 h-9 sm:h-10 md:h-12 pl-3 sm:pl-4 md:pl-5 pr-10 sm:pr-12 md:pr-14 bg-white text-xs sm:text-sm"
                        />
                        <Button
                          onClick={handleSendMessage}
                          disabled={!inputValue.trim() || isBotTyping}
                          className="absolute right-0.5 sm:right-1 rounded-full w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 p-0 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:opacity-50 transition-all"
                        >
                          <Send className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Overlay */}
      {showChat && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={() => {
            setShowChat(false);
            setShowQuestions(true);
            setMessages([]);
            setCurrentFollowUps(null);
          }}
        />
      )}
    </div>
  );
}

export default function ChatBotWithErrorBoundary({ externalOpen, onExternalOpenChange }) {
  return (
    <ErrorBoundary>
      <ChatBot externalOpen={externalOpen} onExternalOpenChange={onExternalOpenChange} />
    </ErrorBoundary>
  );
}
