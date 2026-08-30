import React from "react";
import { BsStarFill } from "react-icons/bs";

const Testimonials = () => {
  const reviews = [
    {
      name: "Sophia Carter",
      role: "Verified Buyer",
      rating: 5,
      comment: "Absolutely love the craftsmanship of the toys. sancart has become my go-to store for unique children's gifts!",
    },
    {
      name: "Liam Bennett",
      role: "Verified Buyer",
      rating: 5,
      comment: "Great customer service and very fast shipping. The premium learning kits are both fun and highly educational.",
    },
    {
      name: "Emily Rodriguez",
      role: "Verified Buyer",
      rating: 5,
      comment: "Stunning designs and top-notch materials. My kids love playing with these toys every single day.",
    },
  ];

  return (
    <div>
      <div className="text-center max-w-xl mx-auto mb-10">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
          Loved by Parents Everywhere
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-gray-500 font-bold uppercase tracking-widest">
          Here's what our happy community has to say.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reviews.map((rev, idx) => (
          <div
            key={idx}
            className="bg-white/45 backdrop-blur-md border border-white/60 p-6 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between"
          >
            <div>
              <div className="flex gap-1 mb-4">
                {[...Array(rev.rating)].map((_, i) => (
                  <BsStarFill key={i} className="text-amber-500 text-sm" />
                ))}
              </div>
              <p className="text-gray-700 italic leading-relaxed text-sm font-medium">
                "{rev.comment}"
              </p>
            </div>

            <div className="flex items-center gap-3 mt-6 pt-6 border-t border-white/40">              
              <h4 className="font-extrabold text-gray-950 text-sm">{rev.name}</h4>
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{rev.role}</p>               
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Testimonials;
