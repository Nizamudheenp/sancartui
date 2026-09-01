import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { showToast } from "../utils/toast";
import { motion } from "framer-motion";
import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiTag,
  FiFolder,
  FiDatabase,
  FiImage,
  FiSearch,
  FiFilter,
} from "react-icons/fi";

import ProductCardImageSlider from '../components/ProductCardImageSlider';

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/api/products/getproducts');
      setProducts(response.data.products || response.data || []);
    } catch (error) {
      console.error("Error fetching products", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await api.delete(`/api/products/deleteProduct/${id}`);
      showToast('success', 'Product deleted successfully');
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product", error);
      showToast('error', 'Failed to delete product');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
  };

  // Filter products based on search term & category selection
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Extract unique categories for dropdown list
  const categoriesList = Array.from(
    new Set(products.map((p) => p.category).filter(Boolean))
  );

  // Dashboard Stats Calculations
  const totalProducts = products.length;
  const categoriesCount = categoriesList.length;
  const brandsCount = new Set(products.map((p) => p.brand).filter(Boolean)).size;

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
        <span className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-semibold text-gray-500">Loading catalog items...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 pt-28">
      <div>

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10 text-start">
          <div>
            <span className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary-600 bg-primary-500/10 rounded-lg mb-3">
              Admin Control Center
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-gray-955 tracking-tight">
              Product Dashboard
            </h2>
            <p className="text-gray-500 text-sm font-semibold mt-1">
              Add, update, or remove products in your catalog list
            </p>
          </div>
          <button
            onClick={() => navigate('/admin/add-product')}
            className="flex items-center justify-center gap-2 px-6 py-3.5 bg-brand-gradient text-white font-bold rounded-2xl shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 text-xs sm:text-sm"
          >
            <FiPlus size={18} /> Add New Product
          </button>
        </div>

        {/* Catalog Stats Panel */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10 text-start">
          <div className="bg-white/40 backdrop-blur-md border border-white/50 p-6 rounded-3xl shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-primary-500/10 rounded-2xl flex items-center justify-center text-primary-600 text-xl flex-shrink-0">
              <FiDatabase />
            </div>
            <div>
              <p className="text-xs font-extrabold text-gray-400 uppercase tracking-wider">
                Total Catalog Items
              </p>
              <p className="text-2xl font-black text-gray-955 mt-0.5">
                {totalProducts}
              </p>
            </div>
          </div>

          <div className="bg-white/40 backdrop-blur-md border border-white/50 p-6 rounded-3xl shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-600 text-xl flex-shrink-0">
              <FiTag />
            </div>
            <div>
              <p className="text-xs font-extrabold text-gray-400 uppercase tracking-wider">
                Unique Brands
              </p>
              <p className="text-2xl font-black text-gray-955 mt-0.5">
                {brandsCount}
              </p>
            </div>
          </div>

          <div className="bg-white/40 backdrop-blur-md border border-white/50 p-6 rounded-3xl shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-600 text-xl flex-shrink-0">
              <FiFolder />
            </div>
            <div>
              <p className="text-xs font-extrabold text-gray-400 uppercase tracking-wider">
                Unique Categories
              </p>
              <p className="text-2xl font-black text-gray-955 mt-0.5">
                {categoriesCount}
              </p>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar Panel */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 bg-white/40 backdrop-blur-md border border-white/50 p-4 rounded-3xl shadow-sm">
          {/* Search bar */}
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
              <FiSearch size={18} />
            </span>
            <input
              type="text"
              placeholder="Search products by name, description, brand..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 border border-white/60 bg-white/50 rounded-2xl focus:ring-2 focus:ring-primary-500/10 focus:border-primary-500 focus:outline-none transition text-sm text-gray-800 font-semibold placeholder-gray-400"
            />
          </div>

          {/* Category filter */}
          <div className="relative w-full sm:w-60">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400 pointer-events-none">
              <FiFilter size={16} />
            </span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-white/60 bg-white/50 rounded-2xl focus:ring-2 focus:ring-primary-500/10 focus:border-primary-500 focus:outline-none text-xs font-bold text-gray-700 cursor-pointer transition appearance-none"
            >
              <option value="">All Categories</option>
              {categoriesList.map((cat, idx) => (
                <option key={idx} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="glass-card rounded-[2.5rem] p-12 text-center max-w-lg mx-auto shadow-glass">
            <div className="w-16 h-16 rounded-full bg-white/40 border border-white/50 flex items-center justify-center mx-auto mb-6 text-2xl text-gray-400 shadow-sm">
              <FiDatabase />
            </div>
            <h3 className="text-lg font-extrabold text-gray-950 mb-2">No products match filters</h3>
            <p className="text-xs sm:text-sm text-gray-500 font-semibold">
              Try adjusting your search query or category filters to find products.
            </p>
          </div>
        ) : (
          /* Products Grid: 2-3 columns on mobile, 4 on tablet, 5 on desktop */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4 lg:gap-5">
            {filteredProducts.map((product, index) => {
              const productId = product.id || product._id || `product-${index}`;
              return (
                <div
                  key={productId}
                  className="glass-card rounded-3xl shadow-glass overflow-hidden flex flex-col justify-between text-start group hover:-translate-y-1 transition-all duration-300"
                >
                  <div>
                    {/* Image Showcase Frame with Slider */}
                    <div className="relative w-full overflow-hidden">
                      <ProductCardImageSlider
                        images={product.images}
                        alt={product.name}
                        aspectRatio="h-36 sm:h-44"
                      />
                      <span className="absolute top-2.5 right-2.5 bg-white/90 backdrop-blur-md border border-white/60 px-2.5 py-0.5 rounded-full text-[11px] sm:text-xs font-black text-gray-955 shadow-sm z-10">
                        ₹{product.price}
                      </span>
                    </div>

                    {/* Product Details info */}
                    <div className="p-3.5 sm:p-4">
                      <div className="flex flex-wrap items-center gap-1 mb-1.5">
                        {product.category && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[9px] sm:text-[10px] font-extrabold text-primary-600 uppercase tracking-tight bg-primary-500/10 rounded-md">
                            <FiFolder size={9} /> {product.category}
                          </span>
                        )}
                        {product.brand && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[9px] sm:text-[10px] font-extrabold text-primary-600 uppercase tracking-tight bg-primary-500/10 rounded-md truncate max-w-[90px]">
                            <FiTag size={9} /> {product.brand}
                          </span>
                        )}
                      </div>

                      <h3 className="text-xs sm:text-sm font-extrabold text-gray-955 leading-snug line-clamp-1 mb-1">
                        {product.name}
                      </h3>

                      <p className="text-[11px] text-gray-500 font-semibold leading-relaxed line-clamp-1">
                        {product.description}
                      </p>
                    </div>
                  </div>

                  {/* Card Actions Panel */}
                  <div className="p-3.5 sm:p-4 pt-0 mt-auto border-t border-white/30 flex gap-2">
                    <button
                      onClick={() => navigate(`/admin/edit-product/${product.id || product._id}`)}
                      className="flex-1 flex items-center justify-center gap-1 bg-white/50 border border-white/60 hover:bg-white text-gray-800 font-extrabold py-2 rounded-xl transition duration-150 text-[11px] shadow-sm"
                    >
                      <FiEdit size={12} /> Edit
                    </button>
                    <button
                      onClick={() => deleteProduct(product.id || product._id)}
                      className="flex-1 flex items-center justify-center gap-1 bg-red-500/10 border border-red-200 hover:bg-red-500/20 text-red-600 font-extrabold py-2 rounded-xl transition duration-150 text-[11px] shadow-sm"
                    >
                      <FiTrash2 size={12} /> Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
