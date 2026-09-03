import React from "react";
import { FiTruck, FiShield, FiRotateCcw, FiHeadphones } from "react-icons/fi";

const TrustBadges = () => {
  const badges = [
    {
      icon: <FiTruck className="text-2xl sm:text-3xl text-primary-500" />,
      title: "Free Shipping",
      desc: "On all orders",
    },
    {
      icon: <FiShield className="text-2xl sm:text-3xl text-primary-500" />,
      title: "Secure Checkout",
      desc: "100% protected payments",
    },
    {
      icon: <FiRotateCcw className="text-2xl sm:text-3xl text-primary-500" />,
      title: "Easy Returns",
      desc: "Hassle-free money-back guarantee",
    },
    {
      icon: <FiHeadphones className="text-2xl sm:text-3xl text-primary-500" />,
      title: "24/7 Dedicated Support",
      desc: "Email assistance",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
      {badges.map((badge, idx) => (
        <div
          key={idx}
          className="flex flex-col sm:flex-row items-start sm:items-center gap-2.5 sm:gap-4 p-3.5 sm:p-5 bg-white/40 backdrop-blur-md rounded-2xl border border-white/50 shadow-glass transition-all duration-300 transform hover:-translate-y-1 text-start"
        >
          <div className="p-2.5 sm:p-3 bg-primary-500/10 rounded-xl text-primary-600 flex-shrink-0">
            {badge.icon}
          </div>
          <div>
            <h4 className="font-extrabold text-gray-900 text-xs sm:text-base leading-snug">{badge.title}</h4>
            <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 font-medium leading-tight">{badge.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TrustBadges;
