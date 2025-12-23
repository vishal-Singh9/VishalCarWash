import { NextResponse } from 'next/server';
import crypto from 'crypto';
import dbConnect from '@/lib/db';
import User from '@/models/User';

// Helper function to validate email format
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Helper function to send reset email (you can replace this with actual email service)
const sendResetEmail = async (email, resetToken) => {
  // In production, use a service like SendGrid, Nodemailer, or AWS SES
  const resetUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3001'}/auth/reset-password?token=${resetToken}`;
  
  console.log(`
    ========================================
    PASSWORD RESET EMAIL
    ========================================
    To: ${email}
    Reset URL: ${resetUrl}
    
    This link will expire in 1 hour.
    ========================================
  `);
  
  // TODO: Replace with actual email sending service
  // For now, we'll just log it to console
  // In production, implement email sending here
  
  return true;
};

export async function POST(request) {
  try {
    await dbConnect();
    
    const { email } = await request.json();
    const trimmedEmail = email ? email.trim().toLowerCase() : '';

    // Input validation
    if (!trimmedEmail) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Please provide your email address' 
        },
        { status: 400 }
      );
    }

    // Email format validation
    if (!isValidEmail(trimmedEmail)) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Please provide a valid email address' 
        },
        { status: 400 }
      );
    }

    // Find user by email (case-insensitive)
    const user = await User.findOne({ 
      email: { $regex: new RegExp(`^${trimmedEmail.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') }
    });

    // Always return success to prevent email enumeration
    // But only send email if user exists
    if (user) {
      // Generate reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      
      // Hash token before saving to database
      const hashedToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

      // Set token and expiration (1 hour from now)
      user.resetPasswordToken = hashedToken;
      user.resetPasswordExpire = Date.now() + 60 * 60 * 1000; // 1 hour
      
      await user.save({ validateBeforeSave: false });

      // Send reset email
      try {
        await sendResetEmail(user.email, resetToken);
      } catch (emailError) {
        console.error('Error sending reset email:', emailError);
        // Clear the reset token if email fails
        user.resetPasswordToken = null;
        user.resetPasswordExpire = null;
        await user.save({ validateBeforeSave: false });
        
        return NextResponse.json(
          { 
            success: false,
            message: 'Error sending reset email. Please try again later.' 
          },
          { status: 500 }
        );
      }
    }

    // Always return success message to prevent email enumeration
    return NextResponse.json(
      { 
        success: true,
        message: 'If an account exists with that email, a password reset link has been sent.' 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Forgot password error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'An error occurred. Please try again later.' 
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

