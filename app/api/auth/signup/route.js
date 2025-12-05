import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';

// Helper function to validate email format
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export async function POST(request) {
  try {
    await dbConnect();
    
    const { name, email, password } = await request.json();
    const trimmedEmail = email ? email.trim().toLowerCase() : '';
    const trimmedName = name ? name.trim() : '';

    // Input validation
    if (!trimmedName || !trimmedEmail || !password) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Please provide all required fields' 
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

    // Password validation
    if (password.length < 6) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Password must be at least 6 characters long' 
        },
        { status: 400 }
      );
    }

    // Check if user already exists using a case-insensitive query
    const existingUser = await User.findOne({ 
      email: { $regex: new RegExp(`^${trimmedEmail}$`, 'i') } 
    });
    
    if (existingUser) {
      return NextResponse.json(
        { 
          success: false,
          message: 'An account with this email already exists. Please sign in instead.' 
        },
        { status: 409 }
      );
    }

    // Create new user - password will be hashed by the pre-save hook
    const user = new User({
      name: trimmedName,
      email: trimmedEmail,
      password, 
    });

    // Save the user to the database
    await user.save();
    
    // Log the user creation for debugging
    console.log('New user created:', { 
      id: user._id, 
      email: user.email,
      name: user.name,
      createdAt: user.createdAt 
    });

    // Return success response without sensitive data
    const { password: _, ...userWithoutPassword } = user.toObject();
    
    return NextResponse.json(
      { 
        success: true,
        message: 'Account created successfully! You can now sign in.',
        user: userWithoutPassword 
      },
      { 
        status: 201,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Signup error:', error);
    
    // Handle duplicate key error (in case of race condition)
    if (error.code === 11000) {
      return NextResponse.json(
        { 
          success: false,
          message: 'An account with this email already exists. Please sign in instead.' 
        },
        { status: 409 }
      );
    }

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return NextResponse.json(
        { 
          success: false,
          message: 'Validation failed',
          errors: messages 
        },
        { status: 400 }
      );
    }

    // Handle other errors
    return NextResponse.json(
      { 
        success: false,
        message: 'An error occurred while creating your account. Please try again.' 
      },
      { status: 500 }
    );
  }
}
