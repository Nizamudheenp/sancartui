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
    <section className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
            Loved by Parents Everywhere
          </h2>
          <p className="mt-3 text-lg text-gray-500">
            Here's what our happy community has to say about sancart.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((rev, idx) => (
            <div
              key={idx}
              className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between"
            >
              <div>
                <div className="flex gap-1 mb-4">
                  {[...Array(rev.rating)].map((_, i) => (
                    <BsStarFill key={i} className="text-amber-400 text-lg" />
                  ))}
                </div>
                <p className="text-gray-600 italic leading-relaxed">
                  "{rev.comment}"
                </p>
              </div>

              <div className="flex items-center gap-4 mt-6 pt-6 border-t border-gray-100">              
                  <h4 className="font-bold text-gray-900">{rev.name}</h4>
                  <p className="text-xs text-gray-400">{rev.role}</p>               
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
