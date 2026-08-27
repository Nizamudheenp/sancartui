import api from "./api";

export const saveOrderToBackend = async ({
  cartItems,
  amount,
  userAddress,
  paymentId,
  paymentMethod,
  userToken,
  guestEmail
}) => {
  try {
    if (!cartItems || cartItems.length === 0) {
      console.error("Cannot save order: cart is empty");
      return;
    }

    const payload = {
      products: (cartItems || []).map(item => ({
        productId: item.product.id || item.product._id,
        quantity: item.quantity,
      })),
      totalAmount: amount,
      shippingAddress: userAddress,
      paymentId: paymentId,
      paymentMethod: paymentMethod || "Online",
      status: paymentMethod === "COD" ? "processing" : "paid",
    };

    if (guestEmail) {
      payload.guestEmail = guestEmail;
    }

    const response = await api.post(
      "/api/orders/createorder",
      payload
    );

    console.log(" Order saved:", response.data);
    return response.data;

  } catch (error) {
    console.error("Failed to save order:", error.response?.data || error.message);
    throw error;
  }
};
