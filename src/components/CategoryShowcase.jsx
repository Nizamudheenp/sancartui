import React from "react";
import { useNavigate } from "react-router-dom";
import { FiCpu, FiCompass, FiActivity, FiCoffee, FiStar, FiShoppingBag, FiTv, FiHome, FiSmile, FiShield, FiTrendingUp } from "react-icons/fi";

const CategoryShowcase = () => {
  const navigate = useNavigate();

  const categories = [
    {
      name: "Gadgets",
      icon: <FiCpu />,
      link: "/shop?category=gadgets",
    },
    {
      name: "Lifestyle",
      icon: <FiCompass />,
      link: "/shop?category=lifestyle",
    },
    {
      name: "Fitness",
      icon: <FiActivity />,
      link: "/shop?category=fitness",
    },
    {
      name: "Kitchen",
      icon: <FiCoffee />,
      link: "/shop?category=kitchen",
    },
    {
      name: "Fashion",
      icon: <FiShoppingBag />,
      link: "/shop?category=fashion",
    },
    {
      name: "Beauty",
      icon: <FiSmile />,
      link: "/shop?category=beauty",
    },
    {
      name: "Electronics",
      icon: <FiTv />,
      link: "/shop?category=electronics",
    },
    {
      name: "Home",
      icon: <FiHome />,
      link: "/shop?category=home",
    },
    {
      name: "Accessories",
      icon: <FiStar />,
      link: "/shop?category=accessories",
    },
  ];

  return (
    <div className="w-full py-1 sm:py-2">
      <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-1.5 sm:gap-2 md:gap-3 lg:gap-3 xl:gap-5 items-center justify-items-center w-full">
        {categories.map((cat, idx) => {
          let visibilityClass = "flex";
          if (idx >= 4 && idx < 6) {
            visibilityClass = "hidden sm:flex";
          } else if (idx >= 6 && idx < 8) {
            visibilityClass = "hidden lg:flex";
          } else if (idx >= 8) {
            visibilityClass = "hidden";
          }

          return (
            <div 
              key={idx} 
              onClick={() => navigate(cat.link)}
              className={`${visibilityClass} flex-col items-center gap-1.5 sm:gap-2 lg:gap-2.5 cursor-pointer group w-full`}
            >
              <div 
                className="w-11 h-11 xs:w-13 xs:h-13 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-12 lg:h-12 xl:w-16 xl:h-16 2xl:w-20 2xl:h-20 rounded-full flex items-center justify-center text-base xs:text-lg sm:text-xl md:text-2xl lg:text-lg xl:text-2xl 2xl:text-3xl shadow-glass border border-white/70 bg-white/50 text-gray-850 group-hover:bg-white group-hover:scale-105 group-hover:shadow-glass-hover transition-all duration-300"
              >
                {cat.icon}
              </div>
              <span className="text-[9px] xs:text-[10px] sm:text-xs md:text-xs lg:text-[10px] xl:text-xs font-black text-gray-850 uppercase tracking-wider text-center line-clamp-1 group-hover:text-primary-500 transition-colors">
                {cat.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryShowcase;
