import { getServerSession } from 'next-auth/next';
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { message: 'You must be signed in to update your profile' },
        { status: 401 }
      );
    }

    await dbConnect();
    
    const { name, phone } = await request.json();

    // Update user in the database
    const updatedUser = await User.findByIdAndUpdate(
      session.user.id,
      { $set: { name, phone } },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // Return updated user data (excluding sensitive information)
    const { password: _, ...userWithoutPassword } = updatedUser.toObject();

    return NextResponse.json({
      message: 'Profile updated successfully',
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json(
      { 
        message: 'Failed to update profile',
        error: error.message 
      },
      { status: 500 }
    );
  }
}
