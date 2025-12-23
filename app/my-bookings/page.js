"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  Calendar,
  User,
  Mail,
  Phone,
  Trash2,
  Edit,
  CheckCircle,
  XCircle,
  Clock as ClockIcon,
  Loader2,
  AlertCircle,
  MapPin,
  Car as CarIcon,
  CalendarCheck,
  Info,
  PlusCircle,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { format, parseISO, isBefore, isAfter, addDays } from "date-fns";

// Animation variants
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10,
    },
  },
};

const statusIcons = {
  pending: <ClockIcon className="h-4 w-4 mr-1.5 text-amber-500" />,
  confirmed: <CheckCircle className="h-4 w-4 mr-1.5 text-emerald-500" />,
  cancelled: <XCircle className="h-4 w-4 mr-1.5 text-red-500" />,
  completed: <CalendarCheck className="h-4 w-4 mr-1.5 text-blue-600" />,
};

const LoadingSkeleton = () => (
  <div className="space-y-6">
    {[1, 2, 3].map((i) => (
      <Card key={i} className="overflow-hidden border border-blue-100 shadow-sm hover:shadow-md transition-all duration-200 hover:border-blue-200">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-blue-100">
          <div className="flex justify-between items-start">
            <div className="space-y-3">
              <Skeleton className="h-7 w-56 bg-blue-100" />
              <Skeleton className="h-5 w-40 bg-blue-100" />
            </div>
            <Skeleton className="h-8 w-28 bg-blue-100" />
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <Skeleton className="h-5 w-full bg-blue-50" />
            <Skeleton className="h-5 w-5/6 bg-blue-50" />
            <Skeleton className="h-5 w-4/6 bg-blue-50" />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-3 bg-blue-50 border-t border-blue-100">
          <Skeleton className="h-10 w-28 bg-blue-100" />
          <Skeleton className="h-10 w-28 bg-blue-100" />
        </CardFooter>
      </Card>
    ))}
  </div>
);

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
    date: "",
    time: "",
    notes: "",
    vehicleType: "",
    vehicleNumber: "",
  });
  const [isDeleting, setIsDeleting] = useState(null);

  // Redirect to signin if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin?callbackUrl=/my-bookings");
    } else if (status === "authenticated") {
      fetchBookings();
    }
  }, [status, router]);

  const fetchBookings = async () => {
    if (!session?.user?.id) {
      setError("User not authenticated");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`/api/bookings`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to fetch bookings");
      }

      const data = await response.json();
      setBookings(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setError(
        err.message || "Failed to load bookings. Please try again later."
      );
      toast.error(err.message || "Failed to load your bookings");
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (id, status) => {
    if (
      !window.confirm(
        `Are you sure you want to mark this booking as ${status}?`
      )
    )
      return;

    try {
      setUpdatingStatus(id);
      const response = await fetch(`/api/bookings/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ status }),
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

  const handleCancel = (id) => updateBookingStatus(id, "cancelled");
  const markAsPending = (id) => updateBookingStatus(id, "pending");
  const markAsCompleted = (id) => updateBookingStatus(id, "completed");

  const handleEdit = (booking) => {
    const formattedDate = new Date(booking.date).toISOString().split("T")[0];

    setEditingId(booking._id);
    setEditForm({
      date: formattedDate,
      time: booking.time,
      notes: booking.notes || "",
      vehicleType: booking.vehicleType || "",
      vehicleNumber: booking.vehicleNumber || "",
    });

    setTimeout(() => {
      const element = document.getElementById(`edit-form-${booking._id}`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 100);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveEdit = async (bookingId) => {
    if (!editingId) return;

    try {
      setUpdating(bookingId);
      const response = await fetch(`/api/bookings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: bookingId,
          ...editForm,
          date: new Date(editForm.date).toISOString(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update booking");
      }

      toast.success("Booking updated successfully");
      setEditingId(null);
      await fetchBookings();
    } catch (error) {
      console.error("Error updating booking:", error);
      toast.error(error.message || "Failed to update booking");
    } finally {
      setUpdating(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({
      date: "",
      time: "",
      notes: "",
      vehicleType: "",
      vehicleNumber: "",
    });
  };

  const handleDelete = async (bookingId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this booking? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      setIsDeleting(bookingId);
      const response = await fetch(`/api/bookings?id=${bookingId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete booking");
      }

      toast.success("Booking deleted successfully");
      setBookings(bookings.filter((booking) => booking._id !== bookingId));
    } catch (error) {
      console.error("Error deleting booking:", error);
      toast.error(error.message || "Failed to delete booking");
    } finally {
      setIsDeleting(null);
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        weekday: "long",
      }).format(date);
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  };

  const getStatusVariant = (status) => {
    const statusStyles = {
      pending: "bg-amber-50 text-amber-700 border-amber-200",
      confirmed: "bg-emerald-50 text-emerald-700 border-emerald-200",
      cancelled: "bg-red-50 text-red-700 border-red-200",
      completed: "bg-blue-50 text-blue-700 border-blue-200",
    };

    return statusStyles[status] + " shadow-sm";
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent sm:text-5xl mb-4">
              My Bookings
            </h1>
            <p className="text-gray-600 text-lg">
              Manage and track your car wash appointments
            </p>
          </div>
          <LoadingSkeleton />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gradient-to-br from-red-50 to-rose-50 border-red-200 shadow-xl">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <XCircle className="h-6 w-6 text-red-600" />
                </div>
                <CardTitle className="text-red-900 text-xl">
                  Error loading bookings
                </CardTitle>
              </div>
              <CardDescription className="text-red-700 mt-2">
                {error}
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button
                onClick={fetchBookings}
                className="bg-red-600 hover:bg-red-700 text-white shadow-lg"
              >
                Try Again
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center p-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full mb-4">
            <Sparkles className="h-6 w-6 text-purple-600" />
          </div>
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent sm:text-6xl mb-4">
            My Bookings
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Manage and track all your car wash appointments in one place
          </p>
        </motion.div>

        {bookings.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20 px-8 bg-white rounded-2xl shadow-xl border border-gray-200 max-w-2xl mx-auto"
          >
            <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 mb-6 shadow-lg">
              <Calendar className="h-12 w-12 text-purple-600" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-3">
              No bookings yet
            </h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto text-lg">
              You have not made any car wash appointments yet. Book your first
              service now and experience premium care!
            </p>
            <Link href="/booking">
              <Button className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 px-8 py-6 text-lg">
                <CarIcon className="mr-2 h-6 w-6" />
                Book Your First Wash
              </Button>
            </Link>
          </motion.div>
        )}

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-6"
        >
          <AnimatePresence>
            {bookings.map((booking) => {
              const bookingDate = new Date(booking.date);
              const today = new Date();
              const isToday = format(bookingDate, "yyyy-MM-dd") === format(today, "yyyy-MM-dd");
              const isUpcoming =
                (isAfter(bookingDate, today) || 
                (isToday && booking.time > format(today, "HH:mm"))) && !isToday;
              const isPast =
                isBefore(bookingDate, today) &&
                !isToday;

              return (
                <motion.div
                  key={booking._id}
                  variants={item}
                  layout
                  className="relative"
                >
                  <Card className="overflow-hidden transition-all duration-300 hover:shadow-2xl border-2 border-gray-200 hover:border-purple-300 bg-white">
                    {isToday && (
                      <div className="absolute top-4 left-4 z-10">
                        <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg">
                          <CalendarCheck className="h-4 w-4 mr-2" />
                          Today
                        </span>
                      </div>
                    )}

                    {isUpcoming && !isToday && (
                      <div className="absolute top-4 left-4 z-10">
                        <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg">
                          <ClockIcon className="h-4 w-4 mr-2" />
                          Upcoming
                        </span>
                      </div>
                    )}

                    {isPast && !isToday && (
                      <div className="absolute top-4 left-4 z-10">
                        <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-gray-400 to-gray-500 text-white shadow-lg">
                          <CalendarCheck className="h-4 w-4 mr-2" />
                          {booking.status === 'completed' ? 'Completed' : 'Past Booking'}
                        </span>
                      </div>
                    )}

                    <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 px-6 py-6 border-b-4 border-purple-600">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-8">
                        <div>
                          <div className="flex items-center gap-3 flex-wrap">
                            <h2 className="text-3xl font-bold text-white drop-shadow-lg">
                              {booking.service || "Premium Car Wash"}
                            </h2>
                            <Badge
                              className={`${getStatusVariant(
                                booking.status
                              )} text-sm font-semibold px-3 py-1.5 rounded-full`}
                            >
                              {statusIcons[booking.status]}
                              {booking.status.charAt(0).toUpperCase() +
                                booking.status.slice(1)}
                            </Badge>
                          </div>
                          <div className="flex items-center mt-3 text-base text-white/90">
                            <Calendar className="h-5 w-5 mr-2" />
                            <span className="font-semibold">
                              {formatDate(booking.date)}
                            </span>
                            <span className="mx-3">•</span>
                            <ClockIcon className="h-5 w-5 mr-2" />
                            <span className="font-semibold">
                              {booking.time}
                            </span>
                          </div>
                        </div>
                        <div className="bg-white px-6 py-4 rounded-xl shadow-xl border-2 border-purple-200">
                          <div className="text-sm font-medium text-gray-600">
                            Total Amount
                          </div>
                          <div className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            ₹{booking.price?.toFixed(2) || "0.00"}
                          </div>
                        </div>
                      </div>
                    </div>

                    <CardContent className="p-8 bg-gradient-to-br from-gray-50 to-white">
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="space-y-4">
                          <div className="flex items-start">
                            <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-blue-600 shadow-md">
                              <User className="h-6 w-6" />
                            </div>
                            <div className="ml-4">
                              <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">
                                Customer
                              </h3>
                              <p className="text-base font-semibold text-gray-900">
                                {booking.customerName}
                              </p>
                              <p className="text-sm text-gray-600 mt-1">
                                {booking.email ||
                                  session?.user?.email ||
                                  "No email"}
                              </p>
                              <p className="text-sm text-gray-600">
                                {booking.phoneNumber}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-start">
                            <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center text-amber-600 shadow-md">
                              <CarIcon className="h-6 w-6" />
                            </div>
                            <div className="ml-4 flex-1">
                              <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">
                                Vehicle
                              </h3>
                              {editingId === booking._id ? (
                                <div className="space-y-3">
                                  <div>
                                    <label
                                      htmlFor="vehicleType"
                                      className="block text-xs font-semibold text-gray-700 mb-1.5"
                                    >
                                      Vehicle Type
                                    </label>
                                    <select
                                      id="vehicleType"
                                      name="vehicleType"
                                      value={editForm.vehicleType}
                                      onChange={handleEditChange}
                                      className="w-full px-3 py-2.5 border-2 border-gray-300 rounded-lg text-sm font-medium text-gray-900 bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                                      required
                                    >
                                      <option value="">
                                        Select vehicle type
                                      </option>
                                      <option value="Hatchback">
                                        Hatchback
                                      </option>
                                      <option value="Sedan">Sedan</option>
                                      <option value="SUV">SUV</option>
                                      <option value="MUV">MUV</option>
                                      <option value="Luxury">Luxury</option>
                                    </select>
                                  </div>
                                  <div>
                                    <label
                                      htmlFor="vehicleNumber"
                                      className="block text-xs font-semibold text-gray-700 mb-1.5"
                                    >
                                      Vehicle Number
                                    </label>
                                    <input
                                      type="text"
                                      id="vehicleNumber"
                                      name="vehicleNumber"
                                      value={editForm.vehicleNumber}
                                      onChange={handleEditChange}
                                      className="w-full px-3 py-2.5 border-2 border-gray-300 rounded-lg text-sm font-medium text-gray-900 bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                                      placeholder="e.g., GJ01AB1234"
                                      required
                                    />
                                  </div>
                                </div>
                              ) : (
                                <>
                                  <p className="text-base font-semibold text-gray-900">
                                    {booking.vehicleType || "Car"}
                                  </p>
                                  <div className="mt-2">
                                    <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-bold bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border-2 border-gray-300">
                                      {booking.vehicleNumber || "N/A"}
                                    </span>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-start">
                            <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center text-purple-600 shadow-md">
                              <MapPin className="h-6 w-6" />
                            </div>
                            <div className="ml-4 flex-1">
                              <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">
                                Location
                              </h3>
                              <p className="text-base font-semibold text-gray-900">
                                {booking.location || "Your Location"}
                              </p>
                              {editingId === booking._id ? (
                                <div className="mt-3">
                                  <label
                                    htmlFor="notes"
                                    className="block text-xs font-semibold text-gray-700 mb-1.5"
                                  >
                                    Additional Notes
                                  </label>
                                  <textarea
                                    id="notes"
                                    name="notes"
                                    value={editForm.notes}
                                    onChange={handleEditChange}
                                    rows="3"
                                    className="bg-white w-full px-3 py-2.5 border-2 border-gray-300 rounded-lg text-sm font-medium text-gray-900 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all resize-none"
                                    placeholder="Any special instructions?"
                                  />
                                </div>
                              ) : booking.notes ? (
                                <p className="mt-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200">
                                  <span className="font-semibold text-gray-700">
                                    Notes:
                                  </span>{" "}
                                  {booking.notes}
                                </p>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>

                    {editingId === booking._id && (
                      <motion.div
                        id={`edit-form-${booking._id}`}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="px-8 py-6 bg-gradient-to-br from-purple-50 to-blue-50 border-t-4 border-purple-300"
                      >
                        <h4 className="font-bold text-purple-900 mb-6 flex items-center text-lg">
                          <Edit className="h-6 w-6 mr-3" />
                          Edit Booking Details
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-800">
                              Date
                            </label>
                            <Input
                              type="date"
                              value={editForm.date}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  date: e.target.value,
                                })
                              }
                              min={new Date().toISOString().split("T")[0]}
                              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-base font-medium text-gray-900 bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-800">
                              Time
                            </label>
                            <Input
                              type="time"
                              value={editForm.time}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  time: e.target.value,
                                })
                              }
                              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-base font-medium text-gray-900 bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                            />
                          </div>
                        </div>
                        <div className="mt-6 space-y-2">
                          <label className="text-sm font-bold text-gray-800">
                            Additional Notes
                          </label>
                          <Textarea
                            value={editForm.notes}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                notes: e.target.value,
                              })
                            }
                            placeholder="Any special instructions or requests..."
                            rows={4}
                            className="bg-white w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-base font-medium text-gray-900 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all resize-none"
                          />
                        </div>
                      </motion.div>
                    )}

                    <CardFooter className="bg-gradient-to-r from-gray-50 to-white px-6 py-4 border-t border-gray-100">
                      <div className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        {/* LEFT – Secondary / Destructive */}
                        <div className="flex items-center gap-2">
                          {(isUpcoming || isToday) && editingId !== booking._id && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCancel(booking._id)}
                              disabled={cancelling === booking._id}
                              className="flex items-center gap-1.5 text-sm font-medium text-red-600 hover:bg-red-50 border-red-200 hover:border-red-300"
                            >
                              {cancelling === booking._id ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  <span>Cancelling...</span>
                                </>
                              ) : (
                                <>
                                  <XCircle className="mr-2 h-4 w-4" />
                                  <span>Cancel Booking</span>
                                </>
                              )}
                              Cancel Booking
                            </Button>
                          )}

                          {editingId === booking._id && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={handleCancelEdit}
                              className="
                                bg-white
                                text-gray-600
                                hover:bg-gray-100
                                hover:text-gray-800
                                transition-all
                                active:scale-95
                              "
                            >
                              <XCircle className="mr-2 h-4 w-4" />
                              Discard Changes
                            </Button>
                          )}
                        </div>

                        {/* RIGHT – Primary Actions */}
                        {(isUpcoming || isToday || (isPast && booking.status !== 'completed')) && (
                          <div className="flex flex-wrap items-center gap-2 justify-end">
                            {editingId === booking._id ? (
                              <Button
                                size="sm"
                                onClick={() => handleSaveEdit(booking._id)}
                                disabled={updating === booking._id}
                                className="
                                  bg-indigo-600
                                  hover:bg-indigo-700
                                  text-white
                                  shadow-md
                                  hover:shadow-indigo-300/40
                                  transition-all
                                  active:scale-95
                                "
                              >
                                {updating === booking._id ? (
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                )}
                                Save Changes
                              </Button>
                            ) : (
                              <>
                                {/* EDIT */}
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEdit(booking)}
                                  disabled={cancelling === booking._id}
                                  className="
                                    bg-white
                                    border-blue-300
                                    text-blue-700
                                    hover:bg-blue-600 hover:text-white
                                    hover:border-blue-600
                                    transition-all
                                    active:scale-95
                                  "
                                >
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </Button>

                                {booking.status !== 'completed' && (
                                  <Button
                                    size="sm"
                                    onClick={() => markAsCompleted(booking._id)}
                                    disabled={updatingStatus === booking._id}
                                    className={`
                                      ${isPast ? 'bg-blue-600 hover:bg-blue-700 hover:shadow-blue-300/40' : 'bg-emerald-600 hover:bg-emerald-700 hover:shadow-emerald-300/40'}
                                      text-white
                                      shadow-md
                                      transition-all
                                      active:scale-95
                                    `}
                                  >
                                    {updatingStatus === booking._id ? (
                                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                      <CheckCircle className="mr-2 h-4 w-4" />
                                    )}
                                    {isPast ? 'Mark as Completed' : 'Complete'}
                                  </Button>
                                )}

                                {/* Divider */}
                                <div className="h-6 w-px bg-gray-200 mx-1 hidden sm:block" />

                                {/* DELETE */}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDelete(booking._id)}
                                  disabled={isDeleting === booking._id}
                                  className="
                                    bg-white
                                    text-rose-600
                                    hover:bg-rose-50
                                    hover:text-rose-700
                                    transition-all
                                    active:scale-95
                                  "
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </Button>

                                {/* NEW BOOKING */}
                                <Link href="/booking" className="hidden sm:block">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="
                                      bg-white
                                      border-violet-300
                                      text-violet-700
                                      hover:bg-violet-600 hover:text-white
                                      hover:border-violet-600
                                      transition-all
                                      active:scale-95
                                    "
                                  >
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    New Booking
                                  </Button>
                                </Link>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </CardFooter>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}

export default MyBookingsPage;
