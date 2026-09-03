import React, { useEffect, useState } from "react";
import api from "../utils/api";
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
      const res = await api.get("/api/products/getCart");
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
      const res = await api.put(
        "/api/products/updateCartItem",
        { productId, quantity }
      );
      const validItems = (res.data.items || []).filter(item => item && item.product);
      setCartItems(validItems);
      window.dispatchEvent(new Event("cartUpdated"));
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
      const res = await api.delete(`/api/products/removeFromCart/${productId}`);
      const validItems = (res.data.items || []).filter(item => item && item.product);
      setCartItems(validItems);
      window.dispatchEvent(new Event("cartUpdated"));
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
    navigate("/checkout");
  };

  useEffect(() => {
    fetchCart();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4 bg-transparent pt-28">
        <span className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-semibold text-gray-500">Loading cart items...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 pt-28">
      
      {/* Title */}
      <div className="max-w-xl text-start mb-10 pl-2">
        <span className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary-600 bg-primary-500/10 rounded-lg mb-3">
          Shopping Cart
        </span>
        <h2 className="text-3xl md:text-5xl font-black text-gray-955 tracking-tight">
          Your Selection
        </h2>
      </div>

      {cartItems.length === 0 ? (
        <div className="glass-card rounded-[2.5rem] p-12 text-center max-w-lg mx-auto shadow-glass">
          <div className="w-16 h-16 rounded-full bg-white/40 border border-white/50 flex items-center justify-center mx-auto mb-6 text-2xl text-primary-600 shadow-sm">
            <FiShoppingCart />
          </div>
          <h3 className="text-lg font-extrabold text-gray-950 mb-2">Your cart is empty</h3>
          <p className="text-xs sm:text-sm text-gray-500 font-semibold mb-6">Looks like you haven't added anything to your cart yet.</p>
          <button
            onClick={() => navigate("/shop")}
            className="px-6 py-3.5 text-xs font-bold rounded-full text-white bg-brand-gradient hover:shadow-md transition active:scale-95"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="glass-card rounded-[2.5rem] p-6 sm:p-10 shadow-glass">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            {/* Cart Items List */}
            <div className="lg:col-span-8 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.product.id}
                  className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-white/45 backdrop-blur-md border border-white/55 rounded-3xl shadow-sm hover:shadow-md transition duration-300"
                >
                  {/* Image Frame */}
                  <div className="flex-shrink-0 w-28 h-28 bg-white border border-white/40 rounded-2xl flex items-center justify-center p-3 overflow-hidden">
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
                          <span className="text-[10px] font-extrabold text-primary-600 uppercase tracking-wide">
                            {item.product.brand}
                          </span>
                        )}
                        <h4 className="text-sm sm:text-base font-extrabold text-gray-955 leading-snug line-clamp-1">
                          {item.product.name}
                        </h4>
                      </div>
                      <button
                        onClick={() => handleRemove(item.product.id)}
                        className="p-2 text-red-500 hover:bg-red-50/50 rounded-xl transition duration-150"
                        aria-label="Remove item"
                      >
                        <FiTrash2 className="text-lg" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <p className="text-gray-955 font-black text-base">₹{item.product.price}</p>

                      {/* Quantity controls */}
                      <div className="flex items-center border border-white/60 rounded-full px-2 py-1 bg-white/40 backdrop-blur-sm">
                        <button
                          onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="w-7 h-7 flex items-center justify-center rounded-full text-gray-700 hover:bg-white/60 disabled:opacity-30 disabled:cursor-not-allowed transition"
                        >
                          <FiMinus className="text-xs" />
                        </button>
                        <span className="w-10 text-center text-xs font-black text-gray-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center rounded-full text-gray-700 hover:bg-white/60 transition"
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
            <div className="lg:col-span-4 bg-white/30 border border-white/50 backdrop-blur-md rounded-[2rem] p-6 shadow-sm text-start space-y-6">
              <h3 className="text-lg font-extrabold text-gray-955">Summary</h3>

              <div className="space-y-3 text-xs sm:text-sm text-gray-500 border-b border-white/30 pb-4 font-semibold">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-extrabold text-gray-850">₹{totalPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-green-600 font-extrabold">Free</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-base font-extrabold text-gray-955">Total</span>
                <span className="text-xl sm:text-2xl font-black text-gray-955">₹{totalPrice}</span>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-brand-gradient text-white font-bold py-4 rounded-full shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transform transition-all duration-200"
              >
                Proceed to Checkout
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
