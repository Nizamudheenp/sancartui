import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { saveOrderToBackend } from "../utils/saveOrder";
import { clearGuestCart } from "../utils/guestCart";
import { showToast } from "../utils/toast";
import { motion } from "framer-motion";
import { FiMapPin, FiArrowRight, FiShoppingBag, FiInfo, FiMail, FiCreditCard } from "react-icons/fi";

const PaymentPage = ({ amount, cartItems, userToken }) => {
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [shippingAddress, setShippingAddress] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth <= 768);
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  const handlePayment = async (e) => {
    e.preventDefault();

    if (!shippingAddress) {
      showToast('error', 'Please provide a shipping address');
      return;
    }
    if ((!userToken || userToken === "null" || userToken === "undefined") && !guestEmail) {
      showToast('error', 'Please provide an email address');
      return;
    }

    setLoading(true);

    try {
      // 1. Create Razorpay order on backend
      const orderRes = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/orders/create-razorpay-order`,
        { amount }
      );
      const { orderId, currency, amount: orderAmount } = orderRes.data;

      // 2. Configure Razorpay modal options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderAmount,
        currency: currency,
        name: "sancart",
        description: "Secure Order Payment",
        order_id: orderId,
        handler: async (response) => {
          setLoading(true);
          try {
            // 3. Verify Razorpay signature on backend
            const verifyRes = await axios.post(
              `${import.meta.env.VITE_BACKEND_URL}/api/orders/verify-payment`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }
            );

            if (verifyRes.data.status === "success") {
              // 4. Save order to DB
              await saveOrderToBackend({
                cartItems,
                amount,
                userAddress: shippingAddress,
                paymentId: response.razorpay_payment_id,
                userToken,
                guestEmail: userToken ? undefined : guestEmail,
              });

              showToast("success", "Payment successful!");
              navigate("/payment-success");

              // 5. Clear cart
              if (userToken && userToken !== "null" && userToken !== "undefined") {
                await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/products/clearCart`, {
                  headers: { Authorization: `Bearer ${userToken}` },
                });
              } else {
                clearGuestCart();
              }
            } else {
              showToast("error", "Payment verification failed");
            }
          } catch (verifyErr) {
            console.error("Verification failed", verifyErr);
            showToast("error", "Payment verification error");
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          email: guestEmail || "",
        },
        theme: {
          color: "#F97316", // match primary-500 theme color
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            showToast("info", "Payment cancelled");
          }
        }
      };

      // 3. Open Razorpay Checkout modal
      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      console.error("Razorpay order creation failed", err);
      showToast("error", "Could not initialize Razorpay checkout");
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-slate-50 px-4 pt-28 pb-16 overflow-hidden">
      {/* Decorative Background Blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            x: [0, 30, 0],
            y: [0, -40, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-40 -left-40 w-96 h-96 bg-primary-100 rounded-full blur-3xl opacity-60"
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            x: [0, -30, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -bottom-40 -right-40 w-96 h-96 bg-accent-100 rounded-full blur-3xl opacity-50"
        />
      </div>

      <form onSubmit={handlePayment} className="w-full max-w-4xl mx-auto z-10 relative">
        <div className={`flex ${isMobile ? "flex-col" : "flex-row"} gap-8 p-6 md:p-8 bg-white border border-gray-100 rounded-3xl shadow-xl`}>
          {/* Left Side: Checkout Details */}
          <div className="flex-[1.2] text-start">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center text-primary-500">
                <FiCreditCard />
              </div>
              <h4 className="text-lg font-bold text-gray-900">Billing Information</h4>
            </div>

            {/* Guest Email field */}
            {(!userToken || userToken === "null" || userToken === "undefined") && (
              <div className="space-y-2 mb-6">
                <label className="flex items-center gap-1.5 text-xs font-bold text-gray-400 uppercase tracking-wide">
                  <FiMail /> Contact Email
                </label>
                <input
                  type="email"
                  required
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  placeholder="Enter your contact email..."
                  className="w-full border border-gray-200 rounded-2xl p-3.5 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:outline-none transition-all text-sm text-gray-800 placeholder-gray-400"
                />
              </div>
            )}

            {/* Shipping Address field */}
            <div className="space-y-2 mb-6">
              <label className="flex items-center gap-1.5 text-xs font-bold text-gray-400 uppercase tracking-wide">
                <FiMapPin /> Shipping Address
              </label>
              <textarea
                required
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                rows="4"
                placeholder="Enter your full shipping address..."
                className="w-full border border-gray-200 rounded-2xl p-3.5 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:outline-none transition-all text-sm text-gray-800 placeholder-gray-400"
              />
            </div>
          </div>

          {/* Right Side: Order Summary & Pay */}
          <div className="flex-1 text-start flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-lg bg-accent-50 flex items-center justify-center text-accent-500">
                  <FiShoppingBag />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Order Summary</h3>
              </div>

              {/* Total Highlight */}
              <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl mb-6 flex justify-between items-center">
                <span className="text-sm text-gray-500 font-medium">Grand Total</span>
                <strong className="text-xl font-black text-primary-600">₹{amount}</strong>
              </div>

              <div className="flex items-start gap-2 bg-blue-50/50 border border-blue-100 rounded-2xl p-4 mb-6 text-xs text-blue-700 leading-relaxed">
                <FiInfo className="mt-0.5 flex-shrink-0" />
                <span>Payments are processed securely via Razorpay (supporting Cards, UPI, Netbanking).</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary-500 to-indigo-600 hover:from-primary-600 hover:to-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-primary-500/10 hover:shadow-xl transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm mt-4"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Confirm & Pay <FiArrowRight size={16} />
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PaymentPage;
