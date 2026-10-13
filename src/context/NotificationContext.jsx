import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { io } from 'socket.io-client';
import api from '../utils/api';
import { showToast } from '../utils/toast';

const NotificationContext = createContext(null);

// Web Audio API chime generator (zero external assets, instant & reliable)
const playNotificationSound = () => {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5

    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.35);
  } catch {
    // Ignore audio autostart restriction
  }
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    inAppNotifications: true,
  });

  const socketRef = useRef(null);

  const fetchUnreadCount = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setUnreadCount(0);
      return;
    }
    try {
      const res = await api.get('/api/notifications/unread-count');
      setUnreadCount(res.data.unreadCount || 0);
    } catch {
      // Ignore background count errors
    }
  }, []);

  const fetchNotifications = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setNotifications([]);
      return;
    }
    try {
      setLoading(true);
      const res = await api.get('/api/notifications');
      setNotifications(res.data.notifications || []);
      setUnreadCount(res.data.unreadCount || 0);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPreferences = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const res = await api.get('/api/notifications/preferences');
      setPreferences(res.data);
    } catch {
      // Ignore preferences fetch failure
    }
  }, []);

  const updatePreferences = async (newPrefs) => {
    try {
      const res = await api.put('/api/notifications/preferences', newPrefs);
      setPreferences(res.data.preferences);
      showToast('success', 'Notification preferences saved');
      return true;
    } catch (err) {
      showToast('error', err.response?.data?.message || 'Failed to update preferences');
      return false;
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.patch(`/api/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (String(n.id || n._id) === String(id) ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.patch('/api/notifications/mark-all-read');
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
      showToast('success', 'All notifications marked as read');
    } catch (err) {
      showToast('error', 'Failed to mark all as read');
    }
  };

  const clearAllNotifications = async () => {
    try {
      await api.delete('/api/notifications/clear-all');
      setNotifications([]);
      setUnreadCount(0);
      showToast('success', 'All notifications cleared');
    } catch (err) {
      showToast('error', 'Failed to clear notifications');
    }
  };

  const deleteNotification = async (id) => {
    try {
      await api.delete(`/api/notifications/${id}`);
      setNotifications((prev) => {
        const item = prev.find((n) => String(n.id || n._id) === String(id));
        if (item && !item.isRead) {
          setUnreadCount((c) => Math.max(0, c - 1));
        }
        return prev.filter((n) => String(n.id || n._id) !== String(id));
      });
    } catch (err) {
      console.error('Failed to delete notification:', err);
    }
  };

  const [authToken, setAuthToken] = useState(() => localStorage.getItem('token'));

  // Listen for login / logout events across the application
  useEffect(() => {
    const handleAuthChange = () => {
      const currentToken = localStorage.getItem('token');
      setAuthToken(currentToken);
    };

    window.addEventListener('storage', handleAuthChange);
    window.addEventListener('authChange', handleAuthChange);

    return () => {
      window.removeEventListener('storage', handleAuthChange);
      window.removeEventListener('authChange', handleAuthChange);
    };
  }, []);

  // Setup Socket connection & real-time listener
  useEffect(() => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

    if (authToken) {
      fetchNotifications();
      fetchUnreadCount();
      fetchPreferences();

      // Initialize Socket client
      const socket = io(backendUrl, {
        auth: { token: authToken },
        transports: ['websocket', 'polling'],
        reconnectionAttempts: 5,
        reconnectionDelay: 2000,
      });

      socketRef.current = socket;

      socket.on('new_notification', (data) => {
        playNotificationSound();
        showToast('info', `${data.title}: ${data.message}`);

        setNotifications((prev) => {
          const exists = prev.some((n) => String(n.id || n._id) === String(data.id || data._id));
          if (exists) return prev;
          return [data, ...prev];
        });
        setUnreadCount((prev) => prev + 1);
      });

      return () => {
        socket.disconnect();
      };
    } else {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [authToken, fetchNotifications, fetchUnreadCount, fetchPreferences]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        preferences,
        fetchNotifications,
        fetchUnreadCount,
        fetchPreferences,
        updatePreferences,
        markAsRead,
        markAllAsRead,
        clearAllNotifications,
        deleteNotification,
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
