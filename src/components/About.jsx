import React from "react";
import { FiAward, FiCompass, FiHeart, FiSmile } from "react-icons/fi";

const About = () => {
  const values = [
    {
      icon: <FiCompass className="text-3xl text-primary-500" />,
      title: "Our Vision",
      desc: "To redefine e-commerce by creating a reliable ecosystem that connects you to premium quality items on your own terms.",
    },
    {
      icon: <FiAward className="text-3xl text-primary-500" />,
      title: "Why sancart?",
      desc: "Wide selections of trending products, secure payment protection, prompt global shipping, and certified seller assurances.",
    },
    {
      icon: <FiHeart className="text-3xl text-primary-500" />,
      title: "Quality First",
      desc: "We prioritize durability, modern functionality, and aesthetic satisfaction to ensure every click brings true value.",
    },
    {
      icon: <FiSmile className="text-3xl text-primary-500" />,
      title: "Happy Community",
      desc: "Our dedicated support team is available 24/7. Your happiness, reviews, and satisfaction are the core markers of our growth.",
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 py-24 mt-10">
      
      {/* Brand Header Section */}
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <span className="inline-block px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-[#1b36e3] bg-blue-50 rounded-xl">
          About Sancart
        </span>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-950 leading-tight">
          Redefining Your <span className="text-brand-gradient">Shopping Experience</span>
        </h1>
        <p className="text-gray-500 text-sm md:text-base leading-relaxed max-w-xl mx-auto">
          Founded in 2026, sancart was born out of a simple idea: to make online shopping easier, faster, and more enjoyable by providing handpicked trending lifestyle accessories.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Column: Brand Story */}
        <div className="lg:col-span-5 text-start space-y-6">
          <h2 className="text-3xl md:text-5xl font-black text-gray-950 leading-tight">
            Our Journey & Passion
          </h2>
          <p className="text-gray-650 text-base leading-relaxed">
            What started as a small idea between a few passionate entrepreneurs is now one of the fastest-growing online marketplaces. We bring together trending tech devices, active gym essentials, minimalist home novelties, and smart kitchen tools from trusted makers globally.
          </p>
          <p className="text-gray-650 text-base leading-relaxed">
            Our team is a mix of dreamers, developers, and customer champions working around the clock to make sure sancart stays fast, secure, and reliable.
          </p>
          <div className="pt-4">
            <span className="inline-block border-l-4 border-primary-500 pl-4 text-base font-bold text-gray-950 italic">
              "We believe in transparent practices, reliable services, and giving users the freedom to shop on their own terms."
            </span>
          </div>
        </div>

        {/* Right Column: Values Cards Grid */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {values.map((val, idx) => (
            <div
              key={idx}
              className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-350 text-start flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center mb-6">
                  {val.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-950 mb-3">{val.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{val.desc}</p>
              </div>
            </div>
          ))}
        </div>

      </div>

    </section>
  );
};

export default About;
