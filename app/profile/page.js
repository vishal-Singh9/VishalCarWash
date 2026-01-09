'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence, useSpring, useTransform } from 'framer-motion';
import { FiUser, FiMail, FiPhone, FiLock, FiCalendar, FiClock, FiCheckCircle, FiUpload, FiX, FiSun, FiMoon, FiEye, FiEyeOff, FiEdit2 } from 'react-icons/fi';

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-500">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="text-center"
        >
          <motion.div 
            className="relative mx-auto w-20 h-20"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <div className="absolute inset-0 rounded-full border-4 border-blue-200 dark:border-blue-900/30"></div>
            <div className="absolute inset-0 rounded-full border-t-4 border-r-4 border-blue-600 dark:border-blue-400"></div>
          </motion.div>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-gray-600 dark:text-gray-300 font-medium text-lg"
          >
            Loading your profile...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 sm:py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-500">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-5xl mx-auto"
      >
        <motion.div 
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden border border-white/20 dark:border-gray-700/50 hover:shadow-3xl transition-all duration-500"
        >
          {/* Header */}
          <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 dark:from-indigo-900 dark:via-purple-900 dark:to-blue-900 px-6 py-10 sm:py-12 text-center relative overflow-hidden">
            {/* Animated Background Elements */}
            <motion.div 
              className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"
              animate={{ 
                scale: [1, 1.3, 1],
                x: [0, 30, 0],
                y: [0, 20, 0]
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div 
              className="absolute bottom-0 left-0 w-72 h-72 bg-indigo-400/20 dark:bg-purple-400/20 rounded-full blur-3xl"
              animate={{ 
                scale: [1.2, 1, 1.2],
                y: [0, -30, 0],
                x: [0, -20, 0]
              }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div 
              className="absolute top-1/2 left-1/2 w-96 h-96 bg-purple-300/10 dark:bg-blue-400/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"
              animate={{ 
                scale: [1, 1.4, 1],
                rotate: [0, 180, 360]
              }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            />
            
            <div className="relative z-10">
              <motion.div 
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 15 }}
                className="mx-auto h-36 w-36 sm:h-40 sm:w-40 rounded-full bg-gradient-to-br from-white/30 to-white/10 dark:from-gray-700/40 dark:to-gray-800/30 p-1.5 mb-6 relative group backdrop-blur-sm"
              >
                <motion.div 
                  className="relative h-full w-full rounded-full overflow-hidden ring-4 ring-white/20 dark:ring-gray-700/30"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  {previewImage || session.user.image ? (
                    <>
                      <Image
                        src={previewImage || session.user.image || '/images/default-avatar.png'}
                        alt="Profile"
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                        sizes="(max-width: 160px) 100vw, 160px"
                      />
                      <motion.button 
                        onClick={removeImage}
                        className="absolute top-2 right-2 bg-red-500/90 backdrop-blur-sm text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg hover:bg-red-600"
                        aria-label="Remove image"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <FiX size={18} />
                      </motion.button>
                    </>
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600 dark:from-indigo-600 dark:via-purple-600 dark:to-blue-700 flex items-center justify-center text-5xl font-bold text-white shadow-inner">
                      {session?.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                  )}
                </motion.div>
                
                <motion.label 
                  htmlFor="profile-picture" 
                  className="absolute -bottom-1 right-2 bg-white dark:bg-gray-700 p-3 rounded-full shadow-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-300 border-2 border-blue-500/50 dark:border-blue-400/50 group/upload"
                  title="Change profile picture"
                  whileHover={{ scale: 1.1, rotate: 15 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FiUpload className="text-blue-600 dark:text-blue-400 transition-transform duration-300 group-hover/upload:scale-110" size={20} />
                  <input
                    id="profile-picture"
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </motion.label>
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="text-3xl sm:text-4xl font-bold text-white mb-2 drop-shadow-lg"
              >
                {session.user.name || 'User'}
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="text-blue-100 dark:text-blue-200 text-lg mb-6"
              >
                {session.user.email}
              </motion.p>
              
              {/* Stats */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="flex justify-center mt-6 space-x-8 sm:space-x-12"
              >
                {[
                  { value: stats.totalBookings, label: 'Bookings' },
                  { value: stats.completedBookings, label: 'Completed' },
                  { value: new Date(stats.memberSince).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }), label: 'Member Since' }
                ].map((stat, index) => (
                  <motion.div 
                    key={index}
                    className="text-center"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    whileHover={{ scale: 1.1 }}
                  >
                    <div className="text-2xl sm:text-3xl font-bold text-white drop-shadow-md">{stat.value}</div>
                    <div className="text-xs sm:text-sm text-blue-100 dark:text-blue-200 mt-1 font-medium">{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="border-b border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
            <nav className="flex -mb-px relative">
              {tabs.map((tab, index) => {
                const isActive = activeTab === tab.id;
                return (
                  <motion.button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative py-4 px-6 sm:px-8 text-center font-semibold text-sm sm:text-base transition-all duration-300 ${
                      isActive
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="relative z-10">{tab.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-t-full"
                        initial={false}
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </motion.button>
                );
              })}
            </nav>
          </div>
          
          {/* Tab Content */}
          <div className="p-6 sm:p-8 lg:p-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.98 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                {activeTab === 'profile' ? (
                  <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1, duration: 0.4 }}
                  className="col-span-2 sm:col-span-1"
                >
                  <label htmlFor="name" className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1">
                    <FiUser className="text-blue-500" size={16} />
                    Full Name
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="relative group">
                    <motion.div 
                      className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"
                      whileHover={{ scale: 1.1 }}
                    >
                      <FiUser className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-300" />
                    </motion.div>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="block w-full pl-12 pr-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 dark:bg-gray-700/50 dark:text-white transition-all duration-300 hover:border-blue-300 dark:hover:border-gray-600"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15, duration: 0.4 }}
                  className="col-span-2 sm:col-span-1"
                >
                  <label htmlFor="email" className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1">
                    <FiMail className="text-blue-500" size={16} />
                    Email Address
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="relative group">
                    <motion.div 
                      className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"
                      whileHover={{ scale: 1.1 }}
                    >
                      <FiMail className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-300" />
                    </motion.div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="block w-full pl-12 pr-24 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300 bg-gray-50 dark:bg-gray-700/50 dark:text-gray-300"
                      placeholder="you@example.com"
                      required
                      disabled
                    />
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                      <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Read-only</span>
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                  className="col-span-2"
                >
                  <label htmlFor="phone" className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1">
                    <FiPhone className="text-blue-500" size={16} />
                    Phone Number
                  </label>
                  <div className="relative group">
                    <motion.div 
                      className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"
                      whileHover={{ scale: 1.1 }}
                    >
                      <FiPhone className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-300" />
                    </motion.div>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      className="block w-full pl-12 pr-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 dark:bg-gray-700/50 dark:text-white transition-all duration-300 hover:border-blue-300 dark:hover:border-gray-600"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </motion.div>
              </div>

                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-col sm:flex-row justify-between items-center pt-8 border-t-2 border-gray-100 dark:border-gray-700/50"
                  >
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-4 sm:mb-0 flex items-center gap-2">
                      <FiClock className="text-gray-400" size={14} />
                      <span>Last updated: {new Date().toLocaleDateString()}</span>
                    </div>
                    <div className="flex space-x-3 w-full sm:w-auto">
                      <motion.button
                        type="button"
                        onClick={() => router.back()}
                        whileHover={{ scale: 1.05, x: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-6 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-all duration-300 shadow-sm hover:shadow-md"
                      >
                        Cancel
                      </motion.button>
                      <motion.button
                        type="submit"
                        disabled={isLoading}
                        whileHover={isLoading ? {} : { scale: 1.05, y: -2 }}
                        whileTap={isLoading ? {} : { scale: 0.95 }}
                        className={`inline-flex items-center px-6 py-3 border border-transparent text-sm font-semibold rounded-xl shadow-lg text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 hover:shadow-xl ${
                          isLoading ? 'opacity-70 cursor-not-allowed' : ''
                        }`}
                      >
                        {isLoading ? (
                          <>
                            <motion.svg 
                              className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" 
                              xmlns="http://www.w3.org/2000/svg" 
                              fill="none" 
                              viewBox="0 0 24 24"
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            >
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </motion.svg>
                            Saving...
                          </>
                        ) : (
                          <>
                            <FiCheckCircle className="mr-2" size={18} />
                            Save Changes
                          </>
                        )}
                      </motion.button>
                    </div>
                  </motion.div>
                  </form>
                ) : activeTab === 'security' ? (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4 }}
                      className="bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 border-l-4 border-yellow-400 dark:border-yellow-500 p-5 rounded-r-xl mb-8 shadow-sm"
                    >
                      <div className="flex items-start">
                        <motion.div 
                          className="flex-shrink-0"
                          animate={{ rotate: [0, 10, -10, 0] }}
                          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                        >
                          <svg className="h-6 w-6 text-yellow-500 dark:text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </motion.div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                            For security reasons, please enter your current password to make changes.
                          </p>
                        </div>
                      </div>
                    </motion.div>

                    <div className="space-y-6">
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                      >
                        <label htmlFor="currentPassword" className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1">
                          <FiLock className="text-blue-500" size={16} />
                          Current Password
                        </label>
                        <div className="relative group">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <FiLock className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-300" />
                          </div>
                          <input
                            id="currentPassword"
                            name="currentPassword"
                            type={showCurrentPassword ? "text" : "password"}
                            value={formData.currentPassword}
                            onChange={handleChange}
                            className="block w-full pl-12 pr-12 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 dark:bg-gray-700/50 dark:text-white transition-all duration-300 hover:border-blue-300 dark:hover:border-gray-600"
                            placeholder="••••••••"
                            required
                          />
                          <motion.button
                            type="button"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            className="absolute inset-y-0 right-0 flex items-center justify-center w-12 h-full text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100 z-10 cursor-pointer transition-colors duration-300"
                            aria-label={showCurrentPassword ? "Hide password" : "Show password"}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            {showCurrentPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
                          </motion.button>
                        </div>
                      </motion.div>

                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.15 }}
                        >
                          <label htmlFor="newPassword" className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1">
                            <FiLock className="text-blue-500" size={16} />
                            New Password
                          </label>
                          <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                              <FiLock className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-300" />
                            </div>
                            <input
                              id="newPassword"
                              name="newPassword"
                              type={showNewPassword ? "text" : "password"}
                              value={formData.newPassword}
                              onChange={handleChange}
                              className="block w-full pl-12 pr-12 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 dark:bg-gray-700/50 dark:text-white transition-all duration-300 hover:border-blue-300 dark:hover:border-gray-600"
                              placeholder="••••••••"
                            />
                            <motion.button
                              type="button"
                              onClick={() => setShowNewPassword(!showNewPassword)}
                              className="absolute inset-y-0 right-0 flex items-center justify-center w-12 h-full text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100 z-10 transition-colors duration-300"
                              aria-label={showNewPassword ? "Hide password" : "Show password"}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              {showNewPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
                            </motion.button>
                          </div>
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          <label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1">
                            <FiCheckCircle className="text-blue-500" size={16} />
                            Confirm New Password
                          </label>
                          <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                              <FiCheckCircle className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-300" />
                            </div>
                            <input
                              id="confirmPassword"
                              name="confirmPassword"
                              type={showConfirmPassword ? "text" : "password"}
                              value={formData.confirmPassword}
                              onChange={handleChange}
                              className="block w-full pl-12 pr-12 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 dark:bg-gray-700/50 dark:text-white transition-all duration-300 hover:border-blue-300 dark:hover:border-gray-600"
                              placeholder="••••••••"
                            />
                            <motion.button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute inset-y-0 right-0 flex items-center justify-center w-12 h-full text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100 z-10 transition-colors duration-300"
                              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              {showConfirmPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
                            </motion.button>
                          </div>
                        </motion.div>
                      </div>
                    </div>

                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="pt-6 flex justify-end border-t-2 border-gray-100 dark:border-gray-700/50"
                    >
                      <motion.button
                        type="submit"
                        disabled={isLoading}
                        whileHover={isLoading ? {} : { scale: 1.05, y: -2 }}
                        whileTap={isLoading ? {} : { scale: 0.95 }}
                        className={`inline-flex items-center px-6 py-3 border border-transparent text-sm font-semibold rounded-xl shadow-lg text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 hover:shadow-xl ${
                          isLoading ? 'opacity-70 cursor-not-allowed' : ''
                        }`}
                      >
                        {isLoading ? (
                          <>
                            <motion.svg 
                              className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" 
                              xmlns="http://www.w3.org/2000/svg" 
                              fill="none" 
                              viewBox="0 0 24 24"
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            >
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </motion.svg>
                            Updating...
                          </>
                        ) : (
                          <>
                            <FiLock className="mr-2" size={18} />
                            Update Password
                          </>
                        )}
                      </motion.button>
                    </motion.div>
                  </form>
                ) : (
                  <div className="space-y-8">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                    >
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                        <FiSun className="text-blue-500" />
                        Appearance
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Customize how the app looks and feels.
                      </p>
                    </motion.div>

                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1, duration: 0.4 }}
                      className="bg-gray-50 dark:bg-gray-700/30 rounded-2xl p-6 border-2 border-gray-100 dark:border-gray-700/50"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-1">Theme</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {isDarkMode ? 'Dark mode is enabled' : 'Light mode is enabled'}
                          </p>
                        </div>
                        <motion.button
                          type="button"
                          onClick={toggleDarkMode}
                          className={`relative inline-flex h-7 w-14 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-lg ${
                            isDarkMode ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : 'bg-gray-300'
                          }`}
                          role="switch"
                          aria-checked={isDarkMode}
                          whileTap={{ scale: 0.95 }}
                        >
                          <span className="sr-only">Toggle dark mode</span>
                          <motion.span
                            className="pointer-events-none relative inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0"
                            animate={{
                              x: isDarkMode ? 28 : 2,
                            }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          >
                            <span
                              className={`absolute inset-0 flex h-full w-full items-center justify-center transition-opacity duration-300 ${
                                isDarkMode ? 'opacity-0' : 'opacity-100'
                              }`}
                              aria-hidden="true"
                            >
                              <FiSun className="h-3.5 w-3.5 text-yellow-500" />
                            </span>
                            <span
                              className={`absolute inset-0 flex h-full w-full items-center justify-center transition-opacity duration-300 ${
                                isDarkMode ? 'opacity-100' : 'opacity-0'
                              }`}
                              aria-hidden="true"
                            >
                              <FiMoon className="h-3.5 w-3.5 text-blue-600" />
                            </span>
                          </motion.span>
                        </motion.button>
                      </div>
                    </motion.div>

                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.4 }}
                      className="pt-8 border-t-2 border-gray-100 dark:border-gray-700/50"
                    >
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                        <FiMail className="text-blue-500" />
                        Notifications
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                        Manage how you receive notifications.
                      </p>
                      
                      <div className="space-y-5">
                        <motion.div 
                          className="flex items-start p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl border-2 border-gray-100 dark:border-gray-700/50 hover:border-blue-200 dark:hover:border-blue-700/50 transition-all duration-300"
                          whileHover={{ scale: 1.02, x: 4 }}
                        >
                          <div className="flex items-center h-5 pt-0.5">
                            <input
                              id="email-notifications"
                              name="email-notifications"
                              type="checkbox"
                              className="h-5 w-5 rounded border-2 border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer transition-all duration-300"
                              defaultChecked
                            />
                          </div>
                          <div className="ml-4 flex-1">
                            <label htmlFor="email-notifications" className="font-semibold text-gray-700 dark:text-gray-300 cursor-pointer">
                              Email notifications
                            </label>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Get notified about your account activity.</p>
                          </div>
                        </motion.div>

                        <motion.div 
                          className="flex items-start p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl border-2 border-gray-100 dark:border-gray-700/50 hover:border-blue-200 dark:hover:border-blue-700/50 transition-all duration-300"
                          whileHover={{ scale: 1.02, x: 4 }}
                        >
                          <div className="flex items-center h-5 pt-0.5">
                            <input
                              id="sms-notifications"
                              name="sms-notifications"
                              type="checkbox"
                              className="h-5 w-5 rounded border-2 border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer transition-all duration-300"
                              defaultChecked
                            />
                          </div>
                          <div className="ml-4 flex-1">
                            <label htmlFor="sms-notifications" className="font-semibold text-gray-700 dark:text-gray-300 cursor-pointer">
                              SMS notifications
                            </label>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Get text messages about important updates.</p>
                          </div>
                        </motion.div>
                      </div>
                    </motion.div>

                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="pt-8 border-t-2 border-gray-100 dark:border-gray-700/50 flex justify-end"
                    >
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-semibold rounded-xl shadow-lg text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 hover:shadow-xl"
                      >
                        <FiCheckCircle className="mr-2" size={18} />
                        Save Preferences
                      </motion.button>
                    </motion.div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
          
          {/* Footer */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-r from-gray-50/80 via-blue-50/80 to-purple-50/80 dark:from-gray-800/80 dark:via-gray-800/80 dark:to-gray-900/80 backdrop-blur-sm px-6 py-5 border-t-2 border-gray-200/50 dark:border-gray-700/50"
          >
            <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <motion.div 
                className="mb-2 sm:mb-0 font-medium"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                &copy; {new Date().getFullYear()} CarWash Pro. All rights reserved.
              </motion.div>
              <motion.div 
                className="flex space-x-6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                {['Privacy', 'Terms', 'Help'].map((link, index) => (
                  <motion.a
                    key={link}
                    href={`/${link.toLowerCase()}`}
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-300 font-medium hover:underline"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {link}
                  </motion.a>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
