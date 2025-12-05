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
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { message: 'You must be logged in to create a booking' },
        { status: 401 }
      );
    }

    const data = await request.json();
    
    await dbConnect();
    
    const booking = new Booking({
      user: session.user.id,
      service: data.service,
      serviceId: data.service_id,
      date: data.date,
      time: data.time,
      vehicleType: data.vehicleType,
      vehicleNumber: data.vehicleNumber,
      notes: data.notes,
      status: 'pending',
    });

    await booking.save();

    return NextResponse.json(
      { message: 'Booking created successfully', booking },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { message: 'Error creating booking' },
      { status: 500 }
    );
  }
}
