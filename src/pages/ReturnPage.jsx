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
  FiArrowRight,
  FiSearch,
  FiUpload,
  FiTrash2,
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
  "Other",
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
  
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

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
    setImages(prev => [...prev, ...files]);
  };

  const handleRemoveImage = (index) => {
    setImages(prev => prev.filter((_, idx) => idx !== index));
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
      <div className="min-h-screen bg-[#fffbeb] pt-28 pb-16 px-4 md:px-8 text-slate-800 font-sans">
        
        {/* Header Hero Section */}
        <div className="max-w-7xl mx-auto bg-gradient-to-r from-[#1b36e3] to-[#5094ff] rounded-[2rem] text-white p-8 md:p-12 mb-10 shadow-lg text-start flex flex-col md:flex-row justify-between items-start md:items-center gap-8 relative overflow-hidden">
          <div className="z-10 max-w-xl">
            <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-3">Return Your Product</h1>
            <p className="text-blue-100 text-sm md:text-base">
              We're here to make your return process simple, straightforward, and completely hassle-free.
            </p>
          </div>
          
          {/* Benefit Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 z-10 w-full md:w-auto">
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
              <FiCheckCircle className="text-xl text-amber-300 flex-shrink-0" />
              <div className="text-left">
                <h4 className="text-xs font-bold uppercase">Easy Returns</h4>
                <p className="text-[10px] text-blue-100 mt-0.5">Hassle-free process</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
              <FiClock className="text-xl text-amber-300 flex-shrink-0" />
              <div className="text-left">
                <h4 className="text-xs font-bold uppercase">Quick Refunds</h4>
                <p className="text-[10px] text-blue-100 mt-0.5">Within 5-7 days</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
              <FiPhone className="text-xl text-amber-300 flex-shrink-0" />
              <div className="text-left">
                <h4 className="text-xs font-bold uppercase">24/7 Support</h4>
                <p className="text-[10px] text-blue-100 mt-0.5">Here to help you</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid: Left Side Stepper form & Right Side policy */}
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
          
          {/* Left: Step Form Container */}
          <div className="flex-1 space-y-6">
            
            {/* Step 1: Select Order */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm text-start flex gap-5 items-start">
              <div className="w-10 h-10 rounded-full bg-[#1b36e3] text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                1
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <FiFileText className="text-primary-500" /> Select Order
                </h3>
                <p className="text-xs text-slate-400 mt-1">Enter your order ID (available in your profile/emails).</p>
                
                <form onSubmit={handleFindOrder} className="mt-4 flex flex-col gap-3">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        placeholder="Enter Order Number (e.g. SAN...)"
                        value={orderNumber}
                        onChange={(e) => setOrderNumber(e.target.value)}
                        className="w-full pl-4 pr-10 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1b36e3]/20 focus:border-[#1b36e3] text-sm text-gray-800 placeholder-slate-400 transition"
                      />
                      <FiSearch className="absolute right-3.5 top-3.5 text-slate-400" />
                    </div>

                    {!localStorage.getItem("token") && (
                      <div className="relative flex-1">
                        <input
                          type="email"
                          placeholder="Enter Registered Email"
                          value={registeredEmail}
                          onChange={(e) => setRegisteredEmail(e.target.value)}
                          className="w-full pl-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1b36e3]/20 focus:border-[#1b36e3] text-sm text-gray-800 placeholder-slate-400 transition"
                        />
                      </div>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={loadingOrder}
                    className="w-full sm:w-auto bg-slate-900 text-white font-bold px-6 py-3 rounded-2xl hover:bg-slate-800 active:scale-95 transition text-sm disabled:opacity-50 flex items-center justify-center gap-2 self-start"
                  >
                    {loadingOrder ? "Searching..." : "Find My Order"}
                  </button>
                </form>
              </div>
            </div>

            {/* Step 2: Select Product */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm text-start flex gap-5 items-start">
              <div className="w-10 h-10 rounded-full bg-[#1b36e3] text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                2
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <FiBox className="text-primary-500" /> Select Product
                </h3>
                <p className="text-xs text-slate-400 mt-1">Select the item inside the order you want to return.</p>

                {selectedOrder ? (
                  <div className="mt-4 space-y-3">
                    {selectedOrder.products.map((item, index) => {
                      const isSelected = selectedProduct === item;
                      const productDetails = item.product || {};
                      
                      return (
                        <div
                          key={index}
                          onClick={() => setSelectedProduct(item)}
                          className={`cursor-pointer border-2 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all duration-300 ${
                            isSelected 
                              ? "border-[#1b36e3] bg-[#1b36e3]/5" 
                              : "border-slate-100 hover:border-slate-200 bg-white"
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 border border-slate-100 bg-slate-50 rounded-xl overflow-hidden flex items-center justify-center p-2 flex-shrink-0">
                              <img
                                src={productDetails.images?.[0] || "/placeholder.svg"}
                                alt={productDetails.name}
                                className="max-w-full max-h-full object-contain"
                              />
                            </div>
                            <div className="text-left">
                              <h4 className="text-sm font-extrabold text-slate-800 line-clamp-1">
                                {productDetails.name || "Product Item"}
                              </h4>
                              {productDetails.brand && (
                                <p className="text-[10px] text-slate-400 uppercase font-semibold mt-0.5">
                                  {productDetails.brand}
                                </p>
                              )}
                              <p className="text-xs text-[#1b36e3] font-extrabold mt-1">
                                ₹{productDetails.price || selectedOrder.totalAmount}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 self-end sm:self-auto">
                            <input
                              type="radio"
                              name="product-select"
                              checked={isSelected}
                              onChange={() => setSelectedProduct(item)}
                              className="w-4 h-4 text-[#1b36e3] focus:ring-[#1b36e3]"
                            />
                            <span className="text-xs font-bold text-slate-500">Select Product</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="mt-4 border border-dashed border-slate-200 rounded-2xl p-6 text-center text-xs text-slate-400 italic">
                    Search and verify your order above to load product items.
                  </div>
                )}
              </div>
            </div>

            {/* Step 3: Reason for Return */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm text-start flex gap-5 items-start">
              <div className="w-10 h-10 rounded-full bg-[#1b36e3] text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                3
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <FiHelpCircle className="text-primary-500" /> Why are you returning this product?
                </h3>
                <p className="text-xs text-slate-400 mt-1">Select the main reason for your request.</p>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {REASONS.map((r, index) => (
                    <label
                      key={index}
                      className={`flex items-center gap-3 p-3.5 border rounded-2xl cursor-pointer text-xs font-bold text-slate-600 transition-all duration-300 ${
                        reason === r 
                          ? "border-[#1b36e3] bg-[#1b36e3]/5 text-[#1b36e3]" 
                          : "border-slate-100 hover:border-slate-200 bg-white"
                      }`}
                    >
                      <input
                        type="radio"
                        name="return-reason"
                        value={r}
                        checked={reason === r}
                        onChange={() => setReason(r)}
                        className="w-4 h-4 text-[#1b36e3] focus:ring-[#1b36e3]"
                      />
                      <span>{r}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Step 4: Add Details */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm text-start flex gap-5 items-start">
              <div className="w-10 h-10 rounded-full bg-[#1b36e3] text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                4
              </div>
              <div className="flex-1 space-y-6">
                <div>
                  <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <FiUpload className="text-primary-500" /> Tell us more & Upload Photos
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">Include details or photos to help verify the issue.</p>
                </div>

                {/* Textarea description */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Describe your reason for return
                  </label>
                  <textarea
                    rows="4"
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    placeholder="Enter additional description details..."
                    className="w-full border border-slate-200 rounded-2xl p-3.5 focus:ring-2 focus:ring-[#1b36e3]/20 focus:border-[#1b36e3] focus:outline-none transition text-sm text-slate-800 placeholder-slate-400"
                  />
                </div>

                {/* Upload Section */}
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Upload Photos (Optional - up to 5 photos)
                  </label>
                  
                  <div className="flex flex-wrap gap-3 items-center">
                    {/* Select Photo trigger box */}
                    {images.length < 5 && (
                      <label className="w-20 h-20 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-[#1b36e3]/50 transition-colors text-slate-400">
                        <FiUpload className="text-lg" />
                        <span className="text-[8px] font-bold mt-1">Upload</span>
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
                      {images.map((file, idx) => {
                        const url = URL.createObjectURL(file);
                        return (
                          <motion.div
                            key={idx}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            className="w-20 h-20 border border-slate-100 rounded-2xl overflow-hidden relative group bg-slate-50 flex items-center justify-center p-1"
                          >
                            <img
                              src={url}
                              alt="preview"
                              className="max-w-full max-h-full object-contain"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(idx)}
                              className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-[10px] shadow-md hover:bg-red-600 transition"
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
                <div className="space-y-3 pt-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Choose Return Option
                  </label>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div
                      onClick={() => setReturnOption("Refund")}
                      className={`cursor-pointer p-4 rounded-2xl border-2 flex flex-col items-center justify-center text-center transition-all duration-300 ${
                        returnOption === "Refund"
                          ? "border-[#1b36e3] bg-[#1b36e3]/5 text-[#1b36e3] shadow-md shadow-blue-500/5"
                          : "border-slate-100 bg-white hover:border-slate-200 text-slate-500"
                      }`}
                    >
                      <FiCheckCircle className="text-xl mb-1" />
                      <span className="text-xs font-black">Refund</span>
                      <span className="text-[9px] text-slate-400 font-bold mt-1">Refund to your original method</span>
                    </div>

                    <div
                      onClick={() => setReturnOption("Replacement")}
                      className={`cursor-pointer p-4 rounded-2xl border-2 flex flex-col items-center justify-center text-center transition-all duration-300 ${
                        returnOption === "Replacement"
                          ? "border-[#1b36e3] bg-[#1b36e3]/5 text-[#1b36e3] shadow-md shadow-blue-500/5"
                          : "border-slate-100 bg-white hover:border-slate-200 text-slate-500"
                      }`}
                    >
                      <FiBox className="text-xl mb-1" />
                      <span className="text-xs font-black">Replacement</span>
                      <span className="text-[9px] text-slate-400 font-bold mt-1">Get the same item replaced</span>
                    </div>
                  </div>
                </div>

                {/* Submit button */}
                <button
                  onClick={handleSubmitReturn}
                  disabled={submitting}
                  className="w-full bg-gradient-to-r from-[#1b36e3] to-[#5094ff] hover:shadow-lg hover:shadow-blue-500/20 text-white font-bold py-4 rounded-2xl transition active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
                >
                  {submitting ? "Submitting Request..." : "Submit Return Request"}
                </button>
              </div>
            </div>

            {/* Call Support Center bottom highlight */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-start">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#1b36e3] text-lg">
                  <FiHelpCircle />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900">Need Help?</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Our support team is here to assist you.</p>
                </div>
              </div>
              
              <button
                onClick={() => navigate("/contact")}
                className="w-full sm:w-auto border border-slate-200 hover:border-slate-300 font-bold px-6 py-2.5 rounded-xl transition text-xs text-slate-600 bg-white text-center"
              >
                Contact Customer Support
              </button>
            </div>

          </div>

          {/* Right Sidebar: Policy Details */}
          <div className="w-full lg:w-80 flex-shrink-0">
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm text-start space-y-6 lg:sticky lg:top-28">
              <div className="flex items-center gap-2 pb-4 border-b border-slate-50">
                <FiInfo className="text-[#1b36e3] text-lg" />
                <h4 className="text-sm font-black text-slate-900">Return Policy Highlights</h4>
              </div>

              <div className="space-y-4 text-xs text-slate-500 leading-relaxed">
                <div>
                  <h5 className="font-bold text-slate-700">Return Window</h5>
                  <p className="mt-1">Return requests must be submitted within <strong>7 days</strong> of delivery.</p>
                </div>
                <div>
                  <h5 className="font-bold text-slate-700">Condition Requirements</h5>
                  <p className="mt-1">Product must be unused, undamaged, and returned in original condition.</p>
                </div>
                <div>
                  <h5 className="font-bold text-slate-700">Packaging</h5>
                  <p className="mt-1">Original packaging, tags, invoices, and accessories must be included.</p>
                </div>
                <div>
                  <h5 className="font-bold text-slate-700">Refund processing</h5>
                  <p className="mt-1">Refunds are processed within <strong>5-7 business days</strong> after inspection.</p>
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
