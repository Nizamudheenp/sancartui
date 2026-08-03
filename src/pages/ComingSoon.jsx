import React from "react";
import { Link } from "react-router-dom";

const ComingSoon = () => {
  return (
    <div className="relative text-center flex flex-col items-center justify-center min-h-[80vh] px-6 mt-16 bg-gradient-to-br from-slate-50 via-indigo-50/10 to-amber-50/10 overflow-hidden">
      {/* Decorative Blur Circles */}
      <div className="absolute top-1/4 left-1/3 w-80 h-80 bg-primary-100/40 rounded-full blur-3xl -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent-100/30 rounded-full blur-3xl -z-10" />

      <div className="relative z-10 max-w-md bg-white/70 backdrop-blur-xl rounded-[2rem] p-10 border border-white/50 shadow-2xl flex flex-col items-center">
        <span className="text-6xl mb-6">🚧</span>
        <h1 className="mb-4 text-4xl sm:text-5xl font-black text-gray-950 leading-none">Coming Soon</h1>
        <h2 className="mb-3 text-lg font-bold text-gray-900">Page Under Construction</h2>
        <p className="mb-8 text-sm text-gray-500 leading-relaxed">
          We are currently working hard behind the scenes to build a premium shopping module for this section. Thank you for your patience!
        </p>
        <Link
          to="/"
          className="inline-flex items-center justify-center px-8 py-3.5 font-bold rounded-full text-white shadow-lg bg-brand-gradient hover:scale-[1.02] active:scale-[0.98] transform transition-all duration-200"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
};

export default ComingSoon;
