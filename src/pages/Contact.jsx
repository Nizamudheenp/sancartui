import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { showToast } from "../utils/toast";
import { FiMapPin, FiPhone, FiMail } from "react-icons/fi";
import {
  FaFacebookF,
  FaWhatsapp,
  FaTwitter,
  FaYoutube,
  FaPinterest,
} from "react-icons/fa";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      showToast("error", "Log in is required to send messages");
      setTimeout(() => navigate("/login"), 800);
      return;
    }
    try {
      await api.post(
        "/api/orders/contact",
        form
      );
      setForm({ name: "", email: "", message: "" });
      showToast("success", "Message sent successfully!");
    } catch (error) {
      showToast("error", "Failed to send message.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 pt-28">
      <div className="glass-card rounded-[2.5rem] p-6 sm:p-10 shadow-glass">
        
        {/* Page Header */}
        <div className="max-w-xl text-start mb-12">
          <span className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary-600 bg-primary-500/10 rounded-lg mb-3">
            Contact Us
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-gray-950 tracking-tight">
            Let's Start a Conversation
          </h2>
          <p className="text-gray-500 mt-2 text-base md:text-lg">
            We're here to help and answer any question you might have.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Contact Cards */}
          <div className="lg:col-span-5 text-start space-y-6">
            <div className="flex items-start gap-4 p-6 bg-white/40 rounded-2xl border border-white/50 shadow-sm transition-all duration-300 hover:shadow-md">
              <div className="p-3 bg-primary-500/10 text-primary-600 rounded-xl">
                <FiMapPin className="text-xl" />
              </div>
              <div>
                <h4 className="font-extrabold text-gray-950 text-base">Office Address</h4>
                <p className="text-sm text-gray-600 mt-1 font-semibold">Wayanad, Kerala, India</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 bg-white/40 rounded-2xl border border-white/50 shadow-sm transition-all duration-300 hover:shadow-md">
              <div className="p-3 bg-primary-500/10 text-primary-600 rounded-xl">
                <FiPhone className="text-xl" />
              </div>
              <div>
                <h4 className="font-extrabold text-gray-950 text-base">Phone Hotline</h4>
                <p className="text-sm text-gray-600 mt-1 font-semibold">+91 6235320612</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 bg-white/40 rounded-2xl border border-white/50 shadow-sm transition-all duration-300 hover:shadow-md">
              <div className="p-3 bg-primary-500/10 text-primary-600 rounded-xl">
                <FiMail className="text-xl" />
              </div>
              <div>
                <h4 className="font-extrabold text-gray-950 text-base">Email Assistance</h4>
                <p className="text-sm text-gray-600 mt-1 font-semibold">sancartofficial@gmail.com</p>
              </div>
            </div>

            <div className="pt-6">
              <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Follow Our Updates</h4>
              <div className="flex gap-4 text-primary-600 text-xl">
                <FaFacebookF className="hover:text-primary-500 hover:scale-110 transition cursor-pointer" />
                <FaWhatsapp className="hover:text-primary-500 hover:scale-110 transition cursor-pointer" />
                <FaTwitter className="hover:text-primary-500 hover:scale-110 transition cursor-pointer" />
                <FaYoutube className="hover:text-primary-500 hover:scale-110 transition cursor-pointer" />
                <FaPinterest className="hover:text-primary-500 hover:scale-110 transition cursor-pointer" />
              </div>
            </div>
          </div>

          {/* Right Column: Contact Message Form */}
          <div className="lg:col-span-7 bg-white/30 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-white/50 shadow-sm">
            <h3 className="text-xl font-extrabold text-gray-950 mb-6 text-start">
              Send Us a Message
            </h3>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your Name"
                required
                className="w-full border border-white/65 bg-white/40 backdrop-blur-sm rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-primary-500/10 focus:border-primary-500 transition-all font-semibold placeholder-gray-400 text-gray-800 text-sm"
              />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Your Email"
                required
                className="w-full border border-white/65 bg-white/40 backdrop-blur-sm rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-primary-500/10 focus:border-primary-500 transition-all font-semibold placeholder-gray-400 text-gray-800 text-sm"
              />
              <textarea
                rows="5"
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Your Message"
                required
                className="w-full border border-white/65 bg-white/40 backdrop-blur-sm rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-primary-500/10 focus:border-primary-500 transition-all font-semibold placeholder-gray-400 text-gray-800 text-sm"
              ></textarea>
              <button
                type="submit"
                className="w-full bg-brand-gradient text-white font-bold py-4 rounded-full shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transform transition-all duration-200"
              >
                Send Message
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Contact;
