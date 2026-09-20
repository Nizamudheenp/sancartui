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
      className="glass-card relative flex flex-col items-center justify-center text-center w-full py-12 sm:py-16 md:py-20 px-6 rounded-[2.5rem] shadow-glass border border-white/60 bg-white/30 backdrop-blur-xl overflow-hidden"
    >
      {/* Decorative gradient glow accents */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-primary-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto">
        <span className="inline-block px-4 py-1.5 text-xs font-extrabold uppercase tracking-wider text-primary-600 bg-primary-500/10 border border-primary-500/20 rounded-full mb-4">
          Exclusive Deal of the Month
        </span>

        <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-gray-955 leading-tight tracking-tight mt-2">
          Upgrade Your Lifestyle with <span className="bg-gradient-to-r from-primary-600 to-amber-600 bg-clip-text text-transparent">Trending Gadgets</span>
        </h2>

        <p className="text-gray-600 mt-4 text-sm sm:text-base md:text-lg font-semibold max-w-xl mx-auto">
          Explore our hot-selling, handpicked collections. Get up to <span className="text-primary-600 font-extrabold">50% Off</span> plus free shipping this week!
        </p>

        <button
          onClick={handleClick}
          className="mt-8 inline-flex items-center justify-center px-10 py-4 font-bold rounded-full text-white shadow-xl bg-brand-gradient hover:scale-[1.03] active:scale-[0.98] transform transition-all duration-200 text-sm"
        >
          Shop Hot Deals
        </button>
      </div>
    </section>
  );
};

export default Banner;
