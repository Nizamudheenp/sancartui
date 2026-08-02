import React from "react";
import { useNavigate } from "react-router-dom";

const SmallBanner2 = () => {
  const navigate = useNavigate();

  const banners = [
    {
      title: "Hot Accessories",
      subtitle: "Smart Bags & Organizers",
      image: "/images/small-banner-3.png",
      tag: "Trending",
      link: "/shop?category=accessories",
    },
    {
      title: "Fitness Essentials",
      subtitle: "Active Gear & Gym Tech",
      image: "/images/small-banner-4.png",
      tag: "Top Rated",
      link: "/shop?category=fitness",
    },
    {
      title: "Kitchen Novelties",
      subtitle: "Eco Coffee Cups & Mugs",
      image: "/images/small-banner-5.png",
      tag: "New In",
      link: "/shop?category=kitchen",
    },
  ];

  return (
    <section
      id="banner-3"
      className="flex flex-wrap justify-between px-6 md:px-16 py-12 gap-6 bg-slate-50"
    >
      {banners.map((item, idx) => (
        <div
          key={idx}
          onClick={() => navigate(item.link)}
          className="relative flex flex-col justify-end items-start w-full sm:w-[48%] lg:w-[31%] h-[280px] p-6 rounded-3xl bg-cover bg-center text-white overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group"
          style={{
            backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.3)), url('${item.image}')`,
          }}
        >
          <div className="relative z-10 w-full">
            <span className="inline-block px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-accent-500 bg-white/95 rounded-full mb-3">
              {item.tag}
            </span>
            <h2 className="text-xl font-bold group-hover:translate-x-1 transition-transform duration-300">
              {item.title}
            </h2>
            <h3 className="text-gray-300 text-sm mt-1">
              {item.subtitle}
            </h3>
          </div>
        </div>
      ))}
    </section>
  );
};

export default SmallBanner2;
