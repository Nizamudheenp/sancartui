import React, { useState } from 'react';
import axios from 'axios';
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
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/products/createproduct`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
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
    <div className="mt-16 p-6">
      <form
        onSubmit={handleSubmit}
        className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-md space-y-4"
      >
        <input
          type="text"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <div className="text-start space-y-1.5">
          <label className="block text-sm font-semibold text-gray-700">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
          >
            {CATEGORY_OPTIONS.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>
        <input
          type="text"
          placeholder="Brand"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <div className="text-start space-y-2">
          <label className="block text-sm font-semibold text-gray-700">Product Collections (Tags)</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-3 border border-gray-200 rounded-lg">
            {TAG_OPTIONS.map((t) => (
              <label key={t.value} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
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
                  className="rounded text-blue-500 focus:ring-blue-400"
                />
                <span>{t.label}</span>
              </label>
            ))}
          </div>
        </div>
        <input
          type="file"
          multiple
          onChange={(e) => setImages(Array.from(e.target.files))}
          required
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 mt-2 rounded-lg font-semibold text-white transition-all ${
            loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-brand-gradient hover:shadow-md'
          }`}
        >
          {loading ? 'Adding...' : 'Add Product'}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
