import { getServerSession } from 'next-auth/next';
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { message: 'You must be signed in to change your password' },
        { status: 401 }
      );
    }

    await dbConnect();
    
    const { currentPassword, newPassword } = await request.json();

    // Validate input
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { message: 'Current password and new password are required' },
        { status: 400 }
      );
    }

    // Get user with password
    const user = await User.findById(session.user.id).select('+password');
    
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { message: 'Current password is incorrect' },
        { status: 400 }
      );
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    
    // Save the updated user
    await user.save();

    // Invalidate the current session
    const currentSession = await getServerSession(authOptions);
    if (currentSession) {
      // This will force the user to log in again with the new password
      await fetch(`${process.env.NEXTAUTH_URL}/api/auth/signout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ redirect: false }),
      });
    }

    return NextResponse.json({
      message: 'Password updated successfully. Please log in again with your new password.',
      requiresReauth: true
    });
  } catch (error) {
    console.error('Change password error:', error);
    return NextResponse.json(
      { 
        message: 'Failed to change password',
        error: error.message 
      },
      { status: 500 }
    );
  }
}
