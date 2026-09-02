import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { motion } from "framer-motion";
import { showToast } from "../utils/toast";
import {
  FiUser,
  FiPackage,
  FiCheckCircle,
  FiClock,
  FiTruck,
  FiAlertCircle,
  FiDollarSign,
  FiTrendingUp,
  FiLayers,
  FiXCircle,
} from "react-icons/fi";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("orders");
  const [returns, setReturns] = useState([]);
  const [loadingReturns, setLoadingReturns] = useState(false);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/api/orders/getAllOrders");
      setOrders(res.data || []);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReturns = async () => {
    setLoadingReturns(true);
    try {
      const res = await api.get("/api/returns/list");
      setReturns(res.data || []);
    } catch (error) {
      console.error("Failed to fetch returns:", error);
    } finally {
      setLoadingReturns(false);
    }
  };

  const updateStatus = async (orderIdentifier, newStatus) => {
    if (!orderIdentifier) {
      showToast("error", "Invalid order ID");
      return;
    }
    try {
      const res = await api.put(
        `/api/orders/updateorderstatus/${orderIdentifier}`,
        { status: newStatus }
      );

      setOrders((prev) =>
        prev.map((order) =>
          (order.id === orderIdentifier || order._id === orderIdentifier)
            ? { ...order, status: res.data?.status || newStatus }
            : order
        )
      );
      showToast("success", `Order status updated to ${newStatus}`);
    } catch (err) {
      console.error("Failed to update status:", err);
      showToast("error", err.response?.data?.message || "Failed to update order status");
    }
  };

  const handleUpdateReturnStatus = async (returnId, status) => {
    try {
      await api.put(`/api/returns/status/${returnId}`, { status });
      showToast("success", `Return request marked as ${status}`);
      fetchReturns();
      if (status === "approved") {
        fetchOrders();
      }
    } catch (err) {
      console.error("Failed to update return status:", err);
      showToast("error", "Failed to update status");
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchReturns();
  }, []);

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

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
        <span className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-semibold text-gray-500">Loading incoming orders...</p>
      </div>
    );
  }

  // Calculate quick admin stats
  const totalAmount = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const pendingOrders = orders.filter((o) => o.status === "processing").length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 pt-28 text-slate-800 font-sans">
      <div>
        {/* Page Header */}
        <div className="text-start mb-8">
          <span className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary-600 bg-primary-500/10 rounded-lg mb-3">
            Admin Panel
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-gray-955 tracking-tight">
            Manage Orders
          </h2>
          <p className="text-gray-500 text-sm font-semibold mt-1">
            Track customer purchases, update delivery status, and review business transactions
          </p>
        </div>

        {/* Stats Summary Panel */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10 text-start">
          <div className="bg-white/40 backdrop-blur-md border border-white/50 p-6 rounded-3xl shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-primary-500/10 rounded-2xl flex items-center justify-center text-primary-600 text-xl flex-shrink-0">
              <FiLayers />
            </div>
            <div>
              <p className="text-xs font-extrabold text-gray-400 uppercase tracking-wider">
                Total Placed Orders
              </p>
              <p className="text-2xl font-black text-gray-955 mt-0.5">
                {orders.length}
              </p>
            </div>
          </div>

          <div className="bg-white/40 backdrop-blur-md border border-white/50 p-6 rounded-3xl shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-600 text-xl flex-shrink-0">
              <FiTrendingUp />
            </div>
            <div>
              <p className="text-xs font-extrabold text-gray-400 uppercase tracking-wider">
                Gross Revenue
              </p>
              <p className="text-2xl font-black text-gray-955 mt-0.5">
                ₹{totalAmount.toFixed(2)}
              </p>
            </div>
          </div>

          <div className="bg-white/40 backdrop-blur-md border border-white/50 p-6 rounded-3xl shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-600 text-xl flex-shrink-0">
              <FiClock className="animate-pulse" />
            </div>
            <div>
              <p className="text-xs font-extrabold text-gray-400 uppercase tracking-wider">
                Processing Orders
              </p>
              <p className="text-2xl font-black text-gray-955 mt-0.5">
                {pendingOrders}
              </p>
            </div>
          </div>
        </div>

        {/* View Toggle Tabs */}
        <div className="flex gap-4 mb-6 border-b border-white/30 pb-4 text-start">
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-6 py-3 text-xs font-bold rounded-2xl transition-all ${
              activeTab === "orders"
                ? "bg-brand-gradient text-white shadow-md"
                : "bg-white/40 border border-white/50 hover:bg-white text-gray-700"
            }`}
          >
            All Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab("returns")}
            className={`px-6 py-3 text-xs font-bold rounded-2xl transition-all ${
              activeTab === "returns"
                ? "bg-brand-gradient text-white shadow-md"
                : "bg-white/40 border border-white/50 hover:bg-white text-gray-700"
            }`}
          >
            Return Requests ({returns.length})
          </button>
        </div>

        {activeTab === "orders" ? (
          orders.length === 0 ? (
            <div className="glass-card rounded-[2.5rem] p-12 text-center max-w-lg mx-auto shadow-glass">
              <div className="w-16 h-16 rounded-full bg-white/40 border border-white/50 flex items-center justify-center mx-auto mb-6 text-2xl text-gray-400 shadow-sm">
                <FiPackage />
              </div>
              <h3 className="text-lg font-extrabold text-gray-955 mb-2">No orders found</h3>
              <p className="text-xs sm:text-sm text-gray-500 font-semibold">
                There are currently no customer orders logged in the database.
              </p>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="glass-card rounded-[2.5rem] shadow-glass overflow-hidden"
            >
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-100 text-sm text-start">
                  <thead className="bg-slate-50/70 text-gray-500 font-bold">
                    <tr>
                      <th className="px-6 py-4 text-left font-bold tracking-wider">User</th>
                      <th className="px-6 py-4 text-left font-bold tracking-wider">Products Info</th>
                      <th className="px-6 py-4 text-left font-bold tracking-wider">Total Amount</th>
                      <th className="px-6 py-4 text-left font-bold tracking-wider">Status</th>
                      <th className="px-6 py-4 text-left font-bold tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {orders.map((order, index) => {
                      const badge = getStatusBadge(order.status);
                      return (
                        <tr
                          key={order.id || order._id || `order-${index}`}
                          className="hover:bg-slate-50/50 transition duration-150"
                        >
                          {/* User Details */}
                          <td className="px-6 py-5 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
                                {order.user?.name ? order.user.name.charAt(0).toUpperCase() : <FiUser />}
                              </div>
                              <div className="text-start">
                                <p className="font-bold text-gray-800 text-sm">
                                  {order.user?.name || "Anonymous User"}
                                </p>
                                <p className="text-[10px] text-gray-400 font-medium tracking-tight">
                                  ID: {(order.id && order.id.startsWith("SAN")) ? order.id : `#${(order.id || '').substring(Math.max(0, (order.id || '').length - 8)).toUpperCase()}`}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Products */}
                          <td className="px-6 py-5">
                            <div className="space-y-2 text-start">
                              {order.products.map((p, index) => (
                                <div
                                  key={`${p.product?.id || "no-id"}-${index}`}
                                  className="flex items-center gap-2"
                                >
                                  <div className="w-8 h-8 border border-gray-100 bg-white rounded-lg flex items-center justify-center p-1 overflow-hidden flex-shrink-0">
                                    <img
                                      src={p.product?.images?.[0] || "/placeholder.svg"}
                                      alt={p.product?.name}
                                      className="max-w-full max-h-full object-contain"
                                      onError={(e) => {
                                        e.target.src = "/placeholder.svg";
                                      }}
                                    />
                                  </div>
                                  <span className="text-xs font-semibold text-gray-700 truncate max-w-[200px]">
                                    {p.product?.name || "Product Item"}
                                  </span>
                                  <span className="text-[10px] text-gray-400 font-bold bg-slate-100/80 px-1.5 py-0.5 rounded-md">
                                    ×{p.quantity}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </td>

                          {/* Total Amount */}
                          <td className="px-6 py-5 whitespace-nowrap text-start">
                            <div className="flex items-center font-black text-gray-900 text-sm">
                              ₹{order.totalAmount.toFixed(2)}
                            </div>
                          </td>

                          {/* Status Badge */}
                          <td className="px-6 py-5 whitespace-nowrap text-start">
                            <div
                              className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold border rounded-full ${badge.bg}`}
                            >
                              {badge.icon}
                              <span className="capitalize">{order.status}</span>
                            </div>
                          </td>

                          {/* Change Status Action */}
                          <td className="px-6 py-5 whitespace-nowrap text-start">
                            <div className="relative inline-block w-40">
                              <select
                                value={order.status}
                                onChange={(e) => updateStatus(order.id || order._id, e.target.value)}
                                className="w-full text-xs font-bold text-gray-700 bg-white border border-gray-200 hover:border-gray-300 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer transition"
                              >
                                <option value="paid">Paid</option>
                                <option value="processing">Processing</option>
                                <option value="shipped">Shipped</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                                <option value="refunded">Refunded</option>
                              </select>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )
        ) : (
          loadingReturns ? (
            <div className="min-h-[30vh] flex items-center justify-center">
              <div className="w-6 h-6 border-4 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : returns.length === 0 ? (
            <div className="bg-white border border-gray-100 rounded-3xl p-12 text-center max-w-lg mx-auto shadow-sm">
              <div className="w-16 h-16 rounded-full bg-slate-50 border border-gray-100 flex items-center justify-center mx-auto mb-6 text-2xl text-gray-400">
                <FiPackage />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">No return requests</h3>
              <p className="text-sm text-gray-500">
                There are currently no product return requests submitted.
              </p>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden"
            >
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-100 text-sm text-start">
                  <thead className="bg-slate-50/70 text-gray-500 font-bold">
                    <tr>
                      <th className="px-6 py-4 text-left font-bold tracking-wider">User</th>
                      <th className="px-6 py-4 text-left font-bold tracking-wider">Product Info</th>
                      <th className="px-6 py-4 text-left font-bold tracking-wider">Reason & Details</th>
                      <th className="px-6 py-4 text-left font-bold tracking-wider">Return Option</th>
                      <th className="px-6 py-4 text-left font-bold tracking-wider">Photos</th>
                      <th className="px-6 py-4 text-left font-bold tracking-wider">Status</th>
                      <th className="px-6 py-4 text-left font-bold tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {returns.map((ret, index) => {
                      const isPending = ret.status === "pending";
                      return (
                        <tr key={ret._id || ret.id || `ret-${index}`} className="hover:bg-slate-50/50 transition duration-150">
                          <td className="px-6 py-5 whitespace-nowrap">
                            <div className="text-start">
                              <p className="font-bold text-gray-800 text-sm">{ret.userId?.name || "Anonymous"}</p>
                              <p className="text-xs text-gray-400">{ret.userId?.email || "No Email"}</p>
                            </div>
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap">
                            <div className="flex items-center gap-3 text-start">
                              <div className="w-10 h-10 border border-gray-100 bg-white rounded-lg flex items-center justify-center p-1 overflow-hidden flex-shrink-0">
                                <img
                                  src={ret.productId?.images?.[0] || "/placeholder.svg"}
                                  alt={ret.productId?.name}
                                  className="max-w-full max-h-full object-contain"
                                />
                              </div>
                              <div>
                                <p className="font-bold text-gray-850 text-xs truncate max-w-[150px]">{ret.productId?.name || "Unknown Product"}</p>
                                <p className="text-[10px] text-gray-400">Price: ₹{ret.productId?.price || "N/A"}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-5 text-start">
                            <p className="font-bold text-gray-800 text-xs">{ret.reason}</p>
                            {ret.details && <p className="text-[10px] text-gray-500 mt-1 max-w-[200px] leading-relaxed line-clamp-2">{ret.details}</p>}
                          </td>
                          <td className="px-6 py-5 text-start">
                            <span className={`inline-block px-2.5 py-0.5 text-[10px] font-bold rounded-md ${
                              ret.returnOption === "Refund" ? "bg-amber-50 text-amber-700" : "bg-blue-50 text-blue-700"
                            }`}>
                              {ret.returnOption}
                            </span>
                          </td>
                          <td className="px-6 py-5">
                            <div className="flex gap-1.5 flex-wrap max-w-[150px]">
                              {ret.images && ret.images.map((img, idx) => (
                                <a key={idx} href={img} target="_blank" rel="noopener noreferrer" className="w-8 h-8 border border-gray-100 rounded-lg overflow-hidden flex items-center justify-center p-0.5 bg-gray-50 hover:opacity-85 transition">
                                  <img src={img} alt="return proof" className="max-w-full max-h-full object-contain" />
                                </a>
                              ))}
                              {(!ret.images || ret.images.length === 0) && <span className="text-[10px] text-gray-400 italic">No Photos</span>}
                            </div>
                          </td>
                          <td className="px-6 py-5 text-start">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold border rounded-full ${
                              ret.status === "approved"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                                : ret.status === "rejected"
                                ? "bg-red-50 text-red-700 border-red-100"
                                : "bg-amber-50 text-amber-700 border-amber-100 animate-pulse"
                            }`}>
                              {ret.status}
                            </span>
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap text-start">
                            {isPending ? (
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleUpdateReturnStatus(ret._id || ret.id, "approved")}
                                  className="px-3 py-1.5 text-[10px] font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition active:scale-95"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleUpdateReturnStatus(ret._id || ret.id, "rejected")}
                                  className="px-3 py-1.5 text-[10px] font-bold text-white bg-red-600 hover:bg-red-755 rounded-lg transition active:scale-95"
                                >
                                  Reject
                                </button>
                              </div>
                            ) : (
                              <span className="text-[10px] text-gray-400 italic">Processed</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
