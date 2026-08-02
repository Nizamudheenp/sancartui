import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiCheck, FiArrowRight, FiShoppingBag, FiInbox } from "react-icons/fi";

const PaymentSuccess = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-slate-50 px-4 pt-20 overflow-hidden">
      {/* Decorative Background Blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 20, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-100 rounded-full blur-3xl opacity-60"
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            x: [0, -20, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -bottom-40 -right-40 w-96 h-96 bg-primary-100 rounded-full blur-3xl opacity-50"
        />
      </div>

      <motion.div
        className="relative bg-white/85 backdrop-blur-md border border-gray-100 rounded-3xl shadow-xl max-w-md w-full p-8 md:p-10 text-center z-10"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
      >
        {/* Animated Checkmark Circle */}
        <div className="relative w-20 h-20 mx-auto mb-6">
          <motion.div
            className="absolute inset-0 rounded-full bg-emerald-100"
            initial={{ scale: 0 }}
            animate={{ scale: [1, 1.15, 1] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="relative w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
          >
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.3 }}
            >
              <FiCheck className="text-white text-4xl" />
            </motion.div>
          </motion.div>
        </div>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight mb-2"
        >
          Payment Successful
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-gray-500 text-sm mb-8 leading-relaxed max-w-sm mx-auto"
        >
          Thank you for your purchase! Your payment was processed successfully, and your order is now confirmed.
        </motion.p>

        {/* Order Info Card (Decorative summary) */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-slate-50 border border-slate-100 rounded-2xl p-4 mb-8 text-start space-y-2.5 text-xs text-gray-500"
        >
          <div className="flex justify-between items-center">
            <span>Status</span>
            <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
              Confirmed
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span>Delivery Method</span>
            <span className="font-semibold text-gray-800">Standard Shipping</span>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col gap-3"
        >
          <Link
            to="/myorders"
            className="w-full bg-gradient-to-r from-primary-500 to-indigo-600 hover:from-primary-600 hover:to-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-primary-500/10 transition-all duration-300 flex items-center justify-center gap-2 text-sm"
          >
            <FiInbox size={16} /> View My Orders <FiArrowRight size={16} />
          </Link>

          <Link
            to="/shop"
            className="w-full bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold py-3.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 text-sm"
          >
            <FiShoppingBag size={16} /> Continue Shopping
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PaymentSuccess;
