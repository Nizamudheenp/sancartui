import React from "react";
import { Link } from "react-router-dom";
import {
  FaFacebook,
  FaWhatsapp,
  FaInstagram,
  FaEnvelope,
  FaStripe,
} from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-50 text-slate-600 py-16 px-4 md:px-8 border-t border-slate-100">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-10">
        <div className="flex flex-col items-start text-start">
          <img
            src="/images/sancart_logo.webp"
            alt="sancart"
            className="w-14 h-14 object-contain mb-4 rounded-2xl shadow-sm border border-slate-100"
          />
          <h4 className="text-xs font-bold uppercase tracking-wider mb-4 text-slate-900">Contact Us</h4>
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
            <h4 className="text-xs font-bold uppercase tracking-wider mb-3 text-slate-900">
              Follow Us
            </h4>
            <div className="flex gap-2.5">
              <a href="https://www.facebook.com/profile.php?id=61588835427230" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-xl bg-white border border-slate-200/60 hover:bg-blue-600 hover:text-white flex items-center justify-center text-slate-500 hover:scale-105 hover:border-transparent transition-all duration-300">
                <FaFacebook className="text-sm" />
              </a>
              <a href="https://wa.me/916235320612" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-xl bg-white border border-slate-200/60 hover:bg-green-600 hover:text-white flex items-center justify-center text-slate-500 hover:scale-105 hover:border-transparent transition-all duration-300">
                <FaWhatsapp className="text-sm" />
              </a>
              <a href="https://www.instagram.com/san__cart/" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-xl bg-white border border-slate-200/60 hover:bg-pink-600 hover:text-white flex items-center justify-center text-slate-500 hover:scale-105 hover:border-transparent transition-all duration-300">
                <FaInstagram className="text-sm" />
              </a>
              <a href="mailto:sancartofficial@gmail.com" className="w-9 h-9 rounded-xl bg-white border border-slate-200/60 hover:bg-red-500 hover:text-white flex items-center justify-center text-slate-500 hover:scale-105 hover:border-transparent transition-all duration-300">
                <FaEnvelope className="text-sm" />
              </a>
            </div>
          </div>
        </div>

        <div className="text-start">
          <h4 className="text-xs font-bold uppercase tracking-wider mb-4 text-slate-900">About</h4>
          <ul className="flex flex-col gap-2.5 text-sm text-slate-500">
            <li><Link to="/about" className="hover:text-blue-600 hover:underline underline-offset-4 transition">About Us</Link></li>
            <li><Link to="/coming-soon" className="hover:text-blue-600 hover:underline underline-offset-4 transition">Delivery Information</Link></li>
            <li><Link to="/privacy" className="hover:text-blue-600 hover:underline underline-offset-4 transition">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-blue-600 hover:underline underline-offset-4 transition">Terms & Conditions</Link></li>
            <li><Link to="/contact" className="hover:text-blue-600 hover:underline underline-offset-4 transition">Contact Us</Link></li>
          </ul>
        </div>

        <div className="text-start">
          <h4 className="text-xs font-bold uppercase tracking-wider mb-4 text-slate-900">Account</h4>
          <ul className="flex flex-col gap-2.5 text-sm text-slate-500">
            <li><Link to="/myorders" className="hover:text-blue-600 hover:underline underline-offset-4 transition">My Account</Link></li>
            <li><Link to="/login" className="hover:text-blue-600 hover:underline underline-offset-4 transition">Sign In</Link></li>
            <li><Link to="/cart" className="hover:text-blue-600 hover:underline underline-offset-4 transition">View Cart</Link></li>
            <li><Link to="/coming-soon" className="hover:text-blue-600 hover:underline underline-offset-4 transition">Track My Order</Link></li>
            <li><Link to="/help" className="hover:text-blue-600 hover:underline underline-offset-4 transition">Help</Link></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-12 border-t border-slate-200/60 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-400">
        <p className="text-center sm:text-left">
          © {currentYear} <span className="font-semibold text-[#1b36e3]">sancart</span> — Premium Shopping Experience. All rights reserved.
        </p>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Secured via</span>
          <FaStripe className="text-4xl text-slate-500 hover:text-slate-800 transition cursor-pointer" />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
