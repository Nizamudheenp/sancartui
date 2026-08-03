import React, { useState } from "react";
import { showToast } from "../utils/toast";

const NewsLetter = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      showToast("success", "Subscribed successfully!");
      setEmail("");
    }
  };

  return (
    <section
      id="newsletter"
      className="px-4 md:px-8 py-16 bg-slate-50 border-t border-b border-slate-100"
    >
      <div className="max-w-[1200px] mx-auto w-full flex flex-col lg:flex-row justify-between items-center gap-8">
        <div className="space-y-2 text-center lg:text-left max-w-xl">
          <h4 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
            Stay in the Loop
          </h4>
          <p className="text-slate-500 text-sm leading-relaxed">
            Subscribe to get updates on new arrivals, exclusive weekly drops, and{" "}
            <span className="text-[#1b36e3] font-bold">special member offers</span>.
          </p>
        </div>

        <div className="w-full max-w-md">
          {subscribed ? (
            <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-800 text-sm font-semibold rounded-2xl text-center">
              🎉 Thank you! You've successfully subscribed to our newsletter.
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="relative flex items-center w-full">
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-5 pr-32 py-4 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-600/10 focus:border-[#1b36e3] focus:outline-none transition-all text-sm text-slate-800 placeholder-slate-400 bg-white"
                required
              />
              <button 
                type="submit" 
                className="absolute right-2 px-6 py-2.5 text-xs font-bold text-white bg-brand-gradient rounded-xl hover:shadow-md active:scale-95 transition-all duration-150"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default NewsLetter;
