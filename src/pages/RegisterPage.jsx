import React, { useState } from "react";
import axios from "axios";
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
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/register`,
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
          await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/api/products/syncCart`,
            { items },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          localStorage.removeItem("guest_cart");
        }
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
    <div className="relative flex items-center justify-center min-h-screen bg-slate-50 px-4 pt-24 pb-12 overflow-hidden">
      {/* Decorative Background Blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 30, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-40 -left-40 w-96 h-96 bg-orange-100 rounded-full blur-3xl opacity-60"
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            x: [0, -40, 0],
            y: [0, 40, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-100 rounded-full blur-3xl opacity-60"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative w-full max-w-md bg-white/85 backdrop-blur-md border border-gray-100 rounded-3xl shadow-xl p-8 md:p-10 z-10"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-4">
            <img
              src="/images/sancart-w-full.webp"
              alt="sancart"
              className="h-10 mx-auto object-contain"
            />
          </Link>
          <h2 className="text-2xl font-bold text-gray-800">Create Account</h2>
          <p className="text-gray-500 text-sm mt-1">Get started with your free account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="relative"
          >
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
              <FiUser size={18} />
            </span>
            <input
              name="name"
              type="text"
              placeholder="Full Name"
              onChange={handleChange}
              required
              className={`w-full pl-11 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-accent-500/20 focus:border-accent-500 focus:outline-none transition-all duration-300 bg-white/60 placeholder-gray-400 text-gray-800 text-sm ${
                errors.name ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : 'border-gray-200'
              }`}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1 pl-1">{errors.name}</p>}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="relative"
          >
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
              <FiMail size={18} />
            </span>
            <input
              name="email"
              type="email"
              placeholder="Email Address"
              onChange={handleChange}
              required
              className={`w-full pl-11 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-accent-500/20 focus:border-accent-500 focus:outline-none transition-all duration-300 bg-white/60 placeholder-gray-400 text-gray-800 text-sm ${
                errors.email ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : 'border-gray-200'
              }`}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1 pl-1">{errors.email}</p>}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="relative"
          >
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
              <FiLock size={18} />
            </span>
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              onChange={handleChange}
              required
              className={`w-full pl-11 pr-11 py-3 border rounded-xl focus:ring-2 focus:ring-accent-500/20 focus:border-accent-500 focus:outline-none transition-all duration-300 bg-white/60 placeholder-gray-400 text-gray-800 text-sm ${
                errors.password ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : 'border-gray-200'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </button>
            {errors.password && <p className="text-red-500 text-xs mt-1 pl-1">{errors.password}</p>}
          </motion.div>


          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-accent-500 to-amber-500 hover:from-accent-600 hover:to-amber-600 text-white font-semibold py-3 rounded-xl shadow-lg shadow-accent-500/20 transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-75 disabled:cursor-not-allowed mt-2"
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

        <div className="text-center text-xs mt-6 text-gray-500 border-t border-gray-100 pt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-primary-500 hover:text-primary-600 font-semibold hover:underline"
          >
            Sign in instead
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default RegisterPage;