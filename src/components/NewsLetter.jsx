import React from "react";

const NewsLetter = () => {
  return (
    <section
      id="newsletter"
      className="flex flex-wrap justify-between items-center px-10 py-14  bg-gradient-to-t from-blue-100 via-white to-orange-100 "
    >
      <div className="space-y-2 text-left max-w-lg">
        <h4 className="text-2xl font-bold text-blue-700">
          Sign up for Newsletters
        </h4>
        <p className="text-gray-700 font-medium text-sm">
          Get Email Updates About Our Shop and{" "}
          <span className="text-orange-600 font-semibold">Special Offers</span>
        </p>
      </div>

      <div className="flex w-full sm:w-2/5 mt-6 sm:mt-0">
        <input
          type="text"
          placeholder="Your Email Address"
          className="w-full px-5 py-3 rounded-l-md outline-none border border-0 text-gray-700 focus:ring-2 focus:ring-blue-200"
        />
        <button onClick={()=>location.reload()} className="bg-blue-600 w-40 text-white px-8 py-1 rounded-r-md font-semibold hover:bg-blue-700 transition-all">
          Sign up
        </button>
      </div>
    </section>
  );
};

export default NewsLetter;
