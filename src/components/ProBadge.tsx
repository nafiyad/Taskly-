import React from 'react';
import { Zap } from 'lucide-react';

interface ProBadgeProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const ProBadge: React.FC<ProBadgeProps> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5',
    md: 'text-sm px-2 py-0.5',
    lg: 'text-base px-2.5 py-1'
  };
  
  return (
    <span className={`inline-flex items-center ${sizeClasses[size]} bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-medium ${className}`}>
      <Zap className={`${size === 'sm' ? 'h-3 w-3' : size === 'md' ? 'h-3.5 w-3.5' : 'h-4 w-4'} mr-0.5`} />
      PRO
    </span>
  );
};

export default ProBadge;