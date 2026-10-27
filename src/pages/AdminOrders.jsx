import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { motion, AnimatePresence } from "framer-motion";
import { showToast } from "../utils/toast";
import SearchBar from "../components/SearchBar";
import {
  FiUser,
  FiPackage,
  FiCheckCircle,
  FiClock,
  FiTruck,
  FiAlertCircle,
  FiTrendingUp,
  FiLayers,
  FiMapPin,
  FiCopy,
  FiCalendar,
  FiCreditCard,
  FiX,
  FiCheck,
  FiPrinter,
  FiMail,
  FiPhone,
  FiFilter,
  FiChevronDown,
} from "react-icons/fi";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("orders");
  const [returns, setReturns] = useState([]);
  const [loadingReturns, setLoadingReturns] = useState(false);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Order Details Modal state
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [copiedAddress, setCopiedAddress] = useState(false);

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
          order.id === orderIdentifier || order._id === orderIdentifier
            ? { ...order, status: res.data?.status || newStatus }
            : order
        )
      );

      if (selectedOrder && (selectedOrder.id === orderIdentifier || selectedOrder._id === orderIdentifier)) {
        setSelectedOrder((prev) => ({ ...prev, status: res.data?.status || newStatus }));
      }

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

  const formatAddressForCourier = (address) => {
    if (!address) return "";
    const lines = [];
    if (address.fullName) lines.push(`Recipient: ${address.fullName}`);
    if (address.phone) lines.push(`Phone: +91 ${address.phone}`);
    const streetPart = [address.street, address.landmark].filter(Boolean).join(", ");
    if (streetPart) lines.push(`Address: ${streetPart}`);
    const cityStatePin = [address.city, address.state].filter(Boolean).join(", ") + (address.pincode ? ` - ${address.pincode}` : "");
    if (cityStatePin.trim()) lines.push(cityStatePin);
    return lines.join("\n");
  };

  const handleCopyAddress = (address) => {
    if (!address) return;
    const textToCopy = formatAddressForCourier(address);
    navigator.clipboard.writeText(textToCopy);
    setCopiedAddress(true);
    showToast("success", "Courier-formatted address copied to clipboard!");
    setTimeout(() => setCopiedAddress(false), 2000);
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

  // Filter orders based on search query and status filter
  const filteredOrders = orders.filter((order) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      (order.id && order.id.toLowerCase().includes(q)) ||
      (order.user?.name && order.user.name.toLowerCase().includes(q)) ||
      (order.user?.email && order.user.email.toLowerCase().includes(q)) ||
      (order.guestEmail && order.guestEmail.toLowerCase().includes(q)) ||
      (order.shippingAddress && order.shippingAddress.toLowerCase().includes(q));

    const matchesStatus =
      statusFilter === "all" || order.status?.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 pt-28 text-slate-800 font-sans print:p-0 print:m-0 print:max-w-none">
      <div className={selectedOrder ? "print:hidden" : ""}>
        {/* Page Header */}
        <div className="text-start mb-8">
          <span className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary-600 bg-primary-500/10 rounded-lg mb-3">
            Admin Panel
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-gray-955 tracking-tight">
            Manage Orders
          </h2>
          <p className="text-gray-500 text-sm font-semibold mt-1">
            Track customer purchases, review shipping addresses, update delivery status, and review business transactions
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
            className={`px-6 py-3 text-xs font-bold rounded-2xl transition-all ${activeTab === "orders"
              ? "bg-brand-gradient text-white shadow-md"
              : "bg-white/40 border border-white/50 hover:bg-white text-gray-700"
              }`}
          >
            All Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab("returns")}
            className={`px-6 py-3 text-xs font-bold rounded-2xl transition-all ${activeTab === "returns"
              ? "bg-brand-gradient text-white shadow-md"
              : "bg-white/40 border border-white/50 hover:bg-white text-gray-700"
              }`}
          >
            Return Requests ({returns.length})
          </button>
        </div>

        {activeTab === "orders" ? (
          <div>
            {/* Search & Status Filters Bar */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-6">
              {/* Search Box */}
              <SearchBar
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onClear={() => setSearchQuery("")}
                placeholder="Search by Order ID, Customer, Email, Address..."
                className="max-w-md"
              />

              {/* Desktop Status Filter Badges */}
              <div className="hidden md:flex flex-wrap items-center gap-1.5">
                {["all", "processing", "paid", "shipped", "delivered", "cancelled", "refunded"].map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-3.5 py-1.5 text-xs font-bold rounded-xl capitalize transition-all ${statusFilter === status
                      ? "bg-brand-gradient text-white shadow-md shadow-primary-500/20"
                      : "bg-white/50 border border-white/60 text-gray-600 hover:bg-white"
                      }`}
                  >
                    {status}
                  </button>
                ))}
              </div>

              {/* Mobile Status Filter Dropdown (Matches Shop Page Responsiveness) */}
              <div className="flex md:hidden w-full items-center">
                <div className="relative w-full">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400 pointer-events-none text-xs">
                    <FiFilter />
                  </span>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full pl-9 pr-8 py-2.5 bg-white/70 backdrop-blur-md border border-white/60 rounded-2xl text-xs font-bold text-gray-700 capitalize focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 shadow-sm transition appearance-none cursor-pointer"
                  >
                    <option value="all">All Statuses ({orders.length})</option>
                    <option value="processing">Processing</option>
                    <option value="paid">Paid</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="refunded">Refunded</option>
                  </select>
                  <FiChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xs" />
                </div>
              </div>
            </div>

            {filteredOrders.length === 0 ? (
              <div className="glass-card rounded-[2.5rem] p-12 text-center max-w-lg mx-auto shadow-glass">
                <div className="w-16 h-16 rounded-full bg-white/40 border border-white/50 flex items-center justify-center mx-auto mb-6 text-2xl text-gray-400 shadow-sm">
                  <FiPackage />
                </div>
                <h3 className="text-lg font-extrabold text-gray-955 mb-2">No matching orders</h3>
                <p className="text-xs sm:text-sm text-gray-500 font-semibold">
                  {searchQuery || statusFilter !== "all"
                    ? "No orders match your filter criteria. Try clearing search or filters."
                    : "There are currently no customer orders logged in the database."}
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
                        <th className="px-6 py-4 text-left font-bold tracking-wider">Order ID</th>
                        <th className="px-6 py-4 text-left font-bold tracking-wider">Customer</th>
                        <th className="px-6 py-4 text-left font-bold tracking-wider">Products Info</th>
                        <th className="px-6 py-4 text-left font-bold tracking-wider">Total</th>
                        <th className="px-6 py-4 text-left font-bold tracking-wider">Status</th>
                        <th className="px-6 py-4 text-center font-bold tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredOrders.map((order, index) => {
                        const badge = getStatusBadge(order.status);
                        const formattedId =
                          order.id && order.id.startsWith("SAN")
                            ? order.id
                            : `#${(order.id || "").substring(Math.max(0, (order.id || "").length - 8)).toUpperCase()}`;

                        return (
                          <tr
                            key={order.id || order._id || `order-${index}`}
                            className="hover:bg-slate-50/50 transition duration-150"
                          >
                            {/* Column 1: Order ID */}
                            <td className="px-6 py-5 whitespace-nowrap text-start">
                              <span className="font-mono font-extrabold text-xs text-primary-600 bg-primary-50 px-2.5 py-1 rounded-lg border border-primary-100/60 inline-block">
                                {formattedId}
                              </span>
                            </td>

                            {/* Column 2: Customer Name & Date */}
                            <td className="px-6 py-5 whitespace-nowrap">
                              <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs flex-shrink-0">
                                  {order.user?.name ? order.user.name.charAt(0).toUpperCase() : <FiUser />}
                                </div>
                                <div className="text-start">
                                  <p className="font-bold text-gray-850 text-sm leading-tight">
                                    {order.user?.name || "Guest Buyer"}
                                  </p>
                                  {order.createdAt && (
                                    <p className="text-[11px] text-gray-400 font-medium mt-0.5">
                                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                                        day: "numeric",
                                        month: "short",
                                        year: "numeric",
                                      })}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </td>

                            {/* Products */}
                            <td className="px-6 py-5">
                              <div className="space-y-2 text-start">
                                {order.products.map((p, pIdx) => (
                                  <div
                                    key={`${p.product?.id || "no-id"}-${pIdx}`}
                                    className="flex items-center gap-2"
                                  >
                                    <div className="w-8 h-8 border border-gray-100 bg-white rounded-lg flex items-center justify-center p-1 overflow-hidden flex-shrink-0">
                                      <img
                                        src={p.product?.images?.[0] || "/placeholder.svg"}
                                        alt={p.product?.name}
                                        className="w-full h-full object-fill"
                                        onError={(e) => {
                                          e.target.src = "/placeholder.svg";
                                        }}
                                      />
                                    </div>
                                    <span className="text-xs font-semibold text-gray-700 truncate max-w-[150px]">
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

                            {/* Actions: View Details + Status Dropdown */}
                            <td className="px-6 py-5 whitespace-nowrap text-center">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() => setSelectedOrder(order)}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-gray-700 bg-white border border-gray-200 hover:border-primary-500 hover:text-primary-600 rounded-xl transition shadow-sm"
                                  title="View Full Order & Address Details"
                                >
                                  <FiEye className="text-sm" />
                                  <span>Details</span>
                                </button>
                                <select
                                  value={order.status}
                                  onChange={(e) => updateStatus(order.id || order._id, e.target.value)}
                                  className="text-xs font-bold text-gray-700 bg-white border border-gray-200 hover:border-gray-300 rounded-xl px-2.5 py-1.5 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer transition shadow-sm"
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
        ) : loadingReturns ? (
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
                      <tr
                        key={ret._id || ret.id || `ret-${index}`}
                        className="hover:bg-slate-50/50 transition duration-150"
                      >
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
                              <p className="font-bold text-gray-850 text-xs truncate max-w-[150px]">
                                {ret.productId?.name || "Unknown Product"}
                              </p>
                              <p className="text-[10px] text-gray-400">Price: ₹{ret.productId?.price || "N/A"}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-start">
                          <p className="font-bold text-gray-800 text-xs">{ret.reason}</p>
                          {ret.details && (
                            <p className="text-[10px] text-gray-500 mt-1 max-w-[200px] leading-relaxed line-clamp-2">
                              {ret.details}
                            </p>
                          )}
                        </td>
                        <td className="px-6 py-5 text-start">
                          <span
                            className={`inline-block px-2.5 py-0.5 text-[10px] font-bold rounded-md ${ret.returnOption === "Refund"
                              ? "bg-amber-50 text-amber-700"
                              : "bg-blue-50 text-blue-700"
                              }`}
                          >
                            {ret.returnOption}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex gap-1.5 flex-wrap max-w-[150px]">
                            {ret.images &&
                              ret.images.map((img, idx) => (
                                <a
                                  key={idx}
                                  href={img}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="w-8 h-8 border border-gray-100 rounded-lg overflow-hidden flex items-center justify-center p-0.5 bg-gray-50 hover:opacity-85 transition"
                                >
                                  <img
                                    src={img}
                                    alt="return proof"
                                    className="max-w-full max-h-full object-contain"
                                  />
                                </a>
                              ))}
                            {(!ret.images || ret.images.length === 0) && (
                              <span className="text-[10px] text-gray-400 italic">No Photos</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-5 text-start">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold border rounded-full ${ret.status === "approved"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                              : ret.status === "rejected"
                                ? "bg-red-50 text-red-700 border-red-100"
                                : "bg-amber-50 text-amber-700 border-amber-100 animate-pulse"
                              }`}
                          >
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
        )}
      </div>

      {/* FULL ORDER DETAILS MODAL */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto print:static print:p-0 print:m-0 print:overflow-visible print:block print:inset-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={() => setSelectedOrder(null)}
              className="fixed inset-0 bg-slate-950/40 no-print"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="relative w-full max-w-lg sm:max-w-xl bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden z-10 my-3 text-start print:shadow-none print:border-none print:p-0 print:max-w-none print:m-0 print:static"
            >
              {/* Print-Only Packing Slip Header */}
              <div className="hidden print:flex items-center justify-between pb-3 mb-4 border-b-2 border-gray-900">
                <div>
                  <h1 className="text-2xl font-black text-gray-900 tracking-tight">SANCART</h1>
                  <p className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider">Official Order Packing Slip</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-mono font-black text-gray-900">{selectedOrder.id}</p>
                  <p className="text-[11px] text-gray-500 font-medium">
                    {selectedOrder.createdAt
                      ? new Date(selectedOrder.createdAt).toLocaleDateString("en-IN", {
                        dateStyle: "medium",
                      })
                      : "Date N/A"}
                  </p>
                </div>
              </div>

              <div className="px-6 pt-5 pb-3 border-b border-gray-100 flex items-center justify-between print:px-0 print:pt-0">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-extrabold text-gray-900 font-mono">
                      {selectedOrder.id && selectedOrder.id.startsWith("SAN")
                        ? selectedOrder.id
                        : `#${(selectedOrder.id || "").substring(Math.max(0, (selectedOrder.id || "").length - 8)).toUpperCase()}`}
                    </h3>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold border rounded-full capitalize ${getStatusBadge(selectedOrder.status).bg
                        }`}
                    >
                      {selectedOrder.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-0.5 flex items-center gap-1 font-medium">
                    <FiCalendar className="text-[10px]" />
                    {selectedOrder.createdAt
                      ? new Date(selectedOrder.createdAt).toLocaleString("en-IN", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })
                      : "Date not recorded"}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 no-print">
                  <button
                    onClick={() => window.print()}
                    className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-50 rounded-lg border border-gray-200 transition"
                    title="Print Invoice / Packing Slip"
                  >
                    <FiPrinter className="text-sm" />
                  </button>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-50 rounded-lg border border-gray-200 transition"
                  >
                    <FiX className="text-sm" />
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-5 space-y-3 max-h-[72vh] overflow-y-auto print:max-h-none print:overflow-visible print:p-0">
                {/* 1. Order Status Control Card (Admin only, hidden on print) */}
                <div className="bg-slate-50/70 border border-slate-200/60 rounded-2xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 no-print">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-primary-500/10 text-primary-600 flex items-center justify-center text-base flex-shrink-0">
                      <FiTruck />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-900">
                        Order Lifecycle Status
                      </p>
                      <p className="text-[10px] text-gray-400 font-medium">
                        Update customer shipment & delivery progression
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={selectedOrder.status}
                      onChange={(e) => updateStatus(selectedOrder.id || selectedOrder._id, e.target.value)}
                      className="text-xs font-bold text-gray-700 bg-white border border-gray-200 hover:border-primary-500 rounded-xl px-2.5 py-1.5 outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 cursor-pointer shadow-2xs transition"
                    >
                      <option value="paid">Paid</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="refunded">Refunded</option>
                    </select>
                  </div>
                </div>

                {/* 2. Customer & Payment Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {/* Customer Information Card */}
                  <div className="bg-slate-50/70 border border-slate-200/60 rounded-2xl p-3.5">
                    <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                      <FiUser className="text-primary-600" /> Customer Info
                    </p>
                    <p className="font-bold text-gray-900 text-xs sm:text-sm">
                      {selectedOrder.user?.name || "Guest Buyer"}
                    </p>
                    <p className="text-xs text-gray-600 mt-1 flex items-center gap-1">
                      <FiMail className="text-gray-400 flex-shrink-0 text-[11px]" />
                      <a
                        href={`mailto:${selectedOrder.user?.email || selectedOrder.guestEmail}`}
                        className="hover:underline text-primary-600 font-medium truncate max-w-[170px]"
                      >
                        {selectedOrder.user?.email || selectedOrder.guestEmail || "No Email Provided"}
                      </a>
                    </p>
                    {(selectedOrder.customerPhone || selectedOrder.shippingAddress?.phone) && (
                      <p className="text-xs text-gray-600 mt-1 flex items-center gap-1">
                        <FiPhone className="text-gray-400 flex-shrink-0 text-[11px]" />
                        <a
                          href={`tel:${selectedOrder.customerPhone || selectedOrder.shippingAddress?.phone}`}
                          className="hover:underline text-primary-600 font-medium font-mono text-xs"
                        >
                          +91 {selectedOrder.customerPhone || selectedOrder.shippingAddress?.phone}
                        </a>
                      </p>
                    )}
                    <span className="inline-block mt-2 text-[9px] font-bold px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md">
                      {selectedOrder.user ? "Registered Account" : "Guest Checkout"}
                    </span>
                  </div>

                  {/* Payment Details Card */}
                  <div className="bg-slate-50/70 border border-slate-200/60 rounded-2xl p-3.5">
                    <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                      <FiCreditCard className="text-emerald-600" /> Payment Details
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-gray-500 font-medium">Method:</span>
                      <span
                        className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded ${selectedOrder.paymentMethod === "COD"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-emerald-100 text-emerald-800"
                          }`}
                      >
                        {selectedOrder.paymentMethod || "Online"}
                      </span>
                    </div>
                    {selectedOrder.paymentId && selectedOrder.paymentId !== "COD" && (
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-[11px] text-gray-500 font-medium">Payment ID:</span>
                        <span className="text-[10px] font-mono text-gray-700 font-semibold truncate max-w-[130px]">
                          {selectedOrder.paymentId}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-gray-200/60">
                      <span className="text-[11px] font-bold text-gray-700">Total Paid:</span>
                      <span className="text-sm font-black text-gray-900">
                        ₹{selectedOrder.totalAmount?.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 3. Full Shipping Address Card */}
                <div className="bg-slate-50/70 border border-slate-200/60 rounded-2xl p-3.5">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                      <FiMapPin className="text-rose-500 text-xs" /> Courier Shipping Address
                    </p>
                    <button
                      onClick={() => handleCopyAddress(selectedOrder.shippingAddress)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg shadow-2xs transition no-print"
                      title="Copy courier-formatted address for Delhivery / BlueDart / DTDC"
                    >
                      {copiedAddress ? (
                        <>
                          <FiCheck className="text-emerald-600" /> Copied!
                        </>
                      ) : (
                        <>
                          <FiCopy /> Copy for Courier
                        </>
                      )}
                    </button>
                  </div>
                  <div className="bg-white border border-gray-200/60 rounded-xl p-3">
                    {selectedOrder.shippingAddress ? (
                      <div className="space-y-1.5 text-xs text-gray-800">
                        <div className="flex flex-wrap items-center justify-between gap-2 pb-1.5 border-b border-gray-100">
                          <span className="font-extrabold text-gray-900 text-xs sm:text-sm">
                            {selectedOrder.shippingAddress.fullName || "Recipient Name Not Provided"}
                          </span>
                          {selectedOrder.shippingAddress.phone && (
                            <a
                              href={`tel:${selectedOrder.shippingAddress.phone}`}
                              className="inline-flex items-center gap-1 text-[11px] font-bold text-primary-600 bg-primary-50 hover:bg-primary-100 px-2.5 py-0.5 rounded-full transition"
                            >
                              <FiPhone className="text-[10px]" /> +91 {selectedOrder.shippingAddress.phone}
                            </a>
                          )}
                        </div>
                        <p className="font-medium text-gray-700 leading-snug">
                          {selectedOrder.shippingAddress.street}
                        </p>
                        {selectedOrder.shippingAddress.landmark && (
                          <p className="text-[11px] text-gray-500 font-medium">
                            <span className="font-semibold text-gray-600">Landmark:</span> {selectedOrder.shippingAddress.landmark}
                          </p>
                        )}
                        <div className="flex items-center gap-2 pt-1">
                          <span className="font-bold text-gray-900">
                            {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}
                          </span>
                          {selectedOrder.shippingAddress.pincode && (
                            <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md font-mono text-[11px] font-bold">
                              PIN: {selectedOrder.shippingAddress.pincode}
                            </span>
                          )}
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-gray-400 italic">No delivery address provided.</p>
                    )}
                  </div>
                </div>

                {/* 4. Ordered Products Table */}
                <div className="bg-slate-50/70 border border-slate-200/60 rounded-2xl p-3.5">
                  <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-2">
                    Order Items ({selectedOrder.products?.length || 0})
                  </p>
                  <div className="space-y-1.5">
                    {selectedOrder.products?.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 bg-white border border-gray-200/60 rounded-xl flex items-center justify-between gap-2.5 shadow-2xs"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-lg border border-gray-100 bg-white flex items-center justify-center p-1 overflow-hidden flex-shrink-0">
                            <img
                              src={item.product?.images?.[0] || "/placeholder.svg"}
                              alt={item.product?.name}
                              className="w-full h-full object-fill"
                              onError={(e) => {
                                e.target.src = "/placeholder.svg";
                              }}
                            />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-gray-900 line-clamp-1">
                              {item.product?.name || "Product Item"}
                            </p>
                            <p className="text-[10px] text-gray-400 mt-0.5">
                              ₹{(item.product?.price || 0).toFixed(2)} × {item.quantity}
                            </p>
                          </div>
                        </div>

                        <div className="text-right flex-shrink-0">
                          <p className="text-xs font-extrabold text-gray-900">
                            ₹{((item.product?.price || 0) * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Modal Footer - Seamless, clean standard (hidden on print) */}
              <div className="px-6 py-3.5 border-t border-gray-100 flex items-center justify-end no-print">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-6 py-2 bg-brand-gradient hover:opacity-95 text-white text-xs font-extrabold rounded-xl shadow-md shadow-primary-500/20 active:scale-95 transition"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminOrders;
