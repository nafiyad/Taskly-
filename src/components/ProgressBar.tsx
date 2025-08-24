import React from 'react';

interface ProgressBarProps {
  progress: number;
  color?: 'blue' | 'green' | 'purple' | 'yellow' | 'red';
  height?: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  progress, 
  color = 'blue',
  height = 2.5
}) => {
  // Ensure progress is between 0 and 100
  const safeProgress = Math.min(Math.max(progress, 0), 100);
  
  // Color classes
  const colorClasses = {
    blue: 'bg-blue-600 dark:bg-blue-500',
    green: 'bg-green-600 dark:bg-green-500',
    purple: 'bg-purple-600 dark:bg-purple-500',
    yellow: 'bg-yellow-600 dark:bg-yellow-500',
    red: 'bg-red-600 dark:bg-red-500'
  };

  return (
    <div className="w-full bg-gray-200 rounded-full dark:bg-gray-700" style={{ height: `${height}px` }}>
      <div 
        className={`${colorClasses[color]} rounded-full`} 
        style={{ width: `${safeProgress}%`, height: `${height}px` }}
        role="progressbar"
        aria-valuenow={safeProgress}
        aria-valuemin={0}
        aria-valuemax={100}
      ></div>
    </div>
  );
};

export default ProgressBar;