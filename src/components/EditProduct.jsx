import React, { useEffect, useState } from 'react';
import axios from 'axios';
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
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products/getaproduct/${id}`);
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
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/products/updateProduct/${id}`,
        product,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showToast('success', 'Product updated successfully');
      setTimeout(() => navigate('/admin/dashboard'), 1000);
    } catch (error) {
      console.error('Error updating product', error);
      showToast('error', 'Error updating product');
    }
  };

  return (
    <div className="mt-16 p-6">
      {loading ? (
        <p className="text-center text-gray-500">Loading product details...</p>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-md space-y-4"
        >
          <div>
            <label className="block mb-1 font-semibold text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={product.name}
              onChange={handleInputChange}
              required
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold text-gray-700">Description</label>
            <textarea
              name="description"
              value={product.description}
              onChange={handleInputChange}
              required
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold text-gray-700">Price</label>
            <input
              type="number"
              name="price"
              value={product.price}
              onChange={handleInputChange}
              required
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold text-gray-700">Category</label>
            <select
              name="category"
              value={product.category}
              onChange={handleInputChange}
              required
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
            >
              {CATEGORY_OPTIONS.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 font-semibold text-gray-700">Brand</label>
            <input
              type="text"
              name="brand"
              value={product.brand}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold text-gray-700">Product Collections (Tags)</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-3 border border-gray-200 rounded-lg">
              {TAG_OPTIONS.map((t) => (
                <label key={t.value} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
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
                    className="rounded text-blue-500 focus:ring-blue-400"
                  />
                  <span>{t.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block mb-1 font-semibold text-gray-700">Images (URLs)</label>
            <input
              type="text"
              name="images"
              value={product.images.join(',')}
              onChange={handleInputChange}
              required
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <small className="text-gray-500">Enter image URLs separated by commas</small>
          </div>

          <div>
            <h4 className="font-semibold mb-2 text-gray-700">Current Images</h4>
            <div className="flex flex-wrap gap-2">
              {product.images.map((img, idx) => (
                <img key={idx} src={img} alt={`Product ${idx}`} className="w-24 h-24 object-cover rounded-lg" />
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 mt-4 rounded-lg font-semibold text-white bg-green-500 hover:bg-green-600 transition-colors"
          >
            Update Product
          </button>
        </form>
      )}
    </div>
  );
};

export default EditProduct;
