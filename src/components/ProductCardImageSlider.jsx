import React, { useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const ProductCardImageSlider = ({ images = [], alt = "Product Image", aspectRatio = "h-56" }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const imageList = Array.isArray(images) && images.length > 0 ? images : ["/placeholder.jpg"];

  const handleNext = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % imageList.length);
  };

  const handlePrev = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + imageList.length) % imageList.length);
  };

  const handleDotClick = (e, index) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex(index);
  };

  return (
    <div className={`w-full ${aspectRatio} relative overflow-hidden bg-gray-100/50 group/slider select-none`}>
      <img
        src={imageList[currentIndex]}
        alt={`${alt} - Image ${currentIndex + 1}`}
        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
        onError={(e) => {
          e.target.src = "/placeholder.jpg";
        }}
      />

      {/* Navigation Arrows for Multi-Image */}
      {imageList.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/80 backdrop-blur-md border border-white/60 text-gray-800 flex items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-opacity duration-200 shadow-md hover:bg-white z-20"
            title="Previous image"
          >
            <FiChevronLeft size={16} />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/80 backdrop-blur-md border border-white/60 text-gray-800 flex items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-opacity duration-200 shadow-md hover:bg-white z-20"
            title="Next image"
          >
            <FiChevronRight size={16} />
          </button>

          {/* Dot Indicators */}
          <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20 px-2 py-1 rounded-full bg-black/20 backdrop-blur-md">
            {imageList.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => handleDotClick(e, idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  currentIndex === idx ? "w-4 bg-white" : "w-1.5 bg-white/60 hover:bg-white"
                }`}
                title={`Go to image ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ProductCardImageSlider;
