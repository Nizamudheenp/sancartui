import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiShoppingBag,
  FiClock,
  FiCheckCircle,
  FiTruck,
  FiAlertCircle,
  FiCalendar,
  FiMapPin,
  FiPackage,
  FiCreditCard,
  FiArrowRight,
} from "react-icons/fi";

const UserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/orders/getuserorders`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setOrders(data || []);
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // Compute stats
  const totalOrdersCount = orders.length;
  const totalSpent = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
  const activeOrdersCount = orders.filter(
    (order) => order.status !== "Delivered" && order.status !== "Cancelled"
  ).length;

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return {
          bg: "bg-emerald-50 text-emerald-700 border-emerald-100",
          icon: <FiCheckCircle className="text-emerald-500" />,
        };
      case "pending":
      case "processing":
        return {
          bg: "bg-amber-50 text-amber-700 border-amber-100",
          icon: <FiClock className="text-amber-500 animate-pulse" />,
        };
      case "shipped":
        return {
          bg: "bg-blue-50 text-blue-700 border-blue-100",
          icon: <FiTruck className="text-blue-500" />,
        };
      case "paid":
      case "succeeded":
        return {
          bg: "bg-indigo-50 text-indigo-700 border-indigo-100",
          icon: <FiCheckCircle className="text-indigo-500" />,
        };
      default:
        return {
          bg: "bg-rose-50 text-rose-700 border-rose-100",
          icon: <FiAlertCircle className="text-rose-500" />,
        };
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
        <span className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-semibold text-gray-500">Loading your orders...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 px-4 md:px-8 pt-28 pb-16">
      <div className="max-w-5xl mx-auto">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
          <div className="text-start">
            <span className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary-600 bg-primary-50 rounded-lg mb-3">
              Dashboard
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
              Order History
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Manage and track your recent orders
            </p>
          </div>
        </div>

        {orders.length === 0 ? (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-gray-100 rounded-3xl p-12 text-center max-w-lg mx-auto shadow-sm"
          >
            <div className="w-16 h-16 rounded-full bg-slate-50 border border-gray-100 flex items-center justify-center mx-auto mb-6 text-2xl text-gray-400">
              <FiShoppingBag />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">No orders yet</h3>
            <p className="text-sm text-gray-500 mb-6">
              Looks like you haven't placed any orders. Start exploring our shop!
            </p>
            <button
              onClick={() => navigate("/shop")}
              className="px-6 py-2.5 text-xs font-bold rounded-full text-white bg-gradient-to-r from-primary-500 to-indigo-600 hover:shadow-md hover:shadow-primary-500/10 transition active:scale-95 flex items-center gap-2 mx-auto"
            >
              Start Shopping <FiArrowRight />
            </button>
          </motion.div>
        ) : (
          <>
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10 text-start">
              <div className="bg-white border border-gray-100/80 p-6 rounded-2xl shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center text-primary-500 text-xl flex-shrink-0">
                  <FiPackage />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Total Orders
                  </p>
                  <p className="text-2xl font-black text-gray-900 mt-0.5">
                    {totalOrdersCount}
                  </p>
                </div>
              </div>

              <div className="bg-white border border-gray-100/80 p-6 rounded-2xl shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500 text-xl flex-shrink-0">
                  <FiCreditCard />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Total Spent
                  </p>
                  <p className="text-2xl font-black text-gray-900 mt-0.5">
                    ₹{totalSpent}
                  </p>
                </div>
              </div>

              <div className="bg-white border border-gray-100/80 p-6 rounded-2xl shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-500 text-xl flex-shrink-0">
                  <FiClock className="animate-pulse" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Active Orders
                  </p>
                  <p className="text-2xl font-black text-gray-900 mt-0.5">
                    {activeOrdersCount}
                  </p>
                </div>
              </div>
            </div>

            {/* Orders List Grid */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid gap-6 md:grid-cols-2"
            >
              {orders.map((order) => {
                const badge = getStatusBadge(order.status);
                return (
                  <motion.div
                    key={order.id}
                    variants={cardVariants}
                    className="bg-white border border-gray-100/80 rounded-3xl shadow-sm p-6 hover:shadow-md transition-all duration-300 flex flex-col justify-between text-start"
                  >
                    <div>
                      {/* Card Header Info */}
                      <div className="flex items-start justify-between gap-4 mb-4 pb-4 border-b border-gray-50">
                        <div>
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
                            Order Reference
                          </span>
                          <p className="text-sm font-black text-gray-800 tracking-tight truncate max-w-[180px] sm:max-w-xs">
                            #{order.id.substring(order.id.length - 8).toUpperCase()}
                          </p>
                        </div>
                        <div
                          className={`flex items-center gap-1.5 px-3 py-1 text-xs font-bold border rounded-full ${badge.bg}`}
                        >
                          {badge.icon}
                          <span>{order.status}</span>
                        </div>
                      </div>

                      {/* Placed Date & Billing */}
                      <div className="grid grid-cols-2 gap-4 mb-5 text-xs text-gray-500">
                        <div className="flex items-center gap-2">
                          <FiCalendar className="text-gray-400 flex-shrink-0" />
                          <span>
                            {new Date(order.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FiCreditCard className="text-gray-400 flex-shrink-0" />
                          <span className="font-bold text-gray-900">
                            Total: ₹{order.totalAmount}
                          </span>
                        </div>
                      </div>

                      {/* Products Stack */}
                      <div className="mb-5 bg-slate-50/50 border border-slate-100 rounded-2xl p-4">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">
                          Items Summary
                        </p>
                        <div className="space-y-3.5">
                          {order.products.map((item, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-3 text-sm"
                            >
                              <div className="w-10 h-10 bg-white border border-gray-100 rounded-lg flex items-center justify-center p-1.5 overflow-hidden flex-shrink-0">
                                <img
                                  src={item.product?.images?.[0] || "/placeholder.svg"}
                                  alt={item.product?.name}
                                  className="max-w-full max-h-full object-contain"
                                  onError={(e) => {
                                    e.target.src = "/placeholder.svg";
                                  }}
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-bold text-gray-800 text-xs truncate leading-snug">
                                  {item.product?.name || "Product Item"}
                                </p>
                                <p className="text-[10px] text-gray-400 font-medium mt-0.5">
                                  Quantity: {item.quantity}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Shipping Address Section */}
                    <div className="pt-4 border-t border-gray-50 flex items-start gap-2 text-xs text-gray-500">
                      <FiMapPin className="text-gray-400 mt-0.5 flex-shrink-0" />
                      <p className="line-clamp-2 leading-relaxed">
                        {order.shippingAddress || "No shipping address provided."}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
};

export default UserOrders;
