import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";
import { showToast } from "../utils/toast";
import { addToGuestCart } from "../utils/guestCart";
import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";
import SEO from "../components/SEO";
import { Helmet } from "react-helmet-async";
import ProductCollection from "../components/ProductCollection";
import ProductCardImageSlider from "../components/ProductCardImageSlider";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const getUserFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const userData = getUserFromToken();
      setUser(userData);

      try {
        const res = await api.get(`/api/products/getaproduct/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!rating || rating < 1) {
      showToast("error", "Please select a star rating before submitting!");
      return;
    }
    try {
      await api.post(
        `/api/products/addreview/${id}`,
        { rating, comment }
      );
      showToast("success", "Review submitted successfully");
      setRating(0);
      setComment("");
      const res = await api.get(`/api/products/getaproduct/${id}`);
      setProduct(res.data);
    } catch (err) {
      console.error("Error submitting review:", err);
      showToast("error", "Error submitting review");
    }
  };

  const handleAddToCart = async () => {
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
      showToast("success", "Added to cart!");
    } catch (err) {
      console.error(err);
      showToast("error", "Could not add item to cart");
    }
  };

  const getAverageRating = (reviews = []) => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((sum, rev) => sum + rev.rating, 0);
    return total / reviews.length;
  };

  const renderStars = (ratingValue, interactive = false) => {
    const stars = [];
    const rounded = Math.round(ratingValue * 2) / 2;
    for (let i = 1; i <= 5; i++) {
      let icon = <FaRegStar />;
      if (i <= rounded) icon = <FaStar />;
      else if (i - 0.5 === rounded) icon = <FaStarHalfAlt />;

      stars.push(
        <span
          key={i}
          onClick={() => {
            if (interactive) setRating(i);
          }}
          className={`text-amber-400 text-lg ${interactive ? "cursor-pointer hover:scale-110 transition duration-150" : ""}`}
        >
          {icon}
        </span>
      );
    }
    return stars;
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4 pt-28">
        <span className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-semibold text-gray-500">Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-md mx-auto pt-36 pb-20 px-4 text-center">
        <div className="glass-card rounded-[2.5rem] p-10 shadow-glass">
          <h2 className="text-xl font-black text-gray-955 mb-2">
            Product Not Found
          </h2>
          <p className="text-xs text-gray-500 font-semibold mb-6">
            The item you are looking for does not exist or has been removed.
          </p>
          <button
            onClick={() => navigate('/shop')}
            className="px-6 py-3 bg-brand-gradient text-white text-xs font-bold rounded-full shadow-md"
          >
            Explore Shop
          </button>
        </div>
      </div>
    );
  }

  const productSchema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "image": product.images || [],
    "description": product.description || `Buy ${product.name} at Sancart.`,
    "brand": {
      "@type": "Brand",
      "name": product.brand || 'Sancart'
    },
    "offers": {
      "@type": "Offer",
      "url": `https://sancart.in/product/${product.id}`,
      "priceCurrency": "INR",
      "price": product.price,
      "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "itemCondition": "https://schema.org/NewCondition"
    }
  };

  if (product.rating > 0 && product.numReviews > 0) {
    productSchema.aggregateRating = {
      "@type": "AggregateRating",
      "ratingValue": product.rating,
      "reviewCount": product.numReviews
    };
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 pt-28 text-slate-800 font-sans">
      <SEO
        title={product.name}
        description={product.description}
        image={product.images?.[0]}
        url={`/product/${product.id}`}
        type="product"
      />
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(productSchema)}
        </script>
      </Helmet>

      {/* Main Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-start mb-16">

        {/* 1. Image Showcase Panel (Slider Carousel) */}
        <div className="glass-card rounded-[2.5rem] p-0 shadow-glass relative overflow-hidden bg-gray-100/50 border border-white/50 w-full">
          <ProductCardImageSlider
            images={product.images}
            alt={product.name}
            aspectRatio="h-[340px] sm:h-[480px]"
          />
        </div>

        {/* 2. Details Info Card */}
        <div className="glass-card rounded-[2.5rem] p-6 sm:p-10 shadow-glass flex flex-col space-y-6 text-start w-full">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {product.brand && (
                <span className="inline-block px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-primary-600 bg-primary-500/10 rounded-lg">
                  {product.brand}
                </span>
              )}
              {product.category && (
                <span className="inline-block px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-primary-600 bg-primary-500/10 rounded-lg">
                  {product.category}
                </span>
              )}
              <span className="inline-block px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-emerald-600 bg-emerald-500/10 rounded-lg">
                In Stock
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-gray-955 leading-tight tracking-tight">
              {product.name}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex gap-0.5">{renderStars(getAverageRating(product.reviews))}</div>
            <span className="text-xs font-bold text-gray-400">
              ({product.numReviews || product.reviews?.length || 0} customer reviews)
            </span>
          </div>

          <div className="border-t border-b border-white/30 py-4">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl sm:text-4xl font-black text-gray-955">
                ₹{product.price}
              </span>
              <span className="text-xs font-extrabold text-emerald-600 bg-emerald-500/10 px-2.5 py-1 rounded-full">
                Free Delivery
              </span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Description</h4>
            <p className="text-gray-600 text-xs sm:text-sm font-semibold leading-relaxed">
              {product.description || "No description available for this item."}
            </p>
          </div>

          <div className="pt-4">
            <button
              onClick={handleAddToCart}
              className="w-full sm:w-auto px-10 py-4 font-bold rounded-full text-white shadow-lg hover:shadow-xl bg-brand-gradient hover:scale-[1.01] active:scale-[0.99] transform transition-all duration-200 text-sm"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      {/* Reviews & Feedback Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start mb-16 text-start">
        {/* Review Form */}
        {user ? (
          <div className="glass-card rounded-[2.5rem] p-6 sm:p-8 shadow-glass">
            <h3 className="text-xl font-extrabold text-gray-955 mb-2">
              Write a Customer Review
            </h3>
            <p className="text-xs text-gray-500 font-semibold mb-4">
              Share your thoughts and rating for this product with our community.
            </p>
            <div className="flex gap-1 mb-4">{renderStars(rating, true)}</div>
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Your Review</label>
                <textarea
                  rows="4"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="What did you like or dislike about this item?"
                  className="w-full border border-white/60 bg-white/50 rounded-2xl p-4 text-sm text-gray-800 font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500/10 focus:border-primary-500 transition-all placeholder-gray-400"
                ></textarea>
              </div>
              <button
                type="submit"
                className="bg-brand-gradient text-white font-bold px-8 py-3.5 text-xs rounded-full shadow-md hover:shadow-lg transition active:scale-95"
              >
                Submit Review
              </button>
            </form>
          </div>
        ) : (
          <div className="glass-card rounded-[2.5rem] p-8 shadow-glass text-center">
            <h3 className="text-lg font-extrabold text-gray-955 mb-2">
              Have you bought this product?
            </h3>
            <p className="text-xs text-gray-500 font-semibold mb-4">
              Please sign in to write a customer review.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="bg-brand-gradient text-white font-bold px-6 py-2.5 text-xs rounded-full shadow-md"
            >
              Sign In to Review
            </button>
          </div>
        )}

        {/* User Reviews List */}
        <div className="glass-card rounded-[2.5rem] p-6 sm:p-8 shadow-glass">
          <h3 className="text-xl font-extrabold text-gray-955 mb-4">
            Customer Reviews ({product.reviews?.length || 0})
          </h3>
          {!product.reviews || product.reviews.length === 0 ? (
            <p className="text-gray-400 text-xs font-semibold italic">No reviews yet. Be the first to share your experience!</p>
          ) : (
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {product.reviews.map((rev, idx) => (
                <div
                  key={rev.id || rev._id || idx}
                  className="border border-white/50 rounded-2xl p-5 bg-white/40 backdrop-blur-md shadow-sm"
                >
                  <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                    <strong className="text-gray-955 font-extrabold text-sm">{rev.name || "Customer"}</strong>
                    <div className="flex gap-0.5">{renderStars(rev.rating)}</div>
                  </div>
                  <p className="text-gray-600 text-xs font-semibold leading-relaxed">{rev.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recommended Products */}
      {product.category && (
        <div className="border-t border-white/30 pt-12 text-start">
          <ProductCollection
            title="You May Also Like"
            tag="Recommendations"
            category={product.category}
            limit={4}
          />
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
