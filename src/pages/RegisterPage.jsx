import React, { useState } from "react";
import api from "../utils/api";
import { showToast } from "../utils/toast";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight } from "react-icons/fi";
import { registerSchema } from "../validators/authValidator";

function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Frontend validation
    const result = registerSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors = {};
      result.error.issues.forEach(issue => {
        fieldErrors[issue.path[0]] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});
    try {
      const response = await api.post(
        "/api/auth/register",
        formData
      );
      const token = response.data.token;
      const user = response.data.user;
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);

      // Sync guest cart
      try {
        const guestCart = JSON.parse(localStorage.getItem("guest_cart") || "[]");
        if (guestCart.length > 0) {
          const items = guestCart.map(item => ({
            productId: item.product.id || item.product._id,
            quantity: item.quantity
          }));
          await api.post(
            "/api/products/syncCart",
            { items }
          );
          localStorage.removeItem("guest_cart");
        }
        window.dispatchEvent(new Event("cartUpdated"));
      } catch (syncErr) {
        console.error("Error syncing cart on register:", syncErr);
      }

      showToast('success', 'Registration successful');
      setTimeout(() => {
        navigate('/');
        location.reload();
      }, 500);
    } catch (error) {
      if (error.response?.data?.errors) {
        const fieldErrors = {};
        error.response.data.errors.forEach(err => {
          fieldErrors[err.field] = err.message;
        });
        setErrors(fieldErrors);
      } else {
        showToast('error', error.response?.data?.message || 'Registration failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md md:max-w-xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 pt-28 text-slate-800 font-sans">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="glass-card rounded-[2.5rem] p-8 sm:p-10 shadow-glass text-center"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-4">
            <img
              src="/images/sancart-w-full.webp"
              alt="sancart"
              className="h-10 mx-auto object-contain"
            />
          </Link>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-955 tracking-tight">Create Account</h2>
          <p className="text-gray-500 text-xs sm:text-sm font-semibold mt-1">Get started with your free account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 text-start">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="relative"
          >
            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
              <FiUser size={18} />
            </span>
            <input
              name="name"
              type="text"
              placeholder="Full Name"
              onChange={handleChange}
              required
              className={`w-full pl-11 pr-4 py-3.5 border rounded-2xl focus:ring-2 focus:ring-primary-500/10 focus:border-primary-500 focus:outline-none transition-all duration-300 bg-white/50 placeholder-gray-400 text-gray-800 text-sm font-semibold ${
                errors.name ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : 'border-white/60'
              }`}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1 pl-1 font-semibold">{errors.name}</p>}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="relative"
          >
            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
              <FiMail size={18} />
            </span>
            <input
              name="email"
              type="email"
              placeholder="Email Address"
              onChange={handleChange}
              required
              className={`w-full pl-11 pr-4 py-3.5 border rounded-2xl focus:ring-2 focus:ring-primary-500/10 focus:border-primary-500 focus:outline-none transition-all duration-300 bg-white/50 placeholder-gray-400 text-gray-800 text-sm font-semibold ${
                errors.email ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : 'border-white/60'
              }`}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1 pl-1 font-semibold">{errors.email}</p>}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="relative"
          >
            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
              <FiLock size={18} />
            </span>
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              onChange={handleChange}
              required
              className={`w-full pl-11 pr-11 py-3.5 border rounded-2xl focus:ring-2 focus:ring-primary-500/10 focus:border-primary-500 focus:outline-none transition-all duration-300 bg-white/50 placeholder-gray-400 text-gray-800 text-sm font-semibold ${
                errors.password ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : 'border-white/60'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </button>
            {errors.password && <p className="text-red-500 text-xs mt-1 pl-1 font-semibold">{errors.password}</p>}
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="submit"
            disabled={isLoading}
            className="w-full bg-brand-gradient text-white font-bold py-4 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-75 disabled:cursor-not-allowed mt-4"
          >
            {isLoading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                Register Account <FiArrowRight size={16} />
              </>
            )}
          </motion.button>
        </form>

        <div className="text-center text-xs mt-6 text-gray-500 font-semibold border-t border-white/30 pt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-primary-600 hover:text-primary-700 font-extrabold hover:underline ml-1"
          >
            Sign in instead
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default RegisterPage;