import dbConnect from '@/lib/db';
import Feedback from '@/models/Feedback';
import { NextResponse } from 'next/server';

// Configure runtime
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// CORS headers configuration
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Handle OPTIONS for CORS preflight
export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      status: 200,
      headers: corsHeaders,
    }
  );
}

// Success response helper
const successResponse = (data, status = 200) => {
  return NextResponse.json(
    {
      success: true,
      ...data,
    },
    {
      status,
      headers: corsHeaders,
    }
  );
};

// Error response helper
const errorResponse = (message, status = 400) => {
  return NextResponse.json(
    {
      success: false,
      error: message,
    },
    {
      status,
      headers: corsHeaders,
    }
  );
};

// Handle GET request - Get all feedbacks or stats
export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    // Get average rating and stats
    if (action === 'stats') {
      const stats = await Feedback.getAverageRating();
      return successResponse({ stats });
    }

    // Get all feedbacks (with optional filtering)
    const limit = parseInt(searchParams.get('limit')) || 10;
    const page = parseInt(searchParams.get('page')) || 1;
    const status = searchParams.get('status');
    const rating = searchParams.get('rating');

    const query = {};
    if (status) query.status = status;
    if (rating) query.rating = parseInt(rating);

    const feedbacks = await Feedback.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit)
      .select('-ipAddress -userAgent');

    const total = await Feedback.countDocuments(query);

    return successResponse({
      feedbacks,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching feedbacks:', error);
    return errorResponse(
      error.message || 'Failed to fetch feedbacks',
      error.statusCode || 500
    );
  }
}

// Handle POST request - Create new feedback
export async function POST(request) {
  try {
    // Parse request body
    const data = await request.json();
    const { name, email, rating, category, feedback } = data;

    // Basic validation
    if (!name || !email || !rating || !feedback) {
      return errorResponse('Name, email, rating, and feedback are required', 400);
    }

    // Validate rating
    if (rating < 1 || rating > 5) {
      return errorResponse('Rating must be between 1 and 5', 400);
    }

    // Connect to database
    await dbConnect();

    // Create and save feedback using the model
    const newFeedback = await Feedback.create({
      name,
      email,
      rating: parseInt(rating),
      category: category || 'overall',
      feedback
    });

    return successResponse({
      message: 'Thank you for your feedback!',
      data: {
        id: newFeedback._id,
        name: newFeedback.name,
        rating: newFeedback.rating,
        category: newFeedback.category,
        status: newFeedback.status,
        createdAt: newFeedback.createdAt
      }
    }, 201);

  } catch (error) {
    console.error('Error processing feedback:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return errorResponse(errors.join(', '), 400);
    }
    
    // Handle other errors
    return errorResponse(
      error.message || 'Failed to process your feedback. Please try again later.',
      error.statusCode || 500
    );
  }
}

