import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { Bell, Check, X, AlertCircle, CheckCircle, Info, AlertTriangle, Loader2, Sparkles, ChevronRight, Trash2 } from 'lucide-react';
import { useNotifications } from '@/context/NotificationContext';
import { motion, AnimatePresence } from 'framer-motion';
// Simple time formatter without external dependencies
const formatTimeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks}w ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
};

export const NotificationDropdown = ({ isMobile = false }) => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, isLoading, refreshNotifications } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const [markingRead, setMarkingRead] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  const [hoveredNotification, setHoveredNotification] = useState(null);
  const dropdownRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setMounted(true);
    }
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    function handleEscape(event) {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
      if (isMobile) {
        document.body.style.overflow = 'hidden';
      }
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
      if (isMobile) {
        document.body.style.overflow = 'unset';
      }
    };
  }, [isOpen, isMobile]);

  const getNotificationIcon = (type) => {
    const iconClass = "w-5 h-5";
    switch (type) {
      case 'success':
        return <CheckCircle className={`${iconClass} text-emerald-600`} strokeWidth={2.5} />;
      case 'error':
        return <AlertCircle className={`${iconClass} text-rose-600`} strokeWidth={2.5} />;
      case 'warning':
        return <AlertTriangle className={`${iconClass} text-amber-600`} strokeWidth={2.5} />;
      default:
        return <Info className={`${iconClass} text-blue-600`} strokeWidth={2.5} />;
    }
  };

  const handleNotificationClick = async (notification) => {
    if (!notification.read) {
      await handleMarkAsRead(notification.id);
    }
    setIsOpen(false);
    if (notification.link) {
      router.push(notification.link);
    } else if (notification.bookingId) {
      router.push('/my-bookings');
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    if (markingRead === notificationId) return;
    setMarkingRead(notificationId);
    try {
      await markAsRead(notificationId);
      setTimeout(() => refreshNotifications(), 500);
    } catch (error) {
      console.error('Error marking as read:', error);
    } finally {
      setMarkingRead(null);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      setTimeout(() => refreshNotifications(), 500);
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  return (
    <div className={`${isMobile ? 'relative z-50' : 'relative'}`} ref={dropdownRef}>
      {/* Notification Bell Button */}
      <motion.button
        onClick={(e) => {
          e.stopPropagation();
          const newIsOpen = !isOpen;
          setIsOpen(newIsOpen);
          if (newIsOpen && !hasFetched) {
            setHasFetched(true);
            refreshNotifications();
          }
        }}
        whileTap={{ scale: 0.92 }}
        whileHover={{ scale: 1.05 }}
        className={`relative group ${
          isMobile 
            ? 'p-2.5 rounded-xl bg-white/90 backdrop-blur-sm hover:bg-white active:bg-gray-50 transition-all duration-300 shadow-md hover:shadow-lg border border-gray-200' 
            : 'p-3 text-gray-700 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-2xl transition-all duration-300 hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 hover:shadow-lg'
        }`}
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
        aria-expanded={isOpen}
      >
        <div className="relative flex items-center justify-center">
          <motion.div
            animate={isOpen ? { rotate: [0, -12, 12, -8, 8, 0] } : unreadCount > 0 ? { rotate: [0, -10, 10, -10, 10, 0] } : {}}
            transition={{ 
              duration: isOpen ? 0.6 : 1.5, 
              repeat: isOpen ? 0 : Infinity, 
              repeatDelay: 5 
            }}
          >
            <Bell className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6'} transition-all duration-300 ${
              unreadCount > 0 
                ? 'text-blue-600 group-hover:text-blue-700 drop-shadow-md' 
                : 'text-gray-600 group-hover:text-gray-700'
            }`} strokeWidth={2.2} />
          </motion.div>
          
          {/* Animated Badge */}
          {unreadCount > 0 && (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 25 }}
              className={`absolute ${isMobile ? '-top-1 -right-1' : '-top-1.5 -right-1.5'}`}
            >
              <motion.span
                animate={{ 
                  scale: [1, 1.1, 1],
                  boxShadow: [
                    '0 2px 8px rgba(239, 68, 68, 0.4), 0 0 0 2px white',
                    '0 4px 12px rgba(239, 68, 68, 0.6), 0 0 0 2px white',
                    '0 2px 8px rgba(239, 68, 68, 0.4), 0 0 0 2px white'
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className={`${isMobile ? 'min-w-[18px] h-[18px] px-1 text-[9px]' : 'min-w-[22px] h-[22px] px-1.5 text-[10px]'} flex items-center justify-center font-black text-white bg-gradient-to-br from-rose-500 via-red-600 to-rose-700 rounded-full border-2 border-white`}
              >
                {unreadCount > 99 ? '99+' : unreadCount}
              </motion.span>
            </motion.div>
          )}
        </div>
      </motion.button>

      {/* Dropdown */}
      <AnimatePresence mode="wait">
        {isOpen && (
          <>
            {isMobile && mounted && typeof document !== 'undefined' ? (
              createPortal(
                <>
                  {/* Mobile Overlay */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                    className="fixed inset-0 bg-black/50 backdrop-blur-md z-[100]"
                    onClick={() => setIsOpen(false)}
                  />

                  {/* Mobile Bottom Sheet */}
                  <motion.div
                    initial={{ opacity: 0, y: '100%', scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: '100%', scale: 0.98 }}
                    transition={{ 
                      type: "spring",
                      damping: 30,
                      stiffness: 400,
                      mass: 0.8
                    }}
                    className="fixed inset-x-0 bottom-0 bg-white shadow-2xl z-[101] flex flex-col overflow-hidden rounded-t-3xl"
                    style={{ 
                      maxHeight: '92vh',
                      boxShadow: '0 -10px 40px rgba(0, 0, 0, 0.2)',
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Drag Handle */}
                    <div className="flex justify-center pt-3 pb-2 bg-gradient-to-b from-gray-50 to-white">
                      <motion.div 
                        className="w-12 h-1.5 bg-gray-300 rounded-full"
                        whileTap={{ scale: 1.1 }}
                      />
                    </div>
                    {renderDropdownContent()}
                  </motion.div>
                </>,
                document.body
              )
            ) : (
              !isMobile && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.96 }}
                  transition={{ 
                    type: "spring",
                    damping: 28,
                    stiffness: 350,
                    mass: 0.6
                  }}
                  className="absolute right-0 mt-3 w-[440px] bg-white rounded-3xl shadow-2xl overflow-hidden z-50 border border-gray-100 backdrop-blur-xl"
                  style={{ 
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05)'
                  }}
                >
                  {renderDropdownContent()}
                </motion.div>
              )
            )}
          </>
        )}
      </AnimatePresence>
    </div>
  );

  function renderDropdownContent() {
    return (
      <>
        {/* Header */}
        <div className={`relative ${isMobile ? 'pt-3 pb-4 px-4' : 'p-6'} bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 overflow-hidden flex-shrink-0`}>
          {/* Animated Background */}
          <div className="absolute inset-0">
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 90, 0]
              }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"
            />
            <motion.div
              animate={{ 
                scale: [1, 1.3, 1],
                rotate: [0, -90, 0]
              }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -ml-24 -mb-24"
            />
          </div>

          <div className="relative flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <motion.div 
                className={`${isMobile ? 'w-12 h-12' : 'w-14 h-14'} rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-xl border border-white/30 flex-shrink-0`}
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <Bell className={`${isMobile ? 'w-6 h-6' : 'w-7 h-7'} text-white`} strokeWidth={2.5} />
              </motion.div>
              <div className="flex-1 min-w-0">
                <h3 className={`font-black text-white ${isMobile ? 'text-lg' : 'text-xl'} flex items-center gap-2 truncate`}>
                  <span className="truncate">Notifications</span>
                  {unreadCount > 0 && (
                    <motion.div
                      animate={{ 
                        rotate: [0, 15, -15, 15, 0],
                        scale: [1, 1.2, 1, 1.2, 1]
                      }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                    >
                      <Sparkles className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} text-yellow-300`} />
                    </motion.div>
                  )}
                </h3>
                <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-blue-100 mt-0.5 font-medium truncate`}>
                  {unreadCount > 0 ? `${unreadCount} new ${unreadCount === 1 ? 'update' : 'updates'}` : 'All caught up! ✨'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {unreadCount > 0 && (
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMarkAllAsRead();
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`${isMobile ? 'text-xs px-3 py-1.5' : 'text-sm px-4 py-2'} text-white bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl font-bold transition-all duration-200 whitespace-nowrap border border-white/30`}
                >
                  {isMobile ? 'Clear all' : 'Mark all read'}
                </motion.button>
              )}
              <motion.button
                onClick={() => setIsOpen(false)}
                whileHover={{ scale: 1.05, rotate: 90 }}
                whileTap={{ scale: 0.95 }}
                className={`${isMobile ? 'p-2' : 'p-2.5'} text-white bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl transition-all duration-200 flex-shrink-0 border border-white/30`}
                aria-label="Close notifications"
              >
                <X className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'}`} strokeWidth={2.5} />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className={`flex-1 overflow-y-auto overscroll-contain ${isMobile ? 'pb-3 max-h-[calc(92vh-180px)]' : 'max-h-[500px]'} bg-gradient-to-b from-gray-50 to-white`} style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#cbd5e1 #f1f5f9'
        }}>
          {isLoading ? (
            <div className={`${isMobile ? 'p-12' : 'p-16'} text-center`}>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Loader2 className={`${isMobile ? 'w-10 h-10' : 'w-12 h-12'} text-blue-600 mx-auto mb-4`} />
              </motion.div>
              <p className={`${isMobile ? 'text-sm' : 'text-base'} text-gray-500 font-semibold`}>Loading notifications...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className={`${isMobile ? 'p-12' : 'p-16'} text-center`}>
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className={`${isMobile ? 'w-20 h-20' : 'w-24 h-24'} rounded-3xl bg-gradient-to-br from-blue-100 via-indigo-100 to-violet-100 flex items-center justify-center mx-auto mb-5 shadow-lg`}
              >
                <Bell className={`${isMobile ? 'w-10 h-10' : 'w-12 h-12'} text-blue-600`} strokeWidth={2} />
              </motion.div>
              <p className={`${isMobile ? 'text-base' : 'text-lg'} font-bold text-gray-800 mb-2`}>No notifications yet</p>
              <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-500 max-w-xs mx-auto leading-relaxed`}>You will see updates here when you have new notifications</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {notifications.map((notification, index) => (
                <motion.li
                  key={notification.id}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ 
                    delay: index * 0.06,
                    type: "spring",
                    stiffness: 300,
                    damping: 25
                  }}
                  onMouseEnter={() => setHoveredNotification(notification.id)}
                  onMouseLeave={() => setHoveredNotification(null)}
                  onClick={() => handleNotificationClick(notification)}
                  className={`group ${isMobile ? 'p-4' : 'p-5'} cursor-pointer transition-all duration-300 relative overflow-hidden ${
                    !notification.read 
                      ? 'bg-gradient-to-r from-blue-50 via-indigo-50 to-transparent hover:from-blue-100 hover:via-indigo-100' 
                      : 'bg-white hover:bg-gray-50'
                  }`}
                >
                  {/* Hover Effect Background */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-blue-100 to-indigo-100 opacity-0"
                    animate={{ opacity: hoveredNotification === notification.id ? 0.3 : 0 }}
                    transition={{ duration: 0.3 }}
                  />

                  {/* Unread Indicator */}
                  {!notification.read && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 via-indigo-500 to-violet-500" />
                  )}

                  <div className="flex items-start gap-3 relative z-10">
                    {/* Icon */}
                    <motion.div 
                      className={`flex-shrink-0 mt-0.5`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <div className={`${isMobile ? 'w-11 h-11' : 'w-12 h-12'} rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 ${
                        notification.type === 'success' ? 'bg-gradient-to-br from-emerald-100 to-emerald-200 group-hover:shadow-emerald-200' :
                        notification.type === 'error' ? 'bg-gradient-to-br from-rose-100 to-rose-200 group-hover:shadow-rose-200' :
                        notification.type === 'warning' ? 'bg-gradient-to-br from-amber-100 to-amber-200 group-hover:shadow-amber-200' :
                        'bg-gradient-to-br from-blue-100 to-blue-200 group-hover:shadow-blue-200'
                      }`}>
                        {getNotificationIcon(notification.type)}
                      </div>
                    </motion.div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <p className={`${isMobile ? 'text-sm' : 'text-base'} font-bold leading-tight ${
                          !notification.read ? 'text-gray-900' : 'text-gray-700'
                        } group-hover:text-blue-700 transition-colors duration-200`}>
                          {notification.title}
                        </p>
                        {!notification.read && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className={`flex-shrink-0 ${isMobile ? 'w-2.5 h-2.5' : 'w-3 h-3'} bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full shadow-lg shadow-blue-500/50`}
                          >
                            <motion.div
                              animate={{ scale: [1, 1.3, 1] }}
                              transition={{ duration: 2, repeat: Infinity }}
                              className="w-full h-full rounded-full bg-blue-400 opacity-50"
                            />
                          </motion.span>
                        )}
                      </div>
                      
                      <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-600 mt-1 leading-relaxed line-clamp-2`}>
                        {notification.message}
                      </p>
                      
                      <div className={`flex items-center ${isMobile ? 'flex-wrap gap-2' : 'justify-between'} mt-3`}>
                        <span className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-500 flex items-center gap-1.5 font-medium`}>
                          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                          {formatTimeAgo(notification.timestamp)}
                        </span>
                        
                        {!notification.read ? (
                          <motion.button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMarkAsRead(notification.id);
                            }}
                            disabled={markingRead === notification.id}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`${isMobile ? 'text-xs px-3 py-1.5' : 'text-sm px-4 py-2'} text-blue-600 hover:text-white bg-blue-100 hover:bg-gradient-to-r hover:from-blue-600 hover:to-indigo-600 rounded-xl transition-all duration-300 font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 shadow-sm hover:shadow-md`}
                            aria-label="Mark as read"
                          >
                            {markingRead === notification.id ? (
                              <>
                                <Loader2 className={`${isMobile ? 'w-3.5 h-3.5' : 'w-4 h-4'} animate-spin`} />
                                <span>Marking...</span>
                              </>
                            ) : (
                              <>
                                <Check className={`${isMobile ? 'w-3.5 h-3.5' : 'w-4 h-4'}`} strokeWidth={2.5} />
                                <span>Mark read</span>
                              </>
                            )}
                          </motion.button>
                        ) : (
                          <span className={`${isMobile ? 'text-xs px-3 py-1.5' : 'text-sm px-4 py-2'} text-emerald-700 bg-emerald-50 rounded-xl flex items-center justify-center gap-1.5 font-semibold`}>
                            <CheckCircle className={`${isMobile ? 'w-3.5 h-3.5' : 'w-4 h-4'}`} strokeWidth={2.5} />
                            <span>Read</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Hover Arrow */}
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: hoveredNotification === notification.id ? 1 : 0, x: hoveredNotification === notification.id ? 0 : -10 }}
                      className="flex-shrink-0 self-center"
                    >
                      <ChevronRight className="w-5 h-5 text-blue-600" strokeWidth={2.5} />
                    </motion.div>
                  </div>
                </motion.li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <motion.div 
            className={`${isMobile ? 'p-4' : 'p-5'} border-t border-gray-200 bg-gradient-to-br from-gray-50 to-white flex-shrink-0`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <motion.button
              onClick={() => {
                router.push('/my-bookings');
                setIsOpen(false);
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full flex items-center justify-center gap-2 ${isMobile ? 'px-5 py-3.5 text-sm' : 'px-6 py-4 text-base'} font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-700 hover:via-indigo-700 hover:to-violet-700 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl group`}
            >
              <span>View All Bookings</span>
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ChevronRight className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6'}`} strokeWidth={2.5} />
              </motion.span>
            </motion.button>
          </motion.div>
        )}
      </>
    );
  }
};

export default NotificationDropdown;