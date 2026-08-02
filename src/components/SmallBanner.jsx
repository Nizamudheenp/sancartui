import React from "react";
import { useNavigate } from "react-router-dom";

const SmallBanner = () => {
  const navigate = useNavigate();

  const handleExploreTech = () => {
    navigate("/shop?category=gadgets");
  };

  const handleShopHome = () => {
    navigate("/shop?category=lifestyle");
  };

  return (
    <section
      id="sm-banner"
      className="flex flex-col md:flex-row justify-center items-center gap-8 px-6 md:px-16 py-12 bg-white"
    >
      {/* Banner 1 - Smart Devices */}
      <div
        className="relative flex flex-col justify-end items-start w-full md:w-1/2 h-[350px] md:h-[45vh] p-8 rounded-3xl bg-cover bg-center overflow-hidden group shadow-lg hover:shadow-2xl transition-all duration-300"
        style={{
          backgroundImage: "linear-gradient(to right, rgba(0,0,0,0.7), rgba(0,0,0,0.2)), url('/images/small-banner-1.webp')",
        }}
      >
        <div className="relative z-10 max-w-md">
          <span className="text-accent-500 text-xs font-bold uppercase tracking-wider">Smart Tech</span>
          <h2 className="text-3xl font-extrabold text-white mt-1 leading-tight">
            Next-Gen Wearables
          </h2>
          <p className="text-gray-300 text-sm mt-2 mb-6">
            Track your fitness, stay connected, and boost productivity with our trending smartwatch lineups.
          </p>
          <button
            className="bg-white text-gray-900 font-bold px-6 py-3 rounded-xl hover:bg-gray-100 transition-colors shadow-md active:scale-95 transform duration-150"
            onClick={handleExploreTech}
          >
            Explore Tech
          </button>
        </div>
      </div>

      {/* Banner 2 - Modern Kitchen / Home */}
      <div
        className="relative flex flex-col justify-end items-start w-full md:w-1/2 h-[350px] md:h-[45vh] p-8 rounded-3xl bg-cover bg-center overflow-hidden group shadow-lg hover:shadow-2xl transition-all duration-300"
        style={{
          backgroundImage: "linear-gradient(to right, rgba(0,0,0,0.7), rgba(0,0,0,0.2)), url('/images/small-banner-2.webp')",
        }}
      >
        <div className="relative z-10 max-w-md">
          <span className="text-accent-500 text-xs font-bold uppercase tracking-wider">Home Comfort</span>
          <h2 className="text-3xl font-extrabold text-white mt-1 leading-tight">
            Minimalist Living
          </h2>
          <p className="text-gray-300 text-sm mt-2 mb-6">
            Upgrade your surroundings with our selected smart home appliances and interior novelties.
          </p>
          <button
            className="bg-white text-gray-900 font-bold px-6 py-3 rounded-xl hover:bg-gray-100 transition-colors shadow-md active:scale-95 transform duration-150"
            onClick={handleShopHome}
          >
            Shop Home
          </button>
        </div>
      </div>
    </section>
  );
};

export default SmallBanner;
