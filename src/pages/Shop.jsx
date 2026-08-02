import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AiFillStar, AiOutlineStar, AiTwotoneStar } from 'react-icons/ai';
import { FiShoppingCart, FiSearch, FiSliders, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { showToast } from '../utils/toast';
import { addToGuestCart } from '../utils/guestCart';
import { motion } from 'framer-motion';

import SEO from '../components/SEO';

const CATEGORIES = [
  { value: 'all', label: 'All Products' },
  { value: 'gadgets', label: 'Trending Gadgets' },
  { value: 'lifestyle', label: 'Creative Living' },
  { value: 'fitness', label: 'Smart Fitness' },
  { value: 'kitchen', label: 'Innovative Kitchen' },
  { value: 'accessories', label: 'Hot Accessories' }
];

const SORTS = [
  { value: 'newest', label: 'Newest Arrivals' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating_desc', label: 'Top Rated' }
];

const ProductCard = ({ product, onClick }) => {
  const navigate = useNavigate();

  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(product.rating || 0);
    const hasHalfStar = product.rating - fullStars >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<AiFillStar key={`full-${i}`} className="text-amber-400" />);
    }
    if (hasHalfStar) stars.push(<AiTwotoneStar key="half" className="text-amber-400" />);
    while (stars.length < 5) stars.push(<AiOutlineStar key={`empty-${stars.length}`} className="text-gray-200" />);

    return stars;
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    const token = localStorage.getItem("token");
    if (!token || token === "null" || token === "undefined") {
      addToGuestCart(product, 1);
      showToast("success", "Added to cart!");
      return;
    }
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/products/addToCart`,
        { productId: product.id, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showToast("success", "Added to cart!");
    } catch (err) {
      console.error(err);
      showToast("error", "Could not add item to cart");
    }
  };

  return (
    <motion.div
      onClick={onClick}
      className="group relative flex flex-col justify-between overflow-hidden rounded-[2rem] border border-gray-100 bg-white p-4 shadow-sm hover:shadow-[0_15px_30px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300 cursor-pointer"
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.5 }}
      whileTap={{ scale: 0.98 }}
    >
      <div>
        {/* Constrained Height Image Container */}
        <div className="relative overflow-hidden h-48 w-full bg-slate-50/70 rounded-2xl p-4 flex items-center justify-center transition-colors duration-300 group-hover:bg-slate-50">
          <img
            src={product.images?.[0] || '/placeholder.svg'}
            alt={product.name}
            className="max-w-[85%] max-h-[85%] object-contain transform group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.target.src = "/placeholder.svg";
            }}
          />
          {product.brand && (
            <span className="absolute top-3 left-3 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-primary-600 bg-white/95 rounded-md shadow-sm border border-gray-100/50">
              {product.brand}
            </span>
          )}
        </div>

        {/* Text details */}
        <div className="px-1 pt-4 pb-1 text-start">
          <h5 className="text-gray-900 font-extrabold text-sm leading-snug group-hover:text-primary-500 transition-colors truncate">
            {product.name}
          </h5>
          <div className="flex items-center gap-1.5 mt-1.5">
            <div className="flex text-xs">{renderStars()}</div>
            <span className="text-gray-400 text-[10px] font-bold">({product.numReviews || 0})</span>
          </div>
        </div>
      </div>

      {/* Card bottom section with Add To Cart button as a block */}
      <div className="px-1 pt-3 border-t border-gray-50 mt-4 flex flex-col text-start">
        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Price</span>
        <h4 className="text-lg font-black text-gray-950 leading-none mt-1">₹{product.price}</h4>

        <button
          onClick={handleAddToCart}
          className="w-full mt-3.5 flex items-center justify-center gap-2 py-3 text-xs font-bold rounded-xl text-white bg-gradient-to-r from-primary-500 to-yellow-400 hover:shadow-md active:scale-95 transition-all duration-200"
        >
          <FiShoppingCart className="text-sm" />
          <span>Add to Cart</span>
        </button>
      </div>
    </motion.div>
  );
};

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Filters read from URL parameters or default values
  const categoryFilter = searchParams.get("category") || "all";
  const searchFilter = searchParams.get("search") || "";
  const sortFilter = searchParams.get("sort") || "newest";
  const pageFilter = parseInt(searchParams.get("page")) || 1;

  // Local state for search input to prevent firing request on every keystroke
  const [searchInput, setSearchInput] = useState(searchFilter);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/products/getproducts`,
        {
          params: {
            category: categoryFilter,
            search: searchFilter,
            sort: sortFilter,
            page: pageFilter,
            limit: 12
          }
        }
      );
      setProducts(res.data.products || []);
      setTotalCount(res.data.totalCount || 0);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error("Error fetching products:", err);
      showToast("error", "Error loading products");
    } finally {
      setLoading(false);
    }
  };

  // Sync search input box when URL search parameter changes
  useEffect(() => {
    setSearchInput(searchFilter);
  }, [searchFilter]);

  useEffect(() => {
    fetchProducts();
  }, [categoryFilter, searchFilter, sortFilter, pageFilter]);

  const updateParam = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value && value !== "all" && value !== "") {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    // Reset page to 1 when filters are changed
    if (key !== "page") {
      newParams.delete("page");
    }
    setSearchParams(newParams);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateParam("search", searchInput);
  };

  const handleClearFilters = () => {
    setSearchParams(new URLSearchParams());
    setSearchInput("");
  };

  return (
    <section className="max-w-[1400px] mx-auto px-4 md:px-8 py-24 min-h-screen bg-slate-50/30">
      <SEO title="Shop Trending Collections" description="Explore sancart trending and hot dropshipping items with premium quality." url="/shop" />

      {/* Header Info */}
      <div className="max-w-xl text-start mb-8">
        <h2 className="text-3xl md:text-5xl font-black text-gray-950 tracking-tight">
          Trending Shop
        </h2>
        <p className="text-gray-500 mt-2 text-sm md:text-base">
          Browse our selected collections. Use filters to find exactly what you need.
        </p>
      </div>

      {/* Advanced Control Row */}
      <div className="bg-white border border-gray-100 rounded-3xl p-6 mb-10 shadow-sm flex flex-col gap-6">
        {/* Row 1: Search and Sorting */}
        <div className="flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center">
          <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-lg flex items-center">
            <input
              type="text"
              placeholder="Search products by name..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-11 pr-24 py-3.5 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:outline-none transition-all text-sm text-gray-800 placeholder-gray-400"
            />
            <FiSearch className="absolute left-4 text-gray-400 text-lg" />
            <button
              type="submit"
              className="absolute right-2 px-4 py-2 text-xs font-bold text-white bg-primary-500 rounded-xl hover:bg-primary-600 transition-colors"
            >
              Search
            </button>
          </form>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wide flex items-center gap-1.5">
              <FiSliders /> Sort By:
            </span>
            <select
              value={sortFilter}
              onChange={(e) => updateParam("sort", e.target.value)}
              className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            >
              {SORTS.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 2: Category Filter Tabs */}
        <div className="border-t border-gray-50 pt-4 flex flex-wrap gap-2 items-center">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wide mr-2">Categories:</span>
          {CATEGORIES.map((c) => (
            <button
              key={c.value}
              onClick={() => updateParam("category", c.value)}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                categoryFilter === c.value
                  ? "bg-primary-500 text-white shadow-md"
                  : "bg-gray-50 hover:bg-gray-100 text-gray-600"
              }`}
            >
              {c.label}
            </button>
          ))}
          {(categoryFilter !== "all" || searchFilter !== "") && (
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 text-xs font-bold text-red-500 hover:text-red-600 bg-red-50 rounded-xl transition-all ml-auto"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Product Display and Pagination */}
      {loading ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center gap-4">
          <span className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-gray-500">Loading products...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="min-h-[30vh] border border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center p-8 bg-white">
          <p className="text-gray-500 font-medium">No products match your filter search.</p>
          <button
            onClick={handleClearFilters}
            className="mt-4 px-5 py-2.5 text-xs font-bold text-white bg-primary-500 rounded-xl hover:bg-primary-600 transition-all"
          >
            Show All Products
          </button>
        </div>
      ) : (
        <div>
          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={() => navigate(`/product/${product.id}`)}
              />
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-16 border-t border-gray-100 pt-8">
              <button
                disabled={pageFilter === 1}
                onClick={() => updateParam("page", pageFilter - 1)}
                className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${
                  pageFilter === 1
                    ? "bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed"
                    : "bg-white text-gray-600 border-gray-200 hover:bg-slate-50"
                }`}
              >
                <FiChevronLeft className="text-lg" />
              </button>

              <span className="text-sm font-bold text-gray-600 bg-slate-100/80 px-4 py-2 rounded-xl">
                Page {pageFilter} of {totalPages}
              </span>

              <button
                disabled={pageFilter === totalPages}
                onClick={() => updateParam("page", pageFilter + 1)}
                className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${
                  pageFilter === totalPages
                    ? "bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed"
                    : "bg-white text-gray-600 border-gray-200 hover:bg-slate-50"
                }`}
              >
                <FiChevronRight className="text-lg" />
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default Shop;
