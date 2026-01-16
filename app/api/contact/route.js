import dbConnect from '@/lib/db';
import Contact from '@/models/Contact';
import { sendContactEmail } from '@/lib/email';

// CORS headers configuration
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// Handle OPTIONS for CORS preflight
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders
  });
}

// Success response helper
const successResponse = (data, status = 200) => {
  return new Response(JSON.stringify({
    success: true,
    ...data
  }), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders
    }
  });
};

// Error response helper
const errorResponse = (message, status = 400) => {
  return new Response(JSON.stringify({
    success: false,
    error: message
  }), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders
    }
  });
};

// Handle POST request
export async function POST(request) {
  try {
    // Parse request body
    const data = await request.json();
    const { name, email, subject, message } = data;

    // Basic validation
    if (!name || !email || !subject || !message) {
      return errorResponse('All fields are required', 400);
    }

    // Connect to database
    await dbConnect();

    // Create and save contact using the model
    const contact = await Contact.create({
      name,
      email,
      subject,
      message
    });

    // Send email notification (non-blocking - don't fail if email fails)
    try {
      const emailResult = await sendContactEmail({
        name,
        email,
        subject,
        message
      });
      
      if (!emailResult.success) {
        console.warn('Contact saved to database but email sending failed:', emailResult.error);
      }
    } catch (emailError) {
      // Log error but don't fail the request since data is already saved
      console.error('Error sending contact email notification:', emailError);
    }

    return successResponse({
      message: 'Message sent successfully!',
      data: {
        id: contact._id,
        name: contact.name,
        email: contact.email,
        subject: contact.subject,
        status: contact.status,
        createdAt: contact.createdAt
      }
    }, 201);

  } catch (error) {
    console.error('Error processing contact form:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return errorResponse(errors.join(', '), 400);
    }
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      return errorResponse('A contact with this email already exists', 409);
    }
    
    // Handle other errors
    return errorResponse(
      error.message || 'Failed to process your request. Please try again later.',
      error.statusCode || 500
    );
  }
}
