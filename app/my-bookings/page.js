'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Calendar, Car, User, Mail, Phone, Trash2, Edit, CheckCircle, XCircle, Clock as ClockIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ProtectedRoute } from '@/components/ProtectedRoute';

function MyBookingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
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

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    
    try {
      const response = await fetch(`/api/bookings/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'cancelled' })
      });

      if (!response.ok) {
        throw new Error('Failed to cancel booking');
      }
      
      toast.success('Booking cancelled successfully');
      fetchBookings();
    } catch (err) {
      console.error('Error cancelling booking:', err);
      toast.error('Failed to cancel booking');
    }
  };

  const handleEdit = (booking) => {
    setEditingId(booking._id);
    setEditForm({
      date: booking.date.split('T')[0], // Format date for date input
      time: booking.time,
      notes: booking.notes || ''
    });
  };

  const handleUpdate = async (id) => {
    try {
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
      
      toast.success('Booking updated successfully');
      setEditingId(null);
      fetchBookings();
    } catch (err) {
      console.error('Error updating booking:', err);
      toast.error('Failed to update booking');
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-lg text-gray-600">Loading your bookings...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <XCircle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }


  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            My Bookings
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            View and manage your upcoming car wash appointments
          </p>
        </div>

          {bookings.length === 0 ? (
            <div key="no-bookings" className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">No bookings yet</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by booking a car wash service.</p>
              <div className="mt-6">
                <Link
                  href="/booking"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Book a Service
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {bookings.map((booking) => (
                <li key={`booking-${booking._id}`} className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center">
                        <div className={`flex-shrink-0 rounded-md p-3 ${
                          booking.status === 'completed' ? 'bg-green-100 text-green-600' :
                          booking.status === 'cancelled' ? 'bg-red-100 text-red-600' :
                          'bg-blue-100 text-blue-600'
                        }`}>
                          {booking.status === 'completed' ? (
                            <CheckCircle className="h-6 w-6" />
                          ) : booking.status === 'cancelled' ? (
                            <XCircle className="h-6 w-6" />
                          ) : (
                            <ClockIcon className="h-6 w-6" />
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="flex items-center">
                            <h2 className="text-lg font-medium text-gray-900">
                              {booking.service || 'Car Wash Service'}
                            </h2>
                            <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              booking.status === 'completed' 
                                ? 'bg-green-100 text-green-800' 
                                : booking.status === 'cancelled'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1) || 'Pending'}
                            </span>
                          </div>
                          <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-6">
                            <div className="mt-2 flex items-center text-sm text-gray-500">
                              <Calendar className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                              {new Date(booking.date).toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </div>
                            <div className="mt-2 flex items-center text-sm text-gray-500">
                              <ClockIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                              {booking.time}
                            </div>
                          </div>
                        </div>
                      </div>
                      {booking.notes && (
                        <div className="mt-2 text-sm text-gray-500">
                          <p className="text-sm text-gray-500">{booking.notes}</p>
                        </div>
                      )}
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      {editingId !== booking._id && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(booking)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Edit className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleCancel(booking._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
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
                </li>
              ))}
            </ul>
          </div>
        )}
        </div>
      </div>
    </ProtectedRoute>
  );
}

export default MyBookingsPage;
