import React from "react";
import { BsStarFill, BsCheckCircleFill } from "react-icons/bs";

const Testimonials = () => {
  const reviews = [
    {
      name: "Ananya Sharma",
      location: "Bengaluru",
      initials: "AS",
      color: "from-blue-500 to-indigo-600",
      rating: 5,
      comment: "Ordered a smart desktop organizer and LED light strip. Delivery reached Bengaluru in just 3 days! Product quality is genuine and exactly like shown in images.",
    },
    {
      name: "Rohan Verma",
      location: "Mumbai",
      initials: "RV",
      color: "from-purple-500 to-pink-600",
      rating: 5,
      comment: "Honestly was skeptical initially, but the Cash on Delivery option gave full confidence. Packaging was super protective and the kitchen gadgets work like a charm!",
    },
    {
      name: "Priya Nair",
      location: "Kochi",
      initials: "PN",
      color: "from-amber-500 to-orange-600",
      rating: 5,
      comment: "Awesome collection of aesthetic room decor and gadget accessories. Paid via UPI and got fast tracking updates. Will definitely recommend sancart!",
    },
  ];

  return (
    <div>
      <div className="text-center max-w-xl mx-auto mb-10">
        <span className="inline-block px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-primary-600 bg-primary-500/10 rounded-lg mb-2">
          Customer Stories
        </span>
        <h2 className="text-2xl sm:text-4xl font-black text-gray-950 tracking-tight">
          Loved by Shoppers Across India
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-gray-500 font-semibold">
          Real feedback from verified buyers from Mumbai to Bengaluru
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reviews.map((rev, idx) => (
          <div
            key={idx}
            className="bg-white/45 backdrop-blur-md border border-white/60 p-6 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between text-start"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex gap-1">
                  {[...Array(rev.rating)].map((_, i) => (
                    <BsStarFill key={i} className="text-amber-400 text-sm" />
                  ))}
                </div>
                <span className="inline-flex items-center gap-1 text-[9px] font-extrabold text-emerald-700 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                  <BsCheckCircleFill className="text-[10px]" /> Verified Purchase
                </span>
              </div>
              <p className="text-gray-700 leading-relaxed text-xs sm:text-sm font-semibold">
                "{rev.comment}"
              </p>
            </div>

            <div className="flex items-center gap-3 mt-6 pt-5 border-t border-white/40">
              <div className={`w-10 h-10 rounded-full bg-gradient-to-tr ${rev.color} text-white font-black text-xs flex items-center justify-center shadow-md flex-shrink-0`}>
                {rev.initials}
              </div>
              <div>
                <h4 className="font-extrabold text-gray-950 text-sm leading-tight">{rev.name}</h4>
                <p className="text-[10px] font-bold text-gray-500 mt-0.5">{rev.location}, India</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Testimonials;
