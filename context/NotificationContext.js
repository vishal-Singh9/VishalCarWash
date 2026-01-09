import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'react-toastify';
import { API_ENDPOINTS } from '@/lib/api-config';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [ws, setWs] = useState(null);
  const { data: session } = useSession();
  const userId = session?.user?.id;

  // Fetch notifications from API
  const fetchNotifications = useCallback(async () => {
    if (!userId) return;

    try {
      setIsLoading(true);
      const response = await fetch(`/api/notifications?limit=50`);
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Transform API notifications to match component format
          const transformedNotifications = data.notifications.map(notif => ({
            id: notif._id?.toString() || notif.id?.toString() || String(notif._id) || String(notif.id),
            title: notif.title,
            message: notif.message,
            type: notif.type || 'info',
            read: notif.read || false,
            link: notif.link || null,
            bookingId: notif.bookingId?._id?.toString() || notif.bookingId?.toString() || notif.bookingId || null,
            timestamp: notif.createdAt || notif.timestamp || new Date().toISOString(),
            ...notif
          }));
          
          setNotifications(transformedNotifications);
          setUnreadCount(data.unreadCount || 0);
          
          // Also save to localStorage as backup
          localStorage.setItem('notifications', JSON.stringify(transformedNotifications));
        }
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      // Fallback to localStorage if API fails
      const savedNotifications = localStorage.getItem('notifications');
      if (savedNotifications) {
        try {
          const parsed = JSON.parse(savedNotifications);
          setNotifications(parsed);
          setUnreadCount(parsed.filter(n => !n.read).length);
        } catch (e) {
          console.error('Error parsing saved notifications:', e);
        }
      }
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  // Only fetch unread count on mount, not all notifications
  useEffect(() => {
    if (userId) {
      // Only fetch unread count, not all notifications
      const fetchUnreadCount = async () => {
        try {
          const response = await fetch(`/api/notifications?limit=1&unreadOnly=true`);
          if (response.ok) {
            const data = await response.json();
            if (data.success) {
              setUnreadCount(data.unreadCount || 0);
            }
          }
        } catch (error) {
          console.error('Error fetching unread count:', error);
        }
      };
      
      fetchUnreadCount();
      
      // Listen for booking creation events - only refresh when needed
      const handleBookingCreated = (event) => {
        console.log('Booking created event received:', event.detail);
        // Only update unread count, don't fetch all notifications
        setUnreadCount(prev => prev + 1);
      };
      
      // Listen for manual refresh events
      const handleRefreshNotifications = () => {
        console.log('Manual notification refresh triggered');
        fetchNotifications();
      };
      
      window.addEventListener('bookingCreated', handleBookingCreated);
      window.addEventListener('refreshNotifications', handleRefreshNotifications);
      
      return () => {
        window.removeEventListener('bookingCreated', handleBookingCreated);
        window.removeEventListener('refreshNotifications', handleRefreshNotifications);
      };
    } else {
      // Clear notifications when user logs out
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [userId, fetchNotifications]);

  // Initialize WebSocket connection when user is authenticated
  useEffect(() => {
    if (!userId) return undefined;

    // Create a secure WebSocket connection
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws/notifications?userId=${userId}`;
    let socket;
    let reconnectTimeout;

    const connect = () => {
      // Close any existing connection
      if (socket) {
        socket.close();
      }

      socket = new WebSocket(wsUrl);

      socket.onopen = () => {
        console.log('WebSocket connected');
        // Clear any reconnect timeout when connection is established
        if (reconnectTimeout) {
          clearTimeout(reconnectTimeout);
          reconnectTimeout = null;
        }
      };

      socket.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          
          if (message.type === 'notification') {
            const newNotification = {
              id: Date.now(),
              title: message.data.title || 'New Notification',
              message: message.data.message,
              type: message.data.type || 'info',
              read: false,
              timestamp: new Date().toISOString(),
              ...message.data
            };

            setNotifications(prev => [newNotification, ...prev]);
            setUnreadCount(prev => prev + 1);
            
            // Show toast for new notifications
            toast[newNotification.type === 'success' ? 'success' : 'info'](
              newNotification.message,
              { autoClose: 5000 }
            );
          }
        } catch (error) {
          console.error('Error processing WebSocket message:', error);
        }
      };

      socket.onclose = () => {
        console.log('WebSocket disconnected. Attempting to reconnect...');
        // Attempt to reconnect after a delay, but only if we're not already reconnecting
        if (!reconnectTimeout) {
          reconnectTimeout = setTimeout(connect, 3000);
        }
      };

      socket.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      setWs(socket);
    };

    // Initial connection
    connect();

    // Clean up on unmount
    return () => {
      if (socket) {
        socket.close();
      }
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
      }
    };
  }, [userId]);

  const markAsRead = useCallback(async (notificationId) => {
    if (!notificationId) {
      console.error('No notification ID provided');
      return;
    }

    // Convert to string if needed
    const idString = String(notificationId);

    // Optimistically update UI - mark as read but keep in list
    setNotifications(prev => {
      const updated = prev.map(notif => {
        const notifId = String(notif.id || notif._id);
        return notifId === idString ? { ...notif, read: true } : notif;
      });
      setUnreadCount(updated.filter(n => !n.read).length);
      return updated;
    });

    // Update on server
    try {
      const response = await fetch(`/api/notifications`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ notificationId: idString }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to mark notification as read');
      }

      // Refresh notifications after a short delay to ensure sync
      setTimeout(() => {
        fetchNotifications();
      }, 300);
    } catch (error) {
      console.error('Error marking notification as read:', error);
      // Revert on error by refreshing the notifications
      fetchNotifications();
    }
  }, [fetchNotifications]);

  const markAllAsRead = useCallback(async () => {
    // Optimistically update UI
    setNotifications(prev => 
      prev.map(notif => ({
        ...notif,
        read: true
      }))
    );
    setUnreadCount(0);

    // Update on server
    try {
      const response = await fetch(`${API_ENDPOINTS.notifications}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ markAllAsRead: true }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to mark all notifications as read');
      }

      // Refresh notifications after a short delay
      setTimeout(() => {
        fetchNotifications();
      }, 300);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      // Revert on error
      fetchNotifications();
    }
  }, [fetchNotifications]);

  const addNotification = useCallback((notification) => {
    const newNotification = {
      id: Date.now(),
      title: notification.title || 'New Notification',
      message: notification.message,
      type: notification.type || 'info',
      read: false,
      timestamp: new Date().toISOString(),
      ...notification
    };

    setNotifications(prev => [newNotification, ...prev]);
    setUnreadCount(prev => prev + 1);

    // Show toast for the new notification
    toast[newNotification.type === 'success' ? 'success' : 'info'](
      newNotification.message,
      { autoClose: 5000 }
    );

    return newNotification;
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
    localStorage.removeItem('notifications');
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        isLoading,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearNotifications,
        refreshNotifications: fetchNotifications
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
