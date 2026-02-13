import React from 'react';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'text',
  width,
  height,
  ...props
}) => {
  const baseClass = 'animate-pulse bg-slate-700/50';
  
  const variants = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg'
  };
  
  const style = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height
  };
  
  return (
    <div
      className={`${baseClass} ${variants[variant]} ${className}`}
      style={style}
      {...props}
    />
  );
};

export const SkeletonText: React.FC<{ lines?: number }> = ({ lines = 3 }) => (
  <div className="space-y-2">
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton key={i} variant="text" width="100%" height={16} />
    ))}
  </div>
);
