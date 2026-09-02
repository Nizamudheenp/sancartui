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
  });
  const [existingImages, setExistingImages] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProductDetails();
  }, []);

  const fetchProductDetails = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/api/products/getaproduct/${id}`);
      const data = response.data;
      setProduct({
        name: data.name || '',
        description: data.description || '',
        price: data.price || '',
        category: data.category || 'gadgets',
        brand: data.brand || '',
        tags: data.tags || [],
      });
      setExistingImages(data.images || []);
    } catch (error) {
      console.error('Error fetching product details', error);
      showToast('error', 'Error loading product details');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleNewFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setNewFiles((prev) => [...prev, ...files]);
    }
  };

  const removeExistingImage = (indexToRemove) => {
    setExistingImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const removeNewFile = (indexToRemove) => {
    setNewFiles((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (existingImages.length === 0 && newFiles.length === 0) {
      showToast('error', 'Product must have at least one image.');
      return;
    }

    const formData = new FormData();
    formData.append('name', product.name);
    formData.append('description', product.description);
    formData.append('price', product.price);
    formData.append('brand', product.brand);
    formData.append('category', product.category);
    formData.append('existingImages', JSON.stringify(existingImages));

    (product.tags || []).forEach((tag) => formData.append('tags[]', tag));
    newFiles.forEach((file) => formData.append('images', file));

    setSubmitting(true);
    try {
      await api.put(
        `/api/products/updateProduct/${id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      showToast('success', 'Product updated successfully!');
      setTimeout(() => navigate('/admin/dashboard'), 1000);
    } catch (error) {
      console.error('Error updating product', error);
      showToast('error', error.response?.data?.message || 'Error updating product');
    } finally {
      setSubmitting(false);
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
              Modify details, manage image gallery, or upload new Sharp WebP optimized images.
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
                          updatedTags = updatedTags.filter((item) => item !== t.value);
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

            {/* Existing Images Gallery */}
            {existingImages.length > 0 && (
              <div className="space-y-2">
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest">Existing Images ({existingImages.length})</label>
                <div className="flex flex-wrap gap-3 p-4 border border-white/60 bg-white/30 rounded-2xl">
                  {existingImages.map((imgUrl, idx) => (
                    <div key={idx} className="relative w-20 h-20 border border-white/60 bg-white rounded-2xl overflow-hidden p-1 shadow-sm group">
                      <img src={imgUrl} alt={`Existing ${idx}`} className="w-full h-full object-cover rounded-xl" />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(idx)}
                        className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-[10px] font-extrabold shadow-md hover:bg-red-600 transition"
                        title="Delete image"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Add New Image Files */}
            <div className="space-y-2">
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest">Upload Additional New Images</label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleNewFileSelect}
                className="w-full px-4 py-3 border border-white/60 bg-white/50 rounded-2xl focus:ring-2 focus:ring-primary-500/10 focus:border-primary-500 focus:outline-none text-xs text-gray-700 font-semibold cursor-pointer"
              />

              {/* New Files Preview Stack */}
              {newFiles.length > 0 && (
                <div className="mt-3 p-4 border border-white/60 bg-white/30 rounded-2xl">
                  <p className="text-[11px] font-bold text-gray-500 mb-2">
                    New Upload Queue ({newFiles.length}) - Auto-compressed to WebP:
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {newFiles.map((file, idx) => {
                      const objectUrl = URL.createObjectURL(file);
                      return (
                        <div key={idx} className="relative w-20 h-20 rounded-2xl border border-white/60 bg-white overflow-hidden p-1 shadow-sm group">
                          <img src={objectUrl} alt={`New upload ${idx}`} className="w-full h-full object-cover rounded-xl" />
                          <button
                            type="button"
                            onClick={() => removeNewFile(idx)}
                            className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-[10px] font-extrabold shadow-md hover:bg-red-600 transition"
                            title="Remove file"
                          >
                            ✕
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              disabled={submitting}
              className={`w-full py-4 mt-4 rounded-full font-bold text-white shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 text-sm ${
                submitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-brand-gradient'
              }`}
            >
              {submitting ? 'Updating Product...' : 'Update Product'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default EditProduct;
