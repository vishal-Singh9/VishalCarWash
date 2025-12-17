import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Service from '@/models/Service';

export async function GET() {
  try {
    await dbConnect();
    const services = await Service.find({ isActive: true }).sort({ price: 1 });
    
    const response = {
      success: true,
      status: 200,
      message: 'Services retrieved successfully',
      data: services,
      count: services.length,
      timestamp: new Date().toISOString()
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching services:', error);
    
    const response = {
      success: false,
      status: 500,
      message: 'Failed to retrieve services',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      timestamp: new Date().toISOString()
    };

    return NextResponse.json(response, { status: 500 });
  }
}

export const dynamic = 'force-dynamic'; // Ensure fresh data on each request
