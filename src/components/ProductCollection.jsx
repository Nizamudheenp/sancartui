import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { AiFillStar, AiOutlineStar, AiTwotoneStar } from 'react-icons/ai';
import { FiShoppingCart } from 'react-icons/fi';
import { showToast } from '../utils/toast';
import { addToGuestCart } from '../utils/guestCart';
import { motion } from 'framer-motion';

import ProductCardImageSlider from './ProductCardImageSlider';

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
    if (!token) {
      addToGuestCart(product, 1);
      showToast("success", "Added to cart!");
      return;
    }
    try {
      await api.post(
        "/api/products/addToCart",
        { productId: product.id || product._id, quantity: 1 }
      );
      window.dispatchEvent(new Event("cartUpdated"));
      showToast("success", "Added to cart!");
    } catch (err) {
      console.error(err);
      showToast("error", "Could not add item to cart");
    }
  };

  return (
    <motion.div
      onClick={onClick}
      className="group relative flex flex-col justify-between overflow-hidden rounded-[2rem] border border-white/50 bg-white/20 backdrop-blur-md shadow-glass hover:shadow-glass-hover hover:-translate-y-1.5 transition-all duration-500 cursor-pointer"
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.5 }}
      whileTap={{ scale: 0.98 }}
    >
      <div>
        {/* Image Container with Slider for Multi-Image */}
        <div className="relative w-full border-b border-white/30 rounded-t-[1.7rem] sm:rounded-t-[1.95rem] overflow-hidden">
          <ProductCardImageSlider
            images={product.images}
            alt={product.name}
            aspectRatio="h-36 sm:h-52"
          />
          {product.brand ? (
            <span className="absolute top-2.5 left-2.5 z-10 px-2 py-0.5 text-[8px] font-extrabold uppercase tracking-widest text-[#1b36e3] bg-white/95 rounded-lg shadow-sm border border-gray-100/50">
              {product.brand}
            </span>
          ) : (
            <span className="absolute top-2.5 left-2.5 z-10 px-2 py-0.5 text-[8px] font-extrabold uppercase tracking-widest text-amber-600 bg-amber-500/10 border border-amber-500/20 backdrop-blur-md rounded-lg">
              Trending
            </span>
          )}
        </div>

        {/* Details Section - Tight compact padding */}
        <div className="p-3 sm:p-4 text-start">
          <span className="text-[8px] sm:text-[9px] font-extrabold text-gray-450 uppercase tracking-widest block mb-0.5">
            {product.category || "Trending Item"}
          </span>
          <h5 className="text-gray-950 font-extrabold text-xs sm:text-sm leading-snug line-clamp-2 overflow-hidden group-hover:text-primary-500 transition-colors">
            {product.name}
          </h5>
        </div>
      </div>

      {/* Bottom price and action bar - Single horizontal line */}
      <div className="px-3 sm:px-4 pb-3 sm:pb-4 pt-2 border-t border-white/20 flex items-center justify-between gap-2">
        <h4 className="text-xs sm:text-base font-black text-gray-950 truncate text-start min-w-0">
          ₹{product.price}
        </h4>

        {/* Ratings and Cart Action Row */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          {product.rating > 0 && (
            <div className="flex items-center gap-0.5 bg-amber-500/10 border border-amber-500/20 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-xl text-amber-600 text-[8px] sm:text-[9px] font-black">
              <span>{product.rating.toFixed(1)}</span>
              <span>★</span>
            </div>
          )}

          <button
            onClick={handleAddToCart}
            className="w-7 h-7 sm:w-9 sm:h-9 rounded-full border border-white/80 bg-white hover:bg-primary-500 hover:text-white text-gray-800 flex items-center justify-center shadow-md active:scale-90 transform transition-all duration-300"
          >
            <FiShoppingCart className="text-[11px] sm:text-sm" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const ProductCollection = ({ title, tag, category, search, limit }) => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const queryParams = new URLSearchParams();
        if (tag) queryParams.append('tag', tag);
        if (category) queryParams.append('category', category);
        if (search) queryParams.append('search', search);
        if (limit) queryParams.append('limit', limit);

        const res = await api.get(
          `/api/products/getproducts?${queryParams.toString()}`
        );
        setProducts(res.data.products || res.data);
      } catch (err) {
        console.error('Error fetching products:', err);
      }
    };
    fetchProducts();
  }, [tag, category, search, limit]);

  if (!products.length) return null;

  return (
    <section className="max-w-[1300px] mx-auto px-0 md:px-8 py-8 md:py-16" id="Product-1">
      <div className="max-w-xl text-start mb-10">
        <motion.h2
          className="text-2xl md:text-4xl font-extrabold text-gray-950 tracking-tight"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {title}
        </motion.h2>
        <motion.p
          className="text-gray-500 mt-2 text-base md:text-lg"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          Curated and handpicked trending catalog items.
        </motion.p>
      </div>

      <motion.div
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onClick={() => navigate(`/product/${product.id}`)}
          />
        ))}
      </motion.div>
    </section>
  );
};

export default ProductCollection;
