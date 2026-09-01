import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { useParams, useNavigate } from 'react-router-dom';
import { showToast } from "../utils/toast";

const CATEGORY_OPTIONS = [
  { value: 'gadgets', label: 'Trending Gadgets' },
  { value: 'lifestyle', label: 'Creative Living' },
  { value: 'fitness', label: 'Smart Health & Fitness' },
  { value: 'kitchen', label: 'Innovative Kitchen' },
  { value: 'accessories', label: 'Hot Accessories' }
];

const TAG_OPTIONS = [
  { value: 'New Arrival', label: 'New Arrival (Latest Drops)' },
  { value: 'Special Price', label: 'Special Price (Sale Discount)' },
  { value: 'Top Brand', label: 'Top Brand (Premium Label)' },
  { value: 'Best Seller', label: 'Best Seller (Most Ordered)' },
  { value: 'Featured', label: 'Featured Product (Main Grid)' },
  { value: 'Trending Product', label: 'Trending Product (Hot Seller)' },
];

const EditProduct = () => {
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    brand: '',
    tags: [],
    images: [],
  });
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchProductDetails();
  }, []);

  const fetchProductDetails = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/api/products/getaproduct/${id}`);
      setProduct(response.data);
    } catch (error) {
      console.error('Error fetching product details', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'images') {
      setProduct({ ...product, images: value.split(',') });
    } else {
      setProduct({ ...product, [name]: value });
    }
  };

  const handleTagsChange = (e) => {
    const selected = Array.from(e.target.selectedOptions, option => option.value);
    setProduct({ ...product, tags: selected });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(
        `/api/products/updateProduct/${id}`,
        product
      );
      showToast('success', 'Product updated successfully');
      setTimeout(() => navigate('/admin/dashboard'), 1000);
    } catch (error) {
      console.error('Error updating product', error);
      showToast('error', 'Error updating product');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 pt-28">
      {loading ? (
        <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3">
          <span className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold text-gray-500">Loading product details...</p>
        </div>
      ) : (
        <div className="glass-card rounded-[2.5rem] p-6 sm:p-10 shadow-glass text-start">
          {/* Page Title Header */}
          <div className="mb-8 border-b border-white/30 pb-6">
            <span className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary-600 bg-primary-500/10 rounded-lg mb-2">
              Catalog Management
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-gray-955 tracking-tight">
              Edit Product
            </h2>
            <p className="text-gray-500 text-xs sm:text-sm font-semibold mt-1">
              Modify product details, pricing, tags, or image URLs.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Product Name */}
            <div className="space-y-1.5">
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest">Product Name</label>
              <input
                type="text"
                name="name"
                value={product.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-white/60 bg-white/50 rounded-2xl focus:ring-2 focus:ring-primary-500/10 focus:border-primary-500 focus:outline-none transition text-sm text-gray-800 font-semibold"
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest">Description</label>
              <textarea
                rows="4"
                name="description"
                value={product.description}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-white/60 bg-white/50 rounded-2xl focus:ring-2 focus:ring-primary-500/10 focus:border-primary-500 focus:outline-none transition text-sm text-gray-800 font-semibold"
              />
            </div>

            {/* Price & Brand Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest">Price (₹)</label>
                <input
                  type="number"
                  name="price"
                  value={product.price}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-white/60 bg-white/50 rounded-2xl focus:ring-2 focus:ring-primary-500/10 focus:border-primary-500 focus:outline-none transition text-sm text-gray-800 font-semibold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest">Brand</label>
                <input
                  type="text"
                  name="brand"
                  value={product.brand}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-white/60 bg-white/50 rounded-2xl focus:ring-2 focus:ring-primary-500/10 focus:border-primary-500 focus:outline-none transition text-sm text-gray-800 font-semibold"
                />
              </div>
            </div>

            {/* Category Selection */}
            <div className="space-y-1.5">
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest">Category</label>
              <select
                name="category"
                value={product.category}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-white/60 bg-white/50 rounded-2xl focus:ring-2 focus:ring-primary-500/10 focus:border-primary-500 focus:outline-none text-sm text-gray-800 font-extrabold cursor-pointer transition"
              >
                {CATEGORY_OPTIONS.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>

            {/* Tags Selection */}
            <div className="space-y-2">
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest">Product Collections (Tags)</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 p-4 border border-white/60 bg-white/30 rounded-2xl">
                {TAG_OPTIONS.map((t) => (
                  <label key={t.value} className="flex items-center gap-2.5 text-xs text-gray-700 font-semibold cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={product.tags?.includes(t.value)}
                      onChange={(e) => {
                        let updatedTags = [...(product.tags || [])];
                        if (e.target.checked) {
                          updatedTags.push(t.value);
                        } else {
                          updatedTags = updatedTags.filter(item => item !== t.value);
                        }
                        setProduct({ ...product, tags: updatedTags });
                      }}
                      className="w-4 h-4 rounded text-primary-600 focus:ring-primary-500"
                    />
                    <span>{t.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Image URLs input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest">Images (URLs - Comma Separated)</label>
              <input
                type="text"
                name="images"
                value={product.images.join(',')}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-white/60 bg-white/50 rounded-2xl focus:ring-2 focus:ring-primary-500/10 focus:border-primary-500 focus:outline-none transition text-sm text-gray-800 font-semibold"
              />
            </div>

            {/* Image Previews */}
            {product.images && product.images.length > 0 && (
              <div className="space-y-2">
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest">Current Image Previews</label>
                <div className="flex flex-wrap gap-2.5">
                  {product.images.map((img, idx) => (
                    <div key={idx} className="w-20 h-20 border border-white/50 bg-white rounded-2xl overflow-hidden flex items-center justify-center p-1 shadow-sm">
                      <img src={img} alt={`Product ${idx}`} className="max-w-full max-h-full object-contain" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Submit Action */}
            <button
              type="submit"
              className="w-full py-4 mt-4 rounded-full font-bold text-white bg-brand-gradient shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 text-sm"
            >
              Update Product
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default EditProduct;
