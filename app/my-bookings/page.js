'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Calendar, Car, User, Mail, Phone, Trash2, Edit, CheckCircle, XCircle, Clock as ClockIcon, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

function MyBookingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(null);
  const [cancelling, setCancelling] = useState(null);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    date: '',
    time: '',
    notes: ''
  });

  // Redirect to signin if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/my-bookings');
    } else if (status === 'authenticated') {
      fetchBookings();
    }
  }, [status, router]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/bookings');
      
      if (!response.ok) {
        throw new Error('Failed to fetch bookings');
      }
      
      const data = await response.json();
      setBookings(data);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError('Failed to load bookings. Please try again later.');
      toast.error('Failed to load your bookings');
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (id, status) => {
    if (!window.confirm(`Are you sure you want to mark this booking as ${status}?`)) return;
    
    try {
      setUpdatingStatus(id);
      const response = await fetch(`/api/bookings/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status })
      });

      if (!response.ok) {
        throw new Error(`Failed to update booking status to ${status}`);
      }
      
      toast.success(`Booking marked as ${status} successfully`);
      await fetchBookings();
    } catch (err) {
      console.error(`Error updating booking status to ${status}:`, err);
      toast.error(`Failed to update booking status. Please try again.`);
    } finally {
      setUpdatingStatus(null);
      setCancelling(null);
    }
  };

  const handleCancel = (id) => updateBookingStatus(id, 'cancelled');
  const markAsPending = (id) => updateBookingStatus(id, 'pending');
  const markAsCompleted = (id) => updateBookingStatus(id, 'completed');

  const handleEdit = (booking) => {
    // Format the date to YYYY-MM-DD for the date input
    const formattedDate = new Date(booking.date).toISOString().split('T')[0];
    
    setEditingId(booking._id);
    setEditForm({
      date: formattedDate,
      time: booking.time,
      notes: booking.notes || ''
    });
    
    // Smooth scroll to the form
    setTimeout(() => {
      const element = document.getElementById(`edit-form-${booking._id}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  const handleUpdate = async (id) => {
    try {
      setUpdating(true);
      const response = await fetch(`/api/bookings/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: editForm.date,
          time: editForm.time,
          notes: editForm.notes
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update booking');
      }
      
      setEditingId(null);
      toast.success('Booking updated successfully!');
      await fetchBookings();
    } catch (err) {
      console.error('Error updating booking:', err);
      toast.error('Failed to update booking. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
      }).format(date);
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString; // Return the original string if there's an error
    }
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending':
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
            <p className="text-gray-600 text-lg">Loading your bookings...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-red-50 border-red-200">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <XCircle className="h-6 w-6 text-red-500" />
                <CardTitle className="text-red-800">Error loading bookings</CardTitle>
              </div>
              <CardDescription className="text-red-700">
                {error}
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button variant="outline" onClick={fetchBookings} className="border-red-300 text-red-700">
                Try Again
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">My Bookings</h1>
            <p className="mt-3 text-lg text-gray-500">
              View and manage your car wash appointments
            </p>
          </div>
          
          {bookings.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-blue-50">
                <Car className="h-12 w-12 text-blue-600" />
              </div>
              <h3 className="mt-6 text-xl font-medium text-gray-900">No bookings yet</h3>
              <p className="mt-2 text-gray-500 max-w-md mx-auto">
                You havenot made any bookings yet. Book your first car wash service now!
              </p>
              <div className="mt-6">
                <Link href="/booking">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Book a Service
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {bookings.map((booking) => (
                <Card key={booking._id} className="overflow-hidden hover:shadow-md transition-shadow duration-200">
                  <CardHeader className="pb-3 border-b border-gray-100 bg-gray-50">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div>
                        <div className="flex items-center space-x-3">
                          <h2 className="text-xl font-semibold text-gray-900">
                            {booking.service?.name || 'Car Wash Service'}
                          </h2>
                          <Badge variant="outline" className={getStatusVariant(booking.status)}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          Booking ID: <span className="font-mono">{booking._id.slice(-8).toUpperCase()}</span>
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          <ClockIcon className="h-3.5 w-3.5 mr-1" />
                          {booking.time}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-4">
                        <div className="flex items-start">
                          <Calendar className="h-5 w-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-gray-500">Appointment Date</p>
                            <p className="text-gray-900">{formatDate(booking.date)}</p>
                          </div>
                        </div>
                        {booking.vehicle && (
                          <div className="flex items-start">
                            <Car className="h-5 w-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-sm font-medium text-gray-500">Vehicle</p>
                              <p className="text-gray-900">
                                {booking.vehicle.make} {booking.vehicle.model} ({booking.vehicle.year})
                              </p>
                              <p className="text-sm text-gray-500">{booking.vehicle.licensePlate}</p>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-start">
                          <User className="h-5 w-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-gray-500">Customer</p>
                            <p className="text-gray-900">{session?.user?.name}</p>
                            <p className="text-sm text-gray-500 flex items-center">
                              <Mail className="h-3.5 w-3.5 mr-1.5 inline" />
                              {session?.user?.email}
                            </p>
                            {session?.user?.phone && (
                              <p className="text-sm text-gray-500 flex items-center mt-1">
                                <Phone className="h-3.5 w-3.5 mr-1.5 inline" />
                                {session.user.phone}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {booking.notes && (
                      <div className="mt-6">
                        <p className="text-sm font-medium text-gray-500 mb-2">Special Instructions</p>
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <p className="text-gray-700 whitespace-pre-line">{booking.notes}</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                  {booking.status === 'confirmed' && (
                    <CardFooter className="bg-gray-50 border-t border-gray-100 px-6 py-4">
                      <div className="flex flex-wrap gap-3 justify-between w-full">
                        <div className="flex flex-wrap gap-2">
                          {booking.status === 'confirmed' ? (
                            <Button 
                              variant="outline" 
                              onClick={() => handleEdit(booking)}
                              disabled={updatingStatus === booking._id}
                              className="flex-1 sm:flex-none"
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Reschedule
                            </Button>
                          ) : booking.status === 'pending' ? (
                            <div className="flex items-center text-sm text-amber-600">
                              <ClockIcon className="h-4 w-4 mr-1" />
                              This booking is pending
                            </div>
                          ) : booking.status === 'completed' && (
                            <div className="flex items-center text-sm text-green-600">
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Service Completed
                            </div>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-2 justify-end">
                          {booking.status === 'confirmed' && (
                            <Button 
                              variant="outline" 
                              onClick={() => markAsPending(booking._id)}
                              disabled={updatingStatus === booking._id}
                              className="border-amber-500 text-amber-700 hover:bg-amber-50 hover:text-amber-800"
                            >
                              {updatingStatus === booking._id ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              ) : (
                                <ClockIcon className="h-4 w-4 mr-2" />
                              )}
                              Mark as Pending
                            </Button>
                          )}
                          
                          {booking.status === 'pending' && (
                            <Button 
                              variant="outline" 
                              onClick={() => markAsCompleted(booking._id)}
                              disabled={updatingStatus === booking._id}
                              className="border-green-500 text-green-700 hover:bg-green-50 hover:text-green-800"
                            >
                              {updatingStatus === booking._id ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              ) : (
                                <CheckCircle className="h-4 w-4 mr-2" />
                              )}
                              Mark as Completed
                            </Button>
                          )}
                          
                          <Button 
                            variant="destructive" 
                            onClick={() => handleCancel(booking._id)}
                            disabled={updatingStatus === booking._id}
                            className="flex-1 sm:flex-none"
                          >
                            {updatingStatus === booking._id && cancelling === booking._id ? (
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4 mr-2" />
                            )}
                            {booking.status === 'cancelled' ? 'Remove' : 'Cancel'}
                          </Button>
                        </div>
                      </div>
                    </CardFooter>
                  )}
                  {editingId === booking._id && (
                    <div className="space-y-4 mt-4 p-4 border-t border-gray-200">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="edit-date" className="block text-sm font-medium text-gray-700">
                            Date
                          </label>
                          <input
                            type="date"
                            id="edit-date"
                            value={editForm.date}
                            min={new Date().toISOString().split('T')[0]}
                            onChange={(e) => setEditForm({...editForm, date: e.target.value})}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          />
                        </div>
                        <div>
                          <label htmlFor="edit-time" className="block text-sm font-medium text-gray-700">
                            Time
                          </label>
                          <select
                            id="edit-time"
                            value={editForm.time}
                            onChange={(e) => setEditForm({...editForm, time: e.target.value})}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          >
                            <option value="">Select a time</option>
                            {Array.from({length: 24}, (_, i) => {
                              const hour = i.toString().padStart(2, '0');
                              return (
                                <React.Fragment key={i}>
                                  <option value={`${hour}:00`}>{`${hour}:00`}</option>
                                  <option value={`${hour}:30`}>{`${hour}:30`}</option>
                                </React.Fragment>
                              );
                            })}
                          </select>
                        </div>
                      </div>
                      <div>
                        <label htmlFor="edit-notes" className="block text-sm font-medium text-gray-700">
                          Additional Notes (Optional)
                        </label>
                        <textarea
                          id="edit-notes"
                          rows={3}
                          value={editForm.notes}
                          onChange={(e) => setEditForm({...editForm, notes: e.target.value})}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          placeholder="Any special instructions or requests..."
                        />
                      </div>
                      <div className="flex justify-end space-x-3 pt-2">
                        <button
                          type="button"
                          onClick={() => setEditingId(null)}
                          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUpdate(booking._id)}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Save Changes
                        </button>
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}

export default MyBookingsPage;
