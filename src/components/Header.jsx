import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BsCart2, BsXLg, BsList, BsPersonFill } from "react-icons/bs";

const Header = () => {
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();
  const dropdownRef = useRef();

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

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  const handleUserIconClick = () => {
    if (isLoggedIn) {
      setShowUserDropdown(prev => !prev);
    } else {
      navigate('/login');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setShowUserDropdown(false);
    navigate('/login');
  };

  return (
    <>
      <header className="fixed top-6 left-0 right-0 z-50 px-4 md:px-8 max-w-7xl mx-auto flex items-center justify-between pointer-events-none">
        {/* Left Side: Floating Logo Pill */}
        <Link 
          to="/" 
          className="pointer-events-auto h-12 px-5 flex items-center justify-center rounded-full border border-white/50 bg-white/45 backdrop-blur-xl shadow-glass hover:scale-105 transition-all duration-300"
        >
          <img src="/images/sancart-w-full.webp" alt="sancart" className="h-6 md:h-8 w-auto object-contain" />
        </Link>

        {/* Center: Desktop Navigation Links Pill */}
        <nav className="pointer-events-auto hidden md:flex items-center gap-6 h-12 px-8 rounded-full border border-white/50 bg-white/45 backdrop-blur-xl shadow-glass">
          <Link to="/" className="text-xs font-bold text-gray-700 hover:text-primary-500 hover:scale-105 transform transition-all duration-200">Home</Link>
          <Link to="/shop" className="text-xs font-bold text-gray-700 hover:text-primary-500 hover:scale-105 transform transition-all duration-200">Shop</Link>
          <Link to="/about" className="text-xs font-bold text-gray-700 hover:text-primary-500 hover:scale-105 transform transition-all duration-200">About</Link>
          <Link to="/contact" className="text-xs font-bold text-gray-700 hover:text-primary-500 hover:scale-105 transform transition-all duration-200">Contact</Link>
        </nav>

        {/* Right Side: Floating Actions (Cart, User, Hamburger) */}
        <div className="pointer-events-auto flex items-center gap-2">
          {/* Cart Pill (Icon Only) */}
          <Link 
            to="/cart" 
            className="w-12 h-12 flex items-center justify-center rounded-full border border-white/50 bg-white/45 backdrop-blur-xl shadow-glass text-gray-700 hover:text-primary-500 hover:scale-105 hover:bg-white/60 transition-all duration-300"
          >
            <BsCart2 className="text-lg" />
          </Link>

          {/* User Profile */}
          <div className="relative animate-fade-in" ref={dropdownRef}>
            <button
              onClick={handleUserIconClick}
              className="w-12 h-12 rounded-full border border-white/50 bg-white/45 backdrop-blur-xl shadow-glass flex items-center justify-center text-gray-700 hover:scale-105 hover:bg-white/60 active:scale-95 transition-all duration-300"
            >
              <BsPersonFill className="text-lg" />
            </button>

            <div className={`absolute right-0 mt-3 w-56 bg-white/75 backdrop-blur-2xl border border-white/40 rounded-2xl shadow-glass-hover p-4 transform transition-all duration-300 origin-top-right ${showUserDropdown ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'}`}>
              {!isLoggedIn ? (
                <div className="flex flex-col gap-3">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Account</p>
                  <Link to="/login" className="w-full text-center py-2.5 text-sm font-bold rounded-full bg-brand-gradient text-white shadow-md hover:shadow-lg transition-all duration-200">Sign in</Link>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <p className="text-sm font-semibold text-gray-800 truncate border-b border-gray-100/50 pb-2">
                    {userInfo?.name || 'User'}
                  </p>
                  <Link to="/myorders" className="text-sm text-gray-600 hover:text-primary-500 py-1.5 transition-colors">My Orders</Link>

                  {userInfo?.isAdmin && (
                    <>
                      <Link to="/admin/dashboard" className="text-sm text-gray-600 hover:text-primary-500 py-1.5 transition-colors">Admin Dashboard</Link>
                      <Link to="/admin/orders" className="text-sm text-gray-600 hover:text-primary-500 py-1.5 transition-colors">Manage Orders</Link>
                    </>
                  )}

                  <button onClick={handleLogout} className="w-full mt-2 py-2 text-sm font-bold rounded-xl bg-red-500/10 text-red-600 hover:bg-red-500/20 transition-colors">Logout</button>
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
      <div className={`fixed inset-0 z-[100] transition-all duration-500 ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
        <div className="absolute inset-0 bg-black/15 backdrop-blur-md" onClick={() => setIsMobileMenuOpen(false)} />
        <aside className={`absolute right-0 top-0 bottom-0 w-80 bg-white/75 backdrop-blur-2xl p-6 border-l border-white/40 shadow-2xl flex flex-col justify-between transform transition-transform duration-500 ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div>
            <div className="flex items-center justify-between border-b border-gray-100/50 pb-4 mb-6">
              <img src="/images/sancart-w-full.webp" alt="sancart" className="h-10 w-auto object-contain" />
              <button onClick={() => setIsMobileMenuOpen(false)} className="w-10 h-10 rounded-full border border-white/50 bg-white/45 flex items-center justify-center text-gray-500 hover:bg-white/60 transition-all duration-200">
                <BsXLg className="text-sm" />
              </button>
            </div>

            <nav className="flex flex-col gap-5">
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="py-2 text-lg font-bold text-gray-800 hover:text-primary-500 transition-colors">Home</Link>
              <Link to="/shop" onClick={() => setIsMobileMenuOpen(false)} className="py-2 text-lg font-bold text-gray-800 hover:text-primary-500 transition-colors">Shop</Link>
              <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className="py-2 text-lg font-bold text-gray-800 hover:text-primary-500 transition-colors">About</Link>
              <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="py-2 text-lg font-bold text-gray-800 hover:text-primary-500 transition-colors">Contact</Link>
            </nav>
          </div>

          <div className="border-t border-gray-100/50 pt-6">
            {!isLoggedIn ? (
              <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="block w-full text-center py-3 rounded-full bg-brand-gradient text-white font-bold shadow-md">Sign in</Link>
            ) : (
              <div className="flex flex-col gap-3">
                <p className="text-sm font-semibold text-gray-500">Signed in as <span className="text-gray-900 font-bold">{userInfo?.name}</span></p>
                <Link to="/myorders" onClick={() => setIsMobileMenuOpen(false)} className="py-2 text-gray-700 hover:text-primary-500 font-medium transition-colors">My Orders</Link>
                {userInfo?.isAdmin && (
                  <>
                    <Link to="/admin/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="py-2 text-gray-700 hover:text-primary-500 font-medium transition-colors">Admin Dashboard</Link>
                    <Link to="/admin/orders" onClick={() => setIsMobileMenuOpen(false)} className="py-2 text-gray-700 hover:text-primary-500 font-medium transition-colors">Manage Orders</Link>
                  </>
                )}
                <button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} className="w-full mt-2 py-3 rounded-xl bg-red-500/10 text-red-600 font-bold hover:bg-red-500/20 transition-colors">Logout</button>
              </div>
            )}
          </div>
        </aside>
      </div>
    </>
  );
};

export default Header;
