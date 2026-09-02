import React from "react";
import { FiTruck, FiShield, FiRotateCcw, FiHeadphones } from "react-icons/fi";

const TrustBadges = () => {
  const badges = [
    {
      icon: <FiTruck className="text-3xl text-primary-500" />,
      title: "Free Shipping",
      desc: "On all orders",
    },
    {
      icon: <FiShield className="text-3xl text-primary-500" />,
      title: "Secure Checkout",
      desc: "100% protected payments",
    },
    {
      icon: <FiRotateCcw className="text-3xl text-primary-500" />,
      title: "Easy Returns",
      desc: "Hassle-free money-back guarantee",
    },
    {
      icon: <FiHeadphones className="text-3xl text-primary-500" />,
      title: "24/7 Dedicated Support",
      desc: "Email assistance",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {badges.map((badge, idx) => (
        <div
          key={idx}
          className="flex items-center gap-4 p-5 bg-white/40 backdrop-blur-md rounded-2xl border border-white/50 shadow-glass transition-all duration-300 transform hover:-translate-y-1"
        >
          <div className="p-3 bg-primary-500/10 rounded-xl text-primary-600">
            {badge.icon}
          </div>
          <div>
            <h4 className="font-extrabold text-gray-900 text-sm sm:text-base">{badge.title}</h4>
            <p className="text-xs text-gray-500 mt-1 font-medium">{badge.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TrustBadges;
