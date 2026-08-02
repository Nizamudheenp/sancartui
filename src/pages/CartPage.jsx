import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { showToast } from "../utils/toast";
import { getGuestCart, updateGuestCartQuantity, removeFromGuestCart } from "../utils/guestCart";
import { FiTrash2, FiShoppingCart, FiMinus, FiPlus } from "react-icons/fi";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const fetchCart = async () => {
    if (!token || token === "null" || token === "undefined") {
      const guestItems = getGuestCart().filter(item => item && item.product);
      setCartItems(guestItems);
      setLoading(false);
      return;
    }
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products/getCart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const validItems = (res.data.items || []).filter(item => item && item.product);
      setCartItems(validItems);
    } catch (err) {
      console.error("Error fetching cart:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = async (productId, quantity) => {
    if (quantity < 1) return;
    if (!token || token === "null" || token === "undefined") {
      const updatedCart = updateGuestCartQuantity(productId, quantity);
      setCartItems(updatedCart.filter(item => item && item.product));
      return;
    }
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/products/updateCartItem`,
        { productId, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const validItems = (res.data.items || []).filter(item => item && item.product);
      setCartItems(validItems);
    } catch (err) {
      console.error("Error updating quantity:", err);
      showToast("error", "Error updating quantity");
    }
  };

  const handleRemove = async (productId) => {
    if (!token || token === "null" || token === "undefined") {
      const updatedCart = removeFromGuestCart(productId);
      setCartItems(updatedCart.filter(item => item && item.product));
      showToast("success", "Item removed from cart");
      return;
    }
    try {
      const res = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/products/removeFromCart/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const validItems = (res.data.items || []).filter(item => item && item.product);
      setCartItems(validItems);
      showToast("success", "Item removed from cart");
    } catch (err) {
      console.error("Error removing item:", err);
      showToast("error", "Error removing item");
    }
  };

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + (item.product?.price || 0) * item.quantity,
    0
  );

  const handleCheckout = () => {
    const cleanToken = (token === "null" || token === "undefined") ? null : token;
    navigate("/checkout", { state: { amount: totalPrice, cartItems, token: cleanToken } });
  };

  useEffect(() => {
    fetchCart();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-white gap-4">
        <span className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-semibold text-gray-500">Loading cart items...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-24 mt-10">

      {/* Title */}
      <div className="max-w-xl text-start mb-10">
        <span className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary-600 bg-primary-50 rounded-lg mb-3">
          Shopping Cart
        </span>
        <h2 className="text-3xl md:text-5xl font-black text-gray-950 tracking-tight">
          Your Selection
        </h2>
      </div>

      {cartItems.length === 0 ? (
        <div className="bg-slate-50 border border-gray-100 rounded-3xl p-12 text-center max-w-lg mx-auto shadow-sm">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6 text-2xl text-gray-400">
            <FiShoppingCart />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Your cart is empty</h3>
          <p className="text-sm text-gray-500 mb-6">Looks like you haven't added anything to your cart yet.</p>
          <button
            onClick={() => navigate("/shop")}
            className="px-6 py-2.5 text-xs font-bold rounded-full text-white bg-gradient-to-r from-primary-500 to-yellow-400 hover:shadow-md transition active:scale-95"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Cart Items List */}
          <div className="lg:col-span-8 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.product.id}
                className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-md transition duration-300"
              >
                {/* Image Frame */}
                <div className="flex-shrink-0 w-28 h-28 bg-slate-50 border border-gray-50 rounded-2xl flex items-center justify-center p-3 overflow-hidden">
                  <img
                    src={item.product.images?.[0] || "/placeholder.svg"}
                    alt={item.product.name}
                    className="max-w-full max-h-full object-contain"
                    onError={(e) => {
                      e.target.src = "/placeholder.svg";
                    }}
                  />
                </div>

                {/* Details */}
                <div className="flex-1 text-start space-y-2 w-full">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      {item.product.brand && (
                        <span className="text-[10px] font-bold text-primary-500 uppercase tracking-wide">
                          {item.product.brand}
                        </span>
                      )}
                      <h4 className="text-base font-bold text-gray-900 leading-snug line-clamp-1">
                        {item.product.name}
                      </h4>
                    </div>
                    <button
                      onClick={() => handleRemove(item.product.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition duration-150"
                      aria-label="Remove item"
                    >
                      <FiTrash2 className="text-lg" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <p className="text-gray-950 font-black text-base">₹{item.product.price}</p>

                    {/* Quantity controls */}
                    <div className="flex items-center border border-gray-200 rounded-full px-2 py-1 bg-gray-50">
                      <button
                        onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="w-7 h-7 flex items-center justify-center rounded-full text-gray-600 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition"
                      >
                        <FiMinus className="text-xs" />
                      </button>
                      <span className="w-10 text-center text-xs font-bold text-gray-800">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                        className="w-7 h-7 flex items-center justify-center rounded-full text-gray-600 hover:bg-gray-200 transition"
                      >
                        <FiPlus className="text-xs" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Summary Card */}
          <div className="lg:col-span-4 bg-white border border-gray-100 rounded-3xl p-6 shadow-md text-start space-y-6">
            <h3 className="text-lg font-bold text-gray-900">Summary</h3>

            <div className="space-y-3 text-sm text-gray-500 border-b border-gray-100 pb-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-gray-800">₹{totalPrice}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-green-600 font-bold">Free</span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-base font-bold text-gray-950">Total</span>
              <span className="text-2xl font-black text-gray-950">₹{totalPrice}</span>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full bg-gradient-to-r from-primary-500 to-yellow-400 text-white font-bold py-4 rounded-full shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transform transition-all duration-200"
            >
              Proceed to Checkout
            </button>
          </div>

        </div>
      )}
    </div>
  );
};

export default CartPage;
