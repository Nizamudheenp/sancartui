import React, { useEffect, useState, useRef } from 'react';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { AiFillStar, AiOutlineStar, AiTwotoneStar } from 'react-icons/ai';
import { FiShoppingCart, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { showToast } from '../utils/toast';
import { addToGuestCart } from '../utils/guestCart';
import { motion } from 'framer-motion';

import ProductCardImageSlider from './ProductCardImageSlider';
import { ProductSkeletonGrid } from './ProductSkeletonCard';

const ProductCard = ({ product, onClick }) => {
  const navigate = useNavigate();

  const displayTag = React.useMemo(() => {
    if (!product.tags || product.tags.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * product.tags.length);
    return product.tags[randomIndex];
  }, [product.tags, product.id, product._id]);

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
      className="group relative flex flex-col justify-between overflow-hidden rounded-[2rem] border border-white/50 bg-white/20 backdrop-blur-md shadow-glass hover:shadow-glass-hover hover:-translate-y-1.5 transition-all duration-500 cursor-pointer h-full"
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
          {displayTag ? (
            <span className="absolute top-2.5 left-2.5 z-10 px-2.5 py-0.5 text-[8.5px] font-black uppercase tracking-widest text-amber-400 bg-slate-950/85 backdrop-blur-md rounded-full shadow-md border border-white/20">
              {displayTag}
            </span>
          ) : (
            <span className="absolute top-2.5 left-2.5 z-10 px-2.5 py-0.5 text-[8.5px] font-black uppercase tracking-widest text-amber-400 bg-slate-950/85 backdrop-blur-md rounded-full shadow-md border border-white/20">
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

      {/* Bottom price and action bar */}
      <div className="px-3 sm:px-4 pb-3 sm:pb-4 pt-2 border-t border-white/20 flex items-center justify-between gap-2">
        <div className="flex items-baseline gap-1.5 min-w-0 flex-wrap text-start">
          <h4 className="text-xs sm:text-base font-black text-gray-955 truncate">
            ₹{product.price}
          </h4>
          {product.mrp && Number(product.mrp) > Number(product.price) && (
            <span className="text-[10px] sm:text-xs font-bold text-gray-400 line-through">
              ₹{product.mrp}
            </span>
          )}
        </div>

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

const ProductCollection = ({ title, tag, category, search, limit, excludeId, horizontal = false, containerClassName = "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12" }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (tag) queryParams.append('tag', tag);
        if (category) queryParams.append('category', category);
        if (search) queryParams.append('search', search);
        if (limit) queryParams.append('limit', limit);
        if (excludeId) queryParams.append('excludeId', excludeId);

        const res = await api.get(
          `/api/products/getproducts?${queryParams.toString()}`
        );
        setProducts(res.data.products || res.data || []);
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [tag, category, search, limit, excludeId]);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -280, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 280, behavior: 'smooth' });
    }
  };

  if (!loading && !products.length) return null;

  const skeletonCount = limit || 4;

  return (
    <div className={containerClassName}>
      <div className="glass-card rounded-[2.5rem] p-3 sm:p-10 shadow-glass">
        <section className="max-w-[1300px] mx-auto px-0 py-2 sm:py-4">
          <div className="flex items-center justify-between mb-8 sm:mb-10 flex-wrap gap-4">
            <div className="max-w-xl text-start">
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
                className="text-gray-500 mt-2 text-xs sm:text-lg font-semibold"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                Curated and handpicked trending catalog items.
              </motion.p>
            </div>

            {/* Scroll buttons for horizontal mode */}
            {horizontal && products.length > 0 && !loading && (
              <div className="flex items-center gap-2">
                <button
                  onClick={scrollLeft}
                  className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/80 hover:bg-white border border-white/60 text-gray-800 flex items-center justify-center shadow-md active:scale-90 transition-all"
                  aria-label="Scroll left"
                >
                  <FiChevronLeft className="text-base sm:text-lg" />
                </button>
                <button
                  onClick={scrollRight}
                  className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/80 hover:bg-white border border-white/60 text-gray-800 flex items-center justify-center shadow-md active:scale-90 transition-all"
                  aria-label="Scroll right"
                >
                  <FiChevronRight className="text-base sm:text-lg" />
                </button>
              </div>
            )}
          </div>

          {loading ? (
            <ProductSkeletonGrid count={skeletonCount} horizontal={horizontal} />
          ) : horizontal ? (
            <div
              ref={scrollRef}
              className="flex gap-3 sm:gap-6 overflow-x-auto pb-4 pt-2 scrollbar-none snap-x snap-mandatory scroll-smooth"
            >
              {products.map((product) => (
                <div key={product.id || product._id} className="w-[200px] sm:w-[260px] flex-shrink-0 snap-start">
                  <ProductCard
                    product={product}
                    onClick={() => navigate(`/product/${product.id || product._id}`)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 md:gap-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {products.map((product) => (
                <ProductCard
                  key={product.id || product._id}
                  product={product}
                  onClick={() => navigate(`/product/${product.id || product._id}`)}
                />
              ))}
            </motion.div>
          )}
        </section>
      </div>
    </div>
  );
};

export default ProductCollection;
