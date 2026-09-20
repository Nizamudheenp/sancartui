import React from 'react';

export const ProductSkeletonCard = ({ isHorizontal = false }) => {
  return (
    <div className={`flex flex-col justify-between overflow-hidden rounded-[2rem] border border-white/50 bg-white/20 backdrop-blur-md shadow-glass animate-pulse ${isHorizontal ? 'w-[200px] sm:w-[250px] flex-shrink-0 snap-start' : 'w-full'}`}>
      <div>
        {/* Skeleton Image */}
        <div className="w-full h-36 sm:h-52 bg-gray-200/60 rounded-t-[1.7rem] sm:rounded-t-[1.95rem]" />

        {/* Skeleton Details */}
        <div className="p-3 sm:p-4 text-start space-y-2">
          <div className="h-2.5 w-1/3 bg-gray-200/70 rounded-md" />
          <div className="h-4 w-4/5 bg-gray-200/80 rounded-md" />
          <div className="h-4 w-2/3 bg-gray-200/80 rounded-md" />
        </div>
      </div>

      {/* Skeleton Footer */}
      <div className="px-3 sm:px-4 pb-3 sm:pb-4 pt-2 border-t border-white/20 flex items-center justify-between gap-2">
        <div className="h-5 w-16 bg-gray-200/80 rounded-md" />
        <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-gray-200/80" />
      </div>
    </div>
  );
};

export const ProductSkeletonGrid = ({
  count = 8,
  horizontal = false,
  className = ""
}) => {
  const containerClass = horizontal
    ? "flex gap-3 sm:gap-6 overflow-x-auto pb-4 pt-2 scrollbar-none snap-x snap-mandatory"
    : className || "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 md:gap-8";

  return (
    <div className={containerClass}>
      {Array.from({ length: count }).map((_, idx) => (
        <ProductSkeletonCard key={idx} isHorizontal={horizontal} />
      ))}
    </div>
  );
};

export default ProductSkeletonCard;
