import React, { useState } from 'react';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';
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

const AddProduct = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('gadgets');
  const [brand, setBrand] = useState('');
  const [tags, setTags] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Array.from(images).forEach(image => formData.append('images', image));

    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('brand', brand);
    formData.append('category', category);
    tags.forEach(tag =>formData.append('tags[]', tags));

    const token = localStorage.getItem('token');
    setLoading(true);
    try {
      await api.post(
        "/api/products/createproduct",
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      setLoading(false);
      showToast('success', 'Product added successfully!');
      setTimeout(() => navigate('/admin/dashboard'), 1000);
    } catch (error) {
      setLoading(false);
      showToast('error', 'Error adding product');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 pt-28">
      <div className="glass-card rounded-[2.5rem] p-6 sm:p-10 shadow-glass text-start">
        {/* Page Title Header */}
        <div className="mb-8 border-b border-white/30 pb-6">
          <span className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary-600 bg-primary-500/10 rounded-lg mb-2">
            Catalog Management
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-gray-955 tracking-tight">
            Add New Product
          </h2>
          <p className="text-gray-500 text-xs sm:text-sm font-semibold mt-1">
            Fill in the details below to add a new item to your store catalog.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product Name */}
          <div className="space-y-1.5">
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest">Product Name</label>
            <input
              type="text"
              placeholder="e.g. Wireless Noise-Canceling Headphones"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-3 border border-white/60 bg-white/50 rounded-2xl focus:ring-2 focus:ring-primary-500/10 focus:border-primary-500 focus:outline-none transition text-sm text-gray-800 font-semibold placeholder-gray-400"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest">Description</label>
            <textarea
              rows="4"
              placeholder="Detailed product overview..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full px-4 py-3 border border-white/60 bg-white/50 rounded-2xl focus:ring-2 focus:ring-primary-500/10 focus:border-primary-500 focus:outline-none transition text-sm text-gray-800 font-semibold placeholder-gray-400"
            />
          </div>

          {/* Price & Brand Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest">Price (₹)</label>
              <input
                type="number"
                placeholder="2999"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                className="w-full px-4 py-3 border border-white/60 bg-white/50 rounded-2xl focus:ring-2 focus:ring-primary-500/10 focus:border-primary-500 focus:outline-none transition text-sm text-gray-800 font-semibold placeholder-gray-400"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest">Brand</label>
              <input
                type="text"
                placeholder="Brand Name (Optional)"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full px-4 py-3 border border-white/60 bg-white/50 rounded-2xl focus:ring-2 focus:ring-primary-500/10 focus:border-primary-500 focus:outline-none transition text-sm text-gray-800 font-semibold placeholder-gray-400"
              />
            </div>
          </div>

          {/* Category Selection */}
          <div className="space-y-1.5">
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
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
                    checked={tags.includes(t.value)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setTags([...tags, t.value]);
                      } else {
                        setTags(tags.filter((item) => item !== t.value));
                      }
                    }}
                    className="w-4 h-4 rounded text-primary-600 focus:ring-primary-500"
                  />
                  <span>{t.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Product Images Upload */}
          <div className="space-y-1.5">
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest">Product Images</label>
            <input
              type="file"
              multiple
              onChange={(e) => setImages(Array.from(e.target.files))}
              required
              className="w-full px-4 py-3 border border-white/60 bg-white/50 rounded-2xl focus:ring-2 focus:ring-primary-500/10 focus:border-primary-500 focus:outline-none text-xs text-gray-700 font-semibold cursor-pointer"
            />
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 mt-4 rounded-full font-bold text-white shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 text-sm ${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-brand-gradient'
            }`}
          >
            {loading ? 'Adding Product...' : 'Add Product to Catalog'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
