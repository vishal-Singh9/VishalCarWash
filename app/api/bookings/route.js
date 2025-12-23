import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import dbConnect from '@/lib/db';
import Booking from '@/models/Booking';
import Service from '@/models/Service';

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

    // Get the price for each booking from the related service
    const bookingsWithPrice = await Promise.all(bookings.map(async (booking) => {
      if (!booking.price) {
        const service = await Service.findById(booking.serviceId).lean();
        if (service) {
          booking.price = service.price;
        }
      }
      return booking;
    }));

    return NextResponse.json(bookingsWithPrice);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { message: 'Error fetching bookings' },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'You must be logged in to update a booking' },
        { status: 401 }
      );
    }

    const { id, ...updateData } = await request.json();
    
    if (!id) {
      return NextResponse.json(
        { message: 'Booking ID is required' },
        { status: 400 }
      );
    }

    await dbConnect();
    
    // Find the booking and verify ownership
    const booking = await Booking.findById(id);
    if (!booking) {
      return NextResponse.json(
        { message: 'Booking not found' },
        { status: 404 }
      );
    }
    
    if (booking.user.toString() !== session.user.id) {
      return NextResponse.json(
        { message: 'Not authorized to update this booking' },
        { status: 403 }
      );
    }

    // Prevent updating certain fields
    const { _id, user, createdAt, updatedAt, ...safeUpdates } = updateData;
    
    const updatedBooking = await Booking.findByIdAndUpdate(
      id,
      { $set: safeUpdates },
      { new: true, runValidators: true }
    );

    return NextResponse.json(updatedBooking);
  } catch (error) {
    console.error('Error updating booking:', error);
    return NextResponse.json(
      { message: 'Error updating booking', error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'You must be logged in to delete a booking' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { message: 'Booking ID is required' },
        { status: 400 }
      );
    }

    await dbConnect();
    
    // Find the booking and verify ownership
    const booking = await Booking.findById(id);
    if (!booking) {
      return NextResponse.json(
        { message: 'Booking not found' },
        { status: 404 }
      );
    }
    
    if (booking.user.toString() !== session.user.id) {
      return NextResponse.json(
        { message: 'Not authorized to delete this booking' },
        { status: 403 }
      );
    }

    await Booking.findByIdAndDelete(id);
    
    return NextResponse.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error('Error deleting booking:', error);
    return NextResponse.json(
      { message: 'Error deleting booking', error: error.message },
      { status: 500 }
    );
  }
}


export async function PATCH(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'You must be logged in to update a booking' },
        { status: 401 }
      );
    }

    const updateData = await request.json();
    const { id, ...updates } = updateData;
    
    if (!id) {
      return NextResponse.json(
        { message: 'Booking ID is required' },
        { status: 400 }
      );
    }

    // Forward the request to the [id] route
    const response = await fetch(
      `${request.nextUrl.origin}/api/bookings/${id}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': request.headers.get('cookie') || ''
        },
        body: JSON.stringify(updates)
      }
    );

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error in PATCH handler:', error);
    return NextResponse.json(
      { message: 'Error processing request', error: error.message },
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
    
    // Get service price from the database
    try {
      const service = await Service.findById(data.service_id);
      if (!service) {
        console.error('Service not found:', data.service_id);
        return NextResponse.json(
          { message: 'Service not found' },
          { status: 404 }
        );
      }
      // Add the service price to the booking data
      data.price = service.price;
    } catch (error) {
      console.error('Error fetching service:', error);
      return NextResponse.json(
        { message: 'Error fetching service details' },
        { status: 500 }
      );
    }
    
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
    
    // Create new booking with the price from the service
    const booking = new Booking({
      user: session.user.id,
      service: data.service,
      serviceId: data.service_id,
      date: data.date,
      time: data.time,
      vehicleType: data.vehicleType,
      vehicleNumber: data.vehicleNumber,
      customerName: data.customer_name,
      customerEmail: data.customer_email,
      customerPhone: data.customer_phone,
      price: data.price, // This will be the price from the service
      notes: data.notes,
    });

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
