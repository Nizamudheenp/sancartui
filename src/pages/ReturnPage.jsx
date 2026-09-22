import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../utils/api";
import { showToast } from "../utils/toast";
import SEO from "../components/SEO";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiCheckCircle,
  FiClock,
  FiPhone,
  FiInfo,
  FiSearch,
  FiUpload,
  FiBox,
  FiFileText,
  FiHelpCircle
} from "react-icons/fi";

const REASONS = [
  "Damaged product",
  "Product doesn't match description",
  "Wrong product received",
  "Changed my mind",
  "Product is defective",
  "Size/fit issue"
];

const ReturnPage = () => {
  const [orderNumber, setOrderNumber] = useState("");
  const [loadingOrder, setLoadingOrder] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [images, setImages] = useState([]);
  const [returnOption, setReturnOption] = useState("Refund");
  const [submitting, setSubmitting] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [imagePreviews, setImagePreviews] = useState([]);
  
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      // Clean up object URLs on component unmount to prevent memory leaks
      imagePreviews.forEach(p => URL.revokeObjectURL(p.url));
    };
  }, [imagePreviews]);

  useEffect(() => {
    const orderIdParam = searchParams.get("orderId");
    const productIdParam = searchParams.get("productId");

    if (orderIdParam) {
      setOrderNumber(orderIdParam);
      const fetchOrder = async () => {
        setLoadingOrder(true);
        try {
          const user = JSON.parse(localStorage.getItem('user') || 'null');
          const emailQuery = user?.email ? `?email=${encodeURIComponent(user.email)}` : '';
          const res = await api.get(`/api/orders/details/${orderIdParam}${emailQuery}`);
          setSelectedOrder(res.data);
          
          if (productIdParam) {
            const matchingItem = res.data.products?.find(p => {
              const idVal = p.product?.id || p.product?._id || p.product;
              return idVal === productIdParam;
            });
            if (matchingItem) {
              setSelectedProduct(matchingItem);
            }
          }
        } catch (err) {
          console.error("Auto load order failed:", err);
        } finally {
          setLoadingOrder(false);
        }
      };
      fetchOrder();
    }
  }, [searchParams]);

  const handleFindOrder = async (e) => {
    e.preventDefault();
    if (!orderNumber.trim()) {
      showToast("error", "Please enter an order number");
      return;
    }
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    const emailToUse = user?.email || registeredEmail.trim();
    if (!emailToUse) {
      showToast("error", "Please enter your registered email address");
      return;
    }
    setLoadingOrder(true);
    setSelectedOrder(null);
    setSelectedProduct(null);
    
    try {
      const res = await api.get(`/api/orders/details/${orderNumber.trim()}?email=${encodeURIComponent(emailToUse)}`);
      setSelectedOrder(res.data);
      showToast("success", "Order found!");
    } catch (err) {
      console.error(err);
      showToast("error", err.response?.data?.message || "Order not found or authorization failed.");
    } finally {
      setLoadingOrder(false);
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 5) {
      showToast("error", "You can upload a maximum of 5 photos");
      return;
    }

    const validFiles = [];
    const newPreviews = [];

    for (let file of files) {
      if (!file.type.startsWith("image/")) {
        showToast("error", `File "${file.name}" is not a valid image`);
        continue;
      }
      if (file.size > 5 * 1024 * 1024) {
        showToast("error", `Image "${file.name}" exceeds 5MB limit`);
        continue;
      }
      validFiles.push(file);
      const url = URL.createObjectURL(file);
      newPreviews.push({ file, url });
    }

    if (validFiles.length > 0) {
      setImages(prev => [...prev, ...validFiles]);
      setImagePreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const handleRemoveImage = (index) => {
    const target = imagePreviews[index];
    if (target) {
      URL.revokeObjectURL(target.url);
    }
    setImages(prev => prev.filter((_, idx) => idx !== index));
    setImagePreviews(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleSubmitReturn = async (e) => {
    e.preventDefault();
    if (!selectedOrder) {
      showToast("error", "Please select an order first");
      return;
    }
    if (!selectedProduct) {
      showToast("error", "Please select a product to return");
      return;
    }
    if (!reason) {
      showToast("error", "Please select a reason");
      return;
    }

    setSubmitting(true);
    const formData = new FormData();
    formData.append("orderId", selectedOrder.id);
    
    // Extract actual product ID
    const prodId = selectedProduct.product?.id || selectedProduct.product?._id || selectedProduct.product;
    formData.append("productId", prodId);
    
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    const emailToUse = user?.email || registeredEmail.trim();
    if (emailToUse) {
      formData.append("email", emailToUse);
    }

    formData.append("reason", reason);
    formData.append("details", details);
    formData.append("returnOption", returnOption);
    
    images.forEach(img => {
      formData.append("images", img);
    });

    try {
      await api.post("/api/returns/request", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      showToast("success", "Return request submitted successfully!");
      navigate("/myorders");
    } catch (err) {
      console.error(err);
      showToast("error", err.response?.data?.message || "Failed to submit return request");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <SEO 
        title="Return Your Product" 
        description="Easy return and refund requests for your sancart orders." 
      />
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 mb-10 sm:mb-12 pt-24 sm:pt-28 text-slate-800 font-sans">
        
        {/* Header Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 space-y-3 sm:space-y-4">
          <span className="inline-block px-3 py-1 sm:px-3.5 sm:py-1.5 text-[10px] sm:text-xs font-extrabold uppercase tracking-wider text-primary-600 bg-primary-500/10 rounded-xl">
            Returns & Refunds
          </span>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-gray-955 tracking-tight leading-tight">
            Return Your <span className="text-brand-gradient">Product</span>
          </h1>
          <p className="text-gray-500 text-xs sm:text-base leading-relaxed max-w-xl mx-auto font-semibold px-2">
            We're here to make your return process simple, straightforward, and completely hassle-free.
          </p>

          {/* Benefit Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-4 pt-2 sm:pt-4 max-w-3xl mx-auto">
            <div className="flex items-center gap-3 bg-white/45 backdrop-blur-md p-3 sm:p-4 rounded-2xl border border-white/60 shadow-sm text-start">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-primary-500/10 flex items-center justify-center flex-shrink-0">
                <FiCheckCircle className="text-lg sm:text-xl text-primary-600" />
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-gray-955 uppercase tracking-wider">Easy Returns</h4>
                <p className="text-[10px] text-gray-500 font-semibold mt-0.5">Hassle-free process</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white/45 backdrop-blur-md p-3 sm:p-4 rounded-2xl border border-white/60 shadow-sm text-start">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-primary-500/10 flex items-center justify-center flex-shrink-0">
                <FiClock className="text-lg sm:text-xl text-primary-600" />
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-gray-955 uppercase tracking-wider">Quick Refunds</h4>
                <p className="text-[10px] text-gray-500 font-semibold mt-0.5">Within 5-7 business days</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white/45 backdrop-blur-md p-3 sm:p-4 rounded-2xl border border-white/60 shadow-sm text-start">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-primary-500/10 flex items-center justify-center flex-shrink-0">
                <FiPhone className="text-lg sm:text-xl text-primary-600" />
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-gray-955 uppercase tracking-wider">24/7 Support</h4>
                <p className="text-[10px] text-gray-500 font-semibold mt-0.5">Here to help anytime</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid: Left Side Stepper form & Right Side policy */}
        <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
          
          {/* Left: Step Form Container */}
          <div className="flex-1 space-y-4 sm:space-y-6">
            
            {/* Step 1: Select Order */}
            <div className="bg-white/45 backdrop-blur-md border border-white/60 rounded-[1.5rem] sm:rounded-[2rem] p-4 sm:p-6 md:p-8 shadow-sm text-start">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-brand-gradient text-white flex items-center justify-center font-black text-xs sm:text-sm flex-shrink-0 shadow-md">
                  1
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-extrabold text-gray-955 flex items-center gap-2">
                    <FiFileText className="text-primary-600" /> Select Order
                  </h3>
                  <p className="text-[11px] sm:text-xs text-gray-500 font-semibold">Enter your order ID (available in your profile/emails).</p>
                </div>
              </div>
              
              <form onSubmit={handleFindOrder} className="mt-3 sm:mt-4 flex flex-col gap-3">
                <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Enter Order Number (e.g. SAN...)"
                      value={orderNumber}
                      onChange={(e) => setOrderNumber(e.target.value)}
                      className="w-full pl-3.5 pr-9 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl border border-white/60 bg-white/60 focus:outline-none focus:ring-2 focus:ring-primary-500/10 focus:border-primary-500 text-xs sm:text-sm text-gray-800 font-semibold placeholder-gray-400 transition"
                    />
                    <FiSearch className="absolute right-3.5 top-3 sm:top-3.5 text-gray-400 text-sm sm:text-base" />
                  </div>

                  {!localStorage.getItem("token") && (
                    <div className="relative flex-1">
                      <input
                        type="email"
                        placeholder="Enter Registered Email"
                        value={registeredEmail}
                        onChange={(e) => setRegisteredEmail(e.target.value)}
                        className="w-full pl-3.5 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl border border-white/60 bg-white/60 focus:outline-none focus:ring-2 focus:ring-primary-500/10 focus:border-primary-500 text-xs sm:text-sm text-gray-800 font-semibold placeholder-gray-400 transition"
                      />
                    </div>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={loadingOrder}
                  className="w-full sm:w-auto bg-gray-950 text-white font-bold px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl hover:bg-gray-850 active:scale-95 transition text-xs disabled:opacity-50 flex items-center justify-center gap-2 self-stretch sm:self-start shadow-md"
                >
                  {loadingOrder ? "Searching..." : "Find My Order"}
                </button>
              </form>
            </div>

            {/* Step 2: Select Product */}
            <div className="bg-white/45 backdrop-blur-md border border-white/60 rounded-[1.5rem] sm:rounded-[2rem] p-4 sm:p-6 md:p-8 shadow-sm text-start">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-brand-gradient text-white flex items-center justify-center font-black text-xs sm:text-sm flex-shrink-0 shadow-md">
                  2
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-extrabold text-gray-955 flex items-center gap-2">
                    <FiBox className="text-primary-600" /> Select Product
                  </h3>
                  <p className="text-[11px] sm:text-xs text-gray-500 font-semibold">Select the item inside the order you want to return.</p>
                </div>
              </div>

              {selectedOrder ? (
                <div className="mt-3 sm:mt-4 space-y-2.5 sm:space-y-3">
                  {selectedOrder.products.map((item, index) => {
                    const isSelected = selectedProduct === item;
                    const productDetails = item.product || {};
                    
                    return (
                      <div
                        key={index}
                        onClick={() => setSelectedProduct(item)}
                        className={`cursor-pointer border-2 rounded-xl sm:rounded-2xl p-3 sm:p-4 flex items-center justify-between gap-3 sm:gap-4 transition-all duration-300 ${
                          isSelected 
                            ? "border-primary-500 bg-primary-500/10 text-primary-600 shadow-sm" 
                            : "border-white/60 hover:border-white/80 bg-white/40"
                        }`}
                      >
                        <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                          <div className="w-12 h-12 sm:w-16 sm:h-16 border border-white/50 bg-white rounded-xl overflow-hidden flex items-center justify-center p-1.5 flex-shrink-0">
                            <img
                              src={productDetails.images?.[0] || "/placeholder.svg"}
                              alt={productDetails.name}
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <div className="text-left min-w-0 flex-1">
                            <h4 className="text-xs sm:text-sm font-extrabold text-gray-955 truncate">
                              {productDetails.name || "Product Item"}
                            </h4>
                            <p className="text-xs text-primary-600 font-black mt-0.5">
                              ₹{productDetails.price || selectedOrder.totalAmount}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <input
                            type="radio"
                            name="product-select"
                            checked={isSelected}
                            onChange={() => setSelectedProduct(item)}
                            className="w-4 h-4 text-primary-600 focus:ring-primary-500 cursor-pointer"
                          />
                          <span className="text-[11px] sm:text-xs font-bold text-gray-600 hidden sm:inline">Select</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="mt-3 sm:mt-4 border border-dashed border-white/60 bg-white/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center text-xs text-gray-400 font-semibold italic">
                  Search and verify your order above to load product items.
                </div>
              )}
            </div>

            {/* Step 3: Reason for Return */}
            <div className="bg-white/45 backdrop-blur-md border border-white/60 rounded-[1.5rem] sm:rounded-[2rem] p-4 sm:p-6 md:p-8 shadow-sm text-start">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-brand-gradient text-white flex items-center justify-center font-black text-xs sm:text-sm flex-shrink-0 shadow-md">
                  3
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-extrabold text-gray-955 flex items-center gap-2">
                    <FiHelpCircle className="text-primary-600" /> Return Reason
                  </h3>
                  <p className="text-[11px] sm:text-xs text-gray-500 font-semibold">Select the primary reason for your request.</p>
                </div>
              </div>

              <div className="mt-3 sm:mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                {REASONS.map((r, index) => (
                  <label
                    key={index}
                    className={`flex items-center gap-3 p-3 sm:p-3.5 border rounded-xl sm:rounded-2xl cursor-pointer text-xs font-extrabold transition-all duration-300 ${
                      reason === r 
                        ? "border-primary-500 bg-primary-500/10 text-primary-600 shadow-sm" 
                        : "border-white/60 hover:border-white/80 bg-white/40 text-gray-700"
                    }`}
                  >
                    <input
                      type="radio"
                      name="return-reason"
                      value={r}
                      checked={reason === r}
                      onChange={() => setReason(r)}
                      className="w-4 h-4 text-primary-600 focus:ring-primary-500 cursor-pointer"
                    />
                    <span className="truncate">{r}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Step 4: Add Details */}
            <div className="bg-white/45 backdrop-blur-md border border-white/60 rounded-[1.5rem] sm:rounded-[2rem] p-4 sm:p-6 md:p-8 shadow-sm text-start space-y-4 sm:space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-brand-gradient text-white flex items-center justify-center font-black text-xs sm:text-sm flex-shrink-0 shadow-md">
                  4
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-extrabold text-gray-955 flex items-center gap-2">
                    <FiUpload className="text-primary-600" /> Details & Photos
                  </h3>
                  <p className="text-[11px] sm:text-xs text-gray-500 font-semibold">Include notes or upload photos to help verify.</p>
                </div>
              </div>

              {/* Textarea description */}
              <div className="space-y-1.5 sm:space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">
                  Describe your reason for return
                </label>
                <textarea
                  rows="3"
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Enter additional description details..."
                  className="w-full border border-white/60 bg-white/60 rounded-xl sm:rounded-2xl p-3 sm:p-3.5 focus:ring-2 focus:ring-primary-500/10 focus:border-primary-500 focus:outline-none transition text-xs sm:text-sm text-gray-800 font-semibold placeholder-gray-400"
                />
              </div>

              {/* Upload Section */}
              <div className="space-y-2.5 sm:space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">
                  Upload Photos (Optional - max 5)
                </label>
                
                <div className="flex flex-wrap gap-2.5 sm:gap-3 items-center">
                  {/* Select Photo trigger box */}
                  {images.length < 5 && (
                    <label className="w-16 h-16 sm:w-20 sm:h-20 border-2 border-dashed border-white/60 bg-white/40 rounded-xl sm:rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-primary-500 transition-colors text-gray-500">
                      <FiUpload className="text-base sm:text-lg text-primary-600" />
                      <span className="text-[8px] font-extrabold uppercase mt-1">Upload</span>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  )}

                  {/* Previews */}
                  <AnimatePresence>
                    {imagePreviews.map((preview, idx) => {
                      return (
                        <motion.div
                          key={idx}
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.8, opacity: 0 }}
                          className="w-16 h-16 sm:w-20 sm:h-20 border border-white/50 rounded-xl sm:rounded-2xl overflow-hidden relative group bg-white flex items-center justify-center p-1 shadow-sm"
                        >
                          <img
                            src={preview.url}
                            alt="preview"
                            className="max-w-full max-h-full object-contain"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            className="absolute top-1 right-1 w-4 h-4 sm:w-5 sm:h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-[9px] sm:text-[10px] shadow-md hover:bg-red-600 transition"
                          >
                            ✕
                          </button>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              </div>

              {/* Choose Return Option */}
              <div className="space-y-2.5 sm:space-y-3 pt-1 sm:pt-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">
                  Choose Return Option
                </label>
                
                <div className="grid grid-cols-2 gap-2.5 sm:gap-4">
                  <div
                    onClick={() => setReturnOption("Refund")}
                    className={`cursor-pointer p-3 sm:p-4 rounded-xl sm:rounded-2xl border-2 flex flex-col items-center justify-center text-center transition-all duration-300 ${
                      returnOption === "Refund"
                        ? "border-primary-500 bg-primary-500/10 text-primary-600 shadow-sm"
                        : "border-white/60 bg-white/40 hover:border-white/80 text-gray-600"
                    }`}
                  >
                    <FiCheckCircle className="text-lg sm:text-xl mb-1" />
                    <span className="text-[11px] sm:text-xs font-black">Refund</span>
                    <span className="text-[8.5px] sm:text-[9px] text-gray-400 font-bold mt-0.5 sm:mt-1 leading-tight">Original payment method</span>
                  </div>

                  <div
                    onClick={() => setReturnOption("Replacement")}
                    className={`cursor-pointer p-3 sm:p-4 rounded-xl sm:rounded-2xl border-2 flex flex-col items-center justify-center text-center transition-all duration-300 ${
                      returnOption === "Replacement"
                        ? "border-primary-500 bg-primary-500/10 text-primary-600 shadow-sm"
                        : "border-white/60 bg-white/40 hover:border-white/80 text-gray-600"
                    }`}
                  >
                    <FiBox className="text-lg sm:text-xl mb-1" />
                    <span className="text-[11px] sm:text-xs font-black">Replacement</span>
                    <span className="text-[8.5px] sm:text-[9px] text-gray-400 font-bold mt-0.5 sm:mt-1 leading-tight">Same item replaced</span>
                  </div>
                </div>
              </div>

              {/* Submit button */}
              <button
                onClick={handleSubmitReturn}
                disabled={submitting}
                className="w-full bg-brand-gradient text-white font-bold py-3.5 sm:py-4 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transform transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2 text-xs sm:text-sm mt-2"
              >
                {submitting ? "Submitting Request..." : "Submit Return Request"}
              </button>
            </div>

            {/* Call Support Center bottom highlight */}
            <div className="bg-white/45 backdrop-blur-md border border-white/60 rounded-[1.5rem] sm:rounded-[2rem] p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-center sm:text-start shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-primary-500/10 flex items-center justify-center text-primary-600 text-base sm:text-lg flex-shrink-0">
                  <FiHelpCircle />
                </div>
                <div className="text-left">
                  <h4 className="text-xs sm:text-sm font-extrabold text-gray-955">Need Help?</h4>
                  <p className="text-[11px] sm:text-xs text-gray-500 font-semibold mt-0.5">Our support team is here to assist you.</p>
                </div>
              </div>
              
              <button
                onClick={() => navigate("/contact")}
                className="w-full sm:w-auto border border-white/70 hover:bg-white font-bold px-5 sm:px-6 py-2.5 rounded-xl transition text-xs text-gray-800 bg-white/50 text-center shadow-sm"
              >
                Contact Customer Support
              </button>
            </div>

          </div>

          {/* Right Sidebar: Policy Details */}
          <div className="w-full lg:w-80 flex-shrink-0">
            <div className="bg-white/45 border border-white/60 backdrop-blur-md rounded-[1.5rem] sm:rounded-[2rem] p-4 sm:p-6 shadow-sm text-start space-y-4 sm:space-y-6 lg:sticky lg:top-28">
              <div className="flex items-center gap-2 pb-3 sm:pb-4 border-b border-white/30">
                <FiInfo className="text-primary-600 text-base sm:text-lg" />
                <h4 className="text-xs sm:text-sm font-extrabold text-gray-955">Return Policy Highlights</h4>
              </div>

              <div className="space-y-3 sm:space-y-4 text-[11px] sm:text-xs text-gray-600 font-semibold leading-relaxed">
                <div>
                  <h5 className="font-extrabold text-gray-900">Return Window</h5>
                  <p className="mt-0.5 sm:mt-1">Return requests must be submitted within <strong className="text-primary-600 font-extrabold">7 days</strong> of delivery.</p>
                </div>
                <div>
                  <h5 className="font-extrabold text-gray-900">Condition Requirements</h5>
                  <p className="mt-0.5 sm:mt-1">Product must be unused, undamaged, and returned in original condition.</p>
                </div>
                <div>
                  <h5 className="font-extrabold text-gray-900">Packaging</h5>
                  <p className="mt-0.5 sm:mt-1">Original packaging, tags, invoices, and accessories must be included.</p>
                </div>
                <div>
                  <h5 className="font-extrabold text-gray-900">Refund processing</h5>
                  <p className="mt-0.5 sm:mt-1">Refunds are processed within <strong className="text-primary-600 font-extrabold">5-7 business days</strong> after inspection.</p>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </>
  );
};

export default ReturnPage;
