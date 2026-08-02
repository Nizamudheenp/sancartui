import axios from "axios";

export const saveOrderToBackend = async ({
  cartItems,
  amount,
  userAddress,
  paymentId,
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
      status: "paid",
    };

    if (guestEmail) {
      payload.guestEmail = guestEmail;
    }

    const headers = {};
    if (userToken && userToken !== "null" && userToken !== "undefined") {
      headers.Authorization = `Bearer ${userToken}`;
    }

    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/orders/createorder`,
      payload,
      { headers }
    );

    console.log(" Order saved:", response.data);
    return response.data;

  } catch (error) {
    console.error("Failed to save order:", error.response?.data || error.message);
    throw error;
  }
};
