import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import dbConnect from '@/lib/db';
import Booking from '@/models/Booking';

export const dynamic = 'force-dynamic'; // Ensure dynamic route handling

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Allow': 'GET, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, PUT,PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export async function PATCH(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'You must be logged in to update a booking' },
        { status: 401 }
      );
    }

    const { id } = params;
    const updateData = await request.json();
    
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
    
    // Only update fields that are provided in the request
    const updateObject = {};
    for (const [key, value] of Object.entries(safeUpdates)) {
      if (value !== undefined) {
        updateObject[key] = value;
      }
    }

    // If status is being updated to 'completed', add completedAt timestamp
    if (updateObject.status === 'completed' && !booking.completedAt) {
      updateObject.completedAt = new Date();
    }

    if (Object.keys(updateObject).length === 0) {
      return NextResponse.json(
        { message: 'No valid fields provided for update' },
        { status: 400 }
      );
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
      id,
      { $set: updateObject },
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
