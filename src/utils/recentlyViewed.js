const RECENTLY_VIEWED_KEY = 'recentlyViewedProducts';

export const saveRecentlyViewedProduct = (product) => {
  if (!product || (!product.id && !product._id)) return;

  try {
    const existingStr = localStorage.getItem(RECENTLY_VIEWED_KEY);
    let items = existingStr ? JSON.parse(existingStr) : [];

    const productId = product.id || product._id;

    // Filter out existing occurrence of this product to avoid duplicates
    items = items.filter(item => (item.id || item._id) !== productId);

    // Prepare lightweight object to store
    const itemToSave = {
      id: productId,
      _id: productId,
      name: product.name,
      price: product.price,
      mrp: product.mrp,
      rating: product.rating,
      category: product.category,
      tags: product.tags || [],
      images: product.images || []
    };

    // Prepend to top of list
    items.unshift(itemToSave);

    // Keep max 10 recent items
    if (items.length > 10) {
      items = items.slice(0, 10);
    }

    localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(items));
  } catch (err) {
    console.error('Error saving recently viewed product:', err);
  }
};

export const getRecentlyViewedProducts = () => {
  try {
    const existingStr = localStorage.getItem(RECENTLY_VIEWED_KEY);
    return existingStr ? JSON.parse(existingStr) : [];
  } catch (err) {
    console.error('Error getting recently viewed products:', err);
    return [];
  }
};
