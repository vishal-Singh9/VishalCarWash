import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Review from '@/models/Review';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
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
    
    // Connect to database using the proper connection handler
    await dbConnect();
    
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
    
    const savedReview = await newReview.save();
    
    return new Response(JSON.stringify({ 
      success: true, 
      data: savedReview,
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

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    // Connect to database using the proper connection handler
    await dbConnect();
    
    // Get total count for pagination
    const total = await Review.countDocuments();
    
    // Get paginated and sorted reviews (newest first) - removed status filter
    const reviews = await Review.find()
      .sort({ createdAt: -1 }) // Sort by newest first
      .skip(skip)
      .limit(limit)
      .lean();

    return new Response(JSON.stringify({ 
      success: true, 
      data: reviews,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    }), {
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
      message: 'Error fetching reviews',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
}
