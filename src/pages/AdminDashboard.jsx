import React, { useEffect, useState } from 'react';
import axios from 'axios';
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
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products/getproducts`);
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
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/products/deleteProduct/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
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
    <div className="min-h-screen bg-slate-50/50 px-4 md:px-8 pt-28 pb-16">
      <div className="max-w-6xl mx-auto">

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10 text-start">
          <div>
            <span className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary-600 bg-primary-50 rounded-lg mb-3">
              Admin Control Center
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
              Product Dashboard
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Add, update, or remove products in your catalog list
            </p>
          </div>
          <button
            onClick={() => navigate('/admin/add-product')}
            className="flex items-center justify-center gap-2 px-6 py-3.5 bg-brand-gradient text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95 text-sm"
          >
            <FiPlus size={18} /> Add New Product
          </button>
        </div>

        {/* Catalog Stats Panel */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10 text-start">
          <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center text-primary-500 text-xl flex-shrink-0">
              <FiDatabase />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                Total Catalog Items
              </p>
              <p className="text-2xl font-black text-gray-900 mt-0.5">
                {totalProducts}
              </p>
            </div>
          </div>

          <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500 text-xl flex-shrink-0">
              <FiTag />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                Unique Brands
              </p>
              <p className="text-2xl font-black text-gray-900 mt-0.5">
                {brandsCount}
              </p>
            </div>
          </div>

          <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-500 text-xl flex-shrink-0">
              <FiFolder />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                Unique Categories
              </p>
              <p className="text-2xl font-black text-gray-900 mt-0.5">
                {categoriesCount}
              </p>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar Panel */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 bg-white border border-gray-100 p-4 rounded-2xl shadow-sm">
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
              className="w-full pl-11 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:outline-none transition text-sm text-gray-800"
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
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:outline-none text-xs font-bold text-gray-700 bg-white cursor-pointer transition appearance-none"
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
          <div className="bg-white border border-gray-100 rounded-3xl p-12 text-center max-w-lg mx-auto shadow-sm">
            <div className="w-16 h-16 rounded-full bg-slate-50 border border-gray-100 flex items-center justify-center mx-auto mb-6 text-2xl text-gray-400">
              <FiDatabase />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">No products match filters</h3>
            <p className="text-sm text-gray-500 mb-6">
              Try adjusting your search query or category filters to find products.
            </p>
          </div>
        ) : (
          /* Products Grid */
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white border border-gray-100/80 rounded-3xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col justify-between text-start group"
              >
                <div>
                  {/* Image Showcase Frame */}
                  <div className="h-56 bg-slate-50 border-b border-gray-50 relative flex items-center justify-center p-6 overflow-hidden">
                    <img
                      src={product.images?.[0] || "/placeholder.jpg"}
                      alt={product.name}
                      className="max-w-full max-h-full object-contain transform group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = "/placeholder.jpg";
                      }}
                    />
                    <span className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm border border-gray-100 px-3 py-1 rounded-full text-xs font-black text-gray-900 shadow-sm">
                      ₹{product.price}
                    </span>
                  </div>

                  {/* Product Details info */}
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      {product.category && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold text-primary-500 uppercase tracking-wide bg-primary-50 rounded-md">
                          <FiFolder size={10} /> {product.category}
                        </span>
                      )}
                      {product.brand && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold text-accent-500 uppercase tracking-wide bg-accent-50 rounded-md">
                          <FiTag size={10} /> {product.brand}
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-bold text-gray-950 leading-snug line-clamp-1 mb-2">
                      {product.name}
                    </h3>

                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-4">
                      {product.description}
                    </p>

                    {/* Image thumb preview stack */}
                    {product.images && product.images.length > 1 && (
                      <div className="mt-2 border-t border-gray-50 pt-3">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-2 flex items-center gap-1">
                          <FiImage size={10} /> Images ({product.images.length})
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {product.images.map((img, idx) => (
                            <div key={idx} className="w-8 h-8 rounded-md border border-gray-100 overflow-hidden flex items-center justify-center p-0.5 bg-white">
                              <img
                                src={img}
                                alt="Thumb"
                                className="max-w-full max-h-full object-contain"
                                onError={(e) => {
                                  e.target.src = "/placeholder.jpg";
                                }}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Actions Panel */}
                <div className="p-6 pt-0 mt-auto border-t border-gray-50/50 flex gap-3">
                  <button
                    onClick={() => navigate(`/admin/edit-product/${product.id}`)}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold py-2.5 rounded-xl transition duration-150 text-xs"
                  >
                    <FiEdit size={13} /> Edit
                  </button>
                  <button
                    onClick={() => deleteProduct(product.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold py-2.5 rounded-xl transition duration-150 text-xs"
                  >
                    <FiTrash2 size={13} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
