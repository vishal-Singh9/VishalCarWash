import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import dbConnect from '@/lib/db';
import Notification from '@/models/Notification';
import Booking from '@/models/Booking';
import mongoose from 'mongoose';

// Ensure the route is dynamic
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Handle OPTIONS for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

// GET - Fetch all notifications for the authenticated user
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unauthorized',
        },
        {
          status: 401,
          headers: corsHeaders,
        }
      );
    }

    await dbConnect();

    // Handle URL parsing for both Vercel and local development
    let searchParams;
    try {
      searchParams = new URL(request.url).searchParams;
    } catch (error) {
      // Fallback for Vercel edge cases
      const url = request.nextUrl || new URL(request.url);
      searchParams = url.searchParams;
    }

    const limit = parseInt(searchParams.get('limit')) || 50;
    const skip = parseInt(searchParams.get('skip')) || 0;
    const unreadOnly = searchParams.get('unreadOnly') === 'true';

    // Build query
    const query = { user: session.user.id };
    if (unreadOnly) {
      query.read = false;
    }

    // Ensure Booking model is registered
    if (!mongoose.models.Booking) {
      await import('@/models/Booking');
    }

    // Fetch notifications
    const notificationsRaw = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .populate({
        path: 'bookingId',
        model: 'Booking',
        select: 'service date time status',
        strictPopulate: false
      })
      .lean();

    // Transform notifications to ensure consistent ID format
    const notifications = notificationsRaw.map(notif => ({
      ...notif,
      id: notif._id.toString(),
      _id: notif._id.toString(),
      bookingId: notif.bookingId?._id?.toString() || notif.bookingId?.toString() || notif.bookingId || null,
    }));

    // Get unread count
    const unreadCount = await Notification.countDocuments({
      user: session.user.id,
      read: false,
    });

    // Get total count
    const totalCount = await Notification.countDocuments({
      user: session.user.id,
    });

    return NextResponse.json(
      {
        success: true,
        notifications,
        unreadCount,
        totalCount,
        hasMore: totalCount > skip + limit,
      },
      {
        status: 200,
        headers: corsHeaders,
      }
    );
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch notifications',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
}

// POST - Create a new notification
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const body = await request.json();
    const { title, message, type, link, bookingId, metadata } = body;

    // Validate required fields
    if (!title || !message) {
      return NextResponse.json(
        { success: false, message: 'Title and message are required' },
        { status: 400 }
      );
    }

    // Create notification
    const notification = await Notification.create({
      user: session.user.id,
      title,
      message,
      type: type || 'info',
      link: link || null,
      bookingId: bookingId || null,
      metadata: metadata || {},
    });

    // Populate booking if exists
    if (notification.bookingId) {
      // Ensure Booking model is registered before populating
      if (!mongoose.models.Booking) {
        await import('@/models/Booking');
      }
      await notification.populate({
        path: 'bookingId',
        model: 'Booking',
        select: 'service date time status',
        strictPopulate: false
      });
    }

    return NextResponse.json(
      {
        success: true,
        notification: {
          ...notification.toObject(),
          id: notification._id.toString(),
          _id: notification._id.toString(),
        },
      },
      {
        status: 201,
        headers: corsHeaders,
      }
    );
  } catch (error) {
    console.error('Error creating notification:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to create notification',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
}

// PATCH - Mark notifications as read
export async function PATCH(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { 
          status: 401,
          headers: corsHeaders
        }
      );
    }

    await dbConnect();

    let body;
    try {
      body = await request.json();
    } catch (error) {
      return NextResponse.json(
        { success: false, message: 'Invalid JSON body' },
        { 
          status: 400,
          headers: corsHeaders
        }
      );
    }
    
    const { notificationId, markAllAsRead } = body || {};

    if (markAllAsRead) {
      // Mark all notifications as read (not delete)
      const result = await Notification.updateMany(
        { user: session.user.id, read: false },
        { $set: { read: true } }
      );

      return NextResponse.json(
        {
          success: true,
          message: `Marked ${result.modifiedCount} notifications as read`,
          modifiedCount: result.modifiedCount,
        },
        {
          status: 200,
          headers: corsHeaders,
        }
      );
    } else if (notificationId) {
      try {
        // Import mongoose for ObjectId conversion
        const mongoose = await import('mongoose');
        
        // Convert notificationId to ObjectId if it's a string
        let queryId = notificationId;
        if (typeof notificationId === 'string' && mongoose.default.Types.ObjectId.isValid(notificationId)) {
          queryId = new mongoose.default.Types.ObjectId(notificationId);
        }

        // Mark notification as read
        const result = await Notification.findOneAndUpdate(
          { 
            $or: [
              { _id: queryId },
              { _id: notificationId }
            ],
            user: session.user.id 
          },
          { $set: { read: true } },
          { new: true }
        ).lean();

        if (!result) {
          console.error('Notification not found:', { notificationId, userId: session.user.id });
          return NextResponse.json(
            { success: false, message: 'Notification not found' },
            { 
              status: 404,
              headers: corsHeaders
            }
          );
        }

        return NextResponse.json(
          {
            success: true,
            message: 'Notification marked as read',
            notification: {
              ...result,
              id: result._id.toString(),
              _id: result._id.toString(),
            }
          },
          {
            status: 200,
            headers: corsHeaders,
          }
        );
      } catch (error) {
        console.error('Error marking notification as read:', error);
        return NextResponse.json(
          {
            success: false,
            message: 'Failed to mark notification as read',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined,
          },
          {
            status: 500,
            headers: corsHeaders,
          }
        );
      }
    } else {
      return NextResponse.json(
        {
          success: false,
          message: 'notificationId or markAllAsRead is required',
        },
        {
          status: 400,
          headers: corsHeaders,
        }
      );
    }
  } catch (error) {
    console.error('Error updating notification:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to update notification',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
}

// DELETE - Delete a notification
export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const notificationId = searchParams.get('id');
    const deleteAll = searchParams.get('deleteAll') === 'true';

    if (deleteAll) {
      // Delete all notifications for the user
      const result = await Notification.deleteMany({ user: session.user.id });
      return NextResponse.json(
        {
          success: true,
          message: `Deleted ${result.deletedCount} notifications`,
          deletedCount: result.deletedCount,
        },
        {
          status: 200,
          headers: corsHeaders,
        }
      );
    } else if (notificationId) {
      // Delete specific notification
      const result = await Notification.deleteOne({
        _id: notificationId,
        user: session.user.id,
      });

      if (result.deletedCount === 0) {
        return NextResponse.json(
          {
            success: false,
            message: 'Notification not found',
          },
          {
            status: 404,
            headers: corsHeaders,
          }
        );
      }

      return NextResponse.json(
        {
          success: true,
          message: 'Notification deleted successfully',
        },
        {
          status: 200,
          headers: corsHeaders,
        }
      );
    } else {
      return NextResponse.json(
        {
          success: false,
          message: 'notificationId or deleteAll is required',
        },
        {
          status: 400,
          headers: corsHeaders,
        }
      );
    }
  } catch (error) {
    console.error('Error deleting notification:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to delete notification',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
}

