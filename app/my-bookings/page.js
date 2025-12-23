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
  pending: <ClockIcon className="h-4 w-4 mr-1.5" />,
  confirmed: <CheckCircle className="h-4 w-4 mr-1.5" />,
  cancelled: <XCircle className="h-4 w-4 mr-1.5" />,
  completed: <CalendarCheck className="h-4 w-4 mr-1.5" />,
};

const LoadingSkeleton = () => (
  <div className="space-y-4">
    {[1, 2, 3].map((i) => (
      <Card key={i} className="overflow-hidden">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
            <Skeleton className="h-6 w-24" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-24" />
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
  });

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
        credentials: "include", // This will include the session cookie
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
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/bookings/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        }
      );

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
    // Format the date to YYYY-MM-DD for the date input
    const formattedDate = new Date(booking.date).toISOString().split("T")[0];

    setEditingId(booking._id);
    setEditForm({
      date: formattedDate,
      time: booking.time,
      notes: booking.notes || "",
    });

    // Smooth scroll to the form
    setTimeout(() => {
      const element = document.getElementById(`edit-form-${booking._id}`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 100);
  };

  const handleUpdate = async (id) => {
    try {
      setUpdating(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/bookings/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            date: editForm.date,
            time: editForm.time,
            notes: editForm.notes,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update booking");
      }

      setEditingId(null);
      toast.success("Booking updated successfully!");
      await fetchBookings();
    } catch (err) {
      console.error("Error updating booking:", err);
      toast.error("Failed to update booking. Please try again.");
    } finally {
      setUpdating(false);
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
      return dateString; // Return the original string if there's an error
    }
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-50 text-green-700 border-green-100";
      case "cancelled":
        return "bg-red-50 text-red-700 border-red-100";
      case "completed":
        return "bg-blue-50 text-blue-700 border-blue-100";
      case "pending":
      default:
        return "bg-amber-50 text-amber-700 border-amber-100";
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-3">
              My Bookings
            </h1>
            <p className="text-gray-600">
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
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-red-50 border-red-200">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <XCircle className="h-6 w-6 text-red-500" />
                <CardTitle className="text-red-800">
                  Error loading bookings
                </CardTitle>
              </div>
              <CardDescription className="text-red-700">
                {error}
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button
                variant="outline"
                onClick={fetchBookings}
                className="border-red-300 text-red-700"
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500 mb-4">
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
            className="text-center py-16 px-6 bg-white rounded-xl shadow-sm border border-gray-100 max-w-2xl mx-auto"
          >
            <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-blue-50 mb-4">
              <Calendar className="h-10 w-10 text-blue-600" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
              No bookings yet
            </h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              You do not have any upcoming car wash appointments. Book your
              first service now!
            </p>
            <Link href="/booking">
              <Button className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 transition-all duration-300 transform hover:-translate-y-0.5">
                <CarIcon className="mr-2 h-5 w-5" />
                Book a Wash Now
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
              const isUpcoming =
                isAfter(bookingDate, new Date()) ||
                (format(bookingDate, "yyyy-MM-dd") ===
                  format(new Date(), "yyyy-MM-dd") &&
                  booking.time > format(new Date(), "HH:mm"));
              const isPast =
                isBefore(bookingDate, new Date()) &&
                !(
                  format(bookingDate, "yyyy-MM-dd") ===
                  format(new Date(), "yyyy-MM-dd")
                );

              return (
                <motion.div
                  key={booking._id}
                  variants={item}
                  layout
                  className="relative"
                >
                  {isUpcoming && (
                    <div className="absolute -top-3 -left-1">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <ClockIcon className="h-3 w-3 mr-1" />
                        Upcoming
                      </span>
                    </div>
                  )}

                  {isPast && (
                    <div className="absolute -top-3 -left-1">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        <CalendarCheck className="h-3 w-3 mr-1" />
                        Past Booking
                      </span>
                    </div>
                  )}

                  <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg border border-gray-100">
                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 px-6 py-4 border-b border-gray-100">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-3">
                            <h2 className="text-2xl font-bold text-gray-900">
                              {booking.service?.name || "Premium Car Wash"}
                            </h2>
                            <Badge
                              variant="outline"
                              className={`${getStatusVariant(
                                booking.status
                              )} text-xs font-medium px-2.5 py-1 rounded-full border-0`}
                            >
                              {statusIcons[booking.status]}
                              {booking.status.charAt(0).toUpperCase() +
                                booking.status.slice(1)}
                            </Badge>
                          </div>
                          <div className="flex items-center mt-2 text-sm text-gray-600">
                            <Calendar className="h-4 w-4 mr-1.5 text-gray-400" />
                            <span className="font-medium">
                              {formatDate(booking.date)}
                            </span>
                            <span className="mx-2 text-gray-300">•</span>
                            <ClockIcon className="h-4 w-4 mr-1.5 text-gray-400" />
                            <span>{booking.time}</span>
                          </div>
                        </div>
                        <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100">
                          <div className="text-sm text-gray-500">Total</div>
                          <div className="text-xl font-bold text-gray-900">
                            ₹{booking.price?.toFixed(2) || "0.00"}
                          </div>
                        </div>
                      </div>
                    </div>

                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="space-y-4">
                          <div className="flex items-start">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                              <User className="h-5 w-5" />
                            </div>
                            <div className="ml-4">
                              <h3 className="text-sm font-medium text-gray-500">
                                Customer
                              </h3>
                              <p className="text-sm text-gray-900">
                                {booking.customerName}
                              </p>
                              <p className="text-sm text-gray-500">
                                {booking.email ||
                                  session?.user?.email ||
                                  "No email"}
                              </p>
                              <p className="text-sm text-gray-500">
                                {booking.phoneNumber}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-start">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                              <CarIcon className="h-5 w-5" />
                            </div>
                            <div className="ml-4">
                              <h3 className="text-sm font-medium text-gray-500">
                                Vehicle
                              </h3>
                              <p className="text-sm text-gray-900">
                                {booking.vehicleType || "Car"}
                              </p>
                              {booking.licensePlate && (
                                <div className="mt-1">
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                    {booking.licensePlate}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-start">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                              <MapPin className="h-5 w-5" />
                            </div>
                            <div className="ml-4">
                              <h3 className="text-sm font-medium text-gray-500">
                                Location
                              </h3>
                              <p className="text-sm text-gray-900">
                                Our Car Wash Center
                              </p>
                              <p className="text-sm text-gray-500">
                                123 Wash Street
                              </p>
                              <p className="text-sm text-gray-500">
                                Your City, 12345
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {booking.notes && (
                        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
                          <div className="flex">
                            <Info className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                            <div>
                              <h4 className="text-sm font-medium text-gray-700 mb-1">
                                Special Instructions
                              </h4>
                              <p className="text-sm text-gray-600">
                                {booking.notes}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {editingId === booking._id && (
                        <motion.div
                          id={`edit-form-${booking._id}`}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-6 p-5 bg-blue-50 rounded-lg border border-blue-100 overflow-hidden"
                        >
                          <h4 className="font-medium text-blue-800 mb-4 flex items-center">
                            <Edit className="h-5 w-5 mr-2" />
                            Edit Booking Details
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-gray-700">
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
                                className="w-full bg-white"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-gray-700">
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
                                className="w-full bg-white"
                              />
                            </div>
                          </div>
                          <div className="mt-4 space-y-2">
                            <label className="text-sm font-medium text-gray-700">
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
                              rows={3}
                              className="bg-white"
                            />
                          </div>
                        </motion.div>
                      )}
                    </CardContent>

                    <CardFooter className="bg-gray-50 px-6 py-4 border-t border-gray-100">
                      <div className="flex flex-col sm:flex-row justify-between w-full gap-3">
                        <div className="flex items-center text-sm text-gray-500">
                          <CalendarCheck className="h-4 w-4 mr-2 text-gray-400" />
                          <span>
                            Booking ID:{" "}
                            {booking._id?.substring(18, 24).toUpperCase() ||
                              "N/A"}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-2 justify-end">
                          {editingId === booking._id ? (
                            <>
                              <Button
                                variant="outline"
                                onClick={() => setEditingId(null)}
                                disabled={updating}
                                className="flex-1 sm:flex-none"
                              >
                                Cancel
                              </Button>
                              <Button
                                onClick={() => handleUpdate(booking._id)}
                                disabled={updating}
                                className="flex-1 sm:flex-none bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600"
                              >
                                {updating ? (
                                  <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Updating...
                                  </>
                                ) : (
                                  "Save Changes"
                                )}
                              </Button>
                            </>
                          ) : (
                            <>
                              {booking.status !== "completed" &&
                                booking.status !== "cancelled" && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleEdit(booking)}
                                    className="flex-1 sm:flex-none"
                                  >
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit
                                  </Button>
                                )}

                              {booking.status === "pending" ||
                              booking.status === "confirmed" ? (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex-1 sm:flex-none"
                                  onClick={() => handleCancel(booking._id)}
                                  disabled={cancelling === booking._id}
                                >
                                  {cancelling === booking._id ? (
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                  ) : (
                                    <XCircle className="h-4 w-4 mr-2" />
                                  )}
                                  {booking.status === "cancelled"
                                    ? "Remove"
                                    : "Cancel Booking"}
                                </Button>
                              ) : null}

                              {booking.status === "pending" && (
                                <Button
                                  size="sm"
                                  className="flex-1 sm:flex-none bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600"
                                  onClick={() => markAsCompleted(booking._id)}
                                  disabled={updatingStatus === booking._id}
                                >
                                  {updatingStatus === booking._id ? (
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                  ) : (
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                  )}
                                  Mark as Completed
                                </Button>
                              )}

                              <Link
                                href="/booking"
                                className="flex-1 sm:flex-none"
                              >
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="w-full"
                                >
                                  <PlusCircle className="h-4 w-4 mr-2" />
                                  New Booking
                                </Button>
                              </Link>
                            </>
                          )}
                        </div>
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
