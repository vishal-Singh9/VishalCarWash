import { NextResponse } from 'next/server';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/db';
import User from '@/models/User';

export async function POST(request) {
  try {
    await dbConnect();
    
    const { token, password } = await request.json();

    // Input validation
    if (!token || !password) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Please provide both token and password' 
        },
        { status: 400 }
      );
    }

    // Password validation
    if (password.length < 8) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Password must be at least 8 characters long' 
        },
        { status: 400 }
      );
    }

    // Hash the token from URL to compare with stored hash
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // Find user with valid reset token that hasn't expired
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() }
    }).select('+password');

    if (!user) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Invalid or expired reset token. Please request a new password reset.' 
        },
        { status: 400 }
      );
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    
    // Clear reset token fields
    user.resetPasswordToken = null;
    user.resetPasswordExpire = null;
    
    // Save the user with new password
    await user.save();

    return NextResponse.json(
      { 
        success: true,
        message: 'Password has been reset successfully. You can now sign in with your new password.' 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Reset password error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'An error occurred while resetting your password. Please try again.' 
      },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

