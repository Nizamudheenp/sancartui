import React from "react";
import { useNavigate } from "react-router-dom";

const CategoryShowcase = () => {
  const navigate = useNavigate();

  const categories = [
    {
      name: "Trending Gadgets",
      tag: "Best Sellers",
      image: "/images/cat-gadgets.png",
      link: "/shop?category=gadgets",
      cols: "col-span-1 md:col-span-2",
    },
    {
      name: "Creative Living",
      tag: "New Arrivals",
      image: "/images/cat-lifestyle.png",
      link: "/shop?category=lifestyle",
      cols: "col-span-1",
    },
    {
      name: "Smart Health",
      tag: "Top Rated",
      image: "/images/cat-fitness.png",
      link: "/shop?category=fitness",
      cols: "col-span-1",
    },
    {
      name: "Innovative Kitchen",
      tag: "Staff Pick",
      image: "/images/cat-kitchen.png",
      link: "/shop?category=kitchen",
      cols: "col-span-1 md:col-span-2",
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
            Explore Trending Categories
          </h2>
          <p className="mt-3 text-lg text-gray-500">
            Handpicked premium essentials curated just for you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((cat, idx) => (
            <div
              key={idx}
              onClick={() => navigate(cat.link)}
              className={`relative group overflow-hidden rounded-3xl cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 h-80 ${cat.cols}`}
            >
              {/* Image Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent z-10 opacity-70 group-hover:opacity-85 transition-opacity duration-500" />
              
              <img
                src={cat.image}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                onError={(e) => {
                  /* Fallback gradient if file is not found */
                  e.target.style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-br from-primary-900/30 to-accent-900/40 -z-10" />

              <div className="absolute inset-x-0 bottom-0 p-8 z-20 flex flex-col justify-end h-full">
                <span className="inline-block self-start px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent-500 bg-white/95 rounded-full mb-3">
                  {cat.tag}
                </span>
                <h3 className="text-2xl font-bold text-white group-hover:translate-x-2 transition-transform duration-300">
                  {cat.name}
                </h3>
                <span className="text-sm font-medium text-gray-300 mt-2 flex items-center gap-1 group-hover:text-white transition-colors duration-300">
                  Explore Collection &rarr;
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryShowcase;
