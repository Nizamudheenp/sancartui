import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { motion } from "framer-motion";
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
} from "react-icons/fi";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const updateStatus = async (orderId, newStatus) => {
    try {
      const res = await api.put(
        `/api/orders/updateorderstatus/${orderId}`,
        { status: newStatus }
      );

      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: res.data.status } : order
        )
      );
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  useEffect(() => {
    fetchOrders();
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
        <span className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-semibold text-gray-500">Loading incoming orders...</p>
      </div>
    );
  }

  // Calculate quick admin stats
  const totalAmount = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const pendingOrders = orders.filter((o) => o.status === "processing").length;

  return (
    <div className="min-h-screen bg-slate-50/50 px-4 md:px-8 pt-28 pb-16">
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="text-start mb-8">
          <span className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary-600 bg-primary-50 rounded-lg mb-3">
            Admin Panel
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
            Manage Orders
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Track customer purchases, update delivery status, and review business transactions
          </p>
        </div>

        {/* Stats Summary Panel */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10 text-start">
          <div className="bg-white border border-gray-100/80 p-6 rounded-2xl shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center text-primary-500 text-xl flex-shrink-0">
              <FiLayers />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                Total Placed Orders
              </p>
              <p className="text-2xl font-black text-gray-900 mt-0.5">
                {orders.length}
              </p>
            </div>
          </div>

          <div className="bg-white border border-gray-100/80 p-6 rounded-2xl shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500 text-xl flex-shrink-0">
              <FiTrendingUp />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                Gross Revenue
              </p>
              <p className="text-2xl font-black text-gray-900 mt-0.5">
                ₹{totalAmount.toFixed(2)}
              </p>
            </div>
          </div>

          <div className="bg-white border border-gray-100/80 p-6 rounded-2xl shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-500 text-xl flex-shrink-0">
              <FiClock className="animate-pulse" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                Processing Orders
              </p>
              <p className="text-2xl font-black text-gray-900 mt-0.5">
                {pendingOrders}
              </p>
            </div>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-3xl p-12 text-center max-w-lg mx-auto shadow-sm">
            <div className="w-16 h-16 rounded-full bg-slate-50 border border-gray-100 flex items-center justify-center mx-auto mb-6 text-2xl text-gray-400">
              <FiPackage />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">No orders found</h3>
            <p className="text-sm text-gray-500">
              There are currently no customer orders logged in the database.
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
                    <th className="px-6 py-4 text-left font-bold tracking-wider">Products Info</th>
                    <th className="px-6 py-4 text-left font-bold tracking-wider">Total Amount</th>
                    <th className="px-6 py-4 text-left font-bold tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left font-bold tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.map((order) => {
                    const badge = getStatusBadge(order.status);
                    return (
                      <tr
                        key={order.id}
                        className="hover:bg-slate-50/50 transition duration-150"
                      >
                        {/* User Details */}
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-600 font-bold text-sm">
                              {order.user?.name ? order.user.name.charAt(0).toUpperCase() : <FiUser />}
                            </div>
                            <div className="text-start">
                              <p className="font-bold text-gray-800 text-sm">
                                {order.user?.name || "Anonymous User"}
                              </p>
                              <p className="text-[10px] text-gray-400 font-medium tracking-tight">
                                ID: #{order.id.substring(order.id.length - 8).toUpperCase()}
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
                              onChange={(e) => updateStatus(order.id, e.target.value)}
                              className="w-full text-xs font-bold text-gray-700 bg-white border border-gray-200 hover:border-gray-300 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 cursor-pointer transition"
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
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
