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
    <section className="max-w-7xl mx-auto px-6 py-24 mt-10">
      
      {/* Page Header */}
      <div className="max-w-xl text-start mb-16">
        <span className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary-600 bg-primary-50 rounded-lg mb-3">
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
          <div className="flex items-start gap-4 p-6 bg-slate-50 rounded-2xl border border-gray-100/50">
            <div className="p-3 bg-primary-50 text-primary-500 rounded-xl">
              <FiMapPin className="text-xl" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-base">Office Address</h4>
              <p className="text-sm text-gray-500 mt-1">Wayanad, Kerala, India</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-6 bg-slate-50 rounded-2xl border border-gray-100/50">
            <div className="p-3 bg-primary-50 text-primary-500 rounded-xl">
              <FiPhone className="text-xl" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-base">Phone Hotline</h4>
              <p className="text-sm text-gray-500 mt-1">+91 6235320612</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-6 bg-slate-50 rounded-2xl border border-gray-100/50">
            <div className="p-3 bg-primary-50 text-primary-500 rounded-xl">
              <FiMail className="text-xl" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-base">Email Assistance</h4>
              <p className="text-sm text-gray-500 mt-1">sancartofficial@gmail.com</p>
            </div>
          </div>

          <div className="pt-6">
            <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Follow Our Updates</h4>
            <div className="flex gap-4 text-primary-500 text-xl">
              <FaFacebookF className="hover:text-yellow-500 transition cursor-pointer" />
              <FaWhatsapp className="hover:text-yellow-500 transition cursor-pointer" />
              <FaTwitter className="hover:text-yellow-500 transition cursor-pointer" />
              <FaYoutube className="hover:text-yellow-500 transition cursor-pointer" />
              <FaPinterest className="hover:text-yellow-500 transition cursor-pointer" />
            </div>
          </div>
        </div>

        {/* Right Column: Contact Message Form */}
        <div className="lg:col-span-7 bg-white p-8 rounded-3xl border border-gray-100 shadow-lg">
          <h3 className="text-xl font-bold text-gray-950 mb-6 text-start">
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
              className="w-full border border-gray-200 rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
            />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Your Email"
              required
              className="w-full border border-gray-200 rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
            />
            <textarea
              rows="5"
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Your Message"
              required
              className="w-full border border-gray-200 rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
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
    </section>
  );
};

export default Contact;
