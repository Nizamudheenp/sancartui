import React from "react";
import { useNavigate } from "react-router-dom";

const Banner = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/shop");
  };

  return (
    <section
      id="banner"
      className="relative flex flex-col items-center justify-center text-center w-full h-[60vh] px-6 rounded-[2.5rem] bg-cover bg-center overflow-hidden border border-white/50 shadow-glass"
      style={{
        backgroundImage: "linear-gradient(to bottom, rgba(30, 59, 240, 0.2), rgba(255, 122, 24, 0.25)), url('/images/banner-main.webp')",
      }}
    >
      <div className="absolute inset-0 bg-black/35 backdrop-blur-[2px]" />

      <div className="relative z-10 max-w-3xl mx-auto px-4 py-8 md:pt-12 md:pr-12 md:pl-0">
        <span className="inline-block px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-amber-400 bg-amber-400/10 rounded-full mb-4">
          Exclusive Deal of the Month
        </span>

        <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-white leading-tight mt-2 drop-shadow-md">
          Upgrade Your Lifestyle with Trending Gadgets
        </h2>

        <p className="text-gray-200 mt-4 text-base md:text-lg max-w-xl mx-auto drop-shadow-sm">
          Explore our hot-selling, handpicked collections. Get up to <span className="text-yellow-400 font-bold">50% Off</span> plus free shipping this week!
        </p>

        <button
          onClick={handleClick}
          className="mt-8 inline-flex items-center justify-center px-10 py-4 font-bold rounded-full text-white shadow-xl bg-brand-gradient hover:scale-[1.03] active:scale-[0.98] transform transition-all duration-200"
        >
          Shop Hot Deals
        </button>
      </div>
    </section>
  );
};

export default Banner;
