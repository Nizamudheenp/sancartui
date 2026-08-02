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
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-lg border-b border-gray-100 shadow-sm transition-all duration-300">
        <div className="max-w-[1200px] mx-auto px-6 md:px-8 flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-2">
            <img src="/images/sancart-w-full.png" alt="sancart" className="h-10 md:h-12 w-auto object-contain" />
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-sm font-semibold text-gray-700 hover:text-primary-500 transition-colors">Home</Link>
            <Link to="/shop" className="text-sm font-semibold text-gray-700 hover:text-primary-500 transition-colors">Shop</Link>
            <Link to="/about" className="text-sm font-semibold text-gray-700 hover:text-primary-500 transition-colors">About</Link>
            <Link to="/contact" className="text-sm font-semibold text-gray-700 hover:text-primary-500 transition-colors">Contact</Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link to="/cart" className="relative p-2 text-gray-700 hover:text-primary-500 transition-colors">
              <BsCart2 className="text-2xl" />
            </Link>

            <div className="relative" ref={dropdownRef}>
              <button
                onClick={handleUserIconClick}
                className="flex items-center justify-center p-2 rounded-full border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <BsPersonFill className="text-xl" />
              </button>

              <div className={`absolute right-0 mt-3 w-56 bg-white border border-gray-100 rounded-2xl shadow-xl p-4 transform transition-all duration-200 origin-top-right ${showUserDropdown ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'}`}>
                {!isLoggedIn ? (
                  <div className="flex flex-col gap-3">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Account</p>
                    <Link to="/login" className="w-full text-center py-2.5 text-sm font-bold rounded-full bg-gradient-to-r from-primary-500 to-yellow-400 text-white shadow-md hover:shadow-lg transition-shadow">Sign in</Link>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <p className="text-sm font-semibold text-gray-800 truncate border-b border-gray-100 pb-2">
                      {userInfo?.name || 'User'}
                    </p>
                    <Link to="/myorders" className="text-sm text-gray-600 hover:text-primary-500 py-1.5 transition-colors">My Orders</Link>

                    {userInfo?.isAdmin && (
                      <>
                        <Link to="/admin/dashboard" className="text-sm text-gray-600 hover:text-primary-500 py-1.5 transition-colors">Admin Dashboard</Link>
                        <Link to="/admin/orders" className="text-sm text-gray-600 hover:text-primary-500 py-1.5 transition-colors">Manage Orders</Link>
                      </>
                    )}

                    <button onClick={handleLogout} className="w-full mt-2 py-2 text-sm font-bold rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors">Logout</button>
                  </div>
                )}
              </div>
            </div>

            <button className="md:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-xl" onClick={() => setIsMobileMenuOpen(true)}>
              <BsList className="text-2xl" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div className={`fixed inset-0 z-[100] md:hidden transition-all duration-300 ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
        <div className="absolute inset-0 bg-black/35 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
        <aside className={`absolute right-0 top-0 bottom-0 w-80 bg-white p-6 shadow-2xl flex flex-col justify-between transform transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div>
            <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
              <img src="/images/sancart-w-full.png" alt="sancart" className="h-10 w-auto object-contain" />
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-gray-500 hover:bg-gray-100 rounded-xl">
                <BsXLg className="text-xl" />
              </button>
            </div>

            <nav className="flex flex-col gap-4">
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="py-2 text-lg font-semibold text-gray-800 hover:text-primary-500 transition-colors">Home</Link>
              <Link to="/shop" onClick={() => setIsMobileMenuOpen(false)} className="py-2 text-lg font-semibold text-gray-800 hover:text-primary-500 transition-colors">Shop</Link>
              <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className="py-2 text-lg font-semibold text-gray-800 hover:text-primary-500 transition-colors">About</Link>
              <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="py-2 text-lg font-semibold text-gray-800 hover:text-primary-500 transition-colors">Contact</Link>
              <Link to="/cart" onClick={() => setIsMobileMenuOpen(false)} className="py-2 text-lg font-semibold text-gray-800 hover:text-primary-500 transition-colors flex items-center gap-2">
                <BsCart2 className="text-xl" /> Cart
              </Link>
            </nav>
          </div>

          <div className="border-t border-gray-100 pt-6">
            {!isLoggedIn ? (
              <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="block w-full text-center py-3 rounded-full bg-gradient-to-r from-primary-500 to-yellow-400 text-white font-bold shadow-md">Sign in</Link>
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
                <button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} className="w-full mt-2 py-3 rounded-xl bg-red-50 text-red-600 font-bold hover:bg-red-100 transition-colors">Logout</button>
              </div>
            )}
          </div>
        </aside>
      </div>
    </>
  );
};

export default Header;
