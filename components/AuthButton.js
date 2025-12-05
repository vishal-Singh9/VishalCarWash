'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';

export function AuthButton() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="flex items-center space-x-4">
        <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
      </div>
    );
  }

  if (session) {
    return (
      <div className="flex items-center space-x-4">
        <span className="hidden md:inline text-sm text-gray-700">
          Welcome, {session.user.name || session.user.email}
        </span>
        <Link 
          href="/my-bookings"
          className="hidden md:inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-blue-600"
        >
          My Bookings
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="px-4 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-full hover:bg-gray-50 transition"
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-3">
      <Link
        href="/auth/signin"
        className="hidden md:inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-blue-600 transition"
      >
        Sign In
      </Link>
      <Link
        href="/auth/signup"
        className="px-4 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700 transition"
      >
        Sign Up
      </Link>
    </div>
  );
}
