import React from "react";
import { useNavigate } from "react-router-dom";

const SmallBanner2 = () => {
  const navigate = useNavigate();

  const banners = [
    {
      title: "Hot Accessories",
      subtitle: "Smart Bags & Organizers",
      image: "/images/small-banner-3.webp",
      tag: "Trending",
      link: "/shop?category=accessories",
    },
    {
      title: "Fitness Essentials",
      subtitle: "Active Gear & Gym Tech",
      image: "/images/small-banner-4.webp",
      tag: "Top Rated",
      link: "/shop?category=fitness",
    },
    {
      title: "Kitchen Novelties",
      subtitle: "Eco Coffee Cups & Mugs",
      image: "/images/small-banner-5.webp",
      tag: "New In",
      link: "/shop?category=kitchen",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
      {banners.map((item, idx) => (
        <div
          key={idx}
          onClick={() => navigate(item.link)}
          className="relative flex flex-col justify-end items-start w-full h-[280px] p-6 rounded-[2.5rem] bg-cover bg-center text-white overflow-hidden border border-white/50 shadow-glass hover:shadow-glass-hover hover:scale-[1.01] transition-all duration-500 cursor-pointer group"
          style={{
            backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.75), rgba(0,0,0,0.2)), url('${item.image}')`,
          }}
        >
          <div className="relative z-10 w-full text-start">
            <span className="inline-block px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-accent-500 bg-white/95 rounded-full mb-3">
              {item.tag}
            </span>
            <h2 className="text-xl font-bold group-hover:translate-x-1 transition-transform duration-300">
              {item.title}
            </h2>
            <h3 className="text-gray-300 text-sm mt-1 font-medium">
              {item.subtitle}
            </h3>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SmallBanner2;
