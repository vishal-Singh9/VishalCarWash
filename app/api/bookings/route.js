import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import dbConnect from '@/lib/db';
import Booking from '@/models/Booking';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { message: 'You must be logged in to view bookings' },
        { status: 401 }
      );
    }

    await dbConnect();
    const bookings = await Booking.find({ user: session.user.id })
      .sort({ date: -1, time: -1 })
      .lean();

    return NextResponse.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { message: 'Error fetching bookings' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    // Check if user is authenticated and get session
    let session;
    
    try {
      // Try to get session from the request
      session = await getServerSession(authOptions);
      
      // If no session, try to get user ID from request body
      if (!session?.user?.id) {
        const data = await request.json();
        if (data.userId) {
          // Create a minimal session object with just the user ID
          session = { user: { id: data.userId } };
          // We need to re-create the request since we consumed the body
          request = new NextRequest(request.url, {
            method: request.method,
            headers: request.headers,
            body: JSON.stringify(data)
          });
        }
      }
      
      if (!session?.user?.id) {
        console.error('Unauthorized: No valid session or user ID found');
        return NextResponse.json(
          { message: 'You must be logged in to create a booking' },
          { status: 401 }
        );
      }
    } catch (error) {
      console.error('Error getting session:', error);
      return NextResponse.json(
        { message: 'Authentication error' },
        { status: 401 }
      );
    }

    // Parse request body
    const data = await request.json();
    console.log('Received booking data:', { userId: session.user.id, ...data });
    
    // Validate required fields
    const requiredFields = [
      'service', 'service_id', 'date', 'time', 
      'vehicleType', 'vehicleNumber', 'customer_name',
      'customer_email', 'customer_phone'
    ];
    
    const missingFields = requiredFields.filter(field => !data[field]);
    if (missingFields.length > 0) {
      console.error('Missing required fields:', missingFields);
      return NextResponse.json(
        { message: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Validate date is not in the past
    const selectedDate = new Date(data.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      console.error('Invalid date: Cannot book for a past date');
      return NextResponse.json(
        { message: 'Cannot book for a past date' },
        { status: 400 }
      );
    }

    // Connect to database
    await dbConnect();
    
    // Check for existing booking at the same date and time
    const existingBooking = await Booking.findOne({
      date: data.date,
      time: data.time,
      status: { $in: ['pending', 'confirmed'] }
    });

    if (existingBooking) {
      console.error('Time slot already booked:', { date: data.date, time: data.time });
      return NextResponse.json(
        { message: 'This time slot is already booked. Please choose another time.' },
        { status: 400 }
      );
    }
    
    // Create new booking with user ID from session
    const bookingData = {
      user: session.user.id, // This should be a valid MongoDB ObjectId
      service: data.service,
      serviceId: data.service_id,
      date: data.date,
      time: data.time,
      vehicleType: data.vehicleType,
      vehicleNumber: data.vehicleNumber,
      notes: data.notes,
      status: 'pending',
      customerName: data.customer_name,
      customerEmail: data.customer_email,
      customerPhone: data.customer_phone
    };
    
    console.log('Creating booking with data:', bookingData);
    const booking = new Booking(bookingData);

    await booking.save();

    return NextResponse.json(
      { 
        message: 'Booking created successfully', 
        booking: {
          id: booking._id,
          service: booking.service,
          date: booking.date,
          time: booking.time,
          status: booking.status
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { 
        message: error.message || 'Error creating booking',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}
