import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { showToast } from "../utils/toast";
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
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";

const OrderTrackerTimeline = ({ order }) => {
  const steps = [
    { label: "Placed", desc: "Processing order details", statusKey: "processing" },
    { label: "Paid", desc: "Payment verified successfully", statusKey: "paid" },
    { label: "Shipped", desc: "Package picked up by carrier", statusKey: "shipped" },
    { label: "Delivered", desc: "Delivered successfully", statusKey: "delivered" },
  ];

  const getStepIndex = (status) => {
    const s = status?.toLowerCase();
    if (s === "pending" || s === "processing") return 0;
    if (s === "paid" || s === "succeeded") return 1;
    if (s === "shipped") return 2;
    if (s === "delivered") return 3;
    return -1; // Cancelled or other
  };

  const activeIdx = getStepIndex(order.status);
  const isCancelled = order.status?.toLowerCase() === "cancelled";
  const isRefunded = order.status?.toLowerCase() === "refunded";

  if (isCancelled) {
    return (
      <div className="bg-red-50/50 border border-red-100 rounded-2xl p-4 flex flex-col gap-2 mt-2 text-start">
        <div className="flex items-center gap-3">
          <FiAlertCircle className="text-red-500 text-xl flex-shrink-0" />
          <div>
            <p className="text-xs font-bold text-red-800">Order Cancelled</p>
            <p className="text-[10px] text-red-500 mt-0.5">This order has been cancelled.</p>
          </div>
        </div>
        <div className="mt-1 pt-2 border-t border-red-100/50 text-[10px] text-red-750 font-medium bg-red-50/40 p-2 rounded-lg leading-relaxed">
          <strong>Refund Initiated:</strong> A refund of ₹{order.totalAmount} is being processed to your original payment method. Typically, refunds reflect within 5-7 business days.
        </div>
      </div>
    );
  }

  if (isRefunded) {
    return (
      <div className="bg-purple-50/50 border border-purple-100 rounded-2xl p-4 flex items-center gap-3 mt-2">
        <FiAlertCircle className="text-purple-500 text-xl flex-shrink-0" />
        <div className="text-start">
          <p className="text-xs font-bold text-purple-800">Order Refunded</p>
          <p className="text-[10px] text-purple-500 mt-0.5">A refund has been successfully processed for this order.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 pt-2 pb-1 relative mt-2">
      {steps.map((step, idx) => {
        const isCompleted = idx < activeIdx;
        const isActive = idx === activeIdx;

        return (
          <div key={idx} className="flex gap-4 items-start relative">
            {/* Step Line */}
            {idx < steps.length - 1 && (
              <div 
                className={`absolute left-[13px] top-[26px] bottom-[-22px] w-[2px] z-0 ${
                  idx < activeIdx ? "bg-[#1b36e3]" : "bg-slate-200"
                }`}
              />
            )}

            {/* Icon bubble */}
            <div 
              className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold z-10 transition-all ${
                isCompleted 
                  ? "bg-brand-gradient text-white shadow-md shadow-blue-500/10" 
                  : isActive
                  ? "bg-[#1b36e3] text-white animate-pulse"
                  : "bg-slate-100 text-slate-400 border border-slate-200"
              }`}
            >
              {isCompleted ? "✓" : idx + 1}
            </div>

            {/* Label and description */}
            <div className="text-start flex-1 min-w-0">
              <h5 className={`text-xs font-bold ${isActive ? "text-[#1b36e3]" : isCompleted ? "text-slate-800" : "text-slate-400"}`}>
                {step.label}
              </h5>
              <p className={`text-[10px] ${isActive ? "text-slate-600 font-semibold" : "text-slate-400"} mt-0.5 truncate`}>
                {step.desc}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const UserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get("/api/orders/getuserorders");
        setOrders(data || []);
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    try {
      await api.put(`/api/orders/cancelorder/${orderId}`, {});
      // Update local state
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: "cancelled" } : o));
      showToast("success", "Order cancelled successfully!");
    } catch (err) {
      console.error(err);
      showToast("error", err.response?.data?.message || "Failed to cancel order");
    }
  };

  // Compute stats
  const totalOrdersCount = orders.length;
  const totalSpent = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
  const activeOrdersCount = orders.filter(
    (order) => order.status !== "Delivered" && order.status !== "Cancelled" && order.status !== "Refunded"
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
      case "cancelled":
        return {
          bg: "bg-red-50 text-red-700 border-red-100",
          icon: <FiAlertCircle className="text-red-500" />,
        };
      case "refunded":
        return {
          bg: "bg-purple-50 text-purple-700 border-purple-100",
          icon: <FiAlertCircle className="text-purple-500" />,
        };
      default:
        return {
          bg: "bg-gray-50 text-gray-700 border-gray-100",
          icon: <FiAlertCircle className="text-gray-500" />,
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

                    {/* Shipping Address Section & Collapsible Tracking */}
                    <div className="pt-4 border-t border-gray-50 flex flex-col gap-3">
                      <div className="flex items-start gap-2 text-xs text-gray-500">
                        <FiMapPin className="text-gray-400 mt-0.5 flex-shrink-0" />
                        <p className="line-clamp-2 leading-relaxed">
                          {order.shippingAddress || "No shipping address provided."}
                        </p>
                      </div>

                      <div className="flex gap-2.5">
                        <button
                          onClick={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-4 text-[10px] font-bold text-slate-700 bg-slate-50 hover:bg-slate-100/80 rounded-xl transition-all border border-slate-100"
                        >
                          <span>{expandedOrderId === order.id ? "Hide Tracking" : "Track Shipment"}</span>
                          {expandedOrderId === order.id ? <FiChevronUp className="text-xs" /> : <FiChevronDown className="text-xs" />}
                        </button>

                        {["pending", "processing", "paid", "succeeded"].includes(order.status?.toLowerCase()) && (
                          <button
                            onClick={() => handleCancelOrder(order.id)}
                            className="px-4 py-2.5 text-[10px] font-bold text-red-600 bg-red-50 hover:bg-red-100/80 rounded-xl transition-all border border-red-100/50"
                          >
                            Cancel Order
                          </button>
                        )}
                      </div>

                      {expandedOrderId === order.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="overflow-hidden border-t border-slate-100 pt-2"
                        >
                          <OrderTrackerTimeline order={order} />
                        </motion.div>
                      )}
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
