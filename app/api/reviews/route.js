import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import Review from '@/models/Review';

async function connectToDatabase() {
  try {
    const client = await clientPromise;
    const db = client.db();
    return { client, db };
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw new Error('Unable to connect to database');
  }
}

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders
  });
}

export async function POST(request) {
  try {
    const { name, email, rating, review: content } = await request.json();
    
    const { db } = await connectToDatabase();
    
    // Validate required fields
    if (!name || !content || !rating) {
      return NextResponse.json(
        { success: false, message: 'Name, rating, and review content are required' },
        { status: 400 }
      );
    }

    // Validate rating is a number between 1-5
    const ratingNum = parseInt(rating);
    if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      return NextResponse.json(
        { success: false, message: 'Rating must be a number between 1 and 5' },
        { status: 400 }
      );
    }
    
    const newReview = new Review({
      name: name.trim(),
      email: email ? email.trim().toLowerCase() : '',
      role: 'Customer',
      rating: ratingNum,
      content: content.trim(),
      status: 'pending'
    });
    
    await newReview.save();
    
    return new Response(JSON.stringify({ 
      success: true, 
      data: newReview,
      message: 'Thank you for your review! It will be visible after moderation.' 
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
    
  } catch (error) {
    console.error('Error submitting review:', error);
    
    let errorMessage = 'Error submitting review';
    if (error.name === 'ValidationError') {
      errorMessage = Object.values(error.errors).map(err => err.message).join('. ');
    } else if (error.code === 11000) {
      errorMessage = 'You have already submitted a review with this email';
    }
    
    return NextResponse.json(
      { 
        success: false, 
        message: errorMessage,
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: error.name === 'ValidationError' ? 400 : 500 }
    );
  }
}

export async function GET() {
  try {
    await dbConnect();
    const reviews = await Review.find({ status: 'approved' })
      .sort({ createdAt: -1 })
      .limit(10);
    
    return new Response(JSON.stringify({ success: true, data: reviews }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return new Response(JSON.stringify({
      success: false,
      message: 'Error fetching reviews'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
}
