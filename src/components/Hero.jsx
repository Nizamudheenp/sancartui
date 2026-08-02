import React from "react";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();
  const handleClick = () => navigate("/shop");

  return (
    <section className="relative min-h-[90vh] bg-gradient-to-br from-slate-50 via-indigo-50/30 to-amber-50/20 flex items-center pt-20 md:pt-28 pb-16 overflow-hidden">
      {/* Decorative Blur Spheres */}
      <div className="absolute top-1/4 -left-10 w-96 h-96 bg-primary-200/20 rounded-full blur-3xl -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 -right-10 w-96 h-96 bg-accent-100/30 rounded-full blur-3xl -z-10" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 w-full z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* Left Column: Premium Text Copy */}
          <div className="lg:col-span-7 flex flex-col justify-center text-center lg:text-left items-center lg:items-start">
            <span className="inline-flex self-center lg:self-start items-center gap-1.5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-amber-600 bg-amber-50 rounded-full mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
              Hot Trending Now
            </span>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-gray-900 leading-tight tracking-tight">
              Curated Finds <br />
              For Your Modern <br />
              <span className="bg-gradient-to-r from-primary-500 to-yellow-400 bg-clip-text text-transparent">Lifestyle</span>
            </h1>

            <p className="mt-6 text-base sm:text-lg text-gray-600 leading-relaxed max-w-xl mx-auto lg:mx-0">
              Discover handpicked viral accessories, daily essentials, and smart novelties designed to elevate your style. Direct shipping, certified quality.
            </p>

            <div className="mt-8 flex flex-wrap gap-4 justify-center lg:justify-start">
              <button
                onClick={handleClick}
                className="px-8 py-4 font-bold rounded-full text-white shadow-xl bg-gradient-to-r from-primary-500 to-yellow-400 hover:scale-[1.03] active:scale-[0.98] transform transition-all duration-200"
              >
                Shop Collection
              </button>
              <button
                onClick={() => navigate("/about")}
                className="px-8 py-4 font-semibold rounded-full text-gray-700 bg-white border border-gray-200/80 shadow-sm hover:bg-gray-50 active:scale-[0.98] transition-all duration-200"
              >
                Learn More
              </button>
            </div>
          </div>

          {/* Right Column: Padded Showcase Image Card */}
          <div className="lg:col-span-5 flex justify-center items-center mt-6 lg:mt-0">
            <div className="relative p-3 bg-white/70 backdrop-blur-md rounded-[2rem] sm:rounded-[2.5rem] border border-white/50 shadow-2xl hover:shadow-3xl transition-shadow duration-500 max-w-[280px] sm:max-w-md w-full">
              <div className="overflow-hidden rounded-[1.4rem] sm:rounded-[1.8rem] bg-gray-100 aspect-[4/5] shadow-inner">
                <img
                  src="/images/main-bg.jpeg"
                  alt="Trending showcase"
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                  onError={(e) => {
                    e.target.src = "/placeholder.jpg";
                  }}
                />
              </div>

              {/* Floating Interactive Badge */}
              <div className="absolute -bottom-4 -left-4 sm:-bottom-6 sm:-left-6 bg-white/95 backdrop-blur-md p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-gray-100 shadow-xl flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-primary-50 flex items-center justify-center text-primary-500 font-black text-xs sm:text-base">
                  ★
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-gray-900">4.9/5 Rating</h4>
                  <p className="text-[9px] sm:text-[10px] text-gray-400 font-semibold">Over 10k Customers</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
