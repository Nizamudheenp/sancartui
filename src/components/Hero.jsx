import React from "react";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();
  const handleClick = () => navigate("/shop");

  return (
    <section className="relative min-h-screen flex flex-col justify-between pt-36 pb-16 overflow-hidden bg-transparent">
      {/* Premium blurred background portrait representation */}
      <div className="absolute inset-0 -z-20 bg-cover bg-center bg-no-repeat filter brightness-[0.9]" style={{ backgroundImage: "url('/images/hero.webp')" }} />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-slate-100/30 via-white/5 to-slate-100/30 backdrop-blur-[7px]" />
      
      {/* Floating abstract glow elements */}
      <div className="absolute top-[20%] left-[-15%] w-[450px] h-[450px] rounded-full bg-amber-500/10 blur-[100px] -z-10 animate-pulse" />
      <div className="absolute bottom-[10%] right-[-15%] w-[450px] h-[450px] rounded-full bg-primary-500/10 blur-[100px] -z-10" />

      {/* Main Content Area */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-grow flex flex-col justify-center items-center relative z-10">
        
        {/* Mockup Floating Side Badge (new arrivals capsule + arrow circle) */}
        <div className="absolute left-4 sm:left-12 lg:left-24 top-1/2 -translate-y-1/2 hidden md:flex flex-col items-center gap-1">
          <div className="bg-white px-3.5 py-1.5 rounded-full shadow-glass border border-white/60 text-[9px] font-black uppercase tracking-widest text-gray-800 rotate-[270deg] origin-center translate-y-[-20px]">
            New Arrivals
          </div>
          <div 
            onClick={handleClick}
            className="w-9 h-9 rounded-full bg-gray-950 text-white flex items-center justify-center text-sm font-black shadow-lg cursor-pointer hover:bg-primary-600 hover:scale-105 active:scale-95 transition-all duration-300 translate-y-[20px]"
          >
            ↓
          </div>
        </div>

        {/* Editorial Headline Overlay */}
        <div className="text-center">
          <h1 className="text-5xl sm:text-7xl lg:text-9xl font-serif font-light text-gray-900 leading-[1.05] tracking-tight max-w-5xl drop-shadow-sm">
            Your Finds <br />
            <span className="font-sans font-extrabold italic text-brand-gradient">in Safe Hands</span>
          </h1>
          
          <p className="mt-8 text-sm sm:text-lg text-gray-800 font-semibold max-w-xl mx-auto drop-shadow-xs">
            Handpicked trending treasures and premium essentials, shipped straight to your door.
          </p>
        </div>
      </div>

      {/* Bottom Floating Featured Card exactly matching Phone 2 */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10 flex justify-center sm:justify-start">
        <div 
          onClick={handleClick}
          className="cursor-pointer flex items-center gap-4 p-3 rounded-2xl border border-white/60 bg-white/45 backdrop-blur-2xl shadow-glass hover:shadow-glass-hover hover:scale-[1.03] transition-all duration-300 max-w-xs w-full"
        >
          <div className="w-14 h-14 rounded-xl bg-white border border-white/40 overflow-hidden shadow-inner flex-shrink-0 flex items-center justify-center">
            <img 
              src="/images/hero.webp" 
              alt="Charlotte Refill container" 
              className="w-full h-full object-cover scale-110"
              onError={(e) => {
                e.target.src = "/placeholder.jpg";
              }}
            />
          </div>
          <div className="text-start">
            <h4 className="text-xs font-black text-gray-950 leading-tight">Trending Items</h4>
            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Explore the Best</p>
          </div>
          <div className="ml-auto w-7 h-7 rounded-full border border-white bg-white flex items-center justify-center text-xs text-gray-800 shadow-sm">
            →
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
