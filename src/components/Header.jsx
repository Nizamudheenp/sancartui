import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  BsCart2,
  BsXLg,
  BsList,
  BsPersonFill,
  BsBell,
  BsBellFill,
  BsCheck2All,
  BsGear,
  BsBoxSeam,
  BsArrowReturnLeft,
  BsCheckCircle,
  BsTrash,
  BsX,
  BsXCircle,
} from 'react-icons/bs';
import api from '../utils/api';
import { getGuestCart } from '../utils/guestCart';
import { useNotifications } from '../context/NotificationContext';

const Header = () => {
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [cartCount, setCartCount] = useState(0);

  const navigate = useNavigate();
  const dropdownRef = useRef();
  const notificationRef = useRef();

  const {
    notifications,
    unreadCount,
    loading: notifLoading,
    preferences,
    updatePreferences,
    markAsRead,
    markAllAsRead,
    clearAllNotifications,
    deleteNotification,
    fetchNotifications,
  } = useNotifications();

  const [emailPref, setEmailPref] = useState(true);
  const [inAppPref, setInAppPref] = useState(true);
  const [savingPrefs, setSavingPrefs] = useState(false);

  useEffect(() => {
    if (preferences) {
      setEmailPref(preferences.emailNotifications !== false);
      setInAppPref(preferences.inAppNotifications !== false);
    }
  }, [preferences]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    if (token && user) {
      setIsLoggedIn(true);
      setUserInfo(user);
    } else {
      setIsLoggedIn(false);
      setUserInfo(null);
    }
  }, []);

  const fetchCartCount = async () => {
    const token = localStorage.getItem('token');
    if (!token || token === 'null' || token === 'undefined') {
      const guestCart = getGuestCart();
      const uniqueCount = guestCart.filter((item) => item && item.product).length;
      setCartCount(uniqueCount);
    } else {
      try {
        const res = await api.get('/api/products/getCart');
        const items = res.data.items || [];
        const uniqueCount = items.filter((item) => item && item.product).length;
        setCartCount(uniqueCount);
      } catch (err) {
        console.error('Error fetching cart count:', err);
      }
    }
  };

  useEffect(() => {
    fetchCartCount();

    const handleCartUpdate = () => {
      fetchCartCount();
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    window.addEventListener('storage', handleCartUpdate);

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
      window.removeEventListener('storage', handleCartUpdate);
    };
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowUserDropdown(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  const handleUserIconClick = () => {
    if (isLoggedIn) {
      setShowUserDropdown((prev) => !prev);
    } else {
      navigate('/login');
    }
  };

  const handleBellClick = () => {
    if (!showNotifications && isLoggedIn) {
      fetchNotifications();
    }
    setShowNotifications((prev) => !prev);
  };

  const handleNotificationItemClick = (notification) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
    setShowNotifications(false);
    if (notification.link) {
      navigate(notification.link);
    } else if (userInfo?.isAdmin) {
      navigate('/admin/orders');
    } else {
      navigate('/myorders');
    }
  };

  const handleSavePreferences = async () => {
    setSavingPrefs(true);
    await updatePreferences({
      emailNotifications: emailPref,
      inAppNotifications: inAppPref,
    });
    setSavingPrefs(false);
    setShowSettingsModal(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setShowUserDropdown(false);
    setShowNotifications(false);
    window.dispatchEvent(new Event('authChange'));
    navigate('/login');
  };

  const formatTimeAgo = (dateStr) => {
    if (!dateStr) return '';
    const now = new Date();
    const date = new Date(dateStr);
    const diffSec = Math.floor((now - date) / 1000);
    if (diffSec < 60) return 'Just now';
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHour = Math.floor(diffMin / 60);
    if (diffHour < 24) return `${diffHour}h ago`;
    const diffDay = Math.floor(diffHour / 24);
    return `${diffDay}d ago`;
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'ADMIN_NEW_ORDER':
      case 'USER_ORDER_PLACED':
        return <BsBoxSeam className="text-blue-500 text-base" />;
      case 'ADMIN_NEW_RETURN':
      case 'USER_RETURN_STATUS':
        return <BsArrowReturnLeft className="text-orange-500 text-base" />;
      case 'USER_ORDER_STATUS':
        return <BsCheckCircle className="text-green-500 text-base" />;
      case 'ADMIN_ORDER_CANCELLED':
        return <BsXCircle className="text-red-500 text-base" />;
      default:
        return <BsBell className="text-primary-500 text-base" />;
    }
  };

  return (
    <>
      <header className="fixed top-6 left-0 right-0 z-50 px-4 md:px-8 max-w-7xl mx-auto flex items-center justify-between pointer-events-none">
        {/* Left Side: Floating Logo Pill */}
        <Link
          to="/"
          className="pointer-events-auto h-12 px-5 flex items-center justify-center rounded-full border border-white/50 bg-white/45 backdrop-blur-xl shadow-glass hover:scale-105 transition-all duration-300"
        >
          <img
            src="/images/sancart-w-full.webp"
            alt="sancart"
            className="h-6 md:h-8 w-auto object-contain"
          />
        </Link>

        {/* Center: Desktop Navigation Links Pill */}
        <nav className="pointer-events-auto hidden md:flex items-center gap-6 h-12 px-8 rounded-full border border-white/50 bg-white/45 backdrop-blur-xl shadow-glass">
          <Link
            to="/"
            className="text-xs font-bold text-gray-700 hover:text-primary-500 hover:scale-105 transform transition-all duration-200"
          >
            Home
          </Link>
          <Link
            to="/shop"
            className="text-xs font-bold text-gray-700 hover:text-primary-500 hover:scale-105 transform transition-all duration-200"
          >
            Shop
          </Link>
          <Link
            to="/about"
            className="text-xs font-bold text-gray-700 hover:text-primary-500 hover:scale-105 transform transition-all duration-200"
          >
            About
          </Link>
          <Link
            to="/contact"
            className="text-xs font-bold text-gray-700 hover:text-primary-500 hover:scale-105 transform transition-all duration-200"
          >
            Contact
          </Link>
        </nav>

        {/* Right Side: Floating Actions (Cart, Notifications, User, Hamburger) */}
        <div className="pointer-events-auto flex items-center gap-2">
          {/* Cart Pill */}
          <Link
            to="/cart"
            className="relative w-12 h-12 flex items-center justify-center rounded-full border border-white/50 bg-white/45 backdrop-blur-xl shadow-glass text-gray-700 hover:text-primary-500 hover:scale-105 hover:bg-white/60 transition-all duration-300"
            aria-label="Shopping Cart"
          >
            <BsCart2 className="text-lg" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[20px] h-5 px-1.5 bg-red-500 text-white text-[10px] font-black rounded-full shadow-md animate-scale-in border-2 border-white">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </Link>

          {/* Notification Bell Pill */}
          <div className="relative animate-fade-in" ref={notificationRef}>
            <button
              onClick={handleBellClick}
              className="relative w-12 h-12 flex items-center justify-center rounded-full border border-white/50 bg-white/45 backdrop-blur-xl shadow-glass text-gray-700 hover:text-primary-500 hover:scale-105 hover:bg-white/60 active:scale-95 transition-all duration-300"
              aria-label="Notifications"
            >
              {unreadCount > 0 ? (
                <BsBellFill className="text-lg text-primary-500" />
              ) : (
                <BsBell className="text-lg" />
              )}
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[20px] h-5 px-1.5 bg-red-500 text-white text-[10px] font-black rounded-full shadow-md animate-scale-in border-2 border-white">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown Panel */}
            <div
              className={`absolute right-0 mt-3 w-80 md:w-96 bg-white/95 backdrop-blur-2xl border border-white/40 rounded-2xl shadow-glass-hover p-4 transform transition-all duration-300 origin-top-right z-50 ${
                showNotifications
                  ? 'opacity-100 scale-100 visible'
                  : 'opacity-0 scale-95 invisible'
              }`}
            >
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-gray-800 text-sm">Notifications</h3>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-primary-500/10 text-primary-600 rounded-full">
                      {unreadCount} unread
                    </span>
                  )}
                </div>
                {isLoggedIn && (
                  <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-xs font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1 transition-colors"
                        title="Mark all as read"
                      >
                        <BsCheck2All className="text-sm" />
                        Mark read
                      </button>
                    )}
                    {notifications.length > 0 && (
                      <button
                        onClick={clearAllNotifications}
                        className="text-xs font-semibold text-gray-500 hover:text-red-600 flex items-center gap-1 transition-colors"
                        title="Clear all notifications"
                      >
                        <BsTrash className="text-xs" />
                        Clear
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setShowNotifications(false);
                        setShowSettingsModal(true);
                      }}
                      className="p-1 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                      title="Notification Preferences"
                    >
                      <BsGear className="text-sm" />
                    </button>
                  </div>
                )}
              </div>

              {!isLoggedIn ? (
                <div className="py-6 text-center">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary-50 text-primary-500 flex items-center justify-center">
                    <BsBell className="text-xl" />
                  </div>
                  <p className="text-sm font-semibold text-gray-800 mb-1">
                    Stay updated with your orders
                  </p>
                  <p className="text-xs text-gray-500 mb-4">
                    Sign in to view real-time delivery and return alerts.
                  </p>
                  <Link
                    to="/login"
                    onClick={() => setShowNotifications(false)}
                    className="inline-block px-5 py-2 text-xs font-bold rounded-full bg-brand-gradient text-white shadow-md hover:shadow-lg transition-all"
                  >
                    Sign in
                  </Link>
                </div>
              ) : notifLoading && notifications.length === 0 ? (
                <div className="py-8 flex justify-center">
                  <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : notifications.length === 0 ? (
                <div className="py-8 text-center">
                  <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-gray-50 text-gray-400 flex items-center justify-center">
                    <BsBell className="text-xl" />
                  </div>
                  <p className="text-sm font-medium text-gray-600">No notifications yet</p>
                  <p className="text-xs text-gray-400 mt-1">
                    We'll notify you here when your orders update.
                  </p>
                </div>
              ) : (
                <div className="max-h-80 overflow-y-auto divide-y divide-gray-100/70 mt-1 pr-1 custom-scrollbar">
                  {notifications.map((item) => (
                    <div
                      key={item.id || item._id}
                      onClick={() => handleNotificationItemClick(item)}
                      className={`group py-3 px-2 rounded-xl flex items-start gap-3 cursor-pointer transition-colors relative ${
                        item.isRead
                          ? 'hover:bg-gray-50/80 text-gray-600'
                          : 'bg-primary-50/40 hover:bg-primary-50/70 text-gray-900 font-medium'
                      }`}
                    >
                      <div className="mt-0.5 p-2 rounded-lg bg-white shadow-sm border border-gray-100 flex-shrink-0">
                        {getNotificationIcon(item.type)}
                      </div>
                      <div className="flex-1 min-w-0 pr-2">
                        <div className="flex items-center justify-between gap-1">
                          <p className="text-xs font-bold text-gray-800 truncate">
                            {item.title}
                          </p>
                          <span className="text-[10px] text-gray-400 whitespace-nowrap">
                            {formatTimeAgo(item.createdAt)}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 line-clamp-2 mt-0.5 leading-relaxed">
                          {item.message}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0 mt-1">
                        {!item.isRead && (
                          <span className="w-2 h-2 rounded-full bg-primary-500"></span>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(item.id || item._id);
                          }}
                          className="p-1 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded transition-colors opacity-0 group-hover:opacity-100"
                          title="Remove notification"
                        >
                          <BsX className="text-sm" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* User Profile (Desktop only - mobile accesses profile options via sidebar menu) */}
          <div className="relative animate-fade-in hidden md:block" ref={dropdownRef}>
            <button
              onClick={handleUserIconClick}
              className="w-12 h-12 rounded-full border border-white/50 bg-white/45 backdrop-blur-xl shadow-glass flex items-center justify-center text-gray-700 hover:scale-105 hover:bg-white/60 active:scale-95 transition-all duration-300"
            >
              <BsPersonFill className="text-lg" />
            </button>

            <div
              className={`absolute right-0 mt-3 w-56 bg-white/75 backdrop-blur-2xl border border-white/40 rounded-2xl shadow-glass-hover p-4 transform transition-all duration-300 origin-top-right ${
                showUserDropdown
                  ? 'opacity-100 scale-100 visible'
                  : 'opacity-0 scale-95 invisible'
              }`}
            >
              {!isLoggedIn ? (
                <div className="flex flex-col gap-3">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Account
                  </p>
                  <Link
                    to="/login"
                    className="w-full text-center py-2.5 text-sm font-bold rounded-full bg-brand-gradient text-white shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    Sign in
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <p className="text-sm font-semibold text-gray-800 truncate border-b border-gray-100/50 pb-2">
                    {userInfo?.name || 'User'}
                  </p>
                  <Link
                    to="/myorders"
                    className="text-sm text-gray-600 hover:text-primary-500 py-1.5 transition-colors"
                  >
                    My Orders
                  </Link>

                  {userInfo?.isAdmin && (
                    <>
                      <Link
                        to="/admin/dashboard"
                        className="text-sm text-gray-600 hover:text-primary-500 py-1.5 transition-colors"
                      >
                        Admin Dashboard
                      </Link>
                      <Link
                        to="/admin/orders"
                        className="text-sm text-gray-600 hover:text-primary-500 py-1.5 transition-colors"
                      >
                        Manage Orders
                      </Link>
                    </>
                  )}

                  <button
                    onClick={handleLogout}
                    className="w-full mt-2 py-2 text-sm font-bold rounded-xl bg-red-500/10 text-red-600 hover:bg-red-500/20 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Hamburger Menu Toggle (Mobile Only) */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="pointer-events-auto md:hidden w-12 h-12 rounded-full border border-white/50 bg-white/45 backdrop-blur-xl shadow-glass flex items-center justify-center text-gray-800 hover:scale-105 hover:bg-white/60 active:scale-95 transition-all duration-300"
          >
            <BsList className="text-xl" />
          </button>
        </div>
      </header>

      {/* Mobile / Full Navigation Menu */}
      <div
        className={`fixed inset-0 z-[100] transition-all duration-500 ${
          isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}
      >
        <div
          className="absolute inset-0 bg-black/15 backdrop-blur-md"
          onClick={() => setIsMobileMenuOpen(false)}
        />
        <aside
          className={`absolute right-0 top-0 bottom-0 w-80 bg-white/75 backdrop-blur-2xl p-6 border-l border-white/40 shadow-2xl flex flex-col justify-between transform transition-transform duration-500 ${
            isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div>
            <div className="flex items-center justify-between border-b border-gray-100/50 pb-4 mb-6">
              <img
                src="/images/sancart-w-full.webp"
                alt="sancart"
                className="h-10 w-auto object-contain"
              />
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-10 h-10 rounded-full border border-white/50 bg-white/45 flex items-center justify-center text-gray-500 hover:bg-white/60 transition-all duration-200"
              >
                <BsXLg className="text-sm" />
              </button>
            </div>

            <nav className="flex flex-col gap-5">
              <Link
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-2 text-lg font-bold text-gray-800 hover:text-primary-500 transition-colors"
              >
                Home
              </Link>
              <Link
                to="/shop"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-2 text-lg font-bold text-gray-800 hover:text-primary-500 transition-colors"
              >
                Shop
              </Link>
              <Link
                to="/about"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-2 text-lg font-bold text-gray-800 hover:text-primary-500 transition-colors"
              >
                About
              </Link>
              <Link
                to="/contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-2 text-lg font-bold text-gray-800 hover:text-primary-500 transition-colors"
              >
                Contact
              </Link>
            </nav>
          </div>

          <div className="border-t border-gray-100/50 pt-6">
            {!isLoggedIn ? (
              <Link
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block w-full text-center py-3 rounded-full bg-brand-gradient text-white font-bold shadow-md"
              >
                Sign in
              </Link>
            ) : (
              <div className="flex flex-col gap-3">
                <p className="text-sm font-semibold text-gray-500">
                  Signed in as <span className="text-gray-900 font-bold">{userInfo?.name}</span>
                </p>
                <Link
                  to="/myorders"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="py-2 text-gray-700 hover:text-primary-500 font-medium transition-colors"
                >
                  My Orders
                </Link>
                {userInfo?.isAdmin && (
                  <>
                    <Link
                      to="/admin/dashboard"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="py-2 text-gray-700 hover:text-primary-500 font-medium transition-colors"
                    >
                      Admin Dashboard
                    </Link>
                    <Link
                      to="/admin/orders"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="py-2 text-gray-700 hover:text-primary-500 font-medium transition-colors"
                    >
                      Manage Orders
                    </Link>
                  </>
                )}
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full mt-2 py-3 rounded-xl bg-red-500/10 text-red-600 font-bold hover:bg-red-500/20 transition-colors"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* Notification Preferences Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-gray-100 overflow-hidden transform animate-scale-in">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Notification Settings</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Choose how you want to receive updates from Sancart
                </p>
              </div>
              <button
                onClick={() => setShowSettingsModal(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors"
              >
                <BsXLg className="text-xs" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Email Notifications Toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-800">✉️ Email Notifications</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Order receipts, tracking updates, and return decisions.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={emailPref}
                    onChange={(e) => setEmailPref(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                </label>
              </div>

              {/* In-App Notifications Toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-800">🔔 In-App Notifications</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Real-time bell alerts and sound chimes on the website.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inAppPref}
                    onChange={(e) => setInAppPref(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                </label>
              </div>
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowSettingsModal(false)}
                className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePreferences}
                disabled={savingPrefs}
                className="px-5 py-2 text-xs font-bold rounded-xl bg-brand-gradient text-white shadow-md hover:shadow-lg transition-all disabled:opacity-50"
              >
                {savingPrefs ? 'Saving...' : 'Save Preferences'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
