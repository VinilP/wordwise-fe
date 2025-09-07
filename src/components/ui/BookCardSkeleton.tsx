import React from 'react';

interface BookCardSkeletonProps {
  className?: string;
}

export const BookCardSkeleton: React.FC<BookCardSkeletonProps> = ({ className = '' }) => {
  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden w-full ${className}`}>
      {/* Image skeleton */}
      <div className="aspect-[3/4] bg-gray-200 animate-pulse">
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
        </div>
      </div>
      
      {/* Content skeleton */}
      <div className="p-4">
        {/* Title skeleton */}
        <div className="h-5 bg-gray-200 rounded mb-2 animate-pulse"></div>
        
        {/* Author skeleton */}
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-3 animate-pulse"></div>
        
        {/* Rating skeleton */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex space-x-1">
            <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="w-8 h-4 bg-gray-200 rounded animate-pulse"></div>
        </div>
        
        {/* Genres skeleton */}
        <div className="flex space-x-1 mb-3">
          <div className="w-16 h-6 bg-gray-200 rounded-full animate-pulse"></div>
          <div className="w-20 h-6 bg-gray-200 rounded-full animate-pulse"></div>
        </div>
        
        {/* Favorite button skeleton */}
        <div className="flex justify-end">
          <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};
