"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  ArrowRight,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";

const TIME_SLOTS = [
  "08:00 AM",
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
  "06:00 PM",
];

const getMinBookingDate = () => {
  const today = new Date();
  return today.toISOString().split("T")[0];
};

const getTodayDate = () => {
  const today = new Date();
  return today.toISOString().split("T")[0];
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
};

export function BookingAvailability() {
  const [selectedDate, setSelectedDate] = useState(getTodayDate());
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statistics, setStatistics] = useState(null);
  const dateInputRef = useRef(null);

  useEffect(() => {
    fetchAvailability(selectedDate);
  }, [selectedDate]);

  const isTimeSlotPast = (timeStr, selectedDate) => {
    const now = new Date();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const selectedDateOnly = new Date(selectedDate + 'T00:00:00');
    selectedDateOnly.setHours(0, 0, 0, 0);
    
    const isToday = selectedDateOnly.getTime() === today.getTime();
    
    if (!isToday) return false;
    
    const timeToMinutes = (timeStr) => {
      const [time, period] = timeStr.split(' ');
      let [hours, minutes] = time.split(':').map(Number);
      
      if (period === 'PM' && hours !== 12) {
        hours += 12;
      } else if (period === 'AM' && hours === 12) {
        hours = 0;
      }
      
      return hours * 60 + minutes;
    };
    
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTimeInMinutes = currentHour * 60 + currentMinute;
    
    const nextHour = currentHour + 1;
    const minimumBookingTime = nextHour * 60; 
    
    const slotTimeInMinutes = timeToMinutes(timeStr);
    return slotTimeInMinutes < minimumBookingTime;
  };

  const fetchAvailability = async (date) => {
    if (!date) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/bookings/availability?date=${date}`);
      if (response.ok) {
        const data = await response.json();
        const filteredSlots = (data.availability || []).filter(slot => {
          if (!slot.available) return true;
          return !isTimeSlotPast(slot.time, date);
        });
        
        setAvailability(filteredSlots);
        
        const availableCount = filteredSlots.filter(s => s.available).length;
        const bookedCount = filteredSlots.filter(s => !s.available).length;
        setStatistics({
          available: availableCount,
          booked: bookedCount,
          total: filteredSlots.length
        });
      } else {
        setAvailability([]);
        setStatistics(null);
      }
    } catch (error) {
      console.error("Error fetching availability:", error);
      setAvailability([]);
      setStatistics(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleDateContainerClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (dateInputRef.current) {
      try {
        if (typeof dateInputRef.current.showPicker === "function") {
          const pickerPromise = dateInputRef.current.showPicker();
          if (pickerPromise && typeof pickerPromise.catch === "function") {
            pickerPromise.catch(() => {
              dateInputRef.current?.click();
            });
          }
        } else {
          dateInputRef.current.click();
        }
      } catch (error) {
        dateInputRef.current.click();
      }
    }
  };

  const availableSlots = availability.filter((slot) => slot.available).length;
  const totalSlots = availability.length || TIME_SLOTS.length;

  return (
    <>
      <style jsx global>{`
        input[type="date"]::-webkit-calendar-picker-indicator {
          cursor: pointer;
          opacity: 0;
          position: absolute;
          width: 100%;
          height: 100%;
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
        }

        input[type="date"]::-webkit-datetime-edit {
          color: white;
          font-weight: 600;
        }

        input[type="date"]::-webkit-datetime-edit-fields-wrapper {
          color: white;
        }

        input[type="date"]::-webkit-datetime-edit-text {
          color: rgba(255, 255, 255, 0.7);
          padding: 0 0.3em;
        }

        input[type="date"]::-webkit-datetime-edit-month-field,
        input[type="date"]::-webkit-datetime-edit-day-field,
        input[type="date"]::-webkit-datetime-edit-year-field {
          color: white;
          padding: 0.2em;
        }

        input[type="date"]::-webkit-datetime-edit-month-field:focus,
        input[type="date"]::-webkit-datetime-edit-day-field:focus,
        input[type="date"]::-webkit-datetime-edit-year-field:focus {
          background-color: rgba(255, 255, 255, 0.2);
          border-radius: 4px;
          outline: none;
        }

        input[type="date"] {
          color-scheme: dark;
        }
      `}</style>

      <section className="py-12 md:py-16 lg:py-20 bg-[#030712] relative overflow-hidden border-t border-white/5">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-600/10 rounded-full blur-[100px] -ml-48 -mb-48"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 md:mb-12"
          >
            <div className="inline-flex items-center justify-center p-3 bg-white/5 border border-white/10 rounded-2xl mb-4 shadow-lg backdrop-blur-md">
              <Calendar className="w-7 h-7 md:w-8 md:h-8 text-cyan-400" />
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 bg-clip-text !leading-normal">
              Check Booking <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Availability</span>
            </h2>
            <p className="text-sm md:text-base lg:text-lg text-gray-400 max-w-2xl mx-auto">
              See real-time availability and book your preferred time slot
              instantly
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white/5 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 overflow-hidden"
          >
            <div className="bg-white/5 border-b border-white/10 p-4 sm:p-6 md:p-8 text-white relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 md:gap-6">
                  <motion.div
                    className="flex-1"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div
                        className="relative flex-1 group cursor-pointer"
                        onClick={handleDateContainerClick}
                      >
                        <div className="absolute inset-y-0 left-3 sm:left-4 flex items-center pointer-events-none z-20">
                          <Calendar className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
                        </div>

                        <input
                          ref={dateInputRef}
                          type="date"
                          value={selectedDate}
                          onChange={handleDateChange}
                          min={getMinBookingDate()}
                          className="w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-3 sm:py-4 md:py-5 rounded-lg sm:rounded-xl border border-white/20 bg-white/5 backdrop-blur-md text-white text-sm sm:text-base md:text-lg font-semibold placeholder-white/60 focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 focus:bg-white/10 transition-all duration-200 cursor-pointer hover:border-white/30 hover:bg-white/10 relative z-10"
                          style={{ colorScheme: "dark" }}
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        />

                        <div className="absolute inset-y-0 right-3 sm:right-4 flex items-center pointer-events-none z-20">
                          <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-400 group-hover:text-white transition-colors" />
                        </div>

                        <div className="absolute inset-0 rounded-xl bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-0"></div>
                      </div>

                      {selectedDate && (
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex items-center gap-2 px-3 sm:px-4 md:px-5 py-3 sm:py-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 shadow-lg min-w-fit"
                        >
                          <div className="p-1.5 sm:p-2 bg-white/10 rounded-lg flex-shrink-0 border border-white/5">
                            <Calendar className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-cyan-400" />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-xs text-gray-400 font-medium hidden sm:inline">
                              Selected
                            </span>
                            <span className="text-white font-bold text-xs sm:text-sm md:text-base whitespace-nowrap">
                              {formatDate(selectedDate)}
                            </span>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-6 md:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="p-1.5 sm:p-2 bg-white/10 border border-white/10 rounded-lg shadow-md">
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-cyan-400" />
                  </div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white">
                    Available Time Slots
                  </h3>
                </div>
                {statistics && (
                  <div className="flex items-center justify-center sm:justify-end">
                    <div className="flex items-center gap-3 sm:gap-4 px-3 sm:px-4 py-2 sm:py-3 bg-white/5 rounded-xl border border-white/10">
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-400 flex-shrink-0" />
                        <span className="text-xs sm:text-sm font-bold text-gray-300 whitespace-nowrap">
                          {statistics.available > 0
                            ? `${statistics.available} Available`
                            : "0 Available"}
                        </span>
                      </div>
                      {statistics.booked > 0 && (
                        <>
                          <span className="text-gray-500 hidden sm:inline">
                            •
                          </span>
                          <div className="flex items-center gap-1.5 sm:gap-2">
                            <XCircle className="w-3 h-3 sm:w-4 sm:h-4 text-red-400 flex-shrink-0" />
                            <span className="text-xs sm:text-sm font-bold text-gray-300 whitespace-nowrap">
                              {statistics.booked} Booked
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {loading ? (
                <div className="flex flex-col items-center justify-center py-12 sm:py-16">
                  <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 text-cyan-400 animate-spin mb-3 sm:mb-4" />
                  <span className="text-sm sm:text-base text-gray-400 font-medium">
                    Loading availability...
                  </span>
                </div>
              ) : availability.length > 0 ? (
                <>
                  <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3 mb-4 sm:mb-6">
                    {availability.map((slot) => (
                      <Link
                        key={slot.time}
                        href={
                          slot.available && !isTimeSlotPast(slot.time, selectedDate)
                            ? `/booking?date=${selectedDate}&time=${encodeURIComponent(
                                slot.time
                              )}`
                            : "#"
                        }
                        onClick={(e) => {
                          if (!slot.available || isTimeSlotPast(slot.time, selectedDate)) {
                            e.preventDefault();
                          }
                        }}
                      >
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          whileHover={{ scale: slot.available && !isTimeSlotPast(slot.time, selectedDate) ? 1.05 : 1 }}
                          whileTap={{ scale: slot.available && !isTimeSlotPast(slot.time, selectedDate) ? 0.95 : 1 }}
                          className={`p-2.5 sm:p-3 md:p-4 rounded-lg sm:rounded-xl border transition-all duration-200 ${
                            slot.available && !isTimeSlotPast(slot.time, selectedDate)
                              ? "border-green-500/30 bg-green-500/10 hover:border-green-400/50 hover:bg-green-500/20 cursor-pointer group shadow-sm hover:shadow-lg active:scale-95"
                              : "border-red-500/20 bg-red-500/10 opacity-70 cursor-not-allowed"
                          }`}
                        >
                          <div className="flex flex-col items-center text-center gap-1.5 sm:gap-2">
                            <div className="flex items-center justify-center w-full gap-1.5">
                              <span
                                className={`text-xs sm:text-sm md:text-base font-bold ${
                                  slot.available && !isTimeSlotPast(slot.time, selectedDate)
                                    ? "text-green-400 group-hover:text-green-300"
                                    : "text-red-400"
                                }`}
                              >
                                {slot.time}
                              </span>
                              {slot.available && !isTimeSlotPast(slot.time, selectedDate) ? (
                                <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-green-400 flex-shrink-0" />
                              ) : (
                                <XCircle className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-red-400 flex-shrink-0" />
                              )}
                            </div>
                          </div>
                        </motion.div>
                      </Link>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <Clock className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-300 font-medium mb-2">
                    No time slots available
                  </p>
                  <p className="text-sm text-gray-500">
                    Please select a next available date
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
