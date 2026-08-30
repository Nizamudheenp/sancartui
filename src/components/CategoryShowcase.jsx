import React from "react";
import { useNavigate } from "react-router-dom";
import { FiCpu, FiCompass, FiActivity, FiCoffee, FiStar } from "react-icons/fi";

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
      name: "Essentials",
      icon: <FiStar />,
      link: "/shop?category=essentials",
    },
  ];

  return (
    <div className="py-2">
      <div className="flex flex-col items-center">
        {/* Category icons wrapped responsively for mobile to split into multiple lines when needed */}
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 md:gap-12 py-4 px-6 w-full">
          {categories.map((cat, idx) => (
            <div 
              key={idx} 
              onClick={() => navigate(cat.link)}
              className="flex flex-col items-center gap-3 cursor-pointer group"
            >
              <div 
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center text-xl sm:text-2xl shadow-glass border border-white/70 bg-white/50 text-gray-850 hover:bg-white hover:scale-110 hover:shadow-glass-hover transition-all duration-300"
              >
                {cat.icon}
              </div>
              <span className="text-[10px] sm:text-xs font-black text-gray-850 uppercase tracking-widest group-hover:text-primary-500 transition-colors">
                {cat.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryShowcase;
