'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUser, FiMail, FiPhone, FiLock, FiCalendar, FiClock, FiCheckCircle, FiUpload, FiX, FiSun, FiMoon, FiEye, FiEyeOff } from 'react-icons/fi';

const tabs = [
  { id: 'profile', label: 'Profile' },
  { id: 'security', label: 'Security' },
  { id: 'preferences', label: 'Preferences' },
];

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const [stats, setStats] = useState({
    totalBookings: 12,
    completedBookings: 9,
    memberSince: new Date(Date.now() - 1000 * 60 * 60 * 24 * 90).toISOString(),
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (session?.user) {
      setFormData({
        name: session.user.name || '',
        email: session.user.email || '',
        phone: session.user.phone || '',
      });
    }
  }, [status, session, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Only include password fields if they're being updated
      const { currentPassword, newPassword, confirmPassword, ...profileData } = formData;
      
      // If any password field is filled, validate and include in the request
      const passwordData = {};
      if (currentPassword || newPassword || confirmPassword) {
        if (newPassword !== confirmPassword) {
          throw new Error('New passwords do not match');
        }
        if (newPassword.length < 6) {
          throw new Error('Password must be at least 6 characters');
        }
        passwordData.currentPassword = currentPassword;
        passwordData.newPassword = newPassword;
      }

      // Update profile information
      const [profileResponse, passwordResponse] = await Promise.all([
        fetch(`/api/user/update`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(profileData),
          credentials: 'include',
        }),
        // Only make password update request if password fields are filled
        Object.keys(passwordData).length > 0
          ? fetch(`/api/user/change-password`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(passwordData),
              credentials: 'include',
            })
          : Promise.resolve({ ok: true, json: async () => ({}) }),
      ]);

      const [profileResult, passwordResult] = await Promise.all([
        profileResponse.json(),
        passwordResponse.json(),
      ]);

      if (!profileResponse.ok) {
        throw new Error(profileResult.message || 'Failed to update profile');
      }
      if (!passwordResponse.ok) {
        throw new Error(passwordResult.message || 'Failed to update password');
      }

      // Update the session with new user data
      await update({
        ...session,
        user: {
          ...session.user,
          ...profileData,
        },
      });

      // If password was updated, force a session refresh
      if (passwordResponse.ok) {
        // Force a session refresh to ensure new token is used
        const event = new Event('visibilitychange');
        document.dispatchEvent(event);
        
        // Sign out and sign back in with new credentials
        if (formData.email && formData.newPassword) {
          try {
            const result = await signIn('credentials', {
              redirect: false,
              email: formData.email,
              password: formData.newPassword,
            });
            
            if (result?.error) {
              console.error('Error signing in with new password:', result.error);
              // Still show success since password was updated, just couldn't auto-login
            }
          } catch (error) {
            console.error('Error during auto-login after password change:', error);
          }
        }
      }

      // Clear password fields after successful update
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));

      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Update error:', error);
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    // Check for dark mode preference
    if (typeof window !== 'undefined') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(isDark);
      document.documentElement.classList.toggle('dark', isDark);
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    document.documentElement.classList.toggle('dark', newMode);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        // Here you would typically upload the image to your server
        // and update the user's profile picture URL
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setPreviewImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (status === 'loading' || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 dark:border-blue-400 mx-auto"></div>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-gray-600 dark:text-gray-300 font-medium"
          >
            Loading your profile...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-indigo-900 dark:to-purple-900 px-6 py-8 text-center relative overflow-hidden">
            <motion.div 
              className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl"
              animate={{ scale: [1, 1.2, 1], x: [0, 20, 0] }}
              transition={{ duration: 5, repeat: Infinity }}
            />
            <motion.div 
              className="absolute bottom-0 left-0 w-40 h-40 bg-indigo-400/20 dark:bg-purple-400/20 rounded-full blur-3xl"
              animate={{ scale: [1.2, 1, 1.2], y: [0, -20, 0] }}
              transition={{ duration: 6, repeat: Infinity }}
            />
            
            <div className="relative z-10">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                className="mx-auto h-32 w-32 rounded-full bg-white/20 dark:bg-gray-700/30 p-1 mb-4 relative group"
              >
                <div className="relative h-full w-full rounded-full overflow-hidden">
                  {previewImage || session.user.image ? (
                    <>
                      <Image
                        src={previewImage || session.user.image || '/images/default-avatar.png'}
                        alt="Profile"
                        fill
                        className="object-cover"
                        sizes="(max-width: 128px) 100vw, 128px"
                      />
                      <button 
                        onClick={removeImage}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Remove image"
                      >
                        <FiX size={16} />
                      </button>
                    </>
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-blue-400 to-indigo-600 dark:from-indigo-600 dark:to-purple-700 flex items-center justify-center text-4xl font-bold text-white">
                      {session?.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                  )}
                </div>
                
                <label 
                  htmlFor="profile-picture" 
                  className="absolute -bottom-2 right-0 bg-white dark:bg-gray-700 p-2 rounded-full shadow-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  title="Change profile picture"
                >
                  <FiUpload className="text-blue-600 dark:text-blue-400" />
                  <input
                    id="profile-picture"
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-2xl font-bold text-white"
              >
                {session.user.name || 'User'}
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-blue-100 dark:text-blue-200 mt-1"
              >
                {session.user.email}
              </motion.p>
              
              {/* Stats */}
              <div className="flex justify-center mt-4 space-x-6">
                <div className="text-center">
                  <div className="text-xl font-bold text-white">{stats.totalBookings}</div>
                  <div className="text-xs text-blue-100 dark:text-blue-200">Bookings</div>
                </div>
                <div className="h-10 w-px bg-white/30"></div>
                <div className="text-center">
                  <div className="text-xl font-bold text-white">{stats.completedBookings}</div>
                  <div className="text-xs text-blue-100 dark:text-blue-200">Completed</div>
                </div>
                <div className="h-10 w-px bg-white/30"></div>
                <div className="text-center">
                  <div className="text-xl font-bold text-white">
                    {new Date(stats.memberSince).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </div>
                  <div className="text-xs text-blue-100 dark:text-blue-200">Member Since</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex -mb-px">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400 dark:border-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
          
          {/* Tab Content */}
          <div className="p-6 sm:p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === 'profile' ? (
                  <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="col-span-2 sm:col-span-1"
                >
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="col-span-2 sm:col-span-1"
                >
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50"
                      placeholder="you@example.com"
                      required
                      disabled
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="text-xs text-gray-500">Cannot change</span>
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="col-span-2"
                >
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </motion.div>
              </div>

                  <div className="flex flex-col sm:flex-row justify-between items-center pt-6 border-t border-gray-200 dark:border-gray-700">
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-4 sm:mb-0">
                      Last updated: {new Date().toLocaleDateString()}
                    </div>
                    <div className="flex space-x-3">
                      <motion.button
                        type="button"
                        onClick={() => router.back()}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                      >
                        Cancel
                      </motion.button>
                      <motion.button
                        type="submit"
                        disabled={isLoading}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 hover:shadow-lg ${
                          isLoading ? 'opacity-70 cursor-not-allowed' : ''
                        }`}
                      >
                        {isLoading ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Saving...
                          </>
                        ) : (
                          'Save Changes'
                        )}
                      </motion.button>
                    </div>
                  </div>
                  </form>
                ) : activeTab === 'security' ? (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 dark:border-yellow-500 p-4 rounded-r-md mb-6">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-yellow-700 dark:text-yellow-400">
                            For security reasons, please enter your current password to make changes.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Current Password
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiLock className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            id="currentPassword"
                            name="currentPassword"
                            type={showCurrentPassword ? "text" : "password"}
                            value={formData.currentPassword}
                            onChange={handleChange}
                            className="block w-full pl-10 pr-12 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
                            placeholder="••••••••"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            className="absolute inset-y-0 right-0 flex items-center justify-center w-10 h-full text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-200 z-10 cursor-pointer"
                            aria-label={showCurrentPassword ? "Hide password" : "Show password"}
                          >
                            {showCurrentPassword ? <FiEye className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            New Password
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <FiLock className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                              id="newPassword"
                              name="newPassword"
                              type={showNewPassword ? "text" : "password"}
                              value={formData.newPassword}
                              onChange={handleChange}
                              className="block w-full pl-10 pr-12 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
                              placeholder="••••••••"
                            />
                            <button
                              type="button"
                              onClick={() => setShowNewPassword(!showNewPassword)}
                              className="absolute inset-y-0 right-0 flex items-center justify-center w-10 h-full text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-200 z-10"
                              aria-label={showNewPassword ? "Hide password" : "Show password"}
                            >
                              {showNewPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
                            </button>
                          </div>
                        </div>

                        <div>
                          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Confirm New Password
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <FiCheckCircle className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                              id="confirmPassword"
                              name="confirmPassword"
                              type={showConfirmPassword ? "text" : "password"}
                              value={formData.confirmPassword}
                              onChange={handleChange}
                              className="block w-full pl-10 pr-12 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
                              placeholder="••••••••"
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute inset-y-0 right-0 flex items-center justify-center w-10 h-full text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-200 z-10"
                              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                            >
                              {showConfirmPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                      <motion.button
                        type="submit"
                        disabled={isLoading}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 ${
                          isLoading ? 'opacity-70 cursor-not-allowed' : ''
                        }`}
                      >
                        {isLoading ? 'Updating...' : 'Update Password'}
                      </motion.button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">Appearance</h3>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Customize how the app looks and feels.
                      </p>
                    </div>

                    <div className="mt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white">Theme</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {isDarkMode ? 'Dark mode is enabled' : 'Light mode is enabled'}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={toggleDarkMode}
                          className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                            isDarkMode ? 'bg-blue-600' : 'bg-gray-200'
                          }`}
                          role="switch"
                          aria-checked={isDarkMode}
                        >
                          <span className="sr-only">Toggle dark mode</span>
                          <span
                            className={`pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                              isDarkMode ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          >
                            <span
                              className={`absolute inset-0 flex h-full w-full items-center justify-center transition-opacity ${
                                isDarkMode ? 'opacity-0 duration-100 ease-out' : 'opacity-100 duration-200 ease-in'
                              }`}
                              aria-hidden="true"
                            >
                              <FiSun className="h-3 w-3 text-gray-400" />
                            </span>
                            <span
                              className={`absolute inset-0 flex h-full w-full items-center justify-center transition-opacity ${
                                isDarkMode ? 'opacity-100 duration-200 ease-in' : 'opacity-0 duration-100 ease-out'
                              }`}
                              aria-hidden="true"
                            >
                              <FiMoon className="h-3 w-3 text-blue-600" />
                            </span>
                          </span>
                        </button>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">Notifications</h3>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 mb-4">
                        Manage how you receive notifications.
                      </p>
                      
                      <div className="space-y-4">
                        <div className="flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              id="email-notifications"
                              name="email-notifications"
                              type="checkbox"
                              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              defaultChecked
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor="email-notifications" className="font-medium text-gray-700 dark:text-gray-300">
                              Email notifications
                            </label>
                            <p className="text-gray-500 dark:text-gray-400">Get notified about your account activity.</p>
                          </div>
                        </div>

                        <div className="flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              id="sms-notifications"
                              name="sms-notifications"
                              type="checkbox"
                              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              defaultChecked
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor="sms-notifications" className="font-medium text-gray-700 dark:text-gray-300">
                              SMS notifications
                            </label>
                            <p className="text-gray-500 dark:text-gray-400">Get text messages about important updates.</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                      >
                        Save Preferences
                      </motion.button>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
          
          {/* Footer */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 px-6 py-4 border-t border-gray-200 dark:border-gray-700"
          >
            <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <div className="mb-2 sm:mb-0">
                &copy; {new Date().getFullYear()} CarWash Pro. All rights reserved.
              </div>
              <div className="flex space-x-4">
                <a href="/privacy" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">Privacy</a>
                <a href="/terms" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">Terms</a>
                <a href="/help" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">Help</a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
