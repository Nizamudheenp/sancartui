import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { AiFillStar, AiOutlineStar, AiTwotoneStar } from 'react-icons/ai';
import { FiShoppingCart } from 'react-icons/fi';
import { showToast } from '../utils/toast';
import { addToGuestCart } from '../utils/guestCart';
import { motion } from 'framer-motion';

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
        { productId: product.id, quantity: 1 }
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
      className="group relative flex flex-col justify-between overflow-hidden rounded-[2rem] border border-white/50 bg-white/20 backdrop-blur-md shadow-glass hover:shadow-glass-hover hover:-translate-y-1.5 transition-all duration-500 cursor-pointer"
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.5 }}
      whileTap={{ scale: 0.98 }}
    >
      <div>
        {/* Image Container - Stretches exactly to the top, left, and right outer card edges */}
        <div className="relative w-full h-40 sm:h-52 bg-white flex items-center justify-center overflow-hidden border-b border-white/30 rounded-t-[1.95rem]">
          <img
            src={product.images?.[0] || '/placeholder.svg'}
            alt={product.name}
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
            onError={(e) => {
              e.target.src = "/placeholder.svg";
            }}
          />
          {product.brand ? (
            <span className="absolute top-3 left-3 px-2 py-0.5 text-[8px] font-extrabold uppercase tracking-widest text-[#1b36e3] bg-white/95 rounded-lg shadow-sm border border-gray-100/50">
              {product.brand}
            </span>
          ) : (
            <span className="absolute top-3 left-3 px-2 py-0.5 text-[8px] font-extrabold uppercase tracking-widest text-amber-600 bg-amber-500/10 border border-amber-500/20 backdrop-blur-md rounded-lg">
              Trending
            </span>
          )}
        </div>

        {/* Details Section - Padded inside */}
        <div className="p-4 sm:p-5 text-start">
          <span className="text-[9px] font-extrabold text-gray-450 uppercase tracking-widest block mb-1">
            {product.category || "Trending Item"}
          </span>
          <h5 
            className="text-gray-950 font-black text-xs sm:text-sm leading-snug group-hover:text-primary-500 transition-colors"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
              height: "2.5rem"
            }}
          >
            {product.name}
          </h5>
        </div>
      </div>

      {/* Bottom price and action bar - Padded inside, responsive stacking for mobile */}
      <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-3 border-t border-white/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="text-start">
          <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest block">Price</span>
          <h4 className="text-sm sm:text-base font-black text-gray-950">₹{product.price}</h4>
        </div>

        {/* Ratings and Cart Action Row - spans full width on mobile, aligns right on desktop */}
        <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
          {/* Dynamic rating value display */}
          {product.rating > 0 ? (
            <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 px-2 py-1 rounded-xl text-amber-600 text-[9px] font-black">
              <span>{product.rating.toFixed(1)}</span>
              <span>★</span>
            </div>
          ) : (
            <div className="flex-shrink-0" />
          )}

          <button
            onClick={handleAddToCart}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-white/80 bg-white hover:bg-primary-500 hover:text-white text-gray-800 flex items-center justify-center shadow-md active:scale-90 transform transition-all duration-300"
          >
            <FiShoppingCart className="text-xs sm:text-sm" />
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
