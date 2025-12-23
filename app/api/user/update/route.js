import { getServerSession } from 'next-auth/next';
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { 
          status: 401,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'PUT, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          } 
        }
      );
    }

    await dbConnect();
    
    const updateData = await request.json();
    
    // Only allow specific fields to be updated
    const allowedUpdates = ['name', 'email', 'phone', 'image'];
    const updates = Object.keys(updateData)
      .filter(key => allowedUpdates.includes(key))
      .reduce((obj, key) => {
        obj[key] = updateData[key];
        return obj;
      }, {});

    // Validate email if being updated
    if (updates.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(updates.email)) {
        return NextResponse.json(
          { success: false, message: 'Please provide a valid email address' },
          { status: 400 }
        );
      }
      
      // Check if email is already in use
      const existingUser = await User.findOne({ email: updates.email });
      if (existingUser && existingUser._id.toString() !== session.user.id) {
        return NextResponse.json(
          { success: false, message: 'Email is already in use' },
          { status: 400 }
        );
      }
    }

    // Update user in the database
    const updatedUser = await User.findByIdAndUpdate(
      session.user.id,
      { $set: updates },
      { 
        new: true, 
        runValidators: true,
        select: '-password -__v'
      }
    );

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // The session will be automatically updated on the client side when the response is received
    // because we're returning the updated user data and the client will update the session

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: 'Profile updated successfully',
        user: updatedUser,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'PUT, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      }
    );
  } catch (error) {
    console.error('Update profile error:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return NextResponse.json(
        { success: false, message: 'Validation error', errors: messages },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { 
        success: false,
        message: error.message || 'Failed to update profile',
      },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'PUT, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        } 
      }
    );
  }
}

// Handle preflight OPTIONS request
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'PUT, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
