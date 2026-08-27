import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";
import { showToast } from "../utils/toast";
import { addToGuestCart } from "../utils/guestCart";
import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";
import SEO from "../components/SEO";
import { Helmet } from "react-helmet-async";
import ProductCollection from "../components/ProductCollection";

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
        { productId: product.id, quantity: 1 }
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
          className={`text-amber-400 text-lg ${interactive ? "cursor-pointer hover:scale-110 transition duration-150" : ""
            }`}
        >
          {icon}
        </span>
      );
    }
    return stars;
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-white gap-4">
        <span className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-semibold text-gray-500">Loading product details...</p>
      </div>
    );
  }
  if (!product)
    return (
      <h2 className="text-center text-lg font-medium text-red-500 mt-32">
        Product not found
      </h2>
    );

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
    <div className="max-w-7xl mx-auto px-6 py-24 mt-10">
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

        {/* 1. Image Container (Col 1, Row 1 on Desktop) */}
        <div className="lg:col-start-1 lg:row-start-1 w-full flex justify-center bg-slate-50 rounded-3xl p-8 border border-gray-100 shadow-sm h-[320px] sm:h-[450px] md:h-[500px] flex items-center justify-center overflow-hidden">
          <img
            src={product.images?.[0] || "/placeholder.svg"}
            alt={product.name}
            className="max-w-full max-h-full object-contain transform hover:scale-103 transition-transform duration-500"
            onError={(e) => {
              e.target.src = "/placeholder.svg";
            }}
          />
        </div>

        {/* 2. Details Column (Col 2, Row 1 on Desktop) */}
        <div className="lg:col-start-2 lg:row-start-1 flex flex-col space-y-6 text-start w-full">
          <div>
            {product.brand && (
              <span className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary-600 bg-primary-50 rounded-lg mb-3">
                {product.brand}
              </span>
            )}
            <h2 className="text-3xl md:text-5xl font-black text-gray-950 leading-tight">
              {product.name}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex gap-0.5">{renderStars(getAverageRating(product.reviews))}</div>
            <span className="text-sm font-semibold text-gray-400">
              ({product.numReviews || 0} customer reviews)
            </span>
          </div>

          <div className="border-t border-b border-gray-100 py-4">
            <h3 className="text-3xl font-black text-gray-950">
              ₹{product.price}
            </h3>
          </div>

          <div>
            <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Description</h4>
            <p className="text-gray-650 text-base leading-relaxed">
              {product.description || "No description available for this trending item."}
            </p>
          </div>

          <div className="pt-2 pb-6 lg:pb-0">
            <button
              onClick={handleAddToCart}
              className="px-10 py-4 font-bold rounded-full text-white shadow-xl bg-brand-gradient hover:scale-[1.03] active:scale-[0.98] transform transition-all duration-200"
            >
              Add to Cart
            </button>
          </div>
        </div>

        {/* 3. Review Column (Col 1, Row 2 on Desktop - stacks below image on desktop, below details on mobile) */}
        <div className="lg:col-start-1 lg:row-start-2 w-full flex flex-col gap-8">

          {/* Review Write section */}
          {user && (
            <div className="pt-6 border-t border-gray-100 text-start w-full">
              <h4 className="text-xl font-bold text-gray-900 mb-2">
                Write a Review
              </h4>
              <div className="flex gap-1 mb-4">{renderStars(rating, true)}</div>
              <form onSubmit={handleSubmitReview} className="space-y-4 w-full">
                <div>
                  <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Your Comment</label>
                  <textarea
                    rows="4"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    required
                    placeholder="Tell us what you think of this product..."
                    className="w-full border border-gray-200 rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="bg-brand-gradient text-white font-bold px-8 py-3 rounded-full shadow-md transition active:scale-95"
                >
                  Submit Review
                </button>
              </form>
            </div>
          )}

          {/* User Reviews List */}
          <div className="pt-6 border-t border-gray-100 text-start w-full">
            <h4 className="text-xl font-bold text-gray-900 mb-4">
              User Reviews
            </h4>
            {product.reviews.length === 0 ? (
              <p className="text-gray-400 text-sm italic">No reviews yet. Be the first to share your experience!</p>
            ) : (
              <div className="space-y-4">
                {product.reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="border border-gray-100 rounded-3xl p-6 bg-white shadow-sm hover:shadow-md transition-shadow duration-300"
                  >
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <strong className="text-gray-900 font-bold text-base">{rev.name}</strong>
                      <div className="flex gap-0.5">{renderStars(rev.rating)}</div>
                    </div>
                    <p className="text-gray-600 mt-2 leading-relaxed">{rev.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Recommended Products (Users also like) */}
      {product.category && (
        <div className="border-t border-gray-100 mt-16 pt-12 text-start">
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
