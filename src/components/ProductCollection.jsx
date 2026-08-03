import React, { useEffect, useState } from 'react';
import axios from 'axios';
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
          className="w-full mt-3.5 flex items-center justify-center gap-2 py-3 text-xs font-bold rounded-xl text-white bg-brand-gradient hover:shadow-md active:scale-95 transition-all duration-200"
        >
          <FiShoppingCart className="text-sm" />
          <span>Add to Cart</span>
        </button>
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

        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/products/getproducts?${queryParams.toString()}`
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
    <section className="max-w-[1300px] mx-auto px-6 md:px-8 py-16" id="Product-1">
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
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
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
