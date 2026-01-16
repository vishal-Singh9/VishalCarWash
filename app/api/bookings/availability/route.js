import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Booking from "@/models/Booking";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");

    if (!date) {
      return NextResponse.json(
        { message: "Date parameter is required" },
        { status: 400 }
      );
    }

    await dbConnect();

    // Parse the date and create start/end of day for proper comparison
    const selectedDate = new Date(date);
    const startOfDay = new Date(selectedDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(selectedDate);
    endOfDay.setHours(23, 59, 59, 999);

    // Get all bookings for the specified date with status pending or confirmed
    const bookings = await Booking.find({
      date: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
      status: { $in: ["pending", "confirmed"] },
    }).select("time status").lean();

    // Extract booked time slots
    const bookedSlots = bookings.map((booking) => booking.time);

    // Define all available time slots
    const allTimeSlots = [
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

    // Check if selected date is today (using UTC to avoid timezone issues)
    // Parse date string as local date to avoid timezone conversion issues
    const today = new Date();
    const todayUTC = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));
    todayUTC.setUTCHours(0, 0, 0, 0);
    
    // Parse selected date string (format: YYYY-MM-DD) as local date
    const [year, month, day] = date.split('-').map(Number);
    const selectedDateOnly = new Date(year, month - 1, day);
    selectedDateOnly.setHours(0, 0, 0, 0);
    
    const todayLocal = new Date();
    todayLocal.setHours(0, 0, 0, 0);
    
    const isToday = selectedDateOnly.getTime() === todayLocal.getTime();
    
    // Helper function to convert time slot to minutes from start of day
    const timeToMinutes = (timeStr) => {
      const [time, period] = timeStr.split(' ');
      const [hours, minutes] = time.split(':').map(Number);
      let totalMinutes = hours * 60 + minutes;
      if (period === 'PM' && hours !== 12) {
        totalMinutes += 12 * 60;
      } else if (period === 'AM' && hours === 12) {
        totalMinutes = minutes; // 12:XX AM = 0:XX
      }
      return totalMinutes;
    };

    // Get current time if it's today (round up to next hour slot for minimum booking time)
    let minimumBookingTime = null;
    if (isToday) {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      const currentTimeInMinutes = currentHour * 60 + currentMinute;
      
      // Calculate next available hour slot
      // If current time is 5:00 PM (1020 min), next slot is 6:00 PM (1080 min)
      // If current time is 5:30 PM (1050 min), next slot is still 6:00 PM (1080 min)
      // If current time is 5:59 PM (1079 min), next slot is 6:00 PM (1080 min)
      // Round up current hour + 1 hour to the next hour boundary
      const nextHour = currentHour + 1;
      minimumBookingTime = nextHour * 60; // Next hour in minutes (e.g., 6 PM = 18 * 60 = 1080)
    }

    // Create availability map and filter out past slots completely
    const availability = allTimeSlots
      .map((slot) => {
        const isBooked = bookedSlots.includes(slot);
        const slotTimeInMinutes = timeToMinutes(slot);
        // Consider slot as past if it's today and slot time is before minimum booking time
        // Use <= to allow slots exactly at the minimum time (e.g., 6 PM when current is 5 PM)
        const isPast = isToday && minimumBookingTime !== null && slotTimeInMinutes < minimumBookingTime;
        
        return {
          time: slot,
          available: !isBooked && !isPast,
          booked: isBooked,
          past: isPast,
        };
      })
      .filter((slot) => !slot.past); // Remove past slots completely

    // Calculate statistics (only for non-past slots)
    const availableCount = availability.filter((slot) => slot.available).length;
    const bookedCount = availability.filter((slot) => slot.booked).length;
    const totalSlots = availability.length;

    return NextResponse.json({
      date,
      availability,
      statistics: {
        total: totalSlots,
        available: availableCount,
        booked: bookedCount,
        availabilityPercentage: totalSlots > 0 ? Math.round((availableCount / totalSlots) * 100) : 0,
      },
    });
  } catch (error) {
    console.error("Error fetching availability:", error);
    return NextResponse.json(
      { message: "Error fetching availability", error: error.message },
      { status: 500 }
    );
  }
}

