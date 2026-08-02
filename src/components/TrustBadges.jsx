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
    <section className="py-12 bg-gradient-to-r from-primary-50 via-white to-accent-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {badges.map((badge, idx) => (
            <div
              key={idx}
              className="flex items-center gap-4 p-6 bg-white/80 backdrop-blur-md rounded-2xl border border-white/50 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="p-3 bg-primary-50 rounded-xl">
                {badge.icon}
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-base">{badge.title}</h4>
                <p className="text-sm text-gray-500 mt-1">{badge.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBadges;
