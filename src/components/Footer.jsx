import React from "react";
import { Link } from "react-router-dom";
import {
  FaFacebook,
  FaWhatsapp,
  FaInstagram,
  FaEnvelope,
  FaShieldAlt,
  FaMoneyBillWave,
} from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white/20 backdrop-blur-lg border-t border-white/40 text-slate-600 py-16 px-4 md:px-8 relative overflow-hidden">
      {/* Decorative ambient blur */}
      <div className="absolute bottom-[-10%] left-[20%] w-[300px] h-[300px] rounded-full bg-primary-500/5 blur-[80px] -z-10" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-10 relative z-10">
        <div className="flex flex-col items-start text-start">
          <img
            src="/images/sancart_logo.webp"
            alt="sancart"
            className="w-14 h-14 object-contain mb-4 rounded-2xl shadow-glass border border-white/60 bg-white/40"
          />
          <h4 className="text-[10px] font-bold uppercase tracking-widest mb-4 text-slate-900">Contact Us</h4>
          <p className="text-sm mb-1 text-slate-500">
            <strong>Address:</strong> Wayanad, Kerala
          </p>
          <p className="text-sm mb-1 text-slate-500">
            <strong>Phone:</strong> +91 6235320612
          </p>
          <p className="text-sm mb-4 text-slate-500">
            <strong>Email:</strong> sancartofficial@gmail.com
          </p>
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-widest mb-3 text-slate-900">
              Follow Us
            </h4>
            <div className="flex gap-2.5">
              <a href="https://www.facebook.com/profile.php?id=61588835427230" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-xl bg-white/30 border border-white/60 hover:bg-blue-600 hover:text-white flex items-center justify-center text-slate-500 hover:scale-110 hover:border-transparent transition-all duration-300">
                <FaFacebook className="text-sm" />
              </a>
              <a href="https://wa.me/916235320612" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-xl bg-white/30 border border-white/60 hover:bg-green-600 hover:text-white flex items-center justify-center text-slate-500 hover:scale-110 hover:border-transparent transition-all duration-300">
                <FaWhatsapp className="text-sm" />
              </a>
              <a href="https://www.instagram.com/san__cart/" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-xl bg-white/30 border border-white/60 hover:bg-pink-600 hover:text-white flex items-center justify-center text-slate-500 hover:scale-110 hover:border-transparent transition-all duration-300">
                <FaInstagram className="text-sm" />
              </a>
              <a href="mailto:sancartofficial@gmail.com" className="w-9 h-9 rounded-xl bg-white/30 border border-white/60 hover:bg-red-500 hover:text-white flex items-center justify-center text-slate-500 hover:scale-110 hover:border-transparent transition-all duration-300">
                <FaEnvelope className="text-sm" />
              </a>
            </div>
          </div>
        </div>

        <div className="text-start">
          <h4 className="text-[10px] font-bold uppercase tracking-widest mb-4 text-slate-900">About</h4>
          <ul className="flex flex-col gap-2.5 text-sm text-slate-500">
            <li><Link to="/about" className="hover:text-primary-500 hover:underline underline-offset-4 transition duration-200">About Us</Link></li>
            <li><Link to="/coming-soon" className="hover:text-primary-500 hover:underline underline-offset-4 transition duration-200">Delivery Information</Link></li>
            <li><Link to="/privacy" className="hover:text-primary-500 hover:underline underline-offset-4 transition duration-200">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-primary-500 hover:underline underline-offset-4 transition duration-200">Terms & Conditions</Link></li>
            <li><Link to="/returns" className="hover:text-primary-500 hover:underline underline-offset-4 transition duration-200">Returns & Refunds</Link></li>
            <li><Link to="/contact" className="hover:text-primary-500 hover:underline underline-offset-4 transition duration-200">Contact Us</Link></li>
          </ul>
        </div>

        <div className="text-start">
          <h4 className="text-[10px] font-bold uppercase tracking-widest mb-4 text-slate-900">Account</h4>
          <ul className="flex flex-col gap-2.5 text-sm text-slate-500">
            <li><Link to="/myorders" className="hover:text-primary-500 hover:underline underline-offset-4 transition duration-200">My Account</Link></li>
            <li><Link to="/login" className="hover:text-primary-500 hover:underline underline-offset-4 transition duration-200">Sign In</Link></li>
            <li><Link to="/cart" className="hover:text-primary-500 hover:underline underline-offset-4 transition duration-200">View Cart</Link></li>
            <li><Link to="/coming-soon" className="hover:text-primary-500 hover:underline underline-offset-4 transition duration-200">Track My Order</Link></li>
            <li><Link to="/help" className="hover:text-primary-500 hover:underline underline-offset-4 transition duration-200">Help</Link></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-12 border-t border-white/30 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-400 relative z-10">
        <p className="text-center sm:text-left">
          © {currentYear} <span className="font-semibold text-primary-500">sancart</span> — Premium Shopping Experience. All rights reserved.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 select-none border border-white/60 bg-white/45 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-sm">
            <FaShieldAlt className="text-xs text-primary-500 flex-shrink-0" />
            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-700">Secure Payments</span>
          </div>
          <div className="flex items-center gap-1.5 select-none border border-white/60 bg-white/45 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-sm">
            <FaMoneyBillWave className="text-xs text-emerald-600 flex-shrink-0" />
            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-700">Cash on Delivery</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
