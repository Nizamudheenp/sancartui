import React from "react";
import {
  FaFacebook,
  FaWhatsapp,
  FaTwitter,
  FaYoutube,
  FaPinterest,
  FaAppStoreIos,
  FaGooglePlay,
  FaStripe,
} from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-primary-50 via-white to-accent-50 text-gray-700 py-16 px-6 md:px-16 border-t border-gray-100">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
        <div>
          <img
            src="images/sancart_logo.jpeg"
            alt="sancart"
            className="w-16 h-16 object-contain mb-4 rounded-lg shadow-sm"
          />
          <h4 className="text-lg font-semibold mb-3 text-primary-600">Contact</h4>
          <p className="text-sm mb-1 text-gray-600">
            <strong>Address:</strong> Wayanad, Kerala
          </p>
          <p className="text-sm mb-1 text-gray-600">
            <strong>Phone:</strong> +91 6235320612
          </p>
          <p className="text-sm mb-1 text-gray-600">
            <strong>Email:</strong> sancartofficial@gmail.com
          </p>
          <div className="mt-6">
            <h4 className="text-base font-bold mb-3 text-gray-800">
              Follow Us
            </h4>
            <div className="flex gap-4 text-xl text-accent-500">
              <FaFacebook className="hover:text-primary-500 hover:scale-110 transition cursor-pointer" />
              <FaWhatsapp className="hover:text-green-500 hover:scale-110 transition cursor-pointer" />
              <FaTwitter className="hover:text-sky-500 hover:scale-110 transition cursor-pointer" />
              <FaYoutube className="hover:text-red-500 hover:scale-110 transition cursor-pointer" />
              <FaPinterest className="hover:text-red-600 hover:scale-110 transition cursor-pointer" />
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-4 text-primary-600">About</h4>
          <ul className="flex flex-col gap-2.5 text-sm text-gray-600">
            <li><a href="/about" className="hover:text-primary-500 transition">About Us</a></li>
            <li><a href="/coming-soon" className="hover:text-primary-500 transition">Delivery Information</a></li>
            <li><a href="/coming-soon" className="hover:text-primary-500 transition">Privacy Policy</a></li>
            <li><a href="/coming-soon" className="hover:text-primary-500 transition">Terms & Conditions</a></li>
            <li><a href="/contact" className="hover:text-primary-500 transition">Contact Us</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-4 text-primary-600">Account</h4>
          <ul className="flex flex-col gap-2.5 text-sm text-gray-600">
            <li><a href="/coming-soon" className="hover:text-primary-500 transition">My Account</a></li>
            <li><a href="/login" className="hover:text-primary-500 transition">Sign In</a></li>
            <li><a href="/cart" className="hover:text-primary-500 transition">View Cart</a></li>
            <li><a href="/coming-soon" className="hover:text-primary-500 transition">Track My Order</a></li>
            <li><a href="/coming-soon" className="hover:text-primary-500 transition">Help</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-4 text-primary-600">Get Our App</h4>
          <p className="text-sm mb-3 text-gray-600">Download from</p>
          <div className="flex items-center gap-4 text-3xl text-accent-500 mb-4">
            <FaAppStoreIos className="hover:text-primary-500 transition cursor-pointer" />
            <FaGooglePlay className="hover:text-green-600 transition cursor-pointer" />
          </div>
          <p className="text-sm mb-2 text-gray-600">Secured Payment via</p>
          <FaStripe className="text-4xl text-primary-500 hover:text-accent-500 transition cursor-pointer" />
        </div>
      </div>

      <div className="text-center mt-12 text-sm border-t border-gray-100 pt-6 text-gray-500">
        © {currentYear} <span className="font-semibold text-primary-500">sancart</span> — Premium Shopping Experience. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
