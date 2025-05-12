import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

/**
 * Skeleton loader for producer cards while data is being fetched
 */
const ProducerCardSkeleton = ({ count = 1 }) => {
  const SkeletonCard = () => (
    <div className="overflow-hidden border border-gray-200 shadow-sm bg-white rounded-lg p-4">
      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-1">
          <Skeleton height={200} className="w-full" />
        </div>
        <div className="md:col-span-2">
          <Skeleton width={180} height={28} className="mb-2" />
          <Skeleton width={140} height={20} className="mb-4" />
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Skeleton width={80} height={16} className="mb-2" />
              <div className="flex gap-1">
                <Skeleton width={60} height={24} />
                <Skeleton width={60} height={24} />
              </div>
            </div>
            <div>
              <Skeleton width={80} height={16} className="mb-2" />
              <div className="flex gap-1">
                <Skeleton width={60} height={24} />
                <Skeleton width={60} height={24} />
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-4 mt-4">
            <Skeleton width={100} height={20} />
            <Skeleton width={80} height={20} />
            <div className="flex-grow md:text-right">
              <Skeleton width={70} height={16} className="ml-auto" />
            </div>
          </div>
          
          <div className="mt-4 flex flex-wrap gap-2">
            <Skeleton width={120} height={40} />
            <Skeleton width={120} height={40} />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {Array(count).fill(0).map((_, idx) => (
        <SkeletonCard key={idx} />
      ))}
    </div>
  );
};

export default ProducerCardSkeleton;
