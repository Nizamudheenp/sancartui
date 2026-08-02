export const getGuestCart = () => {
  try {
    const cart = localStorage.getItem("guest_cart");
    return cart ? JSON.parse(cart) : [];
  } catch (err) {
    console.error("Error reading guest cart:", err);
    return [];
  }
};

export const saveGuestCart = (cart) => {
  try {
    localStorage.setItem("guest_cart", JSON.stringify(cart));
  } catch (err) {
    console.error("Error saving guest cart:", err);
  }
};

export const addToGuestCart = (product, quantity = 1) => {
  const cart = getGuestCart();
  const productId = product.id || product._id;
  const existing = cart.find((item) => item.product.id === productId || item.product._id === productId);

  if (existing) {
    existing.quantity += quantity;
  } else {
    // Ensure product matches schema of items fetched from backend
    cart.push({
      product: {
        id: productId,
        _id: productId,
        name: product.name,
        price: product.price,
        images: product.images,
        brand: product.brand,
        stock: product.stock,
      },
      quantity,
    });
  }
  saveGuestCart(cart);
  return cart;
};

export const updateGuestCartQuantity = (productId, quantity) => {
  if (quantity < 1) return getGuestCart();
  const cart = getGuestCart();
  const item = cart.find((item) => item.product.id === productId || item.product._id === productId);
  if (item) {
    item.quantity = quantity;
    saveGuestCart(cart);
  }
  return cart;
};

export const removeFromGuestCart = (productId) => {
  let cart = getGuestCart();
  cart = cart.filter((item) => item.product.id !== productId && item.product._id !== productId);
  saveGuestCart(cart);
  return cart;
};

export const clearGuestCart = () => {
  try {
    localStorage.removeItem("guest_cart");
  } catch (err) {
    console.error("Error clearing guest cart:", err);
  }
};
